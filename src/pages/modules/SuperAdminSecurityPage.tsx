import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import {
  ShieldCheck, Users, Lock, Key, Activity, Trash2, Plus, Edit, Eye, EyeOff,
  CheckCircle, AlertCircle, Clock, User, Mail, Globe, Smartphone, ArrowUpRight,
  ArrowDownLeft, Search, Filter, Download, RefreshCw, MapPin, Car, Calendar, FileText,
  Bell, AlertTriangle, Home, LogOut, PackageOpen, Zap, Settings2, BarChart3, TrendingUp,
  ChevronDown, Columns3, RotateCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface AccessRecord {
  id: string;
  hora: string;
  nombre: string;
  documento: string;
  tipo: 'residente' | 'visitante' | 'proveedor' | 'empleado';
  destino: string;
  ingreso: string;
  salida: string;
  tiempo: string;
  registradoPor: string;
}

interface Visitante {
  id: string;
  nombre: string;
  documento: string;
  apto: string;
  horaEsperada: string;
  estado: 'esperado' | 'ingresado' | 'cancelado';
  invitadoPor: string;
}

interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  color: string;
  propietario: string;
  apto: string;
  parqueadero: string;
  estado: 'dentro' | 'fuera';
}

interface TurnoPorteria {
  id: string;
  nombre: string;
  turno: 'mañana' | 'tarde' | 'noche';
  horaInicio: string;
  horaFin: string;
  novedades: number;
}

interface AuditLog {
  id: string;
  usuario: string;
  accion: string;
  registro: string;
  fecha: string;
  hora: string;
}

interface Conjunto {
  id: string;
  nombre: string;
  torres: number;
  residentes: number;
  status: 'activo' | 'inactivo';
}

// DEMO DATA
const DEMO_ACCESOS: AccessRecord[] = [
  {
    id: '1',
    hora: '09:15',
    nombre: 'Juan Pérez',
    documento: '1051234567',
    tipo: 'visitante',
    destino: 'Apto 302',
    ingreso: '09:15',
    salida: '',
    tiempo: '2 horas 30 min',
    registradoPor: 'Portería',
  },
  {
    id: '2',
    hora: '09:30',
    nombre: 'ServiFix (Proveedor)',
    documento: 'RUT-890123456',
    tipo: 'proveedor',
    destino: 'Apto 101',
    ingreso: '09:30',
    salida: '10:00',
    tiempo: '30 min',
    registradoPor: 'Portería',
  },
  {
    id: '3',
    hora: '10:00',
    nombre: 'Ana García',
    documento: '1051234568',
    tipo: 'residente',
    destino: 'Torre 1',
    ingreso: '10:00',
    salida: '',
    tiempo: 'Activo',
    registradoPor: 'QR',
  },
  {
    id: '4',
    hora: '10:45',
    nombre: 'María López',
    documento: '1051234569',
    tipo: 'visitante',
    destino: 'Apto 205',
    ingreso: '10:45',
    salida: '11:20',
    tiempo: '35 min',
    registradoPor: 'Portería',
  },
  {
    id: '5',
    hora: '11:20',
    nombre: 'ElectroServ',
    documento: 'RUT-890123457',
    tipo: 'proveedor',
    destino: 'Apto 410',
    ingreso: '11:20',
    salida: '',
    tiempo: 'En progreso',
    registradoPor: 'Portería',
  },
  {
    id: '6',
    hora: '11:45',
    nombre: 'Carlos Ruiz',
    documento: '1051234570',
    tipo: 'residente',
    destino: 'Torre 2',
    ingreso: '11:45',
    salida: '',
    tiempo: 'Activo',
    registradoPor: 'QR',
  },
  {
    id: '7',
    hora: '12:10',
    nombre: 'Domino´s Pizza',
    documento: 'RUT-890123458',
    tipo: 'proveedor',
    destino: 'Entrega',
    ingreso: '12:10',
    salida: '12:15',
    tiempo: '5 min',
    registradoPor: 'Portería',
  },
  {
    id: '8',
    hora: '12:30',
    nombre: 'Roberto Torres',
    documento: '1051234571',
    tipo: 'residente',
    destino: 'Torre 3',
    ingreso: '12:30',
    salida: '',
    tiempo: 'Activo',
    registradoPor: 'QR',
  },
];

