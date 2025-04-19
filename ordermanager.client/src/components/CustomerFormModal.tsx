import { useEffect, useState } from 'react';
import { Customer } from '../models/Customer';

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  customerToEdit?: Customer | null;
}

const initialForm: Customer = {
  customerId: 0,
  firstName: '',
  middleInitial: '',
  lastName: '',
};

const CustomerFormModal = ({ show, onClose, onSave, onDelete, customerToEdit }: Props) => {
  const [form, setForm] = useState<Customer>(initialForm);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {      
      try{
        e.preventDefault();
        if (!validateForm()) {
          return;
        }        
        onSave(form);
      }catch (error) {
        console.error("Failed to save customer", error);
        alert("Failed to save customer" + error);
      } 
  };

  //Some basic validation -  could use BootStrap validation
  const validateForm = () => {          
    if (!form.firstName || !form.lastName) {
      alert('Please fill in all required fields.');
      return false;
    }
    if (form.middleInitial.length > 1) {
      alert('Middle Initial can only be one character.');      
      return false;
    }
    return true;
  }

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    onDelete(form);
  };

  useEffect(() => {
    setForm(customerToEdit ?? initialForm);
  }, [customerToEdit]);


  return (
    <div className={`modal fade ${show ? 'show d-block' : 'd-none'}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
          <div className="modal-header bg-secondary text-white">
              <h5 className="modal-title">
                {customerToEdit ? 'Edit Customer' : 'Add Customer'}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Middle Initial</label>
                <input className="form-control" name="middleInitial" value={form.middleInitial} onChange={handleChange}
                
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-danger"  style={{ display: form.customerId > 0 ? "block" : "none" }} onClick={handleDelete} >Delete</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerFormModal;
