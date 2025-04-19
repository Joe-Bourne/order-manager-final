

// src/types/Product.ts

export interface Product {
    productId: number;
    name: string;
    price: number;
  }
  
  // Returned from API (if extended)
  export interface ProductDetails extends Product {
    // Optional derived field for client-side use only
    displayName?: string;
  }
  