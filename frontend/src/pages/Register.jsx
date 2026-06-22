// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

export default function Register({ isDarkMode }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = {
    background: isDarkMode ? '#121212' : '#ffffff',
    textMain: isDarkMode ? '#f8f9fa' : '#111111',
    textSecondary: isDarkMode ? '#adb5bd' : '#666666',
    cardBg: isDarkMode ? '#1e1e1e' : '#f8f9fa',
    border: isDarkMode ? '1px solid #333' : '1px solid #eaeaea',
    inputBg: isDarkMode ? '#2b2b2b' : '#ffffff',
    inputColor: isDarkMode ? '#f8f9fa' : '#111111',
    inputBorder: isDarkMode ? '1px solid #444' : '1px solid #ccc',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(username, password);
      setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Ese nombre de usuario ya está en uso. Prueba con otro.');
      } else {
        setError('Error de conexión. ¿Está el servidor activo?');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: theme.inputBorder,
    backgroundColor: theme.inputBg,
    color: theme.inputColor,
    boxSizing: 'border-box',
    fontSize: '1rem',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: theme.background,
      color: theme.textMain,
      padding: '40px 0'
    }}>
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '40px',
        borderRadius: '10px',
        border: theme.border,
        width: '100%',
        maxWidth: '450px',
        boxShadow: isDarkMode ? '0 8px 20px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2rem' }}>Únete a VrakBen</h2>
        <p style={{ textAlign: 'center', color: theme.textSecondary, marginBottom: '30px' }}>
          Crea tu cuenta para acceder a todos los servicios
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Nombre de Usuario
            </label>
            <input
              type="text"
              placeholder="Ej. juanperez"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Crea una contraseña segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Mensajes de error / éxito */}
          {error && (
            <p style={{ color: '#e63946', textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>
              ❌ {error}
            </p>
          )}
          {success && (
            <p style={{ color: '#2dc653', textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>
              ✅ {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '15px',
              backgroundColor: loading ? '#555' : '#e63946',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', color: theme.textSecondary }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ color: '#e63946', textDecoration: 'none', fontWeight: 'bold' }}>
            Ingresa aquí
          </Link>
        </p>
      </div>
    </div>
  );
}