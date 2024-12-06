import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { TextField, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom'; 
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { deleteCustomer, getCustomers } from '../services/api'; 

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openDialog, setOpenDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        if (data._embedded && Array.isArray(data._embedded.customers)) {
          const customersWithIds = data._embedded.customers.map((customer, index) => ({
            ...customer,
            id: customer.id || index + 1, // Luo id automaattisesti, jos puuttuu
          }));
          setCustomers(customersWithIds);
          setFilteredCustomers(customersWithIds); 
        } else {
          showSnackbar('Failed to load customers. Data is malformed.', 'error');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        showSnackbar('Failed to fetch customers. Please try again.', 'error');
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);

    const filtered = customers.filter(customer =>
      Object.values(customer).some(value =>
        value && value.toString().toLowerCase().includes(searchValue)
      )
    );

    setFilteredCustomers(filtered);
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;

    try {
      const customerUrl = customerToDelete._links.self.href;

      const response = await fetch(customerUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete customer: ${response.statusText} - ${errorMessage}`);
      }

      setCustomers((prevCustomers) => {
        const updatedCustomers = prevCustomers.filter((customer) => customer.id !== customerToDelete.id);
        setFilteredCustomers(updatedCustomers); 
        return updatedCustomers;
      });

      console.log('Customer deleted successfully');
      showSnackbar('Customer deleted successfully', 'success');
      setOpenDialog(false); 
    } catch (error) {
      console.error("Error deleting customer:", error);
      showSnackbar('Failed to delete customer. Please try again.', 'error');
      setOpenDialog(false); 
    }
  };

  const columns = [
    { headerName: 'First Name', field: 'firstname', flex: 1 },
    { headerName: 'Last Name', field: 'lastname', flex: 1 },
    { headerName: 'Street Address', field: 'streetaddress', flex: 1 },
    { headerName: 'Postcode', field: 'postcode', flex: 1 },
    { headerName: 'City', field: 'city', flex: 1 },
    { headerName: 'Email', field: 'email', flex: 1 },
    { headerName: 'Phone', field: 'phone', flex: 1 },
    {
      headerName: 'Actions',
      cellRenderer: (params) => {
        const selfHref = params.data._links?.self?.href || '';
        const customerId = selfHref.split('/').pop();

        return (
          <div>
            <Button
              color="error"
              onClick={() => {
                setCustomerToDelete(params.data); 
                setOpenDialog(true);
              }}
            >
              <DeleteIcon />
            </Button>

            <Link to={`/edit-customer/${customerId}`}>
              <Button color="primary" style={{ marginLeft: 10 }}>
                <EditIcon />
              </Button>
            </Link>
          </div>
        );
      },
      flex: 1,
    },
  ];

  return (
    <div
      className="customer-list-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        maxWidth: '1200px',
        width: '100%',
        margin: 'auto',
        padding: '20px',
      }}
    >
      <h2 className="customer-list-title" style={{ textAlign: 'center', marginBottom: '20px' }}>Customers</h2>

      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        fullWidth
        className="customer-search-field"
        style={{ marginBottom: '20px' }}
      />

      <div
        className="customer-data-grid ag-theme-alpine"
        style={{
          width: '100%',
          maxWidth: '100%',
          height: '450px',
          paddingTop: '10px',
          borderRadius: '10px',
        }}
      >
        <AgGridReact
          rowData={filteredCustomers} 
          columnDefs={columns}
          pagination={false}
          paginationPageSize={10}
        />
      </div>

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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this customer?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerList;
