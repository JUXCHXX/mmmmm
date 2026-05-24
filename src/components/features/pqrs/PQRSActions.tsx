import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3, Clock, AlertTriangle, MessageSquare, Star } from 'lucide-react';
import type { FeatureActionProps } from '@/actions/featureActions';

/**
 * M07 - Bandejas por Responsable
 * Gestión de tickets asignados
 */
export const TraysByResponsibleAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  roleId,
  onClose,
}) => {
  const [trays] = useState([
    { id: 1, title: 'Reparación de tubería', priority: 'Alta', status: 'En progreso', dueDate: '2026-05-23' },
    { id: 2, title: 'Cambio de bombilla', priority: 'Baja', status: 'Asignada', dueDate: '2026-05-25' },
    { id: 3, title: 'Queja por ruido', priority: 'Media', status: 'Resuelta', dueDate: '2026-05-20' },
  ]);

  const canManage = accessLevel === 'FULL_ACCESS' || (roleId === 'admin' || roleId === 'super_admin');

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Mis Bandejas de Trabajo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {trays.map((tray) => (
            <div key={tray.id} className="p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{tray.title}</p>
                  <p className="text-xs text-gray-600">Vencimiento: {tray.dueDate}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  tray.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                  tray.priority === 'Media' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {tray.priority}
                </span>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  tray.status === 'En progreso' ? 'bg-blue-100 text-blue-700' :
                  tray.status === 'Resuelta' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {tray.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {canManage && (
          <Button className="w-full">+ Nueva PQRS</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * M07 - Trazabilidad Completa
 * Historial y seguimiento de casos
 */
export const FullTraceabilityAction: React.FC<FeatureActionProps> = ({
  onClose,
}) => {
  const timeline = [
    { date: '2026-05-20 10:30', action: 'PQRS Creada', user: 'Residente 101', status: 'info' },
    { date: '2026-05-20 11:15', action: 'Asignada a Técnico', user: 'Admin', status: 'info' },
    { date: '2026-05-21 14:00', action: 'Trabajo Iniciado', user: 'Carlos Gómez', status: 'info' },
    { date: '2026-05-21 16:30', action: 'Trabajo Completado', user: 'Carlos Gómez', status: 'success' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-96">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Trazabilidad Completa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 overflow-y-auto">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${
                  item.status === 'success' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                {idx < timeline.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-300 mt-1" />
                )}
              </div>
              <div className="pb-3">
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-gray-500">{item.date} • {item.user}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M07 - Satisfacción Post-Cierre
 * Encuesta de satisfacción
 */
export const PostCloseSatisfactionAction: React.FC<FeatureActionProps> = ({
  onClose,
}) => {
  const [rating, setRating] = useState<number>(0);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-600" />
            Encuesta de Satisfacción
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">¿Cómo fue tu experiencia?</p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${
                    rating >= star ? 'text-orange-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Comentarios..."
            className="w-full h-24 p-3 border rounded text-sm resize-none"
          />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">Cancelar</Button>
            <Button className="flex-1">Enviar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M07 - Re-apertura de Casos
 * Reabrir PQRS cerradas
 */
export const CaseReopeningAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const canReopen = accessLevel !== 'READ_ONLY' && accessLevel !== 'NONE';
  const closedCases = [
    { id: 1, title: 'Fuga de agua', closedDate: '2026-05-15', reason: 'Resuelta' },
    { id: 2, title: 'Reparación de puerta', closedDate: '2026-05-10', reason: 'Completada' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Re-apertura de Casos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {closedCases.map((case_) => (
            <div key={case_.id} className="p-3 border rounded-lg flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">{case_.title}</p>
                <p className="text-xs text-gray-600">{case_.reason} • {case_.closedDate}</p>
              </div>
              {canReopen && (
                <Button size="sm" variant="outline" className="text-orange-600">
                  Reabrir
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
