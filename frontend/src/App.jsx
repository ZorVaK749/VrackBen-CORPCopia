import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas Públicas
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas Cliente
import Carrito from './pages/Carrito';
import Agendar from './pages/Agendar';
import Pago from './pages/Pago';
import Perfil from './pages/Perfil';

// Páginas Mecánico
import DashMec from './pages/mechanic/DashMec';
import InvMec from './pages/mechanic/InvMec';
import Solicitud from './pages/mechanic/Solicitud';

// Páginas Admin
import Metricas from './pages/admin/Metricas';
import GestInv from './pages/admin/GestInv';
import GestUser from './pages/admin/GestUser';
import GestSolicitudes from './pages/admin/GestSolicitudes';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
            <Route path="/tienda" element={<Catalogo isDarkMode={isDarkMode} />} />
            <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
            <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
            
            {/* RUTAS DE CLIENTE */}
            <Route path="/carrito" element={<ProtectedRoute allowedRoles={['CLIENTE', 'ADMIN']}><Carrito isDarkMode={isDarkMode} /></ProtectedRoute>} />
            <Route path="/pago" element={<ProtectedRoute allowedRoles={['CLIENTE']}><Pago isDarkMode={isDarkMode} /></ProtectedRoute>} />
            <Route path="/agendar" element={<ProtectedRoute allowedRoles={['CLIENTE']}><Agendar isDarkMode={isDarkMode} /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute allowedRoles={['CLIENTE', 'MECANICO', 'ADMIN']}><Perfil isDarkMode={isDarkMode} /></ProtectedRoute>} />

            {/* RUTAS DE MECÁNICO */}
            <Route path="/mecanico" element={<ProtectedRoute allowedRoles={['MECANICO']}><Navigate to="/mecanico/dashboard" replace /></ProtectedRoute>} />
            <Route path="/mecanico/dashboard" element={<ProtectedRoute allowedRoles={['MECANICO']}><DashMec isDarkMode={isDarkMode} /></ProtectedRoute>} />
            <Route path="/mecanico/inventario" element={<ProtectedRoute allowedRoles={['MECANICO']}><InvMec isDarkMode={isDarkMode} /></ProtectedRoute>} />
            <Route path="/mecanico/solicitud" element={<ProtectedRoute allowedRoles={['MECANICO']}><Solicitud isDarkMode={isDarkMode} /></ProtectedRoute>} />

            {/* RUTAS DE ADMIN */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><Navigate to="/admin/metricas" replace /></ProtectedRoute>} />
            <Route path="/admin/metricas" element={<ProtectedRoute allowedRoles={['ADMIN']}><Metricas isDarkMode={isDarkMode} /></ProtectedRoute>} />
            <Route path="/admin/inventario" element={<ProtectedRoute allowedRoles={['ADMIN']}><GestInv isDarkMode={isDarkMode} /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute allowedRoles={['ADMIN']}><GestUser isDarkMode={isDarkMode} /></ProtectedRoute>} />
            <Route path="/admin/solicitudes" element={<ProtectedRoute allowedRoles={['ADMIN']}><GestSolicitudes isDarkMode={isDarkMode} /></ProtectedRoute>} />
          </Routes>
          
          <Footer isDarkMode={isDarkMode} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;