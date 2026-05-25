import { useState } from "react";
import JoinScreen from "./JoinScreen";
import ChatRoom from "./ChatRoom";

export default function App() {
  const [session, setSession] = useState(null); // { username, room, socket }

  return session ? (
    <ChatRoom session={session} onLeave={() => setSession(null)} />
  ) : (
    <JoinScreen onJoin={setSession} />
  );
}
