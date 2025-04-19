import { useEffect, useState } from "react";
import { ProductApi } from "../api/ProductApi";
import { Product } from "../models/Product";
import ErrorAlert from "./ErrorAlert";
import { useAppStore } from "../store/appStore";



function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

      const appState = useAppStore();

    const loadProducts = async () => {
        try{
        const data = await ProductApi.getProducts();
        setProducts(data);
        setError(null);
        }catch (error) {
            console.error("Failed to fetch products", error);
            setError("Failed to fetch products" + error);
        }
    };      

    useEffect(() => {          
        loadProducts();          
    },[appState.isApiOnline]);


    return (    
    <div className="mx-auto" style={{ maxWidth: "900px" }}>
      <h1>Product List</h1>

      <ErrorAlert errorMsg={error || ""} onRetry={loadProducts}  />

      <table className="table table-hover table-striped table-bordered table-sm table-responsive text-center">
        <thead>
          <tr>            
            <th scope="col">ProductID</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>            
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.name}</td>              
              <td>£{product.price}</td>              
            </tr>
          ))}
        </tbody>
      </table>   
    </div>
  );
}


export default ProductList;