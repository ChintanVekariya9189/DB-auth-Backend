import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

// Connect to MongoDB BEFORE starting the server
connectDB();

// Initialize Express app
const app = express();

// CORS Configuration
// CORS Configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://db-auth-frontend.vercel.app'], // Allow both local and Vercel frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware for JSON Parsing
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Start Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}...`);
});
