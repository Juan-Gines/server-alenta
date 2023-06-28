import userRouter from '#Routes/userRoutes.js';
import express from 'express';
import cors from 'cors';

const expressApp = express();

// Middlewares
expressApp.use(express.json());
expressApp.use(cors())

// Routes
expressApp.use('/users', userRouter);

export default expressApp;