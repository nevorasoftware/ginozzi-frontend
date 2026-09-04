import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { TopVendedorData } from '../types';
import { BarChart3, TrendingUp, Award, Zap, PieChart as PieIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

export const Estadisticas: React.FC = () => {
  const [topVendedores, setTopVendedores] = useState<TopVendedorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiService.getTopVendedores(10);
      setTopVendedores(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

  const categoryDistribution = [
    { name: 'Tecnología', value: 35 },
    { name: 'Belleza', value: 20 },
    { name: 'Salud', value: 18 },
    { name: 'Educación', value: 15 },
    { name: 'Construcción', value: 12 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Estadísticas & Analítica Avanzada</h1>
        <p className="text-xs text-slate-400 font-medium">WHOOP-inspired performance indicators and comparative visual analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seller Performance Bar Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Ranking de Facturación por Vendedor</h3>
              <p className="text-xs text-slate-400">Total ventas acumuladas en dólares ($)</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVendedores} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="nombre" stroke="#64748b" fontSize={10} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="totalVendido" name="Ventas ($)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution Pie Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Distribución por Rubro Comercial</h3>
                <p className="text-xs text-slate-400">Participación porcentual de ventas por industria</p>
              </div>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <PieIcon className="w-5 h-5" />
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800">
            {categoryDistribution.map((cat, idx) => (
              <div key={cat.name} className="flex items-center space-x-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-300 font-medium truncate">{cat.name}: {cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
