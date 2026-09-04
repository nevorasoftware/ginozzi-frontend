import React from 'react';
import { Menu, Bell, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  user: any;
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onMenuClick }) => {
  return (
    <header className="h-16 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar negocios, vendedores..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Status Badge */}
        <div className="hidden md:flex items-center px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          GINOZZI Live v1.0
        </div>

        {/* Notifications Button */}
        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-2 ring-[#090d16]" />
        </button>
      </div>
    </header>
  );
};
