// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import { Lock, User } from 'lucide-react';

export default function Login({ isDarkMode }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  // Decodifica el payload del JWT sin verificar firma (solo para lectura del rol en el cliente)
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      // data = { token, username, message }

      // Decodificamos el JWT para saber el rol real
      const payload = parseJwt(data.token);
      // El auth-server puede guardar el rol como 'roles', 'role', o 'authorities'
      const rawRoles = payload.roles || payload.role || payload.authorities || [];
      const rolesArr = Array.isArray(rawRoles) ? rawRoles : [rawRoles];
      
      // Determinamos el rol principal para el routing
      let role = 'CLIENTE';
      const rolesUpper = rolesArr.map(r => (typeof r === 'string' ? r : r.authority || '').toUpperCase());
      if (rolesUpper.some(r => r.includes('ADMIN'))) role = 'ADMIN';
      else if (rolesUpper.some(r => r.includes('MECANICO') || r.includes('MECHANIC'))) role = 'MECANICO';

      const userData = { name: data.username, role };
      login(userData, data.token);

      // Redirige según rol (diagrama de flujo UML)
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'MECANICO') navigate('/mecanico');
      else navigate('/perfil');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('Error de conexión. ¿Está el servidor activo?');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: theme.inputBg,
    color: theme.inputColor,
    border: theme.inputBorder,
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: theme.background,
      color: theme.textMain
    }}>
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '40px',
        borderRadius: '10px',
        border: theme.border,
        width: '100%',
        maxWidth: '420px',
        boxShadow: isDarkMode ? '0 8px 20px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2rem' }}>
          Bienvenido de vuelta
        </h2>
        <p style={{ textAlign: 'center', color: theme.textSecondary, marginBottom: '30px' }}>
          Ingresa tus credenciales para continuar
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Campo usuario */}
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ ...inputStyle, paddingLeft: '38px' }}
            />
          </div>

          {/* Campo contraseña */}
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingLeft: '38px' }}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <p style={{ color: '#e63946', textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>
              {error}
            </p>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              backgroundColor: loading ? '#555' : '#3a86ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}