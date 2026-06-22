// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isDarkMode, setIsDarkMode }) {
  const { isLoggedIn, role, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    color: isActive(path) ? 'var(--accent)' : 'var(--navbar-text)',
    textDecoration: 'none',
    fontSize: '0.92rem',
    fontWeight: 500,
    padding: '6px 0',
    position: 'relative',
    transition: 'var(--transition)',
    borderBottom: isActive(path) ? '2px solid var(--accent)' : '2px solid transparent',
  });

  return (
    <>
      {/* ── BARRA SUPERIOR DE ANUNCIOS ── */}
      <div style={{
        background: 'var(--navbar-bg)',
        color: 'var(--navbar-text)',
        fontSize: '0.78rem',
        fontWeight: 500,
        padding: '7px 8%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        letterSpacing: '0.2px',
        borderBottom: '1px solid var(--navbar-border)',
        opacity: 0.9,
      }}>
        <span>🔧 Técnicos certificados — Agendamiento rápido en línea</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span>📞 +56 9 1234 5678</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>🕒 Lun - Vie: 09:00 - 18:00</span>
        </div>
      </div>

      {/* ── NAVBAR PRINCIPAL ── */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 8%',
        height: 64,
        backgroundColor: 'var(--navbar-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.35)' : '0 1px 0 var(--navbar-border)',
        transition: 'box-shadow 0.3s ease',
      }}>

        {/* ── LOGO ── */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #1D4ED8, #60A5FA)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
            boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
          }}>
            🔧
          </div>
          <span style={{
            color: 'var(--navbar-text)',
            fontWeight: 800,
            fontSize: '1.15rem',
            letterSpacing: '-0.3px',
          }}>
            Vrak<span style={{ color: 'var(--accent)' }}>Ben</span>
          </span>
        </Link>

        {/* ── LINKS CENTRALES (desktop) ── */}
        <div style={{
          display: 'flex',
          gap: 28,
          alignItems: 'center',
        }} className="nav-links-desktop">
          <Link to="/tienda" style={navLinkStyle('/tienda')}>Catálogo</Link>

          {/* ROL CLIENTE */}
          {(role === 'CLIENTE' || role === 'ADMIN') && (
            <>
              <Link to="/carrito" style={navLinkStyle('/carrito')}>Carrito</Link>
              <Link to="/agendar" style={navLinkStyle('/agendar')}>Agendar</Link>
            </>
          )}

          {/* ROL MECÁNICO */}
          {role === 'MECANICO' && (
            <>
              <Link to="/mecanico/dashboard" style={navLinkStyle('/mecanico/dashboard')}>Órdenes</Link>
              <Link to="/mecanico/inventario" style={navLinkStyle('/mecanico/inventario')}>Inventario</Link>
              <Link to="/mecanico/solicitud" style={navLinkStyle('/mecanico/solicitud')}>Solicitar</Link>
            </>
          )}

          {/* ROL ADMIN */}
          {role === 'ADMIN' && (
            <>
              <Link to="/admin/metricas" style={navLinkStyle('/admin/metricas')}>Métricas</Link>
              <Link to="/admin/inventario" style={navLinkStyle('/admin/inventario')}>Bodega</Link>
              <Link to="/admin/usuarios" style={navLinkStyle('/admin/usuarios')}>Usuarios</Link>
              <Link to="/admin/solicitudes" style={navLinkStyle('/admin/solicitudes')}>Solicitudes</Link>
            </>
          )}
        </div>

        {/* ── ACCIONES DERECHA ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Toggle modo claro/oscuro */}
          <button
            id="dark-mode-toggle"
            onClick={() => setIsDarkMode(prev => !prev)}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--navbar-text)',
              width: 36, height: 36,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Sesión */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/perfil" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'var(--navbar-text)', textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: '0.88rem', fontWeight: 500,
                transition: 'var(--transition)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  width: 26, height: 26,
                  background: 'linear-gradient(135deg, #1D4ED8, #60A5FA)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#fff', fontWeight: 700,
                }}>
                  {(user?.name || 'U')[0].toUpperCase()}
                </span>
                {user?.name || 'Perfil'}
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ padding: '7px 14px', fontSize: '0.85rem', borderRadius: 8 }}
              >
                Salir
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" style={{
                padding: '7px 16px',
                color: 'var(--navbar-text)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                fontSize: '0.88rem', fontWeight: 500,
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >
                Ingresar
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.88rem', borderRadius: 8 }}>
                Registrarse
              </Link>
            </div>
          )}

          {/* Hamburguesa mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--navbar-text)',
              width: 36, height: 36,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 18,
              alignItems: 'center', justifyContent: 'center',
            }}
            className="nav-hamburger"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* ── MENÚ MÓVIL ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 106,
          left: 0, right: 0,
          backgroundColor: 'var(--navbar-bg)',
          borderBottom: '1px solid var(--navbar-border)',
          padding: '20px 8%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 999,
        }}>
          <Link to="/tienda" style={{ color: 'var(--navbar-text)', fontWeight: 500 }}>Catálogo</Link>
          {(role === 'CLIENTE' || role === 'ADMIN') && (
            <>
              <Link to="/carrito" style={{ color: 'var(--navbar-text)', fontWeight: 500 }}>Carrito</Link>
              <Link to="/agendar" style={{ color: 'var(--navbar-text)', fontWeight: 500 }}>Agendar</Link>
            </>
          )}
          {role === 'MECANICO' && (
            <>
              <Link to="/mecanico/dashboard" style={{ color: 'var(--navbar-text)', fontWeight: 500 }}>Órdenes</Link>
              <Link to="/mecanico/inventario" style={{ color: 'var(--navbar-text)', fontWeight: 500 }}>Inventario</Link>
            </>
          )}
          {!isLoggedIn && (
            <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Link to="/login" style={{ color: 'var(--navbar-text)', fontWeight: 600 }}>Ingresar</Link>
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Registrarse →</Link>
            </div>
          )}
        </div>
      )}

      {/* ── ESTILOS RESPONSIVE ── */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        nav a:hover { color: var(--accent) !important; }
      `}</style>
    </>
  );
}