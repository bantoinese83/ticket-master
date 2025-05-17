import express from 'express';
import mongoose from 'mongoose';
import ticketTypesRouter from './routes/ticketTypes';
import ticketsRouter from './routes/tickets';
import { errorHandler } from './src/middlewares/errorHandler';
import { requestLogger } from './src/middlewares/requestLogger';

const app = express();

app.use(express.json());
app.use(requestLogger);

// Register routes
app.use('/api/ticket-types', ticketTypesRouter);
app.use('/api/tickets', ticketsRouter);
app.use(errorHandler);

export default app; 