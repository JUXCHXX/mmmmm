import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import KpiCard from '@/components/dashboard/KpiCard';
import { CondoInfoModal } from '@/components/CondoInfoModal';
import { CondosFloatingPanel } from '@/components/CondosFloatingPanel';
import { LocationButtons } from '@/components/LocationButtons';
import ProveedorProfile from '@/components/ProveedorProfile';
import { motion } from 'framer-motion';
import { getRandomUnitImage } from '@/utils/images';
import {
  Building2, Users, DollarSign, AlertTriangle, ClipboardList, Wrench,
  CalendarDays, TrendingUp, CreditCard, Home, Search, ArrowLeft, MapPin,
  Eye, Filter, Menu, Clock, Star, Download, Send,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';

const CHART_COLORS = ['#2563EB', '#60A5FA', '#34D399', '#FBBF24', '#F87171'];

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

const TYPE_LABELS: Record<string, string> = {
  residential: 'Residencial', mixed: 'Mixto', commercial: 'Comercial',
};

const SuperAdminDashboard = () => {
  const { condos } = useAppStore();

  // Global metrics
  const totalUnits = condos.reduce((a, c) => a + c.totalUnits, 0);
  const totalResidents = condos.reduce((a, c) => a + c.totalResidents, 0);
  const totalDebt = condos.reduce((a, c) => a + c.totalDebt, 0);
  const avgOccupancy = Math.round(condos.reduce((a, c) => a + c.occupancyRate, 0) / condos.length);
  const totalAlerts = condos.reduce((a, c) => a + c.alerts, 0);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Global</h1>
        <p className="text-sm text-muted-foreground mt-1">Administraciones Bunty S.A.S • {condos.length} conjuntos</p>
      </motion.div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <KpiCard title="Conjuntos" value={condos.length} icon={<Building2 className="w-5 h-5" />} delay={0} />
        <KpiCard title="Unidades Totales" value={totalUnits} icon={<Home className="w-5 h-5" />} delay={100} />
        <KpiCard title="Residentes" value={totalResidents} icon={<Users className="w-5 h-5" />} delay={200} />
        <KpiCard title="Cartera Total" value={Math.round(totalDebt / 1000000)} prefix="$" suffix="M" icon={<DollarSign className="w-5 h-5" />} trend={{ value: 8, positive: false }} delay={300} />
        <KpiCard title="Ocupación Prom." value={avgOccupancy} suffix="%" icon={<TrendingUp className="w-5 h-5" />} trend={{ value: 2, positive: true }} delay={400} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recaudo Mensual Global</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.18)" />
              <XAxis dataKey="name" stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
              <YAxis stroke="#000000" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} tick={{ fill: '#000000' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} label={{ position: 'top', fill: '#000000', fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Estado de Cartera Global</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none" label={{ fill: '#000000', fontSize: 11 }}>
                {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 mt-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Ir a Propiedades</h3>
        <p className="text-sm text-muted-foreground mb-4">Para ver conjuntos y unidades individuales, ve al módulo de Propiedades en el menú lateral.</p>
      </motion.div>
    </>
  );
};

const AdminDashboard = () => {
  const { condos } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const adminCondo = user?.condoId ? condos.find(c => c.id === user.condoId) : null;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard del Conjunto</h1>
      </motion.div>
      {/* Admin Condo Image Section - Only show if image URL exists */}
      {adminCondo && adminCondo.image && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-xl overflow-hidden h-48 sm:h-64 lg:h-80">
          <img
            src={adminCondo.image}
            alt={adminCondo.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h2 className="text-2xl md:text-3xl font-bold">{adminCondo.name}</h2>
              <p className="text-white/80 mt-1">{adminCondo.address} • {adminCondo.city}</p>
              <LocationButtons
                address={`${adminCondo.address}, ${adminCondo.city}`}
                className="mt-3"
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Recaudo Mes" value={47} prefix="$" suffix="M" icon={<CreditCard className="w-5 h-5" />} trend={{ value: 5, positive: true }} delay={0} />
        <KpiCard title="PQRS Pendientes" value={8} icon={<ClipboardList className="w-5 h-5" />} trend={{ value: 2, positive: false }} delay={100} />
        <KpiCard title="Mantenimientos" value={5} icon={<Wrench className="w-5 h-5" />} delay={200} />
        <KpiCard title="Reservas Hoy" value={3} icon={<CalendarDays className="w-5 h-5" />} delay={300} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">PQRS: Recibidas vs Resueltas</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
            <XAxis dataKey="name" stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
            <YAxis stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
            <Line type="monotone" dataKey="pqrs" stroke="#F87171" strokeWidth={2} dot={{ fill: '#F87171', r: 5 }} label={{ position: 'top', fill: '#000000', fontSize: 10 }} />
            <Line type="monotone" dataKey="resueltas" stroke="#34D399" strokeWidth={2} dot={{ fill: '#34D399', r: 5 }} label={{ position: 'top', fill: '#000000', fontSize: 10 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );
};

const ConsejoDashboard = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      <KpiCard title="Ingresos Totales" value={156} prefix="$" suffix="M" icon={<TrendingUp className="w-5 h-5" />} trend={{ value: 5, positive: true }} delay={0} />
      <KpiCard title="PQRS Abiertas" value={12} icon={<ClipboardList className="w-5 h-5" />} trend={{ value: 4, positive: false }} delay={100} />
      <KpiCard title="Morosidad" value={18} suffix="%" icon={<AlertTriangle className="w-5 h-5" />} trend={{ value: 3, positive: false }} delay={200} />
    </div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Tendencia de Recaudo</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.18)" />
          <XAxis dataKey="name" stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
          <YAxis stroke="#000000" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} tick={{ fill: '#000000' }} />
          <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
          <Bar dataKey="value" fill="#34D399" radius={[6, 6, 0, 0]} label={{ position: 'top', fill: '#000000', fontSize: 11 }} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  </>
);

const ResidenteDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { properties } = useAppStore();

  // Get units for this user
  const userUnits = user?.roleId === 'arrendatario' && user.unitId
    ? properties.filter(p => p.id === user.unitId)
    : user?.unitIds
    ? properties.filter(p => user.unitIds!.includes(p.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Units with Photos */}
      {userUnits.length > 0 && (
        <>
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">
              {user?.roleId === 'arrendatario' ? 'Mi Propiedad' : 'Mis Unidades'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {userUnits.map((unit, i) => (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md overflow-hidden"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-[rgba(255,255,255,0.05)]">
                    <img
                      src={unit.image || getRandomUnitImage(unit.id)}
                      alt={unit.unit}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = getRandomUnitImage(unit.id); }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">Apto {unit.unit}</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                      <div>
                        <span className="text-muted-foreground">Torre:</span>
                        <p className="font-medium text-foreground">{unit.tower}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Área:</span>
                        <p className="font-medium text-foreground">{unit.area} m²</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Propietario:</span>
                        <p className="font-medium text-foreground">{unit.owner}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estado:</span>
                        <p className={`font-medium ${
                          unit.status === 'occupied' ? 'text-emerald-400' :
                          unit.status === 'vacant' ? 'text-amber-400' : 'text-blue-400'
                        }`}>
                          {unit.status === 'occupied' ? 'Ocupada' : unit.status === 'vacant' ? 'Desocupada' : unit.status}
                        </p>
                      </div>
                    </div>
                    {unit.tenant && (
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-xs text-muted-foreground mb-1">Arrendatario:</p>
                        <p className="text-sm font-medium text-foreground">{unit.tenant}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard title="Próximo Pago" value={850000} prefix="$" icon={<CreditCard className="w-5 h-5" />} delay={0} />
        <KpiCard title="Unidad" value={userUnits[0]?.unit || 'N/A'} prefix="Apto " icon={<Home className="w-5 h-5" />} delay={100} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 sm:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-3">Comunicados Recientes</h3>
          <div className="space-y-3">
            {['Asamblea extraordinaria - 15 Mar', 'Mantenimiento ascensores - 10 Mar', 'Nuevo horario piscina'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const PorteriaDashboard = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <KpiCard title="Ingresos Hoy" value={23} icon={<Users className="w-5 h-5" />} delay={0} />
    <KpiCard title="Paquetes Pendientes" value={7} icon={<ClipboardList className="w-5 h-5" />} delay={100} />
  </div>
);

const ProveedorDashboard = () => {
  return <ProveedorProfile />;
};

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const title: Record<string, string> = {
    super_admin: 'Dashboard Global',
    admin: 'Dashboard Operativo',
    consejo: 'Dashboard Ejecutivo',
    propietario: 'Mi Panel',
    arrendatario: 'Mi Panel',
    porteria: 'Panel de Control',
    proveedor: 'Panel de Proveedor',
  };

  // Super admin has its own title logic
  if (user.roleId === 'super_admin') return <SuperAdminDashboard />;

  const dashboards: Record<string, JSX.Element> = {
    admin: <AdminDashboard />,
    consejo: <ConsejoDashboard />,
    propietario: <ResidenteDashboard />,
    arrendatario: <ResidenteDashboard />,
    porteria: <PorteriaDashboard />,
    proveedor: <ProveedorDashboard />,
  };

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-foreground mb-6"
      >
        {title[user.roleId]}
      </motion.h1>
      {dashboards[user.roleId]}
    </div>
  );
};

export default Dashboard;
