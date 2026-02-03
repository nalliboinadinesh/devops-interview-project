/**
 * Simple API Client with Axios
 * Makes HTTP calls to unified entity endpoints
 */

import axios from 'axios';
import authClient from './authClient';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = authClient.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Unified API methods for any entity
 */
const api = {
  /**
   * List all records
   * GET /entities/{entity}/list
   */
  list: (entity, sort = '-created_date', page = 1, limit = 100) => {
    return apiClient.get(`/entities/${entity}/list`, {
      params: { sort, page, limit }
    });
  },

  /**
   * Filter records
   * POST /entities/{entity}/filter
   */
  filter: (entity, filters = {}, sort = '-created_date', page = 1, limit = 100) => {
    return apiClient.post(`/entities/${entity}/filter`, {
      filters,
      sort,
      page,
      limit
    });
  },

  /**
   * Get single record
   * GET /entities/{entity}/:id
   */
  getById: (entity, id) => {
    return apiClient.get(`/entities/${entity}/${id}`);
  },

  /**
   * Create record
   * POST /entities/{entity}/create
   */
  create: (entity, data) => {
    return apiClient.post(`/entities/${entity}/create`, data);
  },

  /**
   * Update record
   * PUT /entities/{entity}/:id
   */
  update: (entity, id, data) => {
    return apiClient.put(`/entities/${entity}/${id}`, data);
  },

  /**
   * Delete record
   * DELETE /entities/{entity}/:id
   */
  delete: (entity, id) => {
    return apiClient.delete(`/entities/${entity}/${id}`);
  },

  /**
   * Count records
   * POST /entities/{entity}/count
   */
  count: (entity, filters = {}) => {
    return apiClient.post(`/entities/${entity}/count`, { filters });
  },

  /**
   * Upload file
   * POST /upload
   */
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;
