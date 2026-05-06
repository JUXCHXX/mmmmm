import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import type { SupportTicket } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LifeBuoy, Send, ChevronDown, ChevronUp, MessageCircle, Plus, X, AlertCircle, 
  Clock, CheckCircle, Ticket, Phone, Mail, Calendar, ArrowRight, Eye, MessageSquare, 
  Bell, Clock3, FileText, Download, BookOpen, Shield, TrendingUp, Search, 
  Filter, MoreVertical, User, Building2, Globe, MapPin, Clock10, Check, XCircle,
  AlertTriangle, Info, HelpCircle, Database, EyeOff, RotateCcw, SendHorizontal
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Types
type TabId = 'tickets' | 'faq' | 'knowledge' | 'audit' | 'contact';

type TicketCategory = 'technical' | 'billing' | 'general' | 'security';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'knowledge', label: 'Base de Conocimiento', icon: BookOpen },
  { id: 'audit', label: 'Auditoría', icon: Shield },
  { id: 'contact', label: 'Contacto', icon: Phone },
];

// FAQs
const FAQS = [
  { 
    q: '¿Cómo puedo pagar mi cuota de administración?', 
    a: 'Puedes pagar desde la sección "Pagos y Cartera". Selecciona tu unidad y haz clic en "Pagar". Aceptamos transferencias bancarias, tarjetas de crédito y PSE.' 
  },
  { 
    q: '¿Cómo reservo un área común?', 
    a: 'Ingresa a "Reservas de Áreas Comunes", selecciona el área y horario deseado. La reserva debe ser aprobada por la portería.' 
  },
  { 
    q: '¿Cómo radico una PQRS?', 
    a: 'En la sección "PQRS" haz clic en "Nueva solicitud". Llena el formulario con la categoría, descripción y prioridad de tu solicitud.' 
  },
  { 
    q: '¿Cómo actualizo mis datos personales?', 
    a: 'Puedes solicitar la actualización de datos a través del módulo de Soporte o contactando directamente a la administración.' 
  },
  { 
    q: '¿Qué hago si olvidé mi contraseña?', 
    a: 'En la pantalla de inicio de sesión, haz clic en "Olvidaste tu contraseña?" e ingresa tu correo electrónico para recibir las instrucciones de recuperación.' 
  },
  { 
    q: '¿Cómo configuro las notificaciones?', 
    a: 'Ve a Configuración > Notificaciones y activa los canales de tu preferencia: correo electrónico, push o SMS.' 
  },
  { 
    q: '¿Cómo puedo ver los reportes financieros?', 
    a: 'Accede a Contabilidad > Reportes para generar estados de cuenta, presupuestos y análisis de cartera.' 
  },
];

// Knowledge Base Articles
const KNOWLEDGE_ARTICLES = [
  { id: 1, title: 'Guía de Inicio Rápido', category: 'Guías', summary: 'Cómo configurar su primer conjunto en Bunty paso a paso.', icon: BookOpen, color: 'from-blue-500 to-cyan-500', views: 1250 },
  { id: 2, title: 'Administración de Roles', category: 'Guías', summary: 'Descripción de los diferentes roles y permisos disponibles.', icon: Shield, color: 'from-purple-500 to-pink-500', views: 890 },
  { id: 3, title: 'Resolución de Problemas Comunes', category: 'Soporte', summary: 'Consejos para solucionar errores frecuentes reportados por usuarios.', icon: AlertCircle, color: 'from-amber-500 to-orange-500', views: 720 },
  { id: 4, title: 'Configuración de Notificaciones', category: 'Guías', summary: 'Personalice las alertas y correos que reciben los residentes.', icon: Bell, color: 'from-pink-500 to-rose-500', views: 560 },
  { id: 5, title: 'Gestión de Finanzas', category: 'Soporte', summary: 'Cómo administrar presupuestos y cartera del conjunto.', icon: TrendingUp, color: 'from-emerald-500 to-teal-500', views: 680 },
  { id: 6, title: 'Políticas de Privacidad', category: 'Legales', summary: 'Términos y condiciones de uso de la plataforma Bunty.', icon: FileText, color: 'from-red-500 to-pink-500', views: 420 },
  { id: 7, title: 'Integración con Pasarelas de Pago', category: 'Técnico', summary: 'Configura Stripe, PayU u otras pasarelas de pago.', icon: Globe, color: 'from-indigo-500 to-blue-500', views: 340 },
  { id: 8, title: 'API Documentation', category: 'Técnico', summary: 'Documentación completa de la API de Bunty.', icon: Database, color: 'from-cyan-500 to-blue-500', views: 280 },
];

