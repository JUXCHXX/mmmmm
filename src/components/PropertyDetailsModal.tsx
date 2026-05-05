import { motion } from 'framer-motion';
import { Property } from '@/store/useAppStore';
import { Building2, MapPin, Layers, Ruler, Home, DollarSign, User, Users, CheckCircle, Tag, Grid, Type, CreditCard } from 'lucide-react';
import { FloatingModalUnified } from './FloatingModalUnified';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  occupied: { label: 'Ocupada', color: 'from-emerald-500 to-emerald-400' },
  vacant: { label: 'Desocupada', color: 'from-amber-500 to-amber-400' },
  for_sale: { label: 'En Venta', color: 'from-blue-500 to-blue-400' },
  for_rent: { label: 'En Arriendo', color: 'from-violet-500 to-violet-400' },
};

const TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartamento',
  house: 'Casa',
  commercial: 'Local Comercial',
  parking: 'Parqueadero',
};

const USE_LABELS: Record<string, string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
  parking: 'Parqueadero',
  storage: 'Depósito',
};

export const PropertyDetailsModal = ({ property, isOpen, onClose }: PropertyDetailsModalProps) => {
  if (!property) return null;

  const status = STATUS_LABELS[property.status];

  return (
    <FloatingModalUnified
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle de Unidad: ${property.unit}`}
      icon={<Building2 className="w-5 h-5" />}
      size="lg"
      footer={
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-[#0D4A3E] text-[#0D4A3E] hover:bg-[#0D4A3E]/5 transition-colors text-sm font-semibold"
          >
            Cerrar
          </button>
          <button className="flex-1 bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] hover:shadow-lg text-white h-10 rounded-xl text-sm font-semibold transition-all">
            Ver Operaciones
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Section con imagen */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Imagen de la propiedad */}
          {property.image && (
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={property.image}
                alt={property.unit}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=600&h=400&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/20" />

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-2 rounded-full text-white text-sm font-bold bg-gradient-to-r ${status.color} shadow-lg`}
                >
                  {status.label}
                </span>
              </div>
            </div>
          )}

          {/* Información Principal */}
          <div className="bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] rounded-xl p-6 text-white">
            <h3 className="text-3xl font-bold mb-2">Apto {property.unit}</h3>
            <div className="flex flex-wrap gap-3 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <Layers className="w-4 h-4" />
                <span>{property.tower}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Piso {property.floor}</span>
              </div>
              <span>•</span>
              <span>{property.block ? `Bloque ${property.block}` : 'Sin bloque'}</span>
            </div>
          </div>
        </motion.div>

        {/* Sección Inmueble */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <h4 className="text-lg font-bold text-[#0D4A3E] flex items-center gap-2">
            <Home className="w-5 h-5 text-[#0F7A5C]" />
            Información del Inmueble
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: Ruler, label: 'Área', value: `${property.area} m²` },
              { icon: Type, label: 'Tipo', value: TYPE_LABELS[property.type] },
              { icon: Tag, label: 'Uso', value: USE_LABELS[property.use] },
              { icon: Percent, label: 'Coeficiente', value: `${property.coefficient}%` },
              { icon: Grid, label: 'Bloque', value: property.block || 'N/A' },
              { icon: CheckCircle, label: 'Piso', value: `${property.floor}` },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="p-3 rounded-lg bg-gradient-to-br from-[#0F7A5C]/10 to-[#0D4A3E]/10 border border-[#0F7A5C]/20 hover:border-[#0F7A5C]/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-[#0F7A5C]" />
                  <p className="text-xs font-bold text-[#0F7A5C] uppercase">{label}</p>
                </div>
                <p className="text-sm font-bold text-[#0D4A3E]">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sección Financiera */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#2563EB]/10 to-[#0F7A5C]/10 rounded-xl p-5 border border-[#2563EB]/30 space-y-3"
        >
          <h4 className="text-lg font-bold text-[#0D4A3E] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#2563EB]" />
            Información Financiera
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between items-center pb-3 border-b border-[#0F7A5C]/20">
              <span className="text-sm font-semibold text-[#0D4A3E]">Cuota Mensual:</span>
              <span className="text-lg font-bold text-[#2563EB]">${property.monthlyFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#0F7A5C]/20">
              <span className="text-sm font-semibold text-[#0D4A3E]">Tipo de Pago:</span>
              <span className="text-sm font-bold text-[#0D4A3E]">Mensual</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#0D4A3E]">Estado Pagos:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700">Al día</span>
            </div>
          </div>
        </motion.div>

        {/* Sección de Residentes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h4 className="text-lg font-bold text-[#0D4A3E] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0F7A5C]" />
            Residentes
          </h4>

          <div className="space-y-3">
            {/* Propietario */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-[#0D4A3E]/5 to-[#0F7A5C]/5 border border-[#0D4A3E]/20">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#0D4A3E]" />
                <p className="text-xs font-bold text-[#0D4A3E] uppercase">Propietario</p>
              </div>
              <p className="text-base font-bold text-[#0D4A3E]">{property.owner}</p>
            </div>

            {/* Arrendatario */}
            {property.tenant ? (
              <div className="p-4 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-violet-600" />
                  <p className="text-xs font-bold text-violet-600 uppercase">Arrendatario</p>
                </div>
                <p className="text-base font-bold text-violet-900">{property.tenant}</p>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-bold text-amber-600 uppercase">Arrendatario</p>
                </div>
                <p className="text-sm text-amber-700">Sin arrendatario asignado</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Información Adicional */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-xs text-blue-800 leading-relaxed">
            <span className="font-bold">ℹ️ Nota:</span> Esta propiedad es parte del conjunto y cumple con todos los
            reglamentos internos. Para más información sobre operaciones, contacte a la administración.
          </p>
        </motion.div>
      </div>
    </FloatingModalUnified>
  );
};

export default PropertyDetailsModal;
