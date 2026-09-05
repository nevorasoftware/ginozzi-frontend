import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Vendedor, Negocio, Empresario, Rubro } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Users, Plus, Search, CreditCard, Layers, Pencil, Trash2, AlertTriangle } from 'lucide-react';

export const Vendedores: React.FC = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [empresarios, setEmpresarios] = useState<Empresario[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null);
  const [deletingVendedor, setDeletingVendedor] = useState<Vendedor | null>(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedStats, setSelectedStats] = useState<any>(null);

  // Dependent Select States for Modal
  const [selectedEmpresarioId, setSelectedEmpresarioId] = useState('');
  const [availableNegocios, setAvailableNegocios] = useState<Negocio[]>([]);
  const [availableRubros, setAvailableRubros] = useState<Rubro[]>([]);

  const [formData, setFormData] = useState({
    empresarioId: '',
    negocioId: '',
    rubroId: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    dui: '',
    contrasena: 'Vendedor123!',
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vendData, empData, negData, rubData] = await Promise.all([
        apiService.getVendedores(),
        apiService.getEmpresarios(),
        apiService.getNegocios(),
        apiService.getRubros(),
      ]);
      setVendedores(vendData);
      setEmpresarios(empData);
      setNegocios(negData);
      setRubros(rubData);

      if (empData.length > 0 && !selectedEmpresarioId) {
        setSelectedEmpresarioId(empData[0].id);
        const filteredNegs = negData.filter(n => n.empresarioId === empData[0].id);
        setAvailableNegocios(filteredNegs);
        const firstNegId = filteredNegs[0]?.id || '';
        const filteredRubs = rubData.filter(r => r.negocioId === firstNegId);
        setAvailableRubros(filteredRubs);

        setFormData(prev => ({
          ...prev,
          empresarioId: empData[0].id,
          negocioId: firstNegId,
          rubroId: filteredRubs[0]?.id || '',
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEmpresarioChange = (empId: string) => {
    setSelectedEmpresarioId(empId);
    const filteredNegs = negocios.filter(n => n.empresarioId === empId);
    setAvailableNegocios(filteredNegs);

    const firstNegId = filteredNegs[0]?.id || '';
    const filteredRubs = rubros.filter(r => r.negocioId === firstNegId);
    setAvailableRubros(filteredRubs);

    setFormData(prev => ({
      ...prev,
      empresarioId: empId,
      negocioId: firstNegId,
      rubroId: filteredRubs[0]?.id || '',
    }));
  };

  const handleNegocioChange = (negId: string) => {
    const filteredRubs = rubros.filter(r => r.negocioId === negId);
    setAvailableRubros(filteredRubs);

    setFormData(prev => ({
      ...prev,
      negocioId: negId,
      rubroId: filteredRubs[0]?.id || '',
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingVendedor(null);
    const empId = empresarios[0]?.id || '';
    const filteredNegs = negocios.filter(n => n.empresarioId === empId);
    const firstNegId = filteredNegs[0]?.id || '';
    const filteredRubs = rubros.filter(r => r.negocioId === firstNegId);

    setSelectedEmpresarioId(empId);
    setAvailableNegocios(filteredNegs);
    setAvailableRubros(filteredRubs);

    setFormData({
      empresarioId: empId,
      negocioId: firstNegId,
      rubroId: filteredRubs[0]?.id || '',
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      dui: '',
      contrasena: 'Vendedor123!',
      estado: 'ACTIVO',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vend: Vendedor) => {
    setEditingVendedor(vend);
    const empId = vend.empresarioId || (vend.negocio?.empresarioId) || empresarios[0]?.id || '';
    const filteredNegs = negocios.filter(n => n.empresarioId === empId);
    const filteredRubs = rubros.filter(r => r.negocioId === vend.negocioId);

    setSelectedEmpresarioId(empId);
    setAvailableNegocios(filteredNegs);
    setAvailableRubros(filteredRubs);

    setFormData({
      empresarioId: empId,
      negocioId: vend.negocioId,
      rubroId: vend.rubroId || '',
      nombre: vend.nombre,
      apellido: vend.apellido,
      correo: vend.correo,
      telefono: vend.telefono,
      dui: vend.dui,
      contrasena: '',
      estado: vend.estado as 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVendedor) {
        const updatePayload: any = { ...formData };
        if (!updatePayload.contrasena) delete updatePayload.contrasena;
        await apiService.updateVendedor(editingVendedor.id, updatePayload);
      } else {
        await apiService.createVendedor(formData);
      }
      setIsModalOpen(false);
      setEditingVendedor(null);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar vendedor');
    }
  };

  const handleToggleStatus = async (vend: Vendedor, newStatus: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO') => {
    try {
      await apiService.toggleVendedorStatus(vend.id, newStatus);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!deletingVendedor) return;
    try {
      await apiService.deleteVendedor(deletingVendedor.id);
      setDeletingVendedor(null);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al eliminar vendedor');
    }
  };

  const handleViewStats = async (vend: Vendedor) => {
    try {
      const stats = await apiService.getVendedorStats(vend.id);
      setSelectedStats(stats);
      setStatsModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = vendedores.filter(
    (v) =>
      `${v.nombre} ${v.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.dui.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-emerald-400" /> Gestión de Vendedores
          </h1>
          <p className="text-xs text-slate-400 font-medium">Control de agentes comerciales asociados a Propietario, Negocio y Rubro</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs tracking-wide transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Vendedor
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/40">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o DUI..."
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
                <th className="p-4">Vendedor</th>
                <th className="p-4">DUI</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Negocio</th>
                <th className="p-4">Rubro</th>
                <th className="p-4">Clientes</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((vend) => (
                <tr key={vend.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {vend.nombre} {vend.apellido}
                  </td>
                  <td className="p-4 font-mono text-slate-300">
                    <span className="flex items-center">
                      <CreditCard className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {vend.dui}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <p className="text-white font-medium">{vend.correo}</p>
                    <p className="text-[10px] text-slate-400">{vend.telefono}</p>
                  </td>
                  <td className="p-4 font-semibold text-emerald-400">
                    {vend.negocio?.nombre || 'N/A'}
                  </td>
                  <td className="p-4 text-indigo-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-indigo-400" />
                      {vend.rubro?.nombre || vend.negocio?.rubro || 'General'}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">
                    {vend._count?.clientes || 0} Clientes
                  </td>
                  <td className="p-4">
                    <StatusBadge status={vend.estado} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewStats(vend)}
                        className="px-2 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 font-semibold text-[11px]"
                      >
                        Métricas
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(vend)}
                        title="Editar Vendedor"
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingVendedor(vend)}
                        title="Eliminar Vendedor"
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleStatus(vend, vend.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO')
                        }
                        className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] border transition-colors ${
                          vend.estado === 'ACTIVO'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {vend.estado === 'ACTIVO' ? 'Inhabilitar' : 'Habilitar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create / Edit Vendedor */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingVendedor ? "Editar Vendedor" : "Registrar Nuevo Vendedor (Jerarquía Completa)"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              1. Propietario *
            </label>
            <select
              required
              value={selectedEmpresarioId}
              onChange={(e) => handleEmpresarioChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {empresarios.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} {emp.apellido} ({emp.correo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              2. Negocio Asignado *
            </label>
            <select
              required
              value={formData.negocioId}
              onChange={(e) => handleNegocioChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {availableNegocios.length === 0 ? (
                <option value="">No hay negocios para este propietario</option>
              ) : (
                availableNegocios.map((neg) => (
                  <option key={neg.id} value={neg.id}>
                    {neg.nombre} ({neg.rubro || 'General'})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              3. Rubro Específico *
            </label>
            <select
              value={formData.rubroId}
              onChange={(e) => setFormData({ ...formData, rubroId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {availableRubros.length === 0 ? (
                <option value="">Sin rubro específico (General)</option>
              ) : (
                availableRubros.map((rub) => (
                  <option key={rub.id} value={rub.id}>
                    {rub.nombre} - {rub.descripcion || 'Sin descripción'}
                  </option>
                ))
              )}
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
                placeholder="Carlos"
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
                placeholder="López"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Correo Electrónico (Único)</label>
              <input
                type="email"
                required
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="vendedor@ginozzi.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">DUI (Único)</label>
              <input
                type="text"
                required
                value={formData.dui}
                onChange={(e) => setFormData({ ...formData, dui: e.target.value })}
                placeholder="01234567-8"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Teléfono</label>
              <input
                type="text"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+503 7000-1000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                {editingVendedor ? 'Nueva Contraseña (Opcional)' : 'Contraseña Inicial'}
              </label>
              <input
                type="password"
                required={!editingVendedor}
                value={formData.contrasena}
                onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                placeholder={editingVendedor ? 'Dejar en blanco para conservar actual' : 'Vendedor123!'}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
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
              {editingVendedor ? "Actualizar Vendedor" : "Guardar Vendedor"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Seller Delete Confirmation Modal */}
      {deletingVendedor && (
        <Modal
          isOpen={!!deletingVendedor}
          onClose={() => setDeletingVendedor(null)}
          title="Confirmar Eliminación"
        >
          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-300">¿Deseas eliminar este vendedor?</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Estás a punto de eliminar a <strong className="text-white">{deletingVendedor.nombre} {deletingVendedor.apellido}</strong> y sus credenciales de usuario. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeletingVendedor(null)}
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

      {/* Seller Stats Modal */}
      <Modal isOpen={statsModalOpen} onClose={() => setStatsModalOpen(false)} title="Métricas de Rendimiento del Vendedor">
        {selectedStats && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-sm font-bold text-white">{selectedStats.vendedor.nombre}</h4>
              <p className="text-xs text-emerald-400">{selectedStats.vendedor.negocio} - {selectedStats.vendedor.rubro}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Facturado</span>
                <p className="text-lg font-extrabold text-emerald-400">${selectedStats.metricas.totalVentas.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Ganancias Generadas</span>
                <p className="text-lg font-extrabold text-indigo-400">${selectedStats.metricas.totalGanancias.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cantidad Ventas</span>
                <p className="text-lg font-extrabold text-white">{selectedStats.metricas.cantidadVentas}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Ticket Promedio</span>
                <p className="text-lg font-extrabold text-amber-400">${selectedStats.metricas.promedioVenta.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
