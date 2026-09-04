import React, { useState, useEffect } from 'react';
import { Empresario, Negocio, Rubro, Vendedor, FilterState } from '../types';
import { apiService } from '../services/apiService';
import { Filter, Calendar, Building2, Store, Layers, Users, X, RefreshCw } from 'lucide-react';

interface DashboardFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ filters, onFilterChange }) => {
  const [empresarios, setEmpresarios] = useState<Empresario[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [empList, negList, rubList, vendList] = await Promise.all([
        apiService.getEmpresarios(),
        apiService.getNegocios(),
        apiService.getRubros(),
        apiService.getVendedores(),
      ]);
      setEmpresarios(empList);
      setNegocios(negList);
      setRubros(rubList);
      setVendedores(vendList);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  // Cascading Filter Logic:
  // Negocios available based on selected Empresarios
  const availableNegocios = filters.empresarioIds.length > 0
    ? negocios.filter((n) => filters.empresarioIds.includes(n.empresarioId))
    : negocios;

  // Rubros available based on available Negocios
  const availableRubros = filters.negocioIds.length > 0
    ? rubros.filter((r) => filters.negocioIds.includes(r.negocioId))
    : rubros.filter((r) => availableNegocios.some((n) => n.id === r.negocioId));

  // Vendedores available based on available Rubros / Negocios
  const availableVendedores = filters.rubroIds.length > 0
    ? vendedores.filter((v) => v.rubroId && filters.rubroIds.includes(v.rubroId))
    : filters.negocioIds.length > 0
    ? vendedores.filter((v) => filters.negocioIds.includes(v.negocioId))
    : vendedores;

  const handlePeriodChange = (period: '1M' | '3M' | '6M' | '12M' | 'custom') => {
    onFilterChange({ ...filters, period });
  };

  const toggleMultiSelect = (key: 'empresarioIds' | 'negocioIds' | 'rubroIds' | 'vendedorIds', id: string) => {
    const current = filters[key];
    const updated = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    
    // Auto-clean dependent lower-level filters when higher-level filters change
    let newFilters = { ...filters, [key]: updated };
    if (key === 'empresarioIds') {
      newFilters.negocioIds = [];
      newFilters.rubroIds = [];
      newFilters.vendedorIds = [];
    } else if (key === 'negocioIds') {
      newFilters.rubroIds = [];
      newFilters.vendedorIds = [];
    } else if (key === 'rubroIds') {
      newFilters.vendedorIds = [];
    }

    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    onFilterChange({
      period: '12M',
      empresarioIds: [],
      negocioIds: [],
      rubroIds: [],
      vendedorIds: [],
      from: undefined,
      to: undefined,
    });
  };

  const activeCount =
    filters.empresarioIds.length +
    filters.negocioIds.length +
    filters.rubroIds.length +
    filters.vendedorIds.length +
    (filters.period !== '12M' ? 1 : 0);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-bold text-slate-100">Filtros Jerárquicos Analíticos</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {activeCount} activo{activeCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {(['1M', '3M', '6M', '12M'] as const).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                filters.period === p
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
          {activeCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="ml-2 px-2.5 py-1 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-1 transition"
              title="Limpiar filtros"
            >
              <RefreshCw className="h-3 w-3" /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Multi-Select Filter Accordions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Empresario Multi-Select */}
        <div className="relative">
          <button
            onClick={() => setExpandedFilter(expandedFilter === 'emp' ? null : 'emp')}
            className={`w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 border rounded-xl text-xs font-medium transition ${
              filters.empresarioIds.length > 0
                ? 'border-emerald-500/60 text-emerald-400 font-bold'
                : 'border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
              {filters.empresarioIds.length === 0
                ? 'Todos los Empresarios'
                : `${filters.empresarioIds.length} Empresario(s)`}
            </span>
            <span className="text-slate-500 text-xs">▼</span>
          </button>

          {expandedFilter === 'emp' && (
            <div className="absolute z-50 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl space-y-1 max-h-48 overflow-y-auto">
              {empresarios.map((emp) => (
                <label
                  key={emp.id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-900 rounded cursor-pointer text-xs text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={filters.empresarioIds.includes(emp.id)}
                    onChange={() => toggleMultiSelect('empresarioIds', emp.id)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                  />
                  <span className="truncate">{emp.nombre} {emp.apellido}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 2. Negocio Multi-Select */}
        <div className="relative">
          <button
            onClick={() => setExpandedFilter(expandedFilter === 'neg' ? null : 'neg')}
            className={`w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 border rounded-xl text-xs font-medium transition ${
              filters.negocioIds.length > 0
                ? 'border-emerald-500/60 text-emerald-400 font-bold'
                : 'border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <Store className="h-4 w-4 text-emerald-400 shrink-0" />
              {filters.negocioIds.length === 0
                ? 'Todos los Negocios'
                : `${filters.negocioIds.length} Negocio(s)`}
            </span>
            <span className="text-slate-500 text-xs">▼</span>
          </button>

          {expandedFilter === 'neg' && (
            <div className="absolute z-50 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl space-y-1 max-h-48 overflow-y-auto">
              {availableNegocios.map((neg) => (
                <label
                  key={neg.id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-900 rounded cursor-pointer text-xs text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={filters.negocioIds.includes(neg.id)}
                    onChange={() => toggleMultiSelect('negocioIds', neg.id)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                  />
                  <span className="truncate">{neg.nombre}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 3. Rubro Multi-Select */}
        <div className="relative">
          <button
            onClick={() => setExpandedFilter(expandedFilter === 'rub' ? null : 'rub')}
            className={`w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 border rounded-xl text-xs font-medium transition ${
              filters.rubroIds.length > 0
                ? 'border-emerald-500/60 text-emerald-400 font-bold'
                : 'border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <Layers className="h-4 w-4 text-sky-400 shrink-0" />
              {filters.rubroIds.length === 0
                ? 'Todos los Rubros'
                : `${filters.rubroIds.length} Rubro(s)`}
            </span>
            <span className="text-slate-500 text-xs">▼</span>
          </button>

          {expandedFilter === 'rub' && (
            <div className="absolute z-50 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl space-y-1 max-h-48 overflow-y-auto">
              {availableRubros.map((rub) => (
                <label
                  key={rub.id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-900 rounded cursor-pointer text-xs text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={filters.rubroIds.includes(rub.id)}
                    onChange={() => toggleMultiSelect('rubroIds', rub.id)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                  />
                  <span className="truncate">{rub.nombre}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 4. Vendedor Multi-Select */}
        <div className="relative">
          <button
            onClick={() => setExpandedFilter(expandedFilter === 'vend' ? null : 'vend')}
            className={`w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 border rounded-xl text-xs font-medium transition ${
              filters.vendedorIds.length > 0
                ? 'border-emerald-500/60 text-emerald-400 font-bold'
                : 'border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <Users className="h-4 w-4 text-amber-400 shrink-0" />
              {filters.vendedorIds.length === 0
                ? 'Todos los Vendedores'
                : `${filters.vendedorIds.length} Vendedor(es)`}
            </span>
            <span className="text-slate-500 text-xs">▼</span>
          </button>

          {expandedFilter === 'vend' && (
            <div className="absolute z-50 mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl space-y-1 max-h-48 overflow-y-auto">
              {availableVendedores.map((vend) => (
                <label
                  key={vend.id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-900 rounded cursor-pointer text-xs text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={filters.vendedorIds.includes(vend.id)}
                    onChange={() => toggleMultiSelect('vendedorIds', vend.id)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                  />
                  <span className="truncate">{vend.nombre} {vend.apellido}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
