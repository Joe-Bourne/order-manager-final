
import axios from 'axios';
import { Product } from '../models/Product';
import API_URL from '../config/apiConfig';

export class ProductApi{

  public static getProducts = async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    return response.data;
  };
}


