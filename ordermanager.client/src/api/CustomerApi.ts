

import axios from 'axios';
import { Customer, CustomerDetails } from '../models/Customer';
import API_URL from '../config/apiConfig';


export class CustomerApi {
    
    private constructor() {}

    public static getCustomer = async (id: number): Promise<CustomerDetails> => {
        const response = await axios.get<CustomerDetails>(`${API_URL}/customers/${id}`);
        console.log('Fetched customer:', response.data); // Debugging line
        return response.data;
    };

    public static getAllCustomers = async (): Promise<CustomerDetails[]> => {
        const response = await axios.get<CustomerDetails[]>(`${API_URL}/customers`);
        console.log('Fetched customers:', response.data); // Debugging line
        return response.data;
    };
    
    public static deleteCustomer = async (id: number): Promise<void> => {
      await axios.delete(`${API_URL}/customers/${id}`);
    };
    
    
    public static createCustomer = async (customer: Customer) =>
        axios.post(`${API_URL}/customers`, customer);
      
    public static updateCustomer = async (id: number, customer: Customer) =>
        axios.put(`${API_URL}/customers/${id}`, customer);
      


}

