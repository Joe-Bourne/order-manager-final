import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppStore } from "../store/appStore";
import { useOrders } from "../hooks/useOrders";
import OrderFormModal from "./OrderFormModal";
import ErrorAlert from "./ErrorAlert";

const CustomerOrdersList = () => {
  const { id } = useParams();
  const [displayOrderForm, setDisplayOrderForm] = useState(false);

  const {customerId, selectedCustomer,orders,loading,customerDeleted,error, fetchOrders} = useOrders(parseInt(id ?? "")); // Custom hook to fetch orders
  const appState = useAppStore();

  const navigate = useNavigate();

  const handleShowOrderForm = () => {
    console.log('Show order form for customer:', customerId);
    setDisplayOrderForm(true);
  };

  const handleFetchOrders =()=>{
    fetchOrders(customerId ?? 0);
  }

  const hasError: boolean =error !== null;

  useEffect(() => {
    console.log("Customer ID from URL:", customerId);

    //if(!appState.isApiOnline)
      //error = "app is offline";

    if (customerDeleted) {
      navigate(`/`);
      return;
    }
    fetchOrders(customerId ?? 0); // Fetch orders when customerId changes
  }, [customerDeleted, hasError]);


  if (selectedCustomer?.customerId == 0) return <p>Customer not found.</p>;

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="mx-auto" style={{ maxWidth: "900px" }}>        
      
      <OrderFormModal
        show={displayOrderForm}
        onClose={() => setDisplayOrderForm(false)}
        onSave={() => handleFetchOrders}
        customerId={customerId ?? 0}
      />

      <div className="mb-3">
        <h1>Orders for Customer #{customerId}</h1>
      </div>
      <ErrorAlert errorMsg={error?.message || ""} onRetry={handleFetchOrders}  />

      <div className="mb-3">
        <table className="table w-50 table-striped table-bordered table-sm ">
          <tbody>
            <tr>
              <td>Customer ID:</td>
              <td>{customerId}</td>
            </tr>
            <tr>
              <td>Full Name:</td>
              <td>
                {selectedCustomer?.firstName} {selectedCustomer?.middleInitial}{" "}
                {selectedCustomer?.lastName}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary"
          disabled={!appState.isApiOnline || hasError}
          onClick={handleShowOrderForm}
        >
          Add Order
        </button>
      </div>

      <table className="table table-hover table-striped table-bordered table-sm table-responsive text-center">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Product</th>
            <th scope="col">Quantity</th>
            <th scope="col">Sales Person</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.product?.name}</td>
              <td>{order.quantity}</td>
              <td>
                {order.salesPerson?.firstName} {order.salesPerson?.lastName}
              </td>
              <td>£{order.orderTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders?.length === 0 && <p>No orders found.</p>}
    </div>
  );
};

export default CustomerOrdersList;
