import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// StrictMode removed intentionally — it double-fires useEffect in dev,
// which calls socket.off() and strips all listeners before they're used.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
