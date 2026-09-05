import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Cliente, Vendedor, Negocio } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { UserCheck, Search, Plus, Pencil, Trash2, AlertTriangle, CreditCard } from 'lucide-react';

export const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [selectedNegocio, setSelectedNegocio] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);

  const [formData, setFormData] = useState({
    vendedorId: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    dui: '',
    direccion: '',
    observaciones: '',
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO',
  });

  useEffect(() => {
    fetchData();
  }, [selectedSeller]);

  const fetchData = async () => {
    try {
      const [cliData, vendData, negData] = await Promise.all([
        apiService.getClientes(selectedSeller || undefined),
        apiService.getVendedores(),
        apiService.getNegocios(),
      ]);
      setClientes(cliData);
      setVendedores(vendData);
      setNegocios(negData);
      if (vendData.length > 0 && !formData.vendedorId) {
        setFormData(prev => ({ ...prev, vendedorId: vendData[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCliente(null);
    setFormData({
      vendedorId: vendedores[0]?.id || '',
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      dui: '',
      direccion: '',
      observaciones: '',
      estado: 'ACTIVO',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cli: Cliente) => {
    setEditingCliente(cli);
    setFormData({
      vendedorId: cli.vendedorId || (vendedores[0]?.id || ''),
      nombre: cli.nombre,
      apellido: cli.apellido,
      telefono: cli.telefono,
      correo: cli.correo,
      dui: cli.dui || '',
      direccion: cli.direccion || '',
      observaciones: cli.observaciones || '',
      estado: cli.estado as 'ACTIVO' | 'INACTIVO',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await apiService.updateCliente(editingCliente.id, formData);
      } else {
        await apiService.createCliente(formData);
      }
      setIsModalOpen(false);
      setEditingCliente(null);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar cliente');
    }
  };

  const handleToggleStatus = async (cli: Cliente) => {
    const nextStatus = cli.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      await apiService.toggleClienteStatus(cli.id, nextStatus);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!deletingCliente) return;
    try {
      await apiService.deleteCliente(deletingCliente.id);
      setDeletingCliente(null);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al eliminar cliente');
    }
  };

  const availableVendedores = selectedNegocio
    ? vendedores.filter((v) => v.negocioId === selectedNegocio || v.negocio?.id === selectedNegocio)
    : vendedores;

  const filtered = clientes.filter((c) => {
    const matchesSearch =
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.dui && c.dui.includes(searchTerm));

    const matchesNegocio =
      !selectedNegocio ||
      c.negocioId === selectedNegocio ||
      c.negocio?.id === selectedNegocio ||
      c.vendedor?.negocioId === selectedNegocio ||
      c.vendedor?.negocio?.id === selectedNegocio;

    const matchesSeller =
      !selectedSeller ||
      c.vendedorId === selectedSeller ||
      c.vendedor?.id === selectedSeller;

    return matchesSearch && matchesNegocio && matchesSeller;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-emerald-400" /> Gestión de Clientes
          </h1>
          <p className="text-xs text-slate-400 font-medium">Cartera de clientes registrados por la fuerza de ventas</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs tracking-wide transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
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
                <th className="p-4">Cliente</th>
                <th className="p-4">DUI / Documento</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Vendedor Asignado</th>
                <th className="p-4">Dirección</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
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
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(cli)}
                        title="Editar Cliente"
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCliente(cli)}
                        title="Eliminar Cliente"
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(cli)}
                        className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] border transition-colors ${
                          cli.estado === 'ACTIVO'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {cli.estado === 'ACTIVO' ? 'Inhabilitar' : 'Habilitar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Creación / Edición */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCliente ? "Editar Cliente" : "Registrar Nuevo Cliente"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Vendedor Asignado *
            </label>
            <select
              required
              value={formData.vendedorId}
              onChange={(e) => setFormData({ ...formData, vendedorId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {vendedores.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre} {v.apellido} ({v.negocio?.nombre || 'General'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Juan"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Apellido</label>
              <input
                type="text"
                required
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Pérez"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="juan.perez@gmail.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Teléfono</label>
              <input
                type="text"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+503 7788-9900"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">DUI (Opcional)</label>
              <input
                type="text"
                value={formData.dui}
                onChange={(e) => setFormData({ ...formData, dui: e.target.value })}
                placeholder="09876543-2"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'ACTIVO' | 'INACTIVO' })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Col. Escalón, San Salvador"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
            >
              {editingCliente ? "Actualizar Cliente" : "Guardar Cliente"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      {deletingCliente && (
        <Modal
          isOpen={!!deletingCliente}
          onClose={() => setDeletingCliente(null)}
          title="Confirmar Eliminación de Cliente"
        >
          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-300">¿Deseas eliminar este cliente?</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Estás a punto de eliminar al cliente <strong className="text-white">{deletingCliente.nombre} {deletingCliente.apellido}</strong>. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeletingCliente(null)}
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
