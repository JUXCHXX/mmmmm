import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FloatingModalUnified } from '../FloatingModalUnified';
import { ROLES } from '@/types/roles';
import { 
  LogOut, Mail, Phone, MapPin, User, DollarSign, BarChart3, Home, Eye, Calendar, Bell, 
  CreditCard, ShieldCheck, Clock3, BellRing, ChevronDown, Zap, Edit, Settings, 
  Download, Smartphone, HelpCircle, CheckCircle, Sparkles, TrendingUp, AlertCircle,
  Users, Building2, Award, Shield, Key, Clock, FileText 
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedProperty {
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  storage?: number;
  hasElevator?: boolean;
  hasSecurity?: boolean;
  hasIntercom?: boolean;
  hasBalcony?: boolean;
  orientation?: string;
}

export const UserProfileModal = ({ isOpen, onClose }: UserProfileModalProps) => {
  const { user, logout, switchRole } = useAuthStore();
  const appStore = useAppStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');

  if (!user) return null;

  // Fallback data
  const role = ROLES[user.roleId as keyof typeof ROLES] || { label: 'Usuario', color: 'gray' };
  const initials = user.name?.slice(0,2).toUpperCase() || 'US';

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSwitchRole = (roleId: 'super_admin' | 'admin') => {
    switchRole(roleId);
    onClose();
  };

  const ProfileTabContent = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pb-6 border-b border-gray-200"
      >
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-2xl border-4 border-white">
          <span className="text-3xl font-black text-white tracking-wider">{initials}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name || 'Usuario'}</h2>
        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">{role.label}</p>
        <p className="text-xs text-gray-400">ID: {user.id?.slice(-8) || 'N/A'}</p>
      </motion.div>

      {/* Contact Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
          <User className="w-5 h-5 text-blue-600" />
          Información de Contacto
        </h3>
        <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
            <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-900 block">{user.email}</span>
              <span className="text-sm text-gray-500">Correo principal</span>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-900 block">{user.phone}</span>
                <span className="text-sm text-gray-500">Teléfono</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Role Switcher - Testing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
          <Shield className="w-5 h-5 text-purple-600" />
          Cambiar Rol (Testing)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSwitchRole('super_admin')}
            className={`p-3 rounded-xl border-2 transition-all ${
              user.roleId === 'super_admin'
                ? 'bg-purple-100 border-purple-500 text-purple-900 font-semibold'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-50'
            }`}
          >
            <div className="text-sm font-semibold">Super Admin</div>
            <div className="text-xs text-gray-600">P1</div>
          </button>
          <button
            onClick={() => handleSwitchRole('admin')}
            className={`p-3 rounded-xl border-2 transition-all ${
              user.roleId === 'admin'
                ? 'bg-blue-100 border-blue-500 text-blue-900 font-semibold'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50'
            }`}
          >
            <div className="text-sm font-semibold">Administrador</div>
            <div className="text-xs text-gray-600">P2</div>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">Usa estos botones para testear la vista de Seguridad del Conjunto</p>
      </motion.div>

      {/* Role & Permissions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
          <Shield className="w-5 h-5 text-emerald-600" />
          {role.label} - Acceso Completo
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3 hover:bg-emerald-100 transition-all">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-emerald-900 mb-1">Dashboard & Analytics</h4>
              <p className="text-xs text-emerald-700">Visualización completa de métricas y reportes</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3 hover:bg-emerald-100 transition-all">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-emerald-900 mb-1">Gestión de Módulos</h4>
              <p className="text-xs text-emerald-700">Acceso total a todos los módulos disponibles</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3 hover:bg-emerald-100 transition-all">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-emerald-900 mb-1">Notificaciones & Pagos</h4>
              <p className="text-xs text-emerald-700">Seguimiento de pagos y comunicaciones</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const ActivityTabContent = () => (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
          <Clock className="w-5 h-5" />
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {[
            { title: 'Inicio de sesión exitoso', desc: 'Acceso al sistema desde Chrome', time: 'Hace 2 min', icon: ShieldCheck },
            { title: 'Reserva de salón social', desc: 'Confirmada para mañana 18:00', time: 'Hace 15 min', icon: Calendar },
            { title: 'Pago de administración procesado', desc: '$450,000 - Marzo 2024', time: 'Hace 1 hora', icon: CreditCard },
            { title: 'Nueva comunicación recibida', desc: 'Junta de copropiedad', time: 'Ayer', icon: BellRing }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all border">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <activity.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate">{activity.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{activity.desc}</p>
                <p className="text-xs font-medium text-gray-600 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
          <DollarSign className="w-5 h-5" />
          Estado de Pagos
        </h3>
        <div className="space-y-3">
          {[
            { month: 'Marzo 2024', amount: 450000, status: 'paid' as const },
            { month: 'Febrero 2024', amount: 450000, status: 'paid' as const },
            { month: 'Enero 2024', amount: 450000, status: 'pending' as const }
          ].map((payment, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <span className="text-sm font-semibold text-gray-900">{payment.month}</span>
              <div className="text-right">
                <div className="text-lg font-bold text-green-900">${payment.amount.toLocaleString()}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  payment.status === 'paid' 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {payment.status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  return (
    <FloatingModalUnified
      isOpen={isOpen}
      onClose={onClose}
      title={`Perfil de ${user.name || 'Usuario'}`}
      icon={<User className="w-6 h-6" />}
size="md"
      footer={
        <div className="flex gap-3 p-1">
          <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl shadow-md hover:shadow-lg">
            Cerrar
          </Button>
          <Button onClick={handleLogout} className="flex-1 h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl text-white font-semibold">
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      }
    >
      <Tabs value={activeTab} onValueChange={(value: 'profile' | 'activity') => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl shadow-inner mb-6 overflow-hidden">
          <TabsTrigger value="profile" className="h-full rounded-l-2xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <User className="w-4 h-4 mr-2 inline" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="activity" className="h-full rounded-r-2xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-emerald-500">
            <Clock className="w-4 h-4 mr-2 inline" />
            Actividad
          </TabsTrigger>
        </TabsList>
        <div className="space-y-1">
          <TabsContent value="profile" className="mt-0">
            <ProfileTabContent />
          </TabsContent>
          <TabsContent value="activity" className="mt-0">
            <ActivityTabContent />
          </TabsContent>
        </div>
      </Tabs>
    </FloatingModalUnified>
  );
};

export default UserProfileModal;

