import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Customer } from "../models/Customer";
import CustomerFormModal from "../components/CustomerFormModal";
import ErrorAlert from "./ErrorAlert";
import useCustomers from "../hooks/useCustomers";
import { useAppStore } from "../store/appStore";

const CustomerList = () => {  
  const [showModal, setShowModal] = useState(false);    
  const { customers, loading, error, refetch,deleteCustomer,saveCustomer , getSelectedCustomer,setSelectedCustomer  } = useCustomers();
  const appState = useAppStore();
  const navigate = useNavigate();

  //Handle the Edit Button Click
  const handleEdit = (customer: Customer) => {    
        setSelectedCustomer(customer); // Set the selected customer in the app state        
        setShowModal(true);
  }
  //Show orders for a customer
  const handleShowOrders = async (customer: Customer) => {
    navigate(`/customers/${customer.customerId}/orders`);
  };
  // Show the Add Customer form
  const handleAddCustomer = () => {
    setSelectedCustomer(null); // Clear the selected customer in the app state    
    setShowModal(true); 
  }

  //Delete a customer
  const handleDelete = async (customer: Customer) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;    
    try{
        await deleteCustomer(customer); // Call the delete function from the hook
        setShowModal(false);
    }catch (error) {
        console.error("Failed to delete customer:", error);
        alert("Error deleting customer.");
    }
  };

  //Save a customer (create or update)
  const handleSave = async (customer: Customer) => {
    try {
        await saveCustomer(customer); // Call the save function from the hook
        setShowModal(false);
    } catch (error) {
        console.error("Failed to save customer:", error);
        alert("Error saving customer.");
    }
  };  

  const hasError: boolean =error !== null;

  useEffect(() => {
    refetch();

  }, [appState.isApiOnline,hasError]);

  if (loading) return <p>Loading customers...</p>;

  return (
    <div>
      <CustomerFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        customerToEdit={getSelectedCustomer()}/>

      <div className="mx-auto" style={{ maxWidth: "900px" }}>        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Customers</h1>
          <button
            className="btn btn-primary"
            disabled={hasError}
            onClick={handleAddCustomer}>Create Customer</button>
        </div>

        <ErrorAlert errorMsg={error?.message || ""} onRetry={refetch}  />      

        <table className="table table-hover  table-striped table-bordered table-light table-sm table-responsive text-center   ">
          <thead className="thead-light">
            <tr>
              <th scope="col">Id</th>
              <th scope="col">First</th>
              <th scope="col">Initial</th>
              <th scope="col">LastName</th>
              <th scope="col">Total Orders</th>
              <th scope="col" style={{ width: 120 }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.customerId}
                onClick={() => handleShowOrders(customer)}>
                <td>{customer.customerId}</td>
                <td>{customer.firstName}</td>
                <td>{customer.middleInitial}</td>
                <td>{customer.lastName}</td>
                <td>{customer.orderCount}</td>

                <td className="text-nowrap">
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={hasError}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowOrders(customer);
                      }}>View Orders
                    </button>
                    <button className="btn btn-primary btn-sm "
                      disabled={hasError}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(customer);
                      }}>Edit Customer
                    </button>                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>Total Customers: {customers.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
