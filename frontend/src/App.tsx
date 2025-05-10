import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Index from './pages/Index';
import AddCarPage from './pages/AddCarPage';
import EditCarPage from './pages/EditCarPage';
import Charts from './pages/Charts';
import FileManagerPage from './pages/FileManagerPage';
import Car from './model/Car';
import CarService from './service/carService';
import ServerService from './service/serverService'
import DealershipService from './service/dealershipService';
import { SortField, SortOrder } from './model/Types';
import './App.css';

type OperationType = 'add' | 'update' | 'delete';

interface QueuedOperation {
    type: OperationType;
    data: Omit<Car, 'id'> | Car | number;
    timestamp: number;
}

function App() {
    const [cars, setCars] = useState<Car[]>([]);
    const [sortField, setSortField] = useState<SortField>('manufacturer');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [isServerOnline, setIsServerOnline] = useState<boolean>(true);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [queuedOperations, setQueuedOperations] = useState<QueuedOperation[]>(() => {
        // Load queued operations from localStorage on mount
        const saved = localStorage.getItem('queuedOperations');
        return saved ? JSON.parse(saved) : [];
    });

    const serverService = new ServerService("http://localhost:3000/api");
    const dealershipService = new DealershipService("http://localhost:3000/api/dealerships");
    const carService = new CarService("http://localhost:3000/api/cars");

    // Save queued operations to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('queuedOperations', JSON.stringify(queuedOperations));
    }, [queuedOperations]);

    // Initialize WebSocket connection
    useEffect(() => {
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 100;
        const reconnectInterval = 3000;

        const connectWebSocket = () => {
            console.log('Attempting to connect to WebSocket...');
            const websocket = new WebSocket('ws://localhost:3000/api');
            setWs(websocket);

            websocket.onopen = () => {
                console.log('WebSocket connected');
                reconnectAttempts = 0;
            };

            websocket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'initial') {
                    setCars(message.data);
                } else if (message.type === 'newCar') {
                    setCars((prev) => [...prev, message.data]);
                }
            };

            websocket.onclose = () => {
                console.log('WebSocket disconnected');
                setWs(null);
                if (reconnectAttempts < maxReconnectAttempts) {
                    console.log(`Reconnecting in ${reconnectInterval / 1000} seconds... (${reconnectAttempts + 1}/${maxReconnectAttempts})`);
                    setTimeout(connectWebSocket, reconnectInterval);
                    reconnectAttempts++;
                } else {
                    console.error('Max reconnection attempts reached. Please check the server.');
                }
            };

            websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connectWebSocket();

        return () => {
            ws?.close();
        };
    }, []);

    // Check server status and sync queued operations when online
    useEffect(() => {
        const checkServerStatus = async () => {
            const online = await serverService.isServerOnline();
            if (online && !isServerOnline && queuedOperations.length > 0) {
                // Server just came online, sync queued operations
                await syncQueuedOperations();
            }
            setIsServerOnline(online);
        };
        checkServerStatus();
        const intervalId = setInterval(checkServerStatus, 4000);
        return () => clearInterval(intervalId);
    }, [isServerOnline, queuedOperations]);

    // Add a wrapper for setSearchTerm to log changes
    const handleSearchTermChange = (newSearchTerm: string) => {
        console.log("Search term changing to:", newSearchTerm);
        setSearchTerm(newSearchTerm);
    };

    // Fetch cars via HTTP (initial load or fallback)
    useEffect(() => {
        console.log("Effect triggered with searchTerm:", searchTerm);
        if (isServerOnline) {
            console.log("Server is online, making request");
            carService.get({ searchTerm, sortBy: sortField, order: sortOrder })
                .then((data) => {
                    console.log("Received cars data:", data);
                    setCars(data);
                })
                .catch((error) => console.error('Failed to load cars:', error));
        }
    }, [searchTerm, sortField, sortOrder, isServerOnline]);

    // Sync queued operations with the server
    const syncQueuedOperations = async () => {
        const operations = [...queuedOperations].sort((a, b) => a.timestamp - b.timestamp);
        for (const operation of operations) {
            try {
                if (operation.type === 'add') {
                    const newCar = operation.data as Omit<Car, 'id'>;
                    const addedCar = await carService.add(newCar);
                    setCars((prev) => [...prev.filter(c => c.id !== (newCar as any).tempId), addedCar]);
                } else if (operation.type === 'update') {
                    const car = operation.data as Car;
                    const updatedCar = await carService.update(car.id, car);
                    setCars((prev) => prev.map(c => c.id === car.id ? updatedCar : c));
                } else if (operation.type === 'delete') {
                    const id = operation.data as number;
                    await carService.delete(id);
                    setCars((prev) => prev.filter(c => c.id !== id));
                }
            } catch (error) {
                console.error(`Failed to sync ${operation.type} operation:`, error);
                // If sync fails, keep the operation in the queue
                return;
            }
        }
        // Clear the queue after successful sync
        setQueuedOperations([]);
        localStorage.removeItem('queuedOperations');
    };

    const handleAddCar = async (newCar: Omit<Car, 'id'>) => {
        if (!isServerOnline) {
            // Server is offline, queue the operation
            const tempId = 0;
            const carWithTempId = { ...newCar, id: tempId } as Car;
            setCars((prev) => [...prev, carWithTempId]);
            setQueuedOperations((prev) => [
                ...prev,
                { type: 'add', data: newCar, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Car addition queued and will sync when the server is back online.');
            return;
        }

        try {
            const addedCar = await carService.add(newCar);
            setCars((prev) => [...prev, addedCar]);
            window.alert('Car added successfully!');
        } catch (error) {
            console.error('Failed to add car:', error);
            window.alert('Failed to add car. Please try again.' + error);
        }
    };

    const handleEdit = async (car: Car) => {
        if (!isServerOnline) {
            // Server is offline, queue the operation
            setCars((prev) => prev.map(c => c.id === car.id ? car : c));
            setQueuedOperations((prev) => [
                ...prev,
                { type: 'update', data: car, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Car update queued and will sync when the server is back online.');
            return;
        }

        try {
            const updatedCar = await carService.update(car.id, car);
            setCars((prev) => prev.map((c) => (c.id === car.id ? updatedCar : c)));
            window.alert('Car edited successfully!');
        } catch (error) {
            console.error('Failed to edit car:', error);
            window.alert('Failed to edit car. Please try again.' + error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!isServerOnline) {
            // Server is offline, queue the operation
            setCars((prev) => prev.filter(c => c.id !== id));
            setQueuedOperations((prev) => [
                ...prev,
                { type: 'delete', data: id, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Car deletion queued and will sync when the server is back online.');
            return;
        }

        try {
            await carService.delete(id);
            setCars((prev) => prev.filter((c) => c.id !== id));
            window.alert('Car deleted successfully!');
        } catch (error) {
            console.error('Failed to delete car:', error);
            window.alert('Failed to delete car. Please try again.' + error);
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path='/'
                    element={
                        <Index
                            cars={cars}
                            handleDelete={handleDelete}
                            sortField={sortField}
                            setSortField={setSortField}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                            searchTerm={searchTerm}
                            setSearchTerm={handleSearchTermChange}
                            isServerOnline={isServerOnline}
                        />
                    }
                />
                <Route path='/add' element={<AddCarPage onAddCar={handleAddCar} dealershipService={dealershipService}/>} />
                <Route path="/edit/:id" element={<EditCarPage cars={cars} onEditCar={handleEdit} dealershipService={dealershipService}/>} />
                <Route path="/charts" element={<Charts cars={cars} />} />
                <Route path="/files" element={<FileManagerPage />} />
                <Route
                    path="*"
                    element={<div style={{ padding: 20 }}>404 - Page Not Found</div>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;