import { useState, useMemo, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { getRandomUnitImage } from '@/utils/images';
import { toast } from '@/hooks/use-toast';
import { 
  Home, User, Users, CreditCard, MessageSquare, FileText, DollarSign, 
  Building2, Phone, Mail, ChevronRight, Plus, Eye, Settings, 
  TrendingUp, AlertCircle, CheckCircle, Clock, Wallet, PiggyBank,
  BarChart3, PieChart, Activity, Calculator, Bell, MessageCircle,
  Building, MapPin, Calendar, ChevronDown, X, Send, Upload, Image,
  FileText as FileIcon, AlertTriangle, Info, CheckSquare, ClipboardList,
  Lightbulb, Zap, Paperclip, Signature
} from 'lucide-react';
import { AIFinancialAnalyzer } from '@/components/AIFinancialAnalyzer';
import { EnhancedPaymentModal } from '@/components/EnhancedPaymentModal';

// Tipos para el arrendatario
interface TenantPayment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface Neighbor {
  id: string;
  unit: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'owner' | 'tenant';
}

interface PQRSEntry {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  priority: string;
  category: string;
  urgency: string;
  attachments: string[];
  signed: boolean;
  signedAt?: string;
  createdDate: Date;
}

// Formulario PQRS
interface PQRSType {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
}

const PQRS_TYPES: PQRSType[] = [
  { 
    value: 'peticion', 
    label: 'Petición', 
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Solicitud formal de un servicio o información',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  { 
    value: 'queja', 
    label: 'Queja', 
    icon: <AlertCircle className="w-5 h-5" />,
    description: 'Expresión de inconformidad por un servicio o situación',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  { 
    value: 'reclamo', 
    label: 'Reclamo', 
    icon: <Zap className="w-5 h-5" />,
    description: 'Solicitud de solución a una situación problemática',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
  { 
    value: 'sugerencia', 
    label: 'Sugerencia', 
    icon: <Lightbulb className="w-5 h-5" />,
    description: 'Propuesta de mejora para el conjunto',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
  },
];

const CATEGORIES = [
  { value: 'administracion', label: 'Administración' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'convivencia', label: 'Convivencia' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'areas_comunes', label: 'Áreas Comunes' },
  { value: 'servicios', label: 'Servicios Públicos' },
  { value: 'estacionamiento', label: 'Estacionamiento' },
  { value: 'otro', label: 'Otro' },
];

const PRIORITIES = [
  { value: 'baja', label: 'Baja', color: 'bg-green-100 border-green-300 text-green-700', textColor: 'text-green-600' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 border-blue-300 text-blue-700', textColor: 'text-blue-600' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 border-orange-300 text-orange-700', textColor: 'text-orange-600' },
  { value: 'urgente', label: 'Urgente', color: 'bg-red-100 border-red-300 text-red-700', textColor: 'text-red-600' },
];

const PropertiesPage = () => {
  const user = useAuthStore((s) => s.user);
  const { properties, condos } = useAppStore();
  
  // Obtener la unidad del arrendatario
  const userUnit = useMemo(() => {
    if (!user) return null;
    if (user.roleId === 'arrendatario' && user.unitId) {
      return properties.find(p => p.id === user.unitId);
    }
    return null;
  }, [user, properties]);

  // Obtener el conjunto
  const condo = useMemo(() => {
    return user?.condoId ? condos.find(c => c.id === user.condoId) : condos[0];
  }, [user, condos]);

  // Estado para modales
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'pqrs' | 'neighbors'>('overview');
  
  // Estado para nuevo PQRS
  const [showNewPQRS, setShowNewPQRS] = useState(false);
  const [pqrsForm, setPqrsForm] = useState({
    type: 'peticion',
    title: '',
    description: '',
    priority: 'normal',
    category: 'mantenimiento',
    urgency: 'media',
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSigned, setIsSigned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pqrsList, setPqrsList] = useState<PQRSEntry[]>([
    { id: '1', title: 'Solicitud de reparación del timbre', type: 'peticion', status: 'pendiente', description: 'El timbre de la puerta no funciona correctamente', priority: 'alta', category: 'mantenimiento', urgency: 'media', attachments: [], signed: true, signedAt: '2024-04-01', createdDate: new Date('2024-04-01') },
    { id: '2', title: 'Ruido excesivo en horario nocturne', type: 'queja', status: 'completado', description: 'Se resolvió el problema de ruido con los vecinos', priority: 'normal', category: 'convivencia', urgency: 'baja', attachments: [], signed: true, signedAt: '2024-03-15', createdDate: new Date('2024-03-15') },
  ]);

  // Datos de ejemplo para historial de pagos
  const paymentHistory: TenantPayment[] = [
    { id: '1', date: '2024-01-15', amount: 850000, status: 'paid', description: 'Enero 2024' },
    { id: '2', date: '2024-02-15', amount: 850000, status: 'paid', description: 'Febrero 2024' },
    { id: '3', date: '2024-03-15', amount: 850000, status: 'paid', description: 'Marzo 2024' },
    { id: '4', date: '2024-04-15', amount: 850000, status: 'pending', description: 'Abril 2024' },
  ];

  // Datos de ejemplo para directorio de vecinos
  const neighbors: Neighbor[] = [
    { id: '1', unit: '101', name: 'Carlos García', phone: '3001234567', email: 'carlos@email.com', role: 'owner' },
    { id: '2', unit: '102', name: 'María López', phone: '3002345678', email: 'maria@email.com', role: 'tenant' },
    { id: '3', unit: '103', name: 'Juan Pérez', phone: '3003456789', email: 'juan@email.com', role: 'owner' },
    { id: '4', unit: '104', name: 'Ana Martínez', phone: '3004567890', email: 'ana@email.com', role: 'tenant' },
    { id: '5', unit: '105', name: 'Luis Rodríguez', role: 'owner' },
  ];

  // Calcular estado de cuenta
  const accountStatus = useMemo(() => {
    const pending = paymentHistory.filter(p => p.status === 'pending' || p.status === 'overdue');
    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
    return {
      pending: pending.length,
      total: totalPending,
      isOverdue: pending.some(p => p.status === 'overdue')
    };
  }, [paymentHistory]);

  // Manejar adjuntos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => URL.createObjectURL(file));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Manejar envío de nuevo PQRS
  const handleSubmitPQRS = () => {
    if (!pqrsForm.title || !pqrsForm.description) {
      toast({ title: 'Por favor completa todos los campos requeridos', variant: 'destructive' });
      return;
    }
    
    const newPQRS: PQRSEntry = {
      id: String(Date.now()),
      title: pqrsForm.title,
      type: pqrsForm.type,
      status: 'pendiente',
      description: pqrsForm.description,
      priority: pqrsForm.priority,
      category: pqrsForm.category,
      urgency: pqrsForm.urgency,
      attachments: attachments,
      signed: isSigned,
      signedAt: isSigned ? new Date().toISOString() : undefined,
      createdDate: new Date()
    };
    
    setPqrsList([newPQRS, ...pqrsList]);
    setShowNewPQRS(false);
    setPqrsForm({ type: 'peticion', title: '', description: '', priority: 'normal', category: 'mantenimiento', urgency: 'media' });
    setAttachments([]);
    setIsSigned(false);
    toast({ title: 'Tu solicitud ha sido enviada correctamente', description: 'Recibirás una notificación cuando sea procesada' });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header con imagen de la propiedad */}
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
        <img
          src={userUnit?.image || getRandomUnitImage(userUnit?.id || user.id)}
          alt={userUnit?.unit || 'Mi Departamento'}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = getRandomUnitImage(userUnit?.id || 'default'); }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Building2 className="w-4 h-4" />
            <span>{condo?.name || 'Conjunto Residencial'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Mi Propiedad
          </h1>
          <p className="text-white/90 text-lg">
            {userUnit ? `Apartamento ${userUnit.unit} - Torre ${userUnit.tower}` : 'Sin unidad asignada'}
          </p>
        </div>
      </div>

      {/* Información de la propiedad */}
      {userUnit && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Home className="w-3 h-3" />
              <span>Tipo</span>
            </div>
            <p className="font-semibold text-foreground capitalize">{userUnit.type}</p>
          </div>
          <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
              <span>Área</span>
            </div>
            <p className="font-semibold text-foreground">{userUnit.area} m²</p>
          </div>
          <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <User className="w-3 h-3" />
              <span>Propietario</span>
            </div>
            <p className="font-semibold text-foreground truncate">{userUnit.owner || 'N/A'}</p>
          </div>
          <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              <span>Cuota Mensual</span>
            </div>
            <p className="font-semibold text-foreground">$850.000</p>
          </div>
        </div>
      )}

      {/* Estado de cuenta Alerts */}
      {accountStatus.pending > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            accountStatus.isOverdue 
              ? 'bg-red-500/10 border-red-500/30' 
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className={`w-5 h-5 ${accountStatus.isOverdue ? 'text-red-500' : 'text-amber-500'}`} />
              <div>
                <p className="font-semibold text-foreground">
                  {accountStatus.isOverdue ? 'Tienes pagos vencidos' : 'Tienes pagos pendientes'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: ${accountStatus.total.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Pagar Ahora
            </button>
          </div>
        </motion.div>
      )}

      {/* Tabs de navegación */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Resumen', icon: BarChart3 },
          { id: 'payments', label: 'Pagos', icon: CreditCard },
          { id: 'pqrs', label: 'PQRS', icon: ClipboardList },
          { id: 'neighbors', label: 'Vecinos', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'payments' | 'pqrs' | 'neighbors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido según el tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Acciones rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="font-semibold text-foreground">Realizar Pago</p>
              <p className="text-xs text-muted-foreground">Paga tu cuota mensual</p>
            </button>

            <button
              onClick={() => setActiveTab('pqrs')}
              className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <p className="font-semibold text-foreground">Crear PQRS</p>
              <p className="text-xs text-muted-foreground">Solicitudes o reclamos</p>
            </button>

            <button
              onClick={() => setShowAIModal(true)}
              className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5 text-violet-500" />
              </div>
              <p className="font-semibold text-foreground">Asesoría IA</p>
              <p className="text-xs text-muted-foreground">Gestión financiera</p>
            </button>

            <button
              onClick={() => setActiveTab('neighbors')}
              className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-amber-500" />
              </div>
              <p className="font-semibold text-foreground">Directorio</p>
              <p className="text-xs text-muted-foreground">Contacta vecinos</p>
            </button>
          </div>

          {/* Resumen financiero */}
          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resumen Financiero</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Pagado (Año)</p>
                <p className="text-xl font-bold text-emerald-500">$8.550.000</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Promedio Mensual</p>
                <p className="text-xl font-bold text-foreground">$850.000</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Pagos Realizados</p>
                <p className="text-xl font-bold text-foreground">3</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Próximo Vencimiento</p>
                <p className="text-xl font-bold text-foreground">15 May</p>
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
            <h2 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h2>
            <div className="space-y-3">
              {[
                { icon: CheckCircle, color: 'text-emerald-500', title: 'Pago confirmado', desc: 'Enero 2024 - $850.000', time: 'Hace 15 días' },
                { icon: MessageSquare, color: 'text-blue-500', title: 'Respuesta a PQRS', desc: 'Tu solicitud fue atendida', time: 'Hace 20 días' },
                { icon: CreditCard, color: 'text-amber-500', title: 'Pago registrado', desc: 'Febrero 2024 - $850.000', time: 'Hace 45 días' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.desc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab de Pagos */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Estado de Cuenta</h2>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Nuevo Pago
              </button>
            </div>

            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div 
                  key={payment.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    payment.status === 'paid' 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : payment.status === 'pending'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'paid' 
                        ? 'bg-emerald-500/20' 
                        : payment.status === 'pending'
                        ? 'bg-amber-500/20'
                        : 'bg-red-500/20'
                    }`}>
                      {payment.status === 'paid' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : payment.status === 'pending' ? (
                        <Clock className="w-5 h-5 text-amber-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${payment.amount.toLocaleString()}</p>
                    <p className={`text-sm ${
                      payment.status === 'paid' 
                        ? 'text-emerald-500' 
                        : payment.status === 'pending'
                        ? 'text-amber-500'
                        : 'text-red-500'
                    }`}>
                      {payment.status === 'paid' ? 'Pagado' : payment.status === 'pending' ? 'Pendiente' : 'Vencido'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab de PQRS */}
      {activeTab === 'pqrs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Mis PQRS</h2>
              <button
                onClick={() => setShowNewPQRS(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Nueva Solicitud
              </button>
            </div>

            {/* Formulario nuevo PQRS completo */}
            {showNewPQRS && (
              <div className="mb-6 p-6 bg-muted/30 rounded-xl border border-border space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-foreground">Nueva Solicitud PQRS</h3>
                  <button onClick={() => setShowNewPQRS(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tipo de solicitud */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Tipo de Solicitud</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PQRS_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setPqrsForm({ ...pqrsForm, type: type.value })}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          pqrsForm.type === type.value
                            ? `${type.bgColor} border-current`
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`flex items-center gap-2 mb-1 ${type.color}`}>
                          {type.icon}
                        </div>
                        <p className={`font-medium text-sm ${type.color}`}>{type.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Título y Categoría */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Título</label>
                    <input
                      type="text"
                      value={pqrsForm.title}
                      onChange={(e) => setPqrsForm({ ...pqrsForm, title: e.target.value })}
                      placeholder="Breve descripción del tema"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Categoría</label>
                    <select
                      value={pqrsForm.category}
                      onChange={(e) => setPqrsForm({ ...pqrsForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Prioridad y Urgencia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Prioridad</label>
                    <div className="grid grid-cols-4 gap-2">
                      {PRIORITIES.map((priority) => (
                        <button
                          key={priority.value}
                          onClick={() => setPqrsForm({ ...pqrsForm, priority: priority.value })}
                          className={`p-2 rounded-lg border-2 transition-all text-center ${
                            pqrsForm.priority === priority.value
                              ? priority.color
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-medium text-xs">{priority.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Nivel de Urgencia</label>
                    <select
                      value={pqrsForm.urgency}
                      onChange={(e) => setPqrsForm({ ...pqrsForm, urgency: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    >
                      <option value="baja">Baja - Sin urgencia</option>
                      <option value="media">Media - Requiere atención</option>
                      <option value="alta">Alta - Requiere atención pronto</option>
                      <option value="critica">Crítica - Requiere atención inmediata</option>
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Descripción Detallada</label>
                  <textarea
                    value={pqrsForm.description}
                    onChange={(e) => setPqrsForm({ ...pqrsForm, description: e.target.value })}
                    placeholder="Describe detalladamente tu solicitud, incluye fechas, lugares, personas involucradas y cualquier información relevante..."
                    rows={5}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg resize-none"
                  />
                </div>

                {/* Adjuntos - Fotos */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Evidencias Fotográficas</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Paperclip className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Haz clic para subir fotos o arrástralas aquí</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG hasta 10MB cada una</p>
                  </div>
                  
                  {/* Preview de adjuntos */}
                  {attachments.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {attachments.map((url, index) => (
                        <div key={index} className="relative group">
                          <img src={url} alt={`Evidencia ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                          <button
                            onClick={() => removeAttachment(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Firma Electrónica */}
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="firma"
                      checked={isSigned}
                      onChange={(e) => setIsSigned(e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="firma" className="font-medium text-foreground cursor-pointer flex items-center gap-2">
                        <Signature className="w-4 h-4" />
                        Firma Electrónica
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Al marcar esta opción, certifico que la información proporcionada es verdadera y autorizo a administración a contactarme para dar seguimiento a esta solicitud.
                      </p>
                      {isSigned && (
                        <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Firma electrónica aplicada el {new Date().toLocaleDateString('es-CO')} a las {new Date().toLocaleTimeString('es-CO')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Información de Contacto</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Unidad:</p>
                      <p className="font-medium text-foreground">{userUnit?.unit || 'N/A'} - {userUnit?.tower || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contacto:</p>
                      <p className="font-medium text-foreground">{user?.name || 'Usuario'}</p>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitPQRS}
                    disabled={!pqrsForm.title || !pqrsForm.description || !isSigned}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Solicitud
                  </button>
                  <button
                    onClick={() => setShowNewPQRS(false)}
                    className="px-6 py-3 border border-border rounded-lg hover:bg-muted"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Lista de PQRS */}
            <div className="space-y-3">
              {pqrsList.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tienes PQRS registradas</p>
              ) : (
                pqrsList.map((pqrs) => (
                  <div key={pqrs.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          pqrs.type === 'peticion' ? 'bg-blue-500/20 text-blue-400' :
                          pqrs.type === 'queja' ? 'bg-amber-500/20 text-amber-400' :
                          pqrs.type === 'reclamo' ? 'bg-red-500/20 text-red-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {pqrs.type.charAt(0).toUpperCase() + pqrs.type.slice(1)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          pqrs.priority === 'urgente' ? 'bg-red-500/20 text-red-400' :
                          pqrs.priority === 'alta' ? 'bg-orange-500/20 text-orange-400' :
                          pqrs.priority === 'normal' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          Prioridad: {pqrs.priority.charAt(0).toUpperCase() + pqrs.priority.slice(1)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          pqrs.status === 'pendiente' ? 'bg-amber-500/20 text-amber-400' :
                          pqrs.status === 'completado' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {pqrs.status.charAt(0).toUpperCase() + pqrs.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {pqrs.signed && (
                          <span className="text-xs text-emerald-500 flex items-center gap-1">
                            <CheckSquare className="w-3 h-3" />
                            Firmado
                          </span>
                        )}
                        {pqrs.attachments.length > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Image className="w-3 h-3" />
                            {pqrs.attachments.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{pqrs.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{pqrs.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Categoría: {pqrs.category}</span>
                      <span>•</span>
                      <span>Creado: {pqrs.createdDate.toLocaleDateString('es-CO')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab de Directorio de Vecinos */}
      {activeTab === 'neighbors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md">
            <h2 className="text-lg font-semibold text-foreground mb-6">Directorio de Vecinos</h2>
            
            <div className="space-y-3">
              {neighbors.map((neighbor) => (
                <div 
                  key={neighbor.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{neighbor.name}</p>
                      <p className="text-sm text-muted-foreground">Unidad {neighbor.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      neighbor.role === 'owner' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-violet-500/20 text-violet-400'
                    }`}>
                      {neighbor.role === 'owner' ? 'Propietario' : 'Arrendatario'}
                    </span>
                    {neighbor.phone && (
                      <a 
                        href={`tel:${neighbor.phone}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                    {neighbor.email && (
                      <a 
                        href={`mailto:${neighbor.email}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Los datos de contacto solo están disponibles para vecinos que han autorizado compartirlos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago */}
      <EnhancedPaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        monthlyFee={850000}
        unitInfo={userUnit ? { unit: userUnit.unit, tower: userUnit.tower } : undefined}
        pendingAmount={accountStatus.total}
      />

      {/* Modal de IA Financiera */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-background">
              <h2 className="text-lg font-semibold">Asesoría Financiera con IA</h2>
              <button onClick={() => setShowAIModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <AIFinancialAnalyzer 
                monthlyFee={850000}
                currentBalance={0}
                pendingPayments={accountStatus.pending}
                paymentHistory={[
                  { month: 'Ene', paid: true, amount: 850000 },
                  { month: 'Feb', paid: true, amount: 850000 },
                  { month: 'Mar', paid: true, amount: 850000 },
                  { month: 'Abr', paid: false, amount: 850000 },
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
