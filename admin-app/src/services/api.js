import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true // Enable cookie sending
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendOTP: (email) =>
    api.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp) =>
    api.post('/auth/verify-otp', { email, otp }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  refreshToken: (token) =>
    api.post('/auth/refresh', { refreshToken: token }),
  logout: () => api.post('/auth/logout')
};

// Student API
export const studentAPI = {
  getAll: (branch, academicYear, page, limit) =>
    api.get('/students', { params: { branch, academicYear, page, limit } }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  search: (pin, branch, academicYear) =>
    api.get('/students/search', { params: { pin, branch, academicYear } })
};

// Branch API
export const branchAPI = {
  getAll: () => api.get('/branches'),
  getById: (id) => api.get(`/branches/${id}`),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
  delete: (id) => api.delete(`/branches/${id}`)
};

// Material API
export const materialAPI = {
  getAll: (branch, semester, subject, page, limit) =>
    api.get('/materials', { params: { branch, semester, subject, page, limit } }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`)
};

// Question Paper API
export const questionPaperAPI = {
  getAll: (branch, semester, academicYear, regulation, examType, page, limit) =>
    api.get('/question-papers', { params: { branch, semester, academicYear, regulation, examType, page, limit } }),
  getById: (id) => api.get(`/question-papers/${id}`),
  create: (data) => api.post('/question-papers', data),
  update: (id, data) => api.put(`/question-papers/${id}`, data),
  delete: (id) => api.delete(`/question-papers/${id}`)
};

// Announcement API
export const announcementAPI = {
  getAll: (type, page, limit) =>
    api.get('/announcements', { params: { type, page, limit } }),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`)
};

// Carousel API
export const carouselAPI = {
  getAll: () => api.get('/carousel'),
  create: (data) => api.post('/carousel', data),
  update: (id, data) => api.put(`/carousel/${id}`, data),
  delete: (id) => api.delete(`/carousel/${id}`)
};

// Banner API
export const bannerAPI = {
  getAll: () => api.get('/banners/admin/all'),
  getActive: () => api.get('/banners'),
  create: (data) => api.post('/banners', data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`)
};

export default api;
