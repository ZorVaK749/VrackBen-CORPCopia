// src/pages/mechanic/InvMec.jsx
import { useState, useEffect } from 'react';
import { obtenerProductos } from '../../services/catalogoService';

export default function InvMec({ isDarkMode }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('');

  const theme = {
    bg: isDarkMode ? '#121212' : '#f4f7f6',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f8f9fa' : '#212529',
    textMuted: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '1px solid #333' : '1px solid #e9ecef',
    inputBg: isDarkMode ? '#2b2b2b' : '#fff',
    inputBorder: isDarkMode ? '1px solid #444' : '1px solid #ccc',
  };

  useEffect(() => {
    (async () => {
      setCargando(true);
      try {
        const data = await obtenerProductos();
        setProductos(Array.isArray(data) ? data : []);
      } catch { setProductos([]); }
      finally { setCargando(false); }
    })();
  }, []);

  const productosFiltrados = productos.filter(p =>
    p.name?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.sku?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', backgroundColor: theme.bg, color: theme.text, minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '8px' }}>🔩 Inventario del Taller</h1>
      <p style={{ color: theme.textMuted, marginBottom: '25px' }}>Consulta rápida de repuestos y materiales disponibles en bodega.</p>

      {/* Buscador */}
      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="🔍 Filtrar por nombre o SKU..."
        style={{
          width: '100%', maxWidth: '400px', padding: '12px 16px',
          borderRadius: '8px', border: theme.inputBorder,
          backgroundColor: theme.inputBg, color: theme.text,
          fontSize: '1rem', marginBottom: '25px', boxSizing: 'border-box'
        }}
      />

      {cargando ? (
        <p style={{ color: theme.textMuted }}>Cargando inventario... ⚙️</p>
      ) : productosFiltrados.length === 0 ? (
        <p style={{ color: '#e63946' }}>
          {filtro ? `Sin resultados para "${filtro}".` : 'No hay productos en inventario.'}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {productosFiltrados.map((p, i) => (
            <div key={p.id || i} style={{
              backgroundColor: theme.card, border: theme.border,
              borderRadius: '10px', padding: '20px',
              boxShadow: isDarkMode ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 10px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{p.name}</h3>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                  backgroundColor: p.stock > 10 ? '#38b00022' : '#e6394622',
                  color: p.stock > 10 ? '#38b000' : '#e63946',
                  whiteSpace: 'nowrap', marginLeft: '10px'
                }}>
                  {p.stock > 10 ? '✅' : '⚠️'} {p.stock} u.
                </span>
              </div>
              <p style={{ margin: '0 0 10px 0', color: theme.textMuted, fontSize: '0.85rem' }}>{p.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ fontFamily: 'monospace', color: '#3a86ff' }}>{p.sku}</span>
                <span style={{ fontWeight: 'bold', color: '#38b000' }}>${p.price?.toLocaleString('es-CL')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