const DEMO_VISITANTES_ESPERADOS: Visitante[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    documento: '1051234567',
    apto: '302',
    horaEsperada: '14:00',
    estado: 'esperado',
    invitadoPor: 'Ana García',
  },
  {
    id: '2',
    nombre: 'Carlos López',
    documento: '1051234588',
    apto: '205',
    horaEsperada: '15:30',
    estado: 'esperado',
    invitadoPor: 'María López',
  },
];

const DEMO_VEHICULOS: Vehiculo[] = [
  {
    id: '1',
    placa: 'ABC123',
    marca: 'Mazda 3',
    color: 'Gris',
    propietario: 'Luis Torres',
    apto: '302',
    parqueadero: 'P-12',
    estado: 'dentro',
  },
  {
    id: '2',
    placa: 'DEF456',
    marca: 'Toyota',
    color: 'Blanco',
    propietario: 'Ana García',
    apto: '101',
    parqueadero: 'P-5',
    estado: 'fuera',
  },
  {
    id: '3',
    placa: 'GHI789',
    marca: 'Renault',
    color: 'Rojo',
    propietario: 'Carlos Ruiz',
    apto: '205',
    parqueadero: 'P-18',
    estado: 'dentro',
  },
  {
    id: '4',
    placa: 'JKL012',
    marca: 'Chevrolet',
    color: 'Negro',
    propietario: 'M. Fernández',
    apto: '412',
    parqueadero: 'P-31',
    estado: 'dentro',
  },
];

const DEMO_TURNOS: TurnoPorteria[] = [
  {
    id: '1',
    nombre: 'Roberto Casas',
    turno: 'mañana',
    horaInicio: '06:00',
    horaFin: '14:00',
    novedades: 2,
  },
  {
    id: '2',
    nombre: 'Diana Moreno',
    turno: 'tarde',
    horaInicio: '14:00',
    horaFin: '22:00',
    novedades: 1,
  },
  {
    id: '3',
    nombre: 'Héctor Villada',
    turno: 'noche',
    horaInicio: '22:00',
    horaFin: '06:00',
    novedades: 0,
  },
];

const DEMO_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    usuario: 'Admin User',
    accion: 'Agregó persona a blacklist',
    registro: 'José Fernando M.',
    fecha: '2026-05-28',
    hora: '14:30',
  },
  {
    id: '2',
    usuario: 'Super Admin',
    accion: 'Cambió configuración de QR',
    registro: 'Acceso con QR activo',
    fecha: '2026-05-27',
    hora: '10:15',
  },
  {
    id: '3',
    usuario: 'Admin User',
    accion: 'Reseteó PIN de residente',
    documento: '1051234567',
    registro: 'Ana García',
    fecha: '2026-05-26',
    hora: '09:00',
  },
  {
    id: '4',
    usuario: 'Super Admin',
    accion: 'Integración con citófono',
    registro: 'Sistema Alarma Honeywell',
    fecha: '2026-05-25',
    hora: '16:45',
  },
];

const DEMO_CONJUNTOS: Conjunto[] = [
  {
    id: '1',
    nombre: 'Conjunto Los Pinos',
    torres: 3,
    residentes: 48,
    status: 'activo',
  },
  {
    id: '2',
    nombre: 'Parque Residencial Maya',
    torres: 5,
    residentes: 120,
    status: 'activo',
  },
  {
    id: '3',
    nombre: 'Torres del Centro',
    torres: 2,
    residentes: 32,
    status: 'activo',
  },
];

const CHART_DATA_INGRESO_HORA = [
  { hora: '06:00', ingresos: 2 },
  { hora: '07:00', ingresos: 8 },
  { hora: '08:00', ingresos: 12 },
  { hora: '09:00', ingresos: 15 },
  { hora: '10:00', ingresos: 10 },
  { hora: '11:00', ingresos: 8 },
  { hora: '12:00', ingresos: 6 },
  { hora: '13:00', ingresos: 4 },
  { hora: '14:00', ingresos: 7 },
  { hora: '15:00', ingresos: 9 },
  { hora: '16:00', ingresos: 11 },
  { hora: '17:00', ingresos: 13 },
  { hora: '18:00', ingresos: 14 },
];

