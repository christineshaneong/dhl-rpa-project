import axios from 'axios';

const API = axios.create({
  // Back to local!
  baseURL: 'http://localhost:5001', 
});

export const getIncidents = () => API.get('/incidents');
export const createIncident = (data) => API.post('/incidents', data);
export const updateIncident = (id, data) => API.patch(`/incidents/${id}`, data);

export default API;