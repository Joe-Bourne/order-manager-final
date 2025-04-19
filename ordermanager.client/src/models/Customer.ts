


// src/types/Customer.ts

export interface Customer {
    customerId: number;
    firstName: string;
    middleInitial: string;
    lastName: string;
  }
  
  // Returned from API with additional fields
  export interface CustomerDetails extends Customer {
    orderCount: number;
  
    // Optional — computed client-side unless API provides it
    displayName?: string;
  }
  