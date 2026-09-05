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
    if (hour >= 5 && hour < 12) return { emoji: '🌅', text: 'Buenos días' };
    if (hour >= 12 && hour < 19) return { emoji: '☀️', text: 'Buenas tardes' };
    return { emoji: '🌙', text: 'Buenas noches' };
  };
  const { emoji: greetingEmoji, text: greetingText } = getGreetingByHour();

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
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Mock SaaS Clients / Companies list for SUPER_ADMIN
  const saasCompaniesList = [
    {
      id: 's1',
      nombre: 'Empresa ABC (Grupo Corporativo)',
      estado: 'Activa',
      usuarios: 18,
      cobroMensual: 180,
      plan: 'Enterprise',
      ventasMes: 31200,
      vendedorLider: { nombre: 'Carlos López', ventas: 15200, empresa: 'Empresa ABC' },
      mayorCrecimiento: { nombre: 'Jorge Ramírez', incremento: '+38% incremento', empresa: 'Empresa ABC' },
    },
    {
      id: 's2',
      nombre: 'Empresa XYZ (Soluciones SV)',
      estado: 'Activa',
      usuarios: 7,
      cobroMensual: 70,
      plan: 'Pro Multi-Business',
      ventasMes: 12450,
      vendedorLider: { nombre: 'Roberto Gómez', ventas: 7800, empresa: 'Empresa XYZ' },
      mayorCrecimiento: { nombre: 'María Rodríguez', incremento: '+31% incremento', empresa: 'Empresa XYZ' },
    },
    {
      id: 's3',
      nombre: 'Juan Pérez (Consultor Independiente)',
      estado: 'Independiente',
      usuarios: 1,
      cobroMensual: 10,
      plan: 'Starter',
      ventasMes: 5300,
      vendedorLider: { nombre: 'Juan Pérez', ventas: 5300, empresa: 'Juan Pérez' },
      mayorCrecimiento: { nombre: 'Juan Pérez', incremento: '+15% incremento', empresa: 'Juan Pérez' },
    },
  ];

  // Mock Empresario Businesses list
  const empresarioBusinessesList = [
    {
      id: '1',
      nombre: 'Ginozzi Tech & Solutions',
      rubro: 'Tecnología',
      vendedores: 12,
      ventasHoy: 14250,
      ventasMes: 28450,
      estado: 'Activo',
      vendedorLider: { nombre: 'Carlos López', ventas: 15200, empresa: 'Ginozzi Tech & Solutions' },
      mayorCrecimiento: { nombre: 'Jorge Ramírez', incremento: '+38% incremento', empresa: 'Ginozzi Tech & Solutions' },
    },
    {
      id: '2',
      nombre: 'Papelería & Librería Central',
      rubro: 'Librería',
      vendedores: 8,
      ventasHoy: 6800,
      ventasMes: 13650,
      estado: 'Activo',
      vendedorLider: { nombre: 'Roberto Gómez', ventas: 7800, empresa: 'Papelería & Librería Central' },
      mayorCrecimiento: { nombre: 'María Rodríguez', incremento: '+31% incremento', empresa: 'Papelería & Librería Central' },
    },
    {
      id: '3',
      nombre: 'Servicios Digitales SV',
      rubro: 'Servicios',
      vendedores: 4,
      ventasHoy: 3800,
      ventasMes: 6850,
      estado: 'Activo',
      vendedorLider: { nombre: 'Ana Rivas', ventas: 4200, empresa: 'Servicios Digitales SV' },
      mayorCrecimiento: { nombre: 'Kevin Molina', incremento: '+22% incremento', empresa: 'Servicios Digitales SV' },
    },
  ];

  // Dynamic Selected Company Lookup
  const selectedEmpresarioBusiness = empresarioBusinessesList.find((b) => b.id === selectedCardId);
  const selectedSaasCompany = saasCompaniesList.find((c) => c.id === selectedCardId);
  const selectedCompany = selectedEmpresarioBusiness || selectedSaasCompany;

  // Dynamic Monthly Sales calculation (Default General = $48,950.00)
  const displayMonthlySales = selectedCompany
    ? selectedCompany.ventasMes
    : (resumen?.kpis.ventasMesTotal || 48950);

  const targetGoal = 30000;
  const goalPercentage = Math.min(Math.round((displayMonthlySales / targetGoal) * 100), 100);

  // Dynamic Mini Cards calculation
  const displayVendedorLider = selectedCompany
    ? selectedCompany.vendedorLider
    : {
        nombre: topVendedores[0]?.nombre || 'Carlos López',
        ventas: topVendedores[0]?.totalVendido || 15200,
        empresa: topVendedores[0]?.negocio || 'Ginozzi Tech & Solutions',
      };

  const displayMayorCrecimiento = selectedCompany
    ? selectedCompany.mayorCrecimiento
    : {
        nombre: topVendedores[1]?.nombre || 'María Rodríguez',
        incremento: '+31% incremento',
        empresa: topVendedores[1]?.negocio || 'Papelería & Librería Central',
      };

  // Dynamic Ranking of Sellers per Company / General Scenario
  const getDynamicRankingVendedores = () => {
    if (selectedCardId === '1' || selectedCardId === 's1') {
      return [
        { id: 'v1', nombre: 'Carlos López', negocio: 'Ginozzi Tech & Solutions', totalVendido: 15200, cuota: 94 },
        { id: 'v2', nombre: 'Pedro Hernández', negocio: 'Ginozzi Tech & Solutions', totalVendido: 9500, cuota: 78 },
        { id: 'v3', nombre: 'Jorge Ramírez', negocio: 'Ginozzi Tech & Solutions', totalVendido: 7200, cuota: 65 },
        { id: 'v4', nombre: 'Lucía Fernández', negocio: 'Ginozzi Tech & Solutions', totalVendido: 5400, cuota: 50 },
      ];
    } else if (selectedCardId === '2' || selectedCardId === 's2') {
      return [
        { id: 'v5', nombre: 'María Rodríguez', negocio: 'Papelería & Librería Central', totalVendido: 14100, cuota: 91 },
        { id: 'v6', nombre: 'Roberto Gómez', negocio: 'Papelería & Librería Central', totalVendido: 7800, cuota: 68 },
        { id: 'v7', nombre: 'Laura Martínez', negocio: 'Papelería & Librería Central', totalVendido: 6500, cuota: 59 },
        { id: 'v8', nombre: 'Fernando Ruiz', negocio: 'Papelería & Librería Central', totalVendido: 4800, cuota: 42 },
      ];
    } else if (selectedCardId === '3' || selectedCardId === 's3') {
      return [
        { id: 'v9', nombre: 'Ana Martínez', negocio: 'Servicios Digitales SV', totalVendido: 12800, cuota: 88 },
        { id: 'v10', nombre: 'Kevin Molina', negocio: 'Servicios Digitales SV', totalVendido: 5100, cuota: 64 },
        { id: 'v11', nombre: 'Sofia Benítez', negocio: 'Servicios Digitales SV', totalVendido: 3900, cuota: 49 },
        { id: 'v12', nombre: 'David Flores', negocio: 'Servicios Digitales SV', totalVendido: 2600, cuota: 35 },
      ];
    } else {
      // General Scenario (All Companies)
      if (topVendedores.length > 0) {
        return topVendedores.map((v, i) => ({
          ...v,
          cuota: [94, 87, 72, 58, 45][i] || 60,
        }));
      }
      return [
        { id: 'vg1', nombre: 'Carlos López', negocio: 'Ginozzi Tech & Solutions', totalVendido: 15200, cuota: 94 },
        { id: 'vg2', nombre: 'María Rodríguez', negocio: 'Papelería & Librería Central', totalVendido: 14100, cuota: 87 },
        { id: 'vg3', nombre: 'Ana Martínez', negocio: 'Servicios Digitales SV', totalVendido: 12800, cuota: 72 },
        { id: 'vg4', nombre: 'Pedro Hernández', negocio: 'Ginozzi Tech & Solutions', totalVendido: 9500, cuota: 58 },
        { id: 'vg5', nombre: 'Roberto Gómez', negocio: 'Papelería & Librería Central', totalVendido: 7800, cuota: 45 },
      ];
    }
  };

  const displayRankingVendedores = getDynamicRankingVendedores();

  // Dynamic Sales Trend Chart per Period (1M, 3M, 6M, 12M) & Selected Company
  const getDynamicChartData = () => {
    let periods: string[] = [];
    if (filters.period === '1M') {
      periods = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    } else if (filters.period === '3M') {
      periods = ['Jul 2026', 'Ago 2026', 'Sep 2026'];
    } else if (filters.period === '6M') {
      periods = ['Abr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Ago 2026', 'Sep 2026'];
    } else {
      // 12M
      periods = ['Oct 2025', 'Nov 2025', 'Dic 2025', 'Ene 2026', 'Feb 2026', 'Mar 2026', 'Abr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Ago 2026', 'Sep 2026'];
    }

    let targetTotal = 48950;
    if (selectedCardId === '1' || selectedCardId === 's1') targetTotal = 28450;
    else if (selectedCardId === '2' || selectedCardId === 's2') targetTotal = 13650;
    else if (selectedCardId === '3' || selectedCardId === 's3') targetTotal = 6850;

    const count = periods.length;
    return periods.map((p, idx) => {
      const progressRatio = (idx + 1) / count;
      const salesVal = Math.round(targetTotal * (0.6 + 0.4 * progressRatio));
      return {
        periodo: p,
        totalVentas: salesVal,
      };
    });
  };

  const displayChartData = getDynamicChartData();

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
              {role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'EMPRESARIO' ? 'Propietario' : 'Vendedor'}
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
              {greetingEmoji} {greetingText}, {currentUser.nombre} 👤
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
                  {greetingEmoji} {greetingText}, {currentUser.nombre} 👤
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
                {saasCompaniesList.map((empresa) => {
                  const isSelected = selectedCardId === empresa.id;
                  return (
                    <div
                      key={empresa.id}
                      onClick={() => setSelectedCardId(isSelected ? null : empresa.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 shadow-inner ${
                        isSelected
                          ? 'bg-indigo-500/15 border-2 border-indigo-400 ring-2 ring-indigo-500/40 shadow-indigo-500/20 scale-[1.02]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                          {empresa.nombre}
                          {isSelected && <span className="text-[10px] bg-indigo-500 text-white font-extrabold px-1.5 py-0.5 rounded-full">✓ Filtro</span>}
                        </h4>
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
                  );
                })}
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
                {empresarioBusinessesList.map((negocio) => {
                  const isSelected = selectedCardId === negocio.id;
                  return (
                    <div
                      key={negocio.id}
                      onClick={() => setSelectedCardId(isSelected ? null : negocio.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 shadow-inner ${
                        isSelected
                          ? 'bg-emerald-500/15 border-2 border-emerald-400 ring-2 ring-emerald-500/40 shadow-emerald-500/20 scale-[1.02]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/50 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                          {negocio.nombre}
                          {isSelected && <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-full">✓ Filtro</span>}
                        </h4>
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
                  );
                })}
              </div>
            </div>
          )}

          {/* Hero Sales & Target Progress Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/20 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> VENTAS DEL MES
                  </span>
                  {selectedCompany && (
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <span>📍 {selectedCompany.nombre}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCardId(null);
                        }}
                        className="hover:text-white ml-1 font-bold text-xs"
                        title="Ver valores generales"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-indigo-400" /> Meta Global: {formatCurrency(targetGoal)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {formatCurrency(displayMonthlySales)}
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

            {/* Mini Cards (Vendedor Líder & Mayor Crecimiento con empresa) */}
            <div className="flex flex-col gap-4 justify-between">
              <div className="flex-1 glass-card rounded-2xl p-5 border border-amber-500/30 bg-slate-900/80 flex items-center justify-between hover:border-amber-500/50 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> #1 VENDEDOR LÍDER
                  </span>
                  <h4 className="text-lg font-bold text-white leading-tight">{displayVendedorLider.nombre}</h4>
                  <p className="text-xs font-mono font-extrabold text-emerald-400">
                    {formatCurrency(displayVendedorLider.ventas)}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 pt-0.5">
                    <Store className="w-3 h-3 text-amber-400" /> {displayVendedorLider.empresa}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-black shadow-lg shrink-0">
                  🏆
                </div>
              </div>

              <div className="flex-1 glass-card rounded-2xl p-5 border border-indigo-500/30 bg-slate-900/80 flex items-center justify-between hover:border-indigo-500/50 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> MAYOR CRECIMIENTO
                  </span>
                  <h4 className="text-lg font-bold text-white leading-tight">{displayMayorCrecimiento.nombre}</h4>
                  <p className="text-xs font-mono font-extrabold text-indigo-300">
                    {displayMayorCrecimiento.incremento}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 pt-0.5">
                    <Store className="w-3 h-3 text-indigo-400" /> {displayMayorCrecimiento.empresa}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-black shadow-lg shrink-0">
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
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" /> RANKING DE VENDEDORES
                    </h3>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      {selectedCompany ? selectedCompany.nombre : 'Todas las Empresas'}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CUOTA %
                  </span>
                </div>
                <div className="space-y-3">
                  {displayRankingVendedores.map((vendedor, index) => (
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
                          <span className="text-[10px] font-bold text-indigo-400 font-mono">{vendedor.cuota}% cuota</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">VENTAS DEL PERÍODO</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Comportamiento comercial acumulado • <span className="text-emerald-400 font-semibold">{selectedCompany ? selectedCompany.nombre : 'Todas las Empresas'}</span>
                  </p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
