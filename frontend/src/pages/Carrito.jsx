// src/pages/Carrito.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerCarrito, vaciarCarrito } from '../services/carritoService';
import { obtenerProductos } from '../services/catalogoService';
import apiClient from '../services/apiClient';

export default function Carrito() {
  const { user, isLoggedIn } = useAuth();
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null); // { tipo: 'exito'|'error', mensaje: '' }

  useEffect(() => {
    const cargarDatos = async () => {
      if (!isLoggedIn) { setCargando(false); return; }
      setCargando(true);
      try {
        const [cartData, catalogData] = await Promise.all([
          obtenerCarrito(user.name || user.sub),
          obtenerProductos()
        ]);
        setProductos(Array.isArray(catalogData) ? catalogData : []);
        setCarrito(Array.isArray(cartData) ? cartData : []);
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [isLoggedIn, user]);

  // Cruzar datos del carrito con el catálogo
  const carritoConDetalles = carrito.map(item => {
    const productoDetalle = productos.find(p => p.id === item.productId);
    return {
      ...item,
      nombre: productoDetalle ? productoDetalle.name : `Producto #${item.productId}`,
      descripcion: productoDetalle ? productoDetalle.description : 'Sin descripción',
    };
  });

  const total = carritoConDetalles.reduce((suma, item) => suma + (item.unitPrice * item.quantity), 0);

  const handleProcesarPago = async () => {
    if (carritoConDetalles.length === 0) return;
    setProcesando(true);
    setResultado(null);

    try {
      // Crear una orden por cada ítem del carrito
      const promesas = carritoConDetalles.map(item =>
        apiClient.post('/api/orders/create', {
          username: user.sub || user.name,
          customerRut: user.name || '',
          productId: item.productId,
          productName: item.nombre,
          quantity: item.quantity,
          totalAmount: item.unitPrice * item.quantity,
        })
      );
      const respuestas = await Promise.all(promesas);

      // Verificar si todas quedaron COMPLETED
      const hayFallidas = respuestas.some(r => r.data.status?.includes('FAILED'));

      // Vaciar el carrito independientemente (ya se registró el intento)
      await vaciarCarrito(user.name || user.sub);
      setCarrito([]);

      if (hayFallidas) {
        setResultado({
          tipo: 'advertencia',
          mensaje: '⚠️ Algunos productos no tenían stock suficiente. Revisa "Mis Pedidos" en tu perfil para ver el estado de cada ítem.'
        });
      } else {
        setResultado({
          tipo: 'exito',
          mensaje: '✅ ¡Pago procesado exitosamente! Tu pedido fue registrado. Puedes ver el historial en tu Perfil → Mis Pedidos.'
        });
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setResultado({
        tipo: 'error',
        mensaje: '❌ Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setProcesando(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '40px 10%', background: 'var(--bg)', minHeight: '80vh', color: 'var(--text-h)' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '2.5rem' }}>Tu Carrito 🛒</h1>
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0 }}>
            Debes iniciar sesión para ver tu carrito.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 10%', background: 'var(--bg)', minHeight: '80vh', color: 'var(--text-h)' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '2.5rem', fontWeight: 800 }}>Tu Carrito 🛒</h1>

      {/* Mensaje de resultado del pago */}
      {resultado && (
        <div style={{
          padding: '16px 22px',
          borderRadius: '10px',
          marginBottom: '24px',
          fontWeight: 600,
          fontSize: '1rem',
          background: resultado.tipo === 'exito' ? 'rgba(56, 176, 0, 0.15)' :
                      resultado.tipo === 'advertencia' ? 'rgba(248, 150, 30, 0.15)' :
                      'rgba(230, 57, 70, 0.15)',
          color: resultado.tipo === 'exito' ? '#38b000' :
                 resultado.tipo === 'advertencia' ? '#f8961e' : '#e63946',
          border: `1px solid ${resultado.tipo === 'exito' ? '#38b000' :
                                resultado.tipo === 'advertencia' ? '#f8961e' : '#e63946'}`,
        }}>
          {resultado.mensaje}
        </div>
      )}

      {cargando ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando carrito... ⚙️</p>
      ) : carritoConDetalles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0 }}>
            Tu carrito está vacío. ¡Ve al catálogo a buscar los repuestos que necesitas!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {carritoConDetalles.map((item, index) => (
            <div key={item.id || index} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem' }}>{item.nombre}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.descripcion}</p>
                <span style={{
                  display: 'inline-block', marginTop: '8px', padding: '3px 10px',
                  background: 'rgba(58,134,255,0.12)', color: 'var(--accent)',
                  borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700
                }}>
                  x{item.quantity}
                </span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>
                ${(item.unitPrice * item.quantity).toLocaleString('es-CL')}
              </div>
            </div>
          ))}

          {/* Total + Botón de Pago */}
          <div style={{
            marginTop: '16px', padding: '24px 28px',
            background: 'var(--bg-secondary)', borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total a Pagar</p>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-h)' }}>
                ${total.toLocaleString('es-CL')}
              </h2>
            </div>
            <button
              onClick={handleProcesarPago}
              disabled={procesando}
              className="btn btn-primary"
              style={{
                padding: '14px 36px', fontSize: '1.1rem', fontWeight: 700,
                opacity: procesando ? 0.7 : 1,
                cursor: procesando ? 'not-allowed' : 'pointer',
              }}
            >
              {procesando ? '⚙️ Procesando...' : '💳 Proceder al Pago'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}