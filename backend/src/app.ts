import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientRoutes from './routes/client.routes';
import estimateRoutes from './routes/estimate.routes';
import userRoutes from './routes/user.route';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/clients', clientRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/users', userRoutes);
export default app;
