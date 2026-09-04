import React, { useState, useEffect } from 'react';
import { Rubro, Negocio } from '../types';
import { apiService } from '../services/apiService';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { Layers, Plus, Search, Edit2, CheckCircle, XCircle, Trash2, Building2 } from 'lucide-react';

export const RubrosPage: React.FC = () => {
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterNegocio, setFilterNegocio] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRubro, setEditingRubro] = useState<Rubro | null>(null);
  const [formData, setFormData] = useState({
    negocioId: '',
    nombre: '',
    descripcion: '',
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [rList, nList] = await Promise.all([
        apiService.getRubros(filterNegocio || undefined),
        apiService.getNegocios(),
      ]);
      setRubros(rList);
      setNegocios(nList);
    } catch (err) {
      console.error('Error cargando rubros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterNegocio]);

  const handleOpenCreateModal = () => {
    setEditingRubro(null);
    setFormData({
      negocioId: negocios[0]?.id || '',
      nombre: '',
      descripcion: '',
      estado: 'ACTIVO',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rubro: Rubro) => {
    setEditingRubro(rubro);
    setFormData({
      negocioId: rubro.negocioId,
      nombre: rubro.nombre,
      descripcion: rubro.descripcion || '',
      estado: rubro.estado,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.negocioId) return;

    if (editingRubro) {
      await apiService.updateRubro(editingRubro.id, formData);
    } else {
      await apiService.createRubro(formData);
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleToggleStatus = async (rubro: Rubro) => {
    const nextStatus = rubro.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    await apiService.toggleRubroStatus(rubro.id, nextStatus);
    loadData();
  };

  const filteredRubros = rubros.filter((r) => {
    const matchesSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.descripcion && r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="h-7 w-7 text-indigo-400" /> Gestión de Rubros Comerciales
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Administre los rubros específicos de cada negocio para organizar catálogos y vendedores.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" /> Nuevo Rubro
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar rubro por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-400" />
          <select
            value={filterNegocio}
            onChange={(e) => setFilterNegocio(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todos los Negocios</option>
            {negocios.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre} ({n.empresario?.nombre || 'General'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/90 rounded-xl border border-slate-700/80 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Cargando rubros...</div>
        ) : filteredRubros.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No se encontraron rubros registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/70 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700/80">
                <tr>
                  <th className="py-3.5 px-4">Rubro</th>
                  <th className="py-3.5 px-4">Negocio Perteneciente</th>
                  <th className="py-3.5 px-4">Descripción</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredRubros.map((rubro) => {
                  const negocioObj = negocios.find((n) => n.id === rubro.negocioId) || rubro.negocio;
                  return (
                    <tr key={rubro.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-indigo-400" />
                        {rubro.nombre}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {negocioObj?.nombre || 'General'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        {rubro.descripcion || 'Sin descripción'}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={rubro.estado} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(rubro)}
                          className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(rubro)}
                          className={`p-1.5 rounded-lg transition ${
                            rubro.estado === 'ACTIVO'
                              ? 'bg-amber-900/40 hover:bg-amber-900/60 text-amber-300'
                              : 'bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300'
                          }`}
                          title={rubro.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
                        >
                          {rubro.estado === 'ACTIVO' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRubro ? 'Editar Rubro Comercial' : 'Crear Nuevo Rubro'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Negocio Perteneciente *
            </label>
            <select
              value={formData.negocioId}
              onChange={(e) => setFormData({ ...formData, negocioId: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Seleccione un negocio...</option>
              {negocios.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nombre} ({n.empresario?.nombre || 'General'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Nombre del Rubro *
            </label>
            <input
              type="text"
              placeholder="Ej. Librería, Papelería, Tecnología, Impresiones"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Descripción
            </label>
            <textarea
              placeholder="Descripción breve de los servicios o artículos de este rubro..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'ACTIVO' | 'INACTIVO' })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-600/20"
            >
              {editingRubro ? 'Guardar Cambios' : 'Crear Rubro'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
