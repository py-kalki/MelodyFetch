require('dotenv').config();
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store io instance in app for use in controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_job', (jobId) => {
    socket.join(jobId);
    console.log(`Socket ${socket.id} joined job ${jobId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
