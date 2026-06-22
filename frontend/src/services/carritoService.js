// src/services/carritoService.js
import apiClient from './apiClient';

// POST /api/cart/add
// item = { customerRut (o username), productId, quantity, unitPrice }
export const agregarAlCarrito = async (item) => {
  const response = await apiClient.post('/api/cart/add', item);
  return response.data;
};

// GET /api/cart/{rut}
export const obtenerCarrito = async (rutOUsername) => {
  const response = await apiClient.get(`/api/cart/${rutOUsername}`);
  return response.data;
};

// DELETE /api/cart/clear/{rut}
export const vaciarCarrito = async (rutOUsername) => {
  const response = await apiClient.delete(`/api/cart/clear/${rutOUsername}`);
  return response.data;
};
