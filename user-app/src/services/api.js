import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true // Enable cookie sending
});

// Student API
export const studentAPI = {
  search: (pin, branch, academicYear) => 
    api.get('/students/search', { params: { pin, branch, academicYear } }),
  getById: (id) => api.get(`/students/${id}`),
  getAll: (branch, academicYear, page, limit) =>
    api.get('/students', { params: { branch, academicYear, page, limit } })
};

// Branches API
export const branchAPI = {
  getAll: () => api.get('/branches'),
  getById: (id) => api.get(`/branches/${id}`),
  getByName: (name) => api.get(`/branches/search/${name}`)
};

// Materials API
export const materialAPI = {
  getAll: (branch, semester, subject, page, limit) =>
    api.get('/materials', { params: { branch, semester, subject, page, limit } }),
  getById: (id) => api.get(`/materials/${id}`)
};

// Question Papers API
export const questionPaperAPI = {
  getAll: (branch, semester, academicYear, regulation, examType, page, limit) =>
    api.get('/question-papers', { params: { branch, semester, academicYear, regulation, examType, page, limit } }),
  getById: (id) => api.get(`/question-papers/${id}`)
};

// Announcements API
export const announcementAPI = {
  getAll: (type, page, limit) =>
    api.get('/announcements', { params: { type, page, limit } }),
  getById: (id) => api.get(`/announcements/${id}`)
};

// Carousel API
export const carouselAPI = {
  getAll: () => api.get('/carousel')
};

// Banner API
export const bannerAPI = {
  getActive: () => api.get('/banners')
};

export default api;
