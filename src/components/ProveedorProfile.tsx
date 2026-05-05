import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, Wrench, Star, CreditCard, Mail, Phone, 
  User, CheckCircle, AlertCircle, Send, Download, Eye,
  Shield, FileCheck, TrendingUp, MessageSquare, Bell, Upload, Award,
  Activity, ClipboardList, Edit, Clock, DollarSign as DollarIcon, CalendarDays,
  ChevronDown, ChevronUp, RefreshCw, MoreVertical, PhoneCall, MessageCircle, FileSignature,
  BadgeCheck, AlertTriangle, CheckSquare, XCircle, Circle, Plus, Filter, Search,
  Target, Zap, BarChart3, PieChart, TrendingDown, Clock3, CheckCircle2, CircleDot,
  Briefcase as BriefcaseIcon, MapPinned, Globe, Languages, Wallet, FileCheck2, ClipboardCheck,
  UserCheck, ClipboardList as ClipList, BellRing, MailOpen, Save, X, FilePlus, CalendarPlus, UserPlus,
  Truck, Building, FileText, Calendar, Contact, Car as CarIcon, Badge
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type SectionKey = 'resumen' | 'servicios' | 'historial' | 'agenda' | 'facturas' | 'accesos' | 'notificaciones' | 'documentos';

const ProveedorProfile = () => {
  const [expandedSection, setExpandedSection] = useState<SectionKey>('resumen');
  const [isEditing, setIsEditing] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const [providerData, setProviderData] = useState({
    name: 'Servicios Integrales de Mantenimiento S.A.S',
    type: 'Mantenimiento',
    description: 'Empresa especializada en mantenimiento integral de conjuntos residenciales.',
    document: '900.123.456-7',
    nit: '9001234567',
    phone: '+57 300 123 4567',
    email: 'contacto@simantenimiento.com',
    status: 'active',
    verified: true,
    rating: 4.8,
    totalServices: 156,
    responseTime: '2.5 horas',
    categories: ['Mantenimiento', 'Electricidad', 'Plomería', 'HVAC', 'Jardinería'],
    coverage: ['Norte de Bogotá', 'Zona Franca', 'Cajicá', 'Chía', 'La Calera'],
  });

  const [invoiceForm, setInvoiceForm] = useState({ 
    client: '', service: '', amount: '', description: '', date: '', 
    dueDate: '', iva: '', subtotal: '', status: 'pending', sent: false 
  });
  const [scheduleForm, setScheduleForm] = useState({ 
    service: '', condo: '', date: '', time: '', notes: '', 
    technician: '', priority: 'normal', contactPhone: '' 
  });
  const [staffForm, setStaffForm] = useState({ 
    name: '', role: '', phone: '', document: '', 
    email: '', bloodType: '', eps: '', arl: '', address: '' 
  });
  const [vehicleForm, setVehicleForm] = useState({ 
    plate: '', type: '', brand: '', model: '', 
    color: '', propertyCard: '', soat: '', technomechanical: '' 
  });

  const activeOrders = [
    { id: 'OT-001', title: 'Reparación sistema de bombeo', condo: 'Torres del Parque', priority: 'high', date: '2024-01-15', status: 'in_progress' },
    { id: 'OT-002', title: 'Mantenimiento HVAC Torre A', condo: 'Res. La Florida', priority: 'medium', date: '2024-01-16', status: 'pending' },
    { id: 'OT-003', title: 'Revisión eléctrica zona común', condo: 'Conjunto San Felipe', priority: 'high', date: '2024-01-17', status: 'in_progress' },
    { id: 'OT-004', title: 'Cambio de filtros aire acondicionado', condo: 'Torres del Norte', priority: 'medium', date: '2024-01-18', status: 'pending' },
    { id: 'OT-005', title: 'Instalación de cámaras seguridad', condo: 'Res. Bella Vista', priority: 'high', date: '2024-01-18', status: 'pending' },
    { id: 'OT-006', title: 'Mantenimiento de jardines áreas comunes', condo: 'Conjunto Privado Las Palmas', priority: 'low', date: '2024-01-19', status: 'pending' },
  ];

  const serviceHistory = [
    { month: 'Enero 2024', services: 12, revenue: 4500000, rating: 4.9, condos: ['Torres del Parque', 'Res. La Florida'] },
    { month: 'Diciembre 2023', services: 8, revenue: 3200000, rating: 4.7, condos: ['Conjunto San Felipe'] },
    { month: 'Noviembre 2023', services: 15, revenue: 5800000, rating: 4.8, condos: ['Torres del Parque', 'Res. La Florida', 'Conjunto San Felipe'] },
    { month: 'Octubre 2023', services: 18, revenue: 6200000, rating: 4.9, condos: ['Torres del Norte', 'Res. Bella Vista'] },
    { month: 'Septiembre 2023', services: 14, revenue: 5100000, rating: 4.6, condos: ['Conjunto Privado Las Palmas'] },
    { month: 'Agosto 2023', services: 11, revenue: 4800000, rating: 4.8, condos: ['Torres del Parque', 'Conjunto San Felipe'] },
    { month: 'Julio 2023', services: 16, revenue: 5900000, rating: 4.7, condos: ['Res. La Florida', 'Torres del Norte'] },
    { month: 'Junio 2023', services: 13, revenue: 4700000, rating: 4.9, condos: ['Res. Bella Vista'] },
  ];

  const schedule = [
    { day: 'Lunes', date: '15', service: 'Mantenimiento HVAC', condo: 'Res. La Florida', time: '09:00 AM', status: 'confirmed' },
    { day: 'Martes', date: '16', service: 'Revisión eléctrica', condo: 'Torres del Parque', time: '02:00 PM', status: 'confirmed' },
    { day: 'Miércoles', date: '17', service: 'Limpieza ducts', condo: 'Conjunto San Felipe', time: '10:00 AM', status: 'pending' },
    { day: 'Jueves', date: '18', service: 'Cambio filtros AC', condo: 'Torres del Norte', time: '08:00 AM', status: 'pending' },
    { day: 'Viernes', date: '19', service: 'Instalación cámaras', condo: 'Res. Bella Vista', time: '11:00 AM', status: 'pending' },
    { day: 'Lunes', date: '22', service: 'Mantenimiento jardines', condo: 'Conjunto Privado Las Palmas', time: '09:00 AM', status: 'pending' },
    { day: 'Martes', date: '23', service: 'Revisión bombeo', condo: 'Torres del Parque', time: '02:00 PM', status: 'pending' },
    { day: 'Miércoles', date: '24', service: 'Reparación fontanería', condo: 'Res. La Florida', time: '10:00 AM', status: 'pending' },
  ];

  const invoices = [
    { id: 'FAC-001', client: 'Torres del Parque', service: 'Mantenimiento sist. bombeo', amount: 1500000, date: '2024-01-15', status: 'pending', sent: false },
    { id: 'FAC-002', client: 'Res. La Florida', service: 'Reparación HVAC', amount: 850000, date: '2024-01-12', status: 'paid', sent: true },
    { id: 'FAC-003', client: 'Conjunto San Felipe', service: 'Servicio eléctrico', amount: 420000, date: '2024-01-10', status: 'pending', sent: true },
    { id: 'FAC-004', client: 'Torres del Parque', service: 'Mantenimiento mensual diciembre', amount: 1200000, date: '2024-01-05', status: 'paid', sent: true },
    { id: 'FAC-005', client: 'Res. La Florida', service: 'Reparación fontanería', amount: 350000, date: '2024-01-03', status: 'paid', sent: true },
    { id: 'FAC-006', client: 'Torres del Norte', service: 'Cambio filtros AC', amount: 680000, date: '2023-12-28', status: 'paid', sent: true },
    { id: 'FAC-007', client: 'Res. Bella Vista', service: 'Instalación cámaras', amount: 2500000, date: '2023-12-25', status: 'paid', sent: true },
    { id: 'FAC-008', client: 'Conjunto Privado Las Palmas', service: 'Mantenimiento jardines', amount: 920000, date: '2023-12-20', status: 'paid', sent: true },
    { id: 'FAC-009', client: 'Conjunto San Felipe', service: 'Revisión sistema eléctrico', amount: 550000, date: '2023-12-15', status: 'paid', sent: true },
  ];

  const notifications = [
    { id: 1, type: 'order', title: 'Nueva orden de trabajo', message: 'Se le ha asignado una nueva orden de mantenimiento para Torres del Norte', time: '10:30 AM', read: false },
    { id: 2, type: 'payment', title: 'Pago recibido', message: 'El conjunto Torres del Parque realizó un pago de $1,500,000', time: '09:15 AM', read: true },
    { id: 3, type: 'message', title: 'Nuevo mensaje', message: 'La administración de Res. Bella Vista tiene un mensaje para usted', time: '09:00 AM', read: false },
    { id: 4, type: 'alert', title: 'Orden urgente', message: 'Se requiere atención inmediata en Torre A - Torres del Parque', time: 'Ayer', read: false },
    { id: 5, type: 'order', title: 'Orden completada', message: 'La orden OT-003 ha sido marcada como completada', time: 'Ayer', read: true },
    { id: 6, type: 'payment', title: 'Pago recibido', message: 'El conjunto Res. La Florida realizó un pago de $850,000', time: 'Ayer', read: true },
    { id: 7, type: 'message', title: 'Nuevo mensaje', message: 'El administrador de Conjunto San Felipe solicita cotización', time: 'Hace 2 días', read: true },
    { id: 8, type: 'order', title: 'Nueva orden asignada', message: 'Se le ha asignado mantenimiento de HVAC para la próxima semana', time: 'Hace 2 días', read: true },
  ];

  const certifications = [
    { name: 'Certificación ISO 9001', issuer: 'ICONTEC', validUntil: '2025-06-15', status: 'valid' },
    { name: 'Licencia de gas', issuer: 'Alcaldía de Bogotá', validUntil: '2024-12-31', status: 'valid' },
    { name: 'Póliza RC', issuer: 'Seguros Bolívar', validUntil: '2024-08-20', status: 'valid' },
    { name: 'Afiliación ARL', issuer: 'Positiva ARL', validUntil: '2024-12-31', status: 'valid' },
    { name: 'Certificación OSHA', issuer: 'Instituto Seguridad Laboral', validUntil: '2025-03-10', status: 'valid' },
    { name: 'Licencia de manejo', issuer: 'Ministerio de Transporte', validUntil: '2026-01-15', status: 'valid' },
  ];

  const staffMembers = [
    { id: 1, name: 'Juan Pérez García', role: 'Líder de equipo', phone: '+57 300 123 4567', document: 'CC: 80123456', status: 'active' },
    { id: 2, name: 'Mario Gómez Rodríguez', role: 'Electricista', phone: '+57 300 234 5678', document: 'CC: 80156789', status: 'active' },
    { id: 3, name: 'Carlos López Mendoza', role: 'Plomero', phone: '+57 300 345 6789', document: 'CC: 80190123', status: 'active' },
    { id: 4, name: 'Pedro Ramírez Castro', role: 'Auxiliar general', phone: '+57 300 456 7890', document: 'CC: 80234567', status: 'active' },
    { id: 5, name: 'Roberto Sánchez Vélez', role: 'Técnico HVAC', phone: '+57 300 567 8901', document: 'CC: 80278901', status: 'active' },
    { id: 6, name: 'Andrés Moreno Herrera', role: 'Jardinero', phone: '+57 300 678 9012', document: 'CC: 80312345', status: 'active' },
    { id: 7, name: 'Diego Torres López', role: 'Técnico de sonido', phone: '+57 300 789 0123', document: 'CC: 80356789', status: 'inactive' },
  ];

  const vehicles = [
    { id: 1, plate: 'ABC-123', type: 'Camioneta', brand: 'Toyota', model: 'Hilux', color: 'Blanco', status: 'active' },
    { id: 2, plate: 'XYZ-987', type: 'Motocicleta', brand: 'Yamaha', model: 'MT-09', color: 'Negra', status: 'active' },
    { id: 3, plate: 'KLM-456', type: 'Camión', brand: 'Chevrolet', model: 'NHR', color: 'Gris', status: 'active' },
    { id: 4, plate: 'DEF-789', type: 'Automóvil', brand: 'Renault', model: 'Logan', color: 'Azul', status: 'active' },
    { id: 5, plate: 'GHI-012', type: 'Van', brand: 'Mercedes', model: 'Sprinter', color: 'Blanca', status: 'inactive' },
  ];

  const handleSave = () => { setIsEditing(false); toast({ title: 'Información guardada', description: 'Los cambios han sido guardados exitosamente' }); };
  const handleSaveInvoice = () => { setShowInvoiceModal(false); setInvoiceForm({ client: '', service: '', amount: '', description: '', date: '', dueDate: '', iva: '', subtotal: '', status: 'pending', sent: false }); toast({ title: 'Factura creada', description: 'La factura ha sido creada exitosamente' }); };
  const handleSaveSchedule = () => { setShowScheduleModal(false); setScheduleForm({ service: '', condo: '', date: '', time: '', notes: '', technician: '', priority: 'normal', contactPhone: '' }); toast({ title: 'Servicio programado', description: 'El servicio ha sido programado exitosamente' }); };
  const handleSaveStaff = () => { setShowStaffModal(false); setStaffForm({ name: '', role: '', phone: '', document: '', email: '', bloodType: '', eps: '', arl: '', address: '' }); toast({ title: 'Personal agregado', description: 'El miembro del personal ha sido agregado exitosamente' }); };
  const handleSaveVehicle = () => { setShowVehicleModal(false); setVehicleForm({ plate: '', type: '', brand: '', model: '', color: '', propertyCard: '', soat: '', technomechanical: '' }); toast({ title: 'Vehículo agregado', description: 'El vehículo ha sido autorizado exitosamente' }); };

  const sections = [
    { id: 'resumen', label: 'Resumen', icon: BriefcaseIcon, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', iconColor: 'text-emerald-400' },
    { id: 'servicios', label: 'Servicios', icon: Wrench, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', iconColor: 'text-blue-400' },
    { id: 'historial', label: 'Historial', icon: ClipList, color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30', iconColor: 'text-violet-400' },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays, color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', iconColor: 'text-orange-400' },
    { id: 'facturas', label: 'Facturación', icon: Wallet, color: 'from-cyan-500 to-sky-600', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', iconColor: 'text-cyan-400' },
    { id: 'accesos', label: 'Accesos', icon: Shield, color: 'from-red-500 to-rose-600', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', iconColor: 'text-red-400' },
    { id: 'notificaciones', label: 'Notificaciones', icon: BellRing, color: 'from-pink-500 to-rose-600', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30', iconColor: 'text-pink-400' },
    { id: 'documentos', label: 'Documentos', icon: FileCheck2, color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', iconColor: 'text-green-400' },
  ];

  const Modal = ({ isOpen, onClose, title, icon: Icon, color, children, onSave, saveLabel = 'Guardar' }: { isOpen: boolean; onClose: () => void; title: string; icon: React.ComponentType<{ className?: string }>; color: string; children: React.ReactNode; onSave: () => void; saveLabel?: string }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-background rounded-2xl w-full max-w-lg overflow-hidden border border-[#0D4A3E]/20 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className={`p-5 border-b bg-gradient-to-r ${color} bg-opacity-10`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{title}</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">{children}</div>
            <div className="p-4 border-t bg-background flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.06)] text-foreground font-semibold hover:bg-[rgba(255,255,255,0.1)]">Cancelar</button>
              <button onClick={onSave} className={`flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r ${color} text-white font-semibold hover:opacity-90 flex items-center justify-center gap-2`}>
                <Save className="w-4 h-4" />{saveLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderContent = () => {
    switch (expandedSection) {
      case 'resumen':
        return (
          <div className="space-y-6">
            <div className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${sections[0].color} bg-opacity-10 border border-[#0F7A5C]`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${providerData.status === 'active' ? 'bg-[#10B981]' : 'bg-[#EF4444]'} animate-pulse`} />
                <span className="font-medium text-foreground">Proveedor {providerData.status === 'active' ? 'Activo' : 'Inactivo'}</span>
              </div>
              {providerData.verified && <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6]"><BadgeCheck className="w-4 h-4" /><span className="text-sm">Verificado</span></div>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {isEditing ? (
                  <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md border-l-4 border-l-[#0F7A5C] space-y-4">
                    <div><label className="text-xs text-muted-foreground uppercase tracking-wide">Nombre de la Empresa</label><input type="text" value={providerData.name} onChange={(e) => setProviderData({...providerData, name: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-foreground" /></div>
                    <div><label className="text-xs text-muted-foreground uppercase tracking-wide">Descripción</label><textarea value={providerData.description} onChange={(e) => setProviderData({...providerData, description: e.target.value})} rows={3} className="w-full mt-1 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-foreground" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs text-muted-foreground uppercase tracking-wide">Teléfono</label><input type="text" value={providerData.phone} onChange={(e) => setProviderData({...providerData, phone: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-foreground" /></div>
                      <div><label className="text-xs text-muted-foreground uppercase tracking-wide">Email</label><input type="email" value={providerData.email} onChange={(e) => setProviderData({...providerData, email: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-foreground" /></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md border-l-4 border-l-[#0F7A5C]">
                    <div className="flex items-start justify-between mb-4">
                      <div><h3 className="text-xl font-bold text-foreground truncate">{providerData.name}</h3><p className="text-muted-foreground truncate">{providerData.type}</p></div>
                      <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground"><Edit className="w-5 h-5" /></button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{providerData.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Documento</p><p className="font-medium text-foreground truncate">{providerData.document}</p></div>
                      <div><p className="text-muted-foreground">NIT</p><p className="font-medium text-foreground truncate">{providerData.nit}</p></div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md border-l-4 border-l-[#8B5CF6]">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-[#8B5CF6]" /> Datos de Contacto</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.04)]"><div className="w-10 h-10 rounded-lg bg-[#0D4A3E]/20 flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-[#0F7A5C]" /></div><div className="min-w-0"><p className="text-xs text-muted-foreground truncate">Teléfono</p><p className="font-medium text-foreground truncate">{providerData.phone}</p></div></div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.04)]"><div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-[#3B82F6]" /></div><div className="min-w-0"><p className="text-xs text-muted-foreground truncate">Correo</p><p className="font-medium text-foreground truncate">{providerData.email}</p></div></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md text-center border-t-4 border-t-[#6366F1]">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center mx-auto mb-4"><Star className="w-10 h-10 text-white" /></div>
                  <p className="text-4xl font-bold text-foreground">{providerData.rating}</p>
                  <p className="text-muted-foreground">Calificación</p>
                </div>
                <div className="bg-white rounded-xl border border-black/8 p-6 shadow-sm hover:shadow-md border-t-4 border-t-[#06B6D4]">
                  <h4 className="font-semibold text-foreground mb-4">Estadísticas</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground flex items-center gap-2"><BriefcaseIcon className="w-4 h-4 text-[#0F7A5C]" /> Servicios</span><span className="font-bold text-foreground">{providerData.totalServices}</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground flex items-center gap-2"><Clock3 className="w-4 h-4 text-[#3B82F6]" /> Respuesta</span><span className="font-bold text-[#10B981]">{providerData.responseTime}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#F97316]">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><BriefcaseIcon className="w-4 h-4 text-[#F97316]" /> Servicios</h4>
                <div className="flex flex-wrap gap-2">{providerData.categories.map((cat, i) => (<span key={i} className="px-3 py-1.5 rounded-full bg-[#F97316]/20 text-[#F97316] text-sm font-medium truncate">{cat}</span>))}</div>
              </div>
              <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#06B6D4]">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><MapPinned className="w-4 h-4 text-[#06B6D4]" /> Cobertura</h4>
                <div className="flex flex-wrap gap-2">{providerData.coverage.map((zone, i) => (<span key={i} className="px-3 py-1.5 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] text-sm font-medium truncate">{zone}</span>))}</div>
              </div>
            </div>
          </div>
        );

      case 'servicios':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#3B82F6]">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Wrench className="w-4 h-4 text-[#3B82F6]" /> Órdenes Activas ({activeOrders.length})</h4>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${order.status === 'in_progress' ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'}`} />
                      <div className="min-w-0"><p className="font-medium text-foreground truncate">{order.title}</p><p className="text-xs text-muted-foreground truncate">{order.condo} • {order.date}</p></div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${order.priority === 'high' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>{order.priority === 'high' ? 'Urgente' : 'Normal'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'historial':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#8B5CF6]">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-[#8B5CF6]" /> Historial de Servicios</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground border-b border-white/10"><th className="pb-3 font-medium">Mes</th><th className="pb-3 font-medium">Servicios</th><th className="pb-3 font-medium">Ingresos</th><th className="pb-3 font-medium">Calificación</th></tr></thead>
                  <tbody>
                    {serviceHistory.map((record, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-3 text-foreground font-medium">{record.month}</td>
                        <td className="py-3 text-muted-foreground">{record.services}</td>
                        <td className="py-3 text-[#10B981] font-medium">${record.revenue.toLocaleString()}</td>
                        <td className="py-3"><div className="flex items-center gap-1"><Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" /><span className="text-foreground">{record.rating}</span></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'agenda':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#F97316]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#F97316]" /> Agenda de Servicios</h4>
                <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm hover:opacity-90">
                  <CalendarPlus className="w-4 h-4" /> Programar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedule.map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><span className="text-lg font-bold text-[#F97316]">{item.day}</span><span className="text-muted-foreground">{item.date}</span></div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'confirmed' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>{item.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}</span>
                    </div>
                    <p className="font-medium text-foreground truncate">{item.service}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.condo}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> {item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'facturas':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#06B6D4]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Wallet className="w-4 h-4 text-[#06B6D4]" /> Facturación</h4>
                <button onClick={() => setShowInvoiceModal(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white text-sm hover:opacity-90">
                  <FilePlus className="w-4 h-4" /> Nueva Factura
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground border-b border-white/10"><th className="pb-3 font-medium">Factura</th><th className="pb-3 font-medium">Cliente</th><th className="pb-3 font-medium">Monto</th><th className="pb-3 font-medium">Estado</th></tr></thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-white/5">
                        <td className="py-3 text-foreground font-medium">{invoice.id}</td>
                        <td className="py-3 text-muted-foreground truncate max-w-[120px]">{invoice.client}</td>
                        <td className="py-3 text-foreground font-medium">${invoice.amount.toLocaleString()}</td>
                        <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${invoice.status === 'paid' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>{invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'accesos':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#EF4444]">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#EF4444]" /> Personal Autorizado ({staffMembers.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {staffMembers.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.04)]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${person.status === 'active' ? 'bg-[#10B981]/20' : 'bg-gray-500/20'}`}>
                        <User className={`w-5 h-5 ${person.status === 'active' ? 'text-[#10B981]' : 'text-gray-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${person.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-gray-500/20 text-gray-400'}`}>{person.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowStaffModal(true)} className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] text-white text-sm hover:opacity-90">
                <UserPlus className="w-4 h-4" /> Agregar Personal
              </button>
            </div>
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#3B82F6]">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><CarIcon className="w-4 h-4 text-[#3B82F6]" /> Vehículos ({vehicles.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.04)]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${vehicle.status === 'active' ? 'bg-[#3B82F6]/20' : 'bg-gray-500/20'}`}>
                        <CarIcon className={`w-5 h-5 ${vehicle.status === 'active' ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{vehicle.plate}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${vehicle.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-gray-500/20 text-gray-400'}`}>{vehicle.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowVehicleModal(true)} className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white text-sm hover:opacity-90">
                <Truck className="w-4 h-4" /> Agregar Vehículo
              </button>
            </div>
          </div>
        );

      case 'notificaciones': {
        const shown = showAllNotifications ? notifications : notifications.slice(0, 3);
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#EC4899]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><BellRing className="w-4 h-4 text-[#EC4899]" /> Notificaciones ({notifications.length})</h4>
                <button className="text-xs text-[#3B82F6] hover:underline" onClick={() => setShowAllNotifications(!showAllNotifications)}>{showAllNotifications ? 'Ver menos' : 'Ver todas'}</button>
              </div>
              <div className="space-y-3">
                {shown.map((notif) => (
                  <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-lg ${notif.read ? 'bg-[rgba(255,255,255,0.04)]' : 'bg-[#3B82F6]/5 border-l-4 border-l-[#3B82F6]'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'order' ? 'bg-[#3B82F6]/20' : notif.type === 'payment' ? 'bg-[#10B981]/20' : 'bg-[#8B5CF6]/20'}`}>
                      {notif.type === 'order' ? <ClipboardList className="w-5 h-5 text-[#3B82F6]" /> : notif.type === 'payment' ? <CreditCard className="w-5 h-5 text-[#10B981]" /> : <MessageSquare className="w-5 h-5 text-[#8B5CF6]" />}
                    </div>
                    <div className="flex-1 min-w-0"><p className="font-medium text-foreground">{notif.title}</p><p className="text-sm text-muted-foreground truncate">{notif.message}</p><p className="text-xs text-muted-foreground mt-1">{notif.time}</p></div>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-[#3B82F6] flex-shrink-0 mt-2" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'documentos':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#6366F1]">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-[#6366F1]" /> Subir Documentos</h4>
              <div className="border border-dashed border-[rgba(255,255,255,0.2)] rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Arrastra archivos aquí o haz clic para subir</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG hasta 10MB</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 rounded-xl border-l-4 border-l-[#F59E0B]">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><FileSignature className="w-4 h-4 text-[#F59E0B]" /> Certificaciones</h4>
              <div className="space-y-3">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.04)]">
                    <div className="flex items-center gap-3 min-w-0"><FileCheck className="w-5 h-5 text-muted-foreground flex-shrink-0" /><div className="min-w-0"><p className="text-sm font-medium text-foreground truncate">{cert.name}</p><p className="text-xs text-muted-foreground">Vence: {cert.validUntil}</p></div></div>
                    <span className="px-2 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs">Vigente</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl md:text-3xl font-bold text-foreground">Mi Perfil</h1><p className="text-sm text-muted-foreground mt-1">Gestiona tu información y servicios</p></div>
        {isEditing && <div className="flex gap-2"><button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500/20 text-foreground hover:bg-gray-500/30"><X className="w-4 h-4" /> Cancelar</button><button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D4A3E] text-white hover:bg-[#0D4A3E]/80"><Save className="w-4 h-4" /> Guardar</button></div>}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-4 rounded-2xl sticky top-4 shadow-xl border border-white/10">
            <div className="mb-4 pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent px-2">
                Navegación
              </h3>
              <p className="text-xs text-muted-foreground px-2 mt-1">Gestiona tu perfil</p>
            </div>
            <nav className="space-y-2">
              {sections.map((section) => {
                const isActive = expandedSection === section.id;
                return (
                  <button 
                    key={section.id} 
                    onClick={() => setExpandedSection(section.id as SectionKey)} 
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg` 
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 ${
                      isActive ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <section.icon className={`w-5 h-5 ${isActive ? 'text-white' : section.iconColor || 'text-muted-foreground'}`} />
                    </div>
                    <span className="font-semibold truncate relative z-10">{section.label}</span>
                    {isActive ? (
                      <ChevronUp className="w-5 h-5 ml-auto flex-shrink-0 relative z-10" />
                    ) : (
                      <ChevronDown className="w-5 h-5 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sistema activo</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <motion.div key={expandedSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{renderContent()}</motion.div>
        </div>
      </div>

      {/* Invoice Modal - COMPLETO */}
      <Modal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} title="Nueva Factura" icon={FilePlus} color="from-[#06B6D4] to-[#0891B2]" onSave={handleSaveInvoice} saveLabel="Crear Factura">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cliente *</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select value={invoiceForm.client} onChange={(e) => setInvoiceForm({...invoiceForm, client: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="">Seleccionar cliente</option>
                <option value="Torres del Parque">Torres del Parque</option>
                <option value="Res. La Florida">Res. La Florida</option>
                <option value="Conjunto San Felipe">Conjunto San Felipe</option>
                <option value="Torres del Norte">Torres del Norte</option>
                <option value="Res. Bella Vista">Res. Bella Vista</option>
                <option value="Conjunto Privado Las Palmas">Conjunto Privado Las Palmas</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Servicio *</label>
            <div className="relative">
              <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select value={invoiceForm.service} onChange={(e) => setInvoiceForm({...invoiceForm, service: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="">Seleccionar servicio</option>
                <option value="Mantenimiento HVAC">Mantenimiento HVAC</option>
                <option value="Reparación eléctrica">Reparación eléctrica</option>
                <option value="Mantenimiento fontanería">Mantenimiento fontanería</option>
                <option value="Limpieza general">Limpieza general</option>
                <option value="Mantenimiento jardines">Mantenimiento jardines</option>
                <option value="Reparación bombeo">Reparación sistema de bombeo</option>
                <option value="Instalación cámaras">Instalación de cámaras</option>
                <option value="Otro">Otro servicio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha Emisión *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="date" value={invoiceForm.date} onChange={(e) => setInvoiceForm({...invoiceForm, date: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha Vencimiento *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm({...invoiceForm, dueDate: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subtotal ($) *</label>
              <div className="relative">
                <DollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="number" value={invoiceForm.subtotal} onChange={(e) => setInvoiceForm({...invoiceForm, subtotal: e.target.value})} placeholder="0" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">IVA ($)</label>
              <div className="relative">
                <DollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="number" value={invoiceForm.iva} onChange={(e) => setInvoiceForm({...invoiceForm, iva: e.target.value})} placeholder="0" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Monto Total ($) *</label>
            <div className="relative">
              <DollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="number" value={invoiceForm.amount} onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})} placeholder="0" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Descripción del Servicio</label>
            <textarea value={invoiceForm.description} onChange={(e) => setInvoiceForm({...invoiceForm, description: e.target.value})} placeholder="Describa el servicio realizado..." rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Estado</label>
            <select value={invoiceForm.status} onChange={(e) => setInvoiceForm({...invoiceForm, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
              <option value="pending">Pendiente</option>
              <option value="sent">Enviada</option>
              <option value="paid">Pagada</option>
              <option value="overdue">Vencida</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Schedule Modal - COMPLETO */}
      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Programar Servicio" icon={CalendarPlus} color="from-[#F97316] to-[#EA580C]" onSave={handleSaveSchedule} saveLabel="Programar">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tipo de Servicio *</label>
            <div className="relative">
              <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select value={scheduleForm.service} onChange={(e) => setScheduleForm({...scheduleForm, service: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="">Seleccionar servicio</option>
                <option value="Mantenimiento HVAC">Mantenimiento HVAC</option>
                <option value="Reparación eléctrica">Reparación eléctrica</option>
                <option value="Mantenimiento fontanería">Mantenimiento fontanería</option>
                <option value="Limpieza general">Limpieza general</option>
                <option value="Mantenimiento jardines">Mantenimiento jardines</option>
                <option value="Reparación bombeo">Reparación sistema de bombeo</option>
                <option value="Instalación cámaras">Instalación de cámaras</option>
                <option value="Otro">Otro servicio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Conjunto/Cliente *</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select value={scheduleForm.condo} onChange={(e) => setScheduleForm({...scheduleForm, condo: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="">Seleccionar conjunto</option>
                <option value="Torres del Parque">Torres del Parque</option>
                <option value="Res. La Florida">Res. La Florida</option>
                <option value="Conjunto San Felipe">Conjunto San Felipe</option>
                <option value="Torres del Norte">Torres del Norte</option>
                <option value="Res. Bella Vista">Res. Bella Vista</option>
                <option value="Conjunto Privado Las Palmas">Conjunto Privado Las Palmas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Hora *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="time" value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Técnico Asignado</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select value={scheduleForm.technician} onChange={(e) => setScheduleForm({...scheduleForm, technician: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="">Seleccionar técnico</option>
                <option value="Juan Pérez García">Juan Pérez García</option>
                <option value="Mario Gómez Rodríguez">Mario Gómez Rodríguez</option>
                <option value="Carlos López Mendoza">Carlos López Mendoza</option>
                <option value="Pedro Ramírez Castro">Pedro Ramírez Castro</option>
                <option value="Roberto Sánchez Vélez">Roberto Sánchez Vélez</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prioridad</label>
              <select value={scheduleForm.priority} onChange={(e) => setScheduleForm({...scheduleForm, priority: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="low">Baja</option>
                <option value="normal">Normal</option>
                <option value="high">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="tel" value={scheduleForm.contactPhone} onChange={(e) => setScheduleForm({...scheduleForm, contactPhone: e.target.value})} placeholder="+57 300 000 0000" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notas Adicionales</label>
            <textarea value={scheduleForm.notes} onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})} placeholder="Notas adicionales para el servicio..." rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
          </div>
        </div>
      </Modal>

      {/* Staff Modal - COMPLETO */}
      <Modal isOpen={showStaffModal} onClose={() => setShowStaffModal(false)} title="Agregar Personal" icon={UserPlus} color="from-[#0D4A3E] to-[#0D4A3E]" onSave={handleSaveStaff} saveLabel="Agregar">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo *</label>
            <div className="relative">
              <Contact className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" value={staffForm.name} onChange={(e) => setStaffForm({...staffForm, name: e.target.value})} placeholder="Ej: Juan Pérez García" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cargo/Rol *</label>
            <div className="relative">
              <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select value={staffForm.role} onChange={(e) => setStaffForm({...staffForm, role: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="">Seleccionar cargo</option>
                <option value="Líder de equipo">Líder de equipo</option>
                <option value="Electricista">Electricista</option>
                <option value="Plomero">Plomero</option>
                <option value="Técnico HVAC">Técnico HVAC</option>
                <option value="Jardinero">Jardinero</option>
                <option value="Auxiliar general">Auxiliar general</option>
                <option value="Técnico de sonido">Técnico de sonido</option>
                <option value="Técnico de seguridad">Técnico de seguridad</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Documento *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" value={staffForm.document} onChange={(e) => setStaffForm({...staffForm, document: e.target.value})} placeholder="CC: 12345678" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="tel" value={staffForm.phone} onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})} placeholder="+57 300 123 4567" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="email" value={staffForm.email} onChange={(e) => setStaffForm({...staffForm, email: e.target.value})} placeholder="correo@ejemplo.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Dirección</label>
            <div className="relative">
              <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" value={staffForm.address} onChange={(e) => setStaffForm({...staffForm, address: e.target.value})} placeholder="Dirección de residencia" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo Sangre</label>
              <select value={staffForm.bloodType} onChange={(e) => setStaffForm({...staffForm, bloodType: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="">Seleccionar</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">EPS</label>
              <input type="text" value={staffForm.eps} onChange={(e) => setStaffForm({...staffForm, eps: e.target.value})} placeholder="EPS" className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ARL</label>
              <input type="text" value={staffForm.arl} onChange={(e) => setStaffForm({...staffForm, arl: e.target.value})} placeholder="ARL" className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Vehicle Modal - COMPLETO */}
      <Modal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} title="Agregar Vehículo" icon={Plus} color="from-[#3B82F6] to-[#1D4ED8]" onSave={handleSaveVehicle} saveLabel="Autorizar">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Placa *</label>
              <div className="relative">
                <CarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" value={vehicleForm.plate} onChange={(e) => setVehicleForm({...vehicleForm, plate: e.target.value.toUpperCase()})} placeholder="ABC-123" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo Vehículo *</label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select value={vehicleForm.type} onChange={(e) => setVehicleForm({...vehicleForm, type: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                  <option value="">Seleccionar tipo</option>
                  <option value="Automóvil">Automóvil</option>
                  <option value="Camioneta">Camioneta</option>
                  <option value="Motocicleta">Motocicleta</option>
                  <option value="Camión">Camión</option>
                  <option value="Van">Van</option>
                  <option value="Bus">Bus</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Marca *</label>
              <input type="text" value={vehicleForm.brand} onChange={(e) => setVehicleForm({...vehicleForm, brand: e.target.value})} placeholder="Ej: Toyota" className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Modelo *</label>
              <input type="text" value={vehicleForm.model} onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})} placeholder="Ej: Hilux" className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Color</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select value={vehicleForm.color} onChange={(e) => setVehicleForm({...vehicleForm, color: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50">
                <option value="">Seleccionar color</option>
                <option value="Blanco">Blanco</option>
                <option value="Negro">Negro</option>
                <option value="Gris">Gris</option>
                <option value="Azul">Azul</option>
                <option value="Rojo">Rojo</option>
                <option value="Verde">Verde</option>
                <option value="Amarillo">Amarillo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tarjeta de Propiedad</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" value={vehicleForm.propertyCard} onChange={(e) => setVehicleForm({...vehicleForm, propertyCard: e.target.value})} placeholder="Número tarjeta de propiedad" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">SOAT Vigente</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="date" value={vehicleForm.soat} onChange={(e) => setVehicleForm({...vehicleForm, soat: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Revisión Tecno-mecánica</label>
              <div className="relative">
                <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="date" value={vehicleForm.technomechanical} onChange={(e) => setVehicleForm({...vehicleForm, technomechanical: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[#0D4A3E]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F7A5C]/50" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProveedorProfile;
