import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setsApi = {
  getAll: () => apiClient.get('/sets'),
  getById: (id) => apiClient.get(`/sets/${id}`),
  create: (data) => apiClient.post('/sets', data),
  update: (id, data) => apiClient.put(`/sets/${id}`, data),
  delete: (id) => apiClient.delete(`/sets/${id}`),
  getStudyCards: (id) => apiClient.get(`/sets/${id}/study`),
};

export default apiClient;