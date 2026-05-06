import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, TrendingUp, TrendingDown, Users, Building2, DollarSign, Activity, Calendar, ArrowUpRight, ArrowDownRight, UserCheck, UserX, Home, Car, Clock, AlertTriangle, Filter, RefreshCw, MapPin, Mail, Phone, CheckCircle, Briefcase, ClipboardList, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { useAuthStore } from '@/store/useAuthStore';

const COLORS = ['#2563EB', '#0F7A5C', '#F87171', '#FBBF24', '#A78BFA', '#EC4899'];

const monthlyData = [
  { name: 'Sep', ingresos: 4.2, egresos: 3.5 }, { name: 'Oct', ingresos: 4.5, egresos: 3.3 },
  { name: 'Nov', ingresos: 4.3, egresos: 3.6 }, { name: 'Dic', ingresos: 4.8, egresos: 3.8 },
  { name: 'Ene', ingresos: 4.7, egresos: 3.4 }, { name: 'Feb', ingresos: 5.0, egresos: 3.7 },
];

const morosidadData = [
  { name: 'Sep', value: 22 }, { name: 'Oct', value: 20 }, { name: 'Nov', value: 21 },
  { name: 'Dic', value: 19 }, { name: 'Ene', value: 17 }, { name: 'Feb', value: 18 },
];

const occupancyData = [
  { name: 'Ocupadas', value: 85, color: '#0F7A5C' },
  { name: 'Vacantes', value: 10, color: '#FBBF24' },
  { name: 'En Venta', value: 3, color: '#2563EB' },
  { name: 'En Arriendo', value: 2, color: '#A78BFA' },
];

const residentTypeData = [
  { name: 'Propietarios', value: 45 },
  { name: 'Arrendatarios', value: 35 },
  { name: 'Familiares', value: 15 },
  { name: 'Administración', value: 5 },
];

const towerOccupancy = [
  { name: 'Torre A', occupancy: 95, units: 48 },
  { name: 'Torre B', occupancy: 88, units: 40 },
  { name: 'Torre C', occupancy: 92, units: 32 },
];

const monthlyCollection = [
  { name: 'Ene', target: 100, actual: 95 },
  { name: 'Feb', target: 100, actual: 98 },
  { name: 'Mar', target: 100, actual: 92 },
  { name: 'Abr', target: 100, actual: 96 },
  { name: 'May', target: 100, actual: 94 },
  { name: 'Jun', target: 100, actual: 97 },
];

const maintenanceData = [
  { name: 'Ene', completed: 12, pending: 3 },
  { name: 'Feb', completed: 15, pending: 2 },
  { name: 'Mar', completed: 18, pending: 4 },
  { name: 'Abr', completed: 14, pending: 1 },
  { name: 'May', completed: 20, pending: 3 },
  { name: 'Jun', completed: 16, pending: 2 },
];

const ageDistribution = [
  { age: '0-18', count: 25 },
  { age: '19-35', count: 45 },
  { age: '36-50', count: 60 },
  { age: '51-65', count: 35 },
  { age: '65+', count: 15 },
];

const complaintsByCategory = [
  { category: 'Ruido', count: 15 },
  { category: 'Mantenimiento', count: 12 },
  { category: 'Estacionamiento', count: 8 },
  { category: 'Mascotas', count: 6 },
  { category: 'Otros', count: 4 },
];

// Tenant view data
const tenantAccessData = [
  { name: 'Lun', accesos: 12 },
  { name: 'Mar', accesos: 8 },
  { name: 'Mié', accesos: 15 },
  { name: 'Jue', accesos: 10 },
  { name: 'Vie', accesos: 18 },
  { name: 'Sáb', accesos: 22 },
  { name: 'Dom', accesos: 14 },
];

const tenantPaymentsData = [
  { name: 'Ene', monto: 650000 },
  { name: 'Feb', monto: 650000 },
  { name: 'Mar', monto: 650000 },
  { name: 'Abr', monto: 650000 },
  { name: 'May', monto: 650000 },
  { name: 'Jun', monto: 650000 },
];

