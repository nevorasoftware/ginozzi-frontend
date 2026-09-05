import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Venta, Negocio, Vendedor } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { TrendingUp, Search, Eye, Ban, Calendar, User, Store, Layers, Trash2, AlertTriangle } from 'lucide-react';

export const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [selectedNegocio, setSelectedNegocio] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [deletingVenta, setDeletingVenta] = useState<Venta | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const [ventasData, negociosData, vendedoresData] = await Promise.all([
        apiService.getVentas(),
        apiService.getNegocios(),
        apiService.getVendedores(),
      ]);
      setVentas(ventasData);
      setNegocios(negociosData);
      setVendedores(vendedoresData);
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

  const handleDelete = async () => {
    if (!deletingVenta) return;
    try {
      await apiService.deleteVenta(deletingVenta.id);
      setDeletingVenta(null);
      fetchVentas();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al eliminar venta');
    }
  };

  const handleOpenDetail = (venta: Venta) => {
    setSelectedVenta(venta);
    setDetailModalOpen(true);
  };

  const availableVendedores = selectedNegocio
    ? vendedores.filter((v) => v.negocioId === selectedNegocio || v.negocio?.id === selectedNegocio)
    : vendedores;

  const filtered = ventas.filter((v) => {
    const matchesSearch =
      v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${v.vendedor?.nombre} ${v.vendedor?.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${v.cliente?.nombre} ${v.cliente?.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.negocio?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.rubro?.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesNegocio =
      !selectedNegocio ||
      v.negocioId === selectedNegocio ||
      v.negocio?.id === selectedNegocio ||
      v.vendedor?.negocioId === selectedNegocio;

    const matchesSeller =
      !selectedSeller ||
      v.vendedorId === selectedSeller ||
      v.vendedor?.id === selectedSeller;

    return matchesSearch && matchesNegocio && matchesSeller;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-emerald-400" /> Historial de Ventas Multi-Negocio
          </h1>
          <p className="text-xs text-slate-400 font-medium">Registro de transacciones comerciales con desglose por Rubro y Snapshots</p>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por ID de venta, vendedor, cliente, rubro o negocio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedNegocio}
            onChange={(e) => {
              setSelectedNegocio(e.target.value);
              setSelectedSeller('');
            }}
            className="w-full sm:w-56 px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Todos los negocios</option>
            {negocios.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre}
              </option>
            ))}
          </select>

          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Todos los vendedores</option>
            {availableVendedores.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre} {v.apellido} ({v.negocio?.nombre || 'General'})
              </option>
            ))}
          </select>
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
                <th className="p-4">Negocio / Rubro</th>
                <th className="p-4">Vendedor</th>
                <th className="p-4">Cliente</th>
                <th className="p-4 text-right">Total Facturado</th>
                <th className="p-4 text-right">% Ganancia</th>
                <th className="p-4 text-right">Ganancia Neta</th>
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
                  <td className="p-4 font-semibold text-slate-200">
                    <div>{v.negocio?.nombre || 'General'}</div>
                    <div className="text-[10px] text-indigo-400 flex items-center gap-1 mt-0.5">
                      <Layers className="h-3 w-3" />
                      {v.rubro?.nombre || v.negocio?.rubro || 'Rubro'}
                    </div>
                  </td>
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
                    <button
                      onClick={() => setDeletingVenta(v)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                      title="Eliminar Registro de Venta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Detalle Completo & Snapshot de Venta">
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
                <span className="text-[10px] text-slate-400 font-semibold uppercase">% Ganancia</span>
                <p className="text-sm font-extrabold text-amber-400 font-mono">{selectedVenta.porcentajeGanancia}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Ganancia Neta</span>
                <p className="text-sm font-extrabold text-indigo-400 font-mono">${selectedVenta.montoGanancia.toFixed(2)}</p>
              </div>
            </div>

            {/* Context Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Negocio:</span>{' '}
                <span className="text-white font-bold">{selectedVenta.negocio?.nombre || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Rubro:</span>{' '}
                <span className="text-indigo-400 font-bold">{selectedVenta.rubro?.nombre || selectedVenta.negocio?.rubro || 'General'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Vendedor:</span>{' '}
                <span className="text-emerald-400 font-bold">
                  {selectedVenta.vendedor ? `${selectedVenta.vendedor.nombre} ${selectedVenta.vendedor.apellido}` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Line items with snapshot names */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Líneas de Detalle (Snapshot Histórico)</h4>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <th className="p-3">Item / Producto (Snapshot)</th>
                      <th className="p-3 text-center">Cant.</th>
                      <th className="p-3 text-right">P. Unitario</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {selectedVenta.detalles?.map((det) => (
                      <tr key={det.id}>
                        <td className="p-3 font-semibold text-white">
                          {det.nombreProductoSnapshot || det.productoServicio?.nombre || 'Producto / Servicio'}
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

      {/* Delete Confirmation Modal */}
      {deletingVenta && (
        <Modal
          isOpen={!!deletingVenta}
          onClose={() => setDeletingVenta(null)}
          title="Confirmar Eliminación de Venta"
        >
          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-300">¿Deseas eliminar este registro de venta?</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Estás a punto de eliminar la venta <strong className="text-white">#{deletingVenta.id}</strong> por un valor total de <strong className="text-emerald-400">${deletingVenta.total.toFixed(2)}</strong>. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeletingVenta(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/20"
              >
                Eliminar Registro
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
