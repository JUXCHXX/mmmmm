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
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  Boxes,
  Clock3,
  GitBranch,
  GitPullRequestArrow,
  Layers3,
  LifeBuoy,
  MessageSquareQuote,
  MessagesSquare,
  NotebookTabs,
  Shield,
  Smile,
  Split,
  Timer,
} from 'lucide-react';

type PQRSFeatureId =
  | 'm07_trays_by_responsible'
  | 'm07_configurable_slas'
  | 'm07_due_dates_semaphores'
  | 'm07_escalation_rules'
  | 'm07_auto_classification'
  | 'm07_suggested_responses'
  | 'm07_post_close_satisfaction'
  | 'm07_case_reopening'
  | 'm07_full_traceability'
  | 'm07_internal_external_tickets'
  | 'm07_linking_to_entities'
  | 'm07_recurrence_indicators'
  | 'm07_committee_parallel_flow'
  | 'm07_controlled_anonymity';

interface PQRSSection {
  title: string;
  description?: string;
  items: FeatureItem[];
}

interface PQRSWorkspace {
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
  sections: PQRSSection[];
  footerActions?: FeatureActionButton[];
}

const SLA_ROWS = [
  { category: 'Queja convivencia', target: '48 horas', warning: '36 horas', owner: 'Coordinacion operativa' },
  { category: 'Reclamo facturacion', target: '72 horas', warning: '48 horas', owner: 'Cartera' },
  { category: 'Peticion mantenimiento', target: '24 horas', warning: '12 horas', owner: 'Mantenimiento' },
];

const ESCALATION_ROWS = [
  { rule: 'Escalar a jefe si vence el SLA sin respuesta', destination: 'Gerencia operativa', trigger: 'Sin comentario interno en 24h' },
  { rule: 'Enviar a comite si hay reincidencia', destination: 'Consejo / convivencia', trigger: '3 casos similares en 60 dias' },
];

const RESPONSE_LIBRARY = [
  { title: 'Confirmacion de recepcion', audience: 'Todos los residentes', usage: 'Plantilla base' },
  { title: 'Solicitud de evidencia adicional', audience: 'Quejas y reclamos', usage: 'Interaccion intermedia' },
  { title: 'Cierre con validacion de solucion', audience: 'Casos resueltos', usage: 'Encuesta y cierre' },
];

const INTERNAL_EXTERNAL_ROWS = [
  { lane: 'Externo', count: '18 casos', detail: 'Residentes y propietarios' },
  { lane: 'Interno', count: '7 casos', detail: 'Operaciones y administracion' },
  { lane: 'Proveedor', count: '3 casos', detail: 'Incumplimientos de servicio' },
];

const ENTITY_LINK_ROWS = [
  { entity: 'Unidad T1-302', relation: '4 PQRS abiertas', status: 'Con foco en ruido' },
  { entity: 'Residente Ana Garcia', relation: '2 interacciones recientes', status: 'Sin reincidencia' },
  { entity: 'Proveedor ServiFix', relation: '1 ticket interno', status: 'Esperando respuesta' },
];

const RECURRENCE_ROWS = [
  { topic: 'Ruido en terraza', repeats: '5 casos', trend: 'Subio 40% en dos semanas' },
  { topic: 'Parqueadero visitante', repeats: '3 casos', trend: 'Se mantiene estable' },
  { topic: 'Cobro extraordinario', repeats: '4 casos', trend: 'Bajo 10% tras comunicado' },
];

const COMMITTEE_ROWS = [
  { caseId: 'PQRS-2201', subject: 'Convivencia por ruido recurrente', status: 'En agenda de comite', owner: 'Consejo' },
  { caseId: 'PQRS-2208', subject: 'Uso indebido de zonas comunes', status: 'Pendiente concepto juridico', owner: 'Administracion' },
];

const ANONYMITY_ROWS = [
  { reportType: 'Convivencia sensible', visibility: 'Solo administracion y consejo', status: 'Anonimo controlado' },
  { reportType: 'Seguridad interna', visibility: 'Administrador y auditoria', status: 'Identidad reservada' },
];

