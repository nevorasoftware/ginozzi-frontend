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
  Lightbulb,
  ShieldCheck,
  Briefcase,
  Flame,
  CheckCircle2,
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

  // Read User details & Role from session
  const currentUser = (() => {
    const saved = localStorage.getItem('ginozzi_user');
    return saved ? JSON.parse(saved) : { nombre: 'Bryan', apellido: 'Garrido', role: 'SUPER_ADMIN' };
  })();

  // Interactive View Role Switcher State for Testing/Previewing
  const [activeRoleView, setActiveRoleView] = useState<'SUPER_ADMIN' | 'EMPRESARIO' | 'VENDEDOR'>(
    currentUser.role || 'SUPER_ADMIN'
  );

  // Current Month & Year formatted in Spanish
  const currentMonthYear = new Date().toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
  const formattedMonthYear = currentMonthYear.charAt(0).toUpperCase() + currentMonthYear.slice(1);

  // Dynamic greeting based on UTC-6 (El Salvador) hour
  const getGreetingByHour = () => {
    const hourStr = new Date().toLocaleTimeString('en-US', { timeZone: 'America/El_Salvador', hour12: false, hour: '2-digit' });
    const hour = parseInt(hourStr, 10);
    if (hour >= 5 && hour < 12) return 'Buenos días 🌅';
    if (hour >= 12 && hour < 19) return 'Buenas tardes ☀️';
    return 'Buenas noches 🌙';
  };
  const greeting = getGreetingByHour();

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

  // Vendedor Specific Variables & Dynamic Performance Threshold Formula
  const todayVendedorSales = 1240;
  const todayVendedorGoal = 1500;
  const sellerDailyAverage = 1000;
  const sellerGoalPercentage = Math.round((todayVendedorSales / todayVendedorGoal) * 100);
  const performanceRatio = todayVendedorSales / sellerDailyAverage;

  // Dynamic Performance Status ("Hoy estás...")
  const getPerformanceMessage = (ratio: number) => {
    if (ratio >= 1.1) {
      return {
        title: 'POR ENCIMA DE TU PROMEDIO',
        subtitle: `(+${Math.round((ratio - 1) * 100)}% comparado con tu promedio habitual)`,
        icon: '🔥',
        colorClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10',
      };
    } else if (ratio >= 0.9) {
      return {
        title: 'DENTRO DEL PROMEDIO ESPERADO',
        subtitle: 'Mantén el ritmo para cumplir el objetivo del día',
        icon: '⚡',
        colorClass: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400 shadow-indigo-500/10',
      };
    } else {
      return {
        title: 'REQUIERE IMPULSO PARA ALCANZAR LA META',
        subtitle: 'Falta un empujón final para superar la meta diaria',
        icon: '🎯',
        colorClass: 'border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-amber-500/10',
      };
    }
  };

  const performanceStatus = getPerformanceMessage(performanceRatio);

  // Target Goal Calculation for Hero Card (Empresario / SuperAdmin)
  const monthlySales = resumen?.kpis.ventasMesTotal || 24850;
  const targetGoal = 30000;
  const goalPercentage = Math.min(Math.round((monthlySales / targetGoal) * 100), 100);

  // Mock SaaS Clients / Companies list for SUPER_ADMIN
  const saasCompaniesList = [
    { id: '1', nombre: 'Empresa ABC (Grupo Corporativo)', estado: 'Activa', usuarios: 18, cobroMensual: 180, plan: 'Enterprise' },
    { id: '2', nombre: 'Empresa XYZ (Soluciones SV)', estado: 'Activa', usuarios: 7, cobroMensual: 70, plan: 'Pro Multi-Business' },
    { id: '3', nombre: 'Juan Pérez (Consultor Independiente)', estado: 'Independiente', usuarios: 1, cobroMensual: 10, plan: 'Starter' },
  ];

  // Mock Empresario Businesses list
  const empresarioBusinessesList = [
    { id: '1', nombre: 'Ginozzi Tech & Solutions', rubro: 'Tecnología', vendedores: 12, ventasHoy: 14250, estado: 'Activo' },
    { id: '2', nombre: 'Papelería & Librería Central', rubro: 'Librería', vendedores: 8, ventasHoy: 6800, estado: 'Activo' },
    { id: '3', nombre: 'Servicios Digitales SV', rubro: 'Servicios', vendedores: 4, ventasHoy: 3800, estado: 'Activo' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Role Preview Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Vista de Dashboard según Rol:</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['SUPER_ADMIN', 'EMPRESARIO', 'VENDEDOR'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRoleView(role)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                activeRoleView === role
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'EMPRESARIO' ? 'Empresario' : 'Vendedor'}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VENDEDOR DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {activeRoleView === 'VENDEDOR' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Greeting Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-emerald-950/40 border border-slate-800/80 shadow-2xl">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {greeting}, {currentUser.nombre}.
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Aquí está tu resumen de rendimiento y ventas del día de hoy.
            </p>
          </div>

          {/* Tu negocio hoy Card */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-slate-900/90 shadow-xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Tu negocio hoy
            </span>
            <div className="flex items-baseline space-x-3">
              <span className="text-5xl font-black text-white font-mono tracking-tight">
                {formatCurrency(todayVendedorSales)}
              </span>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                +18% vs. ayer
              </span>
            </div>
            <p className="text-xs text-slate-400">Ventas registradas el día de hoy</p>
          </div>

          {/* 🎯 Meta del día */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/90 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" /> 🎯 Meta del día
              </span>
              <span className="text-sm font-mono font-extrabold text-indigo-400">{sellerGoalPercentage}%</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-white font-mono">{formatCurrency(todayVendedorGoal)}</span>
              <span className="text-xs text-slate-400 font-mono">Faltan {formatCurrency(todayVendedorGoal - todayVendedorSales)}</span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-md shadow-indigo-500/30"
                style={{ width: `${sellerGoalPercentage}%` }}
              />
            </div>
          </div>

          {/* 🔥 Hoy estás... (Dynamic Performance Status) */}
          <div className={`p-6 rounded-2xl border ${performanceStatus.colorClass} shadow-xl transition-all`}>
            <span className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <span>{performanceStatus.icon}</span> Hoy estás...
            </span>
            <h3 className="text-xl font-black tracking-tight">{performanceStatus.title}</h3>
            <p className="text-xs opacity-90 mt-1">{performanceStatus.subtitle}</p>
          </div>

          {/* 💡 GINOZZI recomienda */}
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-xl space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> 💡 GINOZZI recomienda
            </span>
            <p className="text-sm italic text-slate-200 leading-relaxed font-medium">
              "Las ventas de <strong className="text-amber-300 font-bold">Producto X</strong> están 24% por encima de tu promedio semanal. Te sugerimos ofrecerlo a tus clientes principales para superar tu meta diaria."
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EMPRESARIO & SUPER_ADMIN DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {activeRoleView !== 'VENDEDOR' && (
        <>
          {/* Greeting Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-slate-800/80 backdrop-blur-md shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {greeting}, {currentUser.nombre} 👋
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-2">
                <span>{formattedMonthYear}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-semibold">
                  {activeRoleView === 'SUPER_ADMIN' ? 'Panel de Administración SaaS Global' : 'Panel de Gestión Corporativa'}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-400 flex items-center gap-2 shadow-inner">
                <Bell className="w-4 h-4 animate-bounce" />
                <span className="text-xs font-bold text-slate-200">Alertas Activas</span>
              </div>
            </div>
          </div>

          {/* SUPER ADMIN SaaS CLIENTES / EMPRESAS PANEL */}
          {activeRoleView === 'SUPER_ADMIN' && (
            <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-slate-900/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" /> CLIENTES Y EMPRESAS REGISTRADAS
                  </h3>
                  <p className="text-xs text-slate-400">Resumen de cuentas corporativas y usuarios activos en el SaaS</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  {saasCompaniesList.length} Clientes SaaS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {saasCompaniesList.map((empresa) => (
                  <div
                    key={empresa.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition space-y-2 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white leading-tight">{empresa.nombre}</h4>
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        🟢 {empresa.estado}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{empresa.usuarios} usuarios activos</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400 font-medium">Suscripción:</span>
                      <span className="font-extrabold text-emerald-400 font-mono">${empresa.cobroMensual}/mes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EMPRESARIO MIS NEGOCIOS PANEL */}
          {activeRoleView === 'EMPRESARIO' && (
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-slate-900/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                    <Store className="w-5 h-5 text-emerald-400" /> MIS EMPRESAS Y NEGOCIOS
                  </h3>
                  <p className="text-xs text-slate-400">Unidades comerciales bajo tu administración</p>
                </div>
                <button
                  onClick={() => navigate('/negocios')}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Gestionar Negocios <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {empresarioBusinessesList.map((negocio) => (
                  <div
                    key={negocio.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition space-y-2 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white leading-tight">{negocio.nombre}</h4>
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        🟢 {negocio.estado}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-400">{negocio.rubro} • {negocio.vendedores} vendedores</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400 font-medium">Facturado hoy:</span>
                      <span className="font-extrabold text-emerald-400 font-mono">{formatCurrency(negocio.ventasHoy)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hero Sales & Target Progress Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/20 relative overflow-hidden shadow-2xl">
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
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-between">
              <div className="flex-1 glass-card rounded-2xl p-5 border border-amber-500/30 bg-slate-900/80 flex items-center justify-between hover:border-amber-500/50 transition">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1 mb-1">
                    <Trophy className="w-3.5 h-3.5" /> #1 Vendedor Líder
                  </span>
                  <h4 className="text-lg font-bold text-white leading-tight">{topVendedores[0]?.nombre || 'Carlos'}</h4>
                  <p className="text-xs font-mono font-extrabold text-emerald-400 mt-1">
                    {formatCurrency(topVendedores[0]?.totalVendido || 8420)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-black shadow-lg">
                  🏆
                </div>
              </div>

              <div className="flex-1 glass-card rounded-2xl p-5 border border-indigo-500/30 bg-slate-900/80 flex items-center justify-between hover:border-indigo-500/50 transition">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Mayor Crecimiento
                  </span>
                  <h4 className="text-lg font-bold text-white leading-tight">{topVendedores[1]?.nombre || 'Ana'}</h4>
                  <p className="text-xs font-mono font-extrabold text-indigo-300 mt-1">
                    +31% <span className="text-[10px] text-slate-400 font-normal">incremento</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-black shadow-lg">
                  📈
                </div>
              </div>
            </div>
          </div>

          <DashboardFilters filters={filters} onFilterChange={setFilters} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div className="space-y-3">
                  {topVendedores.map((vendedor, index) => {
                    const mockQuotaPercentages = [94, 87, 72, 58, 45];
                    const quotaPct = mockQuotaPercentages[index] || 60;
                    return (
                      <div key={vendedor.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">{vendedor.nombre}</p>
                              <p className="text-[10px] text-slate-400">{vendedor.negocio}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-emerald-400 font-mono">{formatCurrency(vendedor.totalVendido)}</p>
                            <span className="text-[10px] font-bold text-indigo-400 font-mono">{quotaPct}% cuota</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">VENTAS DEL PERÍODO</h3>
                  <p className="text-xs text-slate-400 font-medium">Comportamiento comercial acumulado</p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="periodo" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} formatter={(val: number) => [formatCurrency(val), '']} />
                    <Area type="stepAfter" dataKey="totalVentas" name="Total Ventas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
