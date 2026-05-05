import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Calculator, TrendingUp, TrendingDown, Download, Upload, FileText, Briefcase, Wallet, PieChart, ArrowDownRight, ArrowUpRight, Plus, X, Search, Filter, Building2, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { toast } from '@/hooks/use-toast';

const CATEGORY_OPTIONS = [
  { value: 'cuotas_ordinarias', label: 'Cuotas Ordinarias', type: 'income' },
  { value: 'cuotas_extraordinarias', label: 'Cuotas Extraordinarias', type: 'income' },
  { value: 'arrendamientos', label: 'Arrendamientos', type: 'income' },
  { value: 'intereses_mora', label: 'Intereses por Mora', type: 'income' },
  { value: 'otros_ingresos', label: 'Otros Ingresos', type: 'income' },
  { value: 'nomina', label: 'Nomina', type: 'expense' },
  { value: 'servicios', label: 'Servicios Publicos', type: 'expense' },
  { value: 'mantenimiento', label: 'Mantenimiento', type: 'expense' },
  { value: 'seguridad', label: 'Seguridad', type: 'expense' },
  { value: 'aseo', label: 'Aseo y Limpieza', type: 'expense' },
  { value: 'administracion', label: 'Gastos de Administracion', type: 'expense' },
  { value: 'otros_gastos', label: 'Otros Gastos', type: 'expense' },
];

