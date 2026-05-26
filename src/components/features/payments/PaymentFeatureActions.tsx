import type { FeatureActionProps } from '@/actions/featureActions';
import type { FeatureActionButton, FeatureFormField, FeatureItem, FeatureMetric } from '@/components/features/shared/FeatureActionShell';
import {
  FeatureActionButtons,
  FeatureActionShell,
  FeatureFormCard,
  FeatureItemList,
  FeatureMetricGrid,
  FeatureSectionCard,
  getFeatureCapabilities,
} from '@/components/features/shared/FeatureActionShell';
import { PaymentsFeatureWorkspace } from '@/components/features/payments/PaymentsFeatureWorkspace';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  BellRing,
  Blend,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  CreditCard,
  FileBarChart,
  FileClock,
  HandCoins,
  Landmark,
  Layers3,
  NotebookPen,
  Radar,
  Receipt,
  Scale,
} from 'lucide-react';

type PaymentFeatureId =
  | 'm04_auto_payment_reconciliation'
  | 'm04_multichannel_collection'
  | 'm04_payment_agreements'
  | 'm04_payment_promises'
  | 'm04_blocking_by_mora'
  | 'm04_collection_history'
  | 'm04_aging_portfolio'
  | 'm04_progressive_mora_notification'
  | 'm04_refinancing_simulator'
  | 'm04_campaign_collection'
  | 'm04_partial_payments'
  | 'm04_credit_debit_notes'
  | 'm04_bank_integration'
  | 'm04_daily_collection_board'
  | 'm04_predictive_mora_alerts';

interface PaymentSection {
  title: string;
  description?: string;
  items: FeatureItem[];
}

interface PaymentWorkspace {
  title: string;
  summary: string;
  icon: LucideIcon;
  metrics: FeatureMetric[];
  composer?: {
    title: string;
    description?: string;
    fields: FeatureFormField[];
    action?: FeatureActionButton;
    disabledMessage?: string;
  };
  sections: PaymentSection[];
  footerActions?: FeatureActionButton[];
}

const RECONCILIATION_BATCHES = [
  { batch: 'Lote PSE 24-05', source: 'Banco de Bogota', total: '$12.430.000', mismatch: '1 pago sin referencia' },
  { batch: 'Lote QR 24-05', source: 'Pasarela Bunty Pay', total: '$6.820.000', mismatch: 'Sin novedades' },
];

const CHANNEL_ROWS = [
  { channel: 'PSE', volume: '$18.200.000', share: '48%', status: 'Canal principal' },
  { channel: 'Link de pago', volume: '$9.100.000', share: '24%', status: 'Crecio 12% semanal' },
  { channel: 'Transferencia', volume: '$7.300.000', share: '19%', status: 'Requiere validacion manual' },
  { channel: 'Caja porteria', volume: '$3.200.000', share: '9%', status: 'Solo para contingencia' },
];

const AGREEMENT_ROWS = [
  { unit: 'T1-302', owner: 'Ana Garcia', debt: '$1.250.000', plan: '3 cuotas', nextInstallment: '2026-05-30' },
  { unit: 'T2-904', owner: 'Carlos Ruiz', debt: '$2.480.000', plan: '5 cuotas', nextInstallment: '2026-06-05' },
];

const PROMISE_ROWS = [
  { unit: 'T1-604', owner: 'Sandra Pena', amount: '$480.000', promisedFor: '2026-05-29', status: 'Pendiente' },
  { unit: 'T2-401', owner: 'Jose Lara', amount: '$350.000', promisedFor: '2026-05-27', status: 'Vence hoy' },
];

const BLOCK_RULES = [
  { trigger: 'Mas de 60 dias en mora', impact: 'Suspende reservas y paz y salvo', exception: 'Acuerdo vigente firmado' },
  { trigger: 'Dos cuotas extraordinarias vencidas', impact: 'Escala a cobranza juridica', exception: 'Caso social aprobado' },
];

const NOTIFICATION_STEPS = [
  { day: 'Dia 1', channel: 'Push + email', copy: 'Recordatorio amigable previo a intereses' },
  { day: 'Dia 8', channel: 'Email + WhatsApp', copy: 'Incluye saldo, intereses y link de pago' },
  { day: 'Dia 20', channel: 'Carta PDF', copy: 'Escala a gestion directa de administracion' },
];

const CAMPAIGN_ROWS = [
  { campaign: 'Fondo ascensor torre B', target: '$15.000.000', collected: '$9.400.000', status: '63% recaudado' },
  { campaign: 'Iluminacion zonas comunes', target: '$8.500.000', collected: '$6.100.000', status: '72% recaudado' },
];

