import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type Resident } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getAccessLevel, canCreate, canDelete, canEdit } from '@/types/modules';
import { Users, Search, PawPrint, Car, History, Phone, Mail, ShieldCheck, X, Plus, Edit2, Trash2, Building2, User, IdCard, Home, Shield, AlertCircle, CheckCircle2, MapPin, Bike } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FloatingModalUnified } from '@/components/FloatingModalUnified';

const TYPE_LABELS: Record<string, { label: string; class: string }> = {
  owner: { label: 'Propietario', class: 'bg-amber-500/20 text-amber-400' },
  tenant: { label: 'Arrendatario', class: 'bg-rose-500/20 text-rose-400' },
  family: { label: 'Familiar', class: 'bg-blue-500/20 text-blue-400' },
  admin: { label: 'Administrador', class: 'bg-violet-500/20 text-violet-400' },
};

const ResidentsPage = () => {
  const { residents, occupancyHistory, addResident, updateResident, deleteResident, addOccupancyRecord, condos, properties } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResident, setSelectedResident] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'census' | 'history'>('directory');
  const [showModal, setShowModal] = useState(false);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [selectedCondoId, setSelectedCondoId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDocument, setFormDocument] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formType, setFormType] = useState<Resident['type']>('owner');
  const [formEmergencyContact, setFormEmergencyContact] = useState('');
  const [formEmergencyPhone, setFormEmergencyPhone] = useState('');
  const [showAllCondos, setShowAllCondos] = useState(false);

  const roleId = user?.roleId ?? 'propietario';
  const accessLevel = getAccessLevel('residents', roleId);
  const canAdd = canCreate('residents', roleId);
  const canRemove = canDelete('residents', roleId);
  const canModify = canEdit('residents', roleId);

  // For super admin, default to first condo if not selected
  const isSuperAdmin = roleId === 'super_admin';
  const isAdmin = roleId === 'admin';
  const isPropietario = roleId === 'propietario';
  const adminCondoId = isAdmin ? user?.condoId : null;
  const currentCondoId = isSuperAdmin && !showAllCondos ? (selectedCondoId || condos[0]?.id || null) : adminCondoId;
  const currentCondo = currentCondoId ? condos.find(c => c.id === currentCondoId) : null;

  const filtered = residents.filter(r => {
    // Filter by condo if super admin is not viewing all condos OR if it's an admin user
    if ((isSuperAdmin && !showAllCondos && currentCondoId && r.condoId !== currentCondoId) || (isAdmin && adminCondoId && r.condoId !== adminCondoId)) return false;

    // Propietario solo ve sus arrendatarios (tenants que viven en sus propiedades)
    if (isPropietario && user?.unitIds) {
      const ownerProperties = user.unitIds;
      const propertyUnits = properties
        .filter(p => ownerProperties.includes(p.id))
        .map(p => p.unit);

      const isResidentInMyProperty = propertyUnits.includes(r.unit);
      if (!isResidentInMyProperty) return false;
    }

    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.unit.toLowerCase().includes(search.toLowerCase()) || r.document.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const selected = selectedResident ? residents.find(r => r.id === selectedResident) : null;
  const totalPets = filtered.reduce((a, r) => a + r.pets.length, 0);
  const totalVehicles = filtered.reduce((a, r) => a + r.vehicles.length, 0);

  const openCreateModal = () => {
    setEditingResident(null);
    setFormName(''); setFormDocument(''); setFormPhone(''); setFormEmail('');
    setFormUnit(''); setFormType('owner'); setFormEmergencyContact(''); setFormEmergencyPhone('');
    setShowModal(true);
  };

  const openEditModal = (r: Resident) => {
    setEditingResident(r);
    setFormName(r.name); setFormDocument(r.document); setFormPhone(r.phone); setFormEmail(r.email);
    setFormUnit(r.unit); setFormType(r.type); setFormEmergencyContact(r.emergencyContact || ''); setFormEmergencyPhone(r.emergencyPhone || '');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formDocument.trim() || !formUnit.trim()) {
      toast({ title: 'Error', description: 'Nombre, documento y unidad son obligatorios', variant: 'destructive' });
      return;
    }
    if (editingResident) {
      updateResident(editingResident.id, { name: formName, document: formDocument, phone: formPhone, email: formEmail, unit: formUnit, type: formType, emergencyContact: formEmergencyContact || undefined, emergencyPhone: formEmergencyPhone || undefined });
      toast({ title: 'Actualizado', description: `Residente ${formName} actualizado` });
    } else {
      addResident({
        id: `R${Date.now()}`, name: formName, document: formDocument, phone: formPhone, email: formEmail,
        unit: formUnit, type: formType, pets: [], vehicles: [], since: new Date().toISOString().split('T')[0],
        status: 'active', emergencyContact: formEmergencyContact || undefined, emergencyPhone: formEmergencyPhone || undefined,
      });
      addOccupancyRecord({
        id: `OH${Date.now()}`, unit: formUnit, residentName: formName, type: formType === 'owner' || formType === 'admin' ? 'owner' : 'tenant',
        startDate: new Date().toISOString().split('T')[0], active: true,
      });
      toast({ title: 'Registrado', description: `Residente ${formName} registrado exitosamente` });
    }
    setShowModal(false);
  };

  const handleDelete = (r: Resident) => {
    deleteResident(r.id);
    if (selectedResident === r.id) setSelectedResident(null);
    toast({ title: 'Eliminado', description: `${r.name} eliminado del sistema` });
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="icon-responsive-lg text-primary" /> Gestión de Residentes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSuperAdmin && !showAllCondos && currentCondo ? `${currentCondo.name} • ` : ''}
            {isSuperAdmin && showAllCondos ? `Todos los conjuntos • ` : ''}
            {filtered.length} residentes • {totalPets} mascotas • {totalVehicles} vehículos
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          {isSuperAdmin && (
            <div className="flex gap-2">
              <label className="text-xs text-muted-foreground flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showAllCondos}
                  onChange={(e) => setShowAllCondos(e.target.checked)}
                  className="w-4 h-4"
                />
                Ver todos los conjuntos
              </label>
            </div>
          )}
          <div className="flex gap-2 items-end">
            {isSuperAdmin && !showAllCondos && (
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Conjunto</label>
                <select value={currentCondoId || ''} onChange={(e) => setSelectedCondoId(e.target.value)} className="h-10 px-4 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground focus:outline-none focus:border-primary">
                  {condos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
            {canAdd && (
              <button className="btn-premium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2" onClick={openCreateModal}>
                <Plus className="w-4 h-4" /> Nuevo Residente
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-4">
        {['directory', 'census', 'history'].map(tab => {
          // Control acceso al Censo según roles
          if (tab === 'census' && !['super_admin', 'admin', 'porteria', 'propietario', 'consejo'].includes(roleId)) {
            return null; // No mostrar censo para otros roles
          }
          return (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {tab === 'directory' ? 'Directorio' : tab === 'census' ? 'Censo Digital' : 'Historial'}
            </button>
          );
        })}
      </div>

      {activeTab === 'census' ? (
        <div className="space-y-6">
          {/* Resumen Ejecutivo */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Residentes', value: filtered.length, color: 'from-blue-500 to-blue-600', icon: Users },
              { label: 'Propietarios', value: filtered.filter(r => r.type === 'owner').length, color: 'from-amber-500 to-orange-500', icon: Building2 },
              { label: 'Arrendatarios', value: filtered.filter(r => r.type === 'tenant').length, color: 'from-rose-500 to-pink-500', icon: Home },
              { label: 'Activos', value: filtered.filter(r => r.status === 'active').length, color: 'from-emerald-500 to-green-600', icon: CheckCircle2 },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={`bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-sm rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 border border-[rgba(255,255,255,0.1)]`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-black font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                      <p className="text-3xl font-black text-black">{stat.value}</p>
                    </div>
                    <Icon className="w-10 h-10 opacity-40" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Grid de Secciones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PERSONAS - Estadísticas Detalladas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                Clasificación de Residentes
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Propietarios', value: filtered.filter(r => r.type === 'owner').length, color: 'amber', icon: User },
                  { label: 'Arrendatarios', value: filtered.filter(r => r.type === 'tenant').length, color: 'rose', icon: Home },
                  { label: 'Familiares', value: filtered.filter(r => r.type === 'family').length, color: 'blue', icon: Users },
                  { label: 'Administradores', value: filtered.filter(r => r.type === 'admin').length, color: 'violet', icon: Shield },
                  { label: 'Activos', value: filtered.filter(r => r.status === 'active').length, color: 'emerald', icon: CheckCircle2 },
                  { label: 'Inactivos', value: filtered.filter(r => r.status === 'inactive').length, color: 'red', icon: X },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const colorMap: Record<string, string> = {
                    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
                    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
                    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
                    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
                    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
                    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
                  };
                  return (
                    <div key={i} className={`p-3 rounded-lg bg-gradient-to-r ${colorMap[item.color]} border flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-bold text-black">{item.label}</span>
                      </div>
                      <span className="text-2xl font-black text-black">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* MASCOTAS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-purple-400" />
                </div>
                <span>Mascotas</span>
                <span className="ml-auto text-2xl font-black text-purple-400">{totalPets}</span>
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {filtered.flatMap(r => r.pets.map(p => ({ ...p, ownerName: r.name, unit: r.unit }))).map(pet => (
                  <motion.div key={pet.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="inline-flex items-center gap-2 font-semibold text-foreground text-sm">
                          <PawPrint className="h-4 w-4 text-purple-400" />
                          {pet.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{pet.breed}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{pet.ownerName} • Apto {pet.unit}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap ${pet.vaccinated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {pet.vaccinated ? <CheckCircle2 className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        {pet.vaccinated ? 'Vacunada' : 'Sin vacunas'}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {totalPets === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <PawPrint className="w-8 h-8 opacity-40 mb-2" />
                    <p className="text-xs">No hay mascotas registradas</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* VEHÍCULOS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Car className="w-5 h-5 text-cyan-400" />
                </div>
                <span>Vehículos</span>
                <span className="ml-auto text-2xl font-black text-cyan-400">{totalVehicles}</span>
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {filtered.flatMap(r => r.vehicles.map(v => ({ ...v, ownerName: r.name, unit: r.unit }))).map(v => (
                  <motion.div key={v.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="inline-flex items-center gap-2 font-semibold text-foreground text-sm">
                          <Car className="h-4 w-4 text-cyan-400" />
                          {v.plate}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{v.brand} {v.model}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{v.ownerName} • Apto {v.unit}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-500/20 text-gray-400">{v.color}</span>
                      {v.parkingSpot && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-400">
                          <MapPin className="h-3.5 w-3.5" />
                          {v.parkingSpot}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-violet-500/20 text-violet-400">
                        {(v.type === 'car' ? <Car className="h-3.5 w-3.5" /> : <Bike className="h-3.5 w-3.5" />)}
                        {v.type === 'car' ? 'Auto' : v.type === 'motorcycle' ? 'Moto' : 'Bici'}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {totalVehicles === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Car className="w-8 h-8 opacity-40 mb-2" />
                    <p className="text-xs">No hay vehículos registrados</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Estadísticas por Tipo de Vehículo */}
          {totalVehicles > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                <Car className="w-5 h-5 text-cyan-400" />
                Distribución de Vehículos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(() => {
                  const vehicles = filtered.flatMap(r => r.vehicles);
                  const cars = vehicles.filter(v => v.type === 'car').length;
                  const motorcycles = vehicles.filter(v => v.type === 'motorcycle').length;
                  const bicycles = vehicles.filter(v => v.type === 'bicycle').length;
                  return [
                    { label: 'Autos', count: cars, icon: Car, color: 'blue' },
                    { label: 'Motocicletas', count: motorcycles, icon: Bike, color: 'orange' },
                    { label: 'Bicicletas', count: bicycles, icon: Bike, color: 'green' },
                  ].map((type, i) => {
                    const Icon = type.icon;
                    const percentage = totalVehicles > 0 ? ((type.count / totalVehicles) * 100).toFixed(0) : 0;
                    const colorMap: Record<string, string> = {
                      blue: 'from-blue-500 to-blue-600',
                      orange: 'from-orange-500 to-orange-600',
                      green: 'from-green-500 to-green-600',
                    };
                    return (
                      <div key={i} className={`p-4 rounded-lg bg-gradient-to-r ${colorMap[type.color]} bg-opacity-10 border border-[rgba(255,255,255,0.1)]`}>
                        <Icon className="mb-2 h-8 w-8 text-black/70" />
                        <p className="text-sm font-bold text-black mb-1">{type.label}</p>
                        <p className="text-3xl font-black text-black">{type.count}</p>
                        <p className="text-xs text-black mt-2 font-semibold">{percentage}% del total</p>
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}
        </div>
      ) : activeTab === 'history' ? (
        <div className="space-y-6">
          {occupancyHistory.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-16 rounded-xl text-center">
              <History className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Sin historial de ocupantes</p>
              <p className="text-sm text-muted-foreground">No hay cambios registrados aún</p>
            </motion.div>
          ) : (
            <>
              {/* Resumen de Estadísticas */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: 'Total Registros',
                    value: occupancyHistory.length,
                    color: 'from-blue-500 to-blue-600',
                    icon: History,
                  },
                  {
                    label: 'Ocupaciones Activas',
                    value: occupancyHistory.filter(h => h.active).length,
                    color: 'from-emerald-500 to-green-600',
                    icon: CheckCircle2,
                  },
                  {
                    label: 'Ocupaciones Finalizadas',
                    value: occupancyHistory.filter(h => !h.active).length,
                    color: 'from-gray-500 to-gray-600',
                    icon: User,
                  },
                  {
                    label: 'Cambios Registrados',
                    value: occupancyHistory.length,
                    color: 'from-violet-500 to-purple-600',
                    icon: Building2,
                  },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-white rounded-xl border border-black/8 shadow-sm-static p-4 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 border border-[rgba(255,255,255,0.1)]`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-black font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                          <p className="text-2xl font-black text-black">{stat.value}</p>
                        </div>
                        <Icon className="w-8 h-8 opacity-40" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Timeline de Historial */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-8 rounded-xl">
                <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <History className="w-5 h-5 text-blue-400" />
                  </div>
                  Línea de Tiempo de Ocupantes
                </h3>

                <div className="relative space-y-6">
                  {/* Línea vertical */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-transparent" />

                  {occupancyHistory.map((h, index) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="relative pl-20"
                    >
                      {/* Punto en la línea */}
                      <div
                        className={`absolute left-0 top-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl border-4 border-background shadow-lg ${
                          h.active
                            ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                            : 'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}
                      >
                        {h.type === 'owner' ? <User className="h-6 w-6 text-white" /> : <Home className="h-6 w-6 text-white" />}
                      </div>

                      {/* Card de información */}
                      <div
                        className={`p-6 rounded-xl border-l-4 ${
                          h.active
                            ? 'bg-emerald-500/10 border-emerald-500/50'
                            : 'bg-gray-500/10 border-gray-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-foreground mb-2">{h.residentName}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Tipo</p>
                                <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                                  {h.type === 'owner' ? <User className="h-4 w-4" /> : <Home className="h-4 w-4" />}
                                  {h.type === 'owner' ? 'Propietario' : 'Arrendatario'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Unidad</p>
                                <p className="text-sm font-bold text-foreground">Apto {h.unit}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Período</p>
                                <p className="text-sm font-bold text-foreground">{h.startDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t border-[rgba(255,255,255,0.1)]">
                              <span className="text-xs text-muted-foreground">Desde:</span>
                              <span className="text-sm font-semibold text-foreground">{h.startDate}</span>
                              <span className="text-xs text-muted-foreground">→</span>
                              <span className="text-sm font-semibold text-foreground">{h.endDate ?? 'Actual'}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span
                              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${
                                h.active
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}
                            >
                              <span className="inline-flex items-center gap-1.5">
                                {h.active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                {h.active ? 'Activo' : 'Finalizado'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tabla resumen adicional */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-6 rounded-xl overflow-x-auto">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  Vista de Tabla
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.1)]">
                      <th className="text-left py-3 px-4 font-bold text-foreground">Residente</th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">Tipo</th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">Unidad</th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">Período</th>
                      <th className="text-center py-3 px-4 font-bold text-foreground">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {occupancyHistory.map(h => (
                      <tr key={h.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">{h.residentName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-400">
                            {h.type === 'owner' ? 'Propietario' : 'Arrendatario'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground">Apto {h.unit}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {h.startDate} → {h.endDate ?? 'Actual'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              h.active
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              {h.active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                              {h.active ? 'Activo' : 'Finalizado'}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </>
          )}
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-black/8 shadow-sm-static p-4 mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar residente, unidad o documento..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 px-4 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground focus:outline-none focus:border-primary">
              <option value="all">Todos los roles</option>
              <option value="owner">Propietarios</option>
              <option value="tenant">Arrendatarios</option>
              <option value="family">Familiares</option>
              <option value="admin">Administradores</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-4 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-sm text-foreground focus:outline-none focus:border-primary">
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((r, i) => {
                const tl = TYPE_LABELS[r.type] || TYPE_LABELS.owner;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.03 }}
                    className={`bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-5 cursor-pointer transition-all hover:shadow-lg`}
                    onClick={() => { setSelectedResident(r.id); setShowResidentModal(true); }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.type === 'owner' ? 'from-amber-500 to-orange-500' : r.type === 'tenant' ? 'from-rose-500 to-pink-500' : r.type === 'family' ? 'from-blue-500 to-cyan-500' : 'from-violet-500 to-purple-500'} flex items-center justify-center text-white font-bold text-sm`}>
                        {r.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{r.name}</h3>
                        <p className="text-xs text-muted-foreground">{r.document}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${tl.class}`}>{tl.label}</span>
                          <span className="text-xs text-muted-foreground">Unidad {r.unit}</span>
                        </div>
                      </div>
                      {canModify && (
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(r); }} className="p-1 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                          {canRemove && <button onClick={(e) => { e.stopPropagation(); handleDelete(r); }} className="p-1 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><PawPrint className="w-3.5 h-3.5" /> {r.pets.length}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Car className="w-3.5 h-3.5" /> {r.vehicles.length}</div>
                      <span className={`ml-auto px-2 py-0.5 rounded-md text-xs font-medium ${r.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{r.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div className="md:col-span-2 text-center py-16">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-muted-foreground">No se encontraron residentes</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Resident Detail Modal */}
      <FloatingModalUnified
        isOpen={showResidentModal}
        onClose={() => { setShowResidentModal(false); setSelectedResident(null); }}
        title={selected?.name || 'Residente'}
        icon={<Users className="w-5 h-5" />}
        size="md"
      >
        {selected && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selected.type === 'owner' ? 'from-amber-500 to-orange-500' : selected.type === 'tenant' ? 'from-rose-500 to-pink-500' : selected.type === 'family' ? 'from-blue-500 to-cyan-500' : 'from-violet-500 to-purple-500'} flex items-center justify-center text-white font-bold text-lg`}>
                {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0D4A3E]">{selected.name}</h2>
                <p className="text-sm text-[#0D4A3E]/60">{selected.document}</p>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0F7A5C]/10 to-transparent border border-[#0F7A5C]/20">
                <p className="text-xs font-bold text-[#0D4A3E] uppercase tracking-wider mb-2">Tipo</p>
                <p className="text-lg font-bold text-[#0F7A5C]">{(TYPE_LABELS[selected.type] || TYPE_LABELS.owner).label}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-transparent border border-[#2563EB]/20">
                <p className="text-xs font-bold text-[#0D4A3E] uppercase tracking-wider mb-2">Unidad</p>
                <p className="text-lg font-bold text-[#2563EB]">Apto {selected.unit}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/20">
                <p className="text-xs font-bold text-[#0D4A3E] uppercase tracking-wider mb-2">Desde</p>
                <p className="text-lg font-bold text-[#10B981]">{selected.since}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/20">
                <p className="text-xs font-bold text-[#0D4A3E] uppercase tracking-wider mb-2">Estado</p>
                <span className={`text-lg font-bold ${selected.status === 'active' ? 'text-emerald-500' : 'text-red-500'}`}>{selected.status === 'active' ? 'Activo' : 'Inactivo'}</span>
              </div>
              {selected.condoId && (
                <div className="col-span-2 p-4 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-transparent border border-[#7C3AED]/20">
                  <p className="text-xs font-bold text-[#0D4A3E] uppercase tracking-wider mb-2 flex items-center gap-2"><Building2 className="w-4 h-4" /> Conjunto</p>
                  <p className="text-lg font-bold text-[#7C3AED]">{condos.find(c => c.id === selected.condoId)?.name || 'No especificado'}</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            {accessLevel !== 'OWN_DATA_ONLY' && (
              <div className="border-t border-[rgba(0,0,0,0.08)] pt-6">
                <h3 className="text-sm font-bold text-[#0D4A3E] mb-4 uppercase tracking-wider">Información de Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.02)]">
                    <Mail className="w-4 h-4 text-[#2563EB]" />
                    <div>
                      <p className="text-xs text-[#0D4A3E]/60">Correo</p>
                      <p className="text-sm font-medium text-[#0D4A3E]">{selected.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.02)]">
                    <Phone className="w-4 h-4 text-[#10B981]" />
                    <div>
                      <p className="text-xs text-[#0D4A3E]/60">Teléfono</p>
                      <p className="text-sm font-medium text-[#0D4A3E]">{selected.phone}</p>
                    </div>
                  </div>
                  {selected.emergencyContact && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,0,0,0.02)] border border-orange-200">
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-[#0D4A3E]/60">Contacto de Emergencia</p>
                        <p className="text-sm font-medium text-[#0D4A3E]">{selected.emergencyContact} ({selected.emergencyPhone})</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pets */}
            {selected.pets.length > 0 && (
              <div className="border-t border-[rgba(0,0,0,0.08)] pt-6">
                <h3 className="text-sm font-bold text-[#0D4A3E] mb-4 uppercase tracking-wider flex items-center gap-2"><PawPrint className="w-4 h-4" /> Mascotas ({selected.pets.length})</h3>
                <div className="space-y-2">
                  {selected.pets.map(p => (
                    <div key={p.id} className="p-3 rounded-lg bg-[rgba(0,0,0,0.02)] flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#0D4A3E]">{p.name}</p>
                        <p className="text-xs text-[#0D4A3E]/60">{p.breed}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${p.vaccinated ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'}`}>{p.vaccinated ? 'Vacunada' : 'Sin vacunas'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicles */}
            {selected.vehicles.length > 0 && (
              <div className="border-t border-[rgba(0,0,0,0.08)] pt-6">
                <h3 className="text-sm font-bold text-[#0D4A3E] mb-4 uppercase tracking-wider flex items-center gap-2"><Car className="w-4 h-4" /> Vehículos ({selected.vehicles.length})</h3>
                <div className="space-y-2">
                  {selected.vehicles.map(v => (
                    <div key={v.id} className="p-3 rounded-lg bg-[rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-[#0D4A3E]">{v.plate}</p>
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-[#0D4A3E]/20 text-[#0D4A3E]">{v.color}</span>
                      </div>
                      <p className="text-xs text-[#0D4A3E]/60">{v.brand} {v.model}{v.parkingSpot ? ` • ${v.parkingSpot}` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </FloatingModalUnified>

      {/* Create/Edit Modal */}
      <FloatingModalUnified
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingResident ? 'Editar Residente' : 'Nuevo Residente'}
        icon={<Users className="w-5 h-5" />}
        size="md"
        footer={
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] hover:from-[#01242f] hover:to-[#0d6a52] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {editingResident ? 'Guardar Cambios' : 'Registrar'}
            </motion.button>
          </div>
        }
      >
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-[#0F7A5C]" />
              <label className="block text-sm font-bold text-gray-800">Nombre Completo *</label>
            </div>
            <input
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0F7A5C] focus:border-[#0F7A5C] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IdCard className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Documento *</label>
              </div>
              <input
                value={formDocument}
                onChange={e => setFormDocument(e.target.value)}
                placeholder="CC 12.345.678"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0F7A5C] focus:border-[#0F7A5C] transition-all"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Unidad *</label>
              </div>
              <input
                value={formUnit}
                onChange={e => setFormUnit(e.target.value)}
                placeholder="101"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0F7A5C] focus:border-[#0F7A5C] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Teléfono</label>
              </div>
              <input
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                placeholder="+57 310 555 1234"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0F7A5C] focus:border-[#0F7A5C] transition-all"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Email</label>
              </div>
              <input
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0F7A5C] focus:border-[#0F7A5C] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#0F7A5C]" />
              <label className="block text-sm font-bold text-gray-800">Rol</label>
            </div>
            <select
              value={formType}
              onChange={e => setFormType(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0F7A5C] focus:border-[#0F7A5C] transition-all"
            >
              <option value="owner">Propietario</option>
              <option value="tenant">Arrendatario</option>
              <option value="family">Familiar</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Contacto Emergencia</label>
              </div>
              <input
                value={formEmergencyContact}
                onChange={e => setFormEmergencyContact(e.target.value)}
                placeholder="Nombre"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0F7A5C] focus:border-[#0F7A5C] transition-all"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-[#0F7A5C]" />
                <label className="block text-sm font-bold text-gray-800">Tel. Emergencia</label>
              </div>
              <input
                value={formEmergencyPhone}
                onChange={e => setFormEmergencyPhone(e.target.value)}
                placeholder="+57..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#0F7A5C] focus:border-[#0F7A5C] transition-all"
              />
            </div>
          </div>
        </div>
      </FloatingModalUnified>
    </div>
  );
};

export default ResidentsPage;
