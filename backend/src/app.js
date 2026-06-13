import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Standard CORS configuration
app.use(cors({
  origin: '*', // Open in dev mode, can be narrowed down to frontend URL in prod
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'Qobo Knowledge Assistant API'
  });
});

// Mounting API routers
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Fallback middlewares for unknown routes and errors
app.use(notFound);
app.use(errorHandler);

export default app;
