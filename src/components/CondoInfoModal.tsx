import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Users, DollarSign, MapPin, AlertTriangle, Home, Zap } from 'lucide-react';
import type { CondominiumConfig } from '@/store/useAppStore';

/**
 * MODAL DE INFORMACIÓN DE CONDOMINIOS - DISEÑO ÚNICO
 * Paleta: Azul Oscuro (#023047) + Verde Esmeralda (#0F7A5C)
 * Aplicado con consistencia en toda la aplicación
 */

interface CondoInfoModalProps {
  condo: CondominiumConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const CondoInfoModal: React.FC<CondoInfoModalProps> = ({ condo, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal con paleta única */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto max-w-sm md:max-w-2xl w-full max-h-[88vh]">
              {/* Modal body - DISEÑO ÚNICO */}
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl h-full flex flex-col border border-[#0D4A3E]/15">

                {/* Barra superior - Gradiente oficial */}
                <div className="h-1.5 bg-gradient-to-r from-[#0D4A3E] via-[#0F7A5C] to-[#0D4A3E]" />

                {/* Header */}
                <div className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 px-4 md:px-8 py-5 md:py-6 border-b border-[#0D4A3E]/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#0D4A3E] truncate">
                          {condo.name}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#0D4A3E]/70 ml-13">
                        <MapPin className="w-4 h-4 text-[#0F7A5C] flex-shrink-0" />
                        <span className="truncate">{condo.address}</span>
                        <div className="flex gap-1.5 flex-shrink-0 ml-2">
                          <a
                            href={`https://www.google.com/maps/search/${encodeURIComponent(condo.address + ' ' + condo.city)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] hover:shadow-md transition-all hover:scale-110"
                            title="Abrir en Google Maps"
                          >
                            <img src="/google-maps-icon.png" alt="Google Maps" className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://waze.com/ul?q=${encodeURIComponent(condo.address + ' ' + condo.city)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] hover:shadow-md transition-all hover:scale-110"
                            title="Abrir en Waze"
                          >
                            <img src="/Waze-Logo.png" alt="Waze" className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 hover:bg-[#0D4A3E]/10 transition-colors rounded-lg flex-shrink-0"
                      aria-label="Cerrar"
                    >
                      <X className="w-5 h-5 text-[#0D4A3E]" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                {/* Contenido scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 md:p-8 space-y-6">

                    {/* Type and NIT Badges */}
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        condo.type === 'residential' ? 'bg-[#0D4A3E]/20 text-[#0F7A5C]' :
                        condo.type === 'commercial' ? 'bg-[#0D4A3E]/20 text-[#0D4A3E]' :
                        'bg-[#FFB703]/20 text-[#FFB703]'
                      }`}>
                        {condo.type === 'residential' ? 'Residencial' : condo.type === 'commercial' ? 'Comercial' : 'Mixto'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0D4A3E]/10 text-[#0D4A3E]">
                        NIT: {condo.nit}
                      </span>
                    </div>

                    {/* Stats Grid - Paleta unificada */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {/* Unidades */}
                      <div className="bg-gradient-to-br from-[#0D4A3E]/5 to-[#0D4A3E]/10 rounded-lg p-3 md:p-4 border border-[#0D4A3E]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Home className="w-4 h-4 text-[#0D4A3E]" />
                          <span className="text-xs font-semibold text-[#0D4A3E]">Unidades</span>
                        </div>
                        <p className="text-lg font-bold text-[#0D4A3E]">{condo.totalUnits}</p>
                      </div>

                      {/* Residentes */}
                      <div className="bg-gradient-to-br from-[#0F7A5C]/5 to-[#0F7A5C]/10 rounded-lg p-3 md:p-4 border border-[#0F7A5C]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-[#0F7A5C]" />
                          <span className="text-xs font-semibold text-[#0F7A5C]">Residentes</span>
                        </div>
                        <p className="text-lg font-bold text-[#0F7A5C]">{condo.totalResidents}</p>
                      </div>

                      {/* Ocupación */}
                      <div className="bg-gradient-to-br from-[#219EBC]/5 to-[#219EBC]/10 rounded-lg p-3 md:p-4 border border-[#219EBC]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-[#219EBC]" />
                          <span className="text-xs font-semibold text-[#219EBC]">Ocupación</span>
                        </div>
                        <p className="text-lg font-bold text-[#219EBC]">{condo.occupancyRate}%</p>
                      </div>

                      {/* Alertas */}
                      <div className="bg-gradient-to-br from-[#FB8500]/5 to-[#FB8500]/10 rounded-lg p-3 md:p-4 border border-[#FB8500]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-[#FB8500]" />
                          <span className="text-xs font-semibold text-[#FB8500]">Alertas</span>
                        </div>
                        <p className="text-lg font-bold text-[#FB8500]">{condo.alerts}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4 pb-6 border-b border-[#0D4A3E]/10">
                      <div className="bg-[#0D4A3E]/5 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-[#0D4A3E] mb-2">Bloques</p>
                        <p className="text-lg font-bold text-[#0D4A3E]">{condo.blocks}</p>
                      </div>
                      <div className="bg-[#0D4A3E]/5 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-[#0F7A5C] mb-2">Parqueaderos</p>
                        <p className="text-lg font-bold text-[#0F7A5C]">{condo.parkingSpots}</p>
                      </div>
                      <div className="bg-[#219EBC]/5 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-[#219EBC] mb-2">Depósitos</p>
                        <p className="text-lg font-bold text-[#219EBC]">{condo.storageUnits}</p>
                      </div>
                      <div className="bg-[#FFB703]/5 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-[#FFB703] mb-2">Cartera Mora</p>
                        <p className="text-lg font-bold text-[#FFB703]">${(condo.totalDebt / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>

                    {/* Admin Info - Bloque información */}
                    <div className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 rounded-lg p-4 border border-[#0D4A3E]/10">
                      <p className="text-xs font-bold text-[#0D4A3E] mb-4 uppercase tracking-wider">Información Administrativa</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-semibold text-[#0D4A3E]">Administrador:</span>
                          <span className="text-sm font-semibold text-[#0F7A5C] text-right">{condo.adminCompany}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-semibold text-[#0D4A3E]">Contacto:</span>
                          <span className="text-sm font-semibold text-[#0D4A3E] text-right">{condo.adminContact}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-semibold text-[#0D4A3E]">Fundado:</span>
                          <span className="text-sm font-semibold text-[#219EBC]">{new Date(condo.foundedDate).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CondoInfoModal;
