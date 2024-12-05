import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import TrainingList from "./components/TrainingList";
import AddCustomerPage from "./components/AddCustomerPage"; // Tuodaan AddCustomerPage komponentti
import "./App.css"; 

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,  // Käynnistää transitionin tukemisen
        v7_relativeSplatPath: true  // Käyttää uutta suhteellista polkua
      }}
    >
      <div id="root">
        <h1>Welcome to the Personal Trainer App</h1> {/* Tervetuloteksti */}

        {/* Navigointi */}
        <nav>
          <Link to="/customers" className="nav-link">
            Customers
          </Link>
          <Link to="/trainings" className="nav-link">
            Trainings
          </Link>
          <Link to="/add-customer" className="nav-link"> {/* Uusi linkki */}
            Add a new customer
          </Link>
        </nav>

        {/* Reititykset */}
        <Routes>
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/trainings" element={<TrainingList />} />
          <Route path="/add-customer" element={<AddCustomerPage />} /> {/* Reitti AddCustomerPage-sivulle */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
