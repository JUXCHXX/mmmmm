import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import {
  ShieldCheck, Users, Lock, Key, Activity, Trash2, Plus, Edit, Eye, EyeOff,
  CheckCircle, AlertCircle, Clock, User, Mail, Globe, Smartphone, ArrowUpRight,
  ArrowDownLeft, Search, Filter, Download, RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'consejo' | 'propietario' | 'arrendatario' | 'porteria' | 'proveedor';
  status: 'active' | 'inactive' | 'suspended';
  lastAccess: string;
  createdAt: string;
  ipAddresses: string[];
  lastIp: string;
}

interface RolePermission {
  id: string;
  role: string;
  module: string;
  permissions: ('view' | 'create' | 'edit' | 'delete')[];
  granted: boolean;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  status: 'success' | 'failed';
  ip: string;
  details: string;
  severity: 'info' | 'warning' | 'error';
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'password' | 'session' | '2fa' | 'ip_whitelist' | 'encryption';
  status: 'active' | 'inactive';
  value: string;
  lastModified: string;
  modifiedBy: string;
}

// SAMPLE DATA
const SAMPLE_USERS: SystemUser[] = [
  {
    id: '1',
    name: 'Juan Administrador',
    email: 'juan@bunty.com',
    role: 'admin',
    status: 'active',
    lastAccess: '5 min',
    createdAt: '2024-01-15',
    ipAddresses: ['192.168.1.100', '192.168.1.101'],
    lastIp: '192.168.1.100'
  },
  {
    id: '2',
    name: 'Maria Porteria',
    email: 'maria@bunty.com',
    role: 'porteria',
    status: 'active',
    lastAccess: '2 hours',
    createdAt: '2024-02-01',
    ipAddresses: ['192.168.1.50'],
    lastIp: '192.168.1.50'
  },
  {
    id: '3',
    name: 'Carlos Consejo',
    email: 'carlos@bunty.com',
    role: 'consejo',
    status: 'inactive',
    lastAccess: '1 week',
    createdAt: '2024-01-20',
    ipAddresses: ['192.168.1.75'],
    lastIp: '192.168.1.75'
  },
  {
    id: '4',
    name: 'Sandra Propietario',
    email: 'sandra.p@bunty.com',
    role: 'propietario',
    status: 'active',
    lastAccess: '30 min',
    createdAt: '2024-02-10',
    ipAddresses: ['192.168.1.85', '10.0.0.50'],
    lastIp: '10.0.0.50'
  },
  {
    id: '5',
    name: 'Roberto Proveedor',
    email: 'r.proveedor@external.com',
    role: 'proveedor',
    status: 'suspended',
    lastAccess: '3 days',
    createdAt: '2024-03-01',
    ipAddresses: ['203.0.113.100'],
    lastIp: '203.0.113.100'
  },
  {
    id: '6',
    name: 'Patricia Arrendatario',
    email: 'patricia.arr@bunty.com',
    role: 'arrendatario',
    status: 'active',
    lastAccess: '15 min',
    createdAt: '2024-03-15',
    ipAddresses: ['192.168.1.110'],
    lastIp: '192.168.1.110'
  },
];

const SAMPLE_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    user: 'Juan Administrador',
    action: 'Create User',
    module: 'Admin - Usuarios',
    timestamp: '2024-04-08 14:35:23',
    status: 'success',
    ip: '192.168.1.100',
    details: 'Nuevo usuario: Maria Porteria',
    severity: 'info'
  },
  {
    id: '2',
    user: 'Maria Porteria',
    action: 'View Residents',
    module: 'Residentes',
    timestamp: '2024-04-08 14:30:15',
    status: 'success',
    ip: '192.168.1.50',
    details: 'Consulta de residentes activos',
    severity: 'info'
  },
  {
    id: '3',
    user: 'Unknown',
    action: 'Failed Login',
    module: 'Auth',
    timestamp: '2024-04-08 14:25:00',
    status: 'failed',
    ip: '203.0.113.45',
    details: 'Intento de login fallido - Contraseña incorrecta',
    severity: 'warning'
  },
  {
    id: '4',
    user: 'Juan Administrador',
    action: 'Delete User',
    module: 'Admin - Usuarios',
    timestamp: '2024-04-08 14:15:32',
    status: 'success',
    ip: '192.168.1.100',
    details: 'Usuario eliminado: expired_account',
    severity: 'warning'
  },
  {
    id: '5',
    user: 'Sandra Propietario',
    action: 'Create Reservation',
    module: 'Reservas',
    timestamp: '2024-04-08 13:55:12',
    status: 'success',
    ip: '10.0.0.50',
    details: 'Nueva reserva: Sala Común - 08/04/2024',
    severity: 'info'
  },
  {
    id: '6',
    user: 'Roberto Proveedor',
    action: 'Unauthorized Access',
    module: 'Documentos',
    timestamp: '2024-04-08 13:42:00',
    status: 'failed',
    ip: '203.0.113.100',
    details: 'Intento de acceso denegado a módulo restringido',
    severity: 'error'
  },
  {
    id: '7',
    user: 'Juan Administrador',
    action: 'Update Policy',
    module: 'Admin - Políticas',
    timestamp: '2024-04-08 13:20:45',
    status: 'success',
    ip: '192.168.1.100',
    details: 'Política de contraseña actualizada: min 12 caracteres',
    severity: 'warning'
  },
  {
    id: '8',
    user: 'Patricia Arrendatario',
    action: 'View Payment',
    module: 'Pagos',
    timestamp: '2024-04-08 12:50:30',
    status: 'success',
    ip: '192.168.1.110',
    details: 'Consulta de cuota y pagos pendientes',
    severity: 'info'
  },
];

