import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Users, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const COLORS = ['#2563EB', '#0F7A5C', '#F87171', '#FBBF24', '#A78BFA'];

const monthlyData = [
  { name: 'Sep', ingresos: 4.2, egresos: 3.5 }, { name: 'Oct', ingresos: 4.5, egresos: 3.3 },
  { name: 'Nov', ingresos: 4.3, egresos: 3.6 }, { name: 'Dic', ingresos: 4.8, egresos: 3.8 },
  { name: 'Ene', ingresos: 4.7, egresos: 3.4 }, { name: 'Feb', ingresos: 5.0, egresos: 3.7 },
];

const morosidadData = [
  { name: 'Sep', value: 22 }, { name: 'Oct', value: 20 }, { name: 'Nov', value: 21 },
  { name: 'Dic', value: 19 }, { name: 'Ene', value: 17 }, { name: 'Feb', value: 18 },
];

const categoryPie = [
  { name: 'Mantenimiento', value: 35 }, { name: 'Servicios', value: 25 },
  { name: 'Administración', value: 20 }, { name: 'Seguridad', value: 12 }, { name: 'Otros', value: 8 },
];

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('6m');

  // Super admin data
  const condosOverviewData = [
    { name: 'Torres del Parque', units: 120, occupancy: 92, debt: 18.5 },
    { name: 'Parque Central', units: 200, occupancy: 88, debt: 32.0 },
    { name: 'Hacienda Santa María', units: 85, occupancy: 95, debt: 8.2 },
    { name: 'Bosques de Arrayán', units: 150, occupancy: 90, debt: 22.0 },
  ];

  const residentsByType = [
    { name: 'Propietarios', value: 450 },
    { name: 'Arrendatarios', value: 280 },
    { name: 'Familiares', value: 120 },
    { name: 'Administrativos', value: 25 },
  ];

  const superAdminPerformance = [
    { subject: 'Morosidad', A: 85, fullMark: 100 },
    { subject: 'Ocupación', A: 92, fullMark: 100 },
    { subject: 'Cobranza', A: 78, fullMark: 100 },
    { subject: 'Mantenim.', A: 88, fullMark: 100 },
    { subject: 'Satisfacción', A: 95, fullMark: 100 },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="icon-responsive-lg text-primary" /> Analítica Avanzada
        </h1>
        <div className="flex gap-2">
          {['3m', '6m', '1a'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-primary text-white' : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground'}`}>{p}</button>
          ))}
          <button onClick={() => toast({ title: 'Exportación iniciada', description: 'El reporte se descargará en breve (demo)' })} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-1">Ingresos vs Egresos</h3>
          <p className="text-xs text-muted-foreground mb-4">Comparativa mensual (en millones COP)</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
              <XAxis dataKey="name" stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
              <YAxis stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Bar dataKey="ingresos" fill="#0F7A5C" radius={[6, 6, 0, 0]} name="Ingresos" label={{ position: 'top', fill: '#000000', fontSize: 10 }} />
              <Bar dataKey="egresos" fill="#F87171" radius={[6, 6, 0, 0]} name="Egresos" label={{ position: 'top', fill: '#000000', fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-1">Tendencia de Morosidad</h3>
          <p className="text-xs text-muted-foreground mb-4">Porcentaje de cartera vencida (%)</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={morosidadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
              <XAxis dataKey="name" stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
              <YAxis stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} name="Morosidad" label={{ position: 'top', fill: '#000000', fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-foreground mb-1">Distribución de Gastos por Categoría</h3>
          <p className="text-xs text-muted-foreground mb-4">Desglose porcentual del presupesto mensual</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none" label={{ fill: '#000000', fontSize: 11 }}>
                  {categoryPie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {categoryPie.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="text-foreground font-medium ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
