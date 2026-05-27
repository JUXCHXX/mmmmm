import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocation } from 'react-router-dom';
import { 
  ShieldCheck, QrCode, Clock, MapPin, Eye, Phone, Users, User, Car, Lock, Key, Bell, Activity, BarChart3, Layers, Plus, Ban, AlertOctagon, 
  Package, PackageOpen, Siren, PhoneCall, ExternalLink, ClipboardList, UserMinus, CarFront, Video, Monitor, AlertCircle, CheckCircle, AlertTriangle,
  CircleCheck, Grid, List, TrendingUp, Settings, Save, Mail, BellRing, Smartphone, Shield, Check
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface Visitor {
  id: string;
  name: string;
  document: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PASAPORTE' | 'NIT';
  unit: string;
  authorizedBy: string;
  entryTime?: string;
  exitTime?: string;
  reason: string;
  type: 'visita' | 'delivery' | 'servicio' | 'familiar' | 'proveedor';
  status: 'pending' | 'inside' | 'exited' | 'rejected';
}

interface Vehicle {
  plate: string;
  brand: string;
  model: string;
  color: string;
  type: 'car' | 'motorcycle' | 'truck' | 'bicycle';
  authorized: boolean;
  owner?: string;
}

interface PackageItem {
  id: string;
  carrier: string;
  recipient: string;
  unit: string;
  receivedBy: string;
  receivedAt: string;
  status: 'pending' | 'delivered' | 'claimed';
}

interface Incident {
  id: string;
  type: string;
  description: string;
  location: string;
  reportedBy: string;
  reportedAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
}

interface RestrictedPerson {
  id: string;
  name: string;
  document: string;
  reason: string;
  addedBy: string;
  addedAt: string;
}

interface RestrictedVehicle {
  id: string;
  plate: string;
  reason: string;
  addedBy: string;
  addedAt: string;
}

interface SecurityCamera {
  id: string;
  name: string;
  zone: string;
  status: 'online' | 'offline';
  lastMotion: string;
  resolution: string;
  angle: string;
}

interface SecurityEvent {
  id: string;
  time: string;
  type: string;
  message: string;
  zone: string;
  severity: 'info' | 'warning' | 'error';
}

interface SecurityRound {
  id: string;
  guard: string;
  zone: string;
  startTime: string;
  endTime?: string;
  status: 'completed' | 'in_progress' | 'pending';
  observations: string;
}

const SAMPLE_VISITORS: Visitor[] = [
  { id: '1', name: 'Carlos Martinez', document: '98765432', documentType: 'CC', unit: 'P4-101', authorizedBy: 'Juan Perez', entryTime: '14:30', reason: 'Visita familiar', type: 'visita', status: 'inside' },
  { id: '2', name: 'Amazon Delivery', document: 'NIT 900123456', documentType: 'NIT', unit: 'P4-102', authorizedBy: 'Maria Garcia', reason: 'Entrega paquete', type: 'delivery', status: 'inside' },
  { id: '3', name: 'Tecnico Aire Acond', document: '45678901', documentType: 'CC', unit: 'P2-201', authorizedBy: 'Admin', reason: 'Mantenimiento', type: 'servicio', status: 'pending' },
];

const SAMPLE_VEHICLES: Vehicle[] = [
  { plate: 'ABC-123', brand: 'Toyota', model: 'Corolla', color: 'Plata', type: 'car', authorized: true, owner: 'Juan Perez P4-101' },
  { plate: 'XYZ-789', brand: 'Honda', model: 'CBR', color: 'Negro', type: 'motorcycle', authorized: false, owner: 'Desconocido' },
  { plate: 'DEF-456', brand: 'Ford', model: 'F-150', color: 'Blanco', type: 'truck', authorized: true, owner: 'Proveedor' },
];

const SAMPLE_PACKAGES: PackageItem[] = [
  { id: '1', carrier: 'Servientrega', recipient: 'Juan Perez', unit: 'P4-101', receivedBy: 'Guardia', receivedAt: '10:30 AM', status: 'pending' },
  { id: '2', carrier: 'FedEx', recipient: 'Maria Garcia', unit: 'P4-102', receivedBy: 'Guardia', receivedAt: '09:15 AM', status: 'delivered' },
];

const SAMPLE_INCIDENTS: Incident[] = [
  { id: '1', type: 'tecnica', description: 'Camara del parqueadero sin conexion', location: 'Piso 2 Parqueadero', reportedBy: 'Sistema', reportedAt: '08:00 AM', severity: 'medium', status: 'in_progress' },
  { id: '2', type: 'novedad', description: 'Cambio de turno normal', location: 'Portenia', reportedBy: 'Guardia Juan', reportedAt: '06:00 AM', severity: 'low', status: 'resolved' },
];

const SAMPLE_RESTRICTED_PERSONS: RestrictedPerson[] = [
  { id: '1', name: 'Pedro Gomez', document: '12345678', reason: 'Agresion a residente', addedBy: 'Admin', addedAt: '2024-01-15' },
];

const SAMPLE_RESTRICTED_VEHICLES: RestrictedVehicle[] = [
  { id: '1', plate: 'AAA-111', reason: 'Vehiculo robado reportado', addedBy: 'Admin', addedAt: '2024-02-01' },
];

const SECURITY_ZONES = [
  { id: '1', name: 'Entrada Principal', status: 'unlocked', guards: 2, cameras: 4 },
  { id: '2', name: 'Parqueadero P1', status: 'locked', guards: 0, cameras: 6 },
  { id: '3', name: 'Parqueadero P2', status: 'locked', guards: 0, cameras: 6 },
  { id: '4', name: 'Terraza', status: 'locked', guards: 0, cameras: 2 },
  { id: '5', name: 'Salon Comunal', status: 'unlocked', guards: 0, cameras: 3 },
  { id: '6', name: 'Zona BBQ', status: 'locked', guards: 0, cameras: 2 },
];

const SECURITY_CAMERAS: SecurityCamera[] = [
  { id: 'CAM-001', name: 'Entrada Principal - Plaza', zone: 'Entrada', status: 'online', lastMotion: '2 min', resolution: '4K', angle: '270' },
  { id: 'CAM-002', name: 'Entrada Principal - Garage', zone: 'Entrada', status: 'online', lastMotion: '5 min', resolution: '4K', angle: '180' },
  { id: 'CAM-003', name: 'Parqueadero P1 - Norte', zone: 'Parqueadero', status: 'online', lastMotion: '1 min', resolution: '1080p', angle: '360' },
  { id: 'CAM-004', name: 'Parqueadero P1 - Sur', zone: 'Parqueadero', status: 'online', lastMotion: '3 min', resolution: '1080p', angle: '180' },
  { id: 'CAM-005', name: 'Parqueadero P2 - Zona A', zone: 'Parqueadero', status: 'online', lastMotion: '8 min', resolution: '1080p', angle: '270' },
  { id: 'CAM-006', name: 'Parqueadero P2 - Zona B', zone: 'Parqueadero', status: 'offline', lastMotion: 'N/A', resolution: '1080p', angle: '180' },
  { id: 'CAM-007', name: 'Terraza - Pool', zone: 'Terraza', status: 'online', lastMotion: '15 min', resolution: '4K', angle: '360' },
  { id: 'CAM-008', name: 'Terraza - Gimnasio', zone: 'Terraza', status: 'online', lastMotion: '10 min', resolution: '1080p', angle: '180' },
  { id: 'CAM-009', name: 'Salon Comunal - Principal', zone: 'Comunal', status: 'online', lastMotion: '30 min', resolution: '4K', angle: '270' },
  { id: 'CAM-010', name: 'Zona BBQ - Area 1', zone: 'Comunal', status: 'online', lastMotion: '45 min', resolution: '1080p', angle: '180' },
  { id: 'CAM-011', name: 'Stairwell Torre A', zone: 'Escaleras', status: 'online', lastMotion: '6 min', resolution: '720p', angle: '90' },
  { id: 'CAM-012', name: 'Stairwell Torre B', zone: 'Escaleras', status: 'online', lastMotion: '12 min', resolution: '720p', angle: '90' },
];

const SECURITY_EVENTS: SecurityEvent[] = [
  { id: '1', time: '14:35', type: 'access', message: 'Acceso autorizado - Carlos Martinez entro', zone: 'Entrada', severity: 'info' },
  { id: '2', time: '14:28', type: 'vehicle', message: 'Vehiculo ABC-123 detecto en Parqueadero P1', zone: 'Parqueadero', severity: 'info' },
  { id: '3', time: '14:22', type: 'package', message: 'Paquete registrado para Juan Perez P4-101', zone: 'Portenia', severity: 'info' },
  { id: '4', time: '14:15', type: 'alert', message: 'Movimiento detectado en Zona BBQ', zone: 'Terraza', severity: 'warning' },
  { id: '5', time: '14:05', type: 'access', message: 'Amazon Delivery entro por Entrada Principal', zone: 'Entrada', severity: 'info' },
  { id: '6', time: '13:58', type: 'system', message: 'Camara CAM-006 offline', zone: 'Parqueadero', severity: 'error' },
];

const SECURITY_ROUNDS: SecurityRound[] = [
  { id: '1', guard: 'Juan Perez', zone: 'Parqueadero P1', startTime: '14:00', endTime: '14:30', status: 'completed', observations: 'Todo normal' },
  { id: '2', guard: 'Juan Perez', zone: 'Parqueadero P2', startTime: '14:35', endTime: '15:00', status: 'in_progress', observations: 'En curso' },
  { id: '3', guard: 'Carlos Lopez', zone: 'Terraza', startTime: '13:00', endTime: '13:30', status: 'completed', observations: 'Terraza y BBQ OK' },
  { id: '4', guard: 'Carlos Lopez', zone: 'Stairwell', startTime: '13:35', endTime: '14:00', status: 'completed', observations: 'Escaleras despejadas' },
];

const HOURLY_ACCESS_DATA = [
  { hour: '6AM', entradas: 2, salidas: 1 },
  { hour: '8AM', entradas: 15, salidas: 5 },
  { hour: '10AM', entradas: 25, salidas: 10 },
  { hour: '12PM', entradas: 30, salidas: 25 },
  { hour: '2PM', entradas: 20, salidas: 18 },
  { hour: '4PM', entradas: 18, salidas: 20 },
  { hour: '6PM', entradas: 35, salidas: 30 },
  { hour: '8PM', entradas: 15, salidas: 20 },
  { hour: '10PM', entradas: 5, salidas: 8 },
];

const MONTHLY_ACCESS_STATS = [
  { month: 'Ene', ingresos: 450, salidas: 420, visitantes: 180 },
  { month: 'Feb', ingresos: 520, salidas: 490, visitantes: 210 },
  { month: 'Mar', ingresos: 480, salidas: 460, visitantes: 195 },
  { month: 'Abr', ingresos: 550, salidas: 520, visitantes: 230 },
  { month: 'May', ingresos: 590, salidas: 560, visitantes: 250 },
  { month: 'Jun', ingresos: 620, salidas: 590, visitantes: 270 },
];

const VISITOR_TYPE_DATA = [
  { name: 'Familiares', value: 35, color: '#0F7A5C' },
  { name: 'Entregas', value: 28, color: '#2563EB' },
  { name: 'Servicios', value: 22, color: '#F59E0B' },
  { name: 'Proveedores', value: 15, color: '#8B5CF6' },
];

const DAILY_ACCESS_PATTERN = [
  { hour: '6', accesses: 5 },
  { hour: '8', accesses: 45 },
  { hour: '10', accesses: 78 },
  { hour: '12', accesses: 95 },
  { hour: '14', accesses: 65 },
  { hour: '16', accesses: 55 },
  { hour: '18', accesses: 120 },
  { hour: '20', accesses: 85 },
  { hour: '22', accesses: 25 },
];

const ZONE_TRAFFIC = [
  { zone: 'Entrada Principal', traffic: 450, incidents: 2 },
  { zone: 'Parqueadero P1', traffic: 320, incidents: 5 },
  { zone: 'Parqueadero P2', traffic: 280, incidents: 3 },
  { zone: 'Terraza', traffic: 150, incidents: 1 },
  { zone: 'Salon Comunal', traffic: 90, incidents: 0 },
];

const SECURITY_METRICS = {
  totalAccess: 3840,
  avgDaily: 128,
  peakHour: '18:00',
  incidentsThisMonth: 12,
  responseTime: '3.5 min',
  camerasCoverage: '98%',
  guardsOnDuty: 4,
};

type PorteriaTab = 'dashboard' | 'access' | 'security' | 'rounds' | 'analytics' | 'config';
type UserSecurityTab = 'home' | 'config';

const SecurityPage = () => {
  const user = useAuthStore((s) => s.user);
  const isPorteria = user?.roleId === 'porteria';
  const isArrendatario = user?.roleId === 'arrendatario';
  const isPropietario = user?.roleId === 'propietario';

  const [activeTab, setActiveTab] = useState<PorteriaTab>('dashboard');
  const [userSecurityTab, setUserSecurityTab] = useState<UserSecurityTab>('home');
  const [accessSubTab, setAccessSubTab] = useState<'cameras' | 'visitors' | 'vehicles' | 'packages'>('cameras');
  const [securitySubTab, setSecuritySubTab] = useState<'events' | 'incidents' | 'restricted'>('events');
  const [visitors, setVisitors] = useState<Visitor[]>(SAMPLE_VISITORS);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [lockedAccess, setLockedAccess] = useState(false);

  // Modal states
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [emergencyTime, setEmergencyTime] = useState<Date | null>(null);
  const [visitorForm, setVisitorForm] = useState({ name: '', document: '', visitDate: '', visitTime: '', numPersons: '1', reason: '' });
  const [contactMessages, setContactMessages] = useState<{ id: string; sender: 'porteria' | 'user'; text: string; time: string }[]>([
    { id: '1', sender: 'porteria', text: 'Portería disponible', time: new Date(Date.now() - 5 * 60000).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [contactInput, setContactInput] = useState('');

  // Detectar si es la ruta de configuración de seguridad
  const location = useLocation();
  const isSecurityConfigRoute = location.pathname === '/config-seguridad';

  // Configuración de seguridad del usuario
  const [userSecurityConfig, setUserSecurityConfig] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    autoLock: true,
    visitorPreApproval: false,
    emergencyContacts: true,
    accessHistory: true,
    biometricAccess: false,
  });

  if (isPorteria) {
    return (
      <div>
        {emergencyMode && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="mb-6 p-4 rounded-xl bg-red-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Siren className="w-8 h-8" />
              <div>
                <p className="font-bold text-lg">MODO EMERGENCIA ACTIVO</p>
                <p className="text-sm">Accesos bloqueados</p>
              </div>
            </div>
            <button onClick={() => setEmergencyMode(false)} className="px-4 py-2 bg-white text-red-600 rounded-lg font-bold">Desactivar</button>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" /> Control de Seguridad
              </h1>
              <p className="text-sm text-emerald-400 font-medium mt-1 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Vista de Porteria - Turno Actual
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmergencyModal(true)}
                className="relative px-4 py-2 rounded-xl bg-red-600 text-white font-bold flex items-center gap-2 hover:bg-red-700 transition-colors"
              >
                <motion.div animate={emergencyMode ? { opacity: [1, 0.5, 1] } : {}} transition={{ duration: 0.5, repeat: emergencyMode ? Infinity : 0 }} className="absolute inset-0 rounded-xl bg-red-600 -z-10" />
                <Siren className="w-4 h-4" /> Alerta Emergencia
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVisitorModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <QrCode className="w-4 h-4" /> Invitar Visitante
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowContactModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <PhoneCall className="w-4 h-4" /> Contactar Portería
              </motion.button>
              <button onClick={() => setLockedAccess(!lockedAccess)} className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${lockedAccess ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {lockedAccess ? <Lock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                {lockedAccess ? 'Bloqueado' : 'Desbloqueado'}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-2"><Users className="w-5 h-5 text-blue-400" /></div>
            <p className="text-2xl font-bold text-foreground">{visitors.filter(v => v.status === 'inside').length}</p>
            <p className="text-xs text-muted-foreground">Visitantes dentro</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-2"><Video className="w-5 h-5 text-purple-400" /></div>
            <p className="text-2xl font-bold text-foreground">{SECURITY_CAMERAS.filter(c => c.status === 'online').length}/{SECURITY_CAMERAS.length}</p>
            <p className="text-xs text-muted-foreground">Camaras online</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-2"><AlertCircle className="w-5 h-5 text-amber-400" /></div>
            <p className="text-2xl font-bold text-foreground">{SECURITY_EVENTS.filter(e => e.severity === 'warning').length}</p>
            <p className="text-xs text-muted-foreground">Alertas</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-2"><CircleCheck className="w-5 h-5 text-emerald-400" /></div>
            <p className="text-2xl font-bold text-foreground">{SECURITY_ROUNDS.filter(r => r.status === 'completed').length}</p>
            <p className="text-xs text-muted-foreground">Rondas</p>
          </motion.div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'access', label: 'Accesos', icon: <Grid className="w-4 h-4" /> },
            { id: 'security', label: 'Seguridad', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'rounds', label: 'Rondas', icon: <Users className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analitica', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'config', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as PorteriaTab)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#0D4A3E] text-white shadow-lg' : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Accesos por Hora</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={HOURLY_ACCESS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  <Bar dataKey="entradas" name="Entradas" fill="#0F7A5C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="salidas" name="Salidas" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECURITY_ZONES.map((zone) => (
                <motion.div key={zone.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md border-l-4 ${zone.status === 'unlocked' ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{zone.name}</h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${zone.status === 'unlocked' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {zone.status === 'unlocked' ? <><CircleCheck className="w-3 h-3 inline" /> Abierto</> : <><Lock className="w-3 h-3 inline" /> Cerrado</>}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {zone.cameras}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {zone.guards}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'access' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-2 mb-4">
              {[
                { id: 'cameras', label: 'Camaras', icon: <Video className="w-4 h-4" /> },
                { id: 'visitors', label: 'Visitantes', icon: <User className="w-4 h-4" /> },
                { id: 'vehicles', label: 'Vehiculos', icon: <Car className="w-4 h-4" /> },
                { id: 'packages', label: 'Paquetes', icon: <Package className="w-4 h-4" /> },
              ].map(sub => (
                <button key={sub.id} onClick={() => setAccessSubTab(sub.id as typeof accessSubTab)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${accessSubTab === sub.id ? 'bg-[#0D4A3E] text-white' : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground'}`}>
                  {sub.icon} {sub.label}
                </button>
              ))}
            </div>

            {accessSubTab === 'cameras' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SECURITY_CAMERAS.map((cam) => (
                  <motion.div key={cam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md border-2 ${cam.status === 'online' ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Video className={`w-5 h-5 ${cam.status === 'online' ? 'text-emerald-400' : 'text-red-400'}`} />
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${cam.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {cam.status === 'online' ? 'EN VIVO' : 'OFFLINE'}
                        </span>
                      </div>
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="bg-black/50 rounded-lg h-32 mb-3 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-8 h-8 text-muted-foreground mx-auto mb-1 opacity-50" />
                        <p className="text-xs text-muted-foreground">{cam.name}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{cam.name}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Zona: {cam.zone}</span>
                        <span>{cam.resolution}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {accessSubTab === 'visitors' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-3 rounded-xl text-center"><p className="text-xl font-bold text-emerald-400">{visitors.filter(v => v.status === 'inside').length}</p><p className="text-xs text-muted-foreground">Dentro</p></div>
                  <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-3 rounded-xl text-center"><p className="text-xl font-bold text-amber-400">{visitors.filter(v => v.status === 'pending').length}</p><p className="text-xs text-muted-foreground">Esperando</p></div>
                  <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-3 rounded-xl text-center"><p className="text-xl font-bold text-gray-400">{visitors.filter(v => v.status === 'exited').length}</p><p className="text-xs text-muted-foreground">Salieron</p></div>
                </div>
                {visitors.map((visitor) => (
                  <motion.div key={visitor.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                      <div>
                        <p className="font-semibold text-foreground">{visitor.name}</p>
                        <p className="text-xs text-muted-foreground">{visitor.unit} | {visitor.authorizedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${visitor.status === 'inside' ? 'bg-emerald-500/20 text-emerald-400' : visitor.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {visitor.status === 'inside' ? 'Dentro' : visitor.status === 'pending' ? 'Esperando' : 'Salio'}
                      </span>
                      {visitor.status === 'pending' && (
                        <button onClick={() => { setVisitors(visitors.map(v => v.id === visitor.id ? { ...v, status: 'inside' as const, entryTime: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) } : v)); toast({ title: 'Autorizado' }); }} className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs">Autorizar</button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {accessSubTab === 'vehicles' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-3 rounded-xl text-center"><p className="text-xl font-bold text-emerald-400">{SAMPLE_VEHICLES.filter(v => v.authorized).length}</p><p className="text-xs text-muted-foreground">Autorizados</p></div>
                  <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-3 rounded-xl text-center"><p className="text-xl font-bold text-red-400">{SAMPLE_VEHICLES.filter(v => !v.authorized).length}</p><p className="text-xs text-muted-foreground">No autorizados</p></div>
                </div>
                {SAMPLE_VEHICLES.map((vehicle) => (
                  <motion.div key={vehicle.plate} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"><CarFront className="w-5 h-5 text-primary" /></div>
                      <div>
                        <p className="font-mono font-bold text-foreground">{vehicle.plate}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${vehicle.authorized ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {vehicle.authorized ? 'Autorizado' : 'No autorizado'}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {accessSubTab === 'packages' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-3 rounded-xl text-center"><p className="text-xl font-bold text-amber-400">{SAMPLE_PACKAGES.filter(p => p.status === 'pending').length}</p><p className="text-xs text-muted-foreground">Pendientes</p></div>
                  <div className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-3 rounded-xl text-center"><p className="text-xl font-bold text-emerald-400">{SAMPLE_PACKAGES.filter(p => p.status === 'delivered').length}</p><p className="text-xs text-muted-foreground">Entregados</p></div>
                </div>
                {SAMPLE_PACKAGES.map((pkg) => (
                  <motion.div key={pkg.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><PackageOpen className="w-5 h-5 text-purple-400" /></div>
                      <div>
                        <p className="font-semibold text-foreground">{pkg.carrier}</p>
                        <p className="text-xs text-muted-foreground">{pkg.recipient} - {pkg.unit}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${pkg.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {pkg.status === 'pending' ? 'Pendiente' : 'Entregado'}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-2 mb-4">
              {[
                { id: 'events', label: 'Eventos', icon: <Activity className="w-4 h-4" /> },
                { id: 'incidents', label: 'Incidentes', icon: <AlertOctagon className="w-4 h-4" /> },
                { id: 'restricted', label: 'Restricciones', icon: <Ban className="w-4 h-4" /> },
              ].map(sub => (
                <button key={sub.id} onClick={() => setSecuritySubTab(sub.id as typeof securitySubTab)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${securitySubTab === sub.id ? 'bg-[#0D4A3E] text-white' : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground'}`}>
                  {sub.icon} {sub.label}
                </button>
              ))}
            </div>

            {securitySubTab === 'events' && (
              <div className="space-y-2">
                {SECURITY_EVENTS.map((event) => (
                  <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-3 rounded-xl border-l-4 ${event.severity === 'error' ? 'border-l-red-500' : event.severity === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground w-12">{event.time}</span>
                        <div>
                          <p className="text-sm text-foreground">{event.message}</p>
                          <p className="text-xs text-muted-foreground">{event.zone}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${event.severity === 'error' ? 'bg-red-500/20 text-red-400' : event.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {event.severity === 'error' ? 'Error' : event.severity === 'warning' ? 'Alerta' : 'Info'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {securitySubTab === 'incidents' && (
              <div className="space-y-3">
                {SAMPLE_INCIDENTS.map((incident) => (
                  <motion.div key={incident.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md border-l-4 ${incident.severity === 'critical' ? 'border-l-red-600' : incident.severity === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${incident.type === 'tecnica' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{incident.type.toUpperCase()}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${incident.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{incident.severity.toUpperCase()}</span>
                        </div>
                        <p className="font-semibold text-foreground">{incident.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{incident.location}</span>
                          <span>{incident.reportedAt}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${incident.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {incident.status === 'resolved' ? 'Resuelto' : 'Abierto'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {securitySubTab === 'restricted' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><UserMinus className="w-5 h-5 text-red-400" /> Personas Restringidas</h3>
                  <div className="space-y-3">
                    {SAMPLE_RESTRICTED_PERSONS.map((person) => (
                      <div key={person.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                        <div><p className="font-medium text-foreground">{person.name}</p><p className="text-xs text-muted-foreground">CC: {person.document}</p><p className="text-xs text-red-400 mt-1">{person.reason}</p></div>
                        <Ban className="w-5 h-5 text-red-400" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><CarFront className="w-5 h-5 text-red-400" /> Vehiculos Restringidos</h3>
                  <div className="space-y-3">
                    {SAMPLE_RESTRICTED_VEHICLES.map((vehicle) => (
                      <div key={vehicle.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                        <div><p className="font-mono font-bold text-foreground">{vehicle.plate}</p><p className="text-xs text-red-400 mt-1">{vehicle.reason}</p></div>
                        <Ban className="w-5 h-5 text-red-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'rounds' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground text-lg">Rondas de Vigilancia</h3>
              <button className="px-4 py-2 rounded-xl bg-[#0D4A3E] text-white font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Iniciar Ronda
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SECURITY_ROUNDS.map((round) => (
                <motion.div key={round.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md border-l-4 ${round.status === 'completed' ? 'border-l-emerald-500' : round.status === 'in_progress' ? 'border-l-amber-500' : 'border-l-gray-500'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">{round.guard}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${round.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : round.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {round.status === 'completed' ? 'Completada' : round.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Zona:</span>
                      <span className="text-foreground">{round.zone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Horario:</span>
                      <span className="text-foreground">{round.startTime} - {round.endTime || 'En curso'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Obs:</span>
                      <span className="text-foreground">{round.observations}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
                <p className="text-xs text-muted-foreground mb-1">Total Accesos Mes</p>
                <p className="text-2xl font-bold text-foreground">{SECURITY_METRICS.totalAccess}</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
                <p className="text-xs text-muted-foreground mb-1">Promedio Diario</p>
                <p className="text-2xl font-bold text-foreground">{SECURITY_METRICS.avgDaily}</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
                <p className="text-xs text-muted-foreground mb-1">Hora Pico</p>
                <p className="text-2xl font-bold text-foreground">{SECURITY_METRICS.peakHour}</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md">
                <p className="text-xs text-muted-foreground mb-1">Incidentes Mes</p>
                <p className="text-2xl font-bold text-amber-400">{SECURITY_METRICS.incidentsThisMonth}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
                <h3 className="font-semibold text-foreground mb-4">Accesos Mensuales</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={MONTHLY_ACCESS_STATS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Bar dataKey="ingresos" name="Ingresos" fill="#0F7A5C" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="salidas" name="Salidas" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
                <h3 className="font-semibold text-foreground mb-4">Patron de Accesos por Hora</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={DAILY_ACCESS_PATTERN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Area type="monotone" dataKey="accesses" name="Accesos" stroke="#0F7A5C" fill="#0F7A5C" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
                <h3 className="font-semibold text-foreground mb-4">Tipos de Visitantes</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={VISITOR_TYPE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                      {VISITOR_TYPE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
                <h3 className="font-semibold text-foreground mb-4">Trafico por Zona</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ZONE_TRAFFIC} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#888" fontSize={12} />
                    <YAxis dataKey="zone" type="category" stroke="#888" fontSize={12} width={100} />
                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Bar dataKey="traffic" name="Trafico" fill="#0F7A5C" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">{SECURITY_METRICS.responseTime}</p>
                <p className="text-xs text-muted-foreground">Tiempo de Respuesta</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md text-center">
                <Video className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">{SECURITY_METRICS.camerasCoverage}</p>
                <p className="text-xs text-muted-foreground">Cobertura Camaras</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md text-center">
                <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">{SECURITY_METRICS.guardsOnDuty}</p>
                <p className="text-xs text-muted-foreground">Guardias en Turno</p>
              </div>
              <div className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md text-center">
                <User className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">{MONTHLY_ACCESS_STATS[5].visitantes}</p>
                <p className="text-xs text-muted-foreground">Visitantes Este Mes</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'config' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-[#0F7A5C]" /> Configuración de Portería</h3>
              <p className="text-sm text-muted-foreground mb-4">Configura las opciones específicas de tu puesto de vigilancia</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-700 border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">Notificaciones de Turno</p>
                      <p className="text-xs text-muted-foreground">Recibe alertas sobre cambios de turno</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#0D4A3E] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-700 border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">Alertas de Incidentes</p>
                      <p className="text-xs text-muted-foreground">Notificaciones inmediatas de incidentes</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#0D4A3E] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-700 border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">Control de Paquetes</p>
                      <p className="text-xs text-muted-foreground">Gestión de paquetes recibidos</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#0D4A3E] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-700 border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">Registro de Vehículos</p>
                      <p className="text-xs text-muted-foreground">Control de ingreso de vehículos</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#0D4A3E] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BellRing className="w-5 h-5 text-[#0F7A5C]" /> Horario de Turno</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Turno Actual</p>
                  <p className="text-lg font-bold text-foreground">06:00 AM - 02:00 PM</p>
                  <p className="text-xs text-emerald-400">En curso</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Siguiente Turno</p>
                  <p className="text-lg font-bold text-foreground">02:00 PM - 10:00 PM</p>
                  <p className="text-xs text-muted-foreground">Juan Perez</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Días Trabados</p>
                  <p className="text-lg font-bold text-foreground">6 de 7</p>
                  <p className="text-xs text-amber-400">Descanso: Domingo</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#0F7A5C]" /> Zonas Asignadas</h3>
              <div className="space-y-3">
                {SECURITY_ZONES.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${zone.status === 'unlocked' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="font-medium text-sm text-foreground">{zone.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {zone.cameras}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {zone.guards}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => toast({ title: 'Configuración guardada', description: 'Tu configuración de portería ha sido guardada correctamente' })} className="w-full py-3 rounded-xl bg-[#0D4A3E] text-white font-semibold flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> Guardar Configuración
            </button>
          </motion.div>
        )}

        {/* Emergency Alert Modal */}
        {showEmergencyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Confirmación de Alerta</h2>
              <p className="text-gray-600 mb-6">¿Confirmar activación de alerta de emergencia? Esta acción enviará notificaciones a portería y administración.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowEmergencyModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Cancelar</button>
                <button
                  onClick={() => {
                    setEmergencyTime(new Date());
                    setEmergencyMode(true);
                    setShowEmergencyModal(false);
                    toast({ title: 'Alerta de emergencia activada', description: 'Notificaciones enviadas a portería y administración', duration: 3 });
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                >
                  Confirmar Alerta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Visitor Invitation Modal */}
        {showVisitorModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 my-8">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Invitar Visitante</h2>
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Nombre del visitante" value={visitorForm.name} onChange={(e) => setVisitorForm({ ...visitorForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Documento (CC, TI, etc)" value={visitorForm.document} onChange={(e) => setVisitorForm({ ...visitorForm, document: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="date" value={visitorForm.visitDate} onChange={(e) => setVisitorForm({ ...visitorForm, visitDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="time" value={visitorForm.visitTime} onChange={(e) => setVisitorForm({ ...visitorForm, visitTime: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="number" min="1" placeholder="Número de personas" value={visitorForm.numPersons} onChange={(e) => setVisitorForm({ ...visitorForm, numPersons: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Motivo de la visita" value={visitorForm.reason} onChange={(e) => setVisitorForm({ ...visitorForm, reason: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              {visitorForm.name && visitorForm.document && (
                <div className="bg-gray-100 rounded-lg p-4 mb-6 flex flex-col items-center">
                  <p className="text-xs text-gray-500 mb-2">Código QR de invitación</p>
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">QR</div>
                  <button onClick={() => { navigator.clipboard.writeText(`${visitorForm.name} - ${visitorForm.document}`); toast({ title: 'Código copiado' }); }} className="text-xs text-blue-600 mt-2 hover:underline">Copiar enlace</button>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowVisitorModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Cancelar</button>
                <button
                  onClick={() => {
                    toast({ title: 'Visitante invitado', description: `${visitorForm.name} ha sido agregado a visitantes esperados` });
                    setVisitorForm({ name: '', document: '', visitDate: '', visitTime: '', numPersons: '1', reason: '' });
                    setShowVisitorModal(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Crear Invitación
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Contact Porteria Modal */}
        {showContactModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col max-h-96">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">Chat con Portería</h2>
              <div className="flex items-center gap-2 mb-4 text-sm text-green-600"><CircleCheck className="w-4 h-4" /> Portería en línea</div>
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-gray-50 rounded-lg p-3">
                {contactMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Escribe tu mensaje..." value={contactInput} onChange={(e) => setContactInput(e.target.value)} onKeyPress={(e) => {
                  if (e.key === 'Enter' && contactInput.trim()) {
                    setContactMessages([...contactMessages, { id: String(Date.now()), sender: 'user', text: contactInput, time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) }]);
                    setContactInput('');
                  }
                }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                <button onClick={() => { if (contactInput.trim()) { setContactMessages([...contactMessages, { id: String(Date.now()), sender: 'user', text: contactInput, time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) }]); setContactInput(''); } }} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700">Enviar</button>
              </div>
              <button onClick={() => setShowContactModal(false)} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Cerrar Chat</button>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  if (isArrendatario) {
    return (
      <div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-primary" /> Seguridad y Acceso</h1>
          <p className="text-sm text-amber-400 font-medium mt-1">Vista de Arrendatario - Mi unidad</p>
        </motion.div>

        {/* Pestañas para Arrendatario */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'home', label: 'Inicio', icon: <Shield className="w-4 h-4" /> },
            { id: 'config', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setUserSecurityTab(tab.id as UserSecurityTab)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${(isSecurityConfigRoute ? 'config' : userSecurityTab) === tab.id ? 'bg-[#0D4A3E] text-white shadow-lg' : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {(isSecurityConfigRoute ? 'config' : userSecurityTab) === 'home' && (
          <>
            <div className="mb-6">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg flex items-center justify-center gap-3 text-lg">
                <AlertTriangle className="w-6 h-6" /> ALERTA DE EMERGENCIA
              </motion.button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <motion.button whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex flex-col items-center gap-2"><QrCode className="w-6 h-6 text-[#0F7A5C]" /><span className="text-xs font-medium text-foreground">Invitar Visitante</span></motion.button>
              <motion.button whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex flex-col items-center gap-2"><AlertTriangle className="w-6 h-6 text-red-400" /><span className="text-xs font-medium text-foreground">Reportar Emergencia</span></motion.button>
              <motion.button whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex flex-col items-center gap-2"><Phone className="w-6 h-6 text-purple-400" /><span className="text-xs font-medium text-foreground">Contactar Portenia</span></motion.button>
            </div>
          </>
        )}

        {userSecurityTab === 'config' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Notificaciones de Seguridad */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BellRing className="w-5 h-5 text-[#0F7A5C]" /> Notificaciones de Seguridad</h3>
              <div className="space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Notificaciones por Correo', desc: 'Recibe alertas de seguridad por email', icon: Mail },
                  { key: 'pushNotifications', label: 'Notificaciones Push', desc: 'Alertas en tiempo real en tu dispositivo', icon: Bell },
                  { key: 'smsAlerts', label: 'Alertas SMS', desc: 'Mensajes de texto para emergencias', icon: Smartphone },
                ].map(item => (
                  <div key={item.key} onClick={() => setUserSecurityConfig({ ...userSecurityConfig, [item.key]: !userSecurityConfig[item.key as keyof typeof userSecurityConfig] })} className={`p-4 rounded-xl border cursor-pointer transition-all ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E]/10 border-[#0F7A5C]/30' : 'bg-gray-50 dark:bg-gray-700 border-border'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E] text-white' : 'bg-muted'}`}>
                        {userSecurityConfig[item.key as keyof typeof userSecurityConfig] && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opciones de Acceso */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-[#0F7A5C]" /> Opciones de Acceso</h3>
              <div className="space-y-3">
                {[
                  { key: 'autoLock', label: 'Bloqueo Automático', desc: 'Tu unidad se bloquea automáticamente', icon: Lock },
                  { key: 'visitorPreApproval', label: 'Pre-aprobación de Visitantes', desc: 'Requiere aprobación antes del ingreso', icon: User },
                  { key: 'biometricAccess', label: 'Acceso Biométrico', desc: 'Usa huella o reconocimiento facial', icon: Shield },
                ].map(item => (
                  <div key={item.key} onClick={() => setUserSecurityConfig({ ...userSecurityConfig, [item.key]: !userSecurityConfig[item.key as keyof typeof userSecurityConfig] })} className={`p-4 rounded-xl border cursor-pointer transition-all ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E]/10 border-[#0F7A5C]/30' : 'bg-gray-50 dark:bg-gray-700 border-border'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E] text-white' : 'bg-muted'}`}>
                        {userSecurityConfig[item.key as keyof typeof userSecurityConfig] && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuración Adicional */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-[#0F7A5C]" /> Configuración Adicional</h3>
              <div className="space-y-3">
                {[
                  { key: 'emergencyContacts', label: 'Contactos de Emergencia', desc: 'Administra tus contactos de emergencia', icon: Phone },
                  { key: 'accessHistory', label: 'Historial de Accesos', desc: 'Ver registro de ingresos a tu unidad', icon: Clock },
                ].map(item => (
                  <div key={item.key} onClick={() => setUserSecurityConfig({ ...userSecurityConfig, [item.key]: !userSecurityConfig[item.key as keyof typeof userSecurityConfig] })} className={`p-4 rounded-xl border cursor-pointer transition-all ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E]/10 border-[#0F7A5C]/30' : 'bg-gray-50 dark:bg-gray-700 border-border'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E] text-white' : 'bg-muted'}`}>
                        {userSecurityConfig[item.key as keyof typeof userSecurityConfig] && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => toast({ title: 'Configuración guardada', description: 'Tu configuración de seguridad ha sido guardada correctamente' })} className="w-full py-3 rounded-xl bg-[#0D4A3E] text-white font-semibold flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> Guardar Configuración
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  if (isPropietario) {
    return (
      <div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-primary" /> Seguridad y Acceso</h1>
          <p className="text-sm text-blue-400 font-medium mt-1">Vista de Propietario - Mis propiedades</p>
        </motion.div>

        {/* Pestañas para Propietario */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'home', label: 'Inicio', icon: <Shield className="w-4 h-4" /> },
            { id: 'config', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setUserSecurityTab(tab.id as UserSecurityTab)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${(isSecurityConfigRoute ? 'config' : userSecurityTab) === tab.id ? 'bg-[#0D4A3E] text-white shadow-lg' : 'bg-[rgba(255,255,255,0.06)] text-muted-foreground hover:text-foreground'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {(isSecurityConfigRoute ? 'config' : userSecurityTab) === 'home' && (
          <>
            <div className="mb-6">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg flex items-center justify-center gap-3 text-lg">
                <AlertTriangle className="w-6 h-6" /> ALERTA A SEGURIDAD
              </motion.button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <motion.button whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex flex-col items-center gap-2"><QrCode className="w-6 h-6 text-[#0F7A5C]" /><span className="text-xs font-medium text-foreground">Nueva Invitacion</span></motion.button>
              <motion.button whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex flex-col items-center gap-2"><Bell className="w-6 h-6 text-red-400" /><span className="text-xs font-medium text-foreground">Reportar Incidente</span></motion.button>
              <motion.button whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex flex-col items-center gap-2"><Car className="w-6 h-6 text-blue-400" /><span className="text-xs font-medium text-foreground">Registrar Vehiculo</span></motion.button>
              <motion.button whileHover={{ scale: 1.02 }} className="bg-white rounded-xl border border-black/8 p-4 shadow-sm hover:shadow-md flex flex-col items-center gap-2"><Phone className="w-6 h-6 text-purple-400" /><span className="text-xs font-medium text-foreground">Contactar Portenia</span></motion.button>
            </div>
          </>
        )}

        {userSecurityTab === 'config' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Notificaciones de Seguridad */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BellRing className="w-5 h-5 text-[#0F7A5C]" /> Notificaciones de Seguridad</h3>
              <div className="space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Notificaciones por Correo', desc: 'Recibe alertas de seguridad por email', icon: Mail },
                  { key: 'pushNotifications', label: 'Notificaciones Push', desc: 'Alertas en tiempo real en tu dispositivo', icon: Bell },
                  { key: 'smsAlerts', label: 'Alertas SMS', desc: 'Mensajes de texto para emergencias', icon: Smartphone },
                ].map(item => (
                  <div key={item.key} onClick={() => setUserSecurityConfig({ ...userSecurityConfig, [item.key]: !userSecurityConfig[item.key as keyof typeof userSecurityConfig] })} className={`p-4 rounded-xl border cursor-pointer transition-all ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E]/10 border-[#0F7A5C]/30' : 'bg-gray-50 dark:bg-gray-700 border-border'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E] text-white' : 'bg-muted'}`}>
                        {userSecurityConfig[item.key as keyof typeof userSecurityConfig] && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opciones de Acceso */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-[#0F7A5C]" /> Opciones de Acceso</h3>
              <div className="space-y-3">
                {[
                  { key: 'autoLock', label: 'Bloqueo Automático', desc: 'Tu unidad se bloquea automáticamente', icon: Lock },
                  { key: 'visitorPreApproval', label: 'Pre-aprobación de Visitantes', desc: 'Requiere aprobación antes del ingreso', icon: User },
                  { key: 'biometricAccess', label: 'Acceso Biométrico', desc: 'Usa huella o reconocimiento facial', icon: Shield },
                ].map(item => (
                  <div key={item.key} onClick={() => setUserSecurityConfig({ ...userSecurityConfig, [item.key]: !userSecurityConfig[item.key as keyof typeof userSecurityConfig] })} className={`p-4 rounded-xl border cursor-pointer transition-all ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E]/10 border-[#0F7A5C]/30' : 'bg-gray-50 dark:bg-gray-700 border-border'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E] text-white' : 'bg-muted'}`}>
                        {userSecurityConfig[item.key as keyof typeof userSecurityConfig] && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuración Adicional */}
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-[#0F7A5C]" /> Configuración Adicional</h3>
              <div className="space-y-3">
                {[
                  { key: 'emergencyContacts', label: 'Contactos de Emergencia', desc: 'Administra tus contactos de emergencia', icon: Phone },
                  { key: 'accessHistory', label: 'Historial de Accesos', desc: 'Ver registro de ingresos a tu unidad', icon: Clock },
                ].map(item => (
                  <div key={item.key} onClick={() => setUserSecurityConfig({ ...userSecurityConfig, [item.key]: !userSecurityConfig[item.key as keyof typeof userSecurityConfig] })} className={`p-4 rounded-xl border cursor-pointer transition-all ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E]/10 border-[#0F7A5C]/30' : 'bg-gray-50 dark:bg-gray-700 border-border'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${userSecurityConfig[item.key as keyof typeof userSecurityConfig] ? 'bg-[#0D4A3E] text-white' : 'bg-muted'}`}>
                        {userSecurityConfig[item.key as keyof typeof userSecurityConfig] && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => toast({ title: 'Configuración guardada', description: 'Tu configuración de seguridad ha sido guardada correctamente' })} className="w-full py-3 rounded-xl bg-[#0D4A3E] text-white font-semibold flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> Guardar Configuración
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-primary" /> Seguridad y Acceso</h1>
        <p className="text-sm text-muted-foreground mt-1">Control de acceso, zonas y visitantes</p>
      </motion.div>
      <div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-8 rounded-xl text-center">
        <ShieldCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-lg font-semibold text-foreground mb-2">Modulo de Seguridad</p>
        <p className="text-sm text-muted-foreground">Selecciona un rol especifico para ver la informacion</p>
      </div>
    </div>
  );
};

export default SecurityPage;
