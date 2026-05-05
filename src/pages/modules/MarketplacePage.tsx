import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Store, Star, ShoppingCart, Phone, MapPin, Clock, Wrench, Search, Filter, 
  ChevronRight, Plus, X, User, Building2, Mail, FileText, CheckCircle, 
  Award, Briefcase, Shield, Grid, List, ExternalLink, Calendar, MessageSquare, 
  Send, Image as ImageIcon, Camera, Upload, FileCheck, AlertTriangle, Users,
  BriefcaseIcon, BadgeCheck, Sparkles, BarChart3, Bell, Edit, ClipboardList, DollarSign, Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CATEGORY_LABELS: Record<string, string> = {
  cleaning: 'Limpieza',
  maintenance: 'Mantenimiento',
  plumbing: 'Plomeria',
  electrical: 'Electricidad',
  security: 'Seguridad',
  gardening: 'Jardineria',
  painting: 'Pintura',
  construction: 'Construccion',
};

const CATEGORY_COLORS: Record<string, string> = {
  cleaning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  maintenance: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  plumbing: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  electrical: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  security: 'bg-red-500/20 text-red-400 border-red-500/30',
  gardening: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  painting: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  construction: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

interface NewProviderForm {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  category: string;
  description: string;
  certifications: string;
}

const MarketplacePage = () => {
  const { marketplace } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.roleId === 'super_admin';
  const isProveedor = user?.roleId === 'proveedor';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'new' | 'popular' | 'rated'>('rated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof marketplace[0] | null>(null);
  const [activeProviderTab, setActiveProviderTab] = useState<'dashboard' | 'mis_servicios' | 'trabajos' | 'facturas' | 'notificaciones'>('dashboard');
  const [newProvider, setNewProvider] = useState<NewProviderForm>({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: '',
    category: 'maintenance',
    description: '',
    certifications: '',
  });

  const allCategories = useMemo(
    () => Array.from(new Set(marketplace.map((s) => s.category))).sort(),
    [marketplace]
  );

  const filteredServices = useMemo(() => {
    let result = marketplace.filter((s) => {
      const matchesSearch = s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || s.category === selectedCategory;
      const matchesRating = s.rating >= minRating;
      return matchesSearch && matchesCategory && matchesRating;
    });

    if (sortBy === 'new') {
      result = result.filter((s) => s.badge === 'new').concat(result.filter((s) => s.badge !== 'new'));
    } else if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [marketplace, searchTerm, selectedCategory, minRating, sortBy]);

  const handleAddProvider = () => {
    if (!newProvider.name || !newProvider.email || !newProvider.phone || !newProvider.document) {
      toast({ title: 'Error', description: 'Por favor completa los campos obligatorios', variant: 'destructive' });
      return;
    }
    toast({ title: 'Proveedor anadido', description: `${newProvider.name} ha sido anadido exitosamente al marketplace` });
    setShowAddProviderModal(false);
    setNewProvider({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
      category: 'maintenance',
      description: '',
      certifications: '',
    });
  };

  const handleCloseAddProviderModal = () => {
    setShowAddProviderModal(false);
    setNewProvider({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
      category: 'maintenance',
      description: '',
      certifications: '',
    });
  };

  // Vista del proveedor - Centro de Control
  if (isProveedor) {
    const providerStats = {
      totalServicios: 24,
      trabajosCompletados: 156,
      trabajosPendientes: 8,
      calificacion: 4.8,
      ingresosMes: 4500000,
      facturasPendientes: 3,
    };

    const recentJobs = [
      { id: 'TRB-001', servicio: 'Mantenimiento HVAC', conjunto: 'Torres del Parque', estado: 'completado', fecha: '15 Ene', monto: 850000 },
      { id: 'TRB-002', servicio: 'Reparación eléctrica', conjunto: 'Res. La Florida', estado: 'en_progreso', fecha: '16 Ene', monto: 420000 },
      { id: 'TRB-003', servicio: 'Mantenimiento jardines', conjunto: 'Conjunto San Felipe', estado: 'pendiente', fecha: '17 Ene', monto: 350000 },
      { id: 'TRB-004', servicio: 'Reparación plomería', conjunto: 'Torres del Parque', estado: 'completado', fecha: '14 Ene', monto: 280000 },
    ];

    const misFacturas = [
      { id: 'FAC-001', cliente: 'Torres del Parque', servicio: 'Mantenimiento sist. bombeo', monto: 1500000, fecha: '15 Ene', estado: 'pendiente' },
      { id: 'FAC-002', cliente: 'Res. La Florida', servicio: 'Reparación HVAC', monto: 850000, fecha: '12 Ene', estado: 'pagado' },
      { id: 'FAC-003', cliente: 'Conjunto San Felipe', servicio: 'Servicio eléctrico', monto: 420000, fecha: '10 Ene', estado: 'pendiente' },
    ];

    const misServicios = marketplace.filter(s => s.provider.toLowerCase().includes(user?.name?.toLowerCase() || 'servicio'));

    return (
      <div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <Store className="icon-responsive-lg text-primary" /> Mi Centro de Control
              </h1>
              <p className="text-sm text-[#0F7A5C] font-medium mt-1 flex items-center gap-2">
                <BriefcaseIcon className="w-4 h-4" /> Panel de Proveedor - Gestiona tu negocio
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'mis_servicios', label: 'Mis Servicios', icon: Store },
            { id: 'trabajos', label: 'Trabajos', icon: Wrench },
            { id: 'facturas', label: 'Facturación', icon: FileText },
            { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveProviderTab(tab.id as 'dashboard' | 'mis_servicios' | 'trabajos' | 'facturas' | 'notificaciones')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                activeProviderTab === tab.id
                  ? 'bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] text-white'
                  : 'bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeProviderTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#0D4A3E]/20 flex items-center justify-center mb-3">
                  <Store className="w-5 h-5 text-[#0F7A5C]" />
                </div>
                <p className="text-2xl font-bold text-foreground">{providerStats.totalServicios}</p>
                <p className="text-xs text-muted-foreground">Mis Servicios</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/20 flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-[#2563EB]" />
                </div>
                <p className="text-2xl font-bold text-foreground">{providerStats.trabajosCompletados}</p>
                <p className="text-xs text-muted-foreground">Completados</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <p className="text-2xl font-bold text-foreground">{providerStats.trabajosPendientes}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center mb-3">
                  <Star className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <p className="text-2xl font-bold text-foreground">{providerStats.calificacion}</p>
                <p className="text-xs text-muted-foreground">Calificación</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#10B981]">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Ingresos del Mes
                </p>
                <p className="text-2xl font-bold text-[#10B981]">${providerStats.ingresosMes.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#F59E0B]">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Facturas Pendientes
                </p>
                <p className="text-2xl font-bold text-[#F59E0B]">{providerStats.facturasPendientes}</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#3B82F6]">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Mensajes Nuevos
                </p>
                <p className="text-2xl font-bold text-[#3B82F6]">2</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#0F7A5C]" /> Trabajos Recientes
              </h3>
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        job.estado === 'completado' ? 'bg-[#10B981]' :
                        job.estado === 'en_progreso' ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">{job.servicio}</p>
                        <p className="text-xs text-muted-foreground">{job.conjunto} • {job.fecha}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">${job.monto.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        job.estado === 'completado' ? 'bg-[#10B981]/20 text-[#10B981]' :
                        job.estado === 'en_progreso' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                      }`}>
                        {job.estado === 'completado' ? 'Completado' : job.estado === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeProviderTab === 'mis_servicios' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Mis Servicios Publicados</h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D4A3E] text-white font-semibold">
                <Plus className="w-4 h-4" /> Nuevo Servicio
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {misServicios.length > 0 ? misServicios.map((service) => (
                <div key={service.id} className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${CATEGORY_COLORS[service.category] || 'bg-gray-500/20 text-gray-400'}`}>
                      {CATEGORY_LABELS[service.category] || service.category}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{service.provider}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{service.service}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-foreground">{service.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm font-bold text-[#0F7A5C]">{service.price}</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-semibold text-foreground mb-1">No tienes servicios publicados</p>
                  <p className="text-sm text-muted-foreground">Crea tu primer servicio para empezar a recibir clientes</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeProviderTab === 'trabajos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#0F7A5C]" /> Órdenes de Trabajo
              </h3>
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                    <div>
                      <p className="font-medium text-foreground">{job.servicio}</p>
                      <p className="text-xs text-muted-foreground">{job.conjunto} • {job.fecha}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      job.estado === 'completado' ? 'bg-[#10B981]/20 text-[#10B981]' :
                      job.estado === 'en_progreso' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {job.estado === 'completado' ? 'Completado' : job.estado === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeProviderTab === 'facturas' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Facturación</h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D4A3E] text-white font-semibold">
                <Plus className="w-4 h-4" /> Nueva Factura
              </button>
            </div>
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-white/10">
                      <th className="pb-3 font-medium">Factura</th>
                      <th className="pb-3 font-medium">Cliente</th>
                      <th className="pb-3 font-medium">Servicio</th>
                      <th className="pb-3 font-medium">Monto</th>
                      <th className="pb-3 font-medium">Fecha</th>
                      <th className="pb-3 font-medium">Estado</th>
                      <th className="pb-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misFacturas.map((factura) => (
                      <tr key={factura.id} className="border-b border-white/5">
                        <td className="py-3 text-foreground font-medium">{factura.id}</td>
                        <td className="py-3 text-muted-foreground">{factura.cliente}</td>
                        <td className="py-3 text-muted-foreground">{factura.servicio}</td>
                        <td className="py-3 text-foreground font-medium">${factura.monto.toLocaleString()}</td>
                        <td className="py-3 text-muted-foreground">{factura.fecha}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${factura.estado === 'pagado' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                            {factura.estado === 'pagado' ? 'Pagada' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground" title="Descargar">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground" title="Enviar">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeProviderTab === 'notificaciones' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#0F7A5C]" /> Notificaciones
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#3B82F6]/5 border-l-4 border-l-[#3B82F6]">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Nueva orden de trabajo</p>
                    <p className="text-sm text-muted-foreground">Se le ha asignado una nueva orden de mantenimiento</p>
                    <p className="text-xs text-muted-foreground mt-1">Hace 10 minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[rgba(255,255,255,0.04)]">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Pago recibido</p>
                    <p className="text-sm text-muted-foreground">El conjunto Torres del Parque realizó un pago de $1,500,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Hace 2 horas</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Vista normal para usuarios (Super Admin, Propietario, Arrendatario)
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Store className="icon-responsive-lg text-primary" /> Marketplace
            </h1>
            {isSuperAdmin && (
              <p className="text-sm text-[#0F7A5C] font-medium mt-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Vista de Super Administrador - Gestion de proveedores
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Encuentra servicios profesionales para tu conjunto
            </p>
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => setShowAddProviderModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D4A3E] text-white font-semibold hover:bg-[#0D4A3E]/90 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Anadir Proveedor
            </button>
          )}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar servicios o proveedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#0D4A3E]/15 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#0D4A3E]/15 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50"
            >
              <option value="">Todas las categorias</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'new' | 'popular' | 'rated')}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#0D4A3E]/15 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50"
            >
              <option value="rated">Mejor valorados</option>
              <option value="popular">Mas populares</option>
              <option value="new">Mas recientes</option>
            </select>
            <div className="flex rounded-xl border border-[#0D4A3E]/15 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-muted-foreground hover:text-foreground'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-muted-foreground hover:text-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredServices.length} servicios encontrados
        </p>
      </div>

      {/* Services Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedService(service)}
              >
                <div className="relative mb-4">
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-[#0D4A3E]/20 to-[#0F7A5C]/20">
                    <img
                      src={service.coverImage || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=300&fit=crop'}
                      alt={service.provider}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {service.badge && (
                    <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      service.badge === 'recommended' ? 'bg-emerald-500 text-white' :
                      service.badge === 'popular' ? 'bg-blue-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}>
                      {service.badge === 'recommended' ? 'Recomendado' :
                       service.badge === 'popular' ? 'Popular' : 'Nuevo'}
                    </span>
                  )}
                  {!service.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                      <span className="text-white font-semibold">No disponible</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <h3 className="font-bold text-foreground mb-1">{service.provider}</h3>
                  <p className="text-sm text-muted-foreground">{service.service}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${CATEGORY_COLORS[service.category] || 'bg-gray-500/20 text-gray-400'}`}>
                    {CATEGORY_LABELS[service.category] || service.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-foreground">{service.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({service.reviews})</span>
                  </div>
                  <span className="text-sm font-bold text-[#0F7A5C]">{service.price}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md hover:shadow-lg transition-all cursor-pointer flex gap-4"
                onClick={() => setSelectedService(service)}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#0D4A3E]/20 to-[#0F7A5C]/20 flex-shrink-0">
                  <img
                    src={service.coverImage || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=300&fit=crop'}
                    alt={service.provider}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground">{service.provider}</h3>
                      <p className="text-sm text-muted-foreground">{service.service}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border flex-shrink-0 ${CATEGORY_COLORS[service.category] || 'bg-gray-500/20 text-gray-400'}`}>
                      {CATEGORY_LABELS[service.category] || service.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-foreground">{service.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({service.reviews} resenas)</span>
                    </div>
                    <span className="text-sm font-bold text-[#0F7A5C]">{service.price}</span>
                    {!service.available && (
                      <span className="text-xs text-red-400">No disponible</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredServices.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-lg font-semibold text-foreground mb-1">No se encontraron servicios</p>
          <p className="text-sm text-muted-foreground">Intenta con otros filtros de busqueda</p>
        </motion.div>
      )}

      {/* Floating Modal for Service Details */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#0D4A3E]/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Image */}
              <div className="relative h-48">
                <img
                  src={selectedService.coverImage || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=300&fit=crop'}
                  alt={selectedService.provider}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[selectedService.category] || 'bg-gray-500/20 text-gray-400'}`}>
                    {CATEGORY_LABELS[selectedService.category] || selectedService.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedService.provider}</h2>
                    <p className="text-muted-foreground">{selectedService.service}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-amber-400">{selectedService.rating.toFixed(1)}</span>
                    <span className="text-xs text-amber-400/70">({selectedService.reviews})</span>
                  </div>
                </div>

                {selectedService.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Descripcion</h3>
                    <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                  </div>
                )}

                {selectedService.services && selectedService.services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Servicios</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.services.map((svc, i) => (
                        <span key={i} className="px-3 py-1 bg-[rgba(255,255,255,0.06)] rounded-lg text-xs text-foreground">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {selectedService.phone && (
                    <a
                      href={`tel:${selectedService.phone}`}
                      className="flex items-center gap-3 p-4 rounded-xl bg-[#0D4A3E]/5 border border-[#0D4A3E]/20 hover:bg-[#0D4A3E]/10 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-[#0D4A3E]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Telefono</p>
                        <p className="font-semibold text-sm text-foreground">{selectedService.phone}</p>
                      </div>
                    </a>
                  )}

                  {selectedService.email && (
                    <a
                      href={`mailto:${selectedService.email}`}
                      className="flex items-center gap-3 p-4 rounded-xl bg-[#0D4A3E]/5 border border-[#0D4A3E]/20 hover:bg-[#0D4A3E]/10 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-[#0D4A3E]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-semibold text-sm text-foreground">{selectedService.email}</p>
                      </div>
                    </a>
                  )}

                  {selectedService.address && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0D4A3E]/5 border border-[#0D4A3E]/20">
                      <MapPin className="w-5 h-5 text-[#0D4A3E] mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Direccion</p>
                        <p className="font-semibold text-sm text-foreground">{selectedService.address}</p>
                      </div>
                    </div>
                  )}

                  {selectedService.schedule && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0D4A3E]/5 border border-[#0D4A3E]/20">
                      <Clock className="w-5 h-5 text-[#0D4A3E] mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Horario</p>
                        <p className="font-semibold text-sm text-foreground">{selectedService.schedule}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#0D4A3E]/10 to-[#0F7A5C]/10 border border-[#0F7A5C]/20">
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Precio estimado</p>
                  <p className="text-2xl font-bold text-[#0F7A5C]">{selectedService.price}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-background flex gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.06)] text-foreground font-semibold hover:bg-[rgba(255,255,255,0.10)] transition-colors"
                >
                  Cerrar
                </button>
                <button className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D4A3E] text-white font-semibold hover:bg-[#0D4A3E]/90 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contactar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Provider Modal - Super Admin Only */}
      <AnimatePresence>
        {showAddProviderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseAddProviderModal}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#0D4A3E]/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 bg-gradient-to-r from-[#0D4A3E] via-[#0F7A5C] to-[#0D4A3E]" />
              <div className="p-5 border-b bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white shadow-lg">
                      <BriefcaseIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#0F7A5C]" />
                        Anadir Nuevo Proveedor
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">Registra un nuevo proveedor en el sistema</p>
                    </div>
                  </div>
                  <button onClick={handleCloseAddProviderModal} className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#0F7A5C]" />
                    Nombre de la Empresa *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newProvider.name}
                      onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                      placeholder="Ej: ServiFix S.A.S"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 transition-all"
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#0F7A5C]" />
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={newProvider.email}
                        onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                        placeholder="contacto@empresa.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 transition-all"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#0F7A5C]" />
                      Telefono *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={newProvider.phone}
                        onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                        placeholder="+57 300 555 1234"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 transition-all"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0F7A5C]" />
                      NIT / Documento *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newProvider.document}
                        onChange={(e) => setNewProvider({ ...newProvider, document: e.target.value })}
                        placeholder="900.123.456-7"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 transition-all"
                      />
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#0F7A5C]" />
                      Categoria
                    </label>
                    <div className="relative">
                      <select
                        value={newProvider.category}
                        onChange={(e) => setNewProvider({ ...newProvider, category: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 transition-all appearance-none"
                      >
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <Grid className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0F7A5C]" />
                    Direccion
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newProvider.address}
                      onChange={(e) => setNewProvider({ ...newProvider, address: e.target.value })}
                      placeholder="Calle 85 #15-30, Bogota"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 transition-all"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#0F7A5C]" />
                    Descripcion
                  </label>
                  <div className="relative">
                    <textarea
                      value={newProvider.description}
                      onChange={(e) => setNewProvider({ ...newProvider, description: e.target.value })}
                      placeholder="Descripcion de los servicios que ofrece..."
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 transition-all resize-none"
                    />
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-[#0F7A5C]" />
                    Certificaciones
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newProvider.certifications}
                      onChange={(e) => setNewProvider({ ...newProvider, certifications: e.target.value })}
                      placeholder="ISO 9001, Certificacion de Seguridad (separadas por coma)"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50 transition-all"
                    />
                    <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#0F7A5C]" />
                    Logo del Proveedor
                  </label>
                  <div className="border border-dashed border-[#0D4A3E]/30 rounded-xl p-6 text-center hover:border-[#0F7A5C]/50 transition-colors cursor-pointer bg-[rgba(255,255,255,0.02)]">
                    <div className="w-16 h-16 rounded-2xl bg-[#0D4A3E]/10 flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8 text-[#0F7A5C]" />
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1">Arrastra una imagen o haz clic para seleccionar</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#0F7A5C]" />
                    Galeria de Imagenes (Trabajos realizados)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-xl border border-dashed border-[#0D4A3E]/30 flex items-center justify-center hover:border-[#0F7A5C]/50 transition-colors cursor-pointer bg-[rgba(255,255,255,0.02)]">
                        <div className="text-center">
                          <Camera className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                          <span className="text-[10px] text-muted-foreground">Agregar</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Agrega hasta 6 imagenes de trabajos realizados</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 px-5 py-4 border-t border-[#0D4A3E]/10 flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCloseAddProviderModal}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddProvider}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] hover:from-[#0F7A5C] hover:to-[#0D4A3E] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  Registrar Proveedor
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplacePage;