const SECURITY_POLICIES: SecurityPolicy[] = [
  {
    id: '1',
    name: 'Contraseña Mínima',
    description: 'Longitud mínima de contraseña',
    category: 'password',
    status: 'active',
    value: '12 caracteres',
    lastModified: '2024-03-15',
    modifiedBy: 'Admin'
  },
  {
    id: '2',
    name: 'Expiración de Sesión',
    description: 'Tiempo máximo de sesión activa',
    category: 'session',
    status: 'active',
    value: '30 minutos',
    lastModified: '2024-03-10',
    modifiedBy: 'Admin'
  },
  {
    id: '3',
    name: 'Autenticación 2FA',
    description: 'Requerir dos factores de autenticación',
    category: '2fa',
    status: 'active',
    value: 'Habilitado para Super Admin',
    lastModified: '2024-02-28',
    modifiedBy: 'Admin'
  },
  {
    id: '4',
    name: 'Control de IPs',
    description: 'IPs autorizadas para acceso',
    category: 'ip_whitelist',
    status: 'inactive',
    value: '5 IPs configuradas',
    lastModified: '2024-02-15',
    modifiedBy: 'Admin'
  },
];

const ROLE_PERMISSIONS: RolePermission[] = [
  { id: '1', role: 'admin', module: 'Usuarios', permissions: ['view', 'create', 'edit'], granted: true },
  { id: '2', role: 'admin', module: 'Roles', permissions: ['view', 'edit'], granted: true },
  { id: '3', role: 'consejo', module: 'Usuarios', permissions: ['view'], granted: true },
  { id: '4', role: 'porteria', module: 'Seguridad', permissions: ['view', 'edit'], granted: true },
  { id: '5', role: 'propietario', module: 'Usuarios', permissions: [], granted: false },
];

const AUDIT_CHART_DATA = [
  { time: '08:00', success: 45, failed: 2, warning: 5 },
  { time: '10:00', success: 52, failed: 1, warning: 3 },
  { time: '12:00', success: 38, failed: 3, warning: 7 },
  { time: '14:00', success: 61, failed: 2, warning: 4 },
  { time: '16:00', success: 55, failed: 4, warning: 6 },
  { time: '18:00', success: 48, failed: 1, warning: 2 },
];

