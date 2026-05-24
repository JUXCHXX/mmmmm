import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Shield, Zap } from 'lucide-react';
import type { FeatureActionProps } from '@/actions/featureActions';

/**
 * M09 - Alertas en Tiempo Real
 * Panel de alertas de seguridad
 */
export const RealTimeAlertsAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const alerts = [
    { id: 1, severity: 'critical', title: 'Acceso no autorizado', unit: '305', time: '14:30' },
    { id: 2, severity: 'warning', title: 'Múltiples intentos fallidos', unit: '412', time: '15:15' },
    { id: 3, severity: 'info', title: 'Mantenimiento programado', area: 'Ascensor A', time: '16:00' },
  ];

  const canAcknowledge = accessLevel === 'FULL_ACCESS' || accessLevel === 'LIMITED';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-96">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600 animate-pulse" />
            Alertas en Tiempo Real
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 border-l-4 rounded flex justify-between items-center ${
                alert.severity === 'critical'
                  ? 'border-red-500 bg-red-50'
                  : alert.severity === 'warning'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{alert.title}</p>
                <p className="text-xs text-gray-600">
                  {alert.unit ? `Unidad ${alert.unit}` : alert.area} • {alert.time}
                </p>
              </div>
              {canAcknowledge && (
                <Button size="sm" variant="ghost" className="text-green-600">
                  ✓
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M09 - Turnos de Seguridad
 * Gestión de turnos de personal
 */
export const SecurityShiftsAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const shifts = [
    { id: 1, guard: 'Carlos Gómez', shift: 'Mañana', time: '06:00-14:00', status: 'Activo' },
    { id: 2, guard: 'Juan Martínez', shift: 'Tarde', time: '14:00-22:00', status: 'Próximo' },
    { id: 3, guard: 'Pedro Rodríguez', shift: 'Noche', time: '22:00-06:00', status: 'Descansando' },
  ];

  const canEdit = accessLevel === 'FULL_ACCESS';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Turnos de Seguridad
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {shifts.map((shift) => (
            <div key={shift.id} className="p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{shift.guard}</p>
                  <p className="text-xs text-gray-600">{shift.shift} • {shift.time}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  shift.status === 'Activo' ? 'bg-green-100 text-green-700' :
                  shift.status === 'Próximo' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {shift.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {canEdit && (
          <Button className="w-full">+ Crear Nuevo Turno</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * M09 - Panel Express para Portería
 * Acceso rápido a funciones principales
 */
export const ExpressGatePanelAction: React.FC<FeatureActionProps> = ({
  onClose,
}) => {
  const quickActions = [
    { id: 1, title: 'Registrar Ingreso', icon: '✓', color: 'green' },
    { id: 2, title: 'Registrar Salida', icon: '✓', color: 'blue' },
    { id: 3, title: 'Visitante', icon: '👤', color: 'orange' },
    { id: 4, title: 'Domiciliario', icon: '📦', color: 'purple' },
    { id: 5, title: 'Alerta', icon: '⚠️', color: 'red' },
    { id: 6, title: 'Bloqueo', icon: '🔒', color: 'gray' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            Panel Express - Portería
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className={`p-4 border rounded-lg font-medium text-sm hover:shadow-md transition ${
                action.color === 'green' ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' :
                action.color === 'blue' ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' :
                action.color === 'orange' ? 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100' :
                action.color === 'purple' ? 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100' :
                action.color === 'red' ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' :
                'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <p className="text-2xl mb-1">{action.icon}</p>
              <p className="text-xs">{action.title}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
