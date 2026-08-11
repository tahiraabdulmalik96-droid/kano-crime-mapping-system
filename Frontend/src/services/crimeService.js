import API from './api';

// Get all crimes
export const getAllCrimes = async () => {
  const response = await API.get('/crimes');
  return response.data.crimes;
};

// Create crime
export const createCrime = async (crimeData) => {
  const response = await API.post('/crimes', crimeData);
  return response.data;
};

// Get all LGAs
export const getAllLGAs = async () => {
  const response = await API.get('/lgas');
  return response.data.lgas;
};