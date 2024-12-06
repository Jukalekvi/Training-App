import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { TextField, Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Tuodaan DeleteIcon
import { getTrainings, getCustomers, getCustomerForTraining, deleteTraining } from '../services/api'; // Tuodaan API-funktiot
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbarin avaus
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbarin viesti
  const [openDialog, setOpenDialog] = useState(false); // Dialogin avaus
  const [trainingToDelete, setTrainingToDelete] = useState(null); // Tallennetaan poistettava harjoitus

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const trainingData = await getTrainings();
        const customerData = await getCustomers();

        if (trainingData._embedded && Array.isArray(trainingData._embedded.trainings)) {
          const trainingsWithCustomerInfo = await Promise.all(
            trainingData._embedded.trainings.map(async (training) => {
              let customerName = "Unknown";
              const customerUrl = training._links?.customer?.href;

              if (customerUrl) {
                try {
                  const customer = await getCustomerForTraining(customerUrl);
                  customerName = `${customer.firstname} ${customer.lastname}`;
                } catch (error) {
                  console.error("Error fetching customer data:", error);
                  customerName = "Error loading customer";
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
                id: training._links?.training?.href.split("/").pop(),
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

  const handleDelete = async () => {
    if (!trainingToDelete) {
      console.error("Invalid training ID, unable to delete.");
      return;
    }

    try {
      await deleteTraining(trainingToDelete);

      setTrainings((prevTrainings) =>
        prevTrainings.filter((training) => training.id !== trainingToDelete)
      );
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((training) => training.id !== trainingToDelete)
      );

      // Asetetaan Snackbar näkyviin poiston jälkeen
      setSnackbarMessage("Training deleted successfully!");
      setOpenSnackbar(true);
      setOpenDialog(false); // Suljetaan dialogi
    } catch (error) {
      console.error("Error deleting training:", error);
      setSnackbarMessage("Error deleting training.");
      setOpenSnackbar(true);
      setOpenDialog(false); // Suljetaan dialogi
    }
  };

  const handleDialogOpen = (trainingId) => {
    setTrainingToDelete(trainingId);
    setOpenDialog(true); // Avaa varmistusdialogi
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Sulkee dialogin ilman toimenpiteitä
  };

  const columns = [
    { headerName: "Activity", field: "activity", flex: 1 },
    { headerName: "Date", field: "formattedDate", flex: 1 },
    { headerName: "Duration (min)", field: "duration", flex: 1 },
    { headerName: "Customer", field: "customerName", flex: 1 },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <Button color="error" onClick={() => handleDialogOpen(params.data.id)}>
          <DeleteIcon />
        </Button>
      ),
      flex: 1,
    },
  ];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div
      className="training-list-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        maxWidth: "1200px",
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

      {/* Snackbar-komponentti */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Pysyy näkyvissä 6 sekuntia
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Varmistusdialogi */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <p>Do you really want to delete this training?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TrainingList;
