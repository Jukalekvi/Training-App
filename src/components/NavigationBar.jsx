import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav>
      <Link className="nav-link" to="/trainings">Trainings</Link>
      <Link className="nav-link" to="/customers">Customers</Link>
      <Link className="nav-link" to="/add-customer">Add a new customer</Link>
      <Link className="nav-link" to="/add-training">Add a new training</Link>
    </nav>
  );
};

export default NavigationBar;
