// src/services/apiClient.js
import axios from 'axios';

// URL del backend (ms-catalog Lite en ECS).
// En desarrollo local: http://localhost:8084
// En producción (ECS): URL del ALB del backend, pasada como --build-arg VITE_API_BACKEND_URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:8084',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUEST: inyecta el JWT en cada petición automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPONSE: si el token expiró (401), limpia la sesión
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;