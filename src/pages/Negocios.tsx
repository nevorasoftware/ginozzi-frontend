import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Negocio, Empresario } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Store, Plus, Search, Pencil, Trash2, AlertTriangle } from 'lucide-react';

export const Negocios: React.FC = () => {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [empresarios, setEmpresarios] = useState<Empresario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNegocio, setEditingNegocio] = useState<Negocio | null>(null);
  const [deletingNegocio, setDeletingNegocio] = useState<Negocio | null>(null);

  const [formData, setFormData] = useState({
    empresarioId: '',
    nombre: '',
    rubro: 'Tecnología',
    telefono: '',
    correo: '',
    porcentajeGanancia: 15.0,
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [negData, empData] = await Promise.all([
        apiService.getNegocios(),
        apiService.getEmpresarios(),
      ]);
      setNegocios(negData);
      setEmpresarios(empData);
      if (empData.length > 0 && !formData.empresarioId) {
        setFormData((prev) => ({ ...prev, empresarioId: empData[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingNegocio(null);
    setFormData({
      empresarioId: empresarios[0]?.id || '',
      nombre: '',
      rubro: 'Tecnología',
      telefono: '',
      correo: '',
      porcentajeGanancia: 15.0,
      estado: 'ACTIVO',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (neg: Negocio) => {
    setEditingNegocio(neg);
    setFormData({
      empresarioId: neg.empresarioId,
      nombre: neg.nombre,
      rubro: neg.rubro,
      telefono: neg.telefono,
      correo: neg.correo,
      porcentajeGanancia: neg.porcentajeGanancia,
      estado: neg.estado as 'ACTIVO' | 'INACTIVO',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNegocio) {
        await apiService.updateNegocio(editingNegocio.id, formData);
      } else {
        await apiService.createNegocio(formData);
      }
      setIsModalOpen(false);
      setEditingNegocio(null);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar negocio');
    }
  };

  const handleToggleStatus = async (neg: Negocio) => {
    const nextStatus = neg.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      await apiService.toggleNegocioStatus(neg.id, nextStatus);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!deletingNegocio) return;
    try {
      await apiService.deleteNegocio(deletingNegocio.id);
      setDeletingNegocio(null);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al eliminar negocio');
    }
  };

  const filtered = negocios.filter(
    (n) =>
      n.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.rubro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gestión de Negocios</h1>
          <p className="text-xs text-slate-400 font-medium">Configuración de empresas y porcentajes de ganancia</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs tracking-wide transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Negocio
        </button>
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/40">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar negocio por nombre o rubro..."
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
                <th className="p-4">Nombre Negocio</th>
                <th className="p-4">Rubro</th>
                <th className="p-4">Propietario</th>
                <th className="p-4">% Ganancia</th>
                <th className="p-4">Vendedores</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((neg) => (
                <tr key={neg.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center">
                    <Store className="w-4 h-4 mr-2 text-emerald-400" />
                    {neg.nombre}
                  </td>
                  <td className="p-4 text-slate-300 font-medium">{neg.rubro}</td>
                  <td className="p-4 text-slate-300">
                    {neg.empresario ? `${neg.empresario.nombre} ${neg.empresario.apellido}` : 'N/A'}
                  </td>
                  <td className="p-4 font-extrabold text-emerald-400 font-mono text-sm">
                    {neg.porcentajeGanancia.toFixed(2)}%
                  </td>
                  <td className="p-4 font-semibold text-slate-300">
                    {neg.vendedores?.length || 0} Vendedor(es)
                  </td>
                  <td className="p-4">
                    <StatusBadge status={neg.estado} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(neg)}
                        title="Editar Negocio"
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingNegocio(neg)}
                        title="Eliminar Negocio"
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(neg)}
                        className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] border transition-colors ${
                          neg.estado === 'ACTIVO'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {neg.estado === 'ACTIVO' ? 'Inhabilitar' : 'Habilitar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Creación/Edición */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingNegocio ? "Editar Negocio" : "Registrar Nuevo Negocio"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Propietario</label>
            <select
              required
              value={formData.empresarioId}
              onChange={(e) => setFormData({ ...formData, empresarioId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {empresarios.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} {emp.apellido} ({emp.correo})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Nombre del Negocio</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="TechGroup Solutions"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Rubro</label>
              <select
                value={formData.rubro}
                onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Tecnología">Tecnología</option>
                <option value="Belleza">Belleza</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Construcción">Construcción</option>
                <option value="Servicios profesionales">Servicios profesionales</option>
                <option value="Comercio">Comercio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Correo Contacto</label>
              <input
                type="email"
                required
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="info@negocio.sv"
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
                placeholder="+503 2233-4455"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Porcentaje de Ganancia (%)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.porcentajeGanancia}
              onChange={(e) => setFormData({ ...formData, porcentajeGanancia: parseFloat(e.target.value) || 0 })}
              placeholder="15.50"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Este porcentaje se aplicará automáticamente a cada venta para calcular las ganancias.</p>
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
              {editingNegocio ? "Actualizar Negocio" : "Guardar Negocio"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      {deletingNegocio && (
        <Modal
          isOpen={!!deletingNegocio}
          onClose={() => setDeletingNegocio(null)}
          title="Confirmar Eliminación"
        >
          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-300">¿Deseas eliminar este negocio?</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Estás a punto de eliminar el negocio <strong className="text-white">{deletingNegocio.nombre}</strong>. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeletingNegocio(null)}
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
