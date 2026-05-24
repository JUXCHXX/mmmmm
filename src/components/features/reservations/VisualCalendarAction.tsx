import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import type { FeatureActionProps } from '@/actions/featureActions';

/**
 * M06 - Calendario Visual de Reservas
 * Permite ver disponibilidad de espacios y hacer reservas
 */
export const VisualCalendarAction: React.FC<FeatureActionProps> = ({
  featureId,
  accessLevel,
  onClose,
}) => {
  const canBook = accessLevel === 'FULL_ACCESS' || accessLevel === 'LIMITED';
  const canManage = accessLevel === 'FULL_ACCESS';

  const mockSpaces = [
    { id: 1, name: 'Salón Principal', capacity: 100, status: 'available' },
    { id: 2, name: 'Cancha de Tenis', capacity: 4, status: 'reserved' },
    { id: 3, name: 'Piscina', capacity: 50, status: 'available' },
  ];

  const mockBookings = [
    { date: '2026-05-25', time: '14:00-16:00', space: 'Salón Principal', unit: '101' },
    { date: '2026-05-26', time: '10:00-12:00', space: 'Cancha de Tenis', unit: '205' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Calendario de Reservas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Espacios disponibles */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Espacios Disponibles</h3>
            <div className="grid gap-2">
              {mockSpaces.map((space) => (
                <div
                  key={space.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{space.name}</p>
                      <p className="text-xs text-gray-500">{space.capacity} personas</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      space.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {space.status === 'available' ? '✓ Disponible' : '⏳ Reservado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reservas próximas */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Próximas Reservas</h3>
            <div className="space-y-2">
              {mockBookings.map((booking, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{booking.space}</p>
                    <p className="text-xs text-gray-600">
                      {booking.date} • {booking.time}
                    </p>
                    <p className="text-xs text-gray-500">Unidad {booking.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permisos info */}
          {accessLevel === 'READ_ONLY' && (
            <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Modo consulta: puedes ver disponibilidad pero no hacer nuevas reservas
              </p>
            </div>
          )}

          {canBook && (
            <div className="flex gap-2">
              <Button className="flex-1" disabled={!canBook}>
                + Nueva Reserva
              </Button>
            </div>
          )}

          {canManage && (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                ⚙️ Gestionar Políticas
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
