
import axios from 'axios';
import { Employee } from '../models/Employee';
import API_URL from '../config/apiConfig';


export class EmployeeApi {
    private constructor() {}

    public static getEmployees = async (): Promise<Employee[]> => {
        const response = await axios.get<Employee[]>(`${API_URL}/employees`);
        return response.data;
    };
    
    public static deleteEmployee = async (id: number): Promise<void> => {
      await axios.delete(`${API_URL}/employees/${id}`);
    };
    
    public static createEmployee = async (employee: Employee) =>
        axios.post(`${API_URL}/employees`, employee);
      
    public static updateEmployee = async (id: number, employee: Employee) =>
        axios.put(`${API_URL}/employees/${id}`, employee);
}



