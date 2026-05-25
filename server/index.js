const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Track connected users: socketId -> { username, room }
const users = {};

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // User joins with a username and room
  socket.on("join", ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    console.log(`${username} joined room: ${room}`);

    // Notify the room someone joined
    socket.to(room).emit("system", {
      text: `${username} has joined the chat.`,
      timestamp: new Date().toISOString(),
    });

    // Send current user list for the room
    const roomUsers = Object.values(users).filter((u) => u.room === room);
    io.to(room).emit("room_users", roomUsers.map((u) => u.username));
  });

  // Handle incoming chat messages
  socket.on("message", ({ text }) => {
    const user = users[socket.id];
    if (!user) return;

    const payload = {
      from: user.username,
      text,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to everyone in the room including sender
    io.to(user.room).emit("message", payload);
  });

  // Typing indicator
  socket.on("typing", (isTyping) => {
    const user = users[socket.id];
    if (!user) return;
    socket.to(user.room).emit("typing", { username: user.username, isTyping });
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      const { username, room } = user;
      delete users[socket.id];

      const roomUsers = Object.values(users).filter((u) => u.room === room);
      io.to(room).emit("room_users", roomUsers.map((u) => u.username));
      io.to(room).emit("system", {
        text: `${username} has left the chat.`,
        timestamp: new Date().toISOString(),
      });

      console.log(`${username} disconnected from room: ${room}`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});
