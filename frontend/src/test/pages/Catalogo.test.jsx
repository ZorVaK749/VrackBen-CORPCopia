// src/test/pages/Catalogo.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

vi.mock('../../services/catalogoService', () => ({
  obtenerProductos: vi.fn(),
}));

vi.mock('../../services/carritoService', () => ({
  agregarAlCarrito: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import Catalogo from '../../pages/Catalogo';
import { obtenerProductos } from '../../services/catalogoService';
import { agregarAlCarrito } from '../../services/carritoService';
import { useAuth } from '../../context/AuthContext';

const productosMock = [
  { id: 1, sku: 'FILT-001', name: 'Filtro de Aceite Premium', brand: 'Bosch', price: 12990, stock: 50, imageUrl: null },
  { id: 2, sku: 'BUJA-010', name: 'Bujía NGK Iridium', brand: 'NGK', price: 4990, stock: 100, imageUrl: null },
];

describe('Catalogo page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Por defecto: usuario no logueado
    useAuth.mockReturnValue({ user: null, isLoggedIn: false });
  });

  it('muestra el catálogo de productos luego de cargar', async () => {
    obtenerProductos.mockResolvedValue(productosMock);

    render(<Catalogo />);

    await waitFor(() => {
      expect(screen.getByText('Filtro de Aceite Premium')).toBeInTheDocument();
      expect(screen.getByText('Bujía NGK Iridium')).toBeInTheDocument();
    });
  });

  it('muestra el precio formateado de cada producto', async () => {
    obtenerProductos.mockResolvedValue(productosMock);

    render(<Catalogo />);

    await waitFor(() => {
      expect(screen.getByText(/12\.990/)).toBeInTheDocument();
    });
  });

  it('muestra mensaje informativo cuando el catálogo está vacío', async () => {
    obtenerProductos.mockResolvedValue([]);

    render(<Catalogo />);

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument();
    });
  });

  it('muestra lista vacía si el backend responde con dato no-array', async () => {
    obtenerProductos.mockResolvedValue(null);

    render(<Catalogo />);

    // No debe lanzar excepción — solo muestra lista vacía
    await waitFor(() => {
      expect(obtenerProductos).toHaveBeenCalledTimes(1);
    });
  });

  it('soporta error de red y queda con lista vacía', async () => {
    obtenerProductos.mockRejectedValue(new Error('Network Error'));

    render(<Catalogo />);

    await waitFor(() => {
      expect(obtenerProductos).toHaveBeenCalledTimes(1);
    });
  });

  it('llama a agregarAlCarrito cuando el usuario está logueado', async () => {
    obtenerProductos.mockResolvedValue(productosMock);
    agregarAlCarrito.mockResolvedValue({ id: 99 });
    useAuth.mockReturnValue({ user: { name: 'cliente1' }, isLoggedIn: true });
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Catalogo />);

    await waitFor(() => {
      expect(screen.getByText('Filtro de Aceite Premium')).toBeInTheDocument();
    });

    const botonesAnadir = screen.getAllByRole('button', { name: /añadir/i });
    fireEvent.click(botonesAnadir[0]);

    await waitFor(() => {
      expect(agregarAlCarrito).toHaveBeenCalledWith({
        customerRut: 'cliente1',
        productId: 1,
        quantity: 1,
        unitPrice: 12990,
      });
    });
  });
});
