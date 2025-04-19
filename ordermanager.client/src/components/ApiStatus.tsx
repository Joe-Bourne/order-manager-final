import { useEffect, useState } from 'react';
import API_URL from '../config/apiConfig';
import { useAppStore } from '../store/appStore';

const PING_INTERVAL: number = 5000; // 5 seconds

const ApiStatus = () => {
  const appState = useAppStore();
  const [statusMessage, setStatusMessage] = useState("Checking server...");

  const pingServer = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // timeout after 3 seconds

    try {
      const response = await fetch(`${API_URL}/ping`, { signal: controller.signal });
      clearTimeout(timeout);

      const online = response.ok;
      appState.setApiOnline(online);
      setStatusMessage(online ? "Server is Online" : "Server is Offline");

      if (process.env.NODE_ENV === 'development') {
        console.log(`API is ${online ? "ONLINE" : "OFFLINE"}`);
      }
    } catch (err) {
      clearTimeout(timeout);
      appState.setApiOnline(false);
      setStatusMessage("Server is Offline");

      if (process.env.NODE_ENV === 'development') {
        console.log("API is OFFLINE (timeout or network error)");
      }
    }
  };

  useEffect(() => {
    pingServer(); // initial ping on mount

    const interval = setInterval(() => {
      pingServer();
    }, PING_INTERVAL);

    return () => clearInterval(interval); // cleanup on unmount
  }, []); // run once only

  return (
    <span className="d-inline-block" data-toggle="tooltip" title={statusMessage}>
      {appState.isApiOnline === null && <span className="text-secondary">Checking server...</span>}
      {appState.isApiOnline === true && <span className="text-success">✅ API online</span>}
      {appState.isApiOnline === false && <span className="text-danger">❌ API offline</span>}
    </span>
  );
};

export default ApiStatus;
