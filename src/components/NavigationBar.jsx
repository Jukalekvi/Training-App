import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav>
      <a className="nav-link" href="/trainings">Trainings</a>
      <a className="nav-link" href="/customers">Customers</a>
      <a className="nav-link" href="/add-customer">Add a new customer</a>
    </nav>
  );
};

export default NavigationBar;