const getPQRSWorkspace = (
  featureId: PQRSFeatureId,
  props: FeatureActionProps,
): PQRSWorkspace => {
  const { accessLevel, roleId } = props;
  const capabilities = getFeatureCapabilities(accessLevel);
  const { pqrs } = useAppStore.getState();
  const user = useAuthStore.getState().user;

  const visibleCases =
    roleId === 'propietario' || roleId === 'arrendatario'
      ? pqrs.filter((item) => item.resident === user?.name)
      : pqrs;

  const escalatedCases = visibleCases.filter((item) => item.status === 'escalated');
  const resolvedCases = visibleCases.filter(
    (item) => item.status === 'resolved' || item.status === 'closed',
  );

  switch (featureId) {
    // M07-01: Bandejas por responsable - organiza casos segun asignacion operativa.
    case 'm07_trays_by_responsible':
      return {
        title: 'Bandejas por responsable',
        summary: 'Consulta cargas de trabajo, prioridades y vencimientos por responsable operativo.',
        icon: Layers3,
        metrics: [
          { label: 'Casos visibles', value: String(visibleCases.length), helper: 'Segun perfil activo', tone: 'blue' },
          { label: 'Asignados', value: String(visibleCases.filter((item) => item.assignedTo).length), helper: 'Con propietario claro', tone: 'emerald' },
          { label: 'Sin asignar', value: String(visibleCases.filter((item) => !item.assignedTo).length), helper: 'Requieren triage', tone: 'amber' },
          { label: 'Escalados', value: String(escalatedCases.length), helper: 'Prioridad alta', tone: 'rose' },
        ],
        composer: {
          title: 'Nueva asignacion',
          description: 'Define responsable, prioridad y comentario interno para el caso.',
          fields: [
            { label: 'Ticket', placeholder: 'Ej: PQRS-2201', disabled: !capabilities.canEdit },
            { label: 'Responsable', placeholder: 'Ej: Coordinacion mantenimiento', disabled: !capabilities.canEdit },
            { label: 'Prioridad', placeholder: 'Baja / Media / Alta / Urgente', disabled: !capabilities.canEdit },
            { label: 'Nota interna', placeholder: 'Criterio de asignacion', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Asignar bandeja',
                onClick: () =>
                  toast({
                    title: 'Asignacion preparada',
                    description: 'La bandeja recibio el nuevo responsable y prioridad.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Tu perfil solo puede consultar la asignacion actual.',
        },
        sections: [
          {
            title: 'Carga operativa',
            items: visibleCases.slice(0, 6).map((item) => ({
              title: `${item.ticket} - ${item.subject}`,
              subtitle: item.assignedTo ?? 'Sin asignar',
              detail: `${item.priority} | ${item.status}`,
              meta: [`Unidad ${item.unit}`, item.date],
              status: item.assignedTo ? 'Asignado' : 'Pendiente',
              tone: item.assignedTo ? 'blue' : 'amber',
            })),
          },
        ],
      };

    // M07-02: SLAs configurables - define tiempos y responsables por categoria.
    case 'm07_configurable_slas':
      return {
        title: 'SLAs configurables por categoria',
        summary: 'Configura objetivos de atencion, semaforos y responsables de cumplimiento.',
        icon: Timer,
        metrics: [
          { label: 'Categorias cubiertas', value: String(SLA_ROWS.length), helper: 'Con SLA activo', tone: 'blue' },
          { label: 'Cumplimiento actual', value: '84%', helper: 'Ultimos 30 dias', tone: 'emerald' },
          { label: 'En riesgo', value: '3', helper: 'Muy cerca del umbral', tone: 'amber' },
          { label: 'Escalados por SLA', value: '2', helper: 'Mes actual', tone: 'rose' },
        ],
        composer: {
          title: 'Nuevo SLA',
          description: 'Relaciona categoria, tiempo objetivo, umbral y equipo responsable.',
          fields: [
            { label: 'Categoria', placeholder: 'Ej: Queja convivencia', disabled: !capabilities.canEdit },
            { label: 'Tiempo objetivo', placeholder: 'Ej: 48 horas', disabled: !capabilities.canEdit },
            { label: 'Alerta temprana', placeholder: 'Ej: 36 horas', disabled: !capabilities.canEdit },
            { label: 'Responsable', placeholder: 'Area o usuario', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar SLA',
                onClick: () =>
                  toast({
                    title: 'SLA actualizado',
                    description: 'La categoria quedo vinculada al nuevo objetivo de respuesta.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes revisar objetivos y semaforos.',
        },
        sections: [
          {
            title: 'Matriz vigente',
            items: SLA_ROWS.map((row) => ({
              title: row.category,
              subtitle: `${row.target} | alerta ${row.warning}`,
              detail: row.owner,
              meta: ['Aplica a la cola principal'],
              status: 'Configurado',
              tone: 'blue',
            })),
          },
        ],
      };

    // M07-03: Vencimientos y semaforos - destaca casos proximos a incumplir.
    case 'm07_due_dates_semaphores':
      return {
        title: 'Vencimientos y semaforos',
        summary: 'Prioriza tickets cercanos al vencimiento con una lectura rapida por color.',
        icon: Clock3,
        metrics: [
          { label: 'Casos en verde', value: String(visibleCases.filter((item) => item.status === 'received').length), helper: 'Inicio de ciclo', tone: 'emerald' },
          { label: 'Casos en amarillo', value: String(visibleCases.filter((item) => item.status === 'in_progress').length), helper: 'Seguimiento activo', tone: 'amber' },
          { label: 'Casos en rojo', value: String(escalatedCases.length), helper: 'Requieren reaccion', tone: 'rose' },
          { label: 'Tiempo medio', value: '3.2 dias', helper: 'Respuesta promedio', tone: 'blue' },
        ],
        sections: [
          {
            title: 'Vista por semaforo',
            items: visibleCases.slice(0, 6).map((item) => ({
              title: `${item.ticket} - ${item.subject}`,
              subtitle: `${item.priority} | ${item.status}`,
              detail: item.description,
              meta: [`Unidad ${item.unit}`],
              status:
                item.status === 'escalated'
                  ? 'Rojo'
                  : item.status === 'in_progress'
                  ? 'Amarillo'
                  : 'Verde',
              tone:
                item.status === 'escalated'
                  ? 'rose'
                  : item.status === 'in_progress'
                  ? 'amber'
                  : 'emerald',
            })),
          },
        ],
      };

    // M07-04: Reglas de escalamiento - mueve casos a nuevos niveles de atencion.
    case 'm07_escalation_rules':
      return {
        title: 'Reglas de escalamiento',
        summary: 'Automatiza el cambio de responsable o nivel de atencion cuando un caso se degrada.',
        icon: GitBranch,
        metrics: [
          { label: 'Reglas activas', value: String(ESCALATION_ROWS.length), helper: 'Motor de escalamiento', tone: 'violet' },
          { label: 'Escalamientos del mes', value: String(escalatedCases.length), helper: 'Tickets promovidos', tone: 'rose' },
          { label: 'Resueltos tras escalar', value: '3', helper: 'Mejora operativa', tone: 'emerald' },
          { label: 'Sin regla', value: '1', helper: 'Caso manual', tone: 'amber' },
        ],
        composer: {
          title: 'Nueva regla',
          description: 'Define gatillo, destino y mensaje interno del escalamiento.',
          fields: [
            { label: 'Disparador', placeholder: 'Ej: SLA vencido', disabled: !capabilities.canEdit },
            { label: 'Destino', placeholder: 'Ej: Gerencia operativa', disabled: !capabilities.canEdit },
            { label: 'Categoria', placeholder: 'Ej: Convivencia', disabled: !capabilities.canEdit },
            { label: 'Nota interna', placeholder: 'Detalle del cambio', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar regla',
                onClick: () =>
                  toast({
                    title: 'Regla lista',
                    description: 'El flujo ya puede escalar casos con el nuevo criterio.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Modo consulta activo para reglas de escalamiento.',
        },
        sections: [
          {
            title: 'Motor actual',
            items: ESCALATION_ROWS.map((row) => ({
              title: row.rule,
              subtitle: row.destination,
              detail: row.trigger,
              meta: ['Aplica sobre tickets priorizados'],
              status: 'Activo',
              tone: 'violet',
            })),
          },
        ],
      };

    // M07-05: Clasificacion automatica - sugiere categoria, prioridad y area.
    case 'm07_auto_classification':
      return {
        title: 'Clasificacion automatica',
        summary: 'Sugiere categoria, prioridad y equipo destino a partir del texto del ticket.',
        icon: Bot,
        metrics: [
          { label: 'Sugerencias generadas', value: '24', helper: 'Ultimos 7 dias', tone: 'blue' },
          { label: 'Aceptacion', value: '79%', helper: 'Operadores confirman la sugerencia', tone: 'emerald' },
          { label: 'Casos manuales', value: '5', helper: 'Sin confianza suficiente', tone: 'amber' },
          { label: 'Desvios', value: '2', helper: 'Ajustados por el equipo', tone: 'rose' },
        ],
        sections: [
          {
            title: 'Sugerencias recientes',
            items: visibleCases.slice(0, 5).map((item) => ({
              title: item.subject,
              subtitle: `Categoria sugerida ${item.category} | prioridad ${item.priority}`,
              detail: item.description,
              meta: ['Confianza 0.82'],
              status: 'IA sugerida',
              tone: 'blue',
            })),
          },
        ],
      };

    // M07-06: Respuestas sugeridas - biblioteca reusable para agentes y administracion.
    case 'm07_suggested_responses':
      return {
        title: 'Base de respuestas sugeridas',
        summary: 'Conserva respuestas modelo para acelerar confirmaciones, seguimientos y cierres.',
        icon: MessageSquareQuote,
        metrics: [
          { label: 'Plantillas activas', value: String(RESPONSE_LIBRARY.length), helper: 'Biblioteca operativa', tone: 'blue' },
          { label: 'Uso mensual', value: '31 envios', helper: 'Casos apoyados', tone: 'emerald' },
          { label: 'Pendientes de revisar', value: '2', helper: 'Requieren ajuste legal', tone: 'amber' },
          { label: 'Tiempo ahorrado', value: '6.5h', helper: 'Estimado semanal', tone: 'violet' },
        ],
        composer: {
          title: 'Nueva respuesta base',
          description: 'Guarda asunto, audiencia y cuerpo reusable para el equipo.',
          fields: [
            { label: 'Titulo', placeholder: 'Ej: Confirmacion de recepcion', disabled: !capabilities.canEdit },
            { label: 'Audiencia', placeholder: 'Ej: Todos los residentes', disabled: !capabilities.canEdit },
            { label: 'Canal', placeholder: 'Ej: Email / app', disabled: !capabilities.canEdit },
            { label: 'Cuerpo', placeholder: 'Texto de la respuesta', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar respuesta',
                onClick: () =>
                  toast({
                    title: 'Respuesta guardada',
                    description: 'La biblioteca recibio la nueva plantilla sugerida.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Tu perfil puede leer la biblioteca, pero no editarla.',
        },
        sections: [
          {
            title: 'Plantillas disponibles',
            items: RESPONSE_LIBRARY.map((row) => ({
              title: row.title,
              subtitle: row.audience,
              detail: row.usage,
              meta: ['Version institucional'],
              status: 'Disponible',
              tone: 'emerald',
            })),
          },
        ],
      };

    // M07-07: Satisfaccion post-cierre - recoge percepcion del residente luego del cierre.
    case 'm07_post_close_satisfaction':
      return {
        title: 'Satisfaccion post-cierre',
        summary: 'Mide experiencia final, comentarios y oportunidad de mejora despues del cierre.',
        icon: Smile,
        metrics: [
          { label: 'Encuestas cerradas', value: String(resolvedCases.length), helper: 'Casos aptos para encuesta', tone: 'emerald' },
          { label: 'Respuesta promedio', value: '4.4 / 5', helper: 'Satisfaccion general', tone: 'blue' },
          { label: 'Sin respuesta', value: '3', helper: 'Recordatorio pendiente', tone: 'amber' },
          { label: 'Alertas de calidad', value: '1', helper: 'Comentario critico', tone: 'rose' },
        ],
        composer: {
          title: 'Enviar encuesta',
          description: 'Selecciona ticket, canal y mensaje de salida para el residente.',
          fields: [
            { label: 'Ticket', placeholder: 'Ej: PQRS-2201', disabled: !capabilities.canCreate },
            { label: 'Canal', placeholder: 'Ej: Email + push', disabled: !capabilities.canCreate },
            { label: 'Escala', placeholder: '1 a 5 estrellas', disabled: !capabilities.canCreate },
            { label: 'Mensaje final', placeholder: 'Texto de agradecimiento', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Enviar encuesta',
                onClick: () =>
                  toast({
                    title: 'Encuesta enviada',
                    description: 'El residente recibio la medicion de satisfaccion post-cierre.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Modo consulta activo para el resultado de las encuestas.',
        },
        sections: [
          {
            title: 'Resumen de experiencia',
            items: resolvedCases.slice(0, 4).map((item) => ({
              title: `${item.ticket} - ${item.subject}`,
              subtitle: 'Calificacion 4/5 | Comentario positivo',
              detail: item.description,
              meta: ['Encuesta enviada'],
              status: 'Cierre medido',
              tone: 'emerald',
            })),
          },
        ],
      };

    // M07-08: Reapertura de casos - devuelve tickets cerrados al flujo activo.
    case 'm07_case_reopening':
      return {
        title: 'Re-apertura de casos',
        summary: 'Permite devolver un ticket cerrado al flujo operativo con motivo y responsable.',
        icon: GitPullRequestArrow,
        metrics: [
          { label: 'Casos reabiertos', value: '2', helper: 'Ultimos 30 dias', tone: 'amber' },
          { label: 'Pendientes de validar', value: '1', helper: 'Con motivo del residente', tone: 'blue' },
          { label: 'Reabiertos y cerrados', value: '1', helper: 'Ciclo completo', tone: 'emerald' },
          { label: 'Con riesgo de reincidencia', value: '1', helper: 'Seguimiento especial', tone: 'rose' },
        ],
        composer: {
          title: 'Solicitar reapertura',
          description: 'Registra el motivo y reasigna el caso a la cola adecuada.',
          fields: [
            { label: 'Ticket', placeholder: 'Ej: PQRS-2198', disabled: !capabilities.canCreate },
            { label: 'Motivo', placeholder: 'Ej: La solucion no fue efectiva', disabled: !capabilities.canCreate },
            { label: 'Responsable nuevo', placeholder: 'Ej: Mantenimiento', disabled: !capabilities.canCreate },
            { label: 'Comentario', placeholder: 'Contexto adicional', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Reabrir caso',
                onClick: () =>
                  toast({
                    title: 'Reapertura preparada',
                    description: 'El caso volvio a la cola activa con motivo documentado.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Solo puedes revisar solicitudes de reapertura.',
        },
        sections: [
          {
            title: 'Casos cerrados recientes',
            items: resolvedCases.slice(0, 4).map((item) => ({
              title: `${item.ticket} - ${item.subject}`,
              subtitle: `${item.status} | ${item.date}`,
              detail: item.description,
              meta: ['Disponible para reapertura'],
              status: 'Cerrado',
              tone: 'amber',
            })),
          },
        ],
      };

    // M07-09: Trazabilidad completa - reconstruye cada interaccion del ticket.
    case 'm07_full_traceability':
      return {
        title: 'Trazabilidad completa de interacciones',
        summary: 'Consolida estados, comentarios, asignaciones y evidencias en una sola linea de tiempo.',
        icon: NotebookTabs,
        metrics: [
          { label: 'Tickets visibles', value: String(visibleCases.length), helper: 'Con historial accesible', tone: 'blue' },
          { label: 'Interacciones promedio', value: '4.6', helper: 'Por ticket', tone: 'violet' },
          { label: 'Con comentario interno', value: '7', helper: 'Seguimiento activo', tone: 'emerald' },
          { label: 'Con evidencia adjunta', value: '3', helper: 'Documentacion soporte', tone: 'amber' },
        ],
        sections: [
          {
            title: 'Linea de tiempo',
            items: visibleCases.slice(0, 5).map((item) => ({
              title: `${item.ticket} - ${item.subject}`,
              subtitle: `${item.date} | ${item.assignedTo ?? 'Sin responsable'}`,
              detail: `${item.status} con prioridad ${item.priority}.`,
              meta: ['Recepcion', 'Asignacion', 'Seguimiento'],
              status: 'Trazado',
              tone: 'blue',
            })),
          },
        ],
      };

    // M07-10: Tickets internos y externos - segmenta flujo segun origen y audiencia.
    case 'm07_internal_external_tickets':
      return {
        title: 'Tickets internos y externos',
        summary: 'Separa flujos de residentes, operacion y proveedores con trazabilidad diferenciada.',
        icon: Split,
        metrics: [
          { label: 'Carriles activos', value: String(INTERNAL_EXTERNAL_ROWS.length), helper: 'Origen del caso', tone: 'blue' },
          { label: 'Externos', value: '18', helper: 'Residentes y propietarios', tone: 'emerald' },
          { label: 'Internos', value: '7', helper: 'Administracion y operacion', tone: 'amber' },
          { label: 'Proveedor', value: '3', helper: 'Terceros vinculados', tone: 'violet' },
        ],
        sections: [
          {
            title: 'Distribucion de flujos',
            items: INTERNAL_EXTERNAL_ROWS.map((row) => ({
              title: row.lane,
              subtitle: row.count,
              detail: row.detail,
              meta: ['Vista segmentada'],
              status: 'Activa',
              tone: 'blue',
            })),
          },
        ],
      };

    // M07-11: Vinculacion a entidades - relaciona tickets con unidad, residente o proveedor.
    case 'm07_linking_to_entities':
      return {
        title: 'Vinculacion a unidad, residente o proveedor',
        summary: 'Relaciona cada caso con las entidades operativas que le dan contexto.',
        icon: Boxes,
        metrics: [
          { label: 'Entidades vinculadas', value: String(ENTITY_LINK_ROWS.length), helper: 'Contexto del ticket', tone: 'blue' },
          { label: 'Casos con unidad', value: '9', helper: 'Trazabilidad inmobiliaria', tone: 'emerald' },
          { label: 'Casos con proveedor', value: '1', helper: 'Seguimiento tercero', tone: 'amber' },
          { label: 'Sin vinculo', value: '2', helper: 'Pendientes de clasificar', tone: 'rose' },
        ],
        sections: [
          {
            title: 'Mapa de relacion',
            items: ENTITY_LINK_ROWS.map((row) => ({
              title: row.entity,
              subtitle: row.relation,
              detail: row.status,
              meta: ['Contexto cruzado'],
              status: 'Vinculado',
              tone: 'blue',
            })),
          },
        ],
      };

    // M07-12: Indicadores de reincidencia - detecta temas repetitivos para accion correctiva.
    case 'm07_recurrence_indicators':
      return {
        title: 'Indicadores de reincidencia',
        summary: 'Agrupa temas repetitivos para prevenir nuevas quejas y enfocar planes de mejora.',
        icon: MessagesSquare,
        metrics: [
          { label: 'Temas recurrentes', value: String(RECURRENCE_ROWS.length), helper: 'Con patron detectado', tone: 'rose' },
          { label: 'Mayor recurrencia', value: '5 casos', helper: 'Ruido en terraza', tone: 'amber' },
          { label: 'Casos cerrados', value: '6', helper: 'Con accion correctiva', tone: 'emerald' },
          { label: 'Nuevos este mes', value: '2', helper: 'Aparecieron esta semana', tone: 'blue' },
        ],
        sections: [
          {
            title: 'Radar de reincidencia',
            items: RECURRENCE_ROWS.map((row) => ({
              title: row.topic,
              subtitle: row.repeats,
              detail: row.trend,
              meta: ['Analisis mensual'],
              status: 'Monitoreado',
              tone: 'rose',
            })),
          },
        ],
      };

    // M07-13: Comite paralelo - deriva casos sensibles al flujo de convivencia.
    case 'm07_committee_parallel_flow':
      return {
        title: 'Comite de convivencia como flujo paralelo',
        summary: 'Coordina casos sensibles que exigen ruta paralela entre administracion y consejo.',
        icon: LifeBuoy,
        metrics: [
          { label: 'Casos en comite', value: String(COMMITTEE_ROWS.length), helper: 'Flujo paralelo', tone: 'violet' },
          { label: 'Con agenda definida', value: '1', helper: 'Proxima sesion', tone: 'blue' },
          { label: 'Pendiente concepto', value: '1', helper: 'Esperando insumo', tone: 'amber' },
          { label: 'Cierres del trimestre', value: '3', helper: 'Con acta firmada', tone: 'emerald' },
        ],
        sections: [
          {
            title: 'Flujo paralelo activo',
            items: COMMITTEE_ROWS.map((row) => ({
              title: `${row.caseId} - ${row.subject}`,
              subtitle: row.owner,
              detail: row.status,
              meta: ['Convocatoria especial'],
              status: 'En comite',
              tone: 'violet',
            })),
          },
        ],
      };

    // M07-14: Anonimato controlado - protege identidad segun tipo de reporte.
    case 'm07_controlled_anonymity':
      return {
        title: 'Anonimato controlado para ciertos reportes',
        summary: 'Define que reportes preservan identidad y quienes pueden ver el origen real.',
        icon: Shield,
        metrics: [
          { label: 'Tipos con reserva', value: String(ANONYMITY_ROWS.length), helper: 'Politica vigente', tone: 'blue' },
          { label: 'Reportes anonimos', value: '4', helper: 'Ultimo mes', tone: 'amber' },
          { label: 'Accesos auditados', value: '6', helper: 'Revision de trazas', tone: 'emerald' },
          { label: 'Incidentes', value: '0', helper: 'Sin exposiciones', tone: 'violet' },
        ],
        sections: [
          {
            title: 'Politicas de reserva',
            items: ANONYMITY_ROWS.map((row) => ({
              title: row.reportType,
              subtitle: row.visibility,
              detail: row.status,
              meta: ['Trazabilidad auditada'],
              status: 'Protegido',
              tone: 'blue',
            })),
          },
        ],
      };
  }
};

export const PQRSFeatureAction = (props: FeatureActionProps) => {
  const workspace = getPQRSWorkspace(props.featureId as PQRSFeatureId, props);

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
