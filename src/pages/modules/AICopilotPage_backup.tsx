import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, TrendingUp, Settings, AlertCircle, BarChart3, Zap, MessageSquare, Brain, 
  Bell, FileText, CheckCircle, Clock, ChevronDown, X, Sparkles, Target, TrendingDown, 
  Activity, Shield, Users, DollarSign, MessageCircle, Lightbulb, BarChart, Wrench, 
  Printer, Download, Sliders, ChartLine, Building, Calendar, Filter, Plus, Search, Eye, 
  MoreVertical, Check, XCircle, AlertTriangle, Info, BellRing, Mail, Smartphone, Globe, 
  ShieldCheck, Key, Database, RefreshCw, Save, Upload, FileSpreadsheet, File, Image, 
  Gauge, Layers, PieChart as PieChartIcon, MapPin, Building2
} from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart as BarChartComposed, Bar, Legend } from 'recharts';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Types
type TabId = 'dashboard' | 'chat' | 'predictions' | 'config' | 'reports' | 'visualization';
type AlertCategory = 'morosidad' | 'mantenimiento' | 'ocupacion' | 'seguridad' | 'finanzas';

interface AlertConfig {
  id: AlertCategory;
  label: string;
  description: string;
  enabled: boolean;
  threshold: number;
  notifyEmail: boolean;
  notifyPush: boolean;
}

interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: 'week' | 'month' | 'quarter' | 'year';
  includeCharts: boolean;
  includePredictions: boolean;
}

const CHAT_RESPONSES: Record<string, string> = {
  'morosidad': 'La morosidad actual del conjunto es del 18%. Se recomienda implementar acuerdos de pago para las 3 unidades con mayor deuda y enviar notificaciones automáticas 5 días antes del vencimiento.',
  'mantenimiento': 'Hay 2 órdenes de mantenimiento de alta prioridad: Reparación de bomba de agua y portón vehicular. Se sugiere priorizar la bomba por afectación a múltiples unidades.',
  'reservas': 'Esta semana hay 3 reservas confirmadas. El salón comunal es el área más solicitada (65% de reservas). Se sugiere ampliar horarios los fines de semana.',
  'presupuesto': 'El presupuesto ejecutado va al 42% (mes 2 de 12). Los gastos de personal representan el 37% del total. Se proyecto cierre del año con superavit del 5%.',
  default: 'Analice tu consulta. Basándome en los datos del conjunto, puedo sugerirte revisar los indicadores del dashboard para una visión más detallada. ¿Necesitas información sobre morosidad, mantenimiento, reservas o presupuesto?',
};

const PREDICTIONS = [
  { title: 'Riesgo de Morosidad', value: '3 unidades', description: 'Unidades 102, 203 y 301 podrían entrar en mora el próximo mes', risk: 'high' as const, icon: DollarSign },
  { title: 'Mantenimiento Preventivo', value: '2 equipos', description: 'Ascensor Torre A y bomba secundaria requieren revisión en 30 días', risk: 'medium' as const, icon: Activity },
  { title: 'Ocupación Áreas Comunes', value: '78%', description: 'Se predice alta demanda del salón comunal para marzo', risk: 'low' as const, icon: Users },
  { title: 'Ocupación Global', value: '94%', description: 'La ocupación del conjunto se mantiene estable', risk: 'low' as const, icon: Target },
  { title: 'Consumo de Servicios', value: '-5%', description: 'Se predice reducción en consumo de agua para el próximo mes', risk: 'low' as const, icon: TrendingDown },
];