const AdminSecurityPage = () => {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit' | 'policies'>('users');
  const [users, setUsers] = useState<SystemUser[]>(SAMPLE_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SAMPLE_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  if (!user || (user.roleId !== 'super_admin' && user.roleId !== 'admin')) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Acceso Denegado</h2>
        <p className="text-gray-600 mt-2">No tienes permisos para acceder a este módulo</p>
      </div>
    );
  }

  // Gestión de Usuarios
  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'suspended' as const } : u));
    toast({ title: 'Usuario suspendido', description: 'El acceso ha sido bloqueado' });
  };

  const handleReactivateUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' as const } : u));
    toast({ title: 'Usuario reactivado', description: 'El acceso ha sido restaurado' });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({ title: 'Usuario eliminado', description: 'El usuario ha sido removido del sistema' });
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtrado de logs
  const filteredAuditLogs = auditLogs.filter(log =>
    log.user.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(auditSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0D2B4E] to-[#1E7EC8] rounded-xl p-6 text-white"
      >
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Seguridad del Sistema</h1>
        </div>
        <p className="text-blue-100">Administración de usuarios, roles, permisos y políticas de seguridad</p>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-2 p-4 border-b border-gray-200 flex-wrapper">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'users'
                ? 'bg-[#00B5A0] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'roles'
                ? 'bg-[#00B5A0] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Key className="w-4 h-4" />
            Roles y Permisos
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'audit'
                ? 'bg-[#00B5A0] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Auditoría
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'policies'
                ? 'bg-[#00B5A0] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            Políticas
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Gestión de Usuarios */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex gap-4 mb-6 flex-wrap items-center">
                <div className="flex-1 relative min-w-[250px]">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B5A0]"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B5A0] bg-white"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                  <option value="suspended">Suspendidos</option>
                </select>
                <button className="px-4 py-2 bg-[#1E7EC8] text-white rounded-lg flex items-center gap-2 hover:bg-[#1E7EC8]/90 transition">
                  <Plus className="w-4 h-4" />
                  Nuevo Usuario
                </button>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-200">
                {filteredUsers.length} usuario(s) encontrado(s) ({users.length} total)
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Último Acceso</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Última IP</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#00B5A0]/20 flex items-center justify-center">
                              <User className="w-5 h-5 text-[#00B5A0]" />
                            </div>
                            <span className="font-medium text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            u.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : u.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {u.status === 'active' ? 'Activo' : u.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{u.lastAccess}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-mono text-xs">{u.lastIp}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {u.status !== 'suspended' && (
                              <button
                                onClick={() => handleSuspendUser(u.id)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                                title="Suspender"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                            )}
                            {u.status === 'suspended' && (
                              <button
                                onClick={() => handleReactivateUser(u.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Reactivar"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Roles y Permisos */}
          {activeTab === 'roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['super_admin', 'admin', 'consejo', 'propietario', 'porteria', 'proveedor'].map((role) => (
                  <motion.div
                    key={role}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#00B5A0] transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 capitalize">{role.replace('_', ' ')}</h3>
                      <Edit className="w-4 h-4 text-gray-400 hover:text-[#00B5A0]" />
                    </div>
                    <div className="space-y-2 text-sm">
                      {ROLE_PERMISSIONS.filter(rp => rp.role === role).map((perm) => (
                        <div key={perm.id} className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${perm.granted ? 'text-green-500' : 'text-gray-300'}`} />
                          <span className="text-gray-600">{perm.module}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Matriz de Permisos Completa</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">Rol</th>
                        <th className="px-4 py-2 text-center text-gray-700 font-semibold">Ver</th>
                        <th className="px-4 py-2 text-center text-gray-700 font-semibold">Crear</th>
                        <th className="px-4 py-2 text-center text-gray-700 font-semibold">Editar</th>
                        <th className="px-4 py-2 text-center text-gray-700 font-semibold">Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['super_admin', 'admin', 'consejo', 'porteria'].map((role) => (
                        <tr key={role} className="border-b border-blue-100">
                          <td className="px-4 py-2 font-medium text-gray-700 capitalize">{role.replace('_', ' ')}</td>
                          <td className="px-4 py-2 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                          <td className="px-4 py-2 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                          <td className="px-4 py-2 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                          <td className="px-4 py-2 text-center">
                            {role === 'super_admin' || role === 'admin' ?
                              <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> :
                              <AlertCircle className="w-4 h-4 text-gray-300 mx-auto" />
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Log de Auditoría */}
          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Gráfico de Auditoría */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Actividad de Sistema (Últimas 24h)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={AUDIT_CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Exitosas" />
                    <Line type="monotone" dataKey="warning" stroke="#f59e0b" strokeWidth={2} name="Advertencia" />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Fallidas" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Filtros */}
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Buscar en auditoría..."
                  value={auditSearchTerm}
                  onChange={(e) => setAuditSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B5A0] flex-1 min-w-[250px]"
                />
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              </div>

              {/* Tabla de Logs */}
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-200">
                {filteredAuditLogs.length} evento(s) encontrado(s) ({auditLogs.length} total)
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Hora</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Usuario</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Acción</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Módulo</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">IP</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-600 text-xs">{log.timestamp}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{log.user}</td>
                        <td className="px-6 py-4 text-gray-700">{log.action}</td>
                        <td className="px-6 py-4 text-gray-600">{log.module}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs font-mono">{log.ip}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            log.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status === 'success' ? 'Éxito' : 'Fallida'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Políticas de Seguridad */}
          {activeTab === 'policies' && (
            <motion.div
              key="policies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <button className="px-4 py-2 bg-[#1E7EC8] text-white rounded-lg flex items-center gap-2 hover:bg-[#1E7EC8]/90 transition ml-auto">
                <Plus className="w-4 h-4" />
                Nueva Política
              </button>

              <div className="space-y-3">
                {SECURITY_POLICIES.map((policy) => (
                  <motion.div
                    key={policy.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{policy.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        policy.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {policy.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Categoría:</span>
                        <p className="font-medium text-gray-900 capitalize">{policy.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Valor:</span>
                        <p className="font-medium text-gray-900">{policy.value}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Última Mod.:</span>
                        <p className="font-medium text-gray-900 text-xs">{policy.lastModified}</p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button className="p-2 hover:bg-blue-50 rounded text-blue-600 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded text-gray-600 transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded text-red-600 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSecurityPage;