const CHART_DATA_TIPO_INGRESO = [
  { name: 'Residentes', value: 65 },
  { name: 'Visitantes', value: 25 },
  { name: 'Proveedores', value: 10 },
];

const COLORS = ['#1E7EC8', '#00B5A0', '#F59E0B'];

const SuperAdminSecurityPage = () => {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'resumen' | 'bitacora' | 'visitantes' | 'vehiculos' | 'personal' | 'reportes' | 'configuracion' | 'administracion' | 'auditoria'>('resumen');
  const [searchBitacora, setSearchBitacora] = useState('');
  const [filterTipo, setFilterTipo] = useState<'todos' | 'residente' | 'visitante' | 'proveedor' | 'empleado'>('todos');
  const [selectedConjunto, setSelectedConjunto] = useState<string>('1');
  const [expandedAccessAdmin, setExpandedAccessAdmin] = useState<string | null>(null);

  if (!user || user.roleId !== 'super_admin') {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Acceso Denegado</h2>
        <p className="text-gray-600 mt-2">Solo Super Admin puede acceder a esta vista</p>
      </div>
    );
  }

  const currentConjunto = DEMO_CONJUNTOS.find(c => c.id === selectedConjunto) || DEMO_CONJUNTOS[0];
  const filteredAccesos = DEMO_ACCESOS.filter(a => {
    const matchSearch = a.nombre.toLowerCase().includes(searchBitacora.toLowerCase()) ||
                       a.documento.toLowerCase().includes(searchBitacora.toLowerCase());
    const matchTipo = filterTipo === 'todos' || a.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  const conteoVehiculos = {
    dentro: DEMO_VEHICULOS.filter(v => v.estado === 'dentro').length,
    total: DEMO_VEHICULOS.length,
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header with Multi-Conjunto Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0D2B4E] to-[#1E7EC8] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Seguridad y Acceso</h1>
              <p className="text-blue-100">Control total del sistema · Super Administrador</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition">
              <Download className="w-4 h-4" />
              Exportar Reporte
            </button>
            <button className="px-4 py-2 bg-[#00B5A0] hover:bg-[#00B5A0]/90 rounded-lg flex items-center gap-2 transition">
              <Settings2 className="w-4 h-4" />
              Configuración
            </button>
          </div>
        </div>

        {/* Conjunto Selector - P1 Only */}
        <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <Columns3 className="w-4 h-4 text-blue-100" />
          <select
            value={selectedConjunto}
            onChange={(e) => setSelectedConjunto(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-[#00B5A0]"
          >
            {DEMO_CONJUNTOS.map(c => (
              <option key={c.id} value={c.id} className="text-gray-900">
                {c.nombre} ({c.torres} torres, {c.residentes} residentes)
              </option>
            ))}
          </select>
          <span className="text-sm text-blue-100 ml-auto">Conjunto: {currentConjunto.nombre}</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-2 p-4 border-b border-gray-200 overflow-x-auto flex-wrap">
          {[
            { id: 'resumen', label: 'Resumen', icon: BarChart3 },
            { id: 'bitacora', label: 'Bitácora', icon: Activity },
            { id: 'visitantes', label: 'Visitantes', icon: Users },
            { id: 'vehiculos', label: 'Vehículos', icon: Car },
            { id: 'personal', label: 'Personal', icon: User },
            { id: 'reportes', label: 'Reportes', icon: FileText },
            { id: 'configuracion', label: 'Configuración', icon: Settings2 },
            { id: 'administracion', label: 'Accesos', icon: Lock },
            { id: 'auditoria', label: 'Auditoría', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#00B5A0] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* RESUMEN - Same as Admin but with multi-conjunto awareness */}
          {activeTab === 'resumen' && (
            <motion.div key="resumen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Ingresos hoy</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">34</p>
                      <p className="text-xs text-blue-600 mt-2">desde las 6:00 AM</p>
                    </div>
                    <LogOut className="w-8 h-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-teal-600 text-sm font-medium">Visitantes activos</p>
                      <p className="text-3xl font-bold text-teal-900 mt-2">8</p>
                      <p className="text-xs text-teal-600 mt-2">actualmente en el conjunto</p>
                    </div>
                    <Users className="w-8 h-8 text-teal-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Vehículos adentro</p>
                      <p className="text-3xl font-bold text-purple-900 mt-2">{conteoVehiculos.dentro}/{conteoVehiculos.total}</p>
                      <p className="text-xs text-purple-600 mt-2">de 48 parqueaderos</p>
                    </div>
                    <Car className="w-8 h-8 text-purple-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Novedades activas</p>
                      <p className="text-3xl font-bold text-red-900 mt-2">2</p>
                      <p className="text-xs text-red-600 mt-2">requieren atención</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Ingresos por hora</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={CHART_DATA_INGRESO_HORA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="hora" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="ingresos" stroke="#1E7EC8" strokeWidth={2} dot={{ fill: '#1E7EC8' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Ingresos por tipo</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={CHART_DATA_TIPO_INGRESO} cx="50%" cy="50%" labelLine={false} label={{ position: 'insideBottomRight', offset: -8 }} outerRadius={80} fill="#8884d8" dataKey="value">
                        {CHART_DATA_TIPO_INGRESO.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Últimas acciones (Top 10)</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {DEMO_ACCESOS.slice(0, 10).map((a) => (
                    <div key={a.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#00B5A0] transition">
                      <div className="w-8 h-8 rounded-full bg-[#00B5A0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {a.tipo === 'residente' && <Home className="w-4 h-4 text-[#00B5A0]" />}
                        {a.tipo === 'visitante' && <Users className="w-4 h-4 text-[#1E7EC8]" />}
                        {a.tipo === 'proveedor' && <Zap className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-gray-900 text-sm">{a.nombre}</p>
                          <span className="text-xs text-gray-500">{a.hora}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {a.tipo === 'residente' && 'Residente ingresó'}
                          {a.tipo === 'visitante' && 'Visitante ingresó'}
                          {a.tipo === 'proveedor' && 'Proveedor ingresó'}
                          {' '} • {a.destino} • Registrado por {a.registradoPor}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* BITÁCORA - Same as Admin */}
          {activeTab === 'bitacora' && (
            <motion.div key="bitacora" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex gap-4 flex-wrap items-center">
                <div className="flex-1 relative min-w-[250px]">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o documento..."
                    value={searchBitacora}
                    onChange={(e) => setSearchBitacora(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B5A0]"
                  />
                </div>
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B5A0] bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="residente">Residentes</option>
                  <option value="visitante">Visitantes</option>
                  <option value="proveedor">Proveedores</option>
                </select>
                <button className="px-4 py-2 bg-[#1E7EC8] text-white rounded-lg flex items-center gap-2 hover:bg-[#1E7EC8]/90 transition">
                  <Plus className="w-4 h-4" />
                  Nuevo registro
                </button>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-200">
                {filteredAccesos.length} registro(s) encontrado(s) ({DEMO_ACCESOS.length} total)
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">#</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Hora</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Nombre</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Documento</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Tipo</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Destino</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Ingreso</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Salida</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Tiempo</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Registrado por</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccesos.map((a, idx) => (
                      <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-600">{idx + 1}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs font-mono">{a.hora}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{a.nombre}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs font-mono">{a.documento}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                            {a.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{a.destino}</td>
                        <td className="px-6 py-4 text-gray-600">{a.ingreso}</td>
                        <td className="px-6 py-4 text-gray-600">{a.salida || '—'}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{a.tiempo}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{a.registradoPor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* VISITANTES - Same as Admin */}
          {activeTab === 'visitantes' && (
            <motion.div key="visitantes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Visitantes esperados hoy
                </h3>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Nombre</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Documento</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Apto</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Hora esperada</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Invitado por</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_VISITANTES_ESPERADOS.map((v) => (
                      <tr key={v.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{v.nombre}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs font-mono">{v.documento}</td>
                        <td className="px-6 py-4 text-gray-600">{v.apto}</td>
                        <td className="px-6 py-4 text-gray-600">{v.horaEsperada}</td>
                        <td className="px-6 py-4 text-gray-600">{v.invitadoPor}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Esperado
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition">
                            Marcar ingreso
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition">
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* VEHÍCULOS - Same as Admin */}
          {activeTab === 'vehiculos' && (
            <motion.div key="vehiculos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <p className="text-blue-600 text-sm font-medium mb-2">Vehículos adentro</p>
                  <p className="text-4xl font-bold text-blue-900">{conteoVehiculos.dentro}</p>
                  <p className="text-sm text-blue-600 mt-2">de {conteoVehiculos.total} registrados</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <p className="text-green-600 text-sm font-medium mb-2">Parqueaderos disponibles</p>
                  <p className="text-4xl font-bold text-green-900">{48 - conteoVehiculos.dentro}</p>
                  <p className="text-sm text-green-600 mt-2">de 48 espacios</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Vehículos registrados</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Placa</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Marca</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Color</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Propietario</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Apto</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Parqueadero</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_VEHICULOS.map((v) => (
                        <tr key={v.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900 font-mono">{v.placa}</td>
                          <td className="px-6 py-4 text-gray-600">{v.marca}</td>
                          <td className="px-6 py-4 text-gray-600">{v.color}</td>
                          <td className="px-6 py-4 text-gray-600">{v.propietario}</td>
                          <td className="px-6 py-4 text-gray-600">{v.apto}</td>
                          <td className="px-6 py-4 text-gray-600 font-mono">{v.parqueadero}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              v.estado === 'dentro'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {v.estado === 'dentro' ? 'Dentro' : 'Fuera'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* PERSONAL - Same as Admin */}
          {activeTab === 'personal' && (
            <motion.div key="personal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-gradient-to-r from-[#0D2B4E] to-[#1E7EC8] rounded-xl p-6 text-white">
                <p className="text-blue-100 text-sm font-medium mb-2">Turno actual (6:00 AM - 14:00)</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Roberto Casas</p>
                    <p className="text-blue-100 text-sm">Turno: Mañana (6:00 - 14:00) · 2 novedades</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Turnos de la semana</h3>
                <div className="space-y-3">
                  {DEMO_TURNOS.map((t) => (
                    <div key={t.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00B5A0] transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{t.nombre}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Turno {t.turno.charAt(0).toUpperCase() + t.turno.slice(1)} ({t.horaInicio} - {t.horaFin})
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          t.novedades > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {t.novedades} novedades
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* REPORTES - Same as Admin */}
          {activeTab === 'reportes' && (
            <motion.div key="reportes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm">Total ingresos mes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">847</p>
                  <p className="text-xs text-gray-500 mt-1">Promedio: 28/día</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm">Hora pico</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">7-9 AM</p>
                  <p className="text-xs text-gray-500 mt-1">Máximo flujo</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm">Día más activo</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">Viernes</p>
                  <p className="text-xs text-gray-500 mt-1">+15% promedio</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm">Variación mensual</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">+12%</p>
                  <p className="text-xs text-gray-500 mt-1">vs mes anterior</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Distribución por tipo (últimos 30 días)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'Residentes', value: 550, fill: '#1E7EC8' },
                    { name: 'Visitantes', value: 210, fill: '#00B5A0' },
                    { name: 'Proveedores', value: 87, fill: '#F59E0B' },
                  ]} layout="vertical" margin={{ left: 100 }}>
                    <XAxis type="number" />
                    <Bar dataKey="value" fill="#1E7EC8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <button className="w-full px-4 py-3 bg-[#1E7EC8] text-white rounded-lg hover:bg-[#1E7EC8]/90 transition flex items-center justify-center gap-2 font-medium">
                <Download className="w-5 h-5" />
                Generar informe PDF completo
              </button>
            </motion.div>
          )}

          {/* CONFIGURACIÓN - Same as Admin */}
          {activeTab === 'configuracion' && (
            <motion.div key="configuracion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-4">
                {[
                  { label: 'Tiempo máximo de visita permitido (horas)', value: '4' },
                  { label: 'Tiempo de espera máximo en portería (min)', value: '30' },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="font-medium text-gray-900">{setting.label}</label>
                    <input type="number" defaultValue={setting.value} className="px-3 py-2 border border-gray-300 rounded-lg w-24" />
                  </div>
                ))}

                {[
                  { label: 'Requiere documento para ingresar' },
                  { label: 'Requiere foto de visitante' },
                  { label: 'Notificar al residente cuando llega su visita' },
                  { label: 'Acceso con QR activo' },
                  { label: 'Registro de vehículos obligatorio' },
                ].map((toggle, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="font-medium text-gray-900">{toggle.label}</label>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  </div>
                ))}
              </div>

              <button className="w-full px-4 py-3 bg-[#00B5A0] text-white rounded-lg hover:bg-[#00B5A0]/90 transition font-medium">
                Guardar configuración
              </button>
            </motion.div>
          )}

          {/* ADMINISTRACIÓN DE ACCESOS - P1 Only */}
          {activeTab === 'administracion' && (
            <motion.div key="administracion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-600" />
                  Gestión de Credenciales y Accesos
                </h3>
                <p className="text-sm text-gray-600 mt-2">Crear, resetear y eliminar credenciales de portería, QR y PINs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Crear Credencial', desc: 'Generar nuevo QR o PIN', icon: Plus, color: 'green' },
                  { title: 'Resetear Contraseña', desc: 'Restaurar acceso a residente', icon: RotateCw, color: 'blue' },
                  { title: 'Desactivar Acceso', desc: 'Bloquear entrada de persona', icon: Lock, color: 'red' },
                ].map((action, idx) => {
                  const Icon = action.icon;
                  const colorClass = action.color === 'green' ? 'bg-green-50 border-green-200 text-green-600' :
                                   action.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                                   'bg-red-50 border-red-200 text-red-600';
                  return (
                    <button
                      key={idx}
                      className={`p-6 rounded-lg border-2 ${colorClass} hover:shadow-md transition`}
                    >
                      <Icon className="w-8 h-8 mb-2" />
                      <p className="font-bold text-gray-900">{action.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{action.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">Log de cambios recientes</h4>
                {[
                  { usuario: 'Admin User', accion: 'Reseteo de QR', residente: 'Ana García', fecha: 'Hoy 14:30' },
                  { usuario: 'Super Admin', accion: 'Creó nuevo PIN', residente: 'Luis Torres', fecha: 'Ayer 10:15' },
                  { usuario: 'Admin User', accion: 'Desactivó acceso', residente: 'José Fernando M.', fecha: '2 días atrás' },
                ].map((log, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{log.accion}</p>
                        <p className="text-sm text-gray-600 mt-1">{log.residente} • Por: {log.usuario}</p>
                      </div>
                      <span className="text-xs text-gray-500">{log.fecha}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AUDITORÍA - P1 Only */}
          {activeTab === 'auditoria' && (
            <motion.div key="auditoria" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Auditoría de Acciones Administrativas
                </h3>
                <p className="text-sm text-gray-600 mt-2">Registro completo de cambios en configuración y gestión (últimos 30 días)</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B5A0]"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B5A0] bg-white">
                  <option>Todos los usuarios</option>
                  <option>Super Admin</option>
                  <option>Admin Users</option>
                </select>
                <button className="px-4 py-2 bg-[#1E7EC8] text-white rounded-lg hover:bg-[#1E7EC8]/90 transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar Auditoría
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Fecha</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Hora</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Usuario</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Acción</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Registro Afectado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_AUDIT_LOGS.map((log) => (
                      <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-600 text-xs font-mono">{log.fecha}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs font-mono">{log.hora}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{log.usuario}</td>
                        <td className="px-6 py-4 text-gray-600">{log.accion}</td>
                        <td className="px-6 py-4 text-gray-600">{log.registro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSecurityPage;
