import { motion } from 'framer-motion';
import { Building2, MapPin, Users, AlertTriangle, X, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface CondosFloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCondo: (condoId: string) => void;
  selectedCondoId?: string;
}

export const CondosFloatingPanel = ({
  isOpen,
  onClose,
  onSelectCondo,
  selectedCondoId,
}: CondosFloatingPanelProps) => {
  const { condos } = useAppStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{
          x: isOpen ? 0 : -400,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-screen w-96 bg-white z-50 border-r border-[#0D4A3E]/10 overflow-hidden flex flex-col lg:relative lg:h-auto lg:w-full lg:border-0 lg:bg-white lg:p-6 lg:flex-none shadow-2xl"
      >
        {/* Master Header Line */}
        <div className="h-1 bg-gradient-to-r from-[#0D4A3E] via-[#0F7A5C] to-[#0D4A3E]" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#0D4A3E]/10 lg:border-0 lg:p-0 lg:mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D4A3E] to-[#0D4A3E] flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0D4A3E]">Localidades</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#0D4A3E]/10 transition-colors lg:hidden"
          >
            <X className="w-6 h-6 text-[#0D4A3E]" />
          </button>
        </div>

        {/* Condos List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {condos.map((condo, idx) => (
            <motion.button
              key={condo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                onSelectCondo(condo.id);
                onClose();
              }}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border-2 ${
                selectedCondoId === condo.id
                  ? 'bg-gradient-to-br from-[#0D4A3E]/5 to-[#0F7A5C]/5 border-[#0F7A5C] shadow-lg'
                  : 'bg-gradient-to-br from-white to-[#0D4A3E]/2 border-[#0D4A3E]/10 hover:border-[#0F7A5C]/50 hover:shadow-md'
              }`}
            >
              {/* Condo Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0D4A3E] text-base">{condo.name}</h4>
                  <p className="text-sm text-[#0D4A3E]/70 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4" /> {condo.city}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-[#0F7A5C] transition-transform flex-shrink-0 ${
                    selectedCondoId === condo.id ? 'translate-x-1' : ''
                  }`}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#0D4A3E]/10">
                <div>
                  <p className="text-xs text-[#0D4A3E]/70 font-semibold">Unidades</p>
                  <p className="text-lg font-bold text-[#0D4A3E] mt-0.5">{condo.totalUnits}</p>
                </div>
                <div>
                  <p className="text-xs text-[#0D4A3E]/70 font-semibold">Ocupación</p>
                  <p className="text-lg font-bold text-[#0D4A3E] mt-0.5">{condo.occupancyRate}%</p>
                </div>
              </div>

              {/* Alerts Badge */}
              {condo.alerts > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm bg-[#FB8500]/20 text-[#FB8500] px-3 py-2 rounded-lg w-fit font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  {condo.alerts} alertas
                </div>
              )}
            </motion.button>
          ))}

          {condos.length === 0 && (
            <div className="flex items-center justify-center h-40 text-center">
              <div>
                <Building2 className="w-10 h-10 text-[#0D4A3E]/50 mx-auto mb-3" />
                <p className="text-sm text-[#0D4A3E]/70">No hay localidades disponibles</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="border-t border-[#0D4A3E]/10 bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 p-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#0D4A3E]/70 font-semibold">Total de localidades</span>
            <span className="font-bold text-[#0D4A3E]">{condos.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#0D4A3E]/70 font-semibold">Unidades gestionadas</span>
            <span className="font-bold text-[#0D4A3E]">
              {condos.reduce((a, c) => a + c.totalUnits, 0)}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CondosFloatingPanel;
