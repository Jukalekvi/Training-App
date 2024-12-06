import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import TrainingList from "./components/TrainingList";
import AddCustomerPage from "./components/AddCustomerPage";
import EditCustomer from "./components/EditCustomer";
import AddTrainingForm from "./components/AddTrainingForm"; // Lisää tämä komponentti
import "./App.css";

const App = () => {
  // Tilat lomakkeen avaamiseen ja sulkemiseen
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Funktiot lomakkeen avaamiseen ja sulkemiseen
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <Link to="/add-customer" className="nav-link">
            Add a new customer
          </Link>
          <Link to="/add-training" className="nav-link" onClick={handleOpen}>
            Add a new training
          </Link>
        </nav>

        {/* Reititykset */}
        <Routes>
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/trainings" element={<TrainingList />} />
          <Route path="/add-customer" element={<AddCustomerPage />} />
          <Route path="/edit-customer/:id" element={<EditCustomer />} />
          <Route
            path="/add-training"
            element={
              <AddTrainingForm
                open={open}  // Tässä annetaan open-proppi
                onClose={handleClose}  // Tämä sulkee lomakkeen
                setSnackbarMessage={setSnackbarMessage}
                setOpenSnackbar={setOpenSnackbar}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
