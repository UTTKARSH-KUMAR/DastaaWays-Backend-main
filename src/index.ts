import express, { type Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app: Application = express();
// We need an HTTP server to attach Socket.io to it
const httpServer = createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Basic REST Route testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running normally' });
});

// Socket.io Signaling Setup
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Here you will handle WebRTC signaling:
  // - joining a room
  // - sending/receiving 'offer', 'answer', and 'ice-candidate' events

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});