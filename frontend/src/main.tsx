import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Keep Render backend alive
const ping = () => fetch("https://cloud-nova.onrender.com/").catch(() => {});
ping();
setInterval(ping, 10 * 60 * 1000);

createRoot(document.getElementById("root")!).render(<App />);
