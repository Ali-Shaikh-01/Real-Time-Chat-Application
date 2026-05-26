const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// Health check for Render wake detection
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-project-mocha.vercel.app",
    methods: ["GET", "POST"],
  },
});

// Track users
const users = {};

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join", ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    socket.to(room).emit("system", {
      text: `${username} has joined the chat.`,
      timestamp: new Date().toISOString(),
    });

    const roomUsers = Object.values(users)
      .filter((u) => u.room === room)
      .map((u) => u.username);

    io.to(room).emit("room_users", roomUsers);
  });

  socket.on("message", ({ text }) => {
    const user = users[socket.id];
    if (!user) return;

    io.to(user.room).emit("message", {
      from: user.username,
      text,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("typing", (isTyping) => {
    const user = users[socket.id];
    if (!user) return;

    socket.to(user.room).emit("typing", {
      username: user.username,
      isTyping,
    });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    const { username, room } = user;
    delete users[socket.id];

    const roomUsers = Object.values(users)
      .filter((u) => u.room === room)
      .map((u) => u.username);

    io.to(room).emit("room_users", roomUsers);

    io.to(room).emit("system", {
      text: `${username} has left the chat.`,
      timestamp: new Date().toISOString(),
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});