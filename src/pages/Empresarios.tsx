import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Empresario } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Building2, Plus, Search, Mail, Phone, Edit2, Trash2, AlertTriangle } from 'lucide-react';

export const Empresarios: React.FC = () => {
  const [empresarios, setEmpresarios] = useState<Empresario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpresario, setEditingEmpresario] = useState<Empresario | null>(null);
  const [deleteConfirmEmpresario, setDeleteConfirmEmpresario] = useState<Empresario | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO',
  });

  useEffect(() => {
    fetchEmpresarios();
  }, []);

  const fetchEmpresarios = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEmpresarios();
      setEmpresarios(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEmpresario(null);
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      estado: 'ACTIVO',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: Empresario) => {
    setEditingEmpresario(emp);
    setFormData({
      nombre: emp.nombre,
      apellido: emp.apellido,
      correo: emp.correo,
      telefono: emp.telefono,
      estado: emp.estado,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmpresario) {
        await apiService.updateEmpresario(editingEmpresario.id, formData);
      } else {
        await apiService.createEmpresario(formData);
      }
      setIsModalOpen(false);
      setEditingEmpresario(null);
      setFormData({ nombre: '', apellido: '', correo: '', telefono: '', estado: 'ACTIVO' });
      fetchEmpresarios();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar empresario');
    }
  };

  const handleToggleStatus = async (emp: Empresario) => {
    const nextStatus = emp.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      await apiService.toggleEmpresarioStatus(emp.id, nextStatus);
      fetchEmpresarios();
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmEmpresario) return;
    try {
      await apiService.deleteEmpresario(deleteConfirmEmpresario.id);
      setDeleteConfirmEmpresario(null);
      fetchEmpresarios();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al eliminar empresario');
    }
  };

  const filtered = empresarios.filter(
    (e) =>
      `${e.nombre} ${e.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gestión de Empresarios</h1>
          <p className="text-xs text-slate-400 font-medium">Administración de titulares y propietarios de negocios</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs tracking-wide transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Empresario
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar empresario por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <th className="p-4">Empresario</th>
                <th className="p-4">Correo Electrónico</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Negocios Asociados</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-white">
                    {emp.nombre} {emp.apellido}
                  </td>
                  <td className="p-4 text-slate-300">
                    <span className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {emp.correo}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <span className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {emp.telefono}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-emerald-400">
                    {emp.negocios?.length || 0} Negocio(s)
                  </td>
                  <td className="p-4">
                    <StatusBadge status={emp.estado} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(emp)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg border border-slate-700 transition-colors"
                        title="Editar empresario"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(emp)}
                        className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] border transition-colors ${
                          emp.estado === 'ACTIVO'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                        title={emp.estado === 'ACTIVO' ? 'Inhabilitar empresario' : 'Habilitar empresario'}
                      >
                        {emp.estado === 'ACTIVO' ? 'Inhabilitar' : 'Habilitar'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmEmpresario(emp)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition-colors"
                        title="Eliminar empresario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create/Edit Empresario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmpresario(null);
        }}
        title={editingEmpresario ? 'Editar Empresario' : 'Registrar Nuevo Empresario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Mendoza"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              placeholder="carlos@techgroup.sv"
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
              placeholder="+503 7890-1122"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {editingEmpresario && (
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
          )}

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingEmpresario(null);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
            >
              {editingEmpresario ? 'Guardar Cambios' : 'Guardar Empresario'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmEmpresario}
        onClose={() => setDeleteConfirmEmpresario(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold">¿Eliminar este empresario?</p>
              <p className="text-[11px] text-rose-200/80">
                Se eliminará a <strong>{deleteConfirmEmpresario?.nombre} {deleteConfirmEmpresario?.apellido}</strong> ({deleteConfirmEmpresario?.correo}) y sus accesos asociados.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setDeleteConfirmEmpresario(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20"
            >
              Eliminar Definitivamente
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
