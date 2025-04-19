
import axios from 'axios';
import { OrderDetails, Order } from '../models/Order';
import API_URL from '../config/apiConfig';


export class OrderApi {
  public static  getOrdersForCustomer = async (customerId: number): Promise<OrderDetails[]> => {
    const response = await axios.get<OrderDetails[]>(`${API_URL}/customers/${customerId}/orders`);
    return response.data;
  };
  public static createOrder = async (order: Order) => {
    await axios.post(`${API_URL}/orders`, order);
  };
}
