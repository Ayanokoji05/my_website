import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  verify: () => api.get('/api/auth/verify'),
};

// Blog API
export const blogAPI = {
  getAll: (skip = 0, limit = 10) => api.get(`/api/blogs/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/api/blogs/${id}`),
  create: (data) => api.post('/api/blogs/', data),
  update: (id, data) => api.put(`/api/blogs/${id}`, data),  // ✅ ADD
  delete: (id) => api.delete(`/api/blogs/${id}`),
};

// Research API
export const researchAPI = {
  getAll: () => api.get('/api/research/'),
  getById: (id) => api.get(`/api/research/${id}`),
  create: (data) => api.post('/api/research/', data),
  update: (id, data) => api.put(`/api/research/${id}`, data),  // ✅ ADD
  delete: (id) => api.delete(`/api/research/${id}`),  // ✅ ADD
};

// Papers API
export const papersAPI = {
  getAll: () => api.get('/api/papers/'),
  getById: (id) => api.get(`/api/papers/${id}`),
  create: (data) => api.post('/api/papers/', data),
  update: (id, data) => api.put(`/api/papers/${id}`, data),  // ✅ ADD
  delete: (id) => api.delete(`/api/papers/${id}`),  // ✅ ADD
};

// Contact API
export const contactAPI = {
  send: (data) => api.post('/api/contact/', data),
  getAll: () => api.get('/api/contact/'),
};

export default api;