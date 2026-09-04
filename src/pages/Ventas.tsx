import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Venta } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { TrendingUp, Search, Eye, Ban, Calendar, User, Store, FileText } from 'lucide-react';

export const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const data = await apiService.getVentas();
      setVentas(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnular = async (id: string) => {
    if (!confirm('¿Está seguro de anular esta venta?')) return;
    try {
      await apiService.anularVenta(id);
      fetchVentas();
      if (selectedVenta?.id === id) {
        setDetailModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenDetail = (venta: Venta) => {
    setSelectedVenta(venta);
    setDetailModalOpen(true);
  };

  const filtered = ventas.filter(
    (v) =>
      v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${v.vendedor?.nombre} ${v.vendedor?.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${v.cliente?.nombre} ${v.cliente?.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.negocio?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Historial de Ventas</h1>
          <p className="text-xs text-slate-400 font-medium">Registro de transacciones comerciales y cálculo de ganancias</p>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/40">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por ID de venta, vendedor, cliente o negocio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <th className="p-4">ID Venta</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Negocio</th>
                <th className="p-4">Vendedor</th>
                <th className="p-4">Cliente</th>
                <th className="p-4 text-right">Total Facturado</th>
                <th className="p-4 text-right">% Ganancia</th>
                <th className="p-4 text-right">Ganancia Net</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.slice(0, 50).map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">#{v.id}</td>
                  <td className="p-4 text-slate-400 font-medium">
                    {new Date(v.fechaVenta).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{v.negocio?.nombre}</td>
                  <td className="p-4 text-slate-300">
                    {v.vendedor ? `${v.vendedor.nombre} ${v.vendedor.apellido}` : 'N/A'}
                  </td>
                  <td className="p-4 text-slate-300">
                    {v.cliente ? `${v.cliente.nombre} ${v.cliente.apellido}` : 'N/A'}
                  </td>
                  <td className="p-4 text-right font-extrabold text-emerald-400 font-mono text-sm">
                    ${v.total.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-mono text-slate-400">
                    {v.porcentajeGanancia}%
                  </td>
                  <td className="p-4 text-right font-extrabold text-indigo-400 font-mono">
                    ${v.montoGanancia.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={v.estado} />
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenDetail(v)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Ver Detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {v.estado === 'COMPLETADA' && (
                      <button
                        onClick={() => handleAnular(v.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                        title="Anular Venta"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Detalle Completo de la Venta">
        {selectedVenta && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Venta ID</span>
                <p className="text-sm font-extrabold text-white font-mono">#{selectedVenta.id}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Venta</span>
                <p className="text-sm font-extrabold text-emerald-400 font-mono">${selectedVenta.total.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">% Aplicado</span>
                <p className="text-sm font-extrabold text-amber-400 font-mono">{selectedVenta.porcentajeGanancia}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Monto Ganancia</span>
                <p className="text-sm font-extrabold text-indigo-400 font-mono">${selectedVenta.montoGanancia.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Líneas de Detalle</h4>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <th className="p-3">Item / Producto / Servicio</th>
                      <th className="p-3 text-center">Cant.</th>
                      <th className="p-3 text-right">P. Unitario</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {selectedVenta.detalles?.map((det) => (
                      <tr key={det.id}>
                        <td className="p-3 font-semibold text-white">
                          {det.productoServicio?.nombre || 'Producto'}
                        </td>
                        <td className="p-3 text-center font-mono">{det.cantidad}</td>
                        <td className="p-3 text-right font-mono">${det.precioUnitario.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-400">${det.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