// Audit Logs Sample
const AUDIT_LOGS = [
  { id: 1, date: '2026-03-04 14:32:15', user: 'admin@bunty.com', action: 'Inicio de sesión', resource: 'Panel de control', ip: '192.168.1.100', severity: 'info' },
  { id: 2, date: '2026-03-04 14:15:42', user: 'super@bunty.com', action: 'Creó nuevo usuario', resource: 'Administrador Conjunto A', ip: '192.168.1.105', severity: 'info' },
  { id: 3, date: '2026-03-04 13:20:18', user: 'admin@torres.com', action: 'Modificó configuración', resource: 'Parámetros de Reservas', ip: '192.168.1.110', severity: 'warning' },
  { id: 4, date: '2026-03-03 18:45:33', user: 'super@bunty.com', action: 'Exportó datos', resource: 'Cartera de Morosidad', ip: '192.168.1.105', severity: 'info' },
  { id: 5, date: '2026-03-03 16:10:07', user: 'admin@bunty.com', action: 'Eliminó usuario', resource: 'Portero Temporal', ip: '192.168.1.100', severity: 'critical' },
  { id: 6, date: '2026-03-03 15:30:22', user: 'admin@paraiso.com', action: 'Actualizó presupuesto', resource: 'Presupuesto Mensual', ip: '192.168.1.115', severity: 'info' },
  { id: 7, date: '2026-03-03 12:15:45', user: 'super@bunty.com', action: 'Creó conjunto', resource: 'Conjunto Nuevo', ip: '192.168.1.105', severity: 'info' },
  { id: 8, date: '2026-03-02 17:22:11', user: 'admin@bunty.com', action: 'Falló inicio de sesión', resource: 'Autenticación', ip: '10.0.0.55', severity: 'critical' },
];

// Sample tickets data
const SAMPLE_TICKETS: SupportTicket[] = [
  { id: 'ST001', subject: 'Error en pagos con PSE', description: 'Los pagos realizados con PSE no se están procesando correctamente', status: 'open', priority: 'high', date: '2026-03-04T10:30:00Z', category: 'technical' },
  { id: 'ST002', subject: 'Solicitud de reporte mensual', description: 'Necesito el reporte financiero del mes de febrero', status: 'in_progress', priority: 'medium', date: '2026-03-03T14:20:00Z', category: 'billing' },
  { id: 'ST003', subject: 'Usuario no puede iniciar sesión', description: 'Un residente报告显示 error al intentar acceder', status: 'resolved', priority: 'low', date: '2026-03-02T09:15:00Z', category: 'technical' },
  { id: 'ST004', subject: 'Duda sobre configuración', description: '¿Cómo activo las notificaciones por SMS?', status: 'closed', priority: 'low', date: '2026-03-01T16:45:00Z', category: 'general' },
];

const STATUS_MAP: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  open: { label: 'Abierto', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: AlertCircle },
  in_progress: { label: 'En Proceso', class: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
  resolved: { label: 'Resuelto', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
  closed: { label: 'Cerrado', class: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: CheckCircle },
};

const PRIORITY_MAP: Record<string, { label: string; class: string }> = {
  low: { label: 'Baja', class: 'text-emerald-400 bg-emerald-500/20' },
  medium: { label: 'Media', class: 'text-amber-400 bg-amber-500/20' },
  high: { label: 'Alta', class: 'text-orange-400 bg-orange-500/20' },
};

const CATEGORY_MAP: Record<string, { label: string; class: string }> = {
  technical: { label: 'Técnico', class: 'bg-purple-500/20 text-purple-400' },
  billing: { label: 'Facturación', class: 'bg-blue-500/20 text-blue-400' },
  general: { label: 'General', class: 'bg-gray-500/20 text-gray-400' },
  security: { label: 'Seguridad', class: 'bg-red-500/20 text-red-400' },
};

const SEVERITY_MAP: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  info: { label: 'Info', class: 'text-blue-400 bg-blue-500/20', icon: Info },
  warning: { label: 'Warning', class: 'text-amber-400 bg-amber-500/20', icon: AlertTriangle },
  critical: { label: 'Critical', class: 'text-red-400 bg-red-500/20', icon: XCircle },
};

