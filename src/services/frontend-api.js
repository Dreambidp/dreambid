import axios from 'axios';
import { API_BASE_URL } from './apiConfig.js';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Properties API
export const propertiesAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
};

// Enquiries API
export const enquiriesAPI = {
  create: (data) => api.post('/enquiries', data),
};

// Interests API
export const interestsAPI = {
  track: (data) => api.post('/interests', data),
};

export default api;

