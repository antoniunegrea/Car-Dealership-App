import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { cars } from '../routes/carRoutes';
import express from 'express';
import generateRandomCar from '../utils/carGenerator';

const runDaemonThread = (app: Express.Application) =>{
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected to WebSocket');
        ws.send(JSON.stringify({ type: 'initial', data: cars }));
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.ping();
            }
        }, 30000); // Ping every 30 seconds

        ws.on('close', () => {
            console.log('Client disconnected from WebSocket');
            clearInterval(pingInterval);
        });

        ws.on('pong', () => {
            console.log('Received pong from client');
        });
    });

    let nextId = cars.length > 0 ? Math.max(...cars.map(car => car.id)) + 1 : 1;
    setInterval(() => {
        const newCar = generateRandomCar(nextId++);
        cars.push(newCar);
        console.log('Generated new car:', newCar);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'newCar', data: newCar }));
            }
        }); 
    }, 3000);
}

export default runDaemonThread;