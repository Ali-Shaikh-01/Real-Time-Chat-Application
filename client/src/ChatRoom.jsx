import { useState, useEffect, useRef } from "react";
import styles from "./ChatRoom.module.css";

export default function ChatRoom({ session, onLeave }) {
  const { username, room, socket } = session;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    // Listen for chat messages
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { ...msg, type: "chat" }]);
    });

    // System events (join/leave)
    socket.on("system", (msg) => {
      setMessages((prev) => [...prev, { ...msg, type: "system" }]);
    });

    // Room user list
    socket.on("room_users", (users) => {
      setRoomUsers(users);
    });

    // Typing indicators
    socket.on("typing", ({ username: who, isTyping }) => {
      setTypingUser(isTyping ? who : null);
    });

    return () => {
      socket.off("message");
      socket.off("system");
      socket.off("room_users");
      socket.off("typing");
      socket.disconnect();
    };
  }, [socket]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    socket.emit("message", { text });
    setInput("");
    socket.emit("typing", false);
    clearTimeout(typingTimeout.current);
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket.emit("typing", false), 1500);
  };

  const handleLeave = () => {
    socket.disconnect();
    onLeave();
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.roomBadge}>#{room}</div>
          <p className={styles.sidebarLabel}>Online</p>
          <ul className={styles.userList}>
            {roomUsers.map((u) => (
              <li key={u} className={styles.userItem}>
                <span className={styles.dot} />
                {u} {u === username && <span className={styles.you}>(you)</span>}
              </li>
            ))}
          </ul>
        </div>
        <button className={styles.leaveBtn} onClick={handleLeave}>
          Leave Room
        </button>
      </aside>

      {/* Main chat */}
      <main className={styles.main}>
        <header className={styles.header}>
          <span>#{room}</span>
          <span className={styles.headerUser}>Logged in as <strong>{username}</strong></span>
        </header>

        <div className={styles.messages}>
          {messages.map((msg, i) =>
            msg.type === "system" ? (
              <div key={i} className={styles.systemMsg}>
                {msg.text}
              </div>
            ) : (
              <div
                key={i}
                className={`${styles.bubble} ${
                  msg.from === username ? styles.mine : styles.theirs
                }`}
              >
                {msg.from !== username && (
                  <span className={styles.sender}>{msg.from}</span>
                )}
                <div className={styles.text}>{msg.text}</div>
                <span className={styles.time}>{formatTime(msg.timestamp)}</span>
              </div>
            )
          )}

          {typingUser && (
            <div className={styles.typingIndicator}>
              <span>{typingUser} is typing</span>
              <span className={styles.dots}>
                <span /><span /><span />
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder={`Message #${room}…`}
            value={input}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className={styles.sendBtn} onClick={sendMessage}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
