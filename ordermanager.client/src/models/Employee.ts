

// src/types/Employee.ts

export interface Employee {
    employeeId: number;
    firstName: string;
    middleInitial: string;
    lastName: string;
  }
  
  export interface EmployeeDetails extends Employee {
    orderCount: number;
  
    // This is not returned by the API — add it client-side
    displayName?: string; // optional — derived field
  }
  