const NOTE_ROWS = [
  { type: 'Nota credito', unit: 'T1-302', concept: 'Descuento por pronto pago', amount: '$35.000', status: 'Aplicada' },
  { type: 'Nota debito', unit: 'T2-904', concept: 'Ajuste interes de mora', amount: '$18.000', status: 'Pendiente' },
];

const BANK_ROWS = [
  { bank: 'Bancolombia', connection: 'Webhook + recaudo PSE', lastSync: '2026-05-24 09:15', status: 'Activa' },
  { bank: 'Banco de Bogota', connection: 'Archivo MT940', lastSync: '2026-05-24 08:30', status: 'Con revision' },
];

const RISK_ROWS = [
  { unit: 'T2-904', score: '89/100', reason: 'Tres pagos tardios y promesa vencida', status: 'Alto riesgo' },
  { unit: 'T1-1104', score: '74/100', reason: 'Disminucion de recaudo y saldo creciente', status: 'Seguimiento' },
];

const getPaymentWorkspace = (
  featureId: PaymentFeatureId,
  props: FeatureActionProps,
): PaymentWorkspace => {
  const { accessLevel, roleId } = props;
  const capabilities = getFeatureCapabilities(accessLevel);
  const { payments, feeConfigs, collectionActions } = useAppStore.getState();
  const user = useAuthStore.getState().user;

  const visiblePayments =
    roleId === 'propietario' || roleId === 'arrendatario'
      ? payments.filter((payment) => payment.owner === user?.name || payment.unit === user?.unitId)
      : payments;

  const overduePayments = visiblePayments.filter((payment) => payment.status === 'overdue');
  const agreementPayments = visiblePayments.filter((payment) => payment.status === 'agreement');
  const totalOutstanding = visiblePayments.reduce((sum, payment) => sum + payment.balance, 0);
  const totalCollected = visiblePayments
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  switch (featureId) {
    // M04-01: Conciliacion automatica - cruza lotes bancarios contra pagos internos.
    case 'm04_auto_payment_reconciliation':
      return {
        title: 'Conciliacion automatica de pagos',
        summary: 'Cruza lotes bancarios, referencias y saldos pendientes antes de aplicar recaudo.',
        icon: ArrowLeftRight,
        metrics: [
          { label: 'Lotes pendientes', value: String(RECONCILIATION_BATCHES.length), helper: 'Por revisar hoy', tone: 'blue' },
          { label: 'Pagos conciliados', value: '$19.250.000', helper: 'Ultima corrida', tone: 'emerald' },
          { label: 'Diferencias', value: '1', helper: 'Requiere ajuste manual', tone: 'amber' },
          { label: 'Tiempo medio', value: '12 min', helper: 'Por corrida', tone: 'violet' },
        ],
        composer: {
          title: 'Lanzar nueva corrida',
          description: 'Carga lote, fuente bancaria y referencia operativa para conciliacion.',
          fields: [
            { label: 'Entidad', placeholder: 'Ej: Banco de Bogota', disabled: !capabilities.canEdit },
            { label: 'Canal', placeholder: 'Ej: PSE / recaudo QR', disabled: !capabilities.canEdit },
            { label: 'Fecha de corte', placeholder: 'Selecciona fecha', type: 'date', disabled: !capabilities.canEdit },
            { label: 'Observacion', placeholder: 'Notas de conciliacion', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Ejecutar conciliacion',
                onClick: () =>
                  toast({
                    title: 'Corrida iniciada',
                    description: 'El motor de conciliacion comenzo a cruzar referencias y saldos.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Tu perfil solo puede revisar el resultado de la conciliacion.',
        },
        sections: [
          {
            title: 'Lotes del dia',
            items: RECONCILIATION_BATCHES.map((batch) => ({
              title: batch.batch,
              subtitle: `${batch.source} | ${batch.total}`,
              detail: batch.mismatch,
              meta: ['Cruce con cartera vigente'],
              status: batch.mismatch === 'Sin novedades' ? 'Conciliado' : 'Con diferencia',
              tone: batch.mismatch === 'Sin novedades' ? 'emerald' : 'amber',
            })),
          },
        ],
      };

    // M04-02: Recaudo multicanal - concentra desempeno y activacion de canales de pago.
    case 'm04_multichannel_collection':
      return {
        title: 'Recaudo multicanal',
        summary: 'Administra performance y cobertura de los canales de pago disponibles para residentes.',
        icon: Layers3,
        metrics: [
          { label: 'Canales activos', value: String(CHANNEL_ROWS.length), helper: 'Con recaudo habilitado', tone: 'blue' },
          { label: 'Volumen mensual', value: '$37.800.000', helper: 'Consolidado total', tone: 'emerald' },
          { label: 'Canales en revision', value: '1', helper: 'Requieren soporte', tone: 'amber' },
          { label: 'Conversion', value: '82%', helper: 'Usuarios que completan pago', tone: 'violet' },
        ],
        composer: {
          title: 'Configurar canal',
          description: 'Activa o ajusta reglas del canal segun comision, horario y recaudo.',
          fields: [
            { label: 'Canal', placeholder: 'Ej: Link de pago', disabled: !capabilities.canEdit },
            { label: 'Comision', placeholder: 'Ej: 2.9%', disabled: !capabilities.canEdit },
            { label: 'Horario de disponibilidad', placeholder: 'Ej: 24/7', disabled: !capabilities.canEdit },
            { label: 'Observacion', placeholder: 'Soporte o contingencia', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar canal',
                onClick: () =>
                  toast({
                    title: 'Canal actualizado',
                    description: 'La configuracion del recaudo multicanal fue guardada.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Puedes revisar cobertura y volumen, pero no cambiar los canales.',
        },
        sections: [
          {
            title: 'Desempeno por canal',
            items: CHANNEL_ROWS.map((channel) => ({
              title: channel.channel,
              subtitle: `${channel.volume} | Participacion ${channel.share}`,
              detail: channel.status,
              meta: ['Seguimiento semanal'],
              status: 'Operativo',
              tone: 'blue',
            })),
          },
        ],
      };

    // M04-03: Acuerdos de pago - crea planes formales para deuda vencida.
    case 'm04_payment_agreements':
      return {
        title: 'Acuerdos de pago',
        summary: 'Estructura planes de normalizacion con cuotas, vigencias y control de cumplimiento.',
        icon: HandCoins,
        metrics: [
          { label: 'Acuerdos activos', value: String(AGREEMENT_ROWS.length), helper: 'Con cronograma vigente', tone: 'emerald' },
          { label: 'Saldo en acuerdo', value: '$3.730.000', helper: 'Cartera normalizada', tone: 'blue' },
          { label: 'Proxima cuota', value: '30 may', helper: 'Mayor vencimiento cercano', tone: 'amber' },
          { label: 'Riesgo de incumplir', value: '1', helper: 'Necesita llamada', tone: 'rose' },
        ],
        composer: {
          title: 'Nuevo acuerdo',
          description: 'Registra deuda, numero de cuotas y condiciones especiales del plan.',
          fields: [
            { label: 'Unidad', placeholder: 'Ej: T1-302', disabled: !capabilities.canCreate },
            { label: 'Saldo a normalizar', placeholder: 'Ej: 1250000', type: 'number', disabled: !capabilities.canCreate },
            { label: 'Numero de cuotas', placeholder: 'Ej: 3', type: 'number', disabled: !capabilities.canCreate },
            { label: 'Condicion especial', placeholder: 'Observaciones del plan', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Crear acuerdo',
                onClick: () =>
                  toast({
                    title: 'Acuerdo preparado',
                    description: 'El plan quedo listo para firma y notificacion al residente.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Solo puedes revisar los acuerdos vigentes.',
        },
        sections: [
          {
            title: 'Planes vigentes',
            items: AGREEMENT_ROWS.map((agreement) => ({
              title: `${agreement.unit} - ${agreement.owner}`,
              subtitle: `${agreement.debt} | ${agreement.plan}`,
              detail: `Proxima cuota ${agreement.nextInstallment}.`,
              meta: ['Documento firmado'],
              status: 'Activo',
              tone: 'emerald',
            })),
          },
        ],
      };

    // M04-04: Promesas de pago - da seguimiento a compromisos de corto plazo.
    case 'm04_payment_promises':
      return {
        title: 'Promesas de pago',
        summary: 'Controla compromisos puntuales y alerta al equipo cuando vence la fecha prometida.',
        icon: CalendarRange,
        metrics: [
          { label: 'Promesas activas', value: String(PROMISE_ROWS.length), helper: 'Por monitorear', tone: 'amber' },
          { label: 'Valor comprometido', value: '$830.000', helper: 'Pendiente de recaudo', tone: 'blue' },
          { label: 'Vencen hoy', value: '1', helper: 'Llamada sugerida', tone: 'rose' },
          { label: 'Cumplimiento', value: '67%', helper: 'Ultimo trimestre', tone: 'emerald' },
        ],
        composer: {
          title: 'Registrar promesa',
          description: 'Define fecha comprometida, valor y mensaje de seguimiento.',
          fields: [
            { label: 'Unidad', placeholder: 'Ej: T1-604', disabled: !capabilities.canCreate },
            { label: 'Monto', placeholder: 'Ej: 480000', type: 'number', disabled: !capabilities.canCreate },
            { label: 'Fecha prometida', placeholder: 'Selecciona fecha', type: 'date', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Detalle del compromiso', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Guardar promesa',
                onClick: () =>
                  toast({
                    title: 'Promesa registrada',
                    description: 'Se programo seguimiento para la fecha comprometida.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Tu perfil solo puede ver las promesas registradas.',
        },
        sections: [
          {
            title: 'Compromisos vigentes',
            items: PROMISE_ROWS.map((promise) => ({
              title: `${promise.unit} - ${promise.owner}`,
              subtitle: `${promise.amount} | ${promise.promisedFor}`,
              detail: promise.status,
              meta: ['Seguimiento automatico'],
              status: promise.status,
              tone: promise.status === 'Vence hoy' ? 'rose' : 'amber',
            })),
          },
        ],
      };

    // M04-05: Bloqueo por mora - activa restricciones operativas por incumplimiento.
    case 'm04_blocking_by_mora':
      return {
        title: 'Bloqueo por mora segun politicas',
        summary: 'Relaciona edad de cartera con restricciones operativas y escalamiento de cobranza.',
        icon: Scale,
        metrics: [
          { label: 'Reglas vigentes', value: String(BLOCK_RULES.length), helper: 'Politicas activas', tone: 'rose' },
          { label: 'Unidades afectadas', value: String(overduePayments.length), helper: 'Con saldo vencido', tone: 'amber' },
          { label: 'Excepciones activas', value: '1', helper: 'Acuerdo vigente', tone: 'blue' },
          { label: 'Revisiones legales', value: '2', helper: 'Con soporte juridico', tone: 'violet' },
        ],
        composer: {
          title: 'Nueva regla de mora',
          description: 'Define disparador, restriccion y criterio de excepcion.',
          fields: [
            { label: 'Disparador', placeholder: 'Ej: 60 dias en mora', disabled: !capabilities.canEdit },
            { label: 'Restriccion', placeholder: 'Ej: Suspender reservas', disabled: !capabilities.canEdit },
            { label: 'Excepcion', placeholder: 'Ej: Acuerdo firmado', disabled: !capabilities.canEdit },
            { label: 'Mensaje visible', placeholder: 'Texto para residente', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Activar regla',
                onClick: () =>
                  toast({
                    title: 'Regla activada',
                    description: 'La politica de mora quedo lista para el siguiente corte.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Puedes revisar restricciones, pero no modificarlas.',
        },
        sections: [
          {
            title: 'Politicas activas',
            items: BLOCK_RULES.map((rule) => ({
              title: rule.trigger,
              subtitle: rule.impact,
              detail: `Excepcion: ${rule.exception}.`,
              meta: ['Aplica sobre servicios y recaudo'],
              status: 'Vigente',
              tone: 'rose',
            })),
          },
        ],
      };

    // M04-06: Historial de cobranza - deja trazabilidad comercial y juridica.
    case 'm04_collection_history':
      return {
        title: 'Historial de gestion de cobranza',
        summary: 'Consolida recordatorios, cartas, acuerdos y escalamiento en una sola bandeja.',
        icon: FileClock,
        metrics: [
          { label: 'Gestiones registradas', value: String(collectionActions.length), helper: 'Historico visible', tone: 'blue' },
          { label: 'Recordatorios', value: String(collectionActions.filter((action) => action.type === 'reminder').length), helper: 'Seguimiento ligero', tone: 'amber' },
          { label: 'Acuerdos', value: String(collectionActions.filter((action) => action.type === 'agreement').length), helper: 'Normalizacion', tone: 'emerald' },
          { label: 'Casos legales', value: String(collectionActions.filter((action) => action.type === 'legal').length), helper: 'Escalados', tone: 'rose' },
        ],
        sections: [
          {
            title: 'Bitacora de cobranza',
            items: collectionActions.slice(0, 6).map((action) => ({
              title: `${action.unit} - ${action.owner}`,
              subtitle: `${action.type} | ${action.date}`,
              detail: action.description,
              meta: [action.aiGenerated ? 'Sugerida por IA' : 'Gestion humana'],
              status: action.scheduled ? 'Programada' : 'Ejecutada',
              tone: action.type === 'legal' ? 'rose' : action.type === 'agreement' ? 'emerald' : 'blue',
            })),
          },
        ],
        footerActions: [
          {
            label: 'Exportar bitacora',
            variant: 'outline',
            tone: 'slate',
            onClick: () =>
              toast({
                title: 'Bitacora exportada',
                description: 'Se genero el consolidado de cobranza visible para auditoria.',
              }),
          },
        ],
      };

    // M04-07: Cartera por antiguedad - distribuye saldo vencido por rangos de mora.
    case 'm04_aging_portfolio':
      return {
        title: 'Cartera por antiguedad',
        summary: 'Analiza la exposicion por rangos de vencimiento para priorizar acciones de recaudo.',
        icon: FileBarChart,
        metrics: [
          { label: 'Saldo visible', value: `$${totalOutstanding.toLocaleString()}`, helper: 'Pendiente total', tone: 'amber' },
          { label: 'Mayores a 90 dias', value: String(overduePayments.length), helper: 'Casos criticos', tone: 'rose' },
          { label: 'En acuerdo', value: String(agreementPayments.length), helper: 'Saldo normalizado', tone: 'blue' },
          { label: 'Cobertura', value: '4 buckets', helper: 'Rangos vigentes', tone: 'violet' },
        ],
        sections: [
          {
            title: 'Buckets de cartera',
            items: [
              { title: '0 a 30 dias', subtitle: '$1.420.000', detail: '11 facturas vigentes.', meta: ['Cobro preventivo'], status: 'Controlado', tone: 'emerald' },
              { title: '31 a 60 dias', subtitle: '$2.180.000', detail: '8 facturas en mora.', meta: ['Seguimiento comercial'], status: 'Atencion media', tone: 'amber' },
              { title: '61 a 90 dias', subtitle: '$1.960.000', detail: '5 facturas vencidas.', meta: ['Riesgo creciente'], status: 'Atencion alta', tone: 'rose' },
              { title: 'Mas de 90 dias', subtitle: '$3.410.000', detail: '4 unidades concentran el saldo.', meta: ['Prioridad juridica'], status: 'Critico', tone: 'rose' },
            ],
          },
        ],
      };

    // M04-08: Notificacion progresiva - programa mensajes segun dias de mora.
    case 'm04_progressive_mora_notification':
      return {
        title: 'Notificacion progresiva por mora',
        summary: 'Escalona mensajes, canales y tono segun la edad del saldo pendiente.',
        icon: BellRing,
        metrics: [
          { label: 'Etapas configuradas', value: String(NOTIFICATION_STEPS.length), helper: 'Secuencia activa', tone: 'blue' },
          { label: 'Avisos enviados', value: '41', helper: 'Ultimos 7 dias', tone: 'emerald' },
          { label: 'Apertura estimada', value: '76%', helper: 'Email y push', tone: 'violet' },
          { label: 'Casos escalados', value: '4', helper: 'Sin respuesta', tone: 'amber' },
        ],
        composer: {
          title: 'Agregar etapa',
          description: 'Define dia de mora, canal y mensaje base para la notificacion.',
          fields: [
            { label: 'Dia de mora', placeholder: 'Ej: Dia 15', disabled: !capabilities.canEdit },
            { label: 'Canal', placeholder: 'Ej: Email + WhatsApp', disabled: !capabilities.canEdit },
            { label: 'Asunto', placeholder: 'Asunto del recordatorio', disabled: !capabilities.canEdit },
            { label: 'Mensaje base', placeholder: 'Texto principal', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar etapa',
                onClick: () =>
                  toast({
                    title: 'Etapa guardada',
                    description: 'La secuencia de notificacion progresiva fue actualizada.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes revisar la secuencia actual de notificaciones.',
        },
        sections: [
          {
            title: 'Secuencia vigente',
            items: NOTIFICATION_STEPS.map((step) => ({
              title: step.day,
              subtitle: step.channel,
              detail: step.copy,
              meta: ['Plantilla institucional'],
              status: 'Programada',
              tone: 'blue',
            })),
          },
        ],
      };

    // M04-09: Simulador de refinanciacion - estima escenarios para normalizar cartera.
    case 'm04_refinancing_simulator':
      return {
        title: 'Simulador de refinanciacion',
        summary: 'Proyecta cuotas, intereses y plazos antes de ofrecer un nuevo acuerdo.',
        icon: NotebookPen,
        metrics: [
          { label: 'Escenario base', value: '$1.250.000', helper: 'Saldo analizado', tone: 'blue' },
          { label: 'Cuota sugerida', value: '$430.000', helper: 'Plan a 3 meses', tone: 'emerald' },
          { label: 'Interes proyectado', value: '$54.000', helper: 'Tasa actual', tone: 'amber' },
          { label: 'Ingreso recuperable', value: '91%', helper: 'Con cumplimiento esperado', tone: 'violet' },
        ],
        composer: {
          title: 'Simular plan',
          description: 'Completa saldo, tasa, plazo y abono inicial para obtener una propuesta.',
          fields: [
            { label: 'Saldo base', placeholder: 'Ej: 1250000', type: 'number', disabled: !capabilities.canEdit },
            { label: 'Abono inicial', placeholder: 'Ej: 250000', type: 'number', disabled: !capabilities.canEdit },
            { label: 'Meses del plan', placeholder: 'Ej: 3', type: 'number', disabled: !capabilities.canEdit },
            { label: 'Comentario', placeholder: 'Notas del escenario', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Simular escenario',
                onClick: () =>
                  toast({
                    title: 'Simulacion lista',
                    description: 'El escenario fue calculado y queda listo para presentarse al residente.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Tu acceso actual no permite recalcular escenarios.',
        },
        sections: [
          {
            title: 'Escenarios recomendados',
            items: [
              { title: 'Plan 3 cuotas', subtitle: '$430.000 por cuota', detail: 'Abono inicial $250.000 y tasa actual.', meta: ['Recuperacion acelerada'], status: 'Recomendado', tone: 'emerald' },
              { title: 'Plan 5 cuotas', subtitle: '$282.000 por cuota', detail: 'Reduce la barrera de entrada, pero extiende riesgo.', meta: ['Mayor plazo'], status: 'Alternativo', tone: 'amber' },
            ],
          },
        ],
      };

    // M04-10: Campanas de recaudo - organiza cobros extraordinarios por objetivo.
    case 'm04_campaign_collection':
      return {
        title: 'Recaudo extraordinario por campanas',
        summary: 'Gestiona objetivos, avance y comunicacion de cobros puntuales para proyectos especiales.',
        icon: BriefcaseBusiness,
        metrics: [
          { label: 'Campanas activas', value: String(CAMPAIGN_ROWS.length), helper: 'Proyectos con recaudo', tone: 'blue' },
          { label: 'Meta consolidada', value: '$23.500.000', helper: 'Objetivo acumulado', tone: 'violet' },
          { label: 'Recaudado', value: '$15.500.000', helper: 'Avance total', tone: 'emerald' },
          { label: 'Brecha', value: '$8.000.000', helper: 'Pendiente de cubrir', tone: 'amber' },
        ],
        composer: {
          title: 'Nueva campana',
          description: 'Define objetivo, fecha de corte y mensaje visible a residentes.',
          fields: [
            { label: 'Nombre de campana', placeholder: 'Ej: Fondo impermeabilizacion', disabled: !capabilities.canEdit },
            { label: 'Meta', placeholder: 'Ej: 15000000', type: 'number', disabled: !capabilities.canEdit },
            { label: 'Fecha de corte', placeholder: 'Selecciona fecha', type: 'date', disabled: !capabilities.canEdit },
            { label: 'Mensaje de lanzamiento', placeholder: 'Texto visible', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Crear campana',
                onClick: () =>
                  toast({
                    title: 'Campana creada',
                    description: 'El recaudo extraordinario quedo listo para comunicacion y seguimiento.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes revisar el avance de las campanas activas.',
        },
        sections: [
          {
            title: 'Campanas vigentes',
            items: CAMPAIGN_ROWS.map((campaign) => ({
              title: campaign.campaign,
              subtitle: `${campaign.collected} de ${campaign.target}`,
              detail: campaign.status,
              meta: ['Seguimiento semanal'],
              status: 'Activa',
              tone: 'violet',
            })),
          },
        ],
      };

    // M04-11: Pagos parciales - distribuye abonos y recalcula saldo restante.
    case 'm04_partial_payments':
      return {
        title: 'Pagos parciales',
        summary: 'Registra abonos sobre una cuota y conserva el saldo pendiente para siguiente recaudo.',
        icon: Blend,
        metrics: [
          { label: 'Pagos visibles', value: String(visiblePayments.length), helper: 'Documentos cargados', tone: 'blue' },
          { label: 'Con saldo parcial', value: String(visiblePayments.filter((payment) => payment.balance > 0 && payment.balance < payment.amount).length), helper: 'Abonos aplicados', tone: 'amber' },
          { label: 'Recaudado', value: `$${totalCollected.toLocaleString()}`, helper: 'Pagos cerrados', tone: 'emerald' },
          { label: 'Saldo pendiente', value: `$${totalOutstanding.toLocaleString()}`, helper: 'Por completar', tone: 'rose' },
        ],
        composer: {
          title: 'Registrar abono parcial',
          description: 'Aplica un monto sobre la cuota y conserva saldo para el proximo recaudo.',
          fields: [
            { label: 'Documento', placeholder: 'Ej: FAC-2026-041', disabled: !capabilities.canCreate },
            { label: 'Valor del abono', placeholder: 'Ej: 120000', type: 'number', disabled: !capabilities.canCreate },
            { label: 'Medio de pago', placeholder: 'Ej: PSE', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Notas del abono', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Aplicar abono',
                onClick: () =>
                  toast({
                    title: 'Abono listo',
                    description: 'El pago parcial quedo marcado para conciliacion y saldo restante.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Puedes ver saldo y abonos, pero no registrar nuevos movimientos.',
        },
        sections: [
          {
            title: 'Cuotas con abono',
            items: visiblePayments.slice(0, 5).map((payment) => ({
              title: `${payment.unit} - ${payment.concept}`,
              subtitle: `Monto ${payment.amount.toLocaleString()} | Saldo ${payment.balance.toLocaleString()}`,
              detail: payment.balance > 0 ? 'Cuota con saldo pendiente.' : 'Cuota completamente cubierta.',
              meta: [payment.status],
              status: payment.balance > 0 ? 'Parcial' : 'Pagado',
              tone: payment.balance > 0 ? 'amber' : 'emerald',
            })),
          },
        ],
      };

    // M04-12: Notas credito/debito - registra ajustes contables de cartera.
    case 'm04_credit_debit_notes':
      return {
        title: 'Notas credito / debito',
        summary: 'Controla descuentos, reversos y ajustes que afectan el saldo de una unidad.',
        icon: Receipt,
        metrics: [
          { label: 'Notas del periodo', value: String(NOTE_ROWS.length), helper: 'Ajustes registrados', tone: 'blue' },
          { label: 'Creditos', value: '$35.000', helper: 'A favor del residente', tone: 'emerald' },
          { label: 'Debitos', value: '$18.000', helper: 'Intereses y ajustes', tone: 'amber' },
          { label: 'Pendientes', value: '1', helper: 'Por aplicar', tone: 'rose' },
        ],
        composer: {
          title: 'Crear nota',
          description: 'Selecciona tipo, concepto y valor del ajuste para el residente.',
          fields: [
            { label: 'Tipo', placeholder: 'Credito o debito', disabled: !capabilities.canEdit },
            { label: 'Unidad', placeholder: 'Ej: T1-302', disabled: !capabilities.canEdit },
            { label: 'Valor', placeholder: 'Ej: 35000', type: 'number', disabled: !capabilities.canEdit },
            { label: 'Concepto', placeholder: 'Motivo del ajuste', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar nota',
                onClick: () =>
                  toast({
                    title: 'Nota guardada',
                    description: 'El ajuste quedo listo para aplicarse al saldo de la unidad.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Modo consulta activo para notas contables.',
        },
        sections: [
          {
            title: 'Ajustes recientes',
            items: NOTE_ROWS.map((note) => ({
              title: `${note.type} - ${note.unit}`,
              subtitle: `${note.amount} | ${note.concept}`,
              detail: note.status,
              meta: ['Impacta saldo visible'],
              status: note.status,
              tone: note.type === 'Nota credito' ? 'emerald' : 'amber',
            })),
          },
        ],
      };

    // M04-13: Integracion bancaria - monitorea conectores y sincronizacion financiera.
    case 'm04_bank_integration':
      return {
        title: 'Integracion bancaria',
        summary: 'Revisa conectores activos, ultima sincronizacion y alertas por entidad financiera.',
        icon: Landmark,
        metrics: [
          { label: 'Bancos conectados', value: String(BANK_ROWS.length), helper: 'Entidades enlazadas', tone: 'blue' },
          { label: 'Corridas OK', value: '7', helper: 'Ultimas 24h', tone: 'emerald' },
          { label: 'Con alerta', value: '1', helper: 'Requiere soporte', tone: 'amber' },
          { label: 'Disponibilidad', value: '99.1%', helper: 'Ultimo mes', tone: 'violet' },
        ],
        composer: {
          title: 'Nuevo conector',
          description: 'Registra banco, tipo de integracion y frecuencia de sincronizacion.',
          fields: [
            { label: 'Banco', placeholder: 'Ej: Davivienda', disabled: !capabilities.canEdit },
            { label: 'Tipo de conexion', placeholder: 'Webhook / archivo / API', disabled: !capabilities.canEdit },
            { label: 'Frecuencia', placeholder: 'Ej: Cada 30 min', disabled: !capabilities.canEdit },
            { label: 'Observacion', placeholder: 'Notas tecnicas', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar integracion',
                onClick: () =>
                  toast({
                    title: 'Integracion registrada',
                    description: 'El banco quedo listo para pruebas de sincronizacion.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Tu acceso actual solo permite ver estado de conectores.',
        },
        sections: [
          {
            title: 'Conectores vigentes',
            items: BANK_ROWS.map((bank) => ({
              title: bank.bank,
              subtitle: bank.connection,
              detail: `Ultima sincronizacion ${bank.lastSync}.`,
              meta: ['Monitor de recaudo'],
              status: bank.status,
              tone: bank.status === 'Activa' ? 'emerald' : 'amber',
            })),
          },
        ],
      };

    // M04-14: Tablero diario - resume recaudo del dia y brecha contra la meta.
    case 'm04_daily_collection_board':
      return {
        title: 'Tablero de recaudo diario',
        summary: 'Visualiza recaudo del dia, meta, brecha y documentos aun pendientes de confirmacion.',
        icon: Building2,
        metrics: [
          { label: 'Recaudado hoy', value: '$15.420.000', helper: 'Consolidado al corte', tone: 'emerald' },
          { label: 'Meta diaria', value: '$20.000.000', helper: 'Objetivo operativo', tone: 'blue' },
          { label: 'Pendiente por cerrar', value: '$4.580.000', helper: 'Brecha restante', tone: 'amber' },
          { label: 'Comprobantes pendientes', value: '5', helper: 'Falta confirmacion', tone: 'rose' },
        ],
        sections: [
          {
            title: 'Documentos del dia',
            items: visiblePayments.slice(0, 5).map((payment) => ({
              title: `${payment.unit} - ${payment.concept}`,
              subtitle: `Saldo ${payment.balance.toLocaleString()} | Vence ${payment.dueDate}`,
              detail: payment.status === 'paid' ? 'Pago confirmado y aplicado.' : 'Pendiente de recaudo o conciliacion.',
              meta: [payment.status],
              status: payment.status === 'paid' ? 'Cerrado' : 'Abierto',
              tone: payment.status === 'paid' ? 'emerald' : 'amber',
            })),
          },
        ],
        footerActions: [
          {
            label: 'Compartir corte',
            variant: 'outline',
            tone: 'slate',
            onClick: () =>
              toast({
                title: 'Corte compartido',
                description: 'El resumen diario quedo listo para administracion y consejo.',
              }),
          },
        ],
      };

    // M04-15: Alertas predictivas - destaca unidades con riesgo creciente de mora.
    case 'm04_predictive_mora_alerts':
      return {
        title: 'Alertas predictivas de morosidad',
        summary: 'Prioriza unidades con patrones de atraso, saldo creciente y baja probabilidad de pago.',
        icon: Radar,
        metrics: [
          { label: 'Alertas activas', value: String(RISK_ROWS.length), helper: 'Con score elevado', tone: 'rose' },
          { label: 'Riesgo promedio', value: '81/100', helper: 'Unidades monitoreadas', tone: 'amber' },
          { label: 'Planes sugeridos', value: '2', helper: 'Acuerdo o llamada', tone: 'blue' },
          { label: 'Casos recuperables', value: '1', helper: 'Alta probabilidad de normalizar', tone: 'emerald' },
        ],
        sections: [
          {
            title: 'Radar de riesgo',
            items: RISK_ROWS.map((row) => ({
              title: `${row.unit} - Score ${row.score}`,
              subtitle: row.reason,
              detail: row.status,
              meta: ['Modelo con historico de pagos'],
              status: row.status,
              tone: row.status === 'Alto riesgo' ? 'rose' : 'amber',
            })),
          },
          {
            title: 'Acciones sugeridas',
            items: [
              {
                title: 'Llamada prioritaria a T2-904',
                subtitle: 'Combinar promesa de pago y oferta de refinanciacion.',
                detail: 'El residente tiene alto riesgo, pero historial de recuperacion.',
                meta: ['Recomendacion IA'],
                status: 'Alta prioridad',
                tone: 'emerald',
              },
              {
                title: 'Enviar recordatorio reforzado a T1-1104',
                subtitle: 'Adjuntar detalle de intereses y link directo de pago.',
                detail: 'La probabilidad de normalizacion mejora con recaudo digital.',
                meta: ['Secuencia progresiva'],
                status: 'Seguimiento',
                tone: 'amber',
              },
            ],
          },
        ],
      };
  }
};

export const PaymentFeatureAction = (props: FeatureActionProps) => {
  const workspace = getPaymentWorkspace(props.featureId as PaymentFeatureId, props);

  return (
    <FeatureActionShell
      onClose={props.onClose}
      title={workspace.title}
      summary={workspace.summary}
      moduleCode={props.moduleCode}
      accessLevel={props.accessLevel}
      icon={workspace.icon}
      footer={workspace.footerActions ? <FeatureActionButtons actions={workspace.footerActions} /> : undefined}
    >
      <FeatureMetricGrid metrics={workspace.metrics} />

      <PaymentsFeatureWorkspace
        featureId={props.featureId as PaymentFeatureId}
        accessLevel={props.accessLevel}
        roleId={props.roleId}
      />

      {workspace.composer && (
        <FeatureFormCard
          title={workspace.composer.title}
          description={workspace.composer.description}
          fields={workspace.composer.fields}
          action={workspace.composer.action}
          disabledMessage={workspace.composer.disabledMessage}
        />
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {workspace.sections.map((section) => (
          <FeatureSectionCard
            key={section.title}
            title={section.title}
            description={section.description}
          >
            <FeatureItemList items={section.items} />
          </FeatureSectionCard>
        ))}
      </div>
    </FeatureActionShell>
  );
};
