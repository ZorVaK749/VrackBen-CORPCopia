// src/pages/admin/GestSolicitudes.jsx
import { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

export default function GestSolicitudes({ isDarkMode }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState('');

  const theme = {
    bg: isDarkMode ? '#121212' : '#f4f7f6',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f8f9fa' : '#212529',
    textMuted: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '1px solid #333' : '1px solid #e9ecef',
  };

  const cargar = async () => {
    setCargando(true);
    try {
      const response = await apiClient.get('/api/procurement/all');
      setSolicitudes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error al cargar solicitudes', err);
      setSolicitudes([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/api/procurement/status/${id}?status=${newStatus}`);
      setMsg(`✅ Solicitud #${id} actualizada a ${newStatus}`);
      cargar(); // Recargar la tabla
    } catch (err) {
      setMsg('❌ Error al actualizar la solicitud');
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: theme.bg, color: theme.text, minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ margin: 0 }}>📦 Solicitudes de Suministros (Mecánicos)</h1>
        <button onClick={cargar} style={{
          padding: '10px 20px', backgroundColor: '#3a86ff', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          ↻ Recargar
        </button>
      </div>
      <p style={{ color: theme.textMuted, marginBottom: '30px' }}>Atiende las solicitudes de material de los mecánicos para mantener el taller abastecido.</p>

      {msg && <div style={{ padding: '15px', backgroundColor: msg.includes('✅') ? '#38b00022' : '#e6394622', color: msg.includes('✅') ? '#38b000' : '#e63946', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${msg.includes('✅') ? '#38b000' : '#e63946'}44` }}>{msg}</div>}

      {/* Tabla de solicitudes */}
      {cargando ? (
        <p style={{ color: theme.textMuted }}>Cargando solicitudes... ⚙️</p>
      ) : solicitudes.length === 0 ? (
        <p style={{ color: '#3a86ff' }}>No hay solicitudes de suministro registradas.</p>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: theme.card, borderRadius: '12px', border: theme.border }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: isDarkMode ? '#2b2b2b' : '#f8f9fa' }}>
                {['ID', 'Fecha', 'SKU Solicitado', 'Cantidad', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '15px 16px', textAlign: 'left', borderBottom: theme.border, color: theme.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id} style={{ borderBottom: theme.border }}>
                  <td style={{ padding: '15px 16px', fontWeight: 'bold' }}>#{s.id}</td>
                  <td style={{ padding: '15px 16px', color: theme.textMuted }}>{new Date(s.orderDate).toLocaleString('es-CL')}</td>
                  <td style={{ padding: '15px 16px', fontFamily: 'monospace', color: '#3a86ff' }}>{s.productSku}</td>
                  <td style={{ padding: '15px 16px', fontWeight: 'bold' }}>{s.quantity} u.</td>
                  <td style={{ padding: '15px 16px' }}>
                    <span style={{
                      padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                      backgroundColor: s.status === 'PENDING' ? '#f8961e22' : s.status === 'APPROVED' ? '#38b00022' : '#e6394622',
                      color: s.status === 'PENDING' ? '#f8961e' : s.status === 'APPROVED' ? '#38b000' : '#e63946',
                      border: `1px solid ${s.status === 'PENDING' ? '#f8961e' : s.status === 'APPROVED' ? '#38b000' : '#e63946'}44`
                    }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px 16px' }}>
                    {s.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateStatus(s.id, 'APPROVED')} style={{
                          padding: '6px 12px', backgroundColor: '#38b000', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                        }}>Aprobar (Refill)</button>
                        <button onClick={() => handleUpdateStatus(s.id, 'REJECTED')} style={{
                          padding: '6px 12px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                        }}>Rechazar</button>
                      </div>
                    )}
                    {s.status !== 'PENDING' && (
                      <span style={{ color: theme.textMuted, fontSize: '0.9rem' }}>Sin acciones</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
