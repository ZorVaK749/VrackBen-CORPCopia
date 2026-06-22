// src/services/catalogoService.js
import apiClient from './apiClient';

export const obtenerProductos = async () => {
  const response = await apiClient.get('/api/catalog/all');
  return response.data;
};

export const obtenerProductoPorSku = async (sku) => {
  const response = await apiClient.get(`/api/catalog/${sku}`);
  return response.data;
};

export const crearProducto = async (producto) => {
  const response = await apiClient.post('/api/catalog/create', producto);
  return response.data;
};

export const subirImagenProducto = async (sku, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await apiClient.post(`/api/catalog/upload/${sku}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const eliminarProducto = async (sku) => {
  const response = await apiClient.delete(`/api/catalog/${sku}`);
  return response.data;
};

export const actualizarProducto = async (sku, producto) => {
  const response = await apiClient.put(`/api/catalog/update/${sku}`, producto);
  return response.data;
};