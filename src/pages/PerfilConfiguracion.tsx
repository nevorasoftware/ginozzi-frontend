import React from 'react';
import { User, Shield, Key, Bell, Save } from 'lucide-react';

interface PerfilProps {
  user: any;
}

export const PerfilConfiguracion: React.FC<PerfilProps> = ({ user }) => {
  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Perfil & Configuración</h1>
        <p className="text-xs text-slate-400 font-medium">Gestión de la cuenta de usuario y preferencias del sistema</p>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60 space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-emerald-500/20">
            {user?.nombre?.[0] || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.nombre} {user?.apellido}</h2>
            <p className="text-xs text-slate-400">{user?.correo}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ROL: {user?.role}
            </span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Perfil actualizado.'); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Nombre</label>
              <input
                type="text"
                defaultValue={user?.nombre || ''}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Apellido</label>
              <input
                type="text"
                defaultValue={user?.apellido || ''}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <input
              type="email"
              disabled
              defaultValue={user?.correo || ''}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/60 rounded-xl text-xs text-slate-400 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
