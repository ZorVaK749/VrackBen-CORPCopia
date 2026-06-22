// src/pages/mechanic/Solicitud.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';

export default function Solicitud({ isDarkMode }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ workOrderId: '', partName: '', sku: '', quantity: '', urgency: 'NORMAL', notes: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const theme = {
    bg: isDarkMode ? '#121212' : '#f4f7f6',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f8f9fa' : '#212529',
    textMuted: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '1px solid #333' : '1px solid #e9ecef',
    inputBg: isDarkMode ? '#2b2b2b' : '#fff',
    inputBorder: isDarkMode ? '1px solid #444' : '1px solid #ccc',
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '7px',
    border: theme.inputBorder, backgroundColor: theme.inputBg,
    color: theme.text, boxSizing: 'border-box', fontSize: '0.95rem',
  };

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg({ text: '', type: '' });
    try {
      await apiClient.post('/api/procurement/order', {
        mechanicUsername: user?.name,
        workOrderId: form.workOrderId,
        partName: form.partName,
        sku: form.sku,
        quantity: parseInt(form.quantity),
        urgency: form.urgency,
        notes: form.notes,
      });
      setMsg({ text: '✅ Solicitud enviada al departamento de compras.', type: 'success' });
      setForm({ workOrderId: '', partName: '', sku: '', quantity: '', urgency: 'NORMAL', notes: '' });
    } catch {
      setMsg({ text: '❌ Error al enviar la solicitud. Intenta nuevamente.', type: 'error' });
    } finally { setLoading(false); }
  };

  const urgencyOptions = [
    { value: 'NORMAL', label: '🟡 Normal (3-5 días hábiles)', color: '#f8961e' },
    { value: 'URGENTE', label: '🔴 Urgente (24-48 horas)', color: '#e63946' },
    { value: 'CRITICO', label: '🚨 Crítico (Hoy mismo)', color: '#9d0208' },
  ];

  return (
    <div style={{ padding: '40px', backgroundColor: theme.bg, color: theme.text, minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '8px' }}>📋 Solicitar Materiales</h1>
      <p style={{ color: theme.textMuted, marginBottom: '30px' }}>Genera una solicitud de repuestos para una orden de trabajo.</p>

      <div style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{
          backgroundColor: theme.card, border: theme.border,
          borderRadius: '12px', padding: '30px',
          display: 'flex', flexDirection: 'column', gap: '18px'
        }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>N° Orden de Trabajo *</label>
              <input name="workOrderId" required value={form.workOrderId} onChange={handleChange} placeholder="OT-1005" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Urgencia *</label>
              <select name="urgency" value={form.urgency} onChange={handleChange} required style={inputStyle}>
                {urgencyOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Nombre del Repuesto *</label>
              <input name="partName" required value={form.partName} onChange={handleChange} placeholder="Filtro de aceite" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="TOY-001" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Cantidad *</label>
              <input name="quantity" type="number" min="1" required value={form.quantity} onChange={handleChange} placeholder="2" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Notas adicionales</label>
            <textarea
              name="notes" rows={3} value={form.notes} onChange={handleChange}
              placeholder="Especifica el vehículo, año u otros detalles relevantes..."
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {msg.text && (
            <p style={{ margin: 0, textAlign: 'center', fontWeight: '500', color: msg.type === 'success' ? '#38b000' : '#e63946' }}>
              {msg.text}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '13px', backgroundColor: loading ? '#555' : '#f8961e',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Enviando solicitud...' : 'Enviar Solicitud 📤'}
          </button>
        </form>

        {/* Info */}
        <div style={{
          marginTop: '20px', padding: '15px', borderRadius: '8px',
          backgroundColor: isDarkMode ? '#1a2332' : '#e8f4fd', border: '1px solid #3a86ff44'
        }}>
          <p style={{ margin: 0, color: theme.textMuted, fontSize: '0.85rem' }}>
            💡 Tu solicitud será revisada por el departamento de compras.
            Recibirás confirmación cuando el material esté disponible en bodega.
          </p>
        </div>
      </div>
    </div>
  );
}