const AnalyticsPage = () => {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.roleId === 'super_admin';
  const isPropietario = user?.roleId === 'propietario';
  const isArrendatario = user?.roleId === 'arrendatario';
  const isProveedor = user?.roleId === 'proveedor';
  const isOwner = isPropietario || isArrendatario;
  const [period, setPeriod] = useState('6m');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const ownerUnits = user?.unitIds || [user?.unitId].filter(Boolean);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: 'Datos actualizados', description: 'Los datos de analítica han sido actualizados' });
    }, 1500);
  };

  // Provider view - show their work orders and revenue data
  if (isProveedor) {
    // Sample provider analytics data
    const providerData = {
      totalOrders: 156,
      completedOrders: 142,
      pendingOrders: 8,
      inProgressOrders: 6,
      totalRevenue: 45000000,
      avgRating: 4.8,
      responseTime: '2.5 hrs',
      satisfaction: 95,
    };

    const monthlyOrdersData = [
      { name: 'Ene', servicios: 12, ingresos: 4500000 },
      { name: 'Feb', servicios: 15, ingresos: 5200000 },
      { name: 'Mar', servicios: 18, ingresos: 6800000 },
      { name: 'Abr', servicios: 14, ingresos: 5100000 },
      { name: 'May', servicios: 20, ingresos: 7500000 },
      { name: 'Jun', servicios: 16, ingresos: 6200000 },
    ];

    const servicesByCondo = [
      { name: 'Torres del Parque', servicios: 45, ingresos: 15000000 },
      { name: 'Res. La Florida', servicios: 38, ingresos: 12000000 },
      { name: 'Conjunto San Felipe', servicios: 32, ingresos: 9800000 },
      { name: 'Edif. Central', servicios: 27, ingresos: 8200000 },
    ];

    const servicesByCategory = [
      { name: 'Mantenimiento', value: 45, color: '#0F7A5C' },
      { name: 'Electricidad', value: 25, color: '#2563EB' },
      { name: 'Plomería', value: 18, color: '#F59E0B' },
      { name: 'HVAC', value: 12, color: '#8B5CF6' },
    ];

    const ordersByStatus = [
      { name: 'Completadas', value: 142, color: '#10B981' },
      { name: 'Pendientes', value: 8, color: '#F59E0B' },
      { name: 'En Progreso', value: 6, color: '#3B82F6' },
    ];

    return (
      <div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="icon-responsive-lg text-primary" /> Mi Desempeño
          </h1>
          <p className="text-sm text-[#0F7A5C] font-medium mt-1 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Panel de Analítica - Proveedor
          </p>
        </motion.div>

        {/* KPI Cards for Provider */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-2">
              <ClipboardList className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">{providerData.totalOrders}</p>
            <p className="text-xs text-muted-foreground">Total Órdenes</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">{providerData.completedOrders}</p>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">{providerData.pendingOrders}</p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">${(providerData.totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground">Ingresos Totales</p>
          </motion.div>
        </div>

        {/* Charts for Provider */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Servicios por Mes</h3>
            <p className="text-xs text-muted-foreground mb-4">Cantidad de servicios realizados</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <YAxis stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 12, color: '#fff' }} formatter={(value: number) => [value, '']} />
                <Bar dataKey="servicios" name="Servicios" fill="#0F7A5C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Ingresos por Mes (Millones)</h3>
            <p className="text-xs text-muted-foreground mb-4">Evolución de ingresos</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <YAxis stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 12, color: '#fff' }} formatter={(value: number) => [`$${(value/1000000).toFixed(1)}M`, '']} />
                <Area type="monotone" dataKey="ingresos" stroke="#2563EB" fill="rgba(37,99,235,0.3)" name="Ingresos" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Servicios por Conjunto</h3>
            <p className="text-xs text-muted-foreground mb-4">Distribución por cliente</p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={servicesByCondo} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="servicios" stroke="none" label={({ name, servicios }) => `${name}: ${servicios}`} labelLine={false}>
                    {servicesByCondo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 12, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {servicesByCondo.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="text-foreground font-medium ml-auto">{d.servicios}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Estado de Órdenes</h3>
            <p className="text-xs text-muted-foreground mb-4">Distribución por estado</p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 12, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {ordersByStatus.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="text-foreground font-medium ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-3">Métricas de Desempeño</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Calificación Promedio</span>
                <span className="font-bold text-foreground">{providerData.avgRating}/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> Tiempo de Respuesta</span>
                <span className="font-bold text-foreground">{providerData.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Satisfacción</span>
                <span className="font-bold text-emerald-400">{providerData.satisfaction}%</span>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
            <h3 className="text-sm font-bold text-foreground mb-3">Servicios por Categoría</h3>
            <div className="space-y-2">
              {servicesByCategory.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-sm text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{cat.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
            <h3 className="text-sm font-bold text-foreground mb-3">Resumen Financiero</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ingresos Mes Actual</span>
                <span className="font-bold text-emerald-400">$6.2M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Facturas Pendientes</span>
                <span className="font-bold text-amber-400">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Promedio por Orden</span>
                <span className="font-bold text-foreground">$288K</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Simplified view for arrendatario - only show their unit data
  if (isArrendatario) {
    const tenantData = {
      unitNumber: ownerUnits[0] || '101',
      tower: 'Torre A',
      area: 85,
      monthlyFee: 650000,
      balance: 0,
      lastPayment: '15 Feb 2025',
      nextDueDate: '15 Mar 2025',
    };

    return (
      <div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="icon-responsive-lg text-primary" /> Mi Vivienda
          </h1>
          <p className="text-sm text-[#2563EB] font-medium mt-1 flex items-center gap-2">
            <Home className="w-4 h-4" /> Unidad {tenantData.unitNumber} - {tenantData.tower}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">${tenantData.monthlyFee.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Cuota Mensual</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">${tenantData.balance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Saldo</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center mb-2">
              <Activity className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">45</p>
            <p className="text-xs text-muted-foreground">Accesos</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Visitantes</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Accesos Esta Semana</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tenantAccessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="accesos" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Historial de Pagos</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={tenantPaymentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="monto" stroke="#0F7A5C" fill="rgba(15,122,92,0.3)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
            <h3 className="text-sm font-bold text-foreground mb-3">Datos de la Unidad</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Número:</span><span className="text-foreground font-medium">{tenantData.unitNumber}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Torre:</span><span className="text-foreground font-medium">{tenantData.tower}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Área:</span><span className="text-foreground font-medium">{tenantData.area} m²</span></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
            <h3 className="text-sm font-bold text-foreground mb-3">Estado de Cuenta</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Último pago:</span><span className="text-emerald-400 font-medium">{tenantData.lastPayment}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Próximo:</span><span className="text-foreground font-medium">{tenantData.nextDueDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estado:</span><span className="inline-flex items-center gap-1 text-emerald-400 font-medium"><CheckCircle className="h-3.5 w-3.5" /> Al día</span></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
            <h3 className="text-sm font-bold text-foreground mb-3">Mantenimiento</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Solicitudes:</span><span className="text-foreground font-medium">2</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pendientes:</span><span className="text-amber-400 font-medium">1</span></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Normal view for other roles
  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="icon-responsive-lg text-primary" /> {isOwner ? 'Mi Analítica' : 'Analítica Avanzada'}
          </h1>
          {isSuperAdmin && (
            <p className="text-sm text-[#0F7A5C] font-medium mt-1 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Vista de Super Administrador - Análisis de todos los conjuntos
            </p>
          )}
          {isOwner && (
            <p className="text-sm text-[#2563EB] font-medium mt-1 flex items-center gap-2">
              <Home className="w-4 h-4" /> {isPropietario ? 'Vista de Propietario' : 'Vista de Arrendatario'} - Unidad{ownerUnits.length > 1 ? 'es' : ''}: {ownerUnits.join(', ')}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['3m', '6m', '1a'].map(p => (
            <button 
              key={p} 
              onClick={() => setPeriod(p)} 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-primary text-white' : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground'}`}
            >
              {p}
            </button>
          ))}
          <button 
            onClick={handleRefresh}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Actualizar
          </button>
          <button 
            onClick={() => toast({ title: 'Exportación iniciada', description: 'El reporte se descargará en breve' })} 
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +5%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">94%</p>
          <p className="text-xs text-muted-foreground">Tasa de Ocupación</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">180</p>
          <p className="text-xs text-muted-foreground">Total Residentes</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs text-red-400 flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" /> -3%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">18%</p>
          <p className="text-xs text-muted-foreground">Tasa de Morosidad</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">96%</p>
          <p className="text-xs text-muted-foreground">Cobro Efectivo</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-1">Ingresos vs Egresos (Millones)</h3>
          <p className="text-xs text-muted-foreground mb-4">Evolución financiera últimos 6 meses</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
              <YAxis stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(value: number) => [`$${value}M`, '']} />
              <Bar dataKey="ingresos" name="Ingresos" fill="#0F7A5C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="egresos" name="Egresos" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-1">Tendencia de Morosidad</h3>
          <p className="text-xs text-muted-foreground mb-4">Porcentaje de cartera vencida (%)</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={morosidadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
              <YAxis stroke="#888" fontSize={12} tick={{ fill: '#888' }} domain={[0, 30]} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} name="Morosidad %" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-1">Estado de Ocupación</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribución de unidades por estado</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {occupancyData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="text-foreground font-medium ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-1">Tasa de Cobro Mensual</h3>
          <p className="text-xs text-muted-foreground mb-4">Meta vs Real (porcentaje)</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
              <YAxis stroke="#888" fontSize={12} tick={{ fill: '#888' }} domain={[80, 100]} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(value: number) => [`${value}%`, '']} />
              <Area type="monotone" dataKey="target" stroke="#888" fill="transparent" strokeDasharray="5 5" name="Meta" />
              <Area type="monotone" dataKey="actual" stroke="#0F7A5C" fill="rgba(15,122,92,0.3)" name="Real" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Full Width Charts */}
      <div className="grid grid-cols-1 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-1">Ocupación por Torre</h3>
          <p className="text-xs text-muted-foreground mb-4">Porcentaje de ocupación y número de unidades</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {towerOccupancy.map((tower) => (
              <div key={tower.name} className="p-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">{tower.name}</span>
                  <span className="text-xs text-muted-foreground">{tower.units} unidades</span>
                </div>
                <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${tower.occupancy}%` }} transition={{ delay: 0.5, duration: 0.8 }} className="h-full bg-gradient-to-r from-[#0F7A5C] to-[#2563EB] rounded-full" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-bold text-foreground">{tower.occupancy}%</span>
                  <span className={`text-xs ${tower.occupancy >= 90 ? 'text-emerald-400' : tower.occupancy >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                    {tower.occupancy >= 90 ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Excelente
                      </span>
                    ) : tower.occupancy >= 80 ? (
                      <span className="inline-flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5" />
                        Normal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Bajo
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Órdenes de Mantenimiento</h3>
            <p className="text-xs text-muted-foreground mb-4">Completadas vs Pendientes por mes</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <YAxis stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="completed" name="Completadas" fill="#0F7A5C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pendientes" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Distribución de Residentes</h3>
            <p className="text-xs text-muted-foreground mb-4">Por tipo de ocupación</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={residentTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                  {residentTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">PQRS por Categoría</h3>
            <p className="text-xs text-muted-foreground mb-4">Distribución de quejas y solicitudes</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complaintsByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis type="number" stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <YAxis type="category" dataKey="category" stroke="#888" fontSize={12} tick={{ fill: '#888' }} width={80} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="count" name="Cantidad" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-1">Distribución por Edad</h3>
            <p className="text-xs text-muted-foreground mb-4">Grupos etarios de residentes</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis dataKey="age" stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <YAxis stroke="#888" fontSize={12} tick={{ fill: '#888' }} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="count" name="Residentes" fill="#A78BFA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
