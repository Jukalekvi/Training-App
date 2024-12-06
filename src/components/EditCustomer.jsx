import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { updateCustomer, getCustomer } from '../services/api';

const EditCustomer = () => {
  const { id } = useParams(); // Asiakkaan ID
  const navigate = useNavigate(); // Navigointiin

  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!id) {
      showSnackbar('Invalid customer ID.', 'error');
      return;
    }

    const fetchCustomer = async () => {
      try {
        const data = await getCustomer(id);
        setCustomer({
          firstname: data.firstname,
          lastname: data.lastname,
          streetaddress: data.streetaddress,
          postcode: data.postcode,
          city: data.city,
          email: data.email,
          phone: data.phone,
          _links: data._links,
        });
      } catch (error) {
        console.error('Error fetching customer:', error);
        showSnackbar('Error fetching customer. Please try again later.', 'error');
      }
    };

    fetchCustomer(); // Hae asiakas
  }, [id]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!customer._links || !customer._links.self.href) {
        throw new Error('Customer URL not found');
      }

      await updateCustomer(customer._links.self.href, customer);
      showSnackbar('Customer updated successfully!', 'success');
      navigate('/customers'); // Takaisin asiakaslistaukseen
    } catch (error) {
      console.error('Error updating customer:', error);
      showSnackbar('Failed to update customer. Please try again.', 'error');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Edit Customer</h2>

      <form onSubmit={handleUpdate} noValidate>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          name="firstname"
          value={customer.firstname}
          onChange={handleInputChange}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          name="lastname"
          value={customer.lastname}
          onChange={handleInputChange}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Street Address"
          variant="outlined"
          fullWidth
          name="streetaddress"
          value={customer.streetaddress}
          onChange={handleInputChange}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Postcode"
          variant="outlined"
          fullWidth
          name="postcode"
          value={customer.postcode}
          onChange={handleInputChange}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          name="city"
          value={customer.city}
          onChange={handleInputChange}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={customer.email}
          onChange={handleInputChange}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Phone"
          variant="outlined"
          fullWidth
          name="phone"
          value={customer.phone}
          onChange={handleInputChange}
          style={{ marginBottom: '20px' }}
        />

        <Button
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          style={{ marginBottom: '20px' }}
        >
          Update Customer
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

export default EditCustomer;