const SupportPage = () => {
  const { supportTickets: storeTickets, addSupportTicket, condos } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.roleId === 'super_admin';
  const isAdmin = user?.roleId === 'admin';

  const [activeTab, setActiveTab] = useState<TabId>('tickets');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ subject: string; description: string; priority: 'low' | 'medium' | 'high'; category: TicketCategory }>({ subject: '', description: '', priority: 'medium', category: 'general' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Combine sample tickets with store tickets
  const allTickets = [...SAMPLE_TICKETS, ...storeTickets];

  const filteredTickets = allTickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.description) {
      toast({ title: 'Error', description: 'Por favor complete todos los campos', variant: 'destructive' });
      return;
    }
    addSupportTicket({
      id: `ST${Date.now()}`,
      subject: form.subject,
      description: form.description,
      status: 'open',
      priority: form.priority,
      date: new Date().toISOString(),
      category: form.category,
    });
    toast({ title: 'Ticket creado', description: 'Su solicitud ha sido registrada exitosamente' });
    setForm({ subject: '', description: '', priority: 'medium', category: 'general' });
    setShowForm(false);
  };

  // Stats for Super Admin
  const stats = {
    total: allTickets.length,
    open: allTickets.filter(t => t.status === 'open').length,
    inProgress: allTickets.filter(t => t.status === 'in_progress').length,
    resolved: allTickets.filter(t => t.status === 'resolved').length,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tickets':
        return <TicketsTab 
          tickets={filteredTickets} 
          showForm={showForm} 
          setShowForm={setShowForm} 
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          isSuperAdmin={isSuperAdmin}
          stats={stats}
        />;
      case 'faq':
        return <FAQTab faqs={FAQS} expanded={expandedFaq} setExpanded={setExpandedFaq} />;
      case 'knowledge':
        return <KnowledgeTab articles={KNOWLEDGE_ARTICLES} />;
      case 'audit':
        return <AuditTab logs={AUDIT_LOGS} />;
      case 'contact':
        return <ContactTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0D2B4E] via-[#1A4A7A] to-[#1E7EC8] text-white">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <LifeBuoy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Centro de Soporte</h1>
              <p className="text-white/80 text-sm md:text-base">
                {isSuperAdmin ? 'Gestión integral de tickets, FAQs y auditoría' : 'Ayuda, recursos y soporte técnico'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs with modern design */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap relative group ${
                    activeTab === tab.id
                      ? 'bg-white text-[#0D2B4E] font-semibold shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E7EC8] to-[#00B5A0] rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
    </div>
  );
};

// Tickets Tab Component
const TicketsTab = ({ 
  tickets, showForm, setShowForm, form, setForm, handleSubmit, 
  searchTerm, setSearchTerm, filterStatus, setFilterStatus, isSuperAdmin, stats 
}: any) => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Stats for Super Admin */}
      {isSuperAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Tickets', value: stats.total, icon: Ticket, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
            { label: 'Abiertos', value: stats.open, icon: AlertCircle, color: 'from-red-500 to-orange-500', bg: 'bg-red-50' },
            { label: 'En Proceso', value: stats.inProgress, icon: Clock3, color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50' },
            { label: 'Resueltos', value: stats.resolved, icon: CheckCircle, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.bg} rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#0D2B4E]">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por asunto o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-[#1E7EC8] focus:ring-[#1E7EC8]/20"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-[#0D2B4E] hover:border-gray-300 transition-colors"
          >
            <option value="all">Todos</option>
            <option value="open">Abiertos</option>
            <option value="in_progress">En Proceso</option>
            <option value="resolved">Resueltos</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#1E7EC8] hover:bg-[#1A5FA0] text-white w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Nuevo Ticket
          </Button>
        </motion.div>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E7EC8]/20 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-[#1E7EC8]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0D2B4E]">Crear Nuevo Ticket de Soporte</h3>
                <p className="text-xs text-gray-500">Describe tu problema para que podamos ayudarte</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="support-ticket-subject" className="text-sm font-semibold text-[#0D2B4E]">Asunto *</label>
                <Input
                  id="support-ticket-subject"
                  value={form.subject}
                  onChange={(e) => setForm({...form, subject: e.target.value})}
                  placeholder="Ej: Error al pagar con PSE"
                  required
                  className="bg-[#F4F7FB] border-gray-200 focus:border-[#1E7EC8] focus:ring-[#1E7EC8]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0D2B4E]">Categoría *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value as TicketCategory})}
                  className="w-full px-3 py-2 rounded-lg bg-[#F4F7FB] border border-gray-200 text-sm text-[#0D2B4E] font-medium hover:border-gray-300 focus:border-[#1E7EC8] focus:ring-[#1E7EC8]/20 transition-colors"
                >
                  <option value="general">General</option>
                  <option value="technical">Técnico</option>
                  <option value="billing">Facturación</option>
                  <option value="security">Seguridad</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0D2B4E]">Descripción Detallada *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                placeholder="Proporciona toda la información que puedas sobre el problema..."
                className="w-full px-3 py-2 rounded-lg bg-[#F4F7FB] border border-gray-200 text-sm text-foreground placeholder:text-gray-400 focus:border-[#1E7EC8] focus:ring-[#1E7EC8]/20 resize-none"
                rows={5}
                required
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-[#0D2B4E] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#1E7EC8] text-white font-medium hover:bg-[#1A5FA0] transition-colors flex items-center gap-2"
              >
                <SendHorizontal className="w-4 h-4" /> Crear Ticket
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {tickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm"
            >
              <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No se encontraron tickets</p>
              <p className="text-sm text-gray-400 mt-1">Crea un nuevo ticket para comenzar</p>
            </motion.div>
          ) : (
            tickets.map((ticket: any, idx) => {
              const statusInfo = STATUS_MAP[ticket.status] || STATUS_MAP.open;
              const priorityInfo = PRIORITY_MAP[ticket.priority] || PRIORITY_MAP.low;
              const categoryInfo = CATEGORY_MAP[ticket.category] || CATEGORY_MAP.general;

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2, shadow: 'md' }}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                    selectedTicket?.id === ticket.id
                      ? 'border-[#1E7EC8] shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{ticket.id}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo.class}`}>
                          {priorityInfo.label}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryInfo.class}`}>
                          {categoryInfo.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#0D2B4E] truncate mb-1">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${statusInfo.class}`}>
                        <statusInfo.icon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(ticket.date).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Ticket Detail Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 h-fit sticky top-6"
        >
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                  {selectedTicket.id}
                </span>
                <h3 className="font-bold text-lg text-[#0D2B4E] mt-2">{selectedTicket.subject}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${PRIORITY_MAP[selectedTicket.priority]?.class || ''}`}>
                  {PRIORITY_MAP[selectedTicket.priority]?.label || 'Baja'}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${CATEGORY_MAP[selectedTicket.category]?.class || ''}`}>
                  {CATEGORY_MAP[selectedTicket.category]?.label || 'General'}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#F4F7FB] border border-gray-200">
                <p className="text-sm text-[#0D2B4E] leading-relaxed">{selectedTicket.description}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Creado:</span>
                  <span className="font-medium text-[#0D2B4E]">
                    {new Date(selectedTicket.date).toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${STATUS_MAP[selectedTicket.status]?.class}`}>
                    {STATUS_MAP[selectedTicket.status]?.label}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#1E7EC8] text-white font-medium text-sm hover:bg-[#1A5FA0] transition-colors"
                >
                  Responder
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[#0D2B4E] font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-600 font-medium">Selecciona un ticket</p>
              <p className="text-xs text-gray-400 mt-1">Para ver los detalles</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// FAQ Tab Component
const FAQTab = ({ faqs, expanded, setExpanded }: { faqs: any[]; expanded: number | null; setExpanded: (i: number | null) => void }) => {
  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-border overflow-hidden"
        >
          <button
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <span className="font-medium text-foreground">{faq.q}</span>
            {expanded === idx ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
          </button>
          <AnimatePresence>
            {expanded === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// Knowledge Base Tab Component
const KnowledgeTab = ({ articles }: { articles: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(articles.map(a => a.category))];

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar artículos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Todos' : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article, idx) => {
          const Icon = article.icon;
          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-border hover:border-[#1E7EC8]/30 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-muted-foreground">{article.category}</span>
              <h3 className="font-semibold text-foreground mt-1 group-hover:text-[#1E7EC8] transition-colors">{article.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.summary}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span>{article.views} vistas</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Audit Tab Component
const AuditTab = ({ logs }: { logs: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const severityCounts = {
    info: logs.filter(l => l.severity === 'info').length,
    warning: logs.filter(l => l.severity === 'warning').length,
    critical: logs.filter(l => l.severity === 'critical').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{severityCounts.info}</p>
              <p className="text-xs text-muted-foreground">Info</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{severityCounts.warning}</p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{severityCounts.critical}</p>
              <p className="text-xs text-muted-foreground">Críticos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-2 rounded-lg bg-background border border-input text-sm"
        >
          <option value="all">Todas las severidades</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Exportar
        </Button>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Usuario</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acción</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Recurso</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">IP</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Severidad</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => {
                const severityInfo = SEVERITY_MAP[log.severity] || SEVERITY_MAP.info;
                const SeverityIcon = severityInfo.icon;
                
                return (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <td className="p-4 text-sm text-muted-foreground font-mono">{log.date}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{log.user}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground">{log.action}</td>
                    <td className="p-4 text-sm text-muted-foreground">{log.resource}</td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{log.ip}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 justify-center ${severityInfo.class}`}>
                        <SeverityIcon className="w-3 h-3" />
                        {severityInfo.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Contact Tab Component
const ContactTab = () => {
  return (
    <div className="space-y-6">
      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Mail,
            title: 'Correo Electrónico',
            desc: 'Nuestro equipo responde en 24 horas',
            contact: 'soporte@bunty.com',
            link: 'mailto:soporte@bunty.com',
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
          },
          {
            icon: Phone,
            title: 'Teléfono',
            desc: 'Lun-Vie: 8am - 6pm',
            contact: '+57 300 123 4567',
            link: 'tel:+573001234567',
            color: 'from-emerald-500 to-green-500',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
          },
          {
            icon: MessageSquare,
            title: 'Chat en Vivo',
            desc: 'Disponible 24/7 emergencias',
            contact: 'Iniciar sesión',
            link: '#',
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            isButton: true,
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`${item.bg} rounded-xl p-6 border-2 ${item.border} shadow-sm hover:shadow-lg transition-all`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-[#0D2B4E] mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
              {item.isButton ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:shadow-md transition-all"
                >
                  Iniciar Chat
                </motion.button>
              ) : (
                <a
                  href={item.link}
                  className="text-[#1E7EC8] hover:text-[#1A5FA0] underline font-semibold text-sm transition-colors"
                >
                  {item.contact} →
                </a>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Office Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D2B4E] to-[#1E7EC8] flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#0D2B4E]">Oficina Principal</h3>
            <p className="text-sm text-gray-600">Visítanos en nuestras oficinas</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 text-[#1E7EC8] mt-1 shrink-0" />
          <div>
            <p className="font-medium text-[#0D2B4E]">Dirección</p>
            <p className="text-gray-600 mt-1">Carrera 15 # 78-34</p>
            <p className="text-gray-600">Bogotá, Colombia</p>
          </div>
        </div>
      </motion.div>

      {/* Business Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <Clock10 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#0D2B4E]">Horario de Atención</h3>
            <p className="text-sm text-gray-600">Horarios disponibles para soporte</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { day: 'Lunes - Viernes', hours: '8:00 AM - 6:00 PM', icon: Calendar },
            { day: 'Sábados', hours: '9:00 AM - 1:00 PM', icon: Clock3 },
            { day: 'Domingos', hours: 'Cerrado', icon: XCircle, disabled: true },
            { day: 'Emergencias 24/7', hours: 'Chat y Llamada', icon: AlertTriangle, highlight: true },
          ].map((schedule, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border-2 ${
                schedule.highlight
                  ? 'bg-emerald-50 border-emerald-300'
                  : schedule.disabled
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-[#F4F7FB] border-gray-200'
              }`}
            >
              <schedule.icon className={`h-6 w-6 mb-2 ${schedule.highlight ? 'text-emerald-600' : schedule.disabled ? 'text-gray-400' : 'text-[#1E7EC8]'}`} />
              <p className={`font-bold text-sm ${schedule.highlight ? 'text-emerald-700' : 'text-[#0D2B4E]'}`}>
                {schedule.day}
              </p>
              <p className="text-xs text-gray-600 mt-1">{schedule.hours}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SupportPage;
