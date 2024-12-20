import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';

const AddCustomerPage = () => {
  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Lomakekenttien muutoksen käsittely
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  // Lomakkeen lähetyksen käsittely
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customer),
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Customer added successfully!',
          severity: 'success',
        });
        setCustomer({
          firstname: '',
          lastname: '',
          streetaddress: '',
          postcode: '',
          city: '',
          email: '',
          phone: '',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to add customer. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred. Please try again.',
        severity: 'error',
      });
    }
  };

  const closeSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Add New Customer</h2>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          name="firstname"
          value={customer.firstname}
          onChange={handleChange}
          style={{ marginBottom: '20px' }}
          required
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          name="lastname"
          value={customer.lastname}
          onChange={handleChange}
          style={{ marginBottom: '20px' }}
          required
        />
        <TextField
          label="Street Address"
          variant="outlined"
          fullWidth
          name="streetaddress"
          value={customer.streetaddress}
          onChange={handleChange}
          style={{ marginBottom: '20px' }}
          required
        />
        <TextField
          label="Postcode"
          variant="outlined"
          fullWidth
          name="postcode"
          value={customer.postcode}
          onChange={handleChange}
          style={{ marginBottom: '20px' }}
          required
        />
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          name="city"
          value={customer.city}
          onChange={handleChange}
          style={{ marginBottom: '20px' }}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={customer.email}
          onChange={handleChange}
          style={{ marginBottom: '20px' }}
          required
        />
        <TextField
          label="Phone"
          variant="outlined"
          fullWidth
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          style={{ marginBottom: '20px' }}
          required
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          style={{ marginBottom: '20px' }}
        >
          Add Customer
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddCustomerPage;
