import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { TextField } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const API_URL = "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings";

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const trainingResponse = await fetch(API_URL);
        if (!trainingResponse.ok) {
          throw new Error("Failed to fetch trainings");
        }
        const trainingData = await trainingResponse.json();

        if (trainingData._embedded && Array.isArray(trainingData._embedded.trainings)) {
          const trainingsWithCustomerInfo = await Promise.all(
            trainingData._embedded.trainings.map(async (training) => {
              try {
                const customerUrl = training._links.customer?.href;
                let customerName = "Unknown";

                if (customerUrl) {
                  const customerResponse = await fetch(customerUrl);
                  if (customerResponse.ok) {
                    const customerData = await customerResponse.json();
                    customerName = `${customerData.firstname} ${customerData.lastname}`;
                  }
                }

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
              } catch (error) {
                console.error("Error fetching customer data:", error);
                return {
                  ...training,
                  customerName: "Error loading customer",
                  formattedDate: new Intl.DateTimeFormat("fi-FI", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(training.date)),
                };
              }
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
  }, []);

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
    { headerName: "Activity", field: "activity", flex: 1 },
    { headerName: "Date", field: "formattedDate", flex: 1 },
    { headerName: "Duration (min)", field: "duration", flex: 1 },
    { headerName: "Customer", field: "customerName", flex: 1 },
  ];

  return (
    <div
      className="training-list-container"
      style={{
        width: "100%",
        maxWidth: "1400px", // Leveys kasvattettu
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
            width: "100%", // Päivitetään leveys skaalautuvaksi
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
