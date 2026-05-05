import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, Camera, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ROLES } from '@/types/roles';
import { getModulesForRole } from '@/types/modules';
import { captureModuleScreenshots, downloadScreenshotsAsZip, type ScreenshotData } from '@/utils/screenshotDownloader';
import type { RoleId } from '@/types/roles';

interface ScreenshotManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'profile-selection' | 'module-selection' | 'capturing';

export function ScreenshotManagerModal({ isOpen, onClose }: ScreenshotManagerModalProps) {
  const navigate = useNavigate();
  const { switchRole } = useAuthStore();
  const [step, setStep] = useState<Step>('profile-selection');
  const [selectedProfiles, setSelectedProfiles] = useState<RoleId[]>([]);
  const [selectedModules, setSelectedModules] = useState<Record<RoleId, string[]>>({});
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState('');
  const [captureTotal, setCaptureTotal] = useState(0);
  const [captureCurrent, setCaptureCurrent] = useState(0);

  const ALL_PROFILES: RoleId[] = ['super_admin', 'admin', 'consejo', 'propietario', 'arrendatario', 'porteria', 'proveedor'];

  const toggleProfile = (profile: RoleId) => {
    setSelectedProfiles((prev) =>
      prev.includes(profile)
        ? prev.filter((p) => p !== profile)
        : [...prev, profile]
    );
    setSelectedModules((prev) => {
      const updated = { ...prev };
      if (!prev[profile]) {
        const modules = getModulesForRole(profile);
        updated[profile] = modules.map((m) => m.path);
      }
      return updated;
    });
  };

  const toggleModule = (profile: RoleId, modulePath: string) => {
    setSelectedModules((prev) => ({
      ...prev,
      [profile]: prev[profile]?.includes(modulePath)
        ? prev[profile].filter((m) => m !== modulePath)
        : [...(prev[profile] || []), modulePath],
    }));
  };

  const handleProceedToModules = () => {
    if (selectedProfiles.length === 0) {
      toast({ title: 'Error', description: 'Selecciona al menos un perfil', variant: 'destructive' });
      return;
    }

    const newSelectedModules: Record<RoleId, string[]> = {};
    selectedProfiles.forEach((profile) => {
      const modules = getModulesForRole(profile);
      newSelectedModules[profile] = modules.map((m) => m.path);
    });
    setSelectedModules(newSelectedModules);
    setStep('module-selection');
  };

  const handleCaptureSelected = async () => {
    const profilesWithModules = selectedProfiles.filter((p) => (selectedModules[p]?.length || 0) > 0);

    if (profilesWithModules.length === 0) {
      toast({ title: 'Error', description: 'Selecciona al menos un módulo', variant: 'destructive' });
      return;
    }

    setIsCapturing(true);
    setStep('capturing');

    // Calcular total aproximado (2-3 imágenes por módulo)
    let total = 0;
    profilesWithModules.forEach((profile) => {
      total += (selectedModules[profile]?.length || 0) * 2;
    });
    setCaptureTotal(total);
    setCaptureCurrent(0);

    const allScreenshotsByProfile: Record<string, ScreenshotData[]> = {};
    let globalImageIndex = 1;

    try {
      for (const profileId of profilesWithModules) {
        switchRole(profileId);
        setProgress(`Preparando ${ROLES[profileId].label}...`);
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const allModules = getModulesForRole(profileId);
        const modulesToCapture = allModules.filter((m) => selectedModules[profileId]?.includes(m.path));
        const profileScreenshots: ScreenshotData[] = [];

        for (const module of modulesToCapture) {
          setProgress(`${ROLES[profileId].label} - ${module.label}`);

          // Navigate to module
          navigate(module.path);
          await new Promise((resolve) => setTimeout(resolve, 1800));

          try {
            // Capturar múltiples vistas del módulo
            const moduleScreenshots = await captureModuleScreenshots(
              module.label,
              globalImageIndex
            );

            // Actualizar índices globales en las capturas
            moduleScreenshots.forEach((screenshot, idx) => {
              profileScreenshots.push({
                ...screenshot,
                globalIndex: globalImageIndex + idx,
              });
            });

            globalImageIndex += moduleScreenshots.length;
            setCaptureCurrent((prev) => prev + moduleScreenshots.length);
          } catch (err) {
            console.error(`Error capturing ${module.label}:`, err);
          }
        }

        if (profileScreenshots.length > 0) {
          allScreenshotsByProfile[profileId] = profileScreenshots;
        }
      }

      // Descargar con contador global continuo
      setProgress('Creando archivo ZIP...');
      await downloadScreenshotsAsZip(allScreenshotsByProfile, profilesWithModules);

      const totalScreenshots = Object.values(allScreenshotsByProfile).reduce(
        (sum, arr) => sum + arr.length,
        0
      );

      toast({
        title: 'Captura completada',
        description: `Se descargó ZIP con ${totalScreenshots} imágenes en orden continuo`,
      });

      onClose();
      setStep('profile-selection');
      setSelectedProfiles([]);
      setSelectedModules({});
    } catch (error) {
      console.error('Error during capture:', error);
      toast({ title: 'Error', description: 'Error durante la captura de pantallas', variant: 'destructive' });
      setStep('module-selection');
    } finally {
      setIsCapturing(false);
      setProgress('');
    }
  };

  const handleBack = () => {
    setStep('profile-selection');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => !isCapturing && onClose()}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto max-w-sm md:max-w-2xl w-full max-h-[88vh]">
              {/* Modal body - Diseño único profesional */}
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl h-full flex flex-col border border-[#0D4A3E]/15">

                {/* Barra superior - Gradiente oficial */}
                <div className="h-1.5 bg-gradient-to-r from-[#0D4A3E] via-[#0F7A5C] to-[#0D4A3E]" />

                {/* Header */}
                <div className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 px-4 md:px-8 py-5 md:py-6 border-b border-[#0D4A3E]/10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Camera className="w-5 h-5 text-[#0D4A3E]" />
                      <h2 className="text-lg md:text-xl font-bold text-[#0D4A3E] truncate">
                        {step === 'profile-selection' && 'Seleccionar Perfiles'}
                        {step === 'module-selection' && 'Seleccionar Módulos'}
                        {step === 'capturing' && 'Capturando Pantallas'}
                      </h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      disabled={isCapturing}
                      className="p-2 hover:bg-[#0D4A3E]/10 transition-colors rounded-lg flex-shrink-0 disabled:opacity-50"
                      aria-label="Cerrar"
                    >
                      <X className="w-5 h-5 text-[#0D4A3E]" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                {/* Contenido scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-4 md:px-8 py-6 md:py-8 space-y-4">
                    {/* Profile Selection */}
                    {step === 'profile-selection' && !isCapturing && (
                      <div className="space-y-4">
                        <p className="text-sm text-[#0D4A3E]/70">Selecciona los perfiles que quieres capturar:</p>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {ALL_PROFILES.map((profileId) => (
                            <label
                              key={profileId}
                              className="flex items-center gap-3 p-3 rounded-lg bg-[#0D4A3E]/5 border border-[#0D4A3E]/10 cursor-pointer hover:bg-[#0D4A3E]/10 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedProfiles.includes(profileId)}
                                onChange={() => toggleProfile(profileId)}
                                className="w-4 h-4 rounded border-[#0D4A3E]"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#0D4A3E]">{ROLES[profileId].label}</p>
                                <p className="text-xs text-[#0D4A3E]/70">{ROLES[profileId].description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Module Selection */}
                    {step === 'module-selection' && !isCapturing && (
                      <div className="space-y-4">
                        <div className="max-h-[350px] overflow-y-auto space-y-4">
                          {selectedProfiles.map((profileId) => {
                            const modules = getModulesForRole(profileId);
                            return (
                              <div key={profileId}>
                                <h4 className="text-sm font-semibold text-[#0D4A3E] mb-2">{ROLES[profileId].label}</h4>
                                <div className="space-y-1 pl-2 border-l-2 border-[#0F7A5C]/30">
                                  {modules.map((module) => (
                                    <label
                                      key={module.path}
                                      className="flex items-center gap-2 p-2 rounded text-xs cursor-pointer hover:bg-[#0D4A3E]/5 transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedModules[profileId]?.includes(module.path) ?? false}
                                        onChange={() => toggleModule(profileId, module.path)}
                                        className="w-3 h-3 rounded border-[#0F7A5C]"
                                      />
                                      <span className="text-[#0D4A3E]/70">{module.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 rounded-lg bg-[#0D4A3E]/10 border border-[#0F7A5C]/20 space-y-1">
                          <p className="text-xs text-[#0F7A5C] font-medium">Captura optimizada</p>
                          <p className="text-xs text-[#0F7A5C]/80">• Mínimo 2 imágenes por módulo</p>
                          <p className="text-xs text-[#0F7A5C]/80">• Numeración continua: 001, 002, 003...</p>
                          <p className="text-xs text-[#0F7A5C]/80">• Organizado por perfil</p>
                        </div>
                      </div>
                    )}

                    {/* Capturing Progress */}
                    {step === 'capturing' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <Loader className="w-5 h-5 animate-spin text-[#0F7A5C]" />
                          <div className="flex-1">
                            <span className="text-sm text-[#0D4A3E]/70 line-clamp-2">{progress}</span>
                            <p className="text-xs text-[#0D4A3E]/70 mt-1">
                              {captureCurrent} de {captureTotal} imágenes
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-[#0D4A3E]/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] rounded-full h-2 transition-all duration-300"
                            style={{ width: `${Math.min((captureCurrent / captureTotal) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#0D4A3E]/70 text-center">
                          Esto puede tomar 3-5 minutos. No cierres esta ventana...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-[#0D4A3E]/5 to-[#0F7A5C]/5 px-4 md:px-8 py-4 md:py-5 border-t border-[#0D4A3E]/10 flex gap-2">
                  <button
                    onClick={step === 'module-selection' ? handleBack : onClose}
                    disabled={isCapturing}
                    className="flex-1 h-10 rounded-xl border border-[#0D4A3E]/20 text-sm text-[#0D4A3E] hover:bg-[#0D4A3E]/5 transition-colors disabled:opacity-50"
                  >
                    {step === 'module-selection' ? 'Atrás' : 'Cancelar'}
                  </button>
                  {!isCapturing && step !== 'capturing' && (
                    <button
                      onClick={step === 'profile-selection' ? handleProceedToModules : handleCaptureSelected}
                      disabled={step === 'profile-selection' ? selectedProfiles.length === 0 : false}
                      className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#0D4A3E] to-[#0D4A3E] text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {step === 'profile-selection' && (
                        <>Continuar <ChevronRight className="w-4 h-4" /></>
                      )}
                      {step === 'module-selection' && (
                        <><Camera className="w-4 h-4" /> Capturar</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
