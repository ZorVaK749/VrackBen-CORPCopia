import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { obtenerProductos } from '../../services/catalogoService';

export default function Metricas({ isDarkMode }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = {
    bg: isDarkMode ? '#121212' : '#f4f7f6',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f8f9fa' : '#212529',
    textMuted: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '1px solid #333' : '1px solid #e9ecef',
  };

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando productos para métricas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  // Datos simulados dinámicos basados en inventario
  const totalInventario = productos.length;
  // Como el endpoint de ms-catalog no devuelve stock ahora, simularemos un valor de stock
  // para las métricas, o usamos p.price para el valor total.
  const valorTotalInventario = productos.reduce((acc, p) => acc + (p.price || 0) * (Math.floor(Math.random() * 20) + 5), 0);

  const stats = [
    { label: 'Valor del Inventario', value: `$${valorTotalInventario.toLocaleString('es-CL')}`, icon: <DollarSign size={24} color="#38b000" /> },
    { label: 'Productos Registrados', value: totalInventario.toString(), icon: <Package size={24} color="#3a86ff" /> },
    { label: 'Citas Nuevas (Mes)', value: '142', icon: <Calendar size={24} color="#f8961e" /> },
    { label: 'Nuevos Clientes', value: '28', icon: <Users size={24} color="#8338ec" /> },
  ];

  // Datos para gráficas
  const dataVentas = [
    { nombre: 'Ene', ventas: 4000 },
    { nombre: 'Feb', ventas: 3000 },
    { nombre: 'Mar', ventas: 5000 },
    { nombre: 'Abr', ventas: 7800 },
    { nombre: 'May', ventas: 6200 },
    { nombre: 'Jun', ventas: 9000 },
  ];

  // Preparar datos de precios de productos reales
  const dataProductos = productos.slice(0, 7).map(p => ({
    name: p.name.substring(0, 10) + '...',
    precio: p.price
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const dataDistribucion = [
    { name: 'Repuestos', value: 400 },
    { name: 'Servicios', value: 300 },
    { name: 'Accesorios', value: 300 },
  ];

  return (
    <div style={{ padding: '40px', backgroundColor: theme.bg, color: theme.text, minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '20px' }}>📊 Panel de Métricas</h1>
      <p style={{ color: theme.textMuted, marginBottom: '30px' }}>Vista general interactiva de métricas y rendimiento del taller.</p>

      {/* Tarjetas de Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            backgroundColor: theme.card, padding: '25px', borderRadius: '12px', border: theme.border,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px'
          }}>
            <div style={{ padding: '15px', backgroundColor: isDarkMode ? '#2b2b2b' : '#f8f9fa', borderRadius: '50%' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ color: theme.textMuted, fontSize: '0.9rem', marginBottom: '5px' }}>{stat.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas Interactivas */}
      {loading ? (
        <p>Cargando gráficas...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Gráfico de Ventas Mensuales */}
          <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '12px', border: theme.border, minWidth: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Ingresos Mensuales Estimados</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataVentas}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.split(' ')[2]} />
                <XAxis dataKey="nombre" stroke={theme.textMuted} />
                <YAxis stroke={theme.textMuted} />
                <RechartsTooltip contentStyle={{ backgroundColor: theme.card, borderColor: theme.border.split(' ')[2], color: theme.text }} />
                <Line type="monotone" dataKey="ventas" stroke="#38b000" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Precios de Productos */}
          <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '12px', border: theme.border, minWidth: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Precios de Productos del Catálogo (Top 7)</h3>
            {dataProductos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataProductos}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.split(' ')[2]} />
                  <XAxis dataKey="name" stroke={theme.textMuted} fontSize={12} />
                  <YAxis stroke={theme.textMuted} />
                  <RechartsTooltip contentStyle={{ backgroundColor: theme.card, borderColor: theme.border.split(' ')[2], color: theme.text }} />
                  <Bar dataKey="precio" fill="#3a86ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: theme.textMuted, textAlign: 'center', marginTop: '50px' }}>No hay suficientes datos en el catálogo.</p>
            )}
          </div>

          {/* Gráfico de Distribución */}
          <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '12px', border: theme.border, minWidth: '400px', gridColumn: '1 / -1' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Distribución de Ingresos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dataDistribucion} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {dataDistribucion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: theme.card, borderColor: theme.border.split(' ')[2], color: theme.text }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}
