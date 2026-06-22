// src/pages/mechanic/DashMec.jsx
import { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

const STATUS_CONFIG = {
  IN_PROGRESS: { label: 'En Progreso', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: '🔧' },
  COMPLETED:   { label: 'Completado',  color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: '✅' },
  PENDING:     { label: 'Pendiente',   color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: '⏳' },
};

export default function DashMec({ isDarkMode }) {
  const [orders, setOrders]         = useState([]);
  const [stock, setStock]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [stockLoading, setStockLoading] = useState(true);
  const [error, setError]           = useState(null);
  const [completing, setCompleting] = useState(null); // id de la orden que se está completando

  // ── Carga de órdenes de trabajo desde la BD real ──
  useEffect(() => {
    apiClient.get('/api/job-orders/all')
      .then(res => setOrders(res.data))
      .catch(() => setError('No se pudieron cargar las órdenes. Verifica que el backend esté activo.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Carga del inventario del taller desde la BD real ──
  useEffect(() => {
    apiClient.get('/api/stock/all')
      .then(res => setStock(res.data))
      .catch(() => {}) // stock es secundario, no bloquea el dashboard
      .finally(() => setStockLoading(false));
  }, []);

  // ── Completar una orden de trabajo ──
  const handleCompleteOrder = async (orderId) => {
    setCompleting(orderId);
    try {
      const res = await apiClient.put(`/api/job-orders/complete/${orderId}`);
      setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
    } catch (e) {
      alert('Error al completar la orden: ' + (e.response?.data || e.message));
    } finally {
      setCompleting(null);
    }
  };

  const inProgress = orders.filter(o => o.status === 'IN_PROGRESS').length;
  const completed  = orders.filter(o => o.status === 'COMPLETED').length;
  const lowStock   = stock.filter(p => p.stock !== null && p.minThreshold !== null && p.stock <= p.minThreshold).length;

  return (
    <div style={{ padding: '40px 6%', minHeight: '80vh', background: 'var(--bg)', color: 'var(--text-h)' }}>

      {/* ── ENCABEZADO ── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
          🔧 Panel del Mecánico
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>
          Órdenes de trabajo e inventario en tiempo real desde la base de datos.
        </p>
      </div>

      {/* ── TARJETAS RESUMEN ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        {[
          { label: 'En Progreso', value: inProgress, color: '#F59E0B', icon: '🔧' },
          { label: 'Completadas', value: completed,  color: '#10B981', icon: '✅' },
          { label: 'Total Órdenes', value: orders.length, color: 'var(--accent)', icon: '📋' },
          { label: 'Items con Stock Bajo', value: lowStock, color: '#EF4444', icon: '⚠️' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 6, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── LISTADO DE ÓRDENES ── */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 4, height: 22, background: 'var(--accent)', borderRadius: 4, display: 'inline-block' }} />
          Órdenes de Trabajo
        </h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            ⏳ Cargando órdenes desde la base de datos...
          </div>
        )}

        {error && (
          <div style={{
            padding: '20px 24px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontWeight: 500,
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 60, color: 'var(--text-muted)',
            border: '2px dashed var(--border)', borderRadius: 12,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p>No hay órdenes de trabajo registradas aún.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={order.id} className="card" style={{ padding: 24 }}>
                  {/* Cabecera */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-h)' }}>
                        OT-{String(order.id).padStart(4, '0')}
                      </span>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Mecánico ID: {order.mechanicId || '—'}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20,
                      background: cfg.bg, color: cfg.color,
                      fontSize: '0.78rem', fontWeight: 700,
                    }}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>

                  {/* VIN del vehículo */}
                  <div style={{
                    padding: '8px 14px', borderRadius: 8, marginBottom: 12,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', fontSize: '0.95rem',
                  }}>
                    🚗 {order.vehicleVin || 'VIN no registrado'}
                  </div>

                  {/* Descripción */}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>
                    {order.description || 'Sin descripción'}
                  </p>

                  {/* Info footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    <span>💰 ${order.laborCost?.toLocaleString() || '—'}</span>
                    <span>🕒 {order.startTime ? new Date(order.startTime).toLocaleDateString('es-CL') : '—'}</span>
                  </div>

                  {/* Botón de completar */}
                  {order.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      disabled={completing === order.id}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                    >
                      {completing === order.id ? '⏳ Completando...' : '✅ Marcar como Completada'}
                    </button>
                  )}
                  {order.status === 'COMPLETED' && (
                    <div style={{
                      textAlign: 'center', padding: '10px', borderRadius: 8, fontSize: '0.85rem',
                      background: 'rgba(16,185,129,0.1)', color: '#10B981', fontWeight: 600,
                    }}>
                      ✅ Finalizada el {order.endTime ? new Date(order.endTime).toLocaleDateString('es-CL') : '—'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── TABLA DE INVENTARIO DEL TALLER ── */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 4, height: 22, background: 'var(--accent)', borderRadius: 4, display: 'inline-block' }} />
          Inventario del Taller
        </h2>

        {stockLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>⏳ Cargando inventario...</div>
        ) : stock.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 12 }}>
            📦 No hay productos registrados en el inventario del taller.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border)' }}>
                  {['SKU', 'Nombre', 'Stock Actual', 'Mínimo', 'Estado'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stock.map(p => {
                  const isLow = p.stock !== null && p.minThreshold !== null && p.stock <= p.minThreshold;
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 700 }}>{p.sku || '—'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-h)', fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: isLow ? '#EF4444' : '#10B981', fontSize: '1rem' }}>{p.stock}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{p.minThreshold ?? '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                          background: isLow ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                          color: isLow ? '#EF4444' : '#10B981',
                        }}>
                          {isLow ? '⚠️ Bajo' : '✅ OK'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
