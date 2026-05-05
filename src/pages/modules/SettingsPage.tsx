import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Building2, Bell, MapPin, Home, Users, Landmark, ChevronDown, X, Building, Eye, User, Phone, Mail, MapPinned, Briefcase, Save, Camera, BellRing, DollarSign, Clock, Sparkles, Globe, Calendar, AlertCircle, Check, Edit2, Trash2, Plus, Search, Filter, MoreVertical, ChevronRight, Lock, Key, Database, Server, Mail as MailIcon, MessageSquare, Smartphone, Globe2, ShieldCheck, FileText, Download, Upload, RefreshCw, Wrench, TrendingUp, Lightbulb, CreditCard, BarChart3, CheckCircle, Bot, Ruler, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLES } from '@/types/roles';
import { MODULES, MODULE_ACCESS_MAP } from '@/types/modules';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

type TabId = 'general' | 'condos' | 'roles' | 'notifications' | 'perfil' | 'units' | 'negocio' | 'servicios' | 'horario';

// Tabs for Admin (with General - adapted for admin)
const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'Mi Conjunto', icon: Building2 },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'perfil', label: 'Mi Perfil', icon: User },
];

// Tabs for Super Admin (with Roles)
const TABS_WITH_ROLES: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'condos', label: 'Conjuntos', icon: Building2 },
  { id: 'roles', label: 'Roles', icon: Shield },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'perfil', label: 'Perfil', icon: User },
];

// Tabs for Propietario
const TABS_PROPIETARIO: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'units', label: 'Mis Unidades', icon: Building },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'perfil', label: 'Mi Perfil', icon: User },
];

// Tabs for Arrendatario (Tenant)
const TABS_ARRENDATARIO: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'units', label: 'Mi Unidad', icon: Home },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'perfil', label: 'Mi Perfil', icon: User },
];

// Tabs for Proveedor (Supplier) - Unified in one tab
const TABS_PROVEEDOR: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'Configuración', icon: Settings },
];

const ACCESS_LABELS: Record<string, { label: string; class: string }> = {
  FULL_ACCESS: { label: 'Total', class: 'bg-emerald-500/20 text-emerald-400' },
  READ_ONLY: { label: 'Lectura', class: 'bg-blue-500/20 text-blue-400' },
  LIMITED: { label: 'Limitado', class: 'bg-amber-500/20 text-amber-400' },
  OWN_DATA_ONLY: { label: 'Solo propio', class: 'bg-violet-500/20 text-violet-400' },
  NONE: { label: 'Sin acceso', class: 'bg-gray-500/20 text-gray-400' },
};

const SettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const { condos, selectCondo, selectedCondoId, condoConfig } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [showCondoSelector, setShowCondoSelector] = useState(false);

  const isSuperAdmin = user?.roleId === 'super_admin';
  const isAdmin = user?.roleId === 'admin';
  const isProveedor = user?.roleId === 'proveedor';
  const isConsejo = user?.roleId === 'consejo';
  const isPropietario = user?.roleId === 'propietario';
  const isArrendatario = user?.roleId === 'arrendatario';

  // Sample platform settings
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Bunty',
    platformEmail: 'soporte@bunty.com',
    platformPhone: '+57 300 123 4567',
    timezone: 'America/Bogota',
    currency: 'COP',
    language: 'es',
    maintenanceMode: false,
    allowRegistrations: true,
  });

  // Sample notification settings
  const [notifSettings, setNotifSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notifyNewUser: true,
    notifyPayment: true,
    notifyPQRS: true,
    notifyMaintenance: true,
    notifyReservations: true,
    notifySecurity: true,
    notifyMarketing: false,
    digestFrequency: 'daily',
  });

  // Sample roles data
  const rolesData = [
    { id: 'super_admin', name: 'Super Administrador', description: 'Acceso total a toda la plataforma', color: 'bg-purple-500' },
    { id: 'admin', name: 'Administrador', description: 'Gestión completa de un conjunto', color: 'bg-blue-500' },
    { id: 'consejo', name: 'Consejo', description: 'Acceso de consulta y reportes', color: 'bg-green-500' },
    { id: 'propietario', name: 'Propietario', description: 'Acceso a su unidad y servicios', color: 'bg-amber-500' },
    { id: 'arrendatario', name: 'Arrendatario', description: 'Acceso limitado a su unidad', color: 'bg-orange-500' },
    { id: 'porteria', name: 'Portería', description: 'Control de accesos y visitantes', color: 'bg-cyan-500' },
    { id: 'proveedor', name: 'Proveedor', description: 'Servicios externos al conjunto', color: 'bg-pink-500' },
  ];

  const renderTabContent = () => {
    // Special handling for arrendatario units tab
    if (activeTab === 'units' && isArrendatario) {
      return <TenantUnitTab user={user} />;
    }
    
    // Special handling for proveedor - unified in general tab
    if (isProveedor) {
      return <ProveedorConfigTab user={user} />;
    }
    
    switch (activeTab) {
      case 'general':
        return <GeneralTab settings={platformSettings} setSettings={setPlatformSettings} />;
      case 'condos':
        return <CondosTab condos={condos} />;
      case 'roles':
        return <RolesTab roles={rolesData} />;
      case 'notifications':
        return <NotificationsTab settings={notifSettings} setSettings={setNotifSettings} />;
      case 'perfil':
        return <PerfilTab user={user} />;
      case 'units':
        return <UnitsTab user={user} />;
      default:
        return null;
    }
  };

  // Get tabs and title based on role
  const currentTabs = isProveedor ? TABS_PROVEEDOR : isSuperAdmin ? TABS_WITH_ROLES : isArrendatario ? TABS_ARRENDATARIO : isPropietario ? TABS_PROPIETARIO : isConsejo ? TABS : TABS;
  const pageTitle = isProveedor ? 'Configuración' : isSuperAdmin ? 'Configuración Global' : isArrendatario ? 'Mi Unidad' : isPropietario ? 'Configuración' : isConsejo ? 'Información del Conjunto' : 'Configuración del Conjunto';
  const pageDescription = isProveedor 
    ? 'Gestiona la información de tu negocio y servicios' 
    : isSuperAdmin 
    ? 'Administra los parámetros globales de la plataforma' 
    : isArrendatario
    ? 'Gestiona la información de tu unidad rental'
    : isPropietario
    ? 'Gestiona la información de tu unidad'
    : isConsejo 
    ? 'Visualiza la información de tu conjunto residencial'
    : 'Administra la configuración de tu conjunto';

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#0D2B4E] via-[#1A4A7A] to-[#1E7EC8] text-white">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{pageTitle}</h1>
              <p className="text-white/80 text-sm md:text-base">{pageDescription}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs with modern design */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex gap-2">
            {currentTabs.map((tab) => {
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

// Propietario Units Tab Component
const UnitsTab = ({ user }: { user: any }) => {
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  
  // Sample data for owner's units
  const ownerUnits = [
    { id: 'UNIT-501', tower: 'Torre A', unit: '501', type: 'Apartamento', floor: 5, area: '120m²', bedrooms: 3, bathrooms: 2, parking: 2, storage: 1, status: 'active', monthlyFee: 1250000, pending: 0, paidMonths: 12, contractStart: '2023-01-15', ownerName: 'Juan Pérez', idDoc: 'CC 12345678', hasElevator: true, hasSecurity: true, hasIntercom: true, hasBalcony: true, orientation: 'Norte', floorType: 'Cerámica', windows: 'Vidrio templado', doorType: 'Blindada', insurancePolicy: 'POL-2023-001234', registryDate: '2023-01-15', notarialAct: 'Escritura 1456', price: 450000000 },
    { id: 'UNIT-502', tower: 'Torre A', unit: '502', type: 'Apartamento', floor: 5, area: '85m²', bedrooms: 2, bathrooms: 1, parking: 1, storage: 1, status: 'active', monthlyFee: 950000, pending: 0, paidMonths: 12, contractStart: '2023-06-01', ownerName: 'Juan Pérez', idDoc: 'CC 12345678', hasElevator: true, hasSecurity: true, hasIntercom: false, hasBalcony: true, orientation: 'Sur', floorType: 'Madera', windows: 'Aluminio', doorType: 'Normal', insurancePolicy: 'POL-2023-005678', registryDate: '2023-06-01', notarialAct: 'Escritura 1890', price: 320000000 },
  ];

  // Payment history sample data
  const paymentHistory = [
    { id: 1, month: 'Febrero 2026', amount: 1250000, status: 'paid', date: '2026-02-01' },
    { id: 2, month: 'Enero 2026', amount: 1250000, status: 'paid', date: '2026-01-02' },
    { id: 3, month: 'Diciembre 2025', amount: 1250000, status: 'paid', date: '2025-12-01' },
    { id: 4, month: 'Noviembre 2025', amount: 1250000, status: 'paid', date: '2025-11-03' },
  ];

  // Maintenance history sample data
  const maintenanceHistory = [
    { id: 1, date: '2026-01-15', type: 'Preventivo', description: 'Revisión de válvulas y conexiones', status: 'completed', cost: 150000 },
    { id: 2, date: '2025-11-20', type: 'Correctivo', description: 'Reparación grifo lavaplatos', status: 'completed', cost: 85000 },
    { id: 3, date: '2025-08-10', type: 'Preventivo', description: 'Mantenimiento aires acondicionados', status: 'completed', cost: 220000 },
  ];

  // Family members sample data
  const familyMembers = [
    { id: 1, name: 'María García', relation: 'Cónyuge', document: 'CC 87654321', phone: '+57 310 555 5678', email: 'maria@email.com' },
    { id: 2, name: 'Carlos Pérez', relation: 'Hijo', document: 'CC 12345679', phone: '+57 310 555 9012', email: 'carlos@email.com' },
    { id: 3, name: 'Ana Pérez', relation: 'Hija', document: 'CC 12345680', phone: '+57 310 555 3456', email: 'ana@email.com' },
  ];

  const handleViewDetails = (unit: any) => {
    setSelectedUnit(unit);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 md:p-8 border border-amber-400/20 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Mis Unidades</h3>
            <p className="text-white/80 text-sm">Gestiona las unidades de tu propiedad</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: ownerUnits.length, icon: Building, color: 'from-blue-500 to-cyan-500' },
          { label: 'Activas', value: ownerUnits.length, icon: Check, color: 'from-emerald-500 to-green-500' },
          { label: 'Ingresos', value: `$${(ownerUnits.reduce((acc, u) => acc + u.monthlyFee, 0) / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'from-purple-500 to-pink-500' },
          { label: 'Ocupación', value: '100%', icon: TrendingUp, color: 'from-orange-500 to-amber-500' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${stat.color}/10 rounded-xl p-4 border border-gray-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600 uppercase">{stat.label}</p>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-[#0D2B4E]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Units List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ownerUnits.map((unit, idx) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#0D2B4E]">{unit.tower} - {unit.unit}</h4>
                  <p className="text-xs text-gray-500">{unit.type}</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-600">
                Activo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Área', value: unit.area },
                { label: 'Piso', value: unit.floor },
                { label: 'Habitaciones', value: unit.bedrooms },
                { label: 'Baños', value: unit.bathrooms },
              ].map((info, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#F4F7FB] border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">{info.label}</p>
                  <p className="font-bold text-[#0D2B4E]">{info.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-[#1E7EC8] text-[#1E7EC8] hover:bg-[#1E7EC8]/5"
                onClick={() => handleViewDetails(unit)}
              >
                <Eye className="w-4 h-4 mr-2" /> Detalles
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                <DollarSign className="w-4 h-4 mr-2" /> Pagos
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Modal for Unit Details */}
      {selectedUnit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUnit(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0D2B4E]">{selectedUnit.tower} - {selectedUnit.unit}</h3>
                  <p className="text-sm text-gray-500">{selectedUnit.type}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setSelectedUnit(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            {/* Complete Unit Info */}
            <div className="space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Área', value: selectedUnit.area },
                  { label: 'Piso', value: selectedUnit.floor },
                  { label: 'Habitaciones', value: selectedUnit.bedrooms },
                  { label: 'Baños', value: selectedUnit.bathrooms },
                  { label: 'Parqueaderos', value: selectedUnit.parking },
                  { label: 'Bodegas', value: selectedUnit.storage},
                ].map((info, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#F4F7FB] border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">{info.label}</p>
                    <p className="font-bold text-[#0D2B4E]">{info.value}</p>
                  </div>
                ))}
              </div>

              {/* Financial Info */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-[#0D2B4E] mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Información Financiera
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs text-gray-600 mb-1">Cuota Mensual</p>
                    <p className="font-bold text-emerald-600">${selectedUnit.monthlyFee.toLocaleString('es-CO')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs text-gray-600 mb-1">Pendiente</p>
                    <p className="font-bold text-emerald-600">${selectedUnit.pending.toLocaleString('es-CO')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Pagos al día</p>
                    <p className="font-bold text-blue-600">{selectedUnit.paidMonths} meses</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Estado</p>
                    <p className="font-bold text-purple-600">Al día</p>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-[#0D2B4E] mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#0D2B4E]" />
                  Datos del Propietario
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Nombre:', value: selectedUnit.ownerName },
                    { label: 'Documento:', value: selectedUnit.idDoc },
                    { label: 'Inicio Contrato:', value: selectedUnit.contractStart },
                  ].map((info, i) => (
                    <div key={i} className="flex justify-between p-2 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-600">{info.label}</span>
                      <span className="font-medium text-[#0D2B4E]">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentation */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-[#0D2B4E] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" /> Documentación
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Escritura:', value: selectedUnit.notarialAct },
                    { label: 'Fecha Registro:', value: selectedUnit.registryDate },
                    { label: 'Póliza Seguro:', value: selectedUnit.insurancePolicy },
                    { label: 'Valor Comercial:', value: `$${(selectedUnit.price || 450000000).toLocaleString('es-CO')}` },
                  ].map((doc, i) => (
                    <div key={i} className="flex justify-between p-2 rounded-lg bg-amber-50 border border-amber-100">
                      <span className="text-sm text-gray-600">{doc.label}</span>
                      <span className="font-medium text-amber-700">{doc.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 flex gap-2">
                <Button
                  className="flex-1 bg-[#1E7EC8] hover:bg-[#1A5FA0]"
                  onClick={() => setSelectedUnit(null)}
                >
                  <DollarSign className="w-4 h-4 mr-2" /> Ver Historial de Pagos
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#1E7EC8] text-[#1E7EC8] hover:bg-[#1E7EC8]/5"
                  onClick={() => setSelectedUnit(null)}
                >
                  <FileText className="w-4 h-4 mr-2" /> Descargar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// General Tab Component - For SuperAdmin shows platform info, for Admin shows condo info, for Consejo shows read-only condo info
const GeneralTab = ({ settings, setSettings }: { settings: any; setSettings: any }) => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roleId === 'admin';
  const isConsejo = user?.roleId === 'consejo';
  const isPropietario = user?.roleId === 'propietario';
  const { condos, condoConfig } = useAppStore();
  
  // Always call useState at the top
  const [editing, setEditing] = useState(false);

  // For admin and consejo, get condo data
  const adminCondo = (isAdmin || isConsejo) 
    ? condos.find(c => c.id === (user?.condoId || condos[0]?.id)) || condos[0]
    : null;
  const adminCondoConfig = (isAdmin || isConsejo) ? condoConfig : null;

  // Propietario view - show message to go to Mis Unidades tab
  if (isPropietario) {
    return (
      <div className="space-y-6">
        {/* Info message for Propietario to go to Mis Unidades */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Gestiona tus Unidades</h3>
              <p className="text-xs text-muted-foreground">Consulta el detalle completo de tus unidades en la pestaña "Mis Unidades"</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 text-center">
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-xs text-muted-foreground">Unidades</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 text-center">
              <p className="text-2xl font-bold text-emerald-400">Al día</p>
              <p className="text-xs text-muted-foreground">Estado</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 text-center">
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Meses al día</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 text-center">
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Residentes</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building className="w-4 h-4" /> Información del Conjunto
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Conjunto:</span>
              <span className="font-medium text-foreground">Torres del Parque</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ciudad:</span>
              <span className="font-medium text-foreground">Bogotá</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dirección:</span>
              <span className="font-medium text-foreground">Carrera 45 #12-34</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Unidades:</span>
              <span className="font-medium text-foreground">120</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Administrador:</span>
              <span className="font-medium text-foreground">Ing. Pedro Gómez</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contacto:</span>
              <span className="font-medium text-foreground">+57 300 123 4567</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin view - show condo info (editable)
  if (isAdmin && adminCondo) {
    const towers = adminCondoConfig?.towers || adminCondo?.towers || [];
    const commonAreas = adminCondoConfig?.commonAreas || adminCondo?.commonAreas || [];
    
    return (
      <div className="space-y-6">
        {/* Single Condo Info for Admin - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-2xl shadow-sm border border-gray-200/50"
        >
          <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
            {/* Left: Main Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D2B4E] via-[#1A4A7A] to-[#1E7EC8] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {adminCondo.name?.charAt(0) || 'T'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#0D2B4E]">{adminCondo.name || 'Torres del Parque Residencial'}</h3>
                  <p className="text-gray-500 mt-1">{adminCondo.address || 'Carrera 45 #12-34, Bogotá'}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-600">Activo</span>
                    <span className="text-xs text-gray-600">{adminCondo.city || 'Bogotá'}</span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#1E7EC8]/20 text-[#1E7EC8] capitalize">{adminCondoConfig?.type || adminCondo?.type || 'residential'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { label: 'Unidades', value: adminCondo.totalUnits || 120 },
                  { label: 'Ocupación', value: `${adminCondo.occupancyRate || 94}%` },
                  { label: 'Residentes', value: adminCondo.totalResidents || 280 },
                  { label: 'Cartera', value: `$${Math.round((adminCondo.totalDebt || 45000000) / 1000000)}M` },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/60 border border-gray-200/40">
                    <p className="text-xs text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-xl font-bold text-[#0D2B4E]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Additional Details */}
            <div className="w-full md:w-80 bg-gradient-to-br from-white/40 to-white/20 rounded-2xl p-4 border border-gray-200/40">
              <h4 className="font-bold text-[#0D2B4E] mb-4 flex items-center gap-2">
                <Building className="w-4 h-4" /> Información del Conjunto
              </h4>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'NIT:', value: adminCondoConfig?.nit || adminCondo?.nit || '900.123.456-7' },
                  { label: 'Tipo:', value: (adminCondoConfig?.type || adminCondo?.type || 'Residencial').charAt(0).toUpperCase() + (adminCondoConfig?.type || adminCondo?.type || 'Residencial').slice(1) },
                  { label: 'Bloques:', value: adminCondoConfig?.blocks || adminCondo?.blocks || 3 },
                  { label: 'Parkings:', value: adminCondoConfig?.parkingSpots || adminCondo?.parkingSpots || 80 },
                  { label: 'Bodegas:', value: adminCondoConfig?.storageUnits || adminCondo?.storageUnits || 40 },
                  { label: 'Fundación:', value: adminCondoConfig?.foundedDate || adminCondo?.foundedDate || '20/03/2015' },
                ].map((info, i) => (
                  <div key={i} className="flex justify-between p-2 rounded-lg bg-white/50">
                    <span className="text-gray-600">{info.label}</span>
                    <span className="font-medium text-[#0D2B4E]">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Building2, label: 'Ver Unidades', color: 'from-blue-500 to-cyan-500' },
            { icon: Users, label: 'Residentes', color: 'from-purple-500 to-pink-500' },
            { icon: DollarSign, label: 'Finanzas', color: 'from-emerald-500 to-green-500' },
            { icon: Wrench, label: 'Mantenimiento', color: 'from-amber-500 to-orange-500' },
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-2xl border border-gray-200/50 hover:border-[#1E7EC8]/30 hover:shadow-md transition-all bg-white/60"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mx-auto mb-2 text-sm`}>
                <action.icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#0D2B4E] text-center">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // SuperAdmin view - Platform Info
  const handleSave = () => {
    toast({ title: 'Configuración guardada', description: 'Los cambios se han guardado correctamente' });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Propietario view - show message */}
      {isPropietario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-amber-200 shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-900 mb-1">Gestiona tus Unidades</h3>
              <p className="text-sm text-amber-700 mb-4">Consulta el detalle completo de tus unidades en la pestaña "Mis Unidades"</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Unidades', value: '2', icon: Home },
                  { label: 'Estado', value: 'Al día', icon: CheckCircle },
                  { label: 'Meses al día', value: '12', icon: Calendar },
                  { label: 'Residentes', value: '3', icon: Users },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-amber-100 text-center">
                    <item.icon className="mx-auto mb-1 h-6 w-6 text-amber-700" />
                    <p className="text-lg font-bold text-amber-900">{item.value}</p>
                    <p className="text-xs text-amber-700">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Platform Info - Super Admin */}
      {!isPropietario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E7EC8] to-[#0D2B4E] flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0D2B4E]">Configuración de Plataforma</h3>
                <p className="text-sm text-gray-600">Parámetros globales del sistema</p>
              </div>
            </div>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="border-[#1E7EC8] text-[#1E7EC8] hover:bg-[#1E7EC8]/5"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-[#1E7EC8] hover:bg-[#1A5FA0]"
                >
                  <Save className="w-4 h-4 mr-2" /> Guardar
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Nombre de la Plataforma', value: settings.platformName, key: 'platformName' },
              { label: 'Correo de Contacto', value: settings.platformEmail, key: 'platformEmail' },
              { label: 'Teléfono', value: settings.platformPhone, key: 'platformPhone' },
            ].map((field, i) => (
              <div key={i} className="space-y-2">
                <label className="text-sm font-semibold text-[#0D2B4E]">{field.label}</label>
                <Input
                  value={field.value}
                  onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                  disabled={!editing}
                  className="bg-[#F4F7FB] border-gray-300 rounded-lg focus:border-[#1E7EC8] focus:ring-[#1E7EC8]/20"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Notifications Tab Component - Enhanced for Propietario and Arrendatario
const NotificationsTab = ({ settings, setSettings }: { settings: any; setSettings: any }) => {
  const user = useAuthStore((s) => s.user);
  const isPropietario = user?.roleId === 'propietario';
  const isArrendatario = user?.roleId === 'arrendatario';
  
  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast({ title: 'Configuración actualizada', description: `${key} ha sido ${settings[key] ? 'desactivado' : 'activado'}` });
  };

  // Extended notifications for Propietario
  const propietarioNotifications = [
    { id: 'notifyPayment', label: 'Recordatorios de Pago', description: 'Recibe recordatorios sobre cuotas y fechas de pago', icon: DollarSign, color: 'emerald' },
    { id: 'notifyMaintenance', label: 'Mantenimiento', description: 'Notificaciones sobre órdenes de mantenimiento', icon: Wrench, color: 'amber' },
    { id: 'notifyReservations', label: 'Reservas', description: 'Información sobre reservas de áreas comunes', icon: Calendar, color: 'blue' },
    { id: 'notifySecurity', label: 'Seguridad', description: 'Alertas y notificaciones de seguridad', icon: ShieldCheck, color: 'red' },
    { id: 'notifyPQRS', label: 'PQRS', description: 'Respuestas a peticiones, quejas y recursos', icon: MessageSquare, color: 'purple' },
    { id: 'notifyAnnouncements', label: 'Comunicados', description: 'Noticias y anuncios del conjunto', icon: Bell, color: 'cyan' },
  ];

  // Extended notifications for Arrendatario (Tenant) - Enhanced version
  const arrendatarioNotifications = [
    { id: 'notifyPayment', label: 'Recordatorios de Pago', description: 'Recibe recordatorios sobre cuotas y fechas de pago', icon: DollarSign, color: 'emerald' },
    { id: 'notifyMaintenance', label: 'Mantenimiento', description: 'Notificaciones sobre mantenimiento de tu unidad', icon: Wrench, color: 'amber' },
    { id: 'notifyReservations', label: 'Reservas', description: 'Información sobre reservas de áreas comunes', icon: Calendar, color: 'blue' },
    { id: 'notifySecurity', label: 'Seguridad', description: 'Alertas de seguridad y visitantes', icon: ShieldCheck, color: 'red' },
    { id: 'notifyContract', label: 'Contrato', description: 'Información sobre tu contrato de arrendamiento', icon: FileText, color: 'purple' },
    { id: 'notifyOwner', label: 'Propietario', description: 'Comunicación con el propietario', icon: Building, color: 'orange' },
  ];

  // Sample notification history for Propietario
  const notificationHistory = [
    { id: 1, type: 'payment', title: 'Recordatorio de pago', desc: 'Tu cuota de Febrero vence en 5 días', time: 'Hace 2 horas', icon: DollarSign, unread: true },
    { id: 2, type: 'maintenance', title: 'Mantenimiento programado', desc: 'Corte de agua el domingo 15 de 8am a 12pm', time: 'Ayer', icon: Wrench, unread: true },
    { id: 3, type: 'announcement', title: 'Nuevo comunicado', desc: 'Convocatoria a asamblea general', time: 'Hace 2 días', icon: Bell, unread: false },
    { id: 4, type: 'security', title: 'Registro de visitante', desc: 'Se registró un visitante en tu unidad', time: 'Hace 3 días', icon: ShieldCheck, unread: false },
    { id: 5, type: 'reservation', title: 'Reserva confirmada', desc: 'Tu reserva del salón comunal está confirmada', time: 'Hace 5 días', icon: Calendar, unread: false },
  ];

  // Sample notification history for Arrendatario (Tenant) - More relevant to tenants
  const arrendatarioNotificationHistory = [
    { id: 1, type: 'payment', title: 'Recordatorio de pago', desc: 'Tu cuota de Febrero vence en 5 días', time: 'Hace 2 horas', icon: DollarSign, unread: true },
    { id: 2, type: 'contract', title: 'Renovación de contrato', desc: 'Tu contrato vence en 30 días', time: 'Ayer', icon: FileText, unread: true },
    { id: 3, type: 'maintenance', title: 'Mantenimiento programado', desc: 'Reparación del ascensor mañana de 9am a 12pm', time: 'Hace 2 días', icon: Wrench, unread: false },
    { id: 4, type: 'security', title: 'Registro de visitante', desc: 'Tu visitante Juan Pérez registró entrada', time: 'Hace 3 días', icon: ShieldCheck, unread: false },
    { id: 5, type: 'owner', title: 'Mensaje del propietario', desc: 'El propietario envió un mensaje sobre el apartamento', time: 'Hace 5 días', icon: Building, unread: false },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Channels Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E7EC8] to-[#0D2B4E] flex items-center justify-center shadow-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#0D2B4E]">Canales de Notificación</h3>
            <p className="text-sm text-gray-500">Elige cómo prefieres recibir notificaciones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'emailNotifications', label: 'Email', icon: MailIcon, color: 'from-blue-500 to-cyan-500' },
            { key: 'pushNotifications', label: 'Notificaciones', icon: BellRing, color: 'from-purple-500 to-pink-500' },
            { key: 'smsNotifications', label: 'SMS', icon: Smartphone, color: 'from-green-500 to-emerald-500' }
          ].map(({ key, label, icon: IconComp, color }) => (
            <motion.div
              key={key}
              whileHover={{ y: -4 }}
              onClick={() => handleToggle(key as string)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                settings[key as keyof typeof settings]
                  ? `bg-gradient-to-br ${color}/10 border-${color.split('-')[1]}-400`
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  settings[key as keyof typeof settings]
                    ? 'bg-[#1E7EC8] border-[#1E7EC8]'
                    : 'border-gray-300'
                }`}>
                  {settings[key as keyof typeof settings] && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <p className="font-semibold text-[#0D2B4E]">{label}</p>
              <p className="text-xs text-gray-500 mt-1">
                {key === 'emailNotifications' && 'Recibe notificaciones por correo electrónico'}
                {key === 'pushNotifications' && 'Alertas en la plataforma y app móvil'}
                {key === 'smsNotifications' && 'Mensajes de texto al celular'}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Propietario: Notification Types */}
      {(isPropietario || isArrendatario) && (
        <>
          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <BellRing className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0D2B4E]">Tipos de Notificaciones</h3>
                <p className="text-sm text-gray-500">Elige qué notificaciones quieres recibir</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(isArrendatario ? arrendatarioNotifications : propietarioNotifications).map((notif) => (
                <motion.div
                  key={notif.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handleToggle(notif.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    settings[notif.id as keyof typeof settings]
                      ? 'bg-[#1E7EC8]/5 border-[#1E7EC8]/30'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-600' :
                      notif.color === 'amber' ? 'bg-amber-500/20 text-amber-600' :
                      notif.color === 'blue' ? 'bg-blue-500/20 text-blue-600' :
                      notif.color === 'red' ? 'bg-red-500/20 text-red-600' :
                      notif.color === 'purple' ? 'bg-purple-500/20 text-purple-600' :
                      notif.color === 'orange' ? 'bg-orange-500/20 text-orange-600' :
                      'bg-cyan-500/20 text-cyan-600'
                    }`}>
                      <notif.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-[#0D2B4E]">{notif.label}</p>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          settings[notif.id as keyof typeof settings]
                            ? 'bg-[#1E7EC8] border-[#1E7EC8]'
                            : 'border-gray-300'
                        }`}>
                          {settings[notif.id as keyof typeof settings] && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{notif.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notification History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0D2B4E]">Historial de Notificaciones</h3>
                  <p className="text-sm text-gray-500">Tus notificaciones recientes</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-600">
                {(isArrendatario ? arrendatarioNotificationHistory : notificationHistory).filter(n => n.unread).length} nuevas
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(isArrendatario ? arrendatarioNotificationHistory : notificationHistory).map((notif) => (
                <motion.div
                  key={notif.id}
                  whileHover={{ x: 4 }}
                  className={`flex items-start gap-3 p-4 rounded-lg transition-all ${
                    notif.unread ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    notif.type === 'payment' ? 'bg-emerald-500/20 text-emerald-600' :
                    notif.type === 'maintenance' ? 'bg-amber-500/20 text-amber-600' :
                    notif.type === 'announcement' ? 'bg-purple-500/20 text-purple-600' :
                    notif.type === 'security' ? 'bg-red-500/20 text-red-600' :
                    notif.type === 'contract' ? 'bg-violet-500/20 text-violet-600' :
                    notif.type === 'owner' ? 'bg-orange-500/20 text-orange-600' :
                    'bg-blue-500/20 text-blue-600'
                  }`}>
                    <notif.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-medium ${notif.unread ? 'text-[#0D2B4E]' : 'text-gray-600'}`}>
                        {notif.title}
                      </p>
                      {notif.unread && <div className="w-2 h-2 rounded-full bg-[#1E7EC8]" />}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{notif.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{notif.time}</span>
                </motion.div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 border-gray-200 hover:bg-gray-50">
              Ver Todas las Notificaciones
            </Button>
          </motion.div>
        </>
      )}

      {/* Digest Frequency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#0D2B4E]">Frecuencia de Resumen</h3>
            <p className="text-sm text-gray-500">Recibe un resumen de tu actividad</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <motion.button
              key={freq}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettings({ ...settings, digestFrequency: freq })}
              className={`p-4 rounded-xl border-2 text-center font-semibold transition-all ${
                settings.digestFrequency === freq
                  ? 'bg-[#1E7EC8] border-[#1E7EC8] text-white shadow-lg'
                  : 'bg-white border-gray-200 text-[#0D2B4E] hover:border-gray-300'
              }`}
            >
              {freq === 'daily' ? 'Diario' : freq === 'weekly' ? 'Semanal' : 'Mensual'}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Perfil Tab Component
const PerfilTab = ({ user }: { user: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    toast({ title: 'Perfil actualizado', description: 'Tus datos han sido guardados correctamente' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header with Gradient Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl p-8 border border-blue-200/30 shadow-sm"
      >
        {/* Top Section - Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
          <div className="relative flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#1E7EC8] via-[#1A5FA0] to-[#0D2B4E] flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-[#1E7EC8] border-4 border-white flex items-center justify-center shadow-lg hover:bg-[#1A5FA0] transition-colors"
            >
              <Camera className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          <div className="flex-1">
            <h2 className="text-4xl font-bold text-[#0D2B4E] mb-2">{user?.name || 'Usuario'}</h2>
            <p className="text-gray-600 text-lg mb-4">{user?.email || 'correo@ejemplo.com'}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 text-sm font-bold rounded-full bg-[#1E7EC8]/10 border border-[#1E7EC8] text-[#1E7EC8]"
              >
                {ROLES[user?.roleId as keyof typeof ROLES]?.label || 'Usuario'}
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 text-sm font-bold rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-600"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  Activo
                </span>
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 text-sm font-bold rounded-full bg-blue-500/10 border border-blue-500 text-blue-600"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  Verificado
                </span>
              </motion.span>
            </div>

            <div className="mt-6">
              {!isEditing ? (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 rounded-xl bg-[#1E7EC8] hover:bg-[#1A5FA0] text-white font-bold flex items-center gap-2 transition-colors"
                >
                  <Edit2 className="w-5 h-5" /> Editar Perfil
                </motion.button>
              ) : (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:border-gray-400 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-[#1E7EC8] hover:bg-[#1A5FA0] text-white font-bold flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-5 h-5" /> Guardar
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Rol', value: ROLES[user?.roleId as keyof typeof ROLES]?.label || 'N/A', icon: Shield, color: 'from-blue-500 to-cyan-500' },
          { label: 'Estado', value: 'Activo', icon: Check, color: 'from-emerald-500 to-green-500' },
          { label: 'Unidad', value: user?.condoId ? 'Asignada' : 'N/A', icon: Building, color: 'from-purple-500 to-pink-500' },
          { label: 'Verificación', value: 'Sí', icon: CheckCircle, color: 'from-amber-500 to-orange-500' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200/50 p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">{item.label}</p>
                <p className="text-lg font-bold text-[#0D2B4E] mt-1">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact & Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200/50 p-8 shadow-sm"
      >
        <h3 className="text-xl font-bold text-[#0D2B4E] mb-6 flex items-center gap-2">
          <Phone className="w-5 h-5" /> Información de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Correo Electrónico', value: user?.email || 'correo@ejemplo.com', icon: Mail },
            { label: 'Teléfono', value: user?.phone || '+57 300 000 0000', icon: Phone },
            { label: 'Conjunto', value: 'Torres del Parque', icon: Building2 },
            { label: 'Unidad', value: user?.unitId || 'No asignada', icon: Home },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1E7EC8]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#1E7EC8]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">{item.label}</p>
                  <p className="font-bold text-[#0D2B4E]">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Access & Security Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-200/50 p-8 shadow-sm"
      >
        <h3 className="text-xl font-bold text-[#0D2B4E] mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5" /> Seguridad & Acceso
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Último Acceso', value: '12 mins atrás', icon: Clock, color: 'blue' },
            { label: 'Autenticación 2FA', value: 'Desactivada', icon: ShieldCheck, color: 'amber' },
            { label: 'Sesiones Activas', value: '1 dispositivo', icon: Smartphone, color: 'emerald' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border-2 ${
              item.color === 'blue' ? 'bg-blue-50 border-blue-200' :
              item.color === 'amber' ? 'bg-amber-50 border-amber-200' :
              'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.color === 'blue' ? 'bg-blue-500/20 text-blue-600' :
                  item.color === 'amber' ? 'bg-amber-500/20 text-amber-600' :
                  'bg-emerald-500/20 text-emerald-600'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase text-gray-700 mb-1">{item.label}</p>
                  <p className={`font-bold ${
                    item.color === 'blue' ? 'text-blue-700' :
                    item.color === 'amber' ? 'text-amber-700' :
                    'text-emerald-700'
                  }`}>{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Condos Tab Component - Admin sees single condo, Super Admin sees list
const CondosTab = ({ condos }: { condos: any[] }) => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roleId === 'admin';
  const { selectedCondoId, condoConfig } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondo, setSelectedCondo] = useState<any>(null);

  // For admin, get their specific condo
  const adminCondo = isAdmin
    ? condos.find(c => c.id === (user?.condoId || selectedCondoId)) || condos[0]
    : null;

  // Filter condos for search
  const filteredCondos = condos.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: condos.length,
    totalResidents: condos.reduce((acc, c) => acc + (c.totalResidents || 0), 0),
    avgOccupancy: Math.round(condos.reduce((acc, c) => acc + (c.occupancyRate || 0), 0) / condos.length),
    totalUnits: condos.reduce((acc, c) => acc + (c.totalUnits || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0D2B4E] via-[#1A4A7A] to-[#1E7EC8] rounded-2xl p-6 md:p-8 border border-blue-300/30 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Gestión de Conjuntos</h3>
              <p className="text-white/80 text-sm">Administra todos los conjuntos residenciales</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      {!isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Conjuntos', value: stats.total, icon: Building2, color: 'from-blue-500 to-cyan-500' },
            { label: 'Unidades', value: stats.totalUnits, icon: Home, color: 'from-emerald-500 to-green-500' },
            { label: 'Residentes', value: stats.totalResidents, icon: Users, color: 'from-purple-500 to-pink-500' },
            { label: 'Ocupación Prom.', value: `${stats.avgOccupancy}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-xl p-4 shadow-md border border-gray-100`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0D2B4E]">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Search */}
      {!isAdmin && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar conjuntos por nombre, ciudad o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-[#1E7EC8] focus:ring-[#1E7EC8]/20"
          />
        </div>
      )}

      {/* Condos Grid */}
      {isAdmin && adminCondo ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D2B4E] via-[#1A4A7A] to-[#1E7EC8] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {adminCondo.name?.charAt(0) || 'T'}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0D2B4E]">{adminCondo.name}</h3>
                <p className="text-gray-500 mt-1">{adminCondo.address}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-600">Activo</span>
                  <span className="text-xs text-gray-600">{adminCondo.city}</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Unidades', value: adminCondo.totalUnits || 120 },
                  { label: 'Ocupación', value: `${adminCondo.occupancyRate || 94}%` },
                  { label: 'Residentes', value: adminCondo.totalResidents || 280 },
                  { label: 'Cartera', value: `$${Math.round((adminCondo.totalDebt || 45000000) / 1000000)}M` },
                ].map((info, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/60 border border-gray-200/40">
                    <p className="text-xs text-gray-600 mb-2">{info.label}</p>
                    <p className="text-xl font-bold text-[#0D2B4E]">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : !isAdmin && filteredCondos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCondos.map((condo, idx) => (
            <motion.div
              key={condo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCondo(condo)}
              className={`bg-white rounded-xl p-5 shadow-md border-2 cursor-pointer transition-all ${
                selectedCondo?.id === condo.id
                  ? 'border-[#1E7EC8] shadow-lg'
                  : 'border-gray-200 hover:border-[#1E7EC8]/30'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {condo.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#0D2B4E]">{condo.name}</h4>
                  <p className="text-xs text-gray-500">{condo.city}</p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-600">Activo</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-3 rounded-lg bg-[#F4F7FB]">
                  <p className="text-xs text-gray-600">Unidades</p>
                  <p className="font-bold text-[#0D2B4E]">{condo.totalUnits || 120}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#F4F7FB]">
                  <p className="text-xs text-gray-600">Residentes</p>
                  <p className="font-bold text-[#0D2B4E]">{condo.totalResidents || 280}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Ocupación:</span>
                  <span className="font-bold text-[#0D2B4E]">{condo.occupancyRate || 94}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Cartera:</span>
                  <span className="font-bold text-orange-600">${Math.round((condo.totalDebt || 45000000) / 1000000)}M</span>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 px-3 py-2 rounded-lg bg-[#1E7EC8] text-white font-medium text-xs hover:bg-[#1A5FA0] transition-colors">
                  Ver
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 px-3 py-2 rounded-lg border border-[#1E7EC8] text-[#1E7EC8] font-medium text-xs hover:bg-[#1E7EC8]/5 transition-colors">
                  Editar
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : !isAdmin ? (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">No se encontraron conjuntos</p>
        </div>
      ) : null}
    </div>
  );
};

// Roles Tab Component
const RolesTab = ({ roles }: { roles: any[] }) => {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample user counts per role
  const roleCounts: Record<string, number> = {
    super_admin: 2,
    admin: 8,
    consejo: 12,
    propietario: 45,
    arrendatario: 120,
    porteria: 6,
    proveedor: 18,
  };

  // Permission matrix
  const permissionMatrix: Record<string, Record<string, boolean>> = {
    super_admin: { view: true, create: true, edit: true, delete: true, admin: true },
    admin: { view: true, create: true, edit: true, delete: false, admin: false },
    consejo: { view: true, create: false, edit: true, delete: false, admin: false },
    propietario: { view: true, create: false, edit: false, delete: false, admin: false },
    arrendatario: { view: true, create: false, edit: false, delete: false, admin: false },
    porteria: { view: true, create: false, edit: false, delete: false, admin: false },
    proveedor: { view: true, create: false, edit: false, delete: false, admin: false },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0D2B4E] via-[#1A4A7A] to-[#1E7EC8] rounded-2xl p-6 md:p-8 border border-blue-300/30 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Gestión de Roles y Permisos</h3>
            <p className="text-white/80 text-sm">Define y administra los roles de usuario en la plataforma</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Roles Activos', value: roles.length, icon: Shield, color: 'from-blue-500 to-cyan-500' },
          { label: 'Total Usuarios', value: Object.values(roleCounts).reduce((a, b) => a + b, 0), icon: Users, color: 'from-purple-500 to-pink-500' },
          { label: 'Permisos Configurados', value: 5, icon: Lock, color: 'from-emerald-500 to-green-500' },
          { label: 'Últimas Actualizaciones', value: '3d atrás', icon: Clock, color: 'from-amber-500 to-orange-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0D2B4E]">{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role, idx) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedRole(role)}
            className={`cursor-pointer rounded-2xl border p-5 md:p-6 transition-all ${
              selectedRole.id === role.id
                ? 'bg-blue-500/5 border-[#1E7EC8] shadow-md'
                : 'bg-white/60 border-gray-200/50 hover:border-[#1E7EC8]/30 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center text-white font-bold`}>
                {role.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#0D2B4E] text-lg">{role.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{role.description}</p>
              </div>
            </div>

            {/* User Count */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Usuarios con este rol</span>
                <span className="px-3 py-1 rounded-full bg-[#1E7EC8]/10 text-[#1E7EC8] font-semibold text-sm">
                  {roleCounts[role.id as keyof typeof roleCounts] || 0}
                </span>
              </div>
            </div>

            {/* Permissions Badges */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase">Permisos</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(permissionMatrix[role.id as keyof typeof permissionMatrix] || {})
                  .filter(([_, hasPermission]) => hasPermission)
                  .map(([permission]) => (
                    <span key={permission} className="px-2 py-1 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-700">
                      {permission.toUpperCase()}
                    </span>
                  ))}
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-4 px-4 py-2 rounded-xl bg-[#1E7EC8] hover:bg-[#1A5FA0] text-white font-medium text-sm transition-colors"
            >
              Ver Detalles
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Detailed Permissions Matrix */}
      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200/50 p-6 md:p-8 shadow-sm"
        >
          <h3 className="text-xl font-bold text-[#0D2B4E] mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" /> Matriz de Permisos - {selectedRole.name}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#1E7EC8]/20">
                  <th className="text-left py-3 px-4 font-bold text-[#0D2B4E] text-sm">Módulo / Acción</th>
                  <th className="text-center py-3 px-4 font-bold text-[#0D2B4E] text-sm">Ver</th>
                  <th className="text-center py-3 px-4 font-bold text-[#0D2B4E] text-sm">Crear</th>
                  <th className="text-center py-3 px-4 font-bold text-[#0D2B4E] text-sm">Editar</th>
                  <th className="text-center py-3 px-4 font-bold text-[#0D2B4E] text-sm">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {['Usuarios', 'Conjuntos', 'Configuración', 'Reportes', 'Seguridad'].map((module, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-[#F4F7FB] transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700 text-sm">{module}</td>
                    {[true, selectedRole.id !== 'arrendatario' && selectedRole.id !== 'porteria', selectedRole.id !== 'arrendatario' && selectedRole.id !== 'porteria', selectedRole.id === 'super_admin' || selectedRole.id === 'admin'].map((allowed, i) => (
                      <td key={i} className="py-3 px-4 text-center">
                        {allowed ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Tenant Unit Tab Component - For Arrendatario (Tenant)
const TenantUnitTab = ({ user }: { user: any }) => {
  const appStore = useAppStore();
  
  // Dynamic data - sync with UserProfileModal
  const currentProperty = user?.unitId ? appStore.properties.find(p => p.id === user.unitId) : null;
  const tenantUnit = currentProperty ? {
    tower: currentProperty.tower || 'N/A',
    unit: currentProperty.unit || 'N/A',
    area: currentProperty.area || '0'
  } : { tower: 'N/A', unit: 'N/A', area: '0' };

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#1E7EC8] via-[#1A5FA0] to-[#0D2B4E] rounded-2xl p-6 md:p-8 border border-[#1E7EC8]/30 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Mi Unidad</h3>
            <p className="text-white/80 text-sm">Información de tu vivienda rental</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Unidad', value: `${tenantUnit.tower} - ${tenantUnit.unit}`, icon: Home },
            { label: 'Área', value: tenantUnit.area, icon: Ruler },
            { label: 'Estado', value: 'Al día', color: 'emerald', icon: CheckCircle },
            { label: 'Meses al día', value: '6', icon: Calendar },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm text-center">
              <stat.icon className="mx-auto mb-1 h-7 w-7 text-white" />
              <p className="text-xs text-white/80 mb-1">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Eye, label: 'Ver Detalles', desc: 'Información completa', color: 'from-blue-500 to-cyan-500' },
          { icon: DollarSign, label: 'Historial de Pago', desc: 'Tus pagos realizados', color: 'from-emerald-500 to-green-500' },
          { icon: BarChart3, label: 'Análisis Financiero', desc: 'Consejos de IA', color: 'from-violet-500 to-purple-500' },
        ].map((action, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all bg-white"
            onClick={() => {
              if (i === 0) setShowDetails(true);
              else if (i === 1) setShowPaymentHistory(true);
              else setShowFinancialAnalysis(true);
            }}
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 text-white shadow-md`}>
              <action.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#0D2B4E] mb-1">{action.label}</h4>
            <p className="text-xs text-gray-500">{action.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Unit Details Modal */}
      {showDetails && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E7EC8] to-[#0D2B4E] flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{tenantUnit.tower} - {tenantUnit.unit}</h3>
                  <p className="text-sm text-muted-foreground">{tenantUnit.type}</p>
                </div>
              </div>
              <button onClick={() => setShowDetails(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">Área</p>
                  <p className="font-bold text-foreground">{tenantUnit.area}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">Piso</p>
                  <p className="font-bold text-foreground">{tenantUnit.floor}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">Habitaciones</p>
                  <p className="font-bold text-foreground">{tenantUnit.bedrooms}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">Baños</p>
                  <p className="font-bold text-foreground">{tenantUnit.bathrooms}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground mb-3">Datos del Propietario</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Propietario:</span>
                    <span className="font-medium text-foreground">{tenantUnit.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Documento:</span>
                    <span className="font-medium text-foreground">{tenantUnit.idDoc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inicio Contrato:</span>
                    <span className="font-medium text-foreground">{tenantUnit.contractStart}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fin Contrato:</span>
                    <span className="font-medium text-foreground">{tenantUnit.contractEnd}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" /> Características
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg text-xs flex items-center gap-2 bg-emerald-500/10 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Ascensor
                  </div>
                  <div className="p-2 rounded-lg text-xs flex items-center gap-2 bg-emerald-500/10 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Seguridad 24/7
                  </div>
                  <div className="p-2 rounded-lg text-xs flex items-center gap-2 bg-emerald-500/10 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Intercomunicador
                  </div>
                  <div className="p-2 rounded-lg text-xs flex items-center gap-2 bg-emerald-500/10 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Balcón
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Payment History Modal */}
      {showPaymentHistory && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaymentHistory(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Historial de Pagos</h3>
                  <p className="text-sm text-muted-foreground">Tus pagos realizados</p>
                </div>
              </div>
              <button onClick={() => setShowPaymentHistory(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{payment.month}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">${payment.amount.toLocaleString('es-CO')}</p>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-400">Pagado</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Financial Analysis Modal with AI */}
      {showFinancialAnalysis && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFinancialAnalysis(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Análisis Financiero</h3>
                  <p className="text-sm text-muted-foreground">Consejos IA sobre tu vivienda</p>
                </div>
              </div>
              <button onClick={() => setShowFinancialAnalysis(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Status */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl p-6 text-white bg-gradient-to-r from-emerald-500 to-green-400 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Estado de tu Cuenta</h3>
                  <p className="text-sm opacity-90">{financialAnalysis.message}</p>
                </div>
                <CheckCircle className="h-10 w-10" />
              </div>
              <div className="flex gap-3 text-sm">
                <div className="flex-1">
                  <p className="opacity-75 mb-1">Pagos Realizados</p>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-500" style={{ width: '100%' }} />
                  </div>
                </div>
                <span className="min-w-fit font-bold">6/6</span>
              </div>
            </motion.div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#0D2B4E]/5 to-[#1E7EC8]/5 border border-[#1E7EC8]/30">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-[#1E7EC8]" />
                  <p className="text-xs font-bold text-[#1E7EC8] uppercase">Cuota Mensual</p>
                </div>
                <p className="text-2xl font-bold text-[#0D2B4E]">${tenantUnit.monthlyFee.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#0D2B4E]/5 to-[#1E7EC8]/5 border border-[#1E7EC8]/30">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-[#1E7EC8]" />
                  <p className="text-xs font-bold text-[#1E7EC8] uppercase">Anual Estimado</p>
                </div>
                <p className="text-2xl font-bold text-[#0D2B4E]">${financialAnalysis.annualSpend.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <p className="text-xs font-bold text-emerald-600 uppercase">Estado</p>
                </div>
                <p className="text-2xl font-bold text-emerald-600">Al día</p>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-[#0D4A3E] text-lg">Recomendaciones Personalizadas</h4>
              </div>
              <div className="space-y-2">
                {financialAnalysis.tips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                  >
                    <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-900">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-700">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Bot className="h-3.5 w-3.5" />
                  Nota IA:
                </span>{' '}
                Este análisis es generado automáticamente basado en tu historial de pagos. Para un asesoramiento
                detallado, contacta a la administración del conjunto.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Unified Proveedor Config Tab - Contains Negocio, Servicios, Horario and Perfil all in one
const ProveedorConfigTab = ({ user }: { user: any }) => {
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [businessData, setBusinessData] = useState({
    nombreNegocio: 'Servicios de Jardinería Juan',
    nit: '900.123.456-7',
    email: 'juan@servicios.com',
    telefono: '+57 300 123 4567',
    direccion: 'Calle 45 #12-34, Bogotá',
    descripcion: 'Servicios de jardinería y mantenimiento de áreas verdes para conjuntos residenciales',
    anosExperiencia: 5,
    fechaRegistro: '2024-01-15',
  });

  const [servicios, setServicios] = useState([
    { id: 1, nombre: 'Jardinería Integral', descripcion: 'Mantenimiento completo de áreas verdes', precio: 150000, frecuencia: 'mensual', activo: true },
    { id: 2, nombre: 'Corte de Césped', descripcion: 'Corte y mantenimiento de grass', precio: 50000, frecuencia: 'quincenal', activo: true },
    { id: 3, nombre: 'Poda de Árboles', descripcion: 'Poda profesional de árboles y arbustos', precio: 80000, frecuencia: 'mensual', activo: true },
    { id: 4, nombre: 'Fertilización', descripcion: 'Aplicación de fertilizantes y tratamientos', precio: 100000, frecuencia: 'mensual', activo: false },
  ]);

  const [horarios, setHorarios] = useState([
    { id: 1, dia: 'Lunes', inicio: '07:00', fin: '17:00', activo: true },
    { id: 2, dia: 'Martes', inicio: '07:00', fin: '17:00', activo: true },
    { id: 3, dia: 'Miércoles', inicio: '07:00', fin: '17:00', activo: true },
    { id: 4, dia: 'Jueves', inicio: '07:00', fin: '17:00', activo: true },
    { id: 5, dia: 'Viernes', inicio: '07:00', fin: '17:00', activo: true },
    { id: 6, dia: 'Sábado', inicio: '08:00', fin: '12:00', activo: false },
    { id: 7, dia: 'Domingo', inicio: '--:--', fin: '--:--', activo: false },
  ]);

  const handleSaveBusiness = () => {
    toast({ title: 'Negocio actualizado', description: 'La información de tu negocio ha sido guardada correctamente' });
    setIsEditingBusiness(false);
  };

  const toggleActivo = (id: number) => {
    setServicios(servicios.map(s => s.id === id ? { ...s, activo: !s.activo } : s));
    toast({ title: 'Servicio actualizado', description: 'El estado del servicio ha sido actualizado' });
  };

  const toggleDia = (id: number) => {
    setHorarios(horarios.map(h => h.id === id ? { ...h, activo: !h.activo } : h));
    toast({ title: 'Horario actualizado', description: 'El horario ha sido actualizado' });
  };

  return (
    <div className="space-y-8">
      {/* === SECCIÓN: MI NEGOCIO === */}
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-2xl p-6 md:p-8 border border-pink-300/30 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Mi Negocio</h3>
              <p className="text-white/80 text-sm">Información y configuración de tu negocio</p>
            </div>
          </div>
        </motion.div>

        {/* Business Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-md">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0D2B4E]">{businessData.nombreNegocio}</h4>
                <p className="text-sm text-gray-500">{businessData.descripcion}</p>
              </div>
            </div>
            {!isEditingBusiness ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingBusiness(true)}
                className="border-pink-500 text-pink-600 hover:bg-pink-50"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingBusiness(false)}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveBusiness}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  <Save className="w-4 h-4 mr-2" /> Guardar
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Nombre del Negocio', value: businessData.nombreNegocio },
              { label: 'NIT', value: businessData.nit },
              { label: 'Correo Electrónico', value: businessData.email },
              { label: 'Teléfono', value: businessData.telefono },
            ].map((field, i) => (
              <div key={i} className="space-y-2">
                <label className="text-sm font-semibold text-[#0D2B4E]">{field.label}</label>
                <Input
                  value={field.value}
                  disabled={!isEditingBusiness}
                  className="bg-[#F4F7FB] border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <label className="text-sm font-semibold text-[#0D2B4E]">Dirección</label>
            <Input
              value={businessData.direccion}
              disabled={!isEditingBusiness}
              className="bg-[#F4F7FB] border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Años Experiencia', value: businessData.anosExperiencia, icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
            { label: 'Estado', value: 'Activo', icon: CheckCircle, color: 'from-emerald-500 to-green-500' },
            { label: 'Conjuntos', value: '15', icon: Building2, color: 'from-orange-500 to-amber-500' },
            { label: 'Calificación', value: '4.8', icon: Star, color: 'from-purple-500 to-pink-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
            >
              <stat.icon className="mx-auto mb-2 h-7 w-7 text-[#0D2B4E]" />
              <p className="text-xs text-gray-600 mb-1 font-semibold">{stat.label}</p>
              <p className="font-bold text-lg text-[#0D2B4E]">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* === SECCIÓN: MIS SERVICIOS === */}
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-2xl p-6 md:p-8 border border-amber-300/30 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Mis Servicios</h3>
              <p className="text-white/80 text-sm">Servicios que ofreces a tus clientes</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicios.map((servicio, i) => (
            <motion.div
              key={servicio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-xl p-5 border-2 transition-all ${
                servicio.activo ? 'border-amber-200 shadow-md' : 'border-gray-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    servicio.activo ? 'bg-amber-500/20 text-amber-600' : 'bg-gray-400/20 text-gray-400'
                  }`}>
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0D2B4E]">{servicio.nombre}</h5>
                    <p className="text-xs text-gray-500">{servicio.descripcion}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleActivo(servicio.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    servicio.activo ? 'bg-emerald-500 text-white' : 'bg-gray-300'
                  }`}
                >
                  {servicio.activo && <Check className="w-3 h-3" />}
                </motion.button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="font-bold text-[#0D2B4E]">${servicio.precio.toLocaleString('es-CO')}</p>
                  <p className="text-xs text-gray-500">/{servicio.frecuencia}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  servicio.activo ? 'bg-emerald-500/20 text-emerald-600' : 'bg-gray-400/20 text-gray-400'
                }`}>
                  {servicio.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold">
            <Plus className="w-4 h-4 mr-2" /> Agregar Nuevo Servicio
          </Button>
        </motion.div>
      </div>

      {/* === SECCIÓN: MI HORARIO === */}
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-6 md:p-8 border border-blue-300/30 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Mi Horario</h3>
              <p className="text-white/80 text-sm">Horario de atención a clientes</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {horarios.map((horario) => (
              <motion.div
                key={horario.id}
                whileHover={{ x: 4 }}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  horario.activo ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDia(horario.id)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      horario.activo ? 'bg-emerald-500 text-white' : 'bg-gray-300'
                    }`}
                  >
                    {horario.activo && <Check className="w-3 h-3" />}
                  </motion.button>
                  <span className={`font-semibold ${horario.activo ? 'text-[#0D2B4E]' : 'text-gray-500'}`}>
                    {horario.dia}
                  </span>
                </div>
                <div className={`flex items-center gap-1 ${horario.activo ? 'text-[#0D2B4E] font-medium' : 'text-gray-500'}`}>
                  <span>{horario.inicio}</span>
                  <span>-</span>
                  <span>{horario.fin}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Horas Semanales', value: '40', icon: Clock, color: 'from-blue-500 to-cyan-500' },
            { label: 'Días Laborales', value: '5', icon: Calendar, color: 'from-violet-500 to-purple-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mx-auto mb-2`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-600 mb-1 font-semibold">{stat.label}</p>
              <p className="font-bold text-2xl text-[#0D2B4E]">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* === SECCIÓN: MI PERFIL === */}
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0D2B4E] via-[#1A4A7A] to-[#1E7EC8] rounded-2xl p-6 md:p-8 border border-blue-300/30 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Mi Perfil</h3>
              <p className="text-white/80 text-sm">Tu información personal como proveedor</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#1E7EC8] to-[#0D2B4E] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user?.name?.charAt(0) || 'P'}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-4 border-[#1E7EC8] flex items-center justify-center shadow-lg hover:bg-[#1E7EC8] transition-colors"
              >
                <Camera className="w-5 h-5 text-[#1E7EC8] hover:text-white" />
              </motion.button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-bold text-[#0D2B4E] mb-1">{user?.name || 'Proveedor'}</h4>
              <p className="text-gray-500 mb-4">{user?.email || 'correo@ejemplo.com'}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-pink-500/20 text-pink-600">
                  <Building className="h-4 w-4" />
                  Proveedor
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-600">
                  <Check className="h-4 w-4" />
                  Verificado
                </span>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
            {[
              { label: 'Tipo', value: 'Proveedor', icon: 'n' },
              { label: 'Estado', value: 'Activo', color: 'emerald' },
              { label: 'Ein', value: businessData.nit, icon: '#' },
              { label: 'Miembro desde', value: '2024', icon: Calendar },
            ].map((info, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#F4F7FB] border border-gray-200 text-center">
                <p className="text-xs text-gray-600 mb-2 font-semibold uppercase">{info.label}</p>
                <p className="font-bold text-[#0D2B4E]">{info.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
