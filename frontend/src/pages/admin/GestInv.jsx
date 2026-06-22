// src/pages/admin/GestInv.jsx
import { useState, useEffect } from 'react';
import { obtenerProductos, crearProducto, subirImagenProducto, eliminarProducto, actualizarProducto } from '../../services/catalogoService';
import { Trash2, Edit2 } from 'lucide-react';

export default function GestInv({ isDarkMode }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', sku: '' });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editSku, setEditSku] = useState(null);

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
    width: '100%', padding: '10px', borderRadius: '6px',
    border: theme.inputBorder, backgroundColor: theme.inputBg,
    color: theme.text, boxSizing: 'border-box', fontSize: '0.9rem',
  };

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await obtenerProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch { setProductos([]); }
    finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleCrearOEditar = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const payload = { 
        name: form.name, 
        description: form.description, 
        price: parseFloat(form.price), 
        stock: parseInt(form.stock), 
        sku: form.sku 
      };

      if (isEditing) {
        await actualizarProducto(editSku, payload);
        if (imageFile) await subirImagenProducto(editSku, imageFile);
        setMsg('✅ Producto actualizado exitosamente');
      } else {
        await crearProducto(payload);
        if (imageFile) await subirImagenProducto(form.sku, imageFile);
        setMsg('✅ Producto creado exitosamente');
      }

      setForm({ name: '', description: '', price: '', stock: '', sku: '' });
      setImageFile(null);
      setShowForm(false);
      setIsEditing(false);
      setEditSku(null);
      cargar();
    } catch { setMsg('❌ Error al guardar el producto'); }
    finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, sku: p.sku });
    setIsEditing(true);
    setEditSku(p.sku);
    setShowForm(true);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (sku, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${nombre}" (SKU: ${sku})?`)) {
      try {
        await eliminarProducto(sku);
        cargar();
      } catch (err) {
        alert('❌ Error al eliminar el producto.');
      }
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: theme.bg, color: theme.text, minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ margin: 0 }}>⚙️ Gestión de Inventario</h1>
        <button onClick={() => {
          setShowForm(s => {
            if (s) {
              setIsEditing(false);
              setForm({ name: '', description: '', price: '', stock: '', sku: '' });
              setEditSku(null);
            }
            return !s;
          });
        }} style={{
          padding: '10px 20px', backgroundColor: '#e63946', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>
      <p style={{ color: theme.textMuted, marginBottom: '30px' }}>Administra el catálogo de repuestos y su stock.</p>

      {/* Formulario de creación/edición */}
      {showForm && (
        <form onSubmit={handleCrearOEditar} style={{
          backgroundColor: theme.card, border: theme.border, borderRadius: '10px',
          padding: '25px', marginBottom: '30px', display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: '15px'
        }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre del Producto *</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Filtro de aceite Toyota" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>SKU *</label>
            <input name="sku" required value={form.sku} onChange={handleChange} placeholder="TOY-OIL-001" style={inputStyle} disabled={isEditing} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Precio ($) *</label>
            <input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={handleChange} placeholder="12990" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Stock *</label>
            <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange} placeholder="50" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción</label>
            <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción del producto" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Subir Imagen</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />
          </div>
          {msg && <p style={{ gridColumn: '1 / -1', margin: 0, textAlign: 'center' }}>{msg}</p>}
          <button type="submit" disabled={saving} style={{
            gridColumn: '1 / -1', padding: '12px', backgroundColor: saving ? '#555' : '#38b000',
            color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}>
            {saving ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Guardar Producto')}
          </button>
        </form>
      )}

      {/* Tabla de productos */}
      {cargando ? (
        <p style={{ color: theme.textMuted }}>Cargando inventario... ⚙️</p>
      ) : productos.length === 0 ? (
        <p style={{ color: '#e63946' }}>No hay productos en el catálogo o el backend no responde.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: isDarkMode ? '#2b2b2b' : '#f8f9fa' }}>
                {['Imagen', 'SKU', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', borderBottom: theme.border, color: theme.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={p.id || i} style={{ borderBottom: theme.border }}>
                  <td style={{ padding: '12px 16px' }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#e9ecef', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: '0.8rem' }}>Sin Img</div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#3a86ff' }}>{p.sku}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{p.name}</td>
                  <td style={{ padding: '12px 16px', color: theme.textMuted, fontSize: '0.85rem' }}>{p.description}</td>
                  <td style={{ padding: '12px 16px', color: '#38b000', fontWeight: 'bold' }}>${p.price?.toLocaleString('es-CL')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                      backgroundColor: p.stock > 10 ? '#38b00022' : '#e6394622',
                      color: p.stock > 10 ? '#38b000' : '#e63946',
                    }}>{p.stock} u.</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleEdit(p)}
                        title="Editar producto"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#3a86ff', padding: '5px', display: 'flex', alignItems: 'center'
                        }}
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleEliminar(p.sku, p.name)}
                        title="Eliminar producto"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#e63946', padding: '5px', display: 'flex', alignItems: 'center'
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
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