const GLOBAL_STATS = [
  { title: 'Conjuntos Activos', value: '8', icon: Building, trend: '+2', trendUp: true, color: 'from-blue-500 to-cyan-500' },
  { title: 'Morosidad Global', value: '15%', icon: AlertCircle, trend: '-3%', trendUp: true, color: 'from-red-500 to-orange-500' },
  { title: 'Alertas Críticas', value: '12', icon: BellRing, trend: '+5', trendUp: false, color: 'from-amber-500 to-red-500' },
  { title: 'Ocupación Promedio', value: '91%', icon: Users, trend: '+2%', trendUp: true, color: 'from-emerald-500 to-teal-500' },
  { title: 'Mantenimientos', value: '28', icon: Wrench, trend: '+8', trendUp: false, color: 'from-purple-500 to-pink-500' },
  { title: 'Ingresos Totales', value: '$18.5M', icon: TrendingUp, trend: '+12%', trendUp: true, color: 'from-green-500 to-emerald-500' },
];

const CHART_COLORS = ['#2563EB', '#0F7A5C', '#F59E0B', '#EF4444', '#8B5CF6'];

const morosidadData = [
  { name: 'Ene', value: 22 }, { name: 'Feb', value: 20 }, { name: 'Mar', value: 18 },
  { name: 'Abr', value: 17 }, { name: 'May', value: 15 }, { name: 'Jun', value: 14 },
];

const ingresosData = [
  { name: 'Ene', ingresos: 120, gastos: 95 },
  { name: 'Feb', ingresos: 135, gastos: 100 },
  { name: 'Mar', ingresos: 128, gastos: 92 },
  { name: 'Abr', ingresos: 145, gastos: 105 },
  { name: 'May', ingresos: 152, gastos: 110 },
  { name: 'Jun', ingresos: 168, gastos: 118 },
];

const ocupacionData = [
  { name: 'Conj 1', value: 94 },
  { name: 'Conj 2', value: 88 },
  { name: 'Conj 3', value: 92 },
  { name: 'Conj 4', value: 85 },
  { name: 'Conj 5', value: 97 },
  { name: 'Conj 6', value: 90 },
  { name: 'Conj 7', value: 91 },
  { name: 'Conj 8', value: 95 },
];

