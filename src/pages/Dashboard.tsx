import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { MetricCard } from '../components/MetricCard';
import { DashboardFilters } from '../components/DashboardFilters';
import { DashboardResumen, VentasPeriodoData, TopVendedorData, FilterState } from '../types';
import {
  Building2,
  Store,
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Award,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [chartData, setChartData] = useState<VentasPeriodoData[]>([]);
  const [topVendedores, setTopVendedores] = useState<TopVendedorData[]>([]);
  const [loading, setLoading] = useState(true);

  // Advanced Hierarchical Multi-Select Filter State
  const [filters, setFilters] = useState<FilterState>({
    period: '12M',
    empresarioIds: [],
    negocioIds: [],
    rubroIds: [],
    vendedorIds: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resData, salesData, topSellers] = await Promise.all([
        apiService.getDashboardResumen(filters),
        apiService.getVentasPeriodo(filters, 'month'),
        apiService.getTopVendedores(5, filters),
      ]);
      setResumen(resData);
      setChartData(salesData);
      setTopVendedores(topSellers);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboard General Multi-Tenant</h1>
          <p className="text-xs text-slate-400 font-medium">
            Monitoreo comercial y analítica jerárquica: Empresario &gt; Negocio &gt; Rubro &gt; Vendedor
          </p>
        </div>
      </div>

      {/* Advanced Hierarchical Filter Bar */}
      <DashboardFilters filters={filters} onFilterChange={setFilters} />

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Empresarios"
          value={resumen?.kpis.totalEmpresarios || 0}
          subtitle="Red corporativa general"
          icon={Building2}
          accentColor="text-indigo-400"
        />
        <MetricCard
          title="Negocios Activos"
          value={resumen?.kpis.totalNegocios || 0}
          subtitle="Unidades de negocio"
          icon={Store}
          accentColor="text-emerald-400"
        />
        <MetricCard
          title="Rubros Comerciales"
          value={resumen?.kpis.totalRubros || 30}
          subtitle="Categorías de productos/servicios"
          icon={Layers}
          accentColor="text-sky-400"
        />
        <MetricCard
          title="Fuerza de Ventas"
          value={`${resumen?.kpis.vendedoresActivos || 0} / ${resumen?.kpis.totalVendedores || 0}`}
          subtitle="Vendedores activos"
          icon={Users}
          accentColor="text-purple-400"
        />
      </div>

      {/* Secondary Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Facturación en Período"
          value={formatCurrency(resumen?.kpis.ventasMesTotal || resumen?.kpis.ventasAcumuladasTotal || 0)}
          subtitle={`${resumen?.kpis.ventasMesCount || 0} transacciones registradas`}
          change="+18.4%"
          isPositive={true}
          icon={TrendingUp}
          accentColor="text-emerald-400"
        />
        <MetricCard
          title="Ganancias Netas Generadas"
          value={formatCurrency(resumen?.kpis.gananciasMesTotal || resumen?.kpis.gananciasAcumuladasTotal || 0)}
          subtitle="Comisión y beneficio según negocio"
          change="+12.1%"
          isPositive={true}
          icon={DollarSign}
          accentColor="text-emerald-300"
        />
        <MetricCard
          title="Ticket Promedio"
          value={formatCurrency(resumen?.kpis.promedioTicket || 344.71)}
          subtitle="Promedio por venta realizada"
          icon={Award}
          accentColor="text-amber-400"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (2 Columns) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Evolución Comercial por Rubros y Negocios</h3>
              <p className="text-xs text-slate-400 font-medium">Volumen de ventas vs Ganancia neta calculada</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5" />
                <span className="text-slate-300">Facturación ($)</span>
              </div>
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 mr-1.5" />
                <span className="text-slate-300">Ganancias ($)</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Cargando datos analíticos...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorGanancias" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="periodo" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number) => [formatCurrency(val), '']}
                  />
                  <Area type="monotone" dataKey="totalVentas" name="Total Ventas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                  <Area type="monotone" dataKey="ganancias" name="Ganancias" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorGanancias)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Sellers Leaderboard (1 Column) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-wide">Top Vendedores por Rubro</h3>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">RANKING</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Vendedores destacados en los filtros seleccionados</p>

            <div className="space-y-4">
              {topVendedores.map((vendedor, index) => (
                <div key={vendedor.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      index === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      index === 1 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40' :
                      index === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{vendedor.nombre}</p>
                      <p className="text-[10px] text-indigo-400">{vendedor.negocio} • {vendedor.rubro}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-emerald-400">{formatCurrency(vendedor.totalVendido)}</p>
                    <p className="text-[10px] text-slate-400">{vendedor.cantidadVentas} ventas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
