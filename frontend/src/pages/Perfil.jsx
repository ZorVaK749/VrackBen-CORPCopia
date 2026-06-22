import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

export default function Perfil() {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({ name: '', username: '', roles: [] });
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Para el historial de vehículos
  const [vinSearch, setVinSearch] = useState('');
  const [historyRecords, setHistoryRecords] = useState([]);
  const [searchedVin, setSearchedVin] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Para el historial de pedidos
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Formulario para nuevo historial
  const [newEntry, setNewEntry] = useState({ description: '', mileage: '', technicianName: '' });
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  useEffect(() => {
    if (!user?.sub) return;

    // Obtener datos reales del usuario desde ms-auth-server
    apiClient.get(`/api/auth/users/${user.sub}`)
      .then(res => {
        setProfileData(res.data);
      })
      .catch(err => console.error("Error al cargar el perfil:", err))
      .finally(() => setLoadingProfile(false));

    // Cargar historial de pedidos del usuario
    setLoadingOrders(true);
    apiClient.get(`/api/orders/my-orders/${user.sub}`)
      .then(res => setMyOrders(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error al cargar pedidos:", err))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const handleSearchHistory = async (e) => {
    e.preventDefault();
    if (!vinSearch) return;
    
    setLoadingHistory(true);
    try {
      const res = await apiClient.get(`/api/history/${vinSearch}`);
      setHistoryRecords(res.data);
      setSearchedVin(vinSearch);
    } catch (err) {
      console.error("Error buscando historial:", err);
      alert("No se pudo cargar el historial para este VIN.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!searchedVin) return;

    try {
      const payload = {
        vin: searchedVin,
        description: newEntry.description,
        mileage: parseInt(newEntry.mileage, 10),
        technicianName: newEntry.technicianName || profileData.name
      };
      const res = await apiClient.post('/api/history/add', payload);
      setHistoryRecords([...historyRecords, res.data]);
      setIsAddingEntry(false);
      setNewEntry({ description: '', mileage: '', technicianName: '' });
    } catch (err) {
      console.error("Error al agregar registro:", err);
      alert("Error al guardar el nuevo registro en el historial.");
    }
  };

  return (
    <div style={{ padding: '40px 6%', minHeight: '80vh', background: 'var(--bg)', color: 'var(--text-h)' }}>
      
      {/* ── ENCABEZADO PERFIL ── */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '40px' }}>
        
        {/* Tarjeta de Usuario */}
        <div className="card" style={{ flex: '1 1 300px', padding: '30px', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', height: '120px', margin: '0 auto 20px auto',
            borderRadius: '50%', backgroundColor: 'var(--accent)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '3.5rem', color: '#fff', boxShadow: '0 8px 20px rgba(58, 134, 255, 0.3)'
          }}>
            👤
          </div>
          
          {loadingProfile ? (
            <p style={{ color: 'var(--text-muted)' }}>Cargando perfil...</p>
          ) : (
            <>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: 800 }}>{profileData.name || 'Sin Nombre'}</h2>
              <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)' }}>{profileData.username}</p>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {profileData.roles && profileData.roles.map(role => (
                  <span key={role} style={{ 
                    padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                    backgroundColor: 'rgba(58, 134, 255, 0.15)', color: 'var(--accent)'
                  }}>
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Tarjeta de Historial del Vehículo */}
        <div className="card" style={{ flex: '2 1 500px', padding: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: 4, height: 22, background: 'var(--accent)', borderRadius: 4, display: 'inline-block' }} />
            Consultar Historial del Vehículo
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
            Ingresa el VIN de tu vehículo para ver el historial de atenciones en VraKBen.
          </p>

          <form onSubmit={handleSearchHistory} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input 
              type="text" 
              placeholder="Ej: WBA0000000000"
              value={vinSearch}
              onChange={e => setVinSearch(e.target.value.toUpperCase())}
              className="form-control"
              style={{ flex: 1, textTransform: 'uppercase' }}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loadingHistory}>
              {loadingHistory ? 'Buscando...' : '🔍 Buscar VIN'}
            </button>
          </form>

          {searchedVin && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: 'var(--accent)', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  Resultados para: {searchedVin}
                </h4>
                {profileData.roles?.includes('ROLE_MECANICO') && (
                  <button 
                    onClick={() => setIsAddingEntry(!isAddingEntry)}
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    {isAddingEntry ? 'Cancelar' : '➕ Agregar Registro'}
                  </button>
                )}
              </div>

              {isAddingEntry && (
                <form onSubmit={handleAddEntry} style={{ 
                  background: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', 
                  marginBottom: '20px', border: '1px solid var(--border)' 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descripción del Servicio</label>
                      <input 
                        type="text" className="form-control" required
                        value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kilometraje</label>
                        <input 
                          type="number" className="form-control" required
                          value={newEntry.mileage} onChange={e => setNewEntry({...newEntry, mileage: e.target.value})}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Técnico (Opcional)</label>
                        <input 
                          type="text" className="form-control" placeholder={profileData.name}
                          value={newEntry.technicianName} onChange={e => setNewEntry({...newEntry, technicianName: e.target.value})}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Guardar Registro</button>
                  </div>
                </form>
              )}

              {historyRecords.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                  No se encontraron atenciones previas para este vehículo.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {historyRecords.map((record, index) => (
                    <div key={record.id || index} style={{ 
                      padding: '15px 20px', background: 'var(--bg)', border: '1px solid var(--border)', 
                      borderRadius: '8px', borderLeft: '4px solid var(--accent)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1.05rem' }}>{record.description}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(record.serviceDate).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span>🚗 {record.mileage.toLocaleString()} km</span>
                        <span>🔧 {record.technicianName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── MIS PEDIDOS ── */}
      <div className="card" style={{ padding: '30px', marginTop: '10px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: 4, height: 22, background: 'var(--accent)', borderRadius: 4, display: 'inline-block' }} />
          🧾 Mis Pedidos
        </h3>

        {loadingOrders ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando historial de pedidos...</p>
        ) : myOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
            No tienes pedidos realizados aún. ¡Ve al catálogo y compra algo!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>#</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>Producto</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>Cantidad</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>Total</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>Fecha</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order, idx) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>#{order.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{order.productName || `Producto #${order.productId}`}</td>
                    <td style={{ padding: '12px 16px' }}>x{order.quantity}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--accent)' }}>
                      ${order.totalAmount?.toLocaleString('es-CL')}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString('es-CL') : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                        background: order.status === 'COMPLETED' ? 'rgba(56, 176, 0, 0.15)' : 'rgba(230, 57, 70, 0.15)',
                        color: order.status === 'COMPLETED' ? '#38b000' : '#e63946',
                      }}>
                        {order.status === 'COMPLETED' ? '✅ Completado' : '❌ Sin Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
