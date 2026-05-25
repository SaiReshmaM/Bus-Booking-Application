import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor to add JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },
};

export const busAPI = {
  getAll: async () => {
    const response = await API.get('/buses');
    return response.data;
  },
  getBusById: async (id) => {
    const response = await API.get(`/buses/${id}`);
    return response.data;
  },
  search: async (source, destination, date) => {
    const response = await API.get('/buses/search', {
      params: { source, destination, date },
    });
    return response.data;
  },
};

export const seatAPI = {
  getSeats: async (busId) => {
    const response = await API.get(`/seats/${busId}`);
    return response.data;
  },
};

export const bookingAPI = {
  create: async (bookingData) => {
    const response = await API.post('/bookings', bookingData);
    return response.data;
  },
  getByUser: async (userId) => {
    const response = await API.get(`/bookings/user/${userId}`);
    return response.data;
  },
  cancel: async (bookingId) => {
    const response = await API.put(`/bookings/cancel/${bookingId}`);
    return response.data;
  },
};

export const adminAPI = {
  getBuses: async () => {
    const response = await API.get('/admin/buses');
    return response.data;
  },
  addBus: async (busData) => {
    const response = await API.post('/admin/buses', busData);
    return response.data;
  },
  updateBus: async (id, busData) => {
    const response = await API.put(`/admin/buses/${id}`, busData);
    return response.data;
  },
  deleteBus: async (id) => {
    const response = await API.delete(`/admin/buses/${id}`);
    return response.data;
  },
  getBookings: async () => {
    const response = await API.get('/admin/bookings');
    return response.data;
  },
};

export default API;
