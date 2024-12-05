import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { TextField } from "@mui/material";
import { getTrainings, getCustomers, getCustomerForTraining } from '../services/api'; // Tuodaan API-funktiot
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Haetaan koulutukset ja asiakkaat API:sta
        const trainingData = await getTrainings();
        const customerData = await getCustomers();

        if (trainingData._embedded && Array.isArray(trainingData._embedded.trainings)) {
          // Luodaan asiakastiedot kunkin koulutuksen yhteyteen
          const trainingsWithCustomerInfo = await Promise.all(
            trainingData._embedded.trainings.map(async (training) => {
              let customerName = "Unknown";
              const customerUrl = training._links.customer?.href; // Haetaan asiakaslinkki

              // Haetaan asiakastiedot asiakaslinkistä
              if (customerUrl) {
                try {
                  const customer = await getCustomerForTraining(customerUrl);
                  customerName = `${customer.firstname} ${customer.lastname}`;
                } catch (error) {
                  console.error("Error fetching customer data:", error);
                  customerName = "Error loading customer"; // Jos asiakastietoa ei saada
                }
              }

              // Muotoillaan päivämäärä halutulla tavalla (pp.kk.vvvv hh:mm)
              const formattedDate = new Intl.DateTimeFormat("fi-FI", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(training.date));

              return {
                ...training,
                customerName,
                formattedDate,
              };
            })
          );

          setTrainings(trainingsWithCustomerInfo);
          setFilteredData(trainingsWithCustomerInfo);
        } else {
          console.error("Trainings array is missing in the API response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Tyhjä taulukko varmistaa, että tämä koodi suoritetaan vain kerran

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);

    const filtered = trainings.filter((training) =>
      `${training.activity} ${training.formattedDate} ${training.duration} ${training.customerName}`
        .toLowerCase()
        .includes(searchValue)
    );

    setFilteredData(filtered);
  };

  const columns = [
    { headerName: "Activity", field: "activity", flex: 1 },  // Harjoituksen nimi
    { headerName: "Date", field: "formattedDate", flex: 1 }, // Aika
    { headerName: "Duration (min)", field: "duration", flex: 1 }, // Kesto
    { headerName: "Customer", field: "customerName", flex: 1 }, // Varaaja (asiakas)
  ];

  return (
    <div
      className="training-list-container"
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <h2 className="training-list-title" style={{ textAlign: "center" }}>Trainings</h2>

      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        fullWidth
        className="training-search-field"
        style={{
          marginBottom: "20px",
        }}
      />

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading data...</p>
      ) : (
        <div
          className="ag-theme-alpine"
          style={{
            height: "450px",
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <AgGridReact
            rowData={filteredData}
            columnDefs={columns}
            pagination={false}
            paginationPageSize={10}
            domLayout="normal"
            enableSorting={true}
            enableFilter={true}
          />
        </div>
      )}
    </div>
  );
};

export default TrainingList;
