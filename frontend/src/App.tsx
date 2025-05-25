import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Index from './pages/Index';
import AddCarPage from './pages/AddCarPage';
import EditCarPage from './pages/EditCarPage';
import Charts from './pages/Charts';
import FileManagerPage from './pages/FileManagerPage';
import Car from './model/Car';
import CarService from './service/CarService';
import ServerService from './service/ServerService';
import DealershipService from './service/DealershipService';
import { QueuedOperation, SortField, SortOrder } from './model/Types';
import Dealerships from './pages/Dealerships';
import Dealership from './model/Dealership';
import './App.css';
import EditDealershipPage from './pages/EditDealershipPage';
import AddDealershipPage from './pages/AddDealershipPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminMonitoredUsers from './pages/AdminMonitoredUsers';
import useDebounce from './hooks/useDebounce';
import AdminService from './service/AdminService';
import { AuthService } from './service/AuthService';
import { FileService } from './service/FileService';
import ServiceProvider from './service/ServiceProvider';
import { SessionService } from './service/SessionService';
import { OperationType } from './model/Types';


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
    const [queuedOperations, setQueuedOperations] = useState<QueuedOperation[]>(() => {
        // Load queued operations from localStorage on mount
        const saved = localStorage.getItem('queuedOperations');
        return saved ? JSON.parse(saved) : [];
    });
    const [auth, setAuth] = useState<{ token: string | null, user: any | null }>({
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
    });

    const serviceProvider = ServiceProvider.getInstance();
    const authService = serviceProvider.getService<AuthService>('auth');
    const carService = serviceProvider.getService<CarService>('car');
    const dealershipService = serviceProvider.getService<DealershipService>('dealership');
    const adminService = serviceProvider.getService<AdminService>('admin');
    const serverService = serviceProvider.getService<ServerService>('server');
    const fileService = serviceProvider.getService<FileService>('file');
    const sessionService = serviceProvider.getService<SessionService>('session');

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
                    setDealerships(data);
                })
                .catch((error) => console.error('Failed to load initial dealerships:', error));
        }
    }, [isServerOnline, carService, dealershipService]); // Only run on mount and when services change

    // Update data when search terms or sorting changes
    useEffect(() => {
        if (isServerOnline) {
            // Fetch cars data - removed the empty check to allow refreshing on empty search
            carService.get({ 
                searchTerm: debouncedSearchTermCars, 
                sortBy: sortFieldCars, 
                order: sortOrderCars, 
                selectedDealershipId: selectedDealershipId ?? undefined 
            })
                .then((data) => {
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
                if (operation.type === 'addCar') {
                    const newCar = operation.data as Omit<Car, 'id'>;
                    const addedCar = await carService.add(newCar, auth.token ?? '');
                    setCars((prev) => [...prev.filter(c => c.id !== (newCar as any).tempId), addedCar]);
                } else if (operation.type === 'updateCar') {
                    const car = operation.data as Car;
                    const updatedCar = await carService.update(car.id, car, auth.token ?? '');
                    setCars((prev) => prev.map(c => c.id === car.id ? updatedCar : c));
                } else if (operation.type === 'deleteCar') {
                    const id = operation.data as number;
                    await carService.delete(id, auth.token ?? '');
                    setCars((prev) => prev.filter(c => c.id !== id));
                } else if (operation.type === 'addDealership') {
                    const newDealership = operation.data as Omit<Dealership, 'id' | 'cars'>;
                    const addedDealership = await dealershipService.add(newDealership, auth.token ?? '');
                    setDealerships((prev) => [...prev, addedDealership]);
                } else if (operation.type === 'updateDealership') {
                    const dealership = operation.data as Dealership;
                    const updatedDealership = await dealershipService.update(dealership.id, dealership, auth.token ?? '');
                    setDealerships((prev) => prev.map(d => d.id === dealership.id ? updatedDealership : d));
                } else if (operation.type === 'deleteDealership') {
                    const id = operation.data as number;
                    await dealershipService.delete(id, auth.token ?? '');
                    setDealerships((prev) => prev.filter(d => d.id !== id));
                }
            } catch (error) {
                return;
            }
        }
        setQueuedOperations([]);
        localStorage.removeItem('queuedOperations');
    }, [queuedOperations, carService, dealershipService]);

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
                { type: 'addCar', data: newCar, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Car addition queued and will sync when the server is back online.');
            return;
        }

        try {
            await carService.add(newCar, auth.token ?? '');
            //refresh the cars
            carService.get({ searchTerm: searchTermCars, sortBy: sortFieldCars, order: sortOrderCars, selectedDealershipId: selectedDealershipId ?? undefined })
                .then((data) => {
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
                { type: 'updateCar', data: car, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Car update queued and will sync when the server is back online.');
            return;
        }

        try {
            await carService.update(car.id, car, auth.token ?? '');
            //setCars((prev) => prev.map((c) => (c.id === car.id ? updatedCar : c)));
            //refresh the cars
            carService.get({ searchTerm: searchTermCars, sortBy: sortFieldCars, order: sortOrderCars, selectedDealershipId: selectedDealershipId ?? undefined })
                .then((data) => {
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
                { type: 'deleteCar', data: id, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Car deletion queued and will sync when the server is back online.');
            return;
        }

        try {
            await carService.delete(id, auth.token ?? '');
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
            setDealerships((prev) => prev.filter((d) => d.id !== id));
            setQueuedOperations((prev) => [
                ...prev,
                { type: 'deleteDealership', data: id, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Dealership deletion queued and will sync when the server is back online.');
            return;
        }

        try {
            await dealershipService.delete(id, auth.token ?? '');
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
            const tempId = 0;
            const dealershipWithTempId = { ...newDealership, id: tempId } as Dealership;
            setDealerships((prev) => [...prev, dealershipWithTempId]);
            setQueuedOperations((prev) => [
                ...prev,
                { type: 'addDealership', data: newDealership, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Dealership addition queued and will sync when the server is back online.');
            return;
        }

        try {
            const addedDealership = await dealershipService.add(newDealership, auth.token ?? '');
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
            setDealerships((prev) => prev.map(d => d.id === dealership.id ? dealership : d));
            setQueuedOperations((prev) => [
                ...prev,
                { type: 'updateDealership', data: dealership, timestamp: Date.now() }
            ]);
            window.alert('Server is offline. Dealership update queued and will sync when the server is back online.');
            return;
        }

        try {
            const updatedDealership = await dealershipService.update(dealership.id, dealership, auth.token ?? '');
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
            <div className="App">
                <div className="user-info-container">
                    {auth.user ? (
                        <div className="user-info">
                            <span>
                                <span className="username">{auth.user.username}</span>
                                <span className="role">{auth.user.role}</span>
                            </span>
                            <button className="logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <span className="not-logged-in">Not logged in</span>
                    )}
                </div>

                <Routes>
                    <Route path="/" element={<LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService} />} />
                    <Route path="/register" element={<RegisterPage authService={authService} />} />
                    <Route
                        path="/admin/monitored-users"
                        element={
                            auth.token && auth.user && auth.user.role === 'admin' ? (
                                <AdminMonitoredUsers adminService={adminService} />
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
                                    carService={carService}
                                />
                            ) : (
                                <LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService} />
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
                                <LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService} />
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
                                <LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService}/>
                            )
                        }
                    />
                    <Route
                        path="/charts"
                        element={
                            auth.token ? (
                                <Charts cars={cars} dealerships={dealerships} />
                            ) : (
                                <LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService}/>
                            )
                        }
                    />
                    <Route
                        path="/files"
                        element={
                            auth.token ? (
                                <FileManagerPage fileService={fileService} />
                            ) : (
                                <LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService}/>
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
                                <LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService}/>
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
                                <LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService}/>
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
                                <LoginPage onLogin={handleLogin} authService={authService} sessionService={sessionService}/>
                            )
                        }
                    />
                    <Route
                        path="*"
                        element={<div style={{ padding: 20 }}>404 - Page Not Found</div>}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;