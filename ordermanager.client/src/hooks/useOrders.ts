import { useEffect, useState } from 'react';
import { OrderDetails } from '../models/Order';
import { OrderApi } from '../api/OrderApi';
import { Customer } from '../models/Customer';
import { CustomerApi } from '../api/CustomerApi';
import eventsService, { CustomerEventHandler } from '../services/EventsService';
import { OrderEventHandler } from '../services/EventsService';


export function useOrders(customerId?: number) {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDeleted, setCustomerDeleted] = useState<boolean>(false);  

  const handleNewOrder: OrderEventHandler = (order, eventType) => {
    if (order.customerId === customerId) {
      console.log(`New order received for customer ${order.customerId} (Order ID: ${order.orderId})  ${eventType} `);
      fetchOrders(order.customerId); // Refresh orders
    }
  };

  const handleCustomerEvent: CustomerEventHandler =(eventCustomerId, eventType) => {
    console.log(`CustomerEvent arrived ${eventCustomerId}`);
    if(eventCustomerId===customerId && eventType=== "deleted" && !customerDeleted)
    {
      console.log(`This Customer has been deleted ${eventCustomerId}`);      
      alert(`This customer has been deleted.`);
      setCustomerDeleted(true);
      setOrders([]);     
      setSelectedCustomer(null);
    }
  }


  const fetchOrders = async (customerId:number) => {
    try {
        setLoading(true);
        if(!selectedCustomer)
        {
          const customer = await CustomerApi.getCustomer(customerId); // Fetch customer details
          setSelectedCustomer(customer); // Set selected customer in state
        }
        
        const orders = await OrderApi.getOrdersForCustomer(customerId); //TODO:Add paging);
        setOrders(orders);
        setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }    
  };


  useEffect(() => {    
    fetchOrders(customerId??0); //Initial fetch
    eventsService.subscribeOrderEvents(handleNewOrder); // Subscribe to order events
    eventsService.subscribeCustomerEvents(handleCustomerEvent);

    return () => {
      eventsService.unsubscribeOrderEvents(handleNewOrder); // Unsubscribe from order events when component unmounts
      eventsService.unsubscribeCustomerEvents(handleCustomerEvent);
    }

  }, []);

  return { orders, customerId, selectedCustomer,  loading, error, customerDeleted,  fetchOrders };
}
