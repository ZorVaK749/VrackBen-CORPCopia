// src/pages/admin/GestUser.jsx
import { useState } from 'react';
import apiClient from '../../services/apiClient';

export default function GestUser({ isDarkMode }) {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = {
    bg: isDarkMode ? '#121212' : '#f4f7f6',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f8f9fa' : '#212529',
    textMuted: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '1px solid #333' : '1px solid #e9ecef',
    inputBg: isDarkMode ? '#2b2b2b' : '#fff',
    inputBorder: isDarkMode ? '1px solid #444' : '1px solid #ccc',
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await apiClient.get(`/api/auth/users/${search.trim()}`);
      setResult(response.data);
    } catch (err) {
      if (err.response?.status === 404) setError('Usuario no encontrado.');
      else setError('Error al buscar usuario.');
    } finally { setLoading(false); }
  };

  const rolColors = {
    USER:     { color: '#3a86ff', label: 'Cliente' },
    ADMIN:    { color: '#e63946', label: 'Admin' },
    MECANICO: { color: '#f8961e', label: 'Mecánico' },
  };

  return (
    <div style={{ padding: '40px', backgroundColor: theme.bg, color: theme.text, minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '8px' }}>👥 Gestión de Usuarios</h1>
      <p style={{ color: theme.textMuted, marginBottom: '30px' }}>Consulta y administra los usuarios del sistema.</p>

      {/* Buscador */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '30px', maxWidth: '500px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre de usuario..."
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '8px',
            border: theme.inputBorder, backgroundColor: theme.inputBg,
            color: theme.text, fontSize: '1rem'
          }}
        />
        <button type="submit" disabled={loading} style={{
          padding: '12px 20px', backgroundColor: '#3a86ff',
          color: 'white', border: 'none', borderRadius: '8px',
          fontWeight: 'bold', cursor: 'pointer'
        }}>
          {loading ? '...' : '🔍 Buscar'}
        </button>
      </form>

      {error && <p style={{ color: '#e63946' }}>❌ {error}</p>}

      {/* Resultado */}
      {result && (
        <div style={{
          backgroundColor: theme.card, border: theme.border,
          borderRadius: '12px', padding: '25px', maxWidth: '450px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{
              width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#3a86ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
            }}>👤</div>
            <div>
              <h2 style={{ margin: 0 }}>{result.username}</h2>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {(result.roles || []).map(rol => {
                  const info = rolColors[rol] || { color: '#aaa', label: rol };
                  return (
                    <span key={rol} style={{
                      padding: '3px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                      backgroundColor: info.color + '22', color: info.color, border: `1px solid ${info.color}44`
                    }}>
                      {info.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <p style={{ color: theme.textMuted, margin: 0, fontSize: '0.9rem' }}>
            💡 Para cambiar roles, edita el usuario directamente en la base de datos o usa el endpoint de administración.
          </p>
        </div>
      )}

      {/* Info box */}
      <div style={{
        marginTop: '40px', padding: '20px', borderRadius: '10px',
        backgroundColor: isDarkMode ? '#1a2332' : '#e8f4fd',
        border: '1px solid #3a86ff44', maxWidth: '600px'
      }}>
        <p style={{ margin: 0, color: theme.textMuted, fontSize: '0.9rem', lineHeight: '1.6' }}>
          <strong style={{ color: '#3a86ff' }}>ℹ️ Info:</strong> Los roles disponibles son <code>USER</code> (Cliente), <code>MECANICO</code> y <code>ADMIN</code>.
          Para asignar roles a un usuario, el endpoint de registro acepta el campo <code>roles</code> como un arreglo de strings.
        </p>
      </div>
    </div>
  );
}
