import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Empresarios } from './pages/Empresarios';
import { Negocios } from './pages/Negocios';
import { Vendedores } from './pages/Vendedores';
import { Clientes } from './pages/Clientes';
import { ProductosServicios } from './pages/ProductosServicios';
import { Ventas } from './pages/Ventas';
import { Estadisticas } from './pages/Estadisticas';
import { PerfilConfiguracion } from './pages/PerfilConfiguracion';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

export function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('ginozzi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLoginSuccess = (userData: any, accessToken: string, refreshToken: string) => {
    setUser(userData);
    localStorage.setItem('ginozzi_user', JSON.stringify(userData));
    localStorage.setItem('ginozzi_token', accessToken);
    localStorage.setItem('ginozzi_refresh_token', refreshToken);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ginozzi_user');
    localStorage.removeItem('ginozzi_token');
    localStorage.removeItem('ginozzi_refresh_token');
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
        {/* Sidebar */}
        <Sidebar
          user={user}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/empresarios" element={<Empresarios />} />
              <Route path="/negocios" element={<Negocios />} />
              <Route path="/vendedores" element={<Vendedores />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/productos-servicios" element={<ProductosServicios />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/configuracion" element={<PerfilConfiguracion user={user} />} />
              <Route path="/perfil" element={<PerfilConfiguracion user={user} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
