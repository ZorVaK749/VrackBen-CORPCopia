// src/test/services/carritoService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { agregarAlCarrito, obtenerCarrito, vaciarCarrito } from '../../services/carritoService';

vi.mock('../../services/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from '../../services/apiClient';

const itemMock = {
  customerRut: 'cliente1',
  productId: 10,
  quantity: 1,
  unitPrice: 12990,
};

describe('carritoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('agregarAlCarrito', () => {
    it('llama a POST /api/cart/add con el item correcto', async () => {
      apiClient.post.mockResolvedValue({ data: { id: 1, ...itemMock } });

      const result = await agregarAlCarrito(itemMock);

      expect(apiClient.post).toHaveBeenCalledWith('/api/cart/add', itemMock);
      expect(result.productId).toBe(10);
    });

    it('propaga error si el backend rechaza el item', async () => {
      apiClient.post.mockRejectedValue(new Error('Stock insuficiente'));

      await expect(agregarAlCarrito(itemMock)).rejects.toThrow('Stock insuficiente');
    });
  });

  describe('obtenerCarrito', () => {
    it('llama a GET /api/cart/{username} y retorna los items', async () => {
      const carritoMock = [itemMock];
      apiClient.get.mockResolvedValue({ data: carritoMock });

      const result = await obtenerCarrito('cliente1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/cart/cliente1');
      expect(result).toHaveLength(1);
    });

    it('retorna lista vacía si el carrito está vacío', async () => {
      apiClient.get.mockResolvedValue({ data: [] });

      const result = await obtenerCarrito('cliente1');

      expect(result).toHaveLength(0);
    });
  });

  describe('vaciarCarrito', () => {
    it('llama a DELETE /api/cart/clear/{username}', async () => {
      apiClient.delete.mockResolvedValue({ data: { message: 'Carrito vaciado' } });

      const result = await vaciarCarrito('cliente1');

      expect(apiClient.delete).toHaveBeenCalledWith('/api/cart/clear/cliente1');
      expect(result.message).toBe('Carrito vaciado');
    });
  });
});
