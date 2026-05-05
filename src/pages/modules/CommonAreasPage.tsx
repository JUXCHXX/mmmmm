import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommonAreasStore } from '@/store/useCommonAreasStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CommonArea, AREA_STATUS_MAP } from '@/types/commonAreas';
import {
  Plus, Search, Filter, LayoutGrid, MapPin,
  Users, FileText, Clock, Wrench, Edit2, Trash2, Eye, CheckCircle, X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FloatingModalUnified } from '@/components/FloatingModalUnified';

const CommonAreasPage = () => {
  const { commonAreas } = useCommonAreasStore();
  const user = useAuthStore((s) => s.user);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'maintenance'>('all');
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);
  const [showForm, setShowForm] = useState(false);

  const isAdmin = user?.roleId && ['admin', 'super_admin', 'consejo'].includes(user.roleId);

  // Filter logic
  const filtered = commonAreas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(search.toLowerCase()) ||
                         area.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || area.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: commonAreas.length,
    active: commonAreas.filter(a => a.status === 'active').length,
    maintenance: commonAreas.filter(a => a.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            Censo de Zonas Comunes
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Gestiona los espacios comunes, reservas y normativa del conjunto
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Zona</span>
          </Button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: 'Total de Zonas', value: stats.total, icon: LayoutGrid, color: 'primary' },
          { label: 'Activas', value: stats.active, icon: CheckCircle, color: 'success' },
          { label: 'Mantenimiento', value: stats.maintenance, icon: Wrench, color: 'warning' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-4 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md p-4 rounded-lg space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar zona común..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'maintenance'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {status === 'all' ? 'Todas' : status === 'active' ? 'Activas' : 'Mantenimiento'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Grid de Zonas Comunes */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((area, i) => (
            <motion.div
              key={area.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => setSelectedArea(area)}
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                {area.image && (
                  <img
                    src={area.image}
                    alt={area.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={AREA_STATUS_MAP[area.status].class}>
                    {AREA_STATUS_MAP[area.status].label}
                  </Badge>
                </div>

                {/* Overlay de acciones */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    className="p-2 bg-primary rounded-lg hover:bg-primary/80 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArea(area);
                    }}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {isAdmin && (
                    <>
                      <button className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 text-white">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-destructive rounded-lg hover:bg-destructive/80 text-white">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {area.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {area.description}
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Capacidad: <strong>{area.capacity}</strong> personas</span>
                  </div>
                  {area.bookingEnabled && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span>Reservas disponibles</span>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                {area.amenities && area.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {area.amenities.slice(0, 2).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {area.amenities.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{area.amenities.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Botón View */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedArea(area)}
                >
                  Detalles
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No hay zonas comunes que coincidan con tu búsqueda</p>
        </motion.div>
      )}

      {/* Modal Detalle */}
      {selectedArea && (
        <CommonAreaModal
          area={selectedArea}
          onClose={() => setSelectedArea(null)}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

// Modal Component - Usando FloatingModalUnified
const CommonAreaModal = ({ area, onClose, isAdmin }: {
  area: CommonArea;
  onClose: () => void;
  isAdmin: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <FloatingModalUnified
      isOpen={true}
      onClose={onClose}
      title={area.name}
      icon={<MapPin className="w-5 h-5" />}
      size="lg"
      footer={
        <div className="flex gap-3">
          {isAdmin && (
            <>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsEditing(true)}
                className="flex-1 px-5 py-2.5 rounded-xl font-semibold
                  bg-[#0D4A3E]/10 hover:bg-[#0D4A3E]/20 text-[#0D4A3E]
                  transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-white
                  bg-red-500/90 hover:bg-red-600
                  transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </motion.button>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="flex-1 px-5 py-2.5 rounded-xl font-semibold
              bg-gray-100 hover:bg-gray-200 text-gray-700
              transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Cerrar
          </motion.button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Descripción */}
        {area.description && (
          <div>
            <p className="text-[#0D4A3E]/80 leading-relaxed">{area.description}</p>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#0D4A3E]">Estado:</span>
          <Badge className={`${AREA_STATUS_MAP[area.status].class}`}>
            {AREA_STATUS_MAP[area.status].label}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-[#0D4A3E]/5 to-[#0D4A3E]/10 rounded-lg p-4 border border-[#0D4A3E]/20">
            <p className="text-xs font-semibold text-[#0D4A3E] mb-2">Capacidad</p>
            <p className="text-2xl font-bold text-[#0D4A3E]">{area.capacity}</p>
            <p className="text-xs text-[#0D4A3E]/60">personas</p>
          </div>
          <div className="bg-gradient-to-br from-[#0F7A5C]/5 to-[#0F7A5C]/10 rounded-lg p-4 border border-[#0F7A5C]/20">
            <p className="text-xs font-semibold text-[#0F7A5C] mb-2">Reservas</p>
            <p className="text-2xl font-bold text-[#0F7A5C]">{area.bookingEnabled ? 'Sí' : 'No'}</p>
          </div>
          <div className="bg-gradient-to-br from-[#219EBC]/5 to-[#219EBC]/10 rounded-lg p-4 border border-[#219EBC]/20">
            <p className="text-xs font-semibold text-[#219EBC] mb-2">Historial</p>
            <p className="text-2xl font-bold text-[#219EBC]">{area.history?.length || 0}</p>
          </div>
        </div>

        {/* Amenities */}
        {area.amenities && area.amenities.length > 0 && (
          <div>
            <h3 className="font-semibold text-[#0D4A3E] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Amenidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {area.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="bg-[#0D4A3E]/10 text-[#0D4A3E] border-[#0D4A3E]/20">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Rules */}
        <div>
          <h3 className="font-semibold text-[#0D4A3E] mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reglamentación
          </h3>
          <ul className="space-y-2">
            {area.rules.map((rule, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#0D4A3E]/70">
                <span className="text-[#0F7A5C] font-bold min-w-6">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FloatingModalUnified>
  );
};

export default CommonAreasPage;
