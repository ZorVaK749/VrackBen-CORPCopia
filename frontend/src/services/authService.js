// src/services/authService.js
import apiClient from './apiClient';

/**
 * Llama al endpoint POST /api/auth/login del BFF (API Gateway -> auth-server).
 * Espera recibir { token, username, message } desde el backend.
 */
export const loginUser = async (username, password) => {
  const response = await apiClient.post('/api/auth/login', { username, password });
  return response.data; // { token, username, message }
};

/**
 * Llama al endpoint POST /api/auth/register.
 */
export const registerUser = async (username, password) => {
  const response = await apiClient.post('/api/auth/register', { username, password });
  return response.data;
};
