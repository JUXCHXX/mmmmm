import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { Shield, AlertTriangle, Clock, CheckCircle2, XCircle, AlertCircle, Search, Filter, Download, Plus, QrCode, MapPin, User, Phone, Calendar, Lock, Wifi, Eye, Trash2, Edit2, Send, BarChart3, TrendingUp, Activity, MapPinOff, Smartphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FloatingContainer } from '@/components/FloatingContainer';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ========== MOCK DATA ==========
const MOCK_CONDOS = [
  { nombre: 'Torres del Parque', ciudad: 'Bogotá', ingresos: 28, alertas: 2, estado: 'conectado' },
  { nombre: 'Vida Bella', ciudad: 'Medellín', ingresos: 15, alertas: 0, estado: 'conectado' },
  { nombre: 'El Retiro', ciudad: 'Cali', ingresos: 8, alertas: 1, estado: 'conectado' },
  { nombre: 'Mirador del Mar', ciudad: 'Cartagena', ingresos: 12, alertas: 3, estado: 'alerta' },
];

const MOCK_ACCESS_LOGS = [
  { id: '1', hora: '09:45', nombre: 'Juan Pérez / ABC-1234', tipo: 'residente', unidad: '401', metodo: 'placa', estado: 'autorizado', conjunto: 'Torres del Parque', registradoPor: 'Sistema' },
  { id: '2', hora: '09:42', nombre: 'María García', tipo: 'visitante', unidad: '203', metodo: 'qr', estado: 'autorizado', conjunto: 'Torres del Parque', registradoPor: 'Portería' },
  { id: '3', hora: '09:38', nombre: 'Carlos López / XYZ-5678', tipo: 'proveedor', unidad: '105', metodo: 'manual', estado: 'denegado', conjunto: 'Torres del Parque', registradoPor: 'Portería' },
  { id: '4', hora: '09:35', nombre: 'Delivery - RapidoFood', tipo: 'delivery', unidad: '302', metodo: 'qr', estado: 'autorizado', conjunto: 'Torres del Parque', registradoPor: 'Sistema' },
  { id: '5', hora: '09:20', nombre: 'Roberto Gómez', tipo: 'visitante', unidad: '501', metodo: 'manual', estado: 'autorizado', conjunto: 'Torres del Parque', registradoPor: 'Portería' },
];

const MOCK_ALERTS = [
  { id: '1', severity: 'critical', description: 'Intento de acceso no autorizado en parqueadero nivel 2', condo: 'Torres del Parque', timestamp: '09:32' },
  { id: '2', severity: 'warning', description: 'Puerta de acceso principal abierta por más de 5 minutos', condo: 'Torres del Parque', timestamp: '09:15' },
  { id: '3', severity: 'warning', description: 'Visitante sin registro en lista blanca intentando acceso', condo: 'Mirador del Mar', timestamp: '08:58' },
  { id: '4', severity: 'info', description: 'Sincronización completada en 4 lectores ALPR', condo: 'Vida Bella', timestamp: '08:45' },
];

const MOCK_TREND_DATA = [
  { hora: '08:00', ingresos: 8, egresos: 5 },
  { hora: '08:30', ingresos: 12, egresos: 9 },
  { hora: '09:00', ingresos: 18, egresos: 14 },
  { hora: '09:30', ingresos: 28, egresos: 22 },
];

const MOCK_QR_INVITATIONS = [
  { id: '1', qr: 'QR001', conjunto: 'Torres del Parque', generadoPor: 'Admin', visitante: 'Laura Martínez', unidad: '501', validDesde: '2026-04-10', validHasta: '2026-04-12', usosPermitidos: 3, usosUsados: 1, estado: 'activo' },
];

const MOCK_DEVICES = [
  { id: '1', nombre: 'Cámara Entrada Principal', tipo: 'camera', conjunto: 'Torres del Parque', estado: 'conectado', ultimaSincronizacion: '2026-04-13 09:00' },
  { id: '2', nombre: 'Lector Placa Parqueadero', tipo: 'lector', conjunto: 'Torres del Parque', estado: 'conectado', ultimaSincronizacion: '2026-04-13 09:15' },
  { id: '3', nombre: 'Cerradura Zona VIP', tipo: 'cerradura', conjunto: 'Torres del Parque', estado: 'desconectado', ultimaSincronizacion: '2026-04-13 08:30' },
];

