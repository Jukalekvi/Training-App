import React, { useState } from 'react';
import './AddCustomerPage.css'; // Tämä on valinnainen, jos haluat lisätä tyylejä

const AddCustomerPage = () => {
  // Tilat asiakkaan tietojen tallentamista varten
  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: '',
  });

  // Käsitellään lomakkeen kenttien muutokset
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  // Käsitellään lomakkeen lähetys
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Lähetetään asiakkaan tiedot API:lle
      const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: customer.firstname,
          lastname: customer.lastname,
          streetaddress: customer.streetaddress,
          postcode: customer.postcode,
          city: customer.city,
          email: customer.email,
          phone: customer.phone,
        }),
      });

      if (response.ok) {
        // Onnistunut pyyntö
        const data = await response.json();
        console.log('New customer added:', data);

        // Tyhjennetään lomakkeen kentät
        setCustomer({
          firstname: '',
          lastname: '',
          streetaddress: '',
          postcode: '',
          city: '',
          email: '',
          phone: '',
        });

        alert('Customer added successfully!');
      } else {
        // Virhe pyynnön käsittelyssä
        console.error('Failed to add customer');
        alert('Failed to add customer. Please try again.');
      }
    } catch (error) {
      // Virhe yhteydessä palvelimeen
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="add-customer-container">
      <h1>Add New Customer</h1>
      <form onSubmit={handleSubmit} className="customer-form">
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={customer.firstname}
            onChange={handleChange}
            required
            placeholder="Enter customer's first name"
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={customer.lastname}
            onChange={handleChange}
            required
            placeholder="Enter customer's last name"
          />
        </div>
        <div>
          <label>Street Address:</label>
          <input
            type="text"
            name="streetaddress"
            value={customer.streetaddress}
            onChange={handleChange}
            required
            placeholder="Enter customer's street address"
          />
        </div>
        <div>
          <label>Postcode:</label>
          <input
            type="text"
            name="postcode"
            value={customer.postcode}
            onChange={handleChange}
            required
            placeholder="Enter customer's postcode"
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={customer.city}
            onChange={handleChange}
            required
            placeholder="Enter customer's city"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            required
            placeholder="Enter customer's email"
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            required
            placeholder="Enter customer's phone number"
          />
        </div>
        <button type="submit" className="submit-button">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomerPage;