const AICopilotPage = () => {
  const user = useAuthStore((s) => s.user);
  const { condos } = useAppStore();
  
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: '¡Hola! Soy tu asistente IA de Bunty. ¿En qué puedo ayudarte hoy? Puedo analizar morosidad, mantenimiento, reservas y presupuesto.', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [tab, setTab] = useState<TabId>('dashboard');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    dateRange: 'month',
    includeCharts: true,
    includePredictions: true,
  });
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([
    { id: 'morosidad', label: 'Alertas de Morosidad', description: 'Notificar cuando una unidad supere X días de mora', enabled: true, threshold: 30, notifyEmail: true, notifyPush: true },
    { id: 'mantenimiento', label: 'Predicciones de Mantenimiento', description: 'Análisis predictivo de equipos que requieren mantenimiento', enabled: true, threshold: 30, notifyEmail: true, notifyPush: false },
    { id: 'ocupacion', label: 'Análisis de Ocupación', description: 'Predicciones de ocupación de áreas comunes', enabled: true, threshold: 80, notifyEmail: false, notifyPush: true },
    { id: 'seguridad', label: 'Alertas de Seguridad', description: 'Notificaciones de eventos inusuales en el conjunto', enabled: true, threshold: 1, notifyEmail: true, notifyPush: true },
    { id: 'finanzas', label: 'Alertas Financieras', description: 'Notificaciones sobre presupuesto y gastos', enabled: true, threshold: 90, notifyEmail: true, notifyPush: false },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = user?.roleId === 'super_admin';
  const isAdmin = user?.roleId === 'admin';
  const isCouncil = user?.roleId === 'consejo';

  const getTabsForRole = () => {
    if (isSuperAdmin) {
      return [
        { id: 'dashboard', label: 'Dashboard Global', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'chat', label: 'Chat IA', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'predictions', label: 'Predicciones', icon: <Brain className="w-4 h-4" /> },
        { id: 'config', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
      ];
    } else if (isAdmin) {
      return [
        { id: 'dashboard', label: 'Dashboard Conjunto', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'chat', label: 'Chat IA', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'predictions', label: 'Predicciones', icon: <Brain className="w-4 h-4" /> },
      ];
    } else if (isCouncil) {
      return [
        { id: 'reports', label: 'Reportes', icon: <FileText className="w-4 h-4" /> },
        { id: 'visualization', label: 'Visualización', icon: <BarChart className="w-4 h-4" /> },
      ];
    }
    return [];
  };

  const tabs = getTabsForRole();

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === tab)) {
      setTab(tabs[0].id);
    }
  }, [tabs, tab]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');
    setTimeout(() => {
      const key = Object.keys(CHAT_RESPONSES).find(k => input.toLowerCase().includes(k)) || 'default';
      setMessages(prev => [...prev, { text: CHAT_RESPONSES[key], isUser: false }]);
    }, 800);
  };

  const handleExport = () => {
    toast({ 
      title: 'Exportando análisis', 
      description: `Generando reporte en formato ${exportConfig.format.toUpperCase()}...` 
    });
    setTimeout(() => {
      toast({ 
        title: 'Exportación completada', 
        description: 'El reporte ha sido descargado exitosamente' 
      });
    }, 2000);
    setShowExportModal(false);
  };

  const handleSaveAlerts = () => {
    toast({ 
      title: 'Configuración guardada', 
      description: 'Las alertas han sido actualizadas correctamente' 
    });
    setShowAlertsModal(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      default: return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      default: return 'Bajo';
    }
  };

  // Filter predictions based on search
  const filteredPredictions = PREDICTIONS.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      {/* Role-specific Header */}
      <div className="relative mb-6">
        <div className={`relative p-6 rounded-2xl text-white overflow-hidden ${
          isSuperAdmin ? 'bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E]' :
          isAdmin ? 'bg-gradient-to-br from-[#2D5F3F] to-[#1A3A2E]' :
          'bg-gradient-to-br from-[#4A90A4] to-[#2E5C6E]'
        }`}>
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img src="/assets/ai-bg.svg" alt="" className="w-full h-full object-cover" />
          </div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Bot className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {isSuperAdmin ? 'IA Copiloto Global' :
                     isAdmin ? 'IA Copiloto del Conjunto' :
                     'Reportes Inteligentes'}
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    {isSuperAdmin ? 'Gestión inteligente de múltiples conjuntos' :
                     isAdmin ? 'Análisis y control de tu conjunto' :
                     'Visualización y reportes sin capacidad de acción'}
                  </p>
                </div>
              </div>
              {isSuperAdmin && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Modo Super Administrador</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as TabId)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Super Admin Dashboard */}
      {isSuperAdmin && tab === 'dashboard' && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => toast({ title: 'Generando PDF', description: 'Esto podría tomar unos segundos...' })}
              className="bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] hover:opacity-90"
            >
              <Printer className="w-4 h-4 mr-2" /> Generar PDF Global
            </Button>
            <Button variant="outline" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4 mr-2" /> Exportar Análisis
            </Button>
            <Button variant="outline" onClick={() => setShowAlertsModal(true)}>
              <Sliders className="w-4 h-4 mr-2" /> Ajustar Alertas
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {GLOBAL_STATS.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md hover:shadow-lg transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <IconComp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mb-2">{stat.title}</p>
                  <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{stat.trend}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Morosidad Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Tendencia de Morosidad</h3>
                  <p className="text-xs text-muted-foreground">Últimos 6 meses (%)</p>
                </div>
                <Gauge className="w-5 h-5 text-red-400" />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={morosidadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                    formatter={(value: number) => [`${value}%`, 'Morosidad']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Ingresos vs Gastos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Ingresos vs Gastos</h3>
                  <p className="text-xs text-muted-foreground">En millones COP</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChartComposed data={ingresosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#0F7A5C" name="Ingresos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gastos" fill="#F59E0B" name="Gastos" radius={[4, 4, 0, 0]} />
                </BarChartComposed>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Occupation & Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Occupation by Condo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Ocupación por Conjunto</h3>
                  <p className="text-xs text-muted-foreground">Porcentaje de ocupación actual</p>
                </div>
                <Layers className="w-5 h-5 text-blue-400" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChartComposed data={ocupacionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#888" fontSize={11} tick={{ fill: '#888' }} />
                  <YAxis stroke="#888" fontSize={11} tick={{ fill: '#888' }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                    formatter={(value: number) => [`${value}%`, 'Ocupación']}
                  />
                  <Bar dataKey="value" fill="#0F7A5C" name="Ocupación" radius={[4, 4, 0, 0]}>
                    {ocupacionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value >= 90 ? '#10B981' : entry.value >= 80 ? '#0F7A5C' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChartComposed>
              </ResponsiveContainer>
            </motion.div>

            {/* Priority Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">Acciones Prioritarias</h3>
              <div className="space-y-3">
                {[
                  { icon: AlertCircle, color: 'bg-red-500/20 text-red-400', title: 'Morosidad crítica', desc: '3 unidades con +60 días', urgent: true },
                  { icon: Wrench, color: 'bg-amber-500/20 text-amber-400', title: 'Mantenimiento urgente', desc: 'Ascensor requiere atención', urgent: true },
                  { icon: Users, color: 'bg-blue-500/20 text-blue-400', title: 'Ocupación baja', desc: 'Conjunto B al 78%', urgent: false },
                  { icon: DollarSign, color: 'bg-purple-500/20 text-purple-400', title: 'Revisar presupuesto', desc: 'Gastos superan 85%', urgent: false },
                ].map((action, i) => {
                  const IconComp = action.icon;
                  return (
                    <div key={i} className={`p-3 rounded-xl flex items-start gap-3 ${action.color}`}>
                      <IconComp className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Admin Dashboard - Enhanced for single condo */}
      {isAdmin && tab === 'dashboard' && (
        <div className="space-y-6">
          {/* Condo Info Header - Enhanced with more details */}
          <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">Torres del Parque</h2>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Activo
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Calle 123 #45-67, Bogotá
                  </p>
                  <p className="text-xs text-muted-foreground">ID: CONDO1 • NIT: 900.123.456-7</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Tu conjunto</p>
                  <p className="text-lg font-bold text-primary">Administración</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            {/* Condo Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">120</p>
                <p className="text-xs text-muted-foreground">Unidades</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">285</p>
                <p className="text-xs text-muted-foreground">Residentes</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">145</p>
                <p className="text-xs text-muted-foreground">Vehículos</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">18</p>
                <p className="text-xs text-muted-foreground">Reservas/mes</p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Ingresos Mensuales', value: '$48M', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/20', trend: '+5%', positive: true },
              { title: 'Morosidad', value: '8%', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', trend: '-2%', positive: true },
              { title: 'Ocupación', value: '94%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20', trend: '+1%', positive: true },
              { title: 'Mantenimientos', value: '5', icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/20', trend: '2 urgentes', positive: false },
            ].map((metric, idx) => {
              const IconComp = metric.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center`}>
                      <IconComp className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <span className={`text-xs font-medium ${metric.positive ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {metric.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.title}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Tendencia de Ingresos</h3>
                  <p className="text-xs text-muted-foreground">Últimos 6 meses (en millones COP)</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={[
                  {name:'Ene',value:42},{name:'Feb',value:45},{name:'Mar',value:48},
                  {name:'Abr',value:44},{name:'May',value:52},{name:'Jun',value:55}
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} tickFormatter={(v) => `${v}M`} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                    formatter={(value: number) => [`$${value}M`, 'Ingresos']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#0F7A5C" strokeWidth={3} dot={{ fill: '#0F7A5C', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Morosity Pie */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Estado de Cartera</h3>
                  <p className="text-xs text-muted-foreground">Distribución de pagos</p>
                </div>
                <DollarSign className="w-5 h-5 text-amber-400" />
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[
                    { name: 'Al día', value: 72 },
                    { name: 'Moroso', value: 18 },
                    { name: 'En acuerdo', value: 10 }
                  ]} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" stroke="rgba(255,255,255,0.1)">
                    {['#0F7A5C', '#EF4444', '#F59E0B'].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#0D4A3E]" />
                  <span className="text-xs text-muted-foreground">72%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="text-xs text-muted-foreground">18%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="text-xs text-muted-foreground">10%</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Priority Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">Acciones Requeridas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: AlertCircle, color: 'bg-red-500/20 text-red-400', title: '3 unidades con mora >30 días', desc: 'Total: $4.2M', urgent: true },
                  { icon: Wrench, color: 'bg-amber-500/20 text-amber-400', title: '2 mantenimientos pendientes', desc: '1 de alta prioridad', urgent: true },
                  { icon: FileText, color: 'bg-blue-500/20 text-blue-400', title: '5 PQRS sin responder', desc: '2 con vencimiento próximo', urgent: false },
                  { icon: Calendar, color: 'bg-purple-500/20 text-purple-400', title: 'Asambleaa programada', desc: '15 de marzo - 2 semanas', urgent: false },
                ].map((action, i) => {
                  const IconComp = action.icon;
                  return (
                    <div key={i} className={`p-4 rounded-xl flex items-start gap-3 ${action.color}`}>
                      <IconComp className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">Resumen Rápido</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Unidades Totales</span>
                  <span className="font-bold text-foreground">120</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Residentes</span>
                  <span className="font-bold text-foreground">285</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Vehículos</span>
                  <span className="font-bold text-foreground">145</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Reservas mes</span>
                  <span className="font-bold text-foreground">18</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}


        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'Estado General', value: 'Excelente', icon: CheckCircle, color: 'text-emerald-400' },
              { title: 'Morosidad Actual', value: '8%', icon: DollarSign, color: 'text-amber-400' },
              { title: 'Ocupación', value: '96%', icon: Users, color: 'text-blue-400' },
              { title: 'Mantenimiento', value: 'Al día', icon: Wrench, color: 'text-emerald-400' },
              { title: 'Reservas', value: '12 activas', icon: Calendar, color: 'text-purple-400' },
              { title: 'Finanzas', value: 'Estables', icon: TrendingUp, color: 'text-green-400' },
            ].map((report, idx) => {
              const IconComp = report.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComp className={`w-8 h-8 ${report.color}`} />
                    <div>
                      <p className="text-sm text-foreground">{report.title}</p>
                      <p className="text-xl font-bold text-primary">{report.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resumen Ejecutivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Aspectos Positivos</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Alta ocupación del 96%</li>
                  <li>• Mantenimiento al día</li>
                  <li>• Finanzas estables</li>
                  <li>• Baja morosidad (8%)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Áreas de Atención</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitorear unidades con morosidad</li>
                  <li>• Programar mantenimiento preventivo</li>
                  <li>• Evaluar reservas de áreas comunes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Council Reports Tab */}
      {isCouncil && tab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'Estado General', value: 'Excelente', icon: CheckCircle, color: 'text-emerald-400' },
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-black/8 shadow-sm-static rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Asistente IA</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  En línea
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    m.isUser
                      ? 'bg-[#0D4A3E] text-white rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1"
                />
                <Button type="submit" className="bg-[#0D4A3E]">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-2xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Consultas Rápidas
              </h3>
              <div className="space-y-2">
                {['Estado de morosidad', 'Mantenimiento pendiente', 'Reservas esta semana', 'Informe financiero'].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(q); handleSend(); }}
                    className="w-full text-left px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-sm text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-2xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-sm text-foreground">Consultas este mes</span>
                  <span className="font-bold text-emerald-400">24</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-sm text-foreground">Acciones IA</span>
                  <span className="font-bold text-blue-400">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-sm text-foreground">Alertas generadas</span>
                  <span className="font-bold text-amber-400">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {tab === 'predictions' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: AlertCircle, value: '3', label: 'Riesgos Altos', color: 'bg-red-500/20 text-red-400' },
              { icon: TrendingUp, value: '2', label: 'Riesgos Medios', color: 'bg-amber-500/20 text-amber-400' },
              { icon: CheckCircle, value: '12', label: 'Métricas OK', color: 'bg-emerald-500/20 text-emerald-400' },
              { icon: Brain, value: '98%', label: 'Precisión IA', color: 'bg-blue-500/20 text-blue-400' },
            ].map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${stat.color.split(' ')[0]}`}>
                    <IconComp className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar predicciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Predictions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPredictions.map((p, i) => {
              const IconComp = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-2xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      p.risk === 'high' ? 'bg-red-500/20' : p.risk === 'medium' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                    }`}>
                      <IconComp className={`w-5 h-5 ${
                        p.risk === 'high' ? 'text-red-400' : p.risk === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                      }`} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRiskColor(p.risk)}`}>
                      {getRiskLabel(p.risk)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">{p.value}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Config Tab - Only for Super Admin */}
      {isSuperAdmin && tab === 'config' && (
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Configuración Global del Copiloto IA</h3>
                <p className="text-sm text-muted-foreground">Personaliza las funciones de IA para todos los conjuntos</p>
              </div>
            </div>

            <div className="space-y-4">
              {alertConfigs.map((config) => (
                <div key={config.id} className="p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        config.enabled ? 'bg-emerald-500/20' : 'bg-gray-500/20'
                      }`}>
                        {config.enabled ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAlertConfigs(prev => prev.map(c => c.id === config.id ? { ...c, enabled: !c.enabled } : c))}
                      className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 ${config.enabled ? 'bg-[#0D4A3E]' : 'bg-muted'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${config.enabled ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                  
                  {config.enabled && (
                    <div className="pl-11 space-y-3">
                      <div className="flex items-center gap-4">
                        <label className="text-xs text-muted-foreground">Umbral:</label>
                        <input 
                          type="range" 
                          min={0} 
                          max={100} 
                          value={config.threshold}
                          onChange={(e) => setAlertConfigs(prev => prev.map(c => c.id === config.id ? { ...c, threshold: parseInt(e.target.value) } : c))}
                          className="flex-1"
                        />
                        <span className="text-xs font-medium text-foreground w-8">{config.threshold}</span>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs">
                          <input 
                            type="checkbox" 
                            checked={config.notifyEmail}
                            onChange={(e) => setAlertConfigs(prev => prev.map(c => c.id === config.id ? { ...c, notifyEmail: e.target.checked } : c))}
                            className="rounded"
                          />
                          <Mail className="w-3 h-3" /> Email
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                          <input 
                            type="checkbox" 
                            checked={config.notifyPush}
                            onChange={(e) => setAlertConfigs(prev => prev.map(c => c.id === config.id ? { ...c, notifyPush: e.target.checked } : c))}
                            className="rounded"
                          />
                          <BellRing className="w-3 h-3" /> Push
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Modelo de IA Global</p>
                    <p className="text-xs text-muted-foreground">Bunty AI v2.5 - Última actualización: Feb 2026</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Actualizar
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setAlertConfigs([
                  { id: 'morosidad', label: 'Alertas de Morosidad', description: 'Notificar cuando una unidad supere X días de mora', enabled: true, threshold: 30, notifyEmail: true, notifyPush: true },
                  { id: 'mantenimiento', label: 'Predicciones de Mantenimiento', description: 'Análisis predictivo de equipos', enabled: true, threshold: 30, notifyEmail: true, notifyPush: false },
                  { id: 'ocupacion', label: 'Análisis de Ocupación', description: 'Predicciones de ocupación', enabled: true, threshold: 80, notifyEmail: false, notifyPush: true },
                  { id: 'seguridad', label: 'Alertas de Seguridad', description: 'Notificaciones de eventos inusuales', enabled: true, threshold: 1, notifyEmail: true, notifyPush: true },
                  { id: 'finanzas', label: 'Alertas Financieras', description: 'Notificaciones sobre presupuesto', enabled: true, threshold: 90, notifyEmail: true, notifyPush: false },
                ])}>
                  Restablecer
                </Button>
                <Button onClick={handleSaveAlerts} className="bg-[#0D4A3E]">
                  <Save className="w-4 h-4 mr-2" /> Guardar Cambios
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground">Exportar Análisis</h3>
                <button onClick={() => setShowExportModal(false)} className="p-1 hover:bg-muted rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Formato</label>
                  <div className="flex gap-2 mt-2">
                    {(['pdf', 'excel', 'csv'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportConfig(prev => ({ ...prev, format: fmt }))}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                          exportConfig.format === fmt 
                            ? 'bg-[#0D4A3E] text-white' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rango de Fechas</label>
                  <select 
                    value={exportConfig.dateRange}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e.target.value as ExportConfig['dateRange'] }))}
                    className="w-full mt-2 px-3 py-2 rounded-lg bg-background border border-input"
                  >
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                    <option value="quarter">Último trimestre</option>
                    <option value="year">Último año</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={exportConfig.includeCharts}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">Incluir gráficos</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={exportConfig.includePredictions}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, includePredictions: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">Incluir predicciones IA</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowExportModal(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1 bg-[#0D4A3E]" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" /> Exportar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts Modal */}
      <AnimatePresence>
        {showAlertsModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAlertsModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground">Configurar Alertas</h3>
                <button onClick={() => setShowAlertsModal(false)} className="p-1 hover:bg-muted rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Ajusta los umbrales y canales de notificación para cada tipo de alerta.
              </p>

              <div className="space-y-4 mb-6">
                {alertConfigs.map((config) => (
                  <div key={config.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{config.label}</span>
                      <button 
                        onClick={() => setAlertConfigs(prev => prev.map(c => c.id === config.id ? { ...c, enabled: !c.enabled } : c))}
                        className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 ${config.enabled ? 'bg-[#0D4A3E]' : 'bg-muted'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.enabled ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                    {config.enabled && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Umbral:</span>
                          <input 
                            type="range" 
                            min={1} 
                            max={100} 
                            value={config.threshold}
                            onChange={(e) => setAlertConfigs(prev => prev.map(c => c.id === config.id ? { ...c, threshold: parseInt(e.target.value) } : c))}
                            className="flex-1"
                          />
                          <span className="text-xs font-medium w-6">{config.threshold}</span>
                        </div>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-1 text-xs">
                            <input 
                              type="checkbox" 
                              checked={config.notifyEmail}
                              onChange={(e) => setAlertConfigs(prev => prev.map(c => c.id === config.id ? { ...c, notifyEmail: e.target.checked } : c))}
                              className="rounded"
                            />
                            <Mail className="w-3 h-3" /> Email
                          </label>
                          <label className="flex items-center gap-1 text-xs">
                            <input 
                              type="checkbox" 
                              checked={config.notifyPush}
                              onChange={(e) => setAlertConfigs(prev => prev.map(c => c.id === config.id ? { ...c, notifyPush: e.target.checked } : c))}
                              className="rounded"
                            />
                            <BellRing className="w-3 h-3" /> Push
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAlertsModal(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1 bg-[#0D4A3E]" onClick={handleSaveAlerts}>
                  <Save className="w-4 h-4 mr-2" /> Guardar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICopilotPage;

