import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jengaco_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jengaco_token');
      localStorage.removeItem('jengaco_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
};

// Jobs
export const jobsAPI = {
  getAll:      (params) => api.get('/jobs', { params }),
  getOne:      (id)     => api.get(`/jobs/${id}`),
  create:      (data)   => api.post('/jobs', data),
  update:      (id, data) => api.put(`/jobs/${id}`, data),
  delete:      (id)     => api.delete(`/jobs/${id}`),
  addImages:   (id, form) => api.post(`/jobs/${id}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (id, data) => api.delete(`/jobs/${id}/images`, { data }),
};

// Bids
export const bidsAPI = {
  submit:     (data)  => api.post('/bids', data),
  getForJob:  (jobId) => api.get(`/bids/job/${jobId}`),
  accept:     (id)    => api.put(`/bids/${id}/accept`),
};

// Payments
export const paymentsAPI = {
  initiate:  (data) => api.post('/payments/initiate', data),
  getStatus: (id)   => api.get(`/payments/status/${id}`),
  getForJob: (jobId) => api.get(`/payments/job/${jobId}`),
};

// Reviews
export const reviewsAPI = {
  create:            (data) => api.post('/reviews', data),
  getForProfessional: (id)  => api.get(`/reviews/professional/${id}`),
  getForJob:         (id)   => api.get(`/reviews/job/${id}`),
};

// Professionals
export const professionalsAPI = {
  list:           (params) => api.get('/professionals', { params }),
  getOne:         (id)     => api.get(`/professionals/${id}`),
  upsertProfile:  (data)   => api.post('/professionals/profile', data),
  addPortfolio:   (form)   => api.post('/professionals/portfolio', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePortfolio:(data)   => api.delete('/professionals/portfolio', { data }),
};

export default api;
