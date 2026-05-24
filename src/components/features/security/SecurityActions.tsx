import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, Package, QrCode, AlertTriangle, Clock, Users } from 'lucide-react';
import type { FeatureActionProps } from '@/actions/featureActions';

/**
 * M09 - Bitácora Digital de Portería
 * Registro de ingresos/salidas en tiempo real
 */
export const DigitalGuardLogAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  roleId,
  onClose,
}) => {
  const [logs] = useState([
    { id: 1, time: '14:30', visitor: 'Juan Pérez', unit: '101', type: 'Ingreso', evidence: true },
    { id: 2, time: '15:45', visitor: 'María López', unit: '205', type: 'Salida', evidence: true },
    { id: 3, time: '16:20', visitor: 'Domiciliario', unit: '301', type: 'Ingreso', evidence: false },
  ]);

  const canCreateEntry = accessLevel === 'FULL_ACCESS' && roleId === 'porteria';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-teal-600" />
            Bitácora de Portería
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {canCreateEntry && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-3">Registrar entrada/salida</p>
              <div className="flex gap-2">
                <Input placeholder="Nombre o documento" />
                <Input placeholder="Unidad" />
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  ✓ Ingreso
                </Button>
                <Button size="sm" variant="outline">
                  ✓ Salida
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-3 border rounded flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">{log.visitor}</p>
                    <p className="text-xs text-gray-500">Unidad {log.unit} • {log.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-1 bg-teal-100 text-teal-700 rounded">
                    {log.type}
                  </span>
                  {log.evidence && (
                    <span className="text-xs text-green-600 font-medium">📷 Evidencia</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            📊 Generar Reporte
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M09 - Paquetes y Correspondencia
 * Gestión de paquetes y correo en portería
 */
export const PackagesMailAction: React.FC<FeatureActionProps> = ({
  accessLevel,
  onClose,
}) => {
  const canManage = accessLevel === 'FULL_ACCESS' || accessLevel === 'LIMITED';
  const [packages] = useState([
    { id: 1, unit: '101', type: 'Paquete', carrier: 'Domiciliarios.co', status: 'Entregado', date: '2026-05-20' },
    { id: 2, unit: '205', type: 'Correspondencia', carrier: 'Correos', status: 'Pendiente', date: '2026-05-21' },
    { id: 3, unit: '301', type: 'Paquete', carrier: 'Urbano', status: 'En bodega', date: '2026-05-22' },
  ]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            Paquetes y Correspondencia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{pkg.type} • Unidad {pkg.unit}</p>
                    <p className="text-xs text-gray-500">{pkg.carrier}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    pkg.status === 'Entregado' ? 'bg-green-100 text-green-700' :
                    pkg.status === 'Pendiente' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {pkg.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">📅 {pkg.date}</p>
              </div>
            ))}
          </div>

          {canManage && (
            <div className="flex gap-2">
              <Button className="flex-1">+ Registrar Paquete</Button>
              <Button variant="outline" className="flex-1">✓ Marcar Entregado</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * M09 - Validación por QR, Placa, Documento o PIN
 * Métodos de validación para acceso
 */
export const ValidationMethodsAction: React.FC<FeatureActionProps> = ({
  onClose,
}) => {
  const [method, setMethod] = useState<string>('qr');

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-600" />
            Validación de Acceso
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'qr', label: '📱 QR', icon: '📱' },
              { id: 'plate', label: '🚗 Placa', icon: '🚗' },
              { id: 'doc', label: '🪪 Documento', icon: '🪪' },
              { id: 'pin', label: '🔐 PIN', icon: '🔐' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-3 border rounded-lg transition ${
                  method === m.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <p className="text-lg">{m.icon}</p>
                <p className="text-xs font-medium mt-1">{m.label}</p>
              </button>
            ))}
          </div>

          <div className="p-3 bg-gray-100 rounded text-center text-sm text-gray-600 h-24 flex items-center justify-center">
            {method === 'qr' && 'Escanea código QR...'}
            {method === 'plate' && 'Lee placa de vehículo...'}
            {method === 'doc' && 'Ingresa documento...'}
            {method === 'pin' && 'Ingresa PIN...'}
          </div>

          <Button className="w-full">✓ Validar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
