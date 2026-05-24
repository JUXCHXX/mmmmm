import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { AccessLevel } from '@/types/roles';
import { X, Lock, Eye, Pencil, Trash2 } from 'lucide-react';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: string;
  featureTitle: string;
  accessLevel: AccessLevel;
  moduleCode: string;
}

const getAccessIcon = (accessLevel: AccessLevel) => {
  const icons: Record<AccessLevel, typeof Lock> = {
    FULL_ACCESS: Pencil,
    LIMITED: Pencil,
    READ_ONLY: Eye,
    OWN_DATA_ONLY: Eye,
    NONE: Lock,
  };
  return icons[accessLevel];
};

const getAccessDescription = (accessLevel: AccessLevel) => {
  const descriptions: Record<AccessLevel, string> = {
    FULL_ACCESS: 'Tienes acceso completo. Puedes crear, editar y eliminar registros.',
    LIMITED: 'Tienes acceso limitado. Puedes realizar algunas operaciones según las reglas de negocio.',
    READ_ONLY: 'Tienes acceso de solo lectura. Puedes ver la información pero no modificarla.',
    OWN_DATA_ONLY: 'Puedes ver y editar solo tus propios registros.',
    NONE: 'No tienes acceso a esta función.',
  };
  return descriptions[accessLevel];
};

export const FeatureModal = ({
  isOpen,
  onClose,
  featureId,
  featureTitle,
  accessLevel,
  moduleCode,
}: FeatureModalProps) => {
  const AccessIcon = getAccessIcon(accessLevel);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${
                  accessLevel === 'NONE'
                    ? 'bg-gray-100'
                    : accessLevel === 'READ_ONLY'
                    ? 'bg-amber-50'
                    : accessLevel === 'LIMITED'
                    ? 'bg-blue-50'
                    : accessLevel === 'OWN_DATA_ONLY'
                    ? 'bg-purple-50'
                    : 'bg-emerald-50'
                }`}
              >
                <AccessIcon
                  className={`w-5 h-5 ${
                    accessLevel === 'NONE'
                      ? 'text-gray-500'
                      : accessLevel === 'READ_ONLY'
                      ? 'text-amber-600'
                      : accessLevel === 'LIMITED'
                      ? 'text-blue-600'
                      : accessLevel === 'OWN_DATA_ONLY'
                      ? 'text-purple-600'
                      : 'text-emerald-600'
                  }`}
                />
              </div>
              <div>
                <DialogTitle>{featureTitle}</DialogTitle>
                <p className="text-xs text-gray-500 mt-1">{featureId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Access Level Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">Nivel de Acceso:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                accessLevel === 'NONE'
                  ? 'bg-gray-100 text-gray-700'
                  : accessLevel === 'READ_ONLY'
                  ? 'bg-amber-100 text-amber-700'
                  : accessLevel === 'LIMITED'
                  ? 'bg-blue-100 text-blue-700'
                  : accessLevel === 'OWN_DATA_ONLY'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {accessLevel === 'FULL_ACCESS'
                ? '✓ Acceso Completo'
                : accessLevel === 'LIMITED'
                ? '◐ Acceso Parcial'
                : accessLevel === 'READ_ONLY'
                ? '👁️ Solo Lectura'
                : accessLevel === 'OWN_DATA_ONLY'
                ? '📋 Tus Datos'
                : '🔒 Sin Acceso'}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {getAccessDescription(accessLevel)}
          </p>

          {/* Placeholder Content */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-mono text-gray-500 mb-2">→ Módulo: {moduleCode}</p>
            <p className="text-xs font-mono text-gray-500">→ Feature ID: {featureId}</p>
          </div>

          {/* Status Message */}
          {accessLevel === 'NONE' ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 font-semibold">Acceso Denegado</p>
              <p className="text-xs text-red-600 mt-1">
                Esta función no está disponible para tu perfil de usuario.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-semibold">ℹ️ Demostración</p>
              <p className="text-xs text-blue-600 mt-1">
                Esta es una vista de demostración de acceso. En producción, aquí se cargará la vista completa con datos reales.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          {accessLevel !== 'NONE' && (
            <>
              {(accessLevel === 'FULL_ACCESS' || accessLevel === 'LIMITED') && (
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled
                >
                  <Pencil className="w-4 h-4" />
                  Crear/Editar
                </Button>
              )}
              {accessLevel === 'FULL_ACCESS' && (
                <Button
                  variant="outline"
                  className="gap-2 text-red-600 hover:text-red-700"
                  disabled
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
              )}
            </>
          )}
          <Button onClick={onClose} variant="default">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal;
