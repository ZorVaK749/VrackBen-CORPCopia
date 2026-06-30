// src/pages/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Componente: Tarjeta de Servicio ── */
function ServiceCard({ icon, title, desc, delay = 0 }) {
  return (
    <div className="card" style={{
      padding: '32px 28px',
      flex: '1',
      minWidth: 240,
      maxWidth: 340,
      animationDelay: `${delay}ms`,
      borderTop: '3px solid var(--accent)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      <div style={{
        width: 52, height: 52,
        background: 'var(--accent-glow)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
        border: '1px solid rgba(37,99,235,0.2)',
      }}>
        {icon}
      </div>
      <h3 style={{ color: 'var(--text-h)', fontWeight: 700, fontSize: '1.05rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ── Componente: Estadística ── */
function StatCard({ value, label, icon }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const duration = 1500;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '36px 20px' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 900,
        color: 'var(--stats-text)',
        letterSpacing: '-1px',
        lineHeight: 1,
      }}>
        {count.toLocaleString()}+
      </div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginTop: 8, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

/* ── Componente: Tarjeta de Equipo ── */
function TeamCard({ img, name, role, delay = 0 }) {
  return (
    <div className="card" style={{
      width: 260,
      overflow: 'hidden',
      textAlign: 'center',
      animationDelay: `${delay}ms`,
      padding: 0,
    }}>
      <div style={{
        height: 240,
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        position: 'relative',
      }}>
        <img
          src={img}
          alt={name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={e => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.style.display = 'flex';
            e.currentTarget.parentElement.style.alignItems = 'center';
            e.currentTarget.parentElement.style.justifyContent = 'center';
            e.currentTarget.parentElement.style.fontSize = '64px';
            e.currentTarget.parentElement.textContent = '👤';
          }}
        />
      </div>
      <div style={{ padding: '20px 24px 24px', background: 'var(--card-bg)' }}>
        <h3 style={{ color: 'var(--text-h)', fontWeight: 700, fontSize: '1rem', margin: '0 0 4px' }}>{name}</h3>
        <p style={{
          color: 'var(--accent)',
          fontWeight: 600,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: 0,
        }}>{role}</p>
      </div>
    </div>
  );
}

/* ── PÁGINA PRINCIPAL ── */
export default function Home({ isDarkMode, isLoggedIn }) {
  const navigate = useNavigate();

  const handleAgendar = () => navigate(isLoggedIn ? '/agendar' : '/login');
  const handleCatalogo = () => navigate('/tienda');

  return (
    <div>

      {/* ════════════════════════════════
          1. HERO — fondo pastel/carbón según modo
      ════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8%',
        overflow: 'hidden',
        background: 'var(--hero-bg)',
      }}>
        {/* Imagen de fondo con overlay suave */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1613214149922-f1809c99b414?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.18,
        }} />

        {/* Glow azul decorativo */}
        <div style={{
          position: 'absolute',
          top: '20%', left: '5%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Contenido Hero */}
        <div style={{ position: 'relative', maxWidth: 640, zIndex: 1, animation: 'fadeInUp 0.8s ease both' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--accent-glow)',
            border: '1px solid rgba(37,99,235,0.3)',
            borderRadius: 9999,
            padding: '6px 16px',
            marginBottom: 28,
            fontSize: '0.78rem',
            color: 'var(--accent)',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: 'var(--success)',
              animation: 'pulse-ring 2s infinite',
              display: 'inline-block',
            }} />
            Servicio técnico certificado
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            color: 'var(--text-h)',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            margin: '0 0 24px',
          }}>
            Mantén tu auto{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent), #60A5FA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              en perfectas
            </span>{' '}
            condiciones
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 520,
          }}>
            Red de técnicos altamente calificados. Agenda tu mantención, compra repuestos originales y confía en los estándares más altos de calidad.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={handleAgendar}
              className="btn btn-primary"
              style={{ padding: '14px 28px', fontSize: '0.95rem' }}
            >
              🗓 Agendar Servicio
            </button>
            <button
              onClick={handleCatalogo}
              className="btn"
              style={{
                padding: '14px 28px', fontSize: '0.95rem',
                background: 'var(--bg-secondary)',
                color: 'var(--text-h)',
                border: '1px solid var(--border)',
              }}
            >
              Ver Repuestos →
            </button>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex',
            gap: 24,
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid var(--border)',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: '✅', text: 'Garantía incluida' },
              { icon: '⚡', text: 'Diagnóstico rápido' },
              { icon: '🔩', text: 'Repuestos originales' },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: 500,
              }}>
                <span>{icon}</span> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          2. ESTADÍSTICAS — gris carbón siempre
      ════════════════════════════════ */}
      <section style={{
        background: 'var(--stats-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          padding: '0 8%',
          position: 'relative',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <StatCard value="1500" label="Clientes atendidos" icon="👥" />
          <StatCard value="10"   label="Años de experiencia" icon="🏆" />
          <StatCard value="8"    label="Técnicos certificados" icon="🔧" />
          <StatCard value="5000" label="Repuestos disponibles" icon="📦" />
        </div>
      </section>

      {/* ════════════════════════════════
          3. SERVICIOS
      ════════════════════════════════ */}
      <section className="section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="section-title">
          <div className="badge badge-blue" style={{ marginBottom: 16 }}>Lo que hacemos</div>
          <h2>Nuestros <span style={{ color: 'var(--accent)' }}>Servicios</span></h2>
          <div className="accent-line" />
          <p style={{ marginTop: 16 }}>Trabajamos con el compromiso y calidad que nos caracteriza.</p>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <ServiceCard icon="⚙️" title="Mantención y Reparación" desc="Técnicos altamente calificados. Tus mantenciones bajo estrictos estándares de calidad y seguridad." delay={0} />
          <ServiceCard icon="🚗" title="Desabolladura y Pintura" desc="Taller equipado para devolverle la línea original a tu vehículo con acabados de primera calidad." delay={100} />
          <ServiceCard icon="🔧" title="Repuestos Originales" desc="Compra de manera rápida, fácil y segura el repuesto que necesitas. Envío a todo Chile." delay={200} />
        </div>
      </section>

      {/* ════════════════════════════════
          4. SERVICIOS ADICIONALES
      ════════════════════════════════ */}
      <section style={{ padding: 'var(--section-pad)', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{
            fontSize: '1.6rem',
            color: 'var(--text-h)',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{
              display: 'inline-block',
              width: 5, height: 32,
              background: 'linear-gradient(180deg, var(--accent), #60A5FA)',
              borderRadius: 4, flexShrink: 0,
            }} />
            Servicios Adicionales
          </h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { title: 'Revisión 25 Puntos', desc: 'Diagnóstico completo del vehículo', icon: '🔍' },
              { title: 'Cambio de Aceite', desc: 'Incluye filtro original certificado', icon: '💧' },
              { title: 'Revisión de Frenos', desc: 'Sistema completo de frenos', icon: '🛑' },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="card" style={{
                flex: '1', minWidth: 260,
                padding: '24px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  <div>
                    <h3 style={{ color: 'var(--text-h)', margin: '0 0 4px', fontSize: '0.95rem' }}>{title}</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.83rem' }}>{desc}</p>
                  </div>
                </div>
                <button
                  onClick={handleAgendar}
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.82rem', flexShrink: 0 }}
                >
                  Lo quiero
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          5. ¿POR QUÉ ELEGIRNOS?
      ════════════════════════════════ */}
      <section className="section" style={{ backgroundColor: 'var(--bg)' }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 48,
          alignItems: 'center',
        }}>
          <div>
            <div className="badge badge-blue" style={{ marginBottom: 16 }}>¿Por qué elegirnos?</div>
            <h2 style={{ marginBottom: 16 }}>La confianza que tu auto <span style={{ color: 'var(--accent)' }}>merece</span></h2>
            <div className="accent-line" style={{ margin: '0 0 24px' }} />
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>
              Somos un equipo comprometido con la calidad, la transparencia y la tecnología.
            </p>
            <button onClick={handleAgendar} className="btn btn-primary">
              Agenda tu cita ahora →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '✅', title: 'Técnicos certificados', desc: 'Más de 8 profesionales con certificación oficial' },
              { icon: '✅', title: 'Repuestos originales', desc: 'Solo usamos piezas originales garantizadas' },
              { icon: '✅', title: 'Garantía en cada trabajo', desc: 'Todos nuestros servicios incluyen garantía' },
              { icon: '✅', title: 'Presupuesto sin sorpresas', desc: 'Precio fijo confirmado antes de comenzar' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                display: 'flex',
                gap: 16,
                padding: '16px 20px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                transition: 'var(--transition)',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ color: 'var(--success)', fontSize: 18, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                <div>
                  <strong style={{ color: 'var(--text-h)', display: 'block', marginBottom: 4, fontSize: '0.95rem' }}>{title}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          6. EQUIPO
      ════════════════════════════════ */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="section-title">
          <div className="badge badge-blue" style={{ marginBottom: 16 }}>Quiénes somos</div>
          <h2>Conoce a Nuestro <span style={{ color: 'var(--accent)' }}>Equipo V2 PRUEBA</span></h2>
          <div className="accent-line" />
          <p style={{ marginTop: 16 }}>Los profesionales detrás de cada mantención. Comprometidos con la excelencia.</p>
        </div>

        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          <TeamCard img="/team_vicente.png" name="Vicente Placencia" role="Jefe de Taller" delay={0} />
          <TeamCard img="/team_ian.png"     name="Ian Badilla"       role="Arquitecto de Sistemas" delay={100} />
          <TeamCard img="/team_benjamin.png" name="Benjamín Almonacid" role="Especialista en Repuestos" delay={200} />
        </div>
      </section>

      {/* ════════════════════════════════
          7. CTA FINAL — azul premium
      ════════════════════════════════ */}
      <section style={{
        padding: '80px 8%',
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', marginBottom: 16 }}>
            ¿Listo para agendar tu servicio?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: 36 }}>
            Agenda en minutos y te confirmamos tu hora al instante.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleAgendar} className="btn" style={{
              background: '#fff',
              color: '#1E3A5F',
              padding: '14px 32px',
              fontSize: '0.95rem',
              fontWeight: 700,
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}>
              🗓 Agendar ahora
            </button>
            <button onClick={handleCatalogo} className="btn btn-outline" style={{ padding: '14px 28px' }}>
              Ver catálogo
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}