import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Cliente, Vendedor } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UserCheck, Search, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

export const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedSeller]);

  const fetchData = async () => {
    try {
      const [cliData, vendData] = await Promise.all([
        apiService.getClientes(selectedSeller || undefined),
        apiService.getVendedores(),
      ]);
      setClientes(cliData);
      setVendedores(vendData);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = clientes.filter(
    (c) =>
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.dui && c.dui.includes(searchTerm))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gestión de Clientes</h1>
          <p className="text-xs text-slate-400 font-medium">Cartera de clientes registrados por la fuerza de ventas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por cliente, correo o DUI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        <select
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="">Todos los vendedores</option>
          {vendedores.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nombre} {v.apellido} ({v.negocio?.nombre})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <th className="p-4">Cliente</th>
                <th className="p-4">DUI / Documento</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Vendedor Asignado</th>
                <th className="p-4">Dirección</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((cli) => (
                <tr key={cli.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {cli.nombre} {cli.apellido}
                  </td>
                  <td className="p-4 font-mono text-slate-300">
                    {cli.dui || 'N/A'}
                  </td>
                  <td className="p-4 text-slate-300">
                    <p className="text-white font-medium">{cli.correo}</p>
                    <p className="text-[10px] text-slate-400">{cli.telefono}</p>
                  </td>
                  <td className="p-4 font-semibold text-emerald-400">
                    {cli.vendedor ? `${cli.vendedor.nombre} ${cli.vendedor.apellido}` : 'N/A'}
                  </td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">
                    {cli.direccion || 'San Salvador, SV'}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={cli.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
