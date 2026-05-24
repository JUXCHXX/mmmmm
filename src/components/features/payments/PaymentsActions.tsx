import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, AlertCircle, Calendar, BarChart3 } from 'lucide-react';
import type { FeatureActionProps } from '@/actions/featureActions';

/**
 * M04 - Acuerdos de Pago
 * Crear y gestionar acuerdos de pago
 */
export const PaymentAgreementsAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const canCreate = accessLevel === 'FULL_ACCESS' || accessLevel === 'LIMITED';
  const [agreements] = useState([
    { id: 1, unit: '101', debt: '$2,500', agreement: '3 cuotas', startDate: '2026-05-20', status: 'Activo' },
    { id: 2, unit: '205', debt: '$1,800', agreement: '2 cuotas', startDate: '2026-05-18', status: 'Activo' },
  ]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Acuerdos de Pago
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {canCreate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-3">Crear nuevo acuerdo</p>
              <div className="space-y-2">
                <Input placeholder="Unidad" />
                <Input placeholder="Monto total" type="number" />
                <Input placeholder="Número de cuotas" type="number" />
                <Button className="w-full">Crear Acuerdo</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {agreements.map((agreement) => (
              <div key={agreement.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">Unidad {agreement.unit}</p>
                    <p className="text-xs text-gray-600">{agreement.agreement}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                    {agreement.status}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>💰 {agreement.debt}</span>
                  <span>📅 {agreement.startDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M04 - Promesas de Pago
 * Gestión de promesas de pago
 */
export const PaymentPromisesAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const promises = [
    { id: 1, unit: '301', amount: '$1,200', promiseDate: '2026-05-28', status: 'Cumplida' },
    { id: 2, unit: '402', amount: '$800', promiseDate: '2026-05-25', status: 'Pendiente' },
    { id: 3, unit: '103', amount: '$500', promiseDate: '2026-05-22', status: 'Incumplida' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Promesas de Pago
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {promises.map((promise) => (
            <div key={promise.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="text-sm">
                  <p className="font-medium">Unidad {promise.unit}</p>
                  <p className="text-xs text-gray-600">{promise.amount} • {promise.promiseDate}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  promise.status === 'Cumplida' ? 'bg-green-100 text-green-700' :
                  promise.status === 'Pendiente' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {promise.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M04 - Tablero de Recaudo Diario
 * Dashboard de cobranza del día
 */
export const DailyCollectionBoardAction: React.FC<FeatureActionProps> = ({
  onClose,
}) => {
  const stats = {
    collected: '$15,420',
    pending: '$8,300',
    goal: '$20,000',
    percentage: 77,
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Tablero de Recaudo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-xs text-gray-600 mb-1">Recaudado</p>
              <p className="text-lg font-bold text-green-700">{stats.collected}</p>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <p className="text-xs text-gray-600 mb-1">Pendiente</p>
              <p className="text-lg font-bold text-orange-700">{stats.pending}</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-gray-600 mb-1">Meta</p>
              <p className="text-lg font-bold text-blue-700">{stats.goal}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progreso del día</span>
              <span className="font-bold">{stats.percentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-700">Falta ${(parseInt(stats.goal) - parseInt(stats.collected.replace(/\D/g, ''))).toLocaleString()} para alcanzar la meta</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M04 - Cartera por Antigüedad (Aging Portfolio)
 * Análisis de deuda por vencimiento
 */
export const AgingPortfolioAction: React.FC<FeatureActionProps> = ({
  onClose,
}) => {
  const aging = [
    { range: '0-30 días', amount: '$2,100', count: 8, percentage: 15 },
    { range: '31-60 días', amount: '$4,300', count: 12, percentage: 28 },
    { range: '61-90 días', amount: '$5,200', count: 15, percentage: 35 },
    { range: '+90 días', amount: '$3,400', count: 9, percentage: 22 },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Cartera por Antigüedad
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {aging.map((item, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{item.range}</p>
                  <p className="text-xs text-gray-600">{item.count} unidades</p>
                </div>
                <p className="font-bold text-sm">{item.amount}</p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
