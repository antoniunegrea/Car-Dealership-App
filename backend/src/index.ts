import express from 'express';
import carRoutes from './routes/carRoutes';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { cars } from './routes/carRoutes';
import Car from './model/car';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json()); // parse JSON

app.use('/api/cars', carRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });


// WebSocket connection handling
// In your WebSocket server setup
wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
  
    // Send current cars list to newly connected client
    ws.send(JSON.stringify({ type: 'initial', data: cars }));

    // Set an interval to send a ping message every 30 seconds
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000); // Ping every 30 seconds

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
        clearInterval(pingInterval);  // Clear the ping interval when client disconnects
    });

    ws.on('pong', () => {
        console.log('Received pong from client');  // Optional: Log pong response
    });
});


// Function to generate a random car
const manufacturers = ['Honda', 'Chevrolet', 'Hyundai', 'Kia', 'Mazda'];
const models = ['Civic', 'Malibu', 'Tucson', 'Sportage', 'CX-5'];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomCar = (id: number): Car => ({
    id,
    manufacturer: manufacturers[getRandomInt(0, manufacturers.length - 1)],
    model: models[getRandomInt(0, models.length - 1)],
    year: getRandomInt(2018, 2024),
    price: getRandomInt(15000, 60000),
    image_url: `https://example.com/images/${id}.jpg`,
});

// Start generating new cars every 5 seconds
let nextId = cars.length > 0 ? Math.max(...cars.map(car => car.id)) + 1 : 1;
setInterval(() => {
    const newCar = generateRandomCar(nextId++);
    cars.push(newCar);
    console.log('Generated new car:', newCar);

    // Broadcast the new car to all connected clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'newCar', data: newCar }));
        }
    });
}, 3000);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
