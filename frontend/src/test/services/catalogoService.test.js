// src/test/services/catalogoService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  obtenerProductos,
  obtenerProductoPorSku,
  crearProducto,
  subirImagenProducto,
} from '../../services/catalogoService';

vi.mock('../../services/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import apiClient from '../../services/apiClient';

const productoMock = {
  id: 1,
  sku: 'FILT-001',
  name: 'Filtro de Aceite Premium',
  brand: 'Bosch',
  category: 'Filtros',
  price: 12990,
  stock: 50,
  imageUrl: 'http://localhost:8084/images/product-FILT-001.jpg',
};

describe('catalogoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('obtenerProductos', () => {
    it('retorna lista de productos del catálogo', async () => {
      apiClient.get.mockResolvedValue({ data: [productoMock] });

      const result = await obtenerProductos();

      expect(apiClient.get).toHaveBeenCalledWith('/api/catalog/all');
      expect(result).toHaveLength(1);
      expect(result[0].sku).toBe('FILT-001');
    });

    it('retorna lista vacía si el catálogo no tiene productos', async () => {
      apiClient.get.mockResolvedValue({ data: [] });

      const result = await obtenerProductos();

      expect(result).toHaveLength(0);
    });
  });

  describe('obtenerProductoPorSku', () => {
    it('retorna el producto correcto por SKU', async () => {
      apiClient.get.mockResolvedValue({ data: productoMock });

      const result = await obtenerProductoPorSku('FILT-001');

      expect(apiClient.get).toHaveBeenCalledWith('/api/catalog/FILT-001');
      expect(result.name).toBe('Filtro de Aceite Premium');
    });

    it('propaga error si el SKU no existe', async () => {
      apiClient.get.mockRejectedValue(new Error('Producto no encontrado'));

      await expect(obtenerProductoPorSku('SKU-INVALID')).rejects.toThrow('Producto no encontrado');
    });
  });

  describe('crearProducto', () => {
    it('crea un nuevo producto y retorna la entidad persistida', async () => {
      const nuevoProducto = { sku: 'BUJA-010', name: 'Bujía NGK', price: 4990 };
      apiClient.post.mockResolvedValue({ data: { ...nuevoProducto, id: 2 } });

      const result = await crearProducto(nuevoProducto);

      expect(apiClient.post).toHaveBeenCalledWith('/api/catalog/create', nuevoProducto);
      expect(result.id).toBe(2);
    });
  });

  describe('subirImagenProducto', () => {
    it('envía la imagen como multipart/form-data con el SKU correcto', async () => {
      const fakeFile = new File(['img'], 'foto.jpg', { type: 'image/jpeg' });
      apiClient.post.mockResolvedValue({ data: { ...productoMock, imageUrl: 'http://localhost:8084/images/foto.jpg' } });

      await subirImagenProducto('FILT-001', fakeFile);

      const [url, formData, config] = apiClient.post.mock.calls[0];
      expect(url).toBe('/api/catalog/upload/FILT-001');
      expect(formData).toBeInstanceOf(FormData);
      expect(config.headers['Content-Type']).toBe('multipart/form-data');
    });
  });
});
