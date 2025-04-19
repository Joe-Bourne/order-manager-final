
import { useEffect, useState } from 'react';
import eventsService, { CustomerEventHandler } from '../services/EventsService';
import { CustomerApi } from '../api/CustomerApi';

interface Toast {
  id: number;
  type: 'info' | 'success' | 'warning' | 'danger';
  message: string;
}

let toastCounter = 0;

// Toaster component to display toast notifications
// It listens to events from the eventsService
// and shows notifications accordingly
const Toaster = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info' ) => {
    const id = toastCounter++;
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleCustomerEvent: CustomerEventHandler= async (customerId, eventType) =>
  {
    try{
      if(eventType != "deleted")
      {
        console.log(eventType);
        const customer = await CustomerApi.getCustomer(customerId);
        showToast(`Customer ${customer.displayName} was ${eventType}`);
      }
      else
      {
        console.log(eventType);
        showToast(`Customer ${customerId} was ${eventType}`);
      }
      return;
    } catch(error)
    {
      console.log(error);
    }  
    
    
  };

  useEffect(() => {
    //Subscribe to customer events
    eventsService.subscribeCustomerEvents((id,eventType)=> handleCustomerEvent(id,eventType));
      
    return ()=>
    {
      //UnSubscribe to customer events
      eventsService.unsubscribeCustomerEvents(handleCustomerEvent);
    }

  }, []);

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 9999 }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-bg-${toast.type} border-0 mb-2`}>
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
