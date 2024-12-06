import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getCustomers, addTraining } from '../services/api'; // API-toiminnot

const AddTrainingForm = ({ open, onClose, setSnackbarMessage, setOpenSnackbar }) => {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(null);
  const [customers, setCustomersList] = useState([]);

  // Haetaan asiakkaat API:sta
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerData = await getCustomers();
        setCustomersList(customerData._embedded?.customers || []); // Varmistetaan, että asiakkaita on
      } catch (error) {
        console.error('Virhe asiakkaiden haussa:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async () => {
    if (!activity || !duration || !customer || !date) {
      setSnackbarMessage('Täytä kaikki kentät.');
      setOpenSnackbar(true);
      return;
    }

    const trainingData = {
      activity,
      duration: parseInt(duration),
      date: date.toISOString(),
      customer: customer,
    };

    try {
      await addTraining(trainingData);
      setSnackbarMessage('Koulutus lisätty onnistuneesti!');
      setOpenSnackbar(true);
      onClose(); // Suljetaan lomake
    } catch (error) {
      console.error('Virhe koulutuksen lisäämisessä:', error);
      setSnackbarMessage('Virhe koulutuksen lisäämisessä.');
      setOpenSnackbar(true);
    }
  };

  // Suodatetaan tyhjät asiakkaat pois
  const filteredCustomers = customers.filter(
    (customer) => customer.firstname && customer.lastname
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a new training</DialogTitle>
      <DialogContent>
        {/* Aktiviteetti-kenttä */}
        <TextField
          id="activity"
          label="Activity"
          variant="outlined"
          fullWidth
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          style={{ marginBottom: '15px' }}
        />

        {/* Kesto-kenttä */}
        <TextField
          id="duration"
          label="Duration (minuuteissa)"
          variant="outlined"
          type="number"
          fullWidth
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ marginBottom: '15px' }}
        />

        {/* Asiakas-valikko */}
        <TextField
          id="customer"
          select
          label="Customer"
          variant="outlined"
          fullWidth
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          style={{ marginBottom: '15px' }}
        >
          {filteredCustomers.map((customer, index) => (
            <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
              {customer.firstname} {customer.lastname}
            </MenuItem>
          ))}
        </TextField>

        {/* Päivämäärä-kenttä */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            id="training-date"
            label="Date & Time"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            style={{ marginBottom: '15px' }}
          />
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTrainingForm;
