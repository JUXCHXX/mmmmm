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
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import type { LucideIcon } from 'lucide-react';
import {
  AlarmClockCheck,
  BellElectric,
  Boxes,
  Camera,
  Clock3,
  IdCard,
  LayoutGrid,
  Package,
  PersonStanding,
  ShieldAlert,
  ShieldCheck,
  Siren,
  UserRoundCheck,
  UsersRound,
  Wrench,
} from 'lucide-react';

type SecurityFeatureId =
  | 'm09_digital_guard_log'
  | 'm09_security_shifts'
  | 'm09_packages_mail'
  | 'm09_delivery_control'
  | 'm09_frequent_visitors'
  | 'm09_blacklists_alerts'
  | 'm09_unit_blocks'
  | 'm09_validation_methods'
  | 'm09_real_time_alerts'
  | 'm09_contractor_windows'
  | 'm09_restricted_areas_access'
  | 'm09_hardware_integration'
  | 'm09_express_gate_panel'
  | 'm09_ingress_evidence'
  | 'm09_security_incident_tracking';

interface SecuritySection {
  title: string;
  description?: string;
  items: FeatureItem[];
}

interface SecurityWorkspace {
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
  sections: SecuritySection[];
  footerActions?: FeatureActionButton[];
}

const SHIFT_ROWS = [
  { guard: 'Pedro Ramirez', slot: '06:00 - 14:00', zone: 'Lobby y acceso peatonal', status: 'Activo' },
  { guard: 'Laura Salazar', slot: '14:00 - 22:00', zone: 'Parqueadero y torre B', status: 'Proximo turno' },
  { guard: 'Carlos Mena', slot: '22:00 - 06:00', zone: 'Ronda perimetral', status: 'Descanso' },
];

const PACKAGE_ROWS = [
  { recipient: 'Ana Garcia', unit: 'T1-302', carrier: 'Servientrega', status: 'Pendiente entrega' },
  { recipient: 'Julian Mora', unit: 'T2-904', carrier: 'Coordinadora', status: 'Entregado con firma' },
];

const DELIVERY_ROWS = [
  { service: 'Rappi', unit: 'T1-604', window: '19:00 - 19:20', status: 'Autorizado por residente' },
  { service: 'Farmatodo', unit: 'T2-401', window: '20:10 - 20:25', status: 'Pendiente de validar documento' },
];

const VISITOR_ROWS = [
  { person: 'Marcela Ruiz', unit: 'T1-302', frequency: '4 ingresos este mes', status: 'Lista blanca vigente' },
  { person: 'David Parra', unit: 'T2-1104', frequency: '2 ingresos este mes', status: 'Sin incidencias' },
];

const BLACKLIST_ROWS = [
  { subject: 'Pedro Gomez', type: 'Persona', reason: 'Reporte de agresion verbal', status: 'Bloqueo total' },
  { subject: 'AAA-111', type: 'Vehiculo', reason: 'Intento de ingreso no autorizado', status: 'Alerta a porteria' },
];

const UNIT_BLOCK_ROWS = [
  { unit: 'T2-904', reason: 'Mudanza sin paz y salvo', level: 'Suspension de visitantes', status: 'Activo' },
  { unit: 'T1-1104', reason: 'Reclamo de convivencia en revision', level: 'Validacion manual', status: 'Temporal' },
];

const ALERT_ROWS = [
  { title: 'Acceso no autorizado', place: 'Parqueadero piso 2', severity: 'Critica', status: 'En seguimiento' },
  { title: 'Puerta abierta por mas de 5 minutos', place: 'Lobby principal', severity: 'Media', status: 'Pendiente atencion' },
  { title: 'Movimiento en zona restringida', place: 'Cuarto electrico', severity: 'Alta', status: 'Atendida por porteria' },
];

const CONTRACTOR_ROWS = [
  { company: 'ServiFix', window: '2026-05-25 08:00 - 12:00', unit: 'Salon social', status: 'Con lista de tecnicos' },
  { company: 'Aires Modernos', window: '2026-05-25 14:00 - 17:00', unit: 'Torre B piso 11', status: 'Pendiente documento ARL' },
];

const RESTRICTED_AREA_ROWS = [
  { area: 'Cuarto electrico', access: 'Administrador + proveedor autorizado', status: 'Control por PIN y QR' },
  { area: 'Roof top tecnico', access: 'Porteria + mantenimiento', status: 'Bitacora obligatoria' },
];

