import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { deleteCustomer, getCustomers } from '../services/api';  // Tuodaan deleteCustomer ja getCustomers api.js:stä

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  // Ladataan asiakkaat API:sta
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();  // Käytetään getCustomers API-funktiota
        if (data._embedded && Array.isArray(data._embedded.customers)) {
          const customersWithIds = data._embedded.customers.map((customer, index) => ({
            ...customer,
            id: customer.id || index + 1, // Jos id puuttuu, luodaan se automaattisesti
          }));
          setCustomers(customersWithIds);
        } else {
          console.error("Data does not contain customers list", data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);  // Lähetetään requesti vain kerran komponentin latautuessa

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);  // Tallennetaan hakusanat tilaan
  };

  const handleDelete = async (customerId) => {
    try {
      console.log("Deleting customer with id:", customerId);
      await deleteCustomer(customerId);  // Poista asiakas
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== customerId)); // Päivitä asiakaslista
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Päivitetään sarakeotsikot ja kentät
  const columns = [
    { headerName: "First Name", field: "firstname", flex: 1 },
    { headerName: "Last Name", field: "lastname", flex: 1 },
    { headerName: "Street Address", field: "streetaddress", flex: 1 },
    { headerName: "Postcode", field: "postcode", flex: 1 },
    { headerName: "City", field: "city", flex: 1 },
    { headerName: "Email", field: "email", flex: 1 },
    { headerName: "Phone", field: "phone", flex: 1 },
    {
      headerName: "Actions", 
      cellRenderer: (params) => (
        <Button color="error" onClick={() => handleDelete(params.data.id)}>
          <DeleteIcon />
        </Button>
      ),
      flex: 1
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
      <h2 className="customer-list-title" style={{ textAlign: 'center' }}>Customers</h2>

      {/* Hakukenttä */}
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        fullWidth
        className="customer-search-field"
        style={{
          marginBottom: '20px',
        }}
      />

      {/* AG-Grid asiakkaista */}
      <div
        className="customer-data-grid ag-theme-alpine"
        style={{
          width: '100%',
          maxWidth: '100%',
          height: '450px',
          paddingTop: '10px',
        }}
      >
        <AgGridReact
          rowData={customers}
          columnDefs={columns}
          pagination={false}
          paginationPageSize={10}
          quickFilterText={search}  // Tämä yhdistää hakukentän AG-Gridin sisäiseen suodattimeen
        />
      </div>
    </div>
  );
};

export default CustomerList;