// ========== COMPONENT ==========
const SecurityControlPage = () => {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'control' | 'historial' | 'qr' | 'integraciones'>('control');
  const [selectedCondo, setSelectedCondo] = useState('Torres del Parque');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  const roleId = user?.roleId ?? 'propietario';
  const isAuthorized = roleId === 'super_admin' || roleId === 'admin';

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground mb-6">No tienes permisos para acceder a este módulo</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  const isSuperAdmin = roleId === 'super_admin';
  const filteredAccessLogs = MOCK_ACCESS_LOGS.filter(log => {
    if (!isSuperAdmin && log.conjunto !== selectedCondo) return false;
    if (searchTerm && !log.nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredAlerts = isSuperAdmin
    ? MOCK_ALERTS
    : MOCK_ALERTS.filter((a) => a.condo === selectedCondo);

  // KPIs
  const totalAccesos = filteredAccessLogs.length;
  const autorizados = filteredAccessLogs.filter(l => l.estado === 'autorizado').length;
  const denegados = filteredAccessLogs.filter(l => l.estado === 'denegado').length;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" /> Seguridad & Control de Acceso
        </h1>
        {!isSuperAdmin && (
          <p className="text-sm text-muted-foreground">Conjunto: <span className="font-semibold text-primary">{selectedCondo}</span></p>
        )}
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl border border-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Accesos Hoy</p>
              <p className="text-2xl font-bold text-blue-400">{totalAccesos}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl border border-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Autorizados</p>
              <p className="text-2xl font-bold text-emerald-400">{autorizados}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl border border-red-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Denegados</p>
              <p className="text-2xl font-bold text-red-400">{denegados}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl border border-amber-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Alertas Activas</p>
              <p className="text-2xl font-bold text-amber-400">{filteredAlerts.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-400 opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'control', label: 'Centro de Control', icon: Shield },
          { id: 'historial', label: 'Registro de Ingresos', icon: Clock },
          { id: 'qr', label: 'Invitaciones QR', icon: QrCode },
          { id: 'integraciones', label: 'Hardware', icon: Wifi },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-primary/20 text-primary border border-primary/50' : 'text-muted-foreground hover:text-foreground border border-[rgba(255,255,255,0.1)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Centro de Control */}
      <AnimatePresence mode="wait">
        {activeTab === 'control' && (
          <motion.div key="control" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {isSuperAdmin ? (
              // Super Admin: 3 columnas
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[600px]">
                {/* Conjuntos */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-1 bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl max-h-[600px] overflow-y-auto"
                >
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Conjuntos
                  </h3>
                  <div className="space-y-2">
                    {MOCK_CONDOS.map((condo) => (
                      <button
                        key={condo.nombre}
                        onClick={() => setSelectedCondo(condo.nombre)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedCondo === condo.nombre
                            ? 'bg-primary/20 border border-primary'
                            : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{condo.nombre}</p>
                            <p className="text-xs text-muted-foreground">{condo.ciudad}</p>
                          </div>
                          {condo.alertas > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 whitespace-nowrap">
                              {condo.alertas}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {condo.ingresos} ingresos</p>
                        <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${condo.estado === 'conectado' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {condo.estado === 'conectado' ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              Conectado
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                              Alerta
                            </>
                          )}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Tabla de Accesos Vivo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2 bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl max-h-[600px] overflow-hidden flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-sm font-bold text-foreground flex-1">Accesos en Tiempo Real</h3>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> EN VIVO
                    </span>
                  </div>

                  <div className="space-y-2 overflow-y-auto flex-1">
                    {filteredAccessLogs.map((log, idx) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className={`p-3 rounded-lg text-xs border ${
                          log.estado === 'autorizado'
                            ? 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50'
                            : 'bg-red-500/15 border-red-500/40 hover:border-red-500/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-foreground">{log.hora}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
                            log.estado === 'autorizado'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {log.estado === 'autorizado' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                          </span>
                        </div>
                        <p className="text-muted-foreground truncate">{log.nombre}</p>
                        <p className="text-muted-foreground text-xs">{log.tipo} → Apto {log.unidad}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Alertas */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-1 bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl max-h-[600px] overflow-y-auto"
                >
                  <h3 className="text-sm font-bold text-foreground mb-4 inline-flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    Alertas Activas
                  </h3>
                  <div className="space-y-3">
                    {filteredAlerts.length > 0 ? (
                      filteredAlerts.map((alert) => {
                        const colors = {
                          critical: 'bg-red-500/20 border-red-500/40',
                          warning: 'bg-amber-500/20 border-amber-500/40',
                          info: 'bg-blue-500/20 border-blue-500/40',
                        };

                        return (
                          <div key={alert.id} className={`p-3 rounded-lg border ${colors[alert.severity]}`}>
                            <p className="text-xs font-bold text-foreground mb-1">{alert.description}</p>
                            <p className="text-xs text-muted-foreground">{alert.condo} • {alert.timestamp}</p>
                            <button className="w-full mt-2 py-1.5 rounded-md text-xs font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                              Atender
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-70" />
                        <p className="text-xs text-muted-foreground">Sin alertas activas</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              // Admin PH: 2 columnas
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <motion.div className="lg:col-span-2 bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold text-foreground">Accesos en Vivo</h3>
                    <span className="ml-auto px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> EN VIVO
                    </span>
                  </div>
                  <div className="space-y-3">
                    {filteredAccessLogs.map((log) => (
                      <div key={log.id} className={`p-4 rounded-lg ${
                        log.estado === 'autorizado'
                          ? 'bg-emerald-500/10 border border-emerald-500/20'
                          : 'bg-red-500/10 border border-red-500/30'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground">{log.hora} • {log.nombre}</p>
                            <p className="text-sm text-muted-foreground">{log.tipo} → Apto {log.unidad}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-lg font-bold text-sm flex items-center gap-1 ${
                            log.estado === 'autorizado'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {log.estado === 'autorizado' ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> Autorizado
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" /> Denegado
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Método: {log.metodo.toUpperCase()}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-foreground mb-4">Alertas</h3>
                  {filteredAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {filteredAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border ${
                            alert.severity === 'critical'
                              ? 'bg-red-500/20 border-red-500/30'
                              : 'bg-amber-500/20 border-amber-500/30'
                          }`}
                        >
                          <p className="text-xs font-bold text-foreground mb-1">{alert.description}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Sin alertas</p>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {/* Gráfico de Tendencia */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl"
            >
              <h3 className="text-sm font-bold text-foreground mb-4">Tendencia de Accesos por Hora</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={MOCK_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hora" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Bar dataKey="ingresos" fill="#10B981" name="Ingresos" />
                  <Bar dataKey="egresos" fill="#F59E0B" name="Egresos" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'historial' && (
          <motion.div key="historial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-lg font-bold text-foreground">Registro Detallado de Accesos</h3>
              <button className="btn-premium px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> Exportar
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b border-[rgba(255,255,255,0.1)]">
              {isSuperAdmin && (
                <div>
                  <label className="text-xs font-bold text-foreground mb-2 block">Conjunto</label>
                  <select
                    value={selectedCondo}
                    onChange={(e) => setSelectedCondo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    {MOCK_CONDOS.map((condo) => (
                      <option key={condo.nombre} value={condo.nombre}>
                        {condo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-foreground mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nombre o placa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                    <th className="text-left p-4 font-bold text-foreground">Hora</th>
                    <th className="text-left p-4 font-bold text-foreground">Persona</th>
                    <th className="text-left p-4 font-bold text-foreground">Tipo</th>
                    {isSuperAdmin && <th className="text-left p-4 font-bold text-foreground">Conjunto</th>}
                    <th className="text-left p-4 font-bold text-foreground">Unidad</th>
                    <th className="text-left p-4 font-bold text-foreground">Método</th>
                    <th className="text-center p-4 font-bold text-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccessLogs.map((log, idx) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.05)] transition-colors ${
                        log.estado === 'denegado' ? 'bg-red-500/5' : ''
                      }`}
                    >
                      <td className="p-4 text-muted-foreground">{log.hora}</td>
                      <td className="p-4 font-medium text-foreground">{log.nombre}</td>
                      <td className="p-4 text-muted-foreground text-xs">{log.tipo}</td>
                      {isSuperAdmin && <td className="p-4 text-muted-foreground text-xs">{log.conjunto}</td>}
                      <td className="p-4 font-bold text-foreground">{log.unidad}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400">
                          {log.metodo.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs ${
                            log.estado === 'autorizado'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {log.estado === 'autorizado' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {log.estado}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'qr' && (
          <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <motion.div className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl flex items-center justify-between">
              {isSuperAdmin && (
                <select
                  value={selectedCondo}
                  onChange={(e) => setSelectedCondo(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground text-sm focus:outline-none focus:border-primary"
                >
                  {MOCK_CONDOS.map((condo) => (
                    <option key={condo.nombre} value={condo.nombre}>
                      {condo.nombre}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setShowQRModal(true)}
                className="ml-auto btn-premium px-4 py-2 rounded-xl text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Generar Invitación
              </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_QR_INVITATIONS.map((inv, idx) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">{inv.visitante}</p>
                      <p className="text-xs text-muted-foreground">Apto {inv.unidad}</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">
                      Activo
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/10 mb-3 text-center">
                    <QrCode className="w-12 h-12 text-primary mx-auto" />
                    <p className="text-xs text-muted-foreground mt-1">{inv.qr}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded bg-[rgba(255,255,255,0.04)]">
                      <p className="text-xs text-muted-foreground">Válido</p>
                      <p className="font-bold text-foreground text-xs">{inv.validDesde}</p>
                    </div>
                    <div className="p-2 rounded bg-[rgba(255,255,255,0.04)]">
                      <p className="text-xs text-muted-foreground">Hasta</p>
                      <p className="font-bold text-foreground text-xs">{inv.validHasta}</p>
                    </div>
                    <div className="p-2 rounded bg-[rgba(255,255,255,0.04)]">
                      <p className="text-xs text-muted-foreground">Usos</p>
                      <p className="font-bold text-foreground text-xs">{inv.usosUsados}/{inv.usosPermitidos}</p>
                    </div>
                    <div className="p-2 rounded bg-[rgba(255,255,255,0.04)]">
                      <p className="text-xs text-muted-foreground">Por</p>
                      <p className="font-bold text-foreground text-xs">{inv.generadoPor}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-1">
                      <Edit2 className="w-3 h-3" /> Editar
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1">
                      <Trash2 className="w-3 h-3" /> Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'integraciones' && (
          <motion.div key="integraciones" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_DEVICES.map((device, idx) => {
              const icons = { camera: Eye, lector: QrCode, cerradura: Lock };
              const Icon = icons[device.tipo as keyof typeof icons] || Wifi;

              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      device.estado === 'conectado'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {device.estado === 'conectado' ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {device.estado}
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-400"></span> {device.estado}
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground mb-1">{device.nombre}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{device.conjunto}</p>

                  <div className="bg-[rgba(255,255,255,0.04)] rounded-lg p-2 mb-3 text-xs">
                    <p className="text-muted-foreground">Última Sync</p>
                    <p className="text-foreground">{device.ultimaSincronizacion}</p>
                  </div>

                  <button className="w-full py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 text-xs font-medium transition-colors">
                    Configurar
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <FloatingContainer isOpen={showQRModal} onClose={() => setShowQRModal(false)} title="Generar Invitación QR" icon={<QrCode className="w-5 h-5" />} size="md">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
              <User className="w-4 h-4 text-primary" strokeWidth={1.5} />
              Nombre Visitante *
            </label>
            <input type="text" placeholder="Ej: Laura Martínez" className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
              <AlertCircle className="w-4 h-4 text-primary" strokeWidth={1.5} />
              Documento *
            </label>
            <input type="text" placeholder="1234567890" className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />
              Unidad Destino *
            </label>
            <input type="text" placeholder="Ej: 401" className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground focus:outline-none focus:border-primary" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                <Calendar className="w-4 h-4 text-primary" strokeWidth={1.5} />
                Fecha Visita
              </label>
              <input type="date" className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                <Lock className="w-4 h-4 text-primary" strokeWidth={1.5} />
                Número Usos
              </label>
              <input type="number" defaultValue="1" className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <button onClick={() => setShowQRModal(false)} className="flex-1 py-2 rounded-lg bg-gray-500/20 text-gray-400 font-medium hover:bg-gray-500/30 transition-colors">
              Cancelar
            </button>
            <button
              onClick={() => {
                toast({ title: 'QR Generado', description: 'Código creado exitosamente', variant: 'default' });
                setShowQRModal(false);
              }}
              className="flex-1 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" strokeWidth={1.5} />
              Generar
            </button>
          </div>
        </div>
      </FloatingContainer>
    </div>
  );
};

export default SecurityControlPage;
