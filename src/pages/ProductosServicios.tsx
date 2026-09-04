import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { ProductoServicio, Negocio } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ShoppingBag, Plus, Search, Tag, DollarSign, Store } from 'lucide-react';

export const ProductosServicios: React.FC = () => {
  const [items, setItems] = useState<ProductoServicio[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    negocioId: '',
    nombre: '',
    descripcion: '',
    tipo: 'PRODUCTO' as 'PRODUCTO' | 'SERVICIO',
    precio: 0,
    estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO',
  });

  useEffect(() => {
    fetchData();
  }, [tipoFilter]);

  const fetchData = async () => {
    try {
      const [psData, negData] = await Promise.all([
        apiService.getProductosServicios(undefined, tipoFilter || undefined),
        apiService.getNegocios(),
      ]);
      setItems(psData);
      setNegocios(negData);
      if (negData.length > 0) {
        setFormData((prev) => ({ ...prev, negocioId: negData[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createProductoServicio(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar item');
    }
  };

  const filtered = items.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Productos & Servicios</h1>
          <p className="text-xs text-slate-400 font-medium">Catálogo general ofertado por los negocios</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs tracking-wide transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto/Servicio
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar en el catálogo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTipoFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              tipoFilter === '' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setTipoFilter('PRODUCTO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              tipoFilter === 'PRODUCTO' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setTipoFilter('SERVICIO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              tipoFilter === 'SERVICIO' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Servicios
          </button>
        </div>
      </div>

      {/* Grid Cards view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700/80 bg-slate-900/60 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  item.tipo === 'PRODUCTO' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}>
                  {item.tipo}
                </span>
                <StatusBadge status={item.estado} />
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{item.nombre}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.descripcion || 'Sin descripción detallada.'}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center">
                <Store className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {item.negocio?.nombre}
              </span>
              <span className="text-base font-black text-emerald-400 font-mono">
                ${item.precio.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Producto o Servicio">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Negocio</label>
            <select
              required
              value={formData.negocioId}
              onChange={(e) => setFormData({ ...formData, negocioId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {negocios.map((neg) => (
                <option key={neg.id} value={neg.id}>
                  {neg.nombre}
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
                placeholder="Ej. Servicio Consultoría TI"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="PRODUCTO">PRODUCTO</option>
                <option value="SERVICIO">SERVICIO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Descripción</label>
            <textarea
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Descripción breve del item..."
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
              Guardar Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
