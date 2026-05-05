import { motion } from 'framer-motion';
import { ClipboardList, MessageCircle, AlertCircle, Lightbulb, CheckCircle, Clock, Zap } from 'lucide-react';
import { FloatingModalUnified } from './FloatingModalUnified';
import { ReactNode, useState } from 'react';

interface PQRSComponentProps {
  isOpen: boolean;
  onClose: () => void;
  unitInfo?: { unit: string; tower: string };
}

type PQRSCategory = 'peticion' | 'queja' | 'reclamo' | 'sugerencia';

interface PQRSCategoryConfig {
  icon: ReactNode;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const PQRS_CATEGORIES: Record<PQRSCategory, PQRSCategoryConfig> = {
  peticion: {
    icon: <MessageCircle className="w-5 h-5" />,
    label: 'Petición',
    description: 'Solicitud de un servicio o acción específica',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  queja: {
    icon: <AlertCircle className="w-5 h-5" />,
    label: 'Queja',
    description: 'Manifestación de inconformidad o insatisfacción',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  reclamo: {
    icon: <Zap className="w-5 h-5" />,
    label: 'Reclamo',
    description: 'Exigencia de enmienda por falta o daño',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
  sugerencia: {
    icon: <Lightbulb className="w-5 h-5" />,
    label: 'Sugerencia',
    description: 'Propuesta para mejorar el conjunto',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
  },
};

export const PQRSComponent = ({ isOpen, onClose, unitInfo }: PQRSComponentProps) => {
  const [selectedCategory, setSelectedCategory] = useState<PQRSCategory>('peticion');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    urgency: 'normal',
    attachments: [] as File[],
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ title: '', description: '', urgency: 'normal', attachments: [] });
        setSelectedCategory('peticion');
        onClose();
      }, 2500);
    }
  };

  return (
    <FloatingModalUnified
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSubmitted(false);
      }}
      title="Crear PQRS"
      icon={<ClipboardList className="w-5 h-5" />}
      size="lg"
      footer={
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-[#0D4A3E] text-[#0D4A3E] hover:bg-[#0D4A3E]/5 transition-colors text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.description.trim()}
            className="flex-1 bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white h-10 rounded-xl text-sm font-semibold transition-all"
          >
            <span className="inline-flex items-center gap-2">
              {submitted && <CheckCircle className="h-4 w-4" />}
              <span>{submitted ? 'Enviado' : 'Enviar PQRS'}</span>
            </span>
          </button>
        </div>
      }
    >
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: 2 }}>
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-[#0D4A3E] mb-2">¡PQRS Creada Exitosamente!</h3>
          <p className="text-sm text-[#0D4A3E]/70 text-center max-w-md">
            Tu {PQRS_CATEGORIES[selectedCategory].label.toLowerCase()} ha sido registrada. La administración la
            revisará en máximo 10 días hábiles.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 w-full">
            <p className="text-xs text-blue-700">
              <span className="font-bold">Tu Referencia:</span> PQRS-{Date.now().toString().slice(-6)}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Información de la unidad */}
          {unitInfo && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 border border-[#0F7A5C]/20">
              <p className="text-xs font-bold text-[#0F7A5C] uppercase mb-2">Tu Unidad</p>
              <p className="text-lg font-bold text-[#0D4A3E]">
                Apto {unitInfo.unit} - {unitInfo.tower}
              </p>
            </div>
          )}

          {/* Selector de Categoría */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0D4A3E] uppercase">Tipo de PQRS *</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(PQRS_CATEGORIES) as [PQRSCategory, PQRSCategoryConfig][]).map(
                ([category, config]) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategory === category
                        ? `${config.bgColor} border-current`
                        : `${config.bgColor} border-transparent hover:border-current`
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${config.color}`}>{config.icon}</div>
                    <p className={`font-bold text-sm ${config.color}`}>{config.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{config.description}</p>
                  </motion.button>
                )
              )}
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Asunto */}
            <div>
              <label className="text-xs font-bold text-[#0D4A3E] uppercase block mb-2">
                Asunto o Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Reparación de la puerta principal"
                className="w-full h-10 px-4 rounded-lg border border-[#0D4A3E]/20 focus:border-[#0F7A5C] outline-none transition-colors text-sm"
              />
              <p className="text-xs text-[#0D4A3E]/60 mt-1">Sé claro y específico sobre el tema</p>
            </div>

            {/* Descripción */}
            <div>
              <label className="text-xs font-bold text-[#0D4A3E] uppercase block mb-2">
                Descripción Detallada *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Proporciona toda la información relevante. Incluye fechas, lugares exactos, personas involucradas si es aplicable..."
                className="w-full h-24 px-4 py-3 rounded-lg border border-[#0D4A3E]/20 focus:border-[#0F7A5C] outline-none transition-colors text-sm resize-none"
              />
              <p className="text-xs text-[#0D4A3E]/60 mt-1">
                Mínimo 20 caracteres. Sé lo más detallado posible.
              </p>
            </div>

            {/* Urgencia */}
            <div>
              <label className="text-xs font-bold text-[#0D4A3E] uppercase block mb-2">Nivel de Urgencia</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'baja', label: 'Baja', color: 'bg-blue-100 border-blue-300 text-blue-700' },
                  { value: 'normal', label: 'Normal', color: 'bg-amber-100 border-amber-300 text-amber-700' },
                  { value: 'alta', label: 'Alta', color: 'bg-red-100 border-red-300 text-red-700' },
                ].map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: value })}
                    className={`py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${color} ${
                      formData.urgency === value ? 'ring-2 ring-offset-2 ring-current' : ''
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Información Importante */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2"
            >
              <div className="flex gap-2">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  <span className="font-bold">Tiempo de respuesta:</span> Hasta 10 días hábiles.
                </p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  <span className="font-bold">Seguimiento:</span> Recibirás actualizaciones por correo.
                </p>
              </div>
            </motion.div>
          </form>
        </div>
      )}
    </FloatingModalUnified>
  );
};

export default PQRSComponent;
