import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings2, Shield, Clock } from 'lucide-react';
import type { FeatureActionProps } from '@/actions/featureActions';

/**
 * M06 - Políticas por Espacio
 * Configura reglas de uso para cada espacio común
 */
export const SpacePoliciesAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const canEdit = accessLevel === 'FULL_ACCESS';

  const policies = [
    { space: 'Salón Principal', maxPerDay: 2, minNotice: '24h', costPerHour: '$50' },
    { space: 'Cancha de Tenis', maxPerDay: 3, minNotice: '12h', costPerHour: '$30' },
    { space: 'Piscina', maxPerDay: 1, minNotice: '48h', costPerHour: 'Gratis' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-purple-600" />
            Políticas de Espacios
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Espacio</th>
                  <th className="text-left p-2">Max/Día</th>
                  <th className="text-left p-2">Aviso Mín</th>
                  <th className="text-left p-2">Costo/Hora</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{policy.space}</td>
                    <td className="p-2">{policy.maxPerDay}</td>
                    <td className="p-2">{policy.minNotice}</td>
                    <td className="p-2 font-medium">{policy.costPerHour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {canEdit && (
            <Button className="w-full">
              ✎ Editar Políticas
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M06 - Check-in/Check-out
 * Registro de entrada y salida de espacios
 */
export const CheckInOutAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const canCheckIn = accessLevel === 'FULL_ACCESS' || accessLevel === 'LIMITED' || accessLevel === 'OWN_DATA_ONLY';

  const mockCheckIns = [
    { space: 'Salón Principal', unit: '101', checkIn: '14:30', checkOut: '16:45' },
    { space: 'Cancha Tenis', unit: '205', checkIn: '18:00', checkOut: null },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Check-in / Check-out
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            {mockCheckIns.map((check, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{check.space}</p>
                    <p className="text-xs text-gray-500">Unidad {check.unit}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    check.checkOut
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {check.checkOut ? 'Finalizado' : '✓ En curso'}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Ingreso: {check.checkIn}</span>
                  {check.checkOut && <span>Salida: {check.checkOut}</span>}
                </div>
              </div>
            ))}
          </div>

          {canCheckIn && (
            <div className="flex gap-2">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                ✓ Registrar Entrada
              </Button>
              <Button variant="outline" className="flex-1">
                ✓ Registrar Salida
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
