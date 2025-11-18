import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity. In production, restrict this.
    methods: ["GET", "POST"]
  }
});

// In-memory data structures for matching
let globalQueue: string[] = [];
let countryQueues: { [countryCode: string]: string[] } = {};
let userRooms: { [socketId: string]: string } = {}; // socketId -> peerSocketId

const logStatus = () => {
  console.log('--- Server Status ---');
  console.log(`Global Queue: ${globalQueue.length} users`);
  Object.keys(countryQueues).forEach(country => {
    if (countryQueues[country].length > 0) {
      console.log(`- ${country} Queue: ${countryQueues[country].length} users`);
    }
  });
  console.log(`Active Rooms: ${Object.keys(userRooms).length / 2}`);
  console.log('---------------------');
};

const findAndMatchUser = (socketId: string, country?: string) => {
  let peerId: string | undefined;
  
  if (country && country !== 'global') {
    if (!countryQueues[country]) {
      countryQueues[country] = [];
    }
    // Try to find a match in the country queue
    peerId = countryQueues[country].shift();
    if (!peerId) {
      // No match, add to queue
      countryQueues[country].push(socketId);
    }
  } else {
    // Try to find a match in the global queue
    peerId = globalQueue.shift();
    if (!peerId) {
      // No match, add to queue
      globalQueue.push(socketId);
    }
  }

  if (peerId) {
    // We found a match!
    console.log(`Matching ${socketId} with ${peerId}`);
    userRooms[socketId] = peerId;
    userRooms[peerId] = socketId;

    // Notify both users they have been matched
    io.to(peerId).emit('matched', { peerId: socketId, initiator: true });
    io.to(socketId).emit('matched', { peerId: peerId, initiator: false });
  } else {
    console.log(`${socketId} is waiting in ${country || 'global'} queue.`);
  }
  logStatus();
};

const cleanupUser = (socketId: string) => {
  // Remove from any queues
  globalQueue = globalQueue.filter(id => id !== socketId);
  for (const country in countryQueues) {
    countryQueues[country] = countryQueues[country].filter(id => id !== socketId);
  }

  // If in a room, notify the peer and clean up the room
  const peerId = userRooms[socketId];
  if (peerId) {
    console.log(`User ${socketId} disconnected, notifying peer ${peerId}`);
    io.to(peerId).emit('peer-disconnected');
    delete userRooms[peerId];
    delete userRooms[socketId];
  }

  console.log(`User ${socketId} cleaned up.`);
  logStatus();
};


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-queue', ({ country }) => {
    console.log(`User ${socket.id} joining queue for country: ${country}`);
    // First, ensure the user is not already in a queue or room
    cleanupUser(socket.id); 
    findAndMatchUser(socket.id, country);
  });

  socket.on('offer', ({ to, offer }) => {
    io.to(to).emit('offer', { from: socket.id, offer });
  });

  socket.on('answer', ({ to, answer }) => {
    io.to(to).emit('answer', { from: socket.id, answer });
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('ice-candidate', { from: socket.id, candidate });
  });
  
  socket.on('leave-room', () => {
    cleanupUser(socket.id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    cleanupUser(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Signaling server listening on *:${PORT}`);
});
