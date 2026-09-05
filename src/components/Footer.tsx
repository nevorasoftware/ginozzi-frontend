import React from 'react';
import creatorLogo from '../assets/creator-logo.jpg';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span>&copy; {currentYear} <strong className="text-white font-semibold">GINOZZI SaaS Platform</strong>. Todos los derechos reservados.</span>
        </div>

        <div className="flex items-center space-x-2.5 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800/80 shadow-md">
          <span className="text-slate-400 text-[11px] font-medium">Creado por</span>
          <span className="font-bold text-white text-[11px] tracking-wide">Bryan Siguenza / Jonathan Giron</span>
          <img
            src={creatorLogo}
            alt="Logo Creadores"
            className="w-5 h-5 rounded-md object-cover border border-emerald-500/40 shadow-sm"
          />
        </div>
      </div>
    </footer>
  );
};
