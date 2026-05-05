import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Building2, Bell, Home, Users, Building, Eye, User, Phone, Mail, Save, Camera, BellRing, DollarSign, Globe, Server, MessageSquare, Smartphone, ShieldCheck, Check, Edit2, Plus, Search, MoreVertical, Download, RefreshCw, Database, Wrench, Lock, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLES } from '@/types/roles';
import { MODULES, MODULE_ACCESS_MAP } from '@/types/modules';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

type TabId = 'general' | 'condos' | 'roles' | 'notifications' | 'perfil';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'Mi Conjunto', icon: Building2 },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'perfil', label: 'Mi Perfil', icon: User },
];

const TABS_WITH_ROLES: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'condos', label: 'Conjuntos', icon: Building2 },
  { id: 'roles', label: 'Roles', icon: Shield },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'perfil', label: 'Perfil', icon: User },
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
  const { condos, condoConfig } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const isSuperAdmin = user?.roleId === 'super_admin';
  const isAdmin = user?.roleId === 'admin';

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
      default:
        return null;
    }
  };

  const currentTabs = isSuperAdmin ? TABS_WITH_ROLES : TABS;
  const pageTitle = isSuperAdmin ? 'Configuración Global' : 'Configuración del Conjunto';
  const pageDescription = isSuperAdmin 
    ? 'Administra los parámetros globales de la plataforma' 
    : 'Administra la configuración de tu conjunto';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
      </motion.div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] text-white shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

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
  );
};

