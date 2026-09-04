import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (s: string) => {
    switch (s?.toUpperCase()) {
      case 'ACTIVO':
      case 'COMPLETADA':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'INACTIVO':
      case 'PENDIENTE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'BLOQUEADO':
      case 'ANULADA':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
};
