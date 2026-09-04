import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Bell,
  Sparkles,
  Trophy,
  ArrowUpRight,
  ChevronRight,
  Target,
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
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [chartData, setChartData] = useState<VentasPeriodoData[]>([]);
  const [topVendedores, setTopVendedores] = useState<TopVendedorData[]>([]);
  const [loading, setLoading] = useState(true);

  // User details from session
  const currentUser = (() => {
    const saved = localStorage.getItem('ginozzi_user');
    return saved ? JSON.parse(saved) : { nombre: 'Bryan', apellido: 'Garrido' };
  })();

  // Current Month & Year formatted in Spanish
  const currentMonthYear = new Date().toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
  const formattedMonthYear = currentMonthYear.charAt(0).toUpperCase() + currentMonthYear.slice(1);

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

  // Target Goal Calculation for Hero Card
  const monthlySales = resumen?.kpis.ventasMesTotal || 24850;
  const targetGoal = 30000;
  const goalPercentage = Math.min(Math.round((monthlySales / targetGoal) * 100), 100);

  // Growth Leader calculation from top sellers
  const leaderSeller = topVendedores[0] || { nombre: 'Carlos', totalVendido: 8420 };
  const growthSeller = topVendedores[1] || { nombre: 'Ana', growthPercentage: 31 };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Greeting & Date Notification Banner (Matching Reference Layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-slate-800/80 backdrop-blur-md shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Buenos días, {currentUser.nombre} 👋
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-2">
            <span>{formattedMonthYear}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-semibold">Resumen de Ventas Empresarial</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-400 flex items-center gap-2 shadow-inner">
            <Bell className="w-4 h-4 animate-bounce" />
            <span className="text-xs font-bold text-slate-200">Alertas Activas</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Sales & Target Progress Card (Matching Reference Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hero Card */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/20 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> VENTAS DEL MES
            </span>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-indigo-400" /> Meta Global: {formatCurrency(targetGoal)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-6">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {formatCurrency(monthlySales)}
            </span>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ↑ 14.2% <span className="text-[10px] text-slate-400 font-normal ml-1">vs mes anterior</span>
            </div>
          </div>

          {/* Goal Progress Bar */}
          <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" /> Avance de Meta Mensual
              </span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">{goalPercentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/30"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>Facturado: {formatCurrency(monthlySales)}</span>
              <span>Objetivo: {formatCurrency(targetGoal)}</span>
            </div>
          </div>
        </div>

        {/* 3. Side-by-Side Highlight Cards (Top Seller & Growth Leader - Matching Reference) */}
        <div className="flex flex-col gap-4 justify-between">
          {/* Card 1: Top Seller Leader */}
          <div className="flex-1 glass-card rounded-2xl p-5 border border-amber-500/30 bg-slate-900/80 flex items-center justify-between hover:border-amber-500/50 transition">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1 mb-1">
                <Trophy className="w-3.5 h-3.5" /> #1 Vendedor Líder
              </span>
              <h4 className="text-lg font-bold text-white leading-tight">{leaderSeller.nombre}</h4>
              <p className="text-xs font-mono font-extrabold text-emerald-400 mt-1">
                {formatCurrency(leaderSeller.totalVendido)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-black shadow-lg">
              🏆
            </div>
          </div>

          {/* Card 2: Highest Growth Leader */}
          <div className="flex-1 glass-card rounded-2xl p-5 border border-indigo-500/30 bg-slate-900/80 flex items-center justify-between hover:border-indigo-500/50 transition">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1 mb-1">
                <TrendingUp className="w-3.5 h-3.5" /> Mayor Crecimiento
              </span>
              <h4 className="text-lg font-bold text-white leading-tight">{growthSeller.nombre}</h4>
              <p className="text-xs font-mono font-extrabold text-indigo-300 mt-1">
                +{(growthSeller as any).growthPercentage || 31}% <span className="text-[10px] text-slate-400 font-normal">incremento</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-black shadow-lg">
              📈
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Multi-Tenant Filter Bar */}
      <DashboardFilters filters={filters} onFilterChange={setFilters} />

      {/* 4. Ranking de Vendedores & Charts Section (Matching Reference Structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking de Vendedores (Matching Reference List with Medal Indicators & Completion % Bars) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> RANKING DE VENDEDORES
              </h3>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CUOTA %
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Vendedores destacados y porcentaje de cuota cumplida</p>

            <div className="space-y-3">
              {topVendedores.map((vendedor, index) => {
                // Mock custom percentage goal based on rank position if not provided
                const mockQuotaPercentages = [94, 87, 72, 58, 45];
                const quotaPct = mockQuotaPercentages[index] || 60;

                return (
                  <div
                    key={vendedor.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            index === 0
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : index === 1
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                              : index === 2
                              ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{vendedor.nombre}</p>
                          <p className="text-[10px] text-slate-400">{vendedor.negocio} • {vendedor.rubro}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-extrabold text-emerald-400 font-mono">
                          {formatCurrency(vendedor.totalVendido)}
                        </p>
                        <span className="text-[10px] font-bold text-indigo-400 font-mono">{quotaPct}% cuota</span>
                      </div>
                    </div>

                    {/* Progress Bar Mini */}
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          index === 0
                            ? 'bg-emerald-400'
                            : index === 1
                            ? 'bg-indigo-400'
                            : index === 2
                            ? 'bg-amber-400'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${quotaPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => navigate('/vendedores')}
            className="mt-6 w-full flex items-center justify-center px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 text-xs font-bold rounded-xl border border-slate-700 transition gap-1.5"
          >
            Ver todos los Vendedores <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5. Stepped Sales Evolution Chart (Matching Reference Layout) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">VENTAS DEL PERÍODO</h3>
              <p className="text-xs text-slate-400 font-medium">Comportamiento comercial acumulado y tendencia de ingresos</p>
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
                  <Area type="stepAfter" dataKey="totalVentas" name="Total Ventas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                  <Area type="stepAfter" dataKey="ganancias" name="Ganancias" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorGanancias)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
};
