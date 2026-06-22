// src/test/services/authService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser, registerUser } from '../../services/authService';

// Mock completo del apiClient para que no haga peticiones HTTP reales
vi.mock('../../services/apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

import apiClient from '../../services/apiClient';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginUser', () => {
    it('llama a POST /api/auth/login con usuario y contraseña correctos', async () => {
      const mockResponse = { data: { token: 'jwt-token-123', username: 'testuser', message: 'OK' } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await loginUser('testuser', 'Password.123');

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
        username: 'testuser',
        password: 'Password.123',
      });
      expect(result).toEqual({ token: 'jwt-token-123', username: 'testuser', message: 'OK' });
    });

    it('propaga el error cuando el backend rechaza las credenciales', async () => {
      const error = new Error('Credenciales inválidas');
      apiClient.post.mockRejectedValue(error);

      await expect(loginUser('wronguser', 'wrongpass')).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('registerUser', () => {
    it('llama a POST /api/auth/register con los datos del nuevo usuario', async () => {
      const mockResponse = { data: { message: 'Usuario creado exitosamente' } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await registerUser('nuevouser', 'Password.456');

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register', {
        username: 'nuevouser',
        password: 'Password.456',
      });
      expect(result).toEqual({ message: 'Usuario creado exitosamente' });
    });

    it('propaga el error cuando el usuario ya existe', async () => {
      const error = new Error('El usuario ya existe');
      apiClient.post.mockRejectedValue(error);

      await expect(registerUser('existinguser', 'pass')).rejects.toThrow('El usuario ya existe');
    });
  });
});
