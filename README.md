# SocketChat — Real-time 1-on-1 Chat

A minimal two-user chat app using **Socket.io**, **Express**, and **React + Vite**.

## Features
- Real-time messaging via Socket.io
- Typing indicators
- Online user list per room
- Join/leave system messages
- Multiple rooms supported

---

## Setup

### 1. Start the Server

```bash
cd server
npm install
npm run dev        # uses nodemon (auto-restart)
# or: npm start   # plain node
```

Server runs on **http://localhost:3001**

---

### 2. Start the Client

```bash
cd client
npm install
npm run dev
```

Client runs on **http://localhost:5173**

---

## Usage

1. Open **two browser tabs** at `http://localhost:5173`
2. In tab 1: enter username `alice`, room `room-1` → Join
3. In tab 2: enter username `bob`, room `room-1` → Join
4. Start chatting! ✅

---

## Project Structure

```
socketio-chat/
├── server/
│   ├── index.js          # Express + Socket.io server
│   └── package.json
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── socket.js         # createSocket() factory
        ├── JoinScreen.jsx
        ├── JoinScreen.module.css
        ├── ChatRoom.jsx
        └── ChatRoom.module.css
```

## Socket Events

| Event | Direction | Payload |
|---|---|---|
| `join` | client → server | `{ username, room }` |
| `message` | client → server | `{ text }` |
| `message` | server → client | `{ from, text, timestamp }` |
| `typing` | client → server | `boolean` |
| `typing` | server → client | `{ username, isTyping }` |
| `system` | server → client | `{ text, timestamp }` |
| `room_users` | server → client | `string[]` |