const GeneralTab = ({ settings, setSettings }: { settings: any; setSettings: any }) => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roleId === 'admin';
  const { condos, condoConfig } = useAppStore();
  const [editing, setEditing] = useState(false);

  const adminCondo = isAdmin ? condos.find(c => c.id === (user?.condoId || condos[0]?.id)) || condos[0] : null;
  const adminCondoConfig = isAdmin ? condoConfig : null;

  if (isAdmin && adminCondo) {
    const towers = adminCondoConfig?.towers || adminCondo?.towers || [];
    const commonAreas = adminCondoConfig?.commonAreas || adminCondo?.commonAreas || [];
    
    return (
      <div className="space-y-6">
        {/* FONDO BLANCO SOLIDO */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {adminCondo.name?.charAt(0) || 'T'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground">{adminCondo.name || 'Torres del Parque'}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{adminCondo.address || 'Dirección no disponible'}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Activo</span>
                    <span className="text-xs text-muted-foreground">{adminCondo.city || 'Bogotá'}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 capitalize">{adminCondoConfig?.type || adminCondo?.type || 'residential'}</span>
                  </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <p className="text-2xl font-bold text-foreground">{adminCondo.totalUnits || 120}</p>
                  <p className="text-xs text-muted-foreground">Unidades</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <p className="text-2xl font-bold text-foreground">{adminCondo.occupancyRate || 94}%</p>
                  <p className="text-xs text-muted-foreground">Ocupación</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <p className="text-2xl font-bold text-foreground">{adminCondo.totalResidents || 280}</p>
                  <p className="text-xs text-muted-foreground">Residentes</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <p className="text-2xl font-bold text-foreground">${Math.round((adminCondo.totalDebt || 45000000) / 1000000)}M</p>
                  <p className="text-xs text-muted-foreground">Cartera</p>
                </div>
            </div>

            <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" /> Información del Conjunto
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NIT:</span>
                  <span className="font-medium text-foreground">{adminCondoConfig?.nit || adminCondo?.nit || '900.123.456-7'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium text-foreground capitalize">{adminCondoConfig?.type || adminCondo?.type || 'Residencial'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bloques:</span>
                  <span className="font-medium text-foreground">{adminCondoConfig?.blocks || adminCondo?.blocks || 3}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parkings:</span>
                  <span className="font-medium text-foreground">{adminCondoConfig?.parkingSpots || adminCondo?.parkingSpots || 80}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bodegas:</span>
                  <span className="font-medium text-foreground">{adminCondoConfig?.storageUnits || adminCondo?.storageUnits || 40}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fundación:</span>
                  <span className="font-medium text-foreground">{adminCondoConfig?.foundedDate || adminCondo?.foundedDate || '20/03/2015'}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <span className="text-muted-foreground block mb-1">Empresa Administradora:</span>
                  <span className="font-medium text-foreground text-xs">{adminCondoConfig?.adminCompany || adminCondo?.adminCompany || 'Administraciones Bunty S.A.S'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contacto:</span>
                  <span className="font-medium text-foreground text-xs">{adminCondoConfig?.adminContact || adminCondo?.adminContact || '+57 601 555 0000'}</span>
                </div>
            </div>
        </div>

        {/* Torres - FONDO BLANCO */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Torres / Bloques</h3>
              <p className="text-xs text-muted-foreground">Configuración de torres y unidades</p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {towers.map((tower: any, idx: number) => (
              <div key={tower.id || idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{tower.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">{tower.floors} pisos</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>{tower.unitsPerFloor} unidades/piso</span>
                  <span className="mx-2">•</span>
                  <span>Total: {tower.floors * tower.unitsPerFloor} unidades</span>
                </div>
            ))}
          </div>

        {/* Areas Comunes - FONDO BLANCO */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Áreas Comunes</h3>
              <p className="text-xs text-muted-foreground">Espacios comunes del conjunto</p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonAreas.map((area: any, idx: number) => (
              <div key={area.id || idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-border flex items-center justify-between">
                <div>
                  <span className="font-medium text-foreground">{area.name}</span>
                  <p className="text-xs text-muted-foreground capitalize">Capacidad: {area.capacity} personas</p>
                </div>
                {area.reservable && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Reservable</span>
                )}
              </div>
            ))}
          </div>

        {/* Acciones rapidas - FONDO BLANCO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2 hover:bg-[#0D4A3E]/10 hover:border-[#0F7A5C]/30 transition-colors">
            <Building2 className="w-5 h-5 text-[#0F7A5C]" />
            <span className="text-xs">Ver Unidades</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2 hover:bg-[#0D4A3E]/10 hover:border-[#0F7A5C]/30 transition-colors">
            <Users className="w-5 h-5 text-[#0F7A5C]" />
            <span className="text-xs">Residentes</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2 hover:bg-[#0D4A3E]/10 hover:border-[#0F7A5C]/30 transition-colors">
            <DollarSign className="w-5 h-5 text-[#0F7A5C]" />
            <span className="text-xs">Finanzas</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2 hover:bg-[#0D4A3E]/10 hover:border-[#0F7A5C]/30 transition-colors">
            <Wrench className="w-5 h-5 text-[#0F7A5C]" />
            <span className="text-xs">Mantenimiento</span>
          </Button>
        </div>
    );
  }

  const handleSave = () => {
    toast({ title: 'Configuración guardada', description: 'Los cambios se han guardado correctamente' });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Información de la Plataforma</h3>
              <p className="text-xs text-muted-foreground">Datos generales del sistema</p>
            </div>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" /> Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Guardar</Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nombre de la Plataforma</label>
            <Input value={settings.platformName} onChange={(e) => setSettings({...settings, platformName: e.target.value})} disabled={!editing} className="bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Correo de Contacto</label>
            <Input value={settings.platformEmail} onChange={(e) => setSettings({...settings, platformEmail: e.target.value})} disabled={!editing} className="bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
            <Input value={settings.platformPhone} onChange={(e) => setSettings({...settings, platformPhone: e.target.value})} disabled={!editing} className="bg-background" />
          </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Estado del Sistema</h3>
            <p className="text-xs text-muted-foreground">Estado actual de los servicios</p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-400">API</span>
            </div>
            <p className="text-xs text-muted-foreground">Operativo</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-400">Base de Datos</span>
            </div>
            <p className="text-xs text-muted-foreground">Operativo</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-400">Autenticación</span>
            </div>
            <p className="text-xs text-muted-foreground">Operativo</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm font-medium text-amber-400">Mantenimiento</span>
            </div>
            <p className="text-xs text-muted-foreground">{settings.maintenanceMode ? 'Activo' : 'Inactivo'}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <Download className="w-5 h-5" />
          <span className="text-sm">Exportar Datos</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          <span className="text-sm">Limpiar Caché</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
          <Database className="w-5 h-5" />
          <span className="text-sm">Respaldo Manual</span>
        </Button>
      </div>
  );
};

const CondosTab = ({ condos }: { condos: any[] }) => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roleId === 'admin';
  const { selectedCondoId, condoConfig } = useAppStore();
  const adminCondo = isAdmin ? condos.find(c => c.id === (user?.condoId || selectedCondoId)) || condos[0] : null;
  const adminCondoConfig = isAdmin ? condoConfig : null;
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCondos = condos.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.city?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isAdmin && adminCondo) {
    const towers = adminCondoConfig?.towers || adminCondo?.towers || [];
    const commonAreas = adminCondoConfig?.commonAreas || adminCondo?.commonAreas || [];
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {adminCondo.name?.charAt(0) || 'T'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground">{adminCondo.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{adminCondo.address}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Activo</span>
                    <span className="text-xs text-muted-foreground">{adminCondo.city}</span>
                  </div>
              </div>
          </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2"><Building2 className="w-5 h-5" /><span className="text-xs">Ver Unidades</span></Button>
          <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2"><Users className="w-5 h-5" /><span className="text-xs">Residentes</span></Button>
          <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2"><DollarSign className="w-5 h-5" /><span className="text-xs">Finanzas</span></Button>
          <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2"><Wrench className="w-5 h-5" /><span className="text-xs">Mantenimiento</span></Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0D4A3E]/20 flex items-center justify-center"><Building2 className="w-5 h-5 text-[#0F7A5C]" /></div>
            <div><p className="text-2xl font-bold text-foreground">{condos.length}</p><p className="text-xs text-muted-foreground">Total Conjuntos</p></div>
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-6">
        <div className="relative flex-1 max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar conjuntos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Conjunto</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ciudad</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Unidades</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredCondos.map((condo) => (
              <tr key={condo.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white font-bold">{condo.name.charAt(0)}</div><p className="font-medium text-foreground">{condo.name}</p></div></td>
                <td className="p-4 text-sm text-muted-foreground">{condo.city}</td>
                <td className="p-4 text-center"><span className="text-sm font-medium text-foreground">{condo.totalUnits}</span></td>
                <td className="p-4 text-center"><span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">Activo</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

const RolesTab = ({ roles }: { roles: any[] }) => {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {roles.map((role) => (
          <button key={role.id} onClick={() => setSelectedRole(role)} className={`p-4 rounded-xl border text-left transition-all ${selectedRole.id === role.id ? 'bg-[#0D4A3E]/10 border-[#0F7A5C]/30' : 'bg-white dark:bg-gray-800 border-border hover:border-[#0F7A5C]/30'}`}>
            <div className={`w-3 h-3 rounded-full ${role.color} mb-2`} />
            <p className="font-medium text-sm text-foreground truncate">{role.name}</p>
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar módulo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.filter(m => m.id !== 'dashboard' && m.id !== 'properties' && m.id !== 'knowledge' && m.id !== 'audit').map((mod) => {
            const access = MODULE_ACCESS_MAP[mod.id]?.[selectedRole.id as keyof typeof MODULE_ACCESS_MAP] || 'NONE';
            const accessInfo = ACCESS_LABELS[access];
            if (searchTerm && !mod.label.toLowerCase().includes(searchTerm.toLowerCase())) return null;
            return (
              <div key={mod.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-border">
                <span className="text-sm font-medium text-foreground">{mod.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${accessInfo.class}`}>{accessInfo.label}</span>
              </div>
            );
          })}
        </div>
    </div>
  );
};

const NotificationsTab = ({ settings, setSettings }: { settings: any; setSettings: any }) => {
  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast({ title: 'Configuración actualizada', description: `${key} ha sido ${settings[key] ? 'desactivado' : 'activado'}` });
  };
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-white" /></div>
          <div><h3 className="font-semibold text-foreground">Canales de Notificación</h3><p className="text-xs text-muted-foreground">Selecciona cómo recibir notificaciones</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'emailNotifications', label: 'Correo Electrónico', icon: Mail, desc: 'Recibe notificaciones por email' },
            { key: 'pushNotifications', label: 'Notificaciones Push', icon: BellRing, desc: 'Alertas en tiempo real' },
            { key: 'smsNotifications', label: 'SMS', icon: Smartphone, desc: 'Mensajes de texto' },
          ].map((item) => (
            <div key={item.key} onClick={() => handleToggle(item.key)} className={`p-4 rounded-xl border cursor-pointer transition-all ${settings[item.key] ? 'bg-[#0D4A3E]/10 border-[#0F7A5C]/30' : 'bg-gray-50 dark:bg-gray-700 border-border'}`}>
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-5 h-5 text-foreground" />
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${settings[item.key] ? 'bg-[#0D4A3E] text-white' : 'bg-muted'}`}>
                  {settings[item.key] && <Check className="w-3 h-3" />}
                </div>
              <p className="font-medium text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
    </div>
  );
};

const PerfilTab = ({ user }: { user: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const handleSave = () => { toast({ title: 'Perfil actualizado', description: 'Tus datos han sido guardados correctamente' }); setIsEditing(false); };
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white text-3xl font-bold">{user?.name?.charAt(0) || 'U'}</div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-[#0F7A5C] flex items-center justify-center"><Camera className="w-4 h-4 text-[#0F7A5C]" /></button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground">{user?.name || 'Usuario'}</h2>
            <p className="text-muted-foreground">{user?.email || 'correo@ejemplo.com'}</p>
            <span className="px-3 py-1 text-xs rounded-full bg-[#0D4A3E]/20 text-[#0F7A5C] font-medium mt-2 inline-block">{ROLES[user?.roleId as keyof typeof ROLES]?.label || 'Usuario'}</span>
          </div>
          {!isEditing ? (<Button variant="outline" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4 mr-2" /> Editar Perfil</Button>) : (<div className="flex gap-2"><Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button><Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Guardar</Button></div>)}
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={!isEditing} className="pl-10 bg-background" /></div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!isEditing} className="pl-10 bg-background" /></div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} className="pl-10 bg-background" /></div>
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Seguridad</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-border">
            <div className="flex items-center gap-3"><Lock className="w-5 h-5 text-muted-foreground" /><div><p className="font-medium text-sm text-foreground">Cambiar Contraseña</p><p className="text-xs text-muted-foreground">Último cambio: hace 30 días</p></div>
            <Button variant="outline" size="sm"><Key className="w-4 h-4 mr-2" /> Cambiar</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-border">
            <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-muted-foreground" /><div><p className="font-medium text-sm text-foreground">Autenticación de Dos Factores</p><p className="text-xs text-muted-foreground">Estado: Activo</p></div>
            <Button variant="outline" size="sm">Configurar</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-border">
            <div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-muted-foreground" /><div><p className="font-medium text-sm text-foreground">Sesiones Activas</p><p className="text-xs text-muted-foreground">2 dispositivos conectados</p></div>
            <Button variant="outline" size="sm">Ver Todas</Button>
          </div>
      </div>
  );
};

export default SettingsPage;
