// src/config/api.ts

// Backend URL
const API =
  import.meta.env.VITE_API_URL ||
  "https://cloud-nova.onrender.com";

// Ping backend every 10 minutes to keep it awake
export const keepAlive = () => {
  setInterval(async () => {
    try {
      await fetch(`${API}/`);
    } catch (e) {
      console.log("KeepAlive failed");
    }
  }, 10 * 60 * 1000); // 10 minutes
};

export default API;