const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'; // API:n URL ilman ylimääräistä vinoviivaa

// GET: Hae kaikki koulutukset
export const getTrainings = async () => {
  const response = await fetch(`${BASE_URL}/trainings`);
  if (!response.ok) {
    throw new Error(`Failed to fetch trainings: ${response.statusText}`);
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

// GET: Hae asiakas koulutuksesta
export const getCustomerForTraining = async (customerUrl) => {
  const response = await fetch(customerUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.statusText}`);
  }
  return response.json();
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
