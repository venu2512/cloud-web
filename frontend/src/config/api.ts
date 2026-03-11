// Ping backend every 10 minutes to keep it awake
const BACKEND_URL = "https://cloud-nova.onrender.com";

export const keepAlive = () => {
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/`);
    } catch (e) {}
  }, 10 * 60 * 1000); // every 10 minutes
};