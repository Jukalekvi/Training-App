import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { TextField } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const API_URL = "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        if (data._embedded && Array.isArray(data._embedded.customers)) {
          const customersWithIds = data._embedded.customers.map((customer, index) => ({
            ...customer,
            id: customer.id || index + 1,
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
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);
  };

  const columns = [
    { headerName: "First Name", field: "firstname", flex: 1 },
    { headerName: "Last Name", field: "lastname", flex: 1 },
    { headerName: "Email", field: "email", flex: 1 },
    { headerName: "Phone", field: "phone", flex: 1 },
  ];

  return (
    <div 
      className="customer-list-container"
      style={{
        display: 'flex', // Lisätään flexbox, jotta voidaan keskittää
        flexDirection: 'column',
        alignItems: 'center', // Keskitetään sisällön leveyden mukaan
        justifyContent: 'flex-start',
        maxWidth: '1200px', // Maksimileveys, kuten TrainingListissä
        width: '100%', // Skaalautuu 100% leveydelle
        margin: 'auto', // Keskitetään säiliö
        padding: '20px', // Lisää tilaa säiliön sisällä
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
          marginBottom: '20px', // Lisää väliä gridin ja hakukentän väliin
        }}
      />

      {/* AG-Grid asiakkaista */}
      <div
        className="customer-data-grid ag-theme-alpine"
        style={{
          width: '100%', // Skaalaa grid koko parent-elementin leveyden mukaan
          maxWidth: '100%', // Varmistetaan, että se ei mene yli
          height: '450px', // Korkeus kiinteäksi
          paddingTop: '10px', // Pieni väli ylhäältä
        }}
      >
        <AgGridReact
          rowData={customers}
          columnDefs={columns}
          pagination={false}
          paginationPageSize={10}
          paginationPageSizeOptions={[10, 20, 50, 100]}
          domLayout="normal" // Jätä "autoHeight" pois, kun haluat kontrolloida kokoa
          quickFilterText={search}
        />
      </div>
    </div>
  );
};

export default CustomerList;
