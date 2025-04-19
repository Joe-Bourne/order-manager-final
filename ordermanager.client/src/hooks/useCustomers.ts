import { useEffect, useState, useCallback } from "react";
import { CustomerApi } from "../api/CustomerApi";
import { Customer, CustomerDetails } from "../models/Customer";
import eventsService, { CustomerEventHandler } from "../services/EventsService";

export default function useCustomers() {
  const [customers, setCustomers] = useState<CustomerDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCustomer, setSelected] = useState<Customer | null>(null);

  //Get/Set the selected customer
  const setSelectedCustomer = (customer: Customer | null) => {
    setSelected(customer);
  };
  const getSelectedCustomer = () => {
    return selectedCustomer;
  };

  //Fetch the customer list
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CustomerApi.getAllCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  //Delete a customer
  const deleteCustomer = async (customer: Customer) => {
    try {
      await CustomerApi.deleteCustomer(customer.customerId);
      console.log("Customer deleted:", customer.customerId); // Debugging line
    } catch (error) {
      console.error("Failed to delete customer:", error);
      alert("Error deleting customer.");
    }
  };

  //Save a customer (create or update)
  const saveCustomer = async (customer: Customer) => {
    try {
      if (customer.customerId > 0) {
        await CustomerApi.updateCustomer(customer.customerId, customer);
        console.log("Customer updated:", customer.customerId); // Debugging line
      } else {
        await CustomerApi.createCustomer(customer);
        console.log("Customer created:", customer); // Debugging line
      }
    } catch (error) {
      console.error("Failed to save customer:", error);      
    }
  };

  const onCustomerEvent: CustomerEventHandler = (customerId, eventType) => {
    console.log(`Event Arrived, doing a refresh ${customerId} ${eventType}`);
    fetchCustomers();
  };

  useEffect(() => {
    //fetchCustomers(); // Initial fetch

    eventsService.subscribeCustomerEvents(onCustomerEvent);

    return () => {
      eventsService.unsubscribeCustomerEvents(onCustomerEvent);
    };
  }, []);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    deleteCustomer,
    saveCustomer,

    getSelectedCustomer,
    setSelectedCustomer,
    setCustomers,
  };
}
