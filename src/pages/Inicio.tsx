import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import KpiCard from '@/components/dashboard/KpiCard';
import DashboardFeatureWorkbench from '@/components/dashboard/DashboardFeatureWorkbench';
import HeroSection from '@/components/HeroSection';
import QuickActions from '@/components/QuickActions';
import { motion } from 'framer-motion';
import { getRandomUnitImage } from '@/utils/images';
import { 
  Building2, Users, DollarSign, AlertTriangle, ClipboardList, Wrench,
  CalendarDays, TrendingUp, CreditCard, Home, ChevronLeft, ChevronRight, MapPin, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';

const CHART_COLORS = ['#2563EB', '#0F7A5C', '#F59E0B', '#FBBF24', '#F87171'];

// Breadcrumb Component - Corrección 5,8
const Breadcrumb = ({ condoName = 'Torres del Parque Residencial', current = 'Dashboard' }: { condoName?: string, current?: string }) => (
  <nav className="flex items-center space-x-2 mb-6 text-sm text-muted-foreground">
    <span className="flex items-center gap-1 font-medium text-foreground">
      <MapPin className="w-4 h-4" />
      {condoName}
    </span>
    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
    <span className="font-semibold text-foreground">{current}</span>
  </nav>
);

const barData = [
  { name: 'Ene', value: 42000000 }, { name: 'Feb', value: 38000000 },
  { name: 'Mar', value: 45000000 }, { name: 'Abr', value: 41000000 },
  { name: 'May', value: 47000000 }, { name: 'Jun', value: 50000000 },
];

const pieData = [
  { name: 'Al día', value: 72 }, { name: 'Moroso', value: 18 }, { name: 'En acuerdo', value: 10 },
];

const lineData = [
  { name: 'Ene', pqrs: 12, resueltas: 10 }, { name: 'Feb', pqrs: 18, resueltas: 15 },
  { name: 'Mar', pqrs: 14, resueltas: 13 }, { name: 'Abr', pqrs: 20, resueltas: 17 },
  { name: 'May', pqrs: 16, resueltas: 14 }, { name: 'Jun', pqrs: 22, resueltas: 19 },
];

const Inicio = () => {
  const user = useAuthStore((s) => s.user);
  const { condos, currentCondo } = useAppStore();
  const condoName = currentCondo?.name || condos[0]?.name || 'Torres del Parque Residencial';

  const title: Record<string, string> = {
    super_admin: 'Dashboard Global',
    admin: 'Dashboard del Conjunto',
    consejo: 'Dashboard Ejecutivo',
    propietario: 'Mi Panel Personal',
    arrendatario: 'Mi Panel Personal',
    porteria: 'Panel de Control',
    proveedor: 'Panel de Proveedor',
  };

  const pageTitle = title[user?.roleId || 'super_admin'];

  if (!user) return null;

  const metrics = useMemo(() => ({
    totalUnits: condos.reduce((a, c) => a + (c.totalUnits || 0), 0),
    totalResidents: condos.reduce((a, c) => a + (c.totalResidents || 0), 0),
    totalDebt: condos.reduce((a, c) => a + (c.totalDebt || 0), 0),
    avgOccupancy: Math.round(condos.reduce((a, c) => a + (c.occupancyRate || 0), 0) / (condos.length || 1)),
  }), [condos]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb - Corrección 5,8 */}
      <Breadcrumb condoName={condoName} current={pageTitle} />

      {/* Título H1 uniforme - Corrección 17 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground leading-tight mb-2">
          {pageTitle}
        </h1>
        <p className="text-muted-foreground text-lg">
          {user.roleId === 'super_admin' ? `Gestión de ${condos.length || 0} conjuntos` : `${condoName} • ${metrics.totalUnits || 0} unidades`}
        </p>
      </motion.div>

      <HeroSection />
      <QuickActions />

      {/* KPIs - Uniformes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <KpiCard title="Conjuntos/Unidades" value={user.roleId === 'super_admin' ? condos.length : metrics.totalUnits} icon={<Building2 className="w-6 h-6" />} delay={0} />
        <KpiCard title="Residentes" value={metrics.totalResidents} icon={<Users className="w-6 h-6" />} delay={100} />
        <KpiCard title="Cartera" value={Math.round(metrics.totalDebt / 1000000)} prefix="$" suffix="M" icon={<DollarSign className="w-6 h-6" />} delay={200} />
        <KpiCard title="Ocupación" value={metrics.avgOccupancy} suffix="%" icon={<Home className="w-6 h-6" />} delay={300} />
        <KpiCard title="PQRS Abiertas" value={12} icon={<ClipboardList className="w-6 h-6" />} delay={400} />
      </div>

      <DashboardFeatureWorkbench />

      {/* Charts - H3 uniforme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            Recaudo Mensual
            <span className="text-sm text-muted-foreground font-normal">(millones COP)</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <defs>
                <linearGradient id="recaudoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F7A5C" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" fontSize={14} tick={{ fill: '#64748B' }} />
              <YAxis tickFormatter={(v) => `$${(v/1e6).toFixed(0)}M`} fontSize={14} tick={{ fill: '#64748B' }} />
              <Tooltip formatter={(value: number) => [`$${(value/1e6).toFixed(1)}M`, 'Recaudo']} />
              <Bar dataKey="value" fill="url(#recaudoGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            Estado Cartera
            <span className="text-sm text-muted-foreground font-normal">({pieData.reduce((a, b) => a + b.value, 0)}% total)</span>
          </h3>
          <div className="h-72 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-6">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                  <span className="text-sm font-medium">{entry.name}</span>
                  <span className="text-sm font-bold text-foreground">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Context Card - Corrección 5 */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-8 rounded-3xl text-center">
        <h3 className="text-xl font-bold text-foreground mb-4">Contexto Actual</h3>
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 p-6 rounded-2xl border border-teal-500/30">
            <p className="text-2xl font-bold text-teal-100 mb-2">{condoName}</p>
            <p className="text-teal-200 text-sm">{metrics.totalUnits} unidades • {metrics.totalResidents} residentes</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Inicio;
