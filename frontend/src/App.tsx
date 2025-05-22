import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
import Dealerships from './pages/Dealerships';
import Dealership from './model/Dealership';
import './App.css';
import EditDealershipPage from './pages/EditDealershipPage';
import AddDealershipPage from './pages/AddDealershipPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminMonitoredUsers from './pages/AdminMonitoredUsers';
import useDebounce from './hooks/useDebounce';
type OperationType = 'add' | 'update' | 'delete';

interface QueuedOperation {
    type: OperationType;
    data: Omit<Car, 'id'> | Car | number;
    timestamp: number;
}

function App() {
    const [cars, setCars] = useState<Car[]>([]);
    const [dealerships, setDealerships] = useState<Dealership[]>([]);
    const [sortFieldCars, setSortFieldCars] = useState<SortField>('manufacturer');
    const [sortFieldDealerships, setSortFieldDealerships] = useState<SortField>('name');
    const [sortOrderCars, setSortOrderCars] = useState<SortOrder>('asc');
    const [sortOrderDealerships, setSortOrderDealerships] = useState<SortOrder>('asc');
    const [searchTermCars, setSearchTermCars] = useState('');
    const [searchTermDealerships, setSearchTermDealerships] = useState('');
    const [selectedDealershipId, setSelectedDealershipId] = useState<number | null>(null);
    const [isServerOnline, setIsServerOnline] = useState<boolean>(true);
    const wsRef = useRef<WebSocket | null>(null);
    const [queuedOperations, setQueuedOperations] = useState<QueuedOperation[]>(() => {
        // Load queued operations from localStorage on mount
        const saved = localStorage.getItem('queuedOperations');
        return saved ? JSON.parse(saved) : [];
    });
    const [auth, setAuth] = useState<{ token: string | null, user: any | null }>({
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
    });

    /*const serverService = new ServerService("http://localhost:3000/api");
    const dealershipService = new DealershipService("http://localhost:3000/api/dealerships");
    const carService = new CarService("http://localhost:3000/api/cars");
    */
    const serverService = useMemo(() => new ServerService("https://car-dealership-app-production.up.railway.app/api"), []);
    const dealershipService = useMemo(() => new DealershipService("https://car-dealership-app-production.up.railway.app/api/dealerships"), []);
    const carService = useMemo(() => new CarService("https://car-dealership-app-production.up.railway.app/api/cars"), []);
   

    // Save queued operations to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('queuedOperations', JSON.stringify(queuedOperations));
    }, [queuedOperations]);

    // Comment out WebSocket connection to reduce memory usage
    /*
    useEffect(() => {
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        const reconnectInterval = 60000;

        const connectWebSocket = () => {
            console.log('Attempting to connect to WebSocket...');
            const websocket = new WebSocket('ws://car-dealership-app-production.up.railway.app/api');
            wsRef.current = websocket;

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
                wsRef.current = null;
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
            wsRef.current?.close();
        };
    }, []);
    */

    // Add debounced search terms
    const debouncedSearchTermCars = useDebounce(searchTermCars, 500);
    const debouncedSearchTermDealerships = useDebounce(searchTermDealerships, 500);

    // Load initial data when component mounts
    useEffect(() => {
        if (isServerOnline) {
            // Load initial cars data
            carService.get({ 
                searchTerm: '', 
                sortBy: sortFieldCars, 
                order: sortOrderCars, 
                selectedDealershipId: selectedDealershipId ?? undefined 
            })
                .then((data) => {
                    console.log("Received initial cars data:", data);
                    setCars(data);
                })
                .catch((error) => console.error('Failed to load initial cars:', error));

            // Load initial dealerships data
            dealershipService.getAll({ 
                searchTerm: '', 
                sortBy: sortFieldDealerships, 
                order: sortOrderDealerships
            })
                .then((data) => {
                    console.log("Received initial dealerships data:", data);
                    setDealerships(data);
                })
                .catch((error) => console.error('Failed to load initial dealerships:', error));
        }
    }, [isServerOnline, carService, dealershipService]); // Only run on mount and when services change

    // Update data when search terms or sorting changes
    useEffect(() => {
        console.log("Effect triggered with searchTerm:", debouncedSearchTermCars);
        if (isServerOnline) {
            console.log("Server is online, making request");
            // Fetch cars data - removed the empty check to allow refreshing on empty search
            carService.get({ 
                searchTerm: debouncedSearchTermCars, 
                sortBy: sortFieldCars, 
                order: sortOrderCars, 
                selectedDealershipId: selectedDealershipId ?? undefined 
            })
                .then((data) => {
                    console.log("Received cars data:", data);
                    setCars(data);
                })
                .catch((error) => console.error('Failed to load cars:', error));
            
            // Fetch dealerships data - removed the empty check to allow refreshing on empty search
            dealershipService.getAll({ 
                searchTerm: debouncedSearchTermDealerships, 
                sortBy: sortFieldDealerships, 
                order: sortOrderDealerships
            })
                .then((data) => {
                    console.log("Received dealerships data:", data);
                    setDealerships(data);
                })
                .catch((error) => console.error('Failed to load dealerships:', error));
        }
    }, [
        debouncedSearchTermCars, 
        debouncedSearchTermDealerships, 
        sortFieldCars, 
        sortOrderCars, 
        sortFieldDealerships, 
        sortOrderDealerships, 
        isServerOnline, 
        selectedDealershipId, 
        carService, 
        dealershipService
    ]);

    // Sync queued operations with the server
    const syncQueuedOperations = useCallback(async () => {
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
                return;
            }
        }
        setQueuedOperations([]);
        localStorage.removeItem('queuedOperations');
    }, [queuedOperations, carService]);

    useEffect(() => {
        const checkServerStatus = async () => {
            const online = await serverService.isServerOnline();
            if (online && !isServerOnline && queuedOperations.length > 0) {
                await syncQueuedOperations();
            }
            setIsServerOnline(online);
        };
        checkServerStatus();
        const intervalId = setInterval(checkServerStatus, 30000);
        return () => clearInterval(intervalId);
    }, [isServerOnline, queuedOperations, serverService, syncQueuedOperations]);

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
            await carService.add(newCar);
            //refresh the cars
            carService.get({ searchTerm: searchTermCars, sortBy: sortFieldCars, order: sortOrderCars, selectedDealershipId: selectedDealershipId ?? undefined })
                .then((data) => {
                    console.log("Received cars data:", data);
                    setCars(data);
                })
                .catch((error) => console.error('Failed to load cars:', error));
            window.alert('Car added successfully!');
        } catch (error) {
            console.error('Failed to add car:', error);
            window.alert('Failed to add car. Please try again.' + error);
        }
    };

    const handleEditCar = async (car: Car) => {
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
            await carService.update(car.id, car);
            //setCars((prev) => prev.map((c) => (c.id === car.id ? updatedCar : c)));
            //refresh the cars
            carService.get({ searchTerm: searchTermCars, sortBy: sortFieldCars, order: sortOrderCars, selectedDealershipId: selectedDealershipId ?? undefined })
                .then((data) => {
                    console.log("Received cars data:", data);
                    setCars(data);
                })
                .catch((error) => console.error('Failed to load cars:', error));
            window.alert('Car edited successfully!');
        } catch (error) {
            console.error('Failed to edit car:', error);
            window.alert('Failed to edit car. Please try again.' + error);
        }
    };

    const handleDeleteCar = async (id: number) => {
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

    const handleDeleteDealership = async (id: number) => {
        if (!isServerOnline) {
            // Server is offline, queue the operation
            // TODO: Implement
            return;
        }

        try {
            await dealershipService.delete(id);
            setDealerships((prev) => prev.filter((d) => d.id !== id));
            window.alert('Dealership deleted successfully!');
        } catch (error) {
            console.error('Failed to delete dealership:', error);
            window.alert('Failed to delete dealership. Please try again.' + error);
        }
    }

    const handleAddDealership = async (newDealership: Omit<Dealership, 'id' | 'cars'>) => {
        if (!isServerOnline) {
            // Server is offline, queue the operation
            // TODO: Implement
            return;
        }

        try {
            const addedDealership = await dealershipService.add(newDealership);
            setDealerships((prev) => [...prev, addedDealership]);
            window.alert('Dealership added successfully!');
        } catch (error) {
            console.error('Failed to add dealership:', error);
            window.alert('Failed to add dealership. Please try again.' + error);
        }
    }

    const handleEditDealership = async (dealership: Dealership) => {
        if (!isServerOnline) {
            // Server is offline, queue the operation
            // TODO: Implement
            return;
        }

        try {
            const updatedDealership = await dealershipService.update(dealership.id, dealership);
            setDealerships((prev) => prev.map((d) => (d.id === dealership.id ? updatedDealership : d)));
            window.alert('Dealership edited successfully!');
        } catch (error) {
            console.error('Failed to edit dealership:', error);
            window.alert('Failed to edit dealership. Please try again.' + error);
        }
    }

    const handleLogin = (token: string, user: any) => {
        setAuth({ token, user });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const handleLogout = () => {
        setAuth({ token: null, user: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <BrowserRouter>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10 }}>
                {auth.user ? (
                    <>
                        <span style={{ marginRight: 10 }}>Logged in as: {auth.user.username} ({auth.user.role})</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <span style={{ color: '#888' }}>Not logged in</span>
                )}
            </div>
            <Routes>
                <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/admin/monitored-users"
                    element={
                        auth.token && auth.user && auth.user.role === 'admin' ? (
                            <AdminMonitoredUsers />
                        ) : (
                            <div style={{ padding: 20 }}>Access denied. Admins only.</div>
                        )
                    }
                />
                <Route
                    path="/cars"
                    element={
                        auth.token ? (
                            <Index
                                cars={cars}
                                handleDelete={handleDeleteCar}
                                sortField={sortFieldCars}
                                setSortField={setSortFieldCars}
                                sortOrder={sortOrderCars}
                                setSortOrder={setSortOrderCars}
                                searchTerm={searchTermCars}
                                setSearchTerm={setSearchTermCars}
                                isServerOnline={isServerOnline}
                            />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/cars/add"
                    element={
                        auth.token ? (
                            <AddCarPage
                                onAddCar={handleAddCar}
                                dealershipService={dealershipService}
                            />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/cars/edit/:id"
                    element={
                        auth.token ? (
                            <EditCarPage
                                cars={cars}
                                onEditCar={handleEditCar}
                                dealershipService={dealershipService}
                            />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/charts"
                    element={
                        auth.token ? (
                            <Charts cars={cars} dealerships={dealerships} />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/files"
                    element={
                        auth.token ? (
                            <FileManagerPage />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/dealerships"
                    element={
                        auth.token ? (
                            <Dealerships
                                dealerships={dealerships}
                                handleDelete={handleDeleteDealership}
                                sortField={sortFieldDealerships}
                                setSortField={setSortFieldDealerships}
                                sortOrder={sortOrderDealerships}
                                setSortOrder={setSortOrderDealerships}
                                searchTerm={searchTermDealerships}
                                setSearchTerm={setSearchTermDealerships}
                                isServerOnline={isServerOnline}
                                selectedDealershipId={selectedDealershipId}
                                setSelectedDealershipId={setSelectedDealershipId}
                            />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/dealerships/add"
                    element={
                        auth.token ? (
                            <AddDealershipPage
                                onAddDealership={handleAddDealership}
                            />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/dealerships/edit/:id"
                    element={
                        auth.token ? (
                            <EditDealershipPage
                                dealerships={dealerships}
                                onEditDealership={handleEditDealership}
                            />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="*"
                    element={<div style={{ padding: 20 }}>404 - Page Not Found</div>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;