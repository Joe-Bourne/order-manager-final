import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ApiStatus from '../components/ApiStatus';
import EventsService from '../services/EventsService';
import { useEffect } from 'react';
import Toaster from '../components/Toaster';
import { Link } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {

  
  useEffect(() => {
    console.log("Layout Render");
    const startConnection = async () => {
      await EventsService.start();
    };
  
    startConnection().catch(console.error);
  
    return () => {
      console.log("Stopping EventsService...");
      EventsService.stop(); // graceful shutdown
    };
  }, []);

  const header =() =>
  {
    return(
      <header>   
      <nav className="navbar navbar-expand-lg bg-dark px-3 py-3">      
        <div className="container-fluid d-flex justify-content-between align-items-center text-white">        
          <div className="d-flex align-items-start">
            <img
              src="/OrderManager.png"
              alt="Logo"
              width={60}
              height={60}
              className="me-3"/>
            <div>
              <a href="/" className="text-white me-3 text-decoration-none">
                <h2 className="text-white mb-1">Order Manager</h2>
              </a>
              <div>
                <Link to="/" className="text-white me-3 text-decoration-none">
                  Home
                </Link>
                <Link to="/products" className="text-white me-3 text-decoration-none">
                  Products
                </Link>
                <Link to="/about" className="text-white me-3 text-decoration-none">
                  About
                </Link>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <h3 className="mb-0">
              <ApiStatus />
            </h3>
          </div>
      </div>
        
      </nav>        
    </header>


    );


  }

  const footer =()=>{

    return (
        <footer className="bg-dark text-white mt-5 py-4">

        <div className="mx-auto" style={{ maxWidth: "900px" }}>

          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          {/* Left: Branding */}
          <div className="mb-3 mb-md-0">
          <strong>Order Manager</strong> -  {new Date().getFullYear()}
          </div>

          {/* Center: Links */}
            <div className="mb-3 mb-md-0">
                <Link to="/" className="text-white text-decoration-none me-3">
                    Home
                </Link>
                <Link to="/products" className="text-white text-decoration-none me-3">
                    Products
                </Link>
                <Link to="/about" className="text-white text-decoration-none  me-3">
                    About
                </Link>
                <a href="/swagger" className="text-white text-decoration-none  me-3">
                    swagger
                </a>


            </div>


          {/* Right: Status or contact */}
          <div>
           <small><a href="https://github.com/Joe-Bourne">Joe Bourne</a></small>
          </div>
          </div>
          </div>
        </footer>
    )
  }


  return (    
    <div className="d-flex flex-column vh-100">      
        
        
        {header()}
        
        
        <main className="flex-grow-1 p-4">          
          {children}
          <Toaster/>
        </main>
        {footer()}
      </div>
    );

};

export default Layout;
