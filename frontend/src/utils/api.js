import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blog API calls
export const blogAPI = {
  getAll: (skip = 0, limit = 10) => api.get(`/api/blogs/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/api/blogs/${id}`),
  create: (data) => api.post('/api/blogs/', data),
};

// Research API calls
export const researchAPI = {
  getAll: () => api.get('/api/research/'),
  getById: (id) => api.get(`/api/research/${id}`),
  create: (data) => api.post('/api/research/', data),
};

// Papers API calls
export const papersAPI = {
  getAll: () => api.get('/api/papers/'),
  getById: (id) => api.get(`/api/papers/${id}`),
  create: (data) => api.post('/api/papers/', data),
};

// Contact API calls
export const contactAPI = {
  send: (data) => api.post('/api/contact/', data),
  getAll: () => api.get('/api/contact/'),
};

export default api;