const HARDWARE_ROWS = [
  { device: 'Camara Lobby 01', type: 'CCTV', sync: '2026-05-24 09:10', status: 'Online' },
  { device: 'Lector QR peatonal', type: 'Acceso', sync: '2026-05-24 09:12', status: 'Online' },
  { device: 'Cerradura cuarto electrico', type: 'IoT', sync: '2026-05-24 08:30', status: 'Revision requerida' },
];

const EVIDENCE_ROWS = [
  { record: 'ING-2205', person: 'Marcela Ruiz', capture: 'Foto frontal + QR', status: 'Evidencia completa' },
  { record: 'ING-2209', person: 'Proveedor ServiFix', capture: 'Documento + placa', status: 'Pendiente video corto' },
];

const INCIDENT_ROWS = [
  { code: 'INC-4401', title: 'Puerta de acceso no cerro', owner: 'Turno PM', status: 'En proceso' },
  { code: 'INC-4403', title: 'Vehiculo intento ingresar por salida', owner: 'Supervisor seguridad', status: 'Resuelto' },
];

const VALIDATION_ROWS = [
  { method: 'QR dinamico', usage: 'Visitantes y entregas programadas', status: 'Activo' },
  { method: 'Documento + selfie', usage: 'Contratistas y proveedores', status: 'Revision manual' },
  { method: 'PIN temporal', usage: 'Residentes sin conectividad', status: 'Contingencia' },
];

