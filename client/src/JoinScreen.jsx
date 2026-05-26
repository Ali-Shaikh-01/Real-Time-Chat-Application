import { useState, useRef, useEffect } from "react";
import { createSocket } from "./socket";
import styles from "./JoinScreen.module.css";

export default function JoinScreen({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("room-1");
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("checking");

  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  // ✅ single server check function
  const checkServer = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL || "http://localhost:3001"}/health`
      );
      return res.ok;
    } catch {
      return false;
    }
  };

  // 🔁 auto polling until server wakes (NO refresh needed)
  useEffect(() => {
    const startChecking = async () => {
      const ok = await checkServer();

      if (ok) {
        setServerStatus("ready");
        return;
      }

      setServerStatus("waking");

      intervalRef.current = setInterval(async () => {
        const alive = await checkServer();

        if (alive) {
          setServerStatus("ready");
          clearInterval(intervalRef.current);
        } else {
          setServerStatus("waking");
        }
      }, 3000);
    };

    startChecking();

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleJoin = async () => {
    const trimmedUser = username.trim();
    const trimmedRoom = room.trim();

    if (!trimmedUser) return setError("Please enter a username.");
    if (!trimmedRoom) return setError("Please enter a room name.");

    setError("");

    const isReady = await checkServer();

    if (!isReady) {
      setServerStatus("waking");
      return;
    }

    setServerStatus("ready");

    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", {
        username: trimmedUser,
        room: trimmedRoom,
      });

      onJoin({
        username: trimmedUser,
        room: trimmedRoom,
        socket,
      });
    });

    socket.on("connect_error", () => {
      setServerStatus("offline");
      setError("Could not connect to chat server.");
    });

    socket.connect();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>💬</div>
        <h1 className={styles.title}>SocketChat</h1>

        <p className={styles.subtitle}>
          Real-time 1-on-1 chat via Socket.io
        </p>

        <div className={styles.form}>
          <label className={styles.label}>Username</label>
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          <label className={styles.label}>Room</label>
          <input
            className={styles.input}
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.btn}
            onClick={handleJoin}
            disabled={serverStatus !== "ready"}
          >
            {serverStatus === "ready"
              ? "Join Chat →"
              : "Waiting for server..."}
          </button>
        </div>
<br></br>
        <p className={styles.status}>
          <span style={{ color: "grey" }}>
            {serverStatus === "checking" && "Checking server status..."}
            {serverStatus === "waking" &&
              "Server is waking up... please wait "}
            {serverStatus === "ready" &&
              "Server is ready. You can join now "}
            {serverStatus === "offline" &&
              "Server is unreachable "}
          </span>
        </p>
      </div>
    </div>
  );
}