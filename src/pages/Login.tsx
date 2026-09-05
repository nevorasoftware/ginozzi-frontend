import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Shield, Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';
import creatorLogo from '../assets/creator-logo.jpg';

interface LoginProps {
  onLoginSuccess: (user: any, token: string, refreshToken: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState('admin@ginozzi.com');
  const [contrasena, setContrasena] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiService.login(correo, contrasena);
      onLoginSuccess(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al conectar con el servidor backend.';
      setError(Array.isArray(msg) ? msg.join(', ') : String(msg));
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (email: string, pass: string) => {
    setCorreo(email);
    setContrasena(pass);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-between items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md my-auto">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 shadow-2xl shadow-emerald-500/20 mb-4">
            <span className="text-3xl font-extrabold text-white">G</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-sans">GINOZZI</h1>
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">Plataforma de Administración Comercial</p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card rounded-2xl p-8 border border-slate-800/80 shadow-2xl bg-slate-900/60 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-2">Iniciar Sesión</h2>
          <p className="text-xs text-slate-400 mb-6">Ingrese sus credenciales corporativas para continuar</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="usuario@ginozzi.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="text-xs">Autenticando...</span>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Buttons for Testing */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Acceso Rápido Demo:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPreset('admin@ginozzi.com', 'Admin123!')}
                className="py-1.5 px-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-[10px] font-medium text-slate-300 transition-colors"
              >
                SuperAdmin
              </button>
              <button
                type="button"
                onClick={() => setPreset('carlos.mendoza@techgroup.sv', 'Empresario123!')}
                className="py-1.5 px-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-[10px] font-medium text-slate-300 transition-colors"
              >
                Propietario
              </button>
              <button
                type="button"
                onClick={() => setPreset('vendedor1@ginozzi.com', 'Vendedor123!')}
                className="py-1.5 px-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-[10px] font-medium text-slate-300 transition-colors"
              >
                Vendedor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info in Login */}
      <footer className="w-full text-center py-4 z-10">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl backdrop-blur-md shadow-lg text-xs text-slate-400">
          <span>&copy; {currentYear} <strong>GINOZZI SaaS Platform</strong>.</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Creado por</span>
          <strong className="text-white">Bryan Siguenza / Jonathan Giron</strong>
          <img
            src={creatorLogo}
            alt="Logo Creadores"
            className="w-5 h-5 rounded-md object-cover border border-emerald-500/40 shadow-sm ml-1"
          />
        </div>
      </footer>
    </div>
  );
};
