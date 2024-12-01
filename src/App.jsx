import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import TrainingList from "./components/TrainingList";
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
          {/* Käytä Link-komponenttia suoraan ilman button-elementtiä */}
          <Link to="/customers" className="nav-link">
            Customers
          </Link>
          <Link to="/trainings" className="nav-link">
            Trainings
          </Link>
        </nav>

        {/* Reititykset */}
        <Routes>
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/trainings" element={<TrainingList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
