# SocketChat — Real-time 1-on-1 Chat App

A real-time chat application built using Socket.io, Express, and React (Vite).

The project is fully deployed with frontend on Vercel and backend on Render, and includes handling for server cold starts using a health check system.

Live Demo:
https://chat-project-mocha.vercel.app/

---

## Features

- Real-time messaging using Socket.io
- Room-based chat system
- Typing indicators
- Live online users list per room
- Join and leave system messages
- Multiple chat rooms support
- Handles backend cold start delays (Render free tier)

---

## Key Highlights

- Production deployment (Vercel frontend + Render backend)
- Server cold start handling using `/health` endpoint
- Client-side server readiness detection with polling
- Proper socket lifecycle management
- Prevents duplicate connections and race conditions
- Clean separation of frontend and backend

---

## Project Structure

```
socketio-chat/
├── server/
│   ├── index.js          # Express + Socket.io backend
│   └── package.json
│
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── socket.js
        ├── JoinScreen.jsx
        ├── JoinScreen.module.css
        ├── ChatRoom.jsx
        └── ChatRoom.module.css
```

---

## How to use
you can either clone the repo and run it locally or check out the live demo.
### Local Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the server directory and install dependencies:
   ```bash
    cd socketio-chat/server
    npm install
    ```
3. Start the backend server:
    ```bash
    npm start
    ```
4. In a new terminal, navigate to the client directory and install dependencies:
    ```bash
    cd socketio-chat/client
    npm install
    ```
5. Start the frontend development server:
    ```bash
    npm run dev
    ```
6. Open your browser and go to `http://localhost:5173` to access the chat application.

## OR YOU CAN VISIT THE WEBSITE 
https://chat-project-mocha.vercel.app/

