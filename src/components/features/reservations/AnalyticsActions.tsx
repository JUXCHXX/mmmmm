import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { History, BarChart3, Clock, AlertCircle } from 'lucide-react';
import type { FeatureActionProps } from '@/actions/featureActions';

/**
 * M06 - Historial de Reservas
 * Ver todas las reservas realizadas por unidad
 */
export const ReservationHistoryAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const showOwnDataOnly = accessLevel === 'OWN_DATA_ONLY';

  const mockHistory = [
    { date: '2026-05-20', space: 'Salón Principal', time: '14:00-16:00', status: 'completed', unit: '101' },
    { date: '2026-05-15', space: 'Cancha Tenis', time: '18:00-19:00', status: 'completed', unit: '101' },
    { date: '2026-05-10', space: 'Piscina', time: '09:00-10:00', status: 'cancelled', unit: '101' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            {showOwnDataOnly ? 'Mis Reservas' : 'Historial de Reservas'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {showOwnDataOnly && (
            <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700">Estás viendo solo tus reservas</p>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mockHistory.map((item, idx) => (
              <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-sm">{item.space}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    item.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'completed' ? '✓ Completada' : '✕ Cancelada'}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>📅 {item.date}</span>
                  <span>🕐 {item.time}</span>
                  {!showOwnDataOnly && <span>Unit {item.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              📊 Exportar
            </Button>
            <Button variant="outline" className="flex-1">
              🔄 Actualizar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M06 - Analítica de Uso de Espacios
 * Estadísticas y ocupación de espacios
 */
export const SpaceUsageAnalyticsAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const canViewDetails = accessLevel !== 'NONE';

  const mockStats = [
    { space: 'Salón Principal', usage: 85, bookings: 24, revenue: '$1,200' },
    { space: 'Cancha Tenis', usage: 62, bookings: 18, revenue: '$540' },
    { space: 'Piscina', usage: 45, bookings: 12, revenue: 'Gratis' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Analítica de Espacios
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3">
            {mockStats.map((stat, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <p className="font-medium text-sm mb-3">{stat.space}</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Ocupación</span>
                      <span className="font-bold">{stat.usage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${stat.usage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>📅 {stat.bookings} reservas</span>
                    <span>💰 {stat.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canViewDetails && (
            <Button variant="outline" className="w-full">
              📊 Ver Detalles Completos
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
