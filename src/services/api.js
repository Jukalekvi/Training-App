const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/'; // API:n URL

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

// POST: Lisää koulutus
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