const AccountingPage = () => {
  const { accounting } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.roleId === 'super_admin';
  const isProveedor = user?.roleId === 'proveedor';
  const isPropietario = user?.roleId === 'propietario';
  
  const [activeTab, setActiveTab] = useState<'movimientos' | 'reportes' | 'integracion'>('movimientos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ concept: '', amount: '', category: 'income' as 'income' | 'expense', account: '', type: '' });
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const income = accounting.filter(a => a.category === 'income').reduce((s, a) => s + a.amount, 0);
  const expense = accounting.filter(a => a.category === 'expense').reduce((s, a) => s + a.amount, 0);
  const balance = income - expense;

  const filteredAccounting = accounting.filter(a => {
    const matchesSearch = a.concept.toLowerCase().includes(searchTerm.toLowerCase()) || a.account.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || a.category === filterType;
    const matchesCategory = filterCategory === 'all' || a.account.includes(filterCategory);
    return matchesSearch && matchesType && matchesCategory;
  });

  const monthlyData = [
    { name: 'Ene', ingresos: 18000000, egresos: 12500000, balance: 5500000 },
    { name: 'Feb', ingresos: income || 15000000, egresos: expense || 10000000, balance: (income || 15000000) - (expense || 10000000) },
    { name: 'Mar', ingresos: 19500000, egresos: 13000000, balance: 6500000 },
    { name: 'Abr', ingresos: 17800000, egresos: 11800000, balance: 6000000 },
  ];

  const cashFlowData = [
    { name: 'Sem 1', entrada: 8500000, salida: 6200000 },
    { name: 'Sem 2', entrada: 9200000, salida: 7100000 },
    { name: 'Sem 3', entrada: 7800000, salida: 5500000 },
    { name: 'Sem 4', entrada: 10500000, salida: 8900000 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'Error', description: 'El archivo no puede superar 10MB', variant: 'destructive' });
        return;
      }
      setAttachedFile(file);
      toast({ title: 'Archivo adjuntado', description: file.name });
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.concept || !newEntry.amount || !newEntry.account) {
      toast({ title: 'Error', description: 'Por favor complete todos los campos', variant: 'destructive' });
      return;
    }
    toast({ title: 'Movimiento agregado', description: `Se ha registrado: ${newEntry.concept}${attachedFile ? ' con adjunto' : ''}` });
    setShowAddModal(false);
    setNewEntry({ concept: '', amount: '', category: 'income', account: '', type: '' });
    setAttachedFile(null);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Calculator className="icon-responsive-lg text-primary" /> Contabilidad
            </h1>
            {isSuperAdmin && (
              <p className="text-sm text-[#0F7A5C] font-medium mt-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Vista de Super Administrador - Modo Enterprise
              </p>
            )}
          </div>
          {isSuperAdmin && (
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D4A3E] text-white font-semibold hover:bg-[#0D4A3E]/90 transition-colors shadow-lg">
                <Plus className="w-5 h-5" />
                Nuevo Movimiento
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs for Super Admin */}
      {isSuperAdmin && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'movimientos', label: 'Movimientos', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'reportes', label: 'Reportes', icon: <PieChart className="w-4 h-4" /> },
            { id: 'integracion', label: 'Integracion', icon: <Database className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#0D4A3E] text-white shadow-lg' 
                  : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard title="Ingresos Totales" value={Math.round(Number(income) / 1000000)} prefix="$" suffix="M" icon={<TrendingUp className="w-5 h-5" />} trend={{ value: 8, positive: true }} delay={0} />
        <KpiCard title="Egresos Totales" value={Math.round(Number(expense) / 1000000)} prefix="$" suffix="M" icon={<TrendingDown className="w-5 h-5" />} delay={100} />
        <KpiCard title="Balance" value={Math.round(Number(balance) / 1000000)} prefix="$" suffix="M" icon={<Wallet className="w-5 h-5" />} trend={{ value: 12, positive: true }} delay={200} />
      </div>

      {/* Tab Content */}
      {(!isSuperAdmin || activeTab === 'movimientos') && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar movimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-foreground text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">Todos los tipos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Egresos</option>
            </select>
          </div>

          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">Ingresos vs Egresos</h3>
            <p className="text-xs text-muted-foreground mb-4">Comparativa mensual en millones COP</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis dataKey="name" stroke="#000000" fontSize={12} tick={{ fill: '#000000' }} />
                <YAxis stroke="#000000" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} tick={{ fill: '#000000' }} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: number) => `$${(v/1000000).toFixed(1)}M`} />
                <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} />
                <Bar dataKey="ingresos" fill="#0F7A5C" radius={[6, 6, 0, 0]} name="Ingresos" />
                <Bar dataKey="egresos" fill="#F87171" radius={[6, 6, 0, 0]} name="Egresos" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md overflow-hidden">
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
              <h3 className="text-sm font-semibold text-foreground mb-1">Movimientos Contables</h3>
              <p className="text-xs text-muted-foreground">Detalle de todas las transacciones</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="text-left p-4 text-label font-medium">Fecha</th>
                  <th className="text-left p-4 text-label font-medium">Concepto</th>
                  <th className="text-left p-4 text-label font-medium hidden sm:table-cell">Cuenta</th>
                  <th className="text-right p-4 text-label font-medium">Monto</th>
                  {isSuperAdmin && <th className="text-center p-4 text-label font-medium">Soporte</th>}
                </tr></thead>
                <tbody>
                  {filteredAccounting.map((a) => (
                    <tr key={a.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)]">
                      <td className="p-4 text-muted-foreground">{a.date}</td>
                      <td className="p-4 text-foreground">{a.concept}</td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell">{a.account}</td>
                      <td className={`p-4 text-right font-medium ${a.category === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {a.category === 'income' ? '+' : '-'}${a.amount.toLocaleString()}
                      </td>
                      {isSuperAdmin && (
                        <td className="p-4 text-center">
                          <button className="p-2 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {/* Reports Tab - Super Admin Only */}
      {isSuperAdmin && activeTab === 'reportes' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Balance Report */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" /> Balance General
                </h3>
                <button className="p-2 rounded-lg hover:bg-primary/20 text-muted-foreground">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-sm text-foreground">Activos</span>
                  <span className="text-lg font-bold text-emerald-400">$156.5M</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-sm text-foreground">Pasivos</span>
                  <span className="text-lg font-bold text-red-400">$42.3M</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <span className="text-sm text-foreground">Patrimonio</span>
                  <span className="text-lg font-bold text-blue-400">$114.2M</span>
                </div>
              </div>
            </motion.div>

            {/* Cash Flow */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" /> Flujo de Caja
                </h3>
                <button className="p-2 rounded-lg hover:bg-primary/20 text-muted-foreground">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#000000" fontSize={10} />
                  <YAxis stroke="#000000" fontSize={10} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} formatter={(v: number) => `$${(v/1000000).toFixed(1)}M`} />
                  <Area type="monotone" dataKey="entrada" stackId="1" stroke="#0F7A5C" fill="#0F7A5C" fillOpacity={0.3} name="Entradas" />
                  <Area type="monotone" dataKey="salida" stackId="2" stroke="#F87171" fill="#F87171" fillOpacity={0.3} name="Salidas" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Income by Category */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <ArrowDownRight className="w-5 h-5 text-emerald-400" /> Ingresos por Categoria
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Cuotas Ordinarias', value: 8500000, percent: 56 },
                  { name: 'Arrendamientos', value: 3500000, percent: 23 },
                  { name: 'Cuotas Extraordinarias', value: 2000000, percent: 13 },
                  { name: 'Otros Ingresos', value: 1200000, percent: 8 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="text-foreground font-medium">${(item.value/1000000).toFixed(1)}M</span>
                    </div>
                    <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Expenses by Category */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-red-400" /> Egresos por Categoria
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Nomina', value: 4500000, percent: 45 },
                  { name: 'Servicios', value: 2100000, percent: 21 },
                  { name: 'Seguridad', value: 1800000, percent: 18 },
                  { name: 'Mantenimiento', value: 1600000, percent: 16 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="text-foreground font-medium">${(item.value/1000000).toFixed(1)}M</span>
                    </div>
                    <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Export Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Exportar Reportes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => toast({ title: 'Exportando', description: 'Balance General en PDF' })} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <FileText className="w-5 h-5 text-red-400" />
                <span className="text-sm text-foreground">PDF</span>
              </button>
              <button onClick={() => toast({ title: 'Exportando', description: 'Estado de Resultados en Excel' })} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-foreground">Excel</span>
              </button>
              <button onClick={() => toast({ title: 'Exportando', description: 'Flujo de Caja en CSV' })} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-foreground">CSV</span>
              </button>
              <button onClick={() => toast({ title: 'Generando', description: 'Reporte Integral' })} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-foreground">Completo</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Integration Tab - Super Admin Only */}
      {isSuperAdmin && activeTab === 'integracion' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Integracion con Sistemas Contables</h3>
                <p className="text-xs text-muted-foreground">Conecta con sistemas externos de contabilidad empresarial</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SAP */}
              <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-400">SAP</span>
                    <span className="text-xs text-muted-foreground">Business One</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-amber-400">
                    <AlertCircle className="w-3 h-3" /> No conectado
                  </span>
                </div>
                <button className="w-full px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors">
                  Configurar Conexion
                </button>
              </div>

              {/* Oracle */}
              <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-400">Oracle</span>
                    <span className="text-xs text-muted-foreground">NetSuite</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-amber-400">
                    <AlertCircle className="w-3 h-3" /> No conectado
                  </span>
                </div>
                <button className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors">
                  Configurar Conexion
                </button>
              </div>

              {/* Dinamic */}
              <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-400">Dinamic</span>
                    <span className="text-xs text-muted-foreground">Software Contable</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle className="w-3 h-3" /> Conectado
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Sincronizar
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] text-muted-foreground text-sm hover:bg-[rgba(255,255,255,0.1)]">
                    Configurar
                  </button>
                </div>
              </div>

              {/* SIIGO */}
              <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-amber-400">SIIGO</span>
                    <span className="text-xs text-muted-foreground">Nube</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle className="w-3 h-3" /> Conectado
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Sincronizar
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] text-muted-foreground text-sm hover:bg-[rgba(255,255,255,0.1)]">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Configuracion API</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)]">
                <div>
                  <p className="text-sm text-foreground">API Key</p>
                  <p className="text-xs text-muted-foreground font-mono">sk_live_****************************</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.06)] text-muted-foreground text-xs hover:bg-[rgba(255,255,255,0.1)]">
                  Regenerar
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)]">
                <div>
                  <p className="text-sm text-foreground">Webhook URL</p>
                  <p className="text-xs text-muted-foreground font-mono">https://api.bunty.com/webhook/accounting</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.06)] text-muted-foreground text-xs hover:bg-[rgba(255,255,255,0.1)]">
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Entry Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-background rounded-2xl w-full max-w-lg overflow-hidden border border-[#0D4A3E]/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b bg-gradient-to-r from-[#0D4A3E]/10 to-[#0F7A5C]/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Nuevo Movimiento Contable</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)]">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Movimiento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewEntry({ ...newEntry, category: 'income' })}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${newEntry.category === 'income' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-[rgba(255,255,255,0.1)] text-muted-foreground'}`}
                  >
                    Ingreso
                  </button>
                  <button
                    onClick={() => setNewEntry({ ...newEntry, category: 'expense' })}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${newEntry.category === 'expense' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-[rgba(255,255,255,0.1)] text-muted-foreground'}`}
                  >
                    Egreso
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Concepto</label>
                <input
                  type="text"
                  value={newEntry.concept}
                  onChange={(e) => setNewEntry({ ...newEntry, concept: e.target.value })}
                  placeholder="Ej: Cuota administracion febrero"
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Categoria</label>
                <select
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50"
                >
                  <option value="">Seleccionar categoria</option>
                  {CATEGORY_OPTIONS.filter(c => c.type === newEntry.category).map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Monto</label>
                <input
                  type="number"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cuenta Contable</label>
                <input
                  type="text"
                  value={newEntry.account}
                  onChange={(e) => setNewEntry({ ...newEntry, account: e.target.value })}
                  placeholder="Ej: Cuotas Ordinarias"
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50"
                />
              </div>

              {/* File Upload Section */}
              <label
                htmlFor="file-upload"
                className="border border-dashed border-[#0D4A3E]/30 rounded-xl p-6 text-center hover:border-[#0F7A5C]/50 transition-colors cursor-pointer block"
              >
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {attachedFile ? (
                  <div>
                    <FileText className="w-8 h-8 text-[#0F7A5C] mx-auto mb-2" />
                    <p className="text-sm text-foreground font-medium">{attachedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(attachedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-xs text-[#0F7A5C] mt-2">Click para cambiar</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Subir soporte (PDF, JPG, PNG)</p>
                    <p className="text-xs text-muted-foreground mt-1">Maximo 10MB</p>
                  </div>
                )}
              </label>
            </div>

            <div className="p-4 border-t bg-background flex gap-3">
              <button onClick={() => { setShowAddModal(false); setAttachedFile(null); }} className="flex-1 px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.06)] text-foreground font-semibold hover:bg-[rgba(255,255,255,0.1)]">
                Cancelar
              </button>
              <button onClick={handleAddEntry} className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D4A3E] text-white font-semibold hover:bg-[#0D4A3E]/90 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AccountingPage;
