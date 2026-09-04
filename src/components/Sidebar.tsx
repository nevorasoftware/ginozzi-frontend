import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  UserCheck,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Settings,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  user: any;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, setIsOpen }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Empresarios', path: '/empresarios', icon: Building2, roles: ['SUPER_ADMIN'] },
    { label: 'Negocios', path: '/negocios', icon: Store, roles: ['SUPER_ADMIN', 'EMPRESARIO'] },
    { label: 'Vendedores', path: '/vendedores', icon: Users },
    { label: 'Clientes', path: '/clientes', icon: UserCheck },
    { label: 'Productos & Servicios', path: '/productos-servicios', icon: ShoppingBag },
    { label: 'Ventas', path: '/ventas', icon: TrendingUp },
    { label: 'Estadísticas', path: '/estadisticas', icon: BarChart3 },
    { label: 'Configuración', path: '/configuracion', icon: Settings },
    { label: 'Perfil', path: '/perfil', icon: User },
  ];

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#0c121e] border-r border-slate-800/80 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-emerald-500/20">
                G
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white font-sans">GINOZZI</span>
                <span className="block text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">SAAS PLATFORM</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-indigo-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.nombre?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.nombre} {user?.apellido}</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};
