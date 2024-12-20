const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'; // API:n URL ilman ylimääräistä vinoviivaa

// GET: Hae kaikki harjoitukset
export const getTrainings = async () => {
  const response = await fetch(`${BASE_URL}/trainings`);
  if (!response.ok) {
    throw new Error(`Failed to fetch trainings: ${response.statusText}`);
  }
  return response.json();
};

// DELETE: Poista harjoitus
export const deleteTraining = async (trainingId) => {
  const response = await fetch(`${BASE_URL}/trainings/${trainingId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete training: ${response.statusText}`);
  }
  return response.json();
};

// POST: Lisää uusi harjoitus
export const addTraining = async (trainingData) => {
  const response = await fetch(`${BASE_URL}/trainings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trainingData),
  });

  if (!response.ok) {
    throw new Error(`Failed to add training: ${response.statusText}`);
  }
  return response.json();
};

// GET: Hae kaikki asiakkaat
export const getCustomers = async () => {
  const response = await fetch(`${BASE_URL}/customers`);
  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.statusText}`);
  }
  return response.json();
};

// GET: Hae asiakas harjoituksesta
export const getCustomerForTraining = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { firstname: 'Unknown', lastname: 'Customer' }; // Varatieto
  }
};

// POST: Lisää asiakas
export const addCustomer = async (customerData) => {
  const response = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    throw new Error(`Failed to add customer: ${response.statusText}`);
  }
  return response.json();
};

// GET: Hae asiakas
export const getCustomer = async (id) => {
  const response = await fetch(`${BASE_URL}/customers/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch customer');
  }
  return await response.json();
};

// PUT: Päivitä asiakas
export const updateCustomer = async (url, customerData) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update customer: ${errorText}`);
  }

  return await response.json();
};

// DELETE: Poista asiakas
export const deleteCustomer = async (customerId) => {
  const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete customer: ${response.statusText}`);
  }
  return response.json();
};
