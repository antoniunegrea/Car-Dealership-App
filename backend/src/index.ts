import express from 'express';
import carRoutes from './routes/carRoutes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());          // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies
app.use('/api/cars', carRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});