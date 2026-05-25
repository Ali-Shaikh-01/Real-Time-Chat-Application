import { useState, useRef } from "react";
import { createSocket } from "./socket";
import styles from "./JoinScreen.module.css";

export default function JoinScreen({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("room-1");
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  const handleJoin = () => {
    const trimmedUser = username.trim();
    const trimmedRoom = room.trim();

    if (!trimmedUser) return setError("Please enter a username.");
    if (!trimmedRoom) return setError("Please enter a room name.");

    // Create a fresh socket per user session
    const socket = createSocket();
    socketRef.current = socket;

    const doJoin = () => {
      socket.emit("join", { username: trimmedUser, room: trimmedRoom });
      onJoin({ username: trimmedUser, room: trimmedRoom, socket });
    };

    if (socket.connected) {
      doJoin();
    } else {
      socket.once("connect", doJoin);
      socket.once("connect_error", () => {
        setError("Could not connect to server. Is it running?");
      });
      socket.connect();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>💬</div>
        <h1 className={styles.title}>SocketChat</h1>
        <p className={styles.subtitle}>Real-time 1-on-1 chat via Socket.io</p>

        <div className={styles.form}>
          <label className={styles.label}>Username</label>
          <input
            className={styles.input}
            placeholder="e.g. alice"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          <label className={styles.label}>Room</label>
          <input
            className={styles.input}
            placeholder="e.g. room-1"
            value={room}
            onChange={(e) => { setRoom(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btn} onClick={handleJoin}>
            Join Chat →
          </button>
        </div>

        <p className={styles.hint}>
          Open two tabs with the same room to chat between users.
        </p>
      </div>
    </div>
  );
}
