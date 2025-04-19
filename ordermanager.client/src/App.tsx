import {Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import CustomerOrders from './pages/CustomerOrders';
import About from './pages/about';

function App() {


  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />        
        <Route path="/customers/:id/orders" element={<CustomerOrders />} />
        <Route path="/products" element={<Products/>} />        
        <Route path="/about" element={<About />} />        
      </Routes>
    </Layout>
  );
}

export default App;