const getSecurityWorkspace = (
  featureId: SecurityFeatureId,
  props: FeatureActionProps,
): SecurityWorkspace => {
  const capabilities = getFeatureCapabilities(props.accessLevel);
  const { accessLogs } = useAppStore.getState();

  const latestAccesses = accessLogs.slice(0, 6);
  const authorizedCount = accessLogs.filter((entry) => entry.authorized).length;
  const deniedCount = accessLogs.filter((entry) => !entry.authorized).length;

  switch (featureId) {
    // M09-01: Bitacora digital - registra ingresos y salidas con evidencia y responsable.
    case 'm09_digital_guard_log':
      return {
        title: 'Bitacora digital de porteria',
        summary: 'Consulta y registra ingresos, salidas y novedades del turno en tiempo real.',
        icon: ShieldCheck,
        metrics: [
          { label: 'Eventos visibles', value: String(latestAccesses.length), helper: 'Ultimos registros', tone: 'blue' },
          { label: 'Autorizados', value: String(authorizedCount), helper: 'Flujo normal', tone: 'emerald' },
          { label: 'Denegados', value: String(deniedCount), helper: 'Alertas del turno', tone: 'rose' },
          { label: 'Bitacora activa', value: '24/7', helper: 'Operacion continua', tone: 'violet' },
        ],
        composer: {
          title: 'Nuevo registro',
          description: 'Captura nombre, destino, tipo de movimiento y observacion del turno.',
          fields: [
            { label: 'Persona o placa', placeholder: 'Ej: Carlos Mora / ABC123', disabled: !capabilities.canCreate },
            { label: 'Destino', placeholder: 'Ej: T1-302', disabled: !capabilities.canCreate },
            { label: 'Movimiento', placeholder: 'Ingreso / salida', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Novedad del turno', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Guardar registro',
                onClick: () =>
                  toast({
                    title: 'Bitacora actualizada',
                    description: 'El movimiento quedo guardado en el turno activo.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Tu perfil puede revisar la bitacora, pero no crear registros.',
        },
        sections: [
          {
            title: 'Actividad reciente',
            items: latestAccesses.map((entry) => ({
              title: `${entry.person} - ${entry.destination}`,
              subtitle: `${entry.date} | ${entry.time}`,
              detail: entry.document,
              meta: [entry.type, entry.vehicle ?? 'Sin vehiculo'],
              status: entry.authorized ? 'Autorizado' : 'Denegado',
              tone: entry.authorized ? 'emerald' : 'rose',
            })),
          },
        ],
      };

    // M09-02: Turnos de seguridad - organiza cuadrantes y responsables del dia.
    case 'm09_security_shifts':
      return {
        title: 'Turnos de seguridad',
        summary: 'Programa guardas, zonas y relevos para mantener cobertura operativa continua.',
        icon: Clock3,
        metrics: [
          { label: 'Turnos cargados', value: String(SHIFT_ROWS.length), helper: 'Dia actual', tone: 'blue' },
          { label: 'Guardas activos', value: '2', helper: 'En servicio ahora', tone: 'emerald' },
          { label: 'Relevos pendientes', value: '1', helper: 'Proxima franja', tone: 'amber' },
          { label: 'Cobertura', value: '100%', helper: 'Zonas criticas cubiertas', tone: 'violet' },
        ],
        composer: {
          title: 'Nuevo turno',
          description: 'Define guarda, franja, zona y observacion para el servicio.',
          fields: [
            { label: 'Guarda', placeholder: 'Ej: Pedro Ramirez', disabled: !capabilities.canEdit },
            { label: 'Franja', placeholder: 'Ej: 06:00 - 14:00', disabled: !capabilities.canEdit },
            { label: 'Zona', placeholder: 'Ej: Lobby principal', disabled: !capabilities.canEdit },
            { label: 'Observacion', placeholder: 'Notas del relevo', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar turno',
                onClick: () =>
                  toast({
                    title: 'Turno programado',
                    description: 'La grilla de seguridad quedo actualizada.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes consultar la programacion del personal.',
        },
        sections: [
          {
            title: 'Cobertura del dia',
            items: SHIFT_ROWS.map((row) => ({
              title: row.guard,
              subtitle: `${row.slot} | ${row.zone}`,
              detail: row.status,
              meta: ['Ronda y control de acceso'],
              status: row.status,
              tone: row.status === 'Activo' ? 'emerald' : row.status === 'Proximo turno' ? 'amber' : 'blue',
            })),
          },
        ],
      };

    // M09-03: Paquetes y correspondencia - controla recepcion y entrega con trazabilidad.
    case 'm09_packages_mail':
      return {
        title: 'Paquetes y correspondencia',
        summary: 'Registra recepcion, custodia y entrega de paquetes para cada unidad.',
        icon: Package,
        metrics: [
          { label: 'Pendientes', value: String(PACKAGE_ROWS.filter((row) => row.status !== 'Entregado con firma').length), helper: 'Por entregar', tone: 'amber' },
          { label: 'Entregados', value: '1', helper: 'Con firma registrada', tone: 'emerald' },
          { label: 'Transportadoras', value: '2', helper: 'Flujo actual', tone: 'blue' },
          { label: 'Tiempo medio', value: '5h', helper: 'Antes de entrega', tone: 'violet' },
        ],
        composer: {
          title: 'Registrar paquete',
          description: 'Captura destinatario, unidad, transportadora y comentario de recepcion.',
          fields: [
            { label: 'Destinatario', placeholder: 'Ej: Ana Garcia', disabled: !capabilities.canCreate },
            { label: 'Unidad', placeholder: 'Ej: T1-302', disabled: !capabilities.canCreate },
            { label: 'Transportadora', placeholder: 'Ej: Servientrega', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Tamano o condicion del paquete', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Guardar recepcion',
                onClick: () =>
                  toast({
                    title: 'Paquete registrado',
                    description: 'La recepcion quedo visible para residente y porteria.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Modo consulta activo para la correspondencia.',
        },
        sections: [
          {
            title: 'Control de recepcion',
            items: PACKAGE_ROWS.map((row) => ({
              title: `${row.recipient} - ${row.unit}`,
              subtitle: row.carrier,
              detail: row.status,
              meta: ['Entrega con trazabilidad'],
              status: row.status,
              tone: row.status === 'Entregado con firma' ? 'emerald' : 'amber',
            })),
          },
        ],
      };

    // M09-04: Control de domiciliarios - valida ventanas, autorizacion y observaciones del ingreso.
    case 'm09_delivery_control':
      return {
        title: 'Control de domiciliarios',
        summary: 'Administra ventanas de ingreso, autorizacion del residente y validacion documental.',
        icon: PersonStanding,
        metrics: [
          { label: 'Entregas activas', value: String(DELIVERY_ROWS.length), helper: 'Con ventana programada', tone: 'blue' },
          { label: 'Autorizadas', value: '1', helper: 'Con confirmacion del residente', tone: 'emerald' },
          { label: 'Pendientes', value: '1', helper: 'Falta validar documento', tone: 'amber' },
          { label: 'Incidentes', value: '0', helper: 'Turno actual', tone: 'violet' },
        ],
        composer: {
          title: 'Nuevo domiciliario',
          description: 'Registra operador, unidad destino, franja y observacion del ingreso.',
          fields: [
            { label: 'Servicio', placeholder: 'Ej: Rappi', disabled: !capabilities.canCreate },
            { label: 'Unidad', placeholder: 'Ej: T1-604', disabled: !capabilities.canCreate },
            { label: 'Ventana', placeholder: 'Ej: 19:00 - 19:20', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Documento o contacto del residente', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Registrar ingreso',
                onClick: () =>
                  toast({
                    title: 'Ingreso programado',
                    description: 'El domiciliario quedo registrado con su ventana de acceso.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Tu perfil solo puede revisar los ingresos programados.',
        },
        sections: [
          {
            title: 'Ventanas vigentes',
            items: DELIVERY_ROWS.map((row) => ({
              title: `${row.service} - ${row.unit}`,
              subtitle: row.window,
              detail: row.status,
              meta: ['Control de acceso temporal'],
              status: row.status.includes('Autorizado') ? 'Listo' : 'Pendiente',
              tone: row.status.includes('Autorizado') ? 'emerald' : 'amber',
            })),
          },
        ],
      };

    // M09-05: Visitantes frecuentes - conserva listas blancas y patrones de ingreso.
    case 'm09_frequent_visitors':
      return {
        title: 'Visitantes frecuentes',
        summary: 'Mantiene listas blancas con historial y validacion rapida por unidad.',
        icon: UsersRound,
        metrics: [
          { label: 'Visitantes registrados', value: String(VISITOR_ROWS.length), helper: 'Con historial validado', tone: 'blue' },
          { label: 'Lista blanca', value: '2', helper: 'Sin novedades', tone: 'emerald' },
          { label: 'Por renovar', value: '1', helper: 'Vence esta semana', tone: 'amber' },
          { label: 'Alertas', value: '0', helper: 'Sin incidencias', tone: 'violet' },
        ],
        composer: {
          title: 'Agregar visitante frecuente',
          description: 'Relaciona persona, unidad, vigencia y observaciones del permiso recurrente.',
          fields: [
            { label: 'Nombre', placeholder: 'Ej: Marcela Ruiz', disabled: !capabilities.canCreate },
            { label: 'Unidad', placeholder: 'Ej: T1-302', disabled: !capabilities.canCreate },
            { label: 'Vigencia', placeholder: 'Ej: 90 dias', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Condiciones del acceso', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Guardar visitante',
                onClick: () =>
                  toast({
                    title: 'Visitante frecuente registrado',
                    description: 'La lista blanca fue actualizada para consultas rapidas.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Modo consulta para lista blanca de visitantes.',
        },
        sections: [
          {
            title: 'Personas frecuentes',
            items: VISITOR_ROWS.map((row) => ({
              title: `${row.person} - ${row.unit}`,
              subtitle: row.frequency,
              detail: row.status,
              meta: ['Consulta en porteria'],
              status: 'Vigente',
              tone: 'emerald',
            })),
          },
        ],
      };

    // M09-06: Listas negras y alertas - centraliza bloqueos y avisos preventivos.
    case 'm09_blacklists_alerts':
      return {
        title: 'Listas negras o alertas',
        summary: 'Agrupa personas, vehiculos y condiciones que requieren bloqueo o monitoreo especial.',
        icon: ShieldAlert,
        metrics: [
          { label: 'Entradas bloqueadas', value: String(BLACKLIST_ROWS.length), helper: 'Personas y vehiculos', tone: 'rose' },
          { label: 'Alertas preventivas', value: '1', helper: 'Con aviso a porteria', tone: 'amber' },
          { label: 'Revisiones del mes', value: '2', helper: 'Auditoria de seguridad', tone: 'blue' },
          { label: 'Activas', value: '100%', helper: 'Sin caducidad vencida', tone: 'violet' },
        ],
        composer: {
          title: 'Nueva restriccion',
          description: 'Registra persona o vehiculo, motivo y nivel de accion esperado.',
          fields: [
            { label: 'Persona o placa', placeholder: 'Ej: AAA-111', disabled: !capabilities.canEdit },
            { label: 'Tipo', placeholder: 'Persona / vehiculo', disabled: !capabilities.canEdit },
            { label: 'Nivel', placeholder: 'Bloqueo / alerta / validacion manual', disabled: !capabilities.canEdit },
            { label: 'Motivo', placeholder: 'Descripcion del hallazgo', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar restriccion',
                onClick: () =>
                  toast({
                    title: 'Lista actualizada',
                    description: 'La nueva restriccion quedo publicada para porteria.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Tu perfil puede revisar alertas, pero no crear nuevas restricciones.',
        },
        sections: [
          {
            title: 'Alertas vigentes',
            items: BLACKLIST_ROWS.map((row) => ({
              title: `${row.type}: ${row.subject}`,
              subtitle: row.reason,
              detail: row.status,
              meta: ['Control de acceso reforzado'],
              status: 'Activo',
              tone: 'rose',
            })),
          },
        ],
      };

    // M09-07: Bloqueos por unidad - impone controles especiales sobre una propiedad.
    case 'm09_unit_blocks':
      return {
        title: 'Bloqueos por unidad',
        summary: 'Aplica restricciones temporales o completas a ingresos relacionados con una unidad.',
        icon: BellElectric,
        metrics: [
          { label: 'Unidades bloqueadas', value: String(UNIT_BLOCK_ROWS.length), helper: 'Con medida activa', tone: 'rose' },
          { label: 'Temporales', value: '1', helper: 'En revision administrativa', tone: 'amber' },
          { label: 'Con excepcion', value: '1', helper: 'Validacion manual', tone: 'blue' },
          { label: 'Auditoria', value: '2 eventos', helper: 'Ultima semana', tone: 'violet' },
        ],
        composer: {
          title: 'Nuevo bloqueo de unidad',
          description: 'Registra razon, alcance y condicion de levantamiento.',
          fields: [
            { label: 'Unidad', placeholder: 'Ej: T2-904', disabled: !capabilities.canEdit },
            { label: 'Nivel de restriccion', placeholder: 'Ej: Visitantes / mudanza / total', disabled: !capabilities.canEdit },
            { label: 'Fecha de revision', placeholder: 'Selecciona fecha', type: 'date', disabled: !capabilities.canEdit },
            { label: 'Motivo', placeholder: 'Detalle del bloqueo', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Aplicar bloqueo',
                onClick: () =>
                  toast({
                    title: 'Unidad bloqueada',
                    description: 'La restriccion ya esta visible para porteria y administracion.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes revisar unidades con control especial.',
        },
        sections: [
          {
            title: 'Restricciones vigentes',
            items: UNIT_BLOCK_ROWS.map((row) => ({
              title: row.unit,
              subtitle: row.reason,
              detail: row.level,
              meta: ['Levantamiento con autorizacion'],
              status: row.status,
              tone: 'rose',
            })),
          },
        ],
      };

    // M09-08: Validacion por QR, placa, documento o PIN - orquesta metodos de ingreso.
    case 'm09_validation_methods':
      return {
        title: 'Validacion por QR, placa, documento o PIN',
        summary: 'Consulta los metodos de autenticacion disponibles para cada tipo de ingreso.',
        icon: IdCard,
        metrics: [
          { label: 'Metodos activos', value: String(VALIDATION_ROWS.length), helper: 'Control de acceso', tone: 'blue' },
          { label: 'Uso de QR', value: '52%', helper: 'Metodo mas frecuente', tone: 'emerald' },
          { label: 'Validaciones manuales', value: '18%', helper: 'Casos especiales', tone: 'amber' },
          { label: 'Contingencia', value: 'PIN temporal', helper: 'Ultimo fallback', tone: 'violet' },
        ],
        sections: [
          {
            title: 'Catalogo de validacion',
            items: VALIDATION_ROWS.map((row) => ({
              title: row.method,
              subtitle: row.usage,
              detail: row.status,
              meta: ['Integrado al acceso principal'],
              status: 'Disponible',
              tone: 'blue',
            })),
          },
        ],
      };

    // M09-09: Alertas en tiempo real - concentra disparos y acciones inmediatas.
    case 'm09_real_time_alerts':
      return {
        title: 'Alertas en tiempo real',
        summary: 'Monitorea incidentes de seguridad y define acciones inmediatas por severidad.',
        icon: Siren,
        metrics: [
          { label: 'Alertas activas', value: String(ALERT_ROWS.length), helper: 'Centro de control', tone: 'rose' },
          { label: 'Criticas', value: '1', helper: 'Respuesta inmediata', tone: 'rose' },
          { label: 'Atendidas', value: '1', helper: 'Turno actual', tone: 'emerald' },
          { label: 'Pendientes', value: '1', helper: 'Sin confirmar cierre', tone: 'amber' },
        ],
        sections: [
          {
            title: 'Feed operativo',
            items: ALERT_ROWS.map((row) => ({
              title: row.title,
              subtitle: `${row.place} | ${row.severity}`,
              detail: row.status,
              meta: ['Escalonamiento automatico'],
              status: row.severity,
              tone: row.severity === 'Critica' || row.severity === 'Alta' ? 'rose' : 'amber',
            })),
          },
        ],
        footerActions: capabilities.canEdit
          ? [
              {
                label: 'Cerrar alerta seleccionada',
                onClick: () =>
                  toast({
                    title: 'Alerta atendida',
                    description: 'El centro de control marco la alerta como resuelta.',
                  }),
              },
            ]
          : undefined,
      };

    // M09-10: Ventanas para contratistas - controla ingreso de terceros con tiempo limitado.
    case 'm09_contractor_windows':
      return {
        title: 'Ingresos de contratistas con ventanas horarias',
        summary: 'Autoriza terceros por empresa, franja y documentos obligatorios.',
        icon: UserRoundCheck,
        metrics: [
          { label: 'Ventanas activas', value: String(CONTRACTOR_ROWS.length), helper: 'Con ingreso programado', tone: 'blue' },
          { label: 'Con documentos completos', value: '1', helper: 'Listos para ingreso', tone: 'emerald' },
          { label: 'Pendientes de soporte', value: '1', helper: 'Falta ARL o cedula', tone: 'amber' },
          { label: 'Cierres automaticos', value: '2', helper: 'Al terminar la ventana', tone: 'violet' },
        ],
        composer: {
          title: 'Nueva ventana',
          description: 'Define empresa, destino, franja y documentos que habilitan el ingreso.',
          fields: [
            { label: 'Empresa', placeholder: 'Ej: ServiFix', disabled: !capabilities.canCreate },
            { label: 'Destino', placeholder: 'Ej: Salon social', disabled: !capabilities.canCreate },
            { label: 'Franja', placeholder: 'Ej: 08:00 - 12:00', disabled: !capabilities.canCreate },
            { label: 'Soportes requeridos', placeholder: 'ARL, cedula, lista de tecnicos', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Programar ventana',
                onClick: () =>
                  toast({
                    title: 'Ventana creada',
                    description: 'El contratista quedo habilitado dentro del rango programado.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Solo puedes consultar los ingresos ya programados.',
        },
        sections: [
          {
            title: 'Contratistas autorizados',
            items: CONTRACTOR_ROWS.map((row) => ({
              title: row.company,
              subtitle: `${row.window} | ${row.unit}`,
              detail: row.status,
              meta: ['Control documental'],
              status: row.status.includes('Pendiente') ? 'Incompleto' : 'Listo',
              tone: row.status.includes('Pendiente') ? 'amber' : 'emerald',
            })),
          },
        ],
      };

    // M09-11: Acceso a zonas restringidas - define permisos especiales y bitacora reforzada.
    case 'm09_restricted_areas_access':
      return {
        title: 'Control de acceso a zonas restringidas',
        summary: 'Resguarda areas tecnicas o sensibles con reglas y bitacora de ingreso especial.',
        icon: AlarmClockCheck,
        metrics: [
          { label: 'Zonas con control', value: String(RESTRICTED_AREA_ROWS.length), helper: 'Acceso especial', tone: 'blue' },
          { label: 'Con doble factor', value: '1', helper: 'PIN y QR', tone: 'emerald' },
          { label: 'Ingresos del mes', value: '6', helper: 'Todos auditados', tone: 'amber' },
          { label: 'Incidentes', value: '0', helper: 'Sin violaciones', tone: 'violet' },
        ],
        composer: {
          title: 'Nueva autorizacion',
          description: 'Relaciona area, perfil autorizado y duracion del permiso especial.',
          fields: [
            { label: 'Area', placeholder: 'Ej: Cuarto electrico', disabled: !capabilities.canEdit },
            { label: 'Perfil o persona', placeholder: 'Ej: Proveedor ServiFix', disabled: !capabilities.canEdit },
            { label: 'Duracion', placeholder: 'Ej: 4 horas', disabled: !capabilities.canEdit },
            { label: 'Motivo', placeholder: 'Trabajo o visita tecnica', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar permiso',
                onClick: () =>
                  toast({
                    title: 'Permiso especial creado',
                    description: 'El acceso restringido quedo con trazabilidad reforzada.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Puedes revisar permisos activos, pero no editarlos.',
        },
        sections: [
          {
            title: 'Mapa de permisos',
            items: RESTRICTED_AREA_ROWS.map((row) => ({
              title: row.area,
              subtitle: row.access,
              detail: row.status,
              meta: ['Bitacora obligatoria'],
              status: 'Protegido',
              tone: 'blue',
            })),
          },
        ],
      };

    // M09-12: Integracion con hardware - monitorea estado de dispositivos y sincronizacion.
    case 'm09_hardware_integration':
      return {
        title: 'Integracion con hardware',
        summary: 'Revisa el estado de camaras, lectores y cerraduras conectadas al ecosistema de seguridad.',
        icon: Wrench,
        metrics: [
          { label: 'Dispositivos', value: String(HARDWARE_ROWS.length), helper: 'Conectados al modulo', tone: 'blue' },
          { label: 'Online', value: String(HARDWARE_ROWS.filter((row) => row.status === 'Online').length), helper: 'Sincronizados', tone: 'emerald' },
          { label: 'Con revision', value: String(HARDWARE_ROWS.filter((row) => row.status !== 'Online').length), helper: 'Soporte requerido', tone: 'amber' },
          { label: 'Ultima caida', value: '08:30', helper: 'Cerradura IoT', tone: 'violet' },
        ],
        composer: {
          title: 'Registrar dispositivo',
          description: 'Asocia nombre, tipo, ultima revision y observaciones del equipo.',
          fields: [
            { label: 'Dispositivo', placeholder: 'Ej: Camara Lobby 03', disabled: !capabilities.canEdit },
            { label: 'Tipo', placeholder: 'Ej: CCTV / acceso / IoT', disabled: !capabilities.canEdit },
            { label: 'Ultima revision', placeholder: 'Selecciona fecha', type: 'date', disabled: !capabilities.canEdit },
            { label: 'Observacion', placeholder: 'Novedad tecnica', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar dispositivo',
                onClick: () =>
                  toast({
                    title: 'Inventario actualizado',
                    description: 'El hardware quedo registrado para monitoreo del modulo.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Modo consulta activo para dispositivos del ecosistema.',
        },
        sections: [
          {
            title: 'Estado del parque instalado',
            items: HARDWARE_ROWS.map((row) => ({
              title: row.device,
              subtitle: `${row.type} | Ultima sync ${row.sync}`,
              detail: row.status,
              meta: ['Monitor tecnico'],
              status: row.status,
              tone: row.status === 'Online' ? 'emerald' : 'amber',
            })),
          },
        ],
      };

    // M09-13: Panel express - concentra comandos rapidos de porteria.
    case 'm09_express_gate_panel':
      return {
        title: 'Panel express para porteria',
        summary: 'Entrega accesos rapidos para movimientos recurrentes del turno sin salir del flujo operativo.',
        icon: LayoutGrid,
        metrics: [
          { label: 'Comandos visibles', value: '6', helper: 'Flujos rapidos del turno', tone: 'blue' },
          { label: 'Mas usado', value: 'Registrar ingreso', helper: 'Turno actual', tone: 'emerald' },
          { label: 'Atajos en alerta', value: '1', helper: 'Bloqueo inmediato', tone: 'rose' },
          { label: 'Tiempo ahorrado', value: '35%', helper: 'Vs registro manual', tone: 'violet' },
        ],
        sections: [
          {
            title: 'Acciones rapidas',
            items: [
              { title: 'Registrar ingreso', subtitle: 'Visita o residente', detail: 'Genera evento de acceso en un paso.', meta: ['Atajo principal'], status: 'Disponible', tone: 'emerald' },
              { title: 'Registrar salida', subtitle: 'Cierre de visita', detail: 'Marca fin de permanencia y libera cupo.', meta: ['Atajo del turno'], status: 'Disponible', tone: 'blue' },
              { title: 'Activar alerta', subtitle: 'Incidente o novedad', detail: 'Eleva la alarma a seguridad y administracion.', meta: ['Respuesta inmediata'], status: 'Critico', tone: 'rose' },
            ],
          },
        ],
        footerActions: capabilities.canCreate
          ? [
              {
                label: 'Lanzar accion rapida',
                onClick: () =>
                  toast({
                    title: 'Accion express ejecutada',
                    description: 'El panel rapido disparo la accion seleccionada.',
                  }),
              },
            ]
          : undefined,
      };

    // M09-14: Evidencias de ingreso - conserva soporte visual y documental del acceso.
    case 'm09_ingress_evidence':
      return {
        title: 'Evidencias de ingreso',
        summary: 'Consulta soportes visuales y documentales asociados a cada registro de acceso.',
        icon: Camera,
        metrics: [
          { label: 'Registros con evidencia', value: String(EVIDENCE_ROWS.length), helper: 'Con soporte adjunto', tone: 'blue' },
          { label: 'Pendientes', value: '1', helper: 'Falta video corto', tone: 'amber' },
          { label: 'Completos', value: '1', helper: 'Foto y validacion cerrada', tone: 'emerald' },
          { label: 'Retencion', value: '30 dias', helper: 'Politica actual', tone: 'violet' },
        ],
        composer: {
          title: 'Nueva evidencia',
          description: 'Relaciona numero de ingreso, tipo de captura y observacion operativa.',
          fields: [
            { label: 'Registro', placeholder: 'Ej: ING-2205', disabled: !capabilities.canCreate },
            { label: 'Tipo de soporte', placeholder: 'Foto / video / documento', disabled: !capabilities.canCreate },
            { label: 'Responsable', placeholder: 'Ej: Turno PM', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Detalle de la captura', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Guardar evidencia',
                onClick: () =>
                  toast({
                    title: 'Evidencia guardada',
                    description: 'El soporte quedo asociado al evento de ingreso.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Tu perfil puede ver evidencia, pero no cargar nuevas capturas.',
        },
        sections: [
          {
            title: 'Soportes recientes',
            items: EVIDENCE_ROWS.map((row) => ({
              title: `${row.record} - ${row.person}`,
              subtitle: row.capture,
              detail: row.status,
              meta: ['Trazabilidad del acceso'],
              status: row.status,
              tone: row.status.includes('Pendiente') ? 'amber' : 'emerald',
            })),
          },
        ],
      };

    // M09-15: Seguimiento de incidentes - da continuidad a novedades de seguridad.
    case 'm09_security_incident_tracking':
      return {
        title: 'Seguimiento de incidentes de seguridad',
        summary: 'Conserva responsables, estado y acciones correctivas de cada incidente reportado.',
        icon: Siren,
        metrics: [
          { label: 'Incidentes visibles', value: String(INCIDENT_ROWS.length), helper: 'Con trazabilidad activa', tone: 'blue' },
          { label: 'En proceso', value: String(INCIDENT_ROWS.filter((row) => row.status === 'En proceso').length), helper: 'Pendientes de cierre', tone: 'amber' },
          { label: 'Resueltos', value: String(INCIDENT_ROWS.filter((row) => row.status === 'Resuelto').length), helper: 'Con accion correctiva', tone: 'emerald' },
          { label: 'Escalados', value: '1', helper: 'Con supervisor de turno', tone: 'rose' },
        ],
        composer: {
          title: 'Nuevo incidente',
          description: 'Documenta codigo, responsable y plan de accion para seguimiento.',
          fields: [
            { label: 'Codigo', placeholder: 'Ej: INC-4407', disabled: !capabilities.canCreate },
            { label: 'Responsable', placeholder: 'Ej: Supervisor seguridad', disabled: !capabilities.canCreate },
            { label: 'Estado inicial', placeholder: 'Ej: En proceso', disabled: !capabilities.canCreate },
            { label: 'Plan de accion', placeholder: 'Detalle del incidente', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Registrar incidente',
                onClick: () =>
                  toast({
                    title: 'Incidente registrado',
                    description: 'La novedad quedo disponible para seguimiento de seguridad.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Modo consulta activo para incidentes del modulo.',
        },
        sections: [
          {
            title: 'Casos abiertos y cerrados',
            items: INCIDENT_ROWS.map((row) => ({
              title: `${row.code} - ${row.title}`,
              subtitle: row.owner,
              detail: row.status,
              meta: ['Seguimiento operativo'],
              status: row.status,
              tone: row.status === 'Resuelto' ? 'emerald' : 'amber',
            })),
          },
        ],
      };
  }
};

export const SecurityFeatureAction = (props: FeatureActionProps) => {
  const workspace = getSecurityWorkspace(props.featureId as SecurityFeatureId, props);

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
