// src/pages/Agendar.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

export default function Agendar({ isDarkMode }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    serviceType: '',
    brand: '',
    model: '',
    plate: '',
    date: '',
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const theme = {
    background: isDarkMode ? '#121212' : '#ffffff',
    textMain: isDarkMode ? '#f8f9fa' : '#111111',
    textSecondary: isDarkMode ? '#adb5bd' : '#666666',
    cardBg: isDarkMode ? '#1e1e1e' : '#f8f9fa',
    border: isDarkMode ? '1px solid #333' : '1px solid #eaeaea',
    inputBg: isDarkMode ? '#2b2b2b' : '#ffffff',
    inputBorder: isDarkMode ? '1px solid #444' : '1px solid #ccc',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: theme.inputBorder,
    backgroundColor: theme.inputBg,
    color: theme.textMain,
    boxSizing: 'border-box',
    fontSize: '0.95rem',
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!form.serviceType || !form.date || !form.time) {
      setMessage({ text: 'Por favor completa el servicio, fecha y hora.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Enviamos al microservicio de agendamiento via Gateway
      await apiClient.post('/api/appointments/create', {
        customerUsername: user?.name,
        serviceType: form.serviceType,
        vehicleBrand: form.brand,
        vehicleModel: form.model,
        vehiclePlate: form.plate,
        appointmentDate: form.date,
        appointmentTime: form.time,
        notes: form.notes,
      });
      setMessage({ text: '¡Cita agendada exitosamente! Te contactaremos para confirmar.', type: 'success' });
      setForm({ serviceType: '', brand: '', model: '', plate: '', date: '', time: '', notes: '' });
    } catch (err) {
      setMessage({ text: 'Error al agendar. Intenta nuevamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fecha mínima = mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div style={{ padding: '40px 10%', backgroundColor: theme.background, minHeight: '80vh', color: theme.textMain }}>
      <div style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: theme.cardBg, padding: '40px', borderRadius: '12px', boxShadow: isDarkMode ? '0 8px 20px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.1)' }}>

        <h1 style={{ marginBottom: '8px', fontSize: '2.2rem', textAlign: 'center' }}>Agendar Servicio 🔧</h1>
        <p style={{ textAlign: 'center', color: theme.textSecondary, marginBottom: '30px' }}>
          Reserva tu hora en nuestro taller. Te confirmamos en 24h.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Tipo de servicio */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Tipo de Servicio *</label>
            <select name="serviceType" value={form.serviceType} onChange={handleChange} required style={inputStyle}>
              <option value="">Selecciona un servicio...</option>
              <option value="REVISION_25">Revisión 25 Puntos</option>
              <option value="CAMBIO_ACEITE">Cambio de Aceite y Filtro</option>
              <option value="FRENOS">Revisión de Frenos</option>
              <option value="MANTENIMIENTO">Mantenimiento General</option>
              <option value="OTRO">Otro (Especificar en taller)</option>
            </select>
          </div>

          {/* Datos del vehículo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Marca</label>
              <input name="brand" type="text" placeholder="Toyota" value={form.brand} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Modelo</label>
              <input name="model" type="text" placeholder="Yaris" value={form.model} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Patente</label>
              <input name="plate" type="text" placeholder="ABCD12" value={form.plate} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Fecha y hora */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Fecha *</label>
              <input name="date" type="date" min={minDate} value={form.date} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Hora Preferida *</label>
              <input name="time" type="time" value={form.time} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          {/* Notas adicionales */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Notas adicionales</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Describe el problema o detalles adicionales..."
              value={form.notes}
              onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Mensaje */}
          {message.text && (
            <p style={{ textAlign: 'center', margin: 0, fontWeight: '500', color: message.type === 'success' ? '#2dc653' : '#e63946' }}>
              {message.type === 'success' ? '✅' : '❌'} {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px', padding: '15px',
              backgroundColor: loading ? '#555' : '#e63946',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '1.1rem', fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 10px rgba(230, 57, 70, 0.3)'
            }}
          >
            {loading ? 'Enviando...' : 'Confirmar Reserva 📅'}
          </button>
        </form>
      </div>
    </div>
  );
}