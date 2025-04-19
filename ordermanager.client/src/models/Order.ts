

// src/types/Order.ts

import { Customer } from './Customer';
import { Employee } from './Employee';
import { Product } from './Product';

// Matches your C# Order table
export interface Order {
  orderId: number;
  customerId: number;
  salesPersonId: number;
  productId: number;
  quantity: number;
}

// Returned from API with nested details
export interface OrderDetails {
  orderId: number;
  quantity: number;
  orderTotal: number;
  customer?: Customer;
  salesPerson?: Employee;
  product?: Product;
}
