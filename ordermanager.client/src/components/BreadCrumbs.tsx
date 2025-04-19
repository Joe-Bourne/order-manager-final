import { Link } from 'react-router-dom';

const Breadcrumbs = () => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>        
        {/* <li className="breadcrumb-item active" aria-current="page">
          Customer Orders
        </li> */}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
