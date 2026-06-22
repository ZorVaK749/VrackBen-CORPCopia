// src/test/pages/Login.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mocks necesarios para renderizar el componente
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

vi.mock('../../services/authService', () => ({
  loginUser: vi.fn(),
}));

import Login from '../../pages/Login';

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el título de bienvenida', () => {
    render(<Login />);
    expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument();
  });

  it('renderiza los campos de usuario y contraseña', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Nombre de usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
  });

  it('renderiza el botón de inicio de sesión', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('actualiza el valor del campo usuario al escribir', async () => {
    render(<Login />);
    const inputUsuario = screen.getByPlaceholderText('Nombre de usuario');
    fireEvent.change(inputUsuario, { target: { value: 'cliente1' } });
    expect(inputUsuario.value).toBe('cliente1');
  });

  it('actualiza el valor del campo contraseña al escribir', async () => {
    render(<Login />);
    const inputPass = screen.getByPlaceholderText('Contraseña');
    fireEvent.change(inputPass, { target: { value: 'Password.123' } });
    expect(inputPass.value).toBe('Password.123');
  });

  it('muestra "Iniciando sesión..." en el botón mientras carga', async () => {
    const { loginUser } = await import('../../services/authService');
    loginUser.mockImplementation(() => new Promise(() => {})); // Promise que nunca resuelve

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Nombre de usuario'), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'pass' } });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error cuando el login falla con 401', async () => {
    const { loginUser } = await import('../../services/authService');
    const error = new Error('Unauthorized');
    error.response = { status: 401 };
    loginUser.mockRejectedValue(error);

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Nombre de usuario'), { target: { value: 'bad' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'bad' } });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeInTheDocument();
    });
  });

  it('muestra error de conexión cuando el servidor no responde', async () => {
    const { loginUser } = await import('../../services/authService');
    loginUser.mockRejectedValue(new Error('Network Error'));

    render(<Login />);
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Error de conexión. ¿Está el servidor activo?')).toBeInTheDocument();
    });
  });
});
