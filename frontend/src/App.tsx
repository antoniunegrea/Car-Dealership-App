import React, { useEffect, useState } from 'react';
import { Routes, Route,BrowserRouter } from "react-router-dom";
import Index from './pages/Index'
import AddCarPage from './pages/AddCarPage';
import './App.css';
import Car from './model/Car';
import EditCarPage from './pages/EditCarPage';
import CarService from './service/carService'
import { SortField, SortOrder } from './model/Types';
import Charts from './pages/Charts';
import FileManagerPage from './pages/FileManagerPage';

function App() {
  const [cars, setCars] = useState<Car[]>([]);

  const [sortField, setSortField] = useState<SortField>('manufacturer');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [searchTerm, setSearchTerm] = useState('');

  const [isServerOnline, setIsServerOnline] = useState<boolean>(true);
  
  const carService = new CarService("http://localhost:3000/api/cars"); 

  const [ws, setWs] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 100;  // You can increase this limit
    const reconnectInterval = 3000;   // 5 seconds

    const connectWebSocket = () => {
        console.log('Attempting to connect to WebSocket...');
        const websocket = new WebSocket('ws://localhost:3000');
        setWs(websocket);

        websocket.onopen = () => {
            console.log('WebSocket connected');
            reconnectAttempts = 0; // Reset attempts on successful connection
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

// Fetch cars via HTTP (initial load or fallback)
useEffect(() => {
    if (isServerOnline && !ws) {
        // Fallback to HTTP if WebSocket isn't connected
        console.log("getCars");
        carService.get({ searchTerm, sortBy: sortField, order: sortOrder })
            .then((data) => setCars(data))
            .catch((error) => console.error('Failed to load cars:', error));
    }
}, [searchTerm, sortField, sortOrder, isServerOnline, ws]);

useEffect(() => {
    const checkServerStatus = async () => {
        const online = await carService.isServerOnline();
        setIsServerOnline(online);
    };
    checkServerStatus();
    const intervalId = setInterval(checkServerStatus, 4000);
    return () => clearInterval(intervalId);
}, []);
  
/*useEffect(() => {
    carService.get({searchTerm: searchTerm, sortBy: sortField, order: sortOrder })
        .then((cars) => setCars(cars))
        .catch((error) => console.error('Failed to load sorted cars:', error));
  }, [searchTerm, sortField, sortOrder]);
*/
  const  handleAddCar = async (newCar: Omit<Car, 'id'>) => {
    try {
      const addedCar = await carService.add(newCar);
      setCars((prev) => [...prev, addedCar]);
      window.alert('Car added successfully!');
    } catch (error) {
      console.error('Failed to add car:', error);
      window.alert('Failed to add car. Please try again.'+ error)
    }
  };

  const handleEdit = async (car: Car) => {
    try {
        const updatedCar = await carService.update(car.id, car);
        setCars((prev) => prev.map((c) => (c.id === car.id ? updatedCar : c)));
        window.alert('Car edited successfully!');
    } catch (error) {
        console.error('Failed to edit car:', error);
        window.alert('Failed to edit car. Please try again.'+ error)
    }
};

const handleDelete = async (id: number) => {
    try {
        await carService.delete(id);
        setCars((prev) => prev.filter((c) => c.id !== id));
        window.alert('Car deleted successfully!');
    } catch (error) {
        console.error('Failed to delete car:', error);
        window.alert('Failed to delete car. Please try again.'+ error)
    }
};

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index cars={cars} handleDelete={handleDelete} 
                                        sortField={sortField}
                                        setSortField={setSortField}
                                        sortOrder={sortOrder}
                                        setSortOrder={setSortOrder}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm} 
                                        isServerOnline={isServerOnline}
                                        />}></Route>
        <Route path='/add' element={<AddCarPage onAddCar={handleAddCar}/>}></Route>
        <Route path="/edit/:id" element={<EditCarPage cars={cars} onEditCar={handleEdit} />} />
        <Route path="/charts" element={<Charts cars={cars}/>} />
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
