import { useEffect, useState } from 'react';
import API_URL from '../config/apiConfig';
import { useAppStore } from '../store/appStore';

const PING_INTERVAL:number = 5000; // 5 seconds

// This component checks the API status by pinging the server every 5 seconds
// and updates the app state accordingly. It also displays the current status of the API.
// It uses the useAppStore hook to access the app state and update it when the API status changes.
// The pingServer function sends a GET request to the /ping endpoint of the API and checks if the response is ok (status code 200).

const ApiStatus = () => {  
  const appState = useAppStore();
  const [statusMessage, setStatusMessage] = useState("Server is Online");


  const pingServer = async () => {
    try {
      const response = await fetch(`${API_URL}/ping`)      
      if(!appState.isApiOnline)
      {
        appState.setApiOnline(response.ok);      
        setStatusMessage("Server is Online");
        console.log('API is back online:', response);
      }      
      
    } catch {
      appState.setApiOnline(false);      
      setStatusMessage("Server is offline");
      console.log('API is OFFLINE')
    }
  };

  useEffect(() => {
    pingServer(); // initial check

    const interval = setInterval(() => {
      pingServer();
    }, PING_INTERVAL);

    return () => clearInterval(interval); // cleanup
  },[]);

  return (      
      <span className="d-inline-block"  data-toggle="tooltip" title={statusMessage} >
        {appState.isApiOnline === null && <span className="text-secondary">Checking server...</span>}
        {appState.isApiOnline === true && <span className="text-success">✅ API online</span>}
        {appState.isApiOnline === false && <span className="text-danger">❌ API offline</span>}
      </span>
  );
};

export default ApiStatus;
