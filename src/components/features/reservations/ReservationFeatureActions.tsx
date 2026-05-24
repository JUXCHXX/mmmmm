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
  BadgeCheck,
  CalendarClock,
  CalendarDays,
  Camera,
  Clock3,
  Coins,
  FileClock,
  ListChecks,
  ListTree,
  ShieldAlert,
  Sparkles,
  Ticket,
  TimerReset,
  TrendingUp,
  Wrench,
} from 'lucide-react';

type ReservationFeatureId =
  | 'm06_space_policies'
  | 'm06_user_quota_limits'
  | 'm06_visual_calendar'
  | 'm06_mora_restrictions'
  | 'm06_payments_and_deposits'
  | 'm06_non_use_penalties'
  | 'm06_waiting_list'
  | 'm06_rules_based_approval'
  | 'm06_special_hours'
  | 'm06_maintenance_blocks'
  | 'm06_check_in_out'
  | 'm06_space_condition_evidence'
  | 'm06_reservation_history'
  | 'm06_space_usage_analytics';

interface ReservationSection {
  title: string;
  description?: string;
  items: FeatureItem[];
}

interface ReservationWorkspace {
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
  sections: ReservationSection[];
  footerActions?: FeatureActionButton[];
  notices?: Array<{ title: string; detail: string }>;
}

const POLICY_ROWS = [
  { space: 'Salon social', quota: '2 reservas', notice: '24h', price: '$180.000', deposit: '$120.000' },
  { space: 'Cancha multiple', quota: '4 reservas', notice: '12h', price: '$0', deposit: '$0' },
  { space: 'BBQ terraza', quota: '1 reserva', notice: '48h', price: '$95.000', deposit: '$80.000' },
];

const WAITING_LIST_ROWS = [
  { resident: 'Laura Gomez', unit: 'T1-302', space: 'Salon social', requestedFor: '2026-05-28 18:00', priority: '1 de la fila' },
  { resident: 'Juan Torres', unit: 'T2-1104', space: 'BBQ terraza', requestedFor: '2026-05-29 13:00', priority: '2 de la fila' },
  { resident: 'Marta Diaz', unit: 'T1-204', space: 'Cancha multiple', requestedFor: '2026-05-31 09:00', priority: 'Lista flexible' },
];

const PENALTY_ROWS = [
  { resident: 'Nicolas Ruiz', unit: 'T2-903', event: 'No uso del salon reservado', amount: '$70.000', status: 'Pendiente de aplicar' },
  { resident: 'Sara Rojas', unit: 'T1-604', event: 'Entrega tardia del BBQ', amount: '$45.000', status: 'Aplicada en cartera' },
];

const APPROVAL_RULES = [
  { rule: 'Aprobar automaticamente reservas menores a 4 horas', scope: 'Salon social', trigger: 'Sin mora y con cupo disponible' },
  { rule: 'Escalar a administracion eventos con sonido', scope: 'Terraza BBQ', trigger: 'Horario nocturno o mas de 25 invitados' },
  { rule: 'Enviar a porteria para check-in', scope: 'Cancha multiple', trigger: 'Reservas activas del dia' },
];

const SPECIAL_HOURS = [
  { date: '2026-05-31', space: 'Piscina', schedule: '06:00 - 20:00', reason: 'Temporada alta' },
  { date: '2026-06-03', space: 'Salon social', schedule: 'Cerrado 08:00 - 14:00', reason: 'Asamblea extraordinaria' },
];

const MAINTENANCE_BLOCKS = [
  { space: 'Gimnasio', range: '2026-05-27 06:00 a 2026-05-28 18:00', reason: 'Cambio de piso vinilico' },
  { space: 'Piscina', range: '2026-06-02 07:00 a 2026-06-02 17:00', reason: 'Lavado y balance quimico' },
];

const EVIDENCE_ROWS = [
  { reservation: 'RES-2205', space: 'Salon social', unit: 'T1-302', capture: 'Antes de entrega', status: '3 fotos y 1 nota' },
  { reservation: 'RES-2209', space: 'BBQ terraza', unit: 'T2-903', capture: 'Post evento', status: 'Pendiente evidencia final' },
];

const MORA_ROWS = [
  { unit: 'T2-903', debt: '$1.240.000', affectedSpaces: 'Salon social, BBQ', status: 'Bloqueada hasta recaudo parcial' },
  { unit: 'T1-1104', debt: '$620.000', affectedSpaces: 'Salon social', status: 'Pendiente validacion de acuerdo' },
];

const QUOTA_ROWS = [
  { profile: 'Propietario', monthlyLimit: '4 reservas', overlap: '1 simultanea', exception: 'Eventos del conjunto' },
  { profile: 'Arrendatario', monthlyLimit: '2 reservas', overlap: '1 simultanea', exception: 'Sin excepciones' },
  { profile: 'Consejo', monthlyLimit: '6 reservas', overlap: '2 simultaneas', exception: 'Comites y jornadas' },
];

const getReservationWorkspace = (
  featureId: ReservationFeatureId,
  props: FeatureActionProps,
): ReservationWorkspace => {
  const { accessLevel, roleId } = props;
  const capabilities = getFeatureCapabilities(accessLevel);
  const { condoConfig, reservations } = useAppStore.getState();
  const user = useAuthStore.getState().user;

  const isResidentProfile = roleId === 'propietario' || roleId === 'arrendatario';
  const ownedReservations = reservations.filter((reservation) => reservation.resident === user?.name);
  const visibleReservations = capabilities.isOwnDataOnly || isResidentProfile ? ownedReservations : reservations;

  const pendingReservations = reservations.filter((reservation) => reservation.status === 'pending');
  const confirmedReservations = reservations.filter((reservation) => reservation.status === 'confirmed');
  const blockedAreas = condoConfig.commonAreas.filter((area) => !area.reservable);
  const totalRevenue = reservations.length * 95000;

  switch (featureId) {
    // M06-01: Politicas por espacio - centraliza cupos, anticipacion y costos por recurso.
    case 'm06_space_policies':
      return {
        title: 'Politicas por espacio',
        summary: 'Administra reglas operativas para cada zona comun reservable.',
        icon: ListChecks,
        metrics: [
          { label: 'Espacios con politica', value: String(POLICY_ROWS.length), helper: 'Reglas vigentes', tone: 'blue' },
          { label: 'Con deposito', value: '2', helper: 'Requieren garantia', tone: 'amber' },
          { label: 'Con aprobacion manual', value: '1', helper: 'Eventos especiales', tone: 'violet' },
          { label: 'Revision proxima', value: '31 may', helper: 'Corte trimestral', tone: 'emerald' },
        ],
        composer: {
          title: 'Nueva politica operativa',
          description: 'Usa esta ficha para definir cupo, aviso previo y costo por espacio.',
          fields: [
            { label: 'Espacio', placeholder: 'Ej: Coworking piso 1', disabled: !capabilities.canEdit },
            { label: 'Aviso previo', placeholder: 'Ej: 24 horas', disabled: !capabilities.canEdit },
            { label: 'Cupo maximo por usuario', placeholder: 'Ej: 2 al mes', disabled: !capabilities.canEdit },
            { label: 'Costo y deposito', placeholder: 'Ej: 180000 / 120000', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar politica',
                onClick: () =>
                  toast({
                    title: 'Politica lista para publicar',
                    description: 'El espacio quedo preparado para validacion administrativa.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Tu perfil puede consultar las reglas, pero no cambiarlas.',
        },
        sections: [
          {
            title: 'Matriz activa',
            description: 'Resumen de cupos, anticipacion y recaudo asociado.',
            items: POLICY_ROWS.map((row) => ({
              title: row.space,
              subtitle: `${row.quota} | Aviso previo ${row.notice}`,
              detail: `Costo ${row.price} con deposito ${row.deposit}.`,
              meta: ['Version 4.0', 'Validacion con consejo'],
              status: 'Vigente',
              tone: 'blue',
            })),
          },
        ],
        footerActions: [
          {
            label: 'Exportar matriz',
            variant: 'outline',
            tone: 'slate',
            onClick: () =>
              toast({
                title: 'Matriz exportada',
                description: 'Se genero el resumen de politicas para comite financiero.',
              }),
          },
        ],
      };

    // M06-02: Cupos maximos por usuario - controla frecuencia y simultaneidad por perfil.
    case 'm06_user_quota_limits':
      return {
        title: 'Cupos maximos por usuario',
        summary: 'Supervisa limites mensuales, simultaneidad y excepciones por perfil.',
        icon: Ticket,
        metrics: [
          { label: 'Perfiles controlados', value: '3', helper: 'Reglas activas', tone: 'blue' },
          { label: 'Alertas de exceso', value: '2', helper: 'Ultimos 7 dias', tone: 'amber' },
          { label: 'Usuarios en limite', value: '5', helper: 'Por revisar', tone: 'rose' },
          { label: 'Excepciones activas', value: '1', helper: 'Evento institucional', tone: 'violet' },
        ],
        composer: {
          title: 'Ajustar cupo por perfil',
          description: 'Puedes modificar solo si tu acceso permite gestion operativa.',
          fields: [
            { label: 'Perfil', placeholder: 'Propietario / Arrendatario', disabled: !capabilities.canEdit },
            { label: 'Limite mensual', placeholder: 'Ej: 4 reservas', disabled: !capabilities.canEdit },
            { label: 'Simultaneas', placeholder: 'Ej: 1 activa', disabled: !capabilities.canEdit },
            { label: 'Excepcion', placeholder: 'Ej: Asamblea o torneo', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Actualizar cupo',
                onClick: () =>
                  toast({
                    title: 'Cupo actualizado',
                    description: 'La nueva regla quedo lista para aplicarse en el proximo ciclo.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Tu acceso actual solo permite revisar el cupo configurado.',
        },
        sections: [
          {
            title: 'Reglas por perfil',
            items: QUOTA_ROWS.map((row) => ({
              title: row.profile,
              subtitle: `${row.monthlyLimit} | ${row.overlap}`,
              detail: `Excepcion operativa: ${row.exception}.`,
              meta: ['Auditoria mensual'],
              status: 'Configurado',
              tone: 'violet',
            })),
          },
        ],
      };

    // M06-03: Calendario visual - muestra disponibilidad y dispara el flujo de reserva.
    case 'm06_visual_calendar':
      return {
        title: 'Calendario visual por recurso',
        summary: 'Consulta disponibilidad por espacio y dispara una nueva solicitud de reserva.',
        icon: CalendarDays,
        metrics: [
          { label: 'Espacios reservables', value: String(condoConfig.commonAreas.filter((area) => area.reservable).length), helper: 'Con agenda activa', tone: 'emerald' },
          { label: 'Reservas confirmadas', value: String(confirmedReservations.length), helper: 'Mes actual', tone: 'blue' },
          { label: 'Pendientes', value: String(pendingReservations.length), helper: 'Por validar', tone: 'amber' },
          { label: 'Ocupacion estimada', value: '74%', helper: 'Promedio semanal', tone: 'violet' },
        ],
        composer: {
          title: 'Nueva solicitud',
          description: 'El formulario se habilita segun el nivel de acceso del perfil activo.',
          fields: [
            { label: 'Espacio', placeholder: 'Ej: Salon social', disabled: !capabilities.canCreate },
            { label: 'Fecha', placeholder: 'Selecciona dia', type: 'date', disabled: !capabilities.canCreate },
            { label: 'Franja', placeholder: 'Ej: 18:00 - 22:00', disabled: !capabilities.canCreate },
            { label: 'Notas', placeholder: 'Evento, aforo y requerimientos', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Registrar solicitud',
                onClick: () =>
                  toast({
                    title: 'Solicitud lista',
                    description: 'La reserva fue preparada para revision de reglas y cupos.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Modo consulta activo: puedes ver disponibilidad, pero no crear reservas.',
        },
        sections: [
          {
            title: 'Disponibilidad prioritaria',
            description: 'Espacios con mejor ventana de disponibilidad esta semana.',
            items: condoConfig.commonAreas.slice(0, 4).map((area) => ({
              title: area.name,
              subtitle: area.reservable ? 'Disponible para agenda' : 'Solo consulta',
              detail: `Capacidad ${area.capacity} personas.`,
              meta: [area.reservable ? 'Con agenda abierta' : 'Bloqueado por politica', 'Revision diaria'],
              status: area.reservable ? 'Con cupo' : 'Restringido',
              tone: area.reservable ? 'emerald' : 'amber',
            })),
          },
          {
            title: 'Reservas cercanas',
            items: visibleReservations.slice(0, 4).map((reservation) => ({
              title: reservation.area,
              subtitle: `${reservation.date} | ${reservation.timeSlot}`,
              detail: `Unidad ${reservation.unit} - ${reservation.resident}.`,
              meta: [`Estado ${reservation.status}`],
              status: reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente',
              tone: reservation.status === 'confirmed' ? 'blue' : 'amber',
            })),
          },
        ],
        footerActions: [
          {
            label: 'Sincronizar agenda',
            variant: 'outline',
            tone: 'slate',
            onClick: () =>
              toast({
                title: 'Agenda sincronizada',
                description: 'Se actualizo la ocupacion visible para residentes y porteria.',
              }),
          },
        ],
      };

    // M06-04: Restricciones por mora - bloquea acceso a espacios segun saldo vencido.
    case 'm06_mora_restrictions':
      return {
        title: 'Restricciones por mora',
        summary: 'Relaciona cartera vencida con politicas de bloqueo en reservas.',
        icon: ShieldAlert,
        metrics: [
          { label: 'Unidades bloqueadas', value: String(MORA_ROWS.length), helper: 'Con regla activa', tone: 'rose' },
          { label: 'Acuerdos vigentes', value: '1', helper: 'Pendiente de validar', tone: 'amber' },
          { label: 'Reactivaciones', value: '3', helper: 'Ultimos 30 dias', tone: 'emerald' },
          { label: 'Cobertura', value: '100%', helper: 'Espacios con control', tone: 'blue' },
        ],
        composer: {
          title: 'Nueva regla de bloqueo',
          description: 'Define umbral de deuda y espacios afectados.',
          fields: [
            { label: 'Saldo minimo', placeholder: 'Ej: 300000', type: 'number', disabled: !capabilities.canEdit },
            { label: 'Espacios afectados', placeholder: 'Salon, BBQ, cancha', disabled: !capabilities.canEdit },
            { label: 'Excepcion', placeholder: 'Acuerdo de pago vigente', disabled: !capabilities.canEdit },
            { label: 'Mensaje al residente', placeholder: 'Texto visible en autoservicio', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Activar regla',
                onClick: () =>
                  toast({
                    title: 'Regla preparada',
                    description: 'La restriccion quedo lista para aplicarse en el siguiente corte de cartera.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes revisar el efecto de la mora sobre la agenda.',
        },
        sections: [
          {
            title: 'Unidades con bloqueo',
            items: MORA_ROWS.map((row) => ({
              title: row.unit,
              subtitle: `Saldo vencido ${row.debt}`,
              detail: row.affectedSpaces,
              meta: [row.status],
              status: 'Con restriccion',
              tone: 'rose',
            })),
          },
        ],
      };

    // M06-05: Pagos y depositos asociados - controla recaudo y garantia por reserva.
    case 'm06_payments_and_deposits':
      return {
        title: 'Pagos y depositos asociados',
        summary: 'Consulta cobros, garantias y devoluciones por uso de zonas comunes.',
        icon: Coins,
        metrics: [
          { label: 'Pagos registrados', value: String(visibleReservations.length), helper: 'Reservas visibles', tone: 'blue' },
          { label: 'Garantias retenidas', value: '$200.000', helper: 'Pendientes por cierre', tone: 'amber' },
          { label: 'Recaudo mensual', value: `$${totalRevenue.toLocaleString()}`, helper: 'Estimado del modulo', tone: 'emerald' },
          { label: 'Devoluciones', value: '2', helper: 'Ultima semana', tone: 'violet' },
        ],
        composer: {
          title: 'Aplicar recaudo o garantia',
          description: 'Registra el valor asociado a la reserva y define si genera deposito.',
          fields: [
            { label: 'Reserva', placeholder: 'Ej: RES-2205', disabled: !capabilities.canCreate },
            { label: 'Valor cobrado', placeholder: 'Ej: 95000', type: 'number', disabled: !capabilities.canCreate },
            { label: 'Deposito', placeholder: 'Ej: 80000', type: 'number', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Detalle de recaudo', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Guardar recaudo',
                onClick: () =>
                  toast({
                    title: 'Movimiento registrado',
                    description: 'El recaudo quedo asociado a la reserva seleccionada.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Puedes revisar tus pagos, pero no registrar nuevos movimientos.',
        },
        sections: [
          {
            title: 'Resumen por reserva',
            items: visibleReservations.slice(0, 4).map((reservation, index) => ({
              title: `${reservation.area} - ${reservation.unit}`,
              subtitle: `${reservation.date} | ${reservation.timeSlot}`,
              detail: index % 2 === 0 ? 'Recaudo aplicado y deposito vigente.' : 'Solo cobro operativo sin garantia.',
              meta: [index % 2 === 0 ? 'Deposito $80000' : 'Sin deposito'],
              status: index % 2 === 0 ? 'Con garantia' : 'Cobrado',
              tone: index % 2 === 0 ? 'amber' : 'emerald',
            })),
          },
        ],
      };

    // M06-06: Penalizaciones por no uso - registra no-shows y cobros compensatorios.
    case 'm06_non_use_penalties':
      return {
        title: 'Penalizaciones por no uso',
        summary: 'Gestiona cobros por no asistencia, entrega tardia o incumplimiento del reglamento.',
        icon: TimerReset,
        metrics: [
          { label: 'Casos del mes', value: String(PENALTY_ROWS.length), helper: 'Con evidencia de soporte', tone: 'rose' },
          { label: 'Cobro pendiente', value: '$70.000', helper: 'Por aplicar en cartera', tone: 'amber' },
          { label: 'Casos cerrados', value: '4', helper: 'Ultimo trimestre', tone: 'emerald' },
          { label: 'Tiempo promedio', value: '18h', helper: 'Desde el evento', tone: 'blue' },
        ],
        composer: {
          title: 'Registrar penalizacion',
          description: 'Asocia la novedad a la reserva y deja soporte para cartera.',
          fields: [
            { label: 'Reserva', placeholder: 'Ej: RES-2241', disabled: !capabilities.canEdit },
            { label: 'Valor', placeholder: 'Ej: 70000', type: 'number', disabled: !capabilities.canEdit },
            { label: 'Motivo', placeholder: 'No show / entrega tardia', disabled: !capabilities.canEdit },
            { label: 'Soporte', placeholder: 'Detalle de evidencia', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Aplicar penalizacion',
                onClick: () =>
                  toast({
                    title: 'Penalizacion preparada',
                    description: 'La novedad quedo lista para integrarse con cartera.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes revisar las penalizaciones registradas.',
        },
        sections: [
          {
            title: 'Casos recientes',
            items: PENALTY_ROWS.map((row) => ({
              title: `${row.resident} - ${row.unit}`,
              subtitle: row.event,
              detail: `Valor asociado ${row.amount}.`,
              meta: [row.status],
              status: 'Seguimiento activo',
              tone: 'rose',
            })),
          },
        ],
      };

    // M06-07: Lista de espera - promueve solicitudes cuando se libera una franja.
    case 'm06_waiting_list':
      return {
        title: 'Lista de espera',
        summary: 'Ordena solicitudes en cola y promueve automaticamente al siguiente residente.',
        icon: ListTree,
        metrics: [
          { label: 'Solicitudes en fila', value: String(WAITING_LIST_ROWS.length), helper: 'Pendientes de liberacion', tone: 'blue' },
          { label: 'Promociones del mes', value: '6', helper: 'Automaticas y manuales', tone: 'emerald' },
          { label: 'Tiempo medio', value: '1.8 dias', helper: 'Antes de asignar cupo', tone: 'amber' },
          { label: 'Rechazos', value: '1', helper: 'Sin respuesta del residente', tone: 'rose' },
        ],
        composer: {
          title: 'Agregar solicitud a la cola',
          description: 'Registra al siguiente residente interesado por fecha y prioridad.',
          fields: [
            { label: 'Residente', placeholder: 'Ej: Laura Gomez', disabled: !capabilities.canCreate },
            { label: 'Unidad', placeholder: 'Ej: T1-302', disabled: !capabilities.canCreate },
            { label: 'Espacio', placeholder: 'Ej: Salon social', disabled: !capabilities.canCreate },
            { label: 'Franja deseada', placeholder: 'Ej: 2026-05-28 18:00', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Agregar a fila',
                onClick: () =>
                  toast({
                    title: 'Solicitud agregada',
                    description: 'La reserva quedo posicionada en la lista de espera.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Modo consulta activo para la fila de espera.',
        },
        sections: [
          {
            title: 'Fila actual',
            items: WAITING_LIST_ROWS.map((row) => ({
              title: `${row.space} - ${row.priority}`,
              subtitle: `${row.resident} | ${row.unit}`,
              detail: `Solicitada para ${row.requestedFor}.`,
              meta: ['Notificacion automatica activa'],
              status: 'En cola',
              tone: 'blue',
            })),
          },
        ],
        footerActions: capabilities.canEdit
          ? [
              {
                label: 'Promover siguiente reserva',
                onClick: () =>
                  toast({
                    title: 'Cupo promovido',
                    description: 'El siguiente residente de la fila recibio la notificacion.',
                  }),
              },
            ]
          : undefined,
      };

    // M06-08: Aprobacion por reglas - define automatismos y excepciones de validacion.
    case 'm06_rules_based_approval':
      return {
        title: 'Aprobacion por reglas',
        summary: 'Automatiza la aprobacion de reservas segun mora, aforo y tipo de evento.',
        icon: BadgeCheck,
        metrics: [
          { label: 'Reglas activas', value: String(APPROVAL_RULES.length), helper: 'Motor de validacion', tone: 'emerald' },
          { label: 'Aprobaciones auto', value: '68%', helper: 'Ultimos 30 dias', tone: 'blue' },
          { label: 'Escalamientos', value: '5', helper: 'Requieren revision', tone: 'amber' },
          { label: 'Errores evitados', value: '11', helper: 'Conflictos bloqueados', tone: 'violet' },
        ],
        composer: {
          title: 'Nueva regla de aprobacion',
          description: 'Combina disparador, alcance y resultado esperado.',
          fields: [
            { label: 'Condicion', placeholder: 'Ej: Mora mayor a 300000', disabled: !capabilities.canEdit },
            { label: 'Alcance', placeholder: 'Ej: Salon social', disabled: !capabilities.canEdit },
            { label: 'Resultado', placeholder: 'Aprobar / Escalar / Rechazar', disabled: !capabilities.canEdit },
            { label: 'Observaciones', placeholder: 'Contexto o excepciones', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Guardar regla',
                onClick: () =>
                  toast({
                    title: 'Regla creada',
                    description: 'El motor de aprobacion recibio la nueva condicion.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Puedes revisar el flujo, pero no editar las reglas.',
        },
        sections: [
          {
            title: 'Motor de aprobacion',
            items: APPROVAL_RULES.map((rule) => ({
              title: rule.rule,
              subtitle: rule.scope,
              detail: rule.trigger,
              meta: ['Impacta agenda y notificaciones'],
              status: 'Automatizada',
              tone: 'emerald',
            })),
          },
        ],
      };

    // M06-09: Horarios especiales - gestiona feriados, cierres y ventanas extraordinarias.
    case 'm06_special_hours':
      return {
        title: 'Configuracion de horarios especiales',
        summary: 'Programa ampliaciones, cierres parciales y excepciones por fechas especiales.',
        icon: Clock3,
        metrics: [
          { label: 'Excepciones activas', value: String(SPECIAL_HOURS.length), helper: 'Agenda especial', tone: 'amber' },
          { label: 'Feriados cargados', value: '12', helper: 'Calendario anual', tone: 'blue' },
          { label: 'Impacto en reservas', value: '9 cupos', helper: 'Reasignados', tone: 'violet' },
          { label: 'Avisos enviados', value: '27', helper: 'Residentes notificados', tone: 'emerald' },
        ],
        composer: {
          title: 'Nueva ventana especial',
          description: 'Configura la fecha, franja y motivo para ajustar la agenda del espacio.',
          fields: [
            { label: 'Fecha', placeholder: 'Selecciona fecha', type: 'date', disabled: !capabilities.canEdit },
            { label: 'Espacio', placeholder: 'Ej: Piscina', disabled: !capabilities.canEdit },
            { label: 'Horario', placeholder: 'Ej: 06:00 - 20:00', disabled: !capabilities.canEdit },
            { label: 'Motivo', placeholder: 'Ej: Temporada alta o mantenimiento', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Programar horario',
                onClick: () =>
                  toast({
                    title: 'Horario especial listo',
                    description: 'La agenda recibio la nueva ventana extraordinaria.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes consultar el calendario especial cargado.',
        },
        sections: [
          {
            title: 'Agenda especial vigente',
            items: SPECIAL_HOURS.map((row) => ({
              title: `${row.space} - ${row.date}`,
              subtitle: row.schedule,
              detail: row.reason,
              meta: ['Notificacion automatica'],
              status: 'Programado',
              tone: 'amber',
            })),
          },
        ],
      };

    // M06-10: Bloqueo por mantenimiento - reserva ventanas tecnicas fuera de agenda publica.
    case 'm06_maintenance_blocks':
      return {
        title: 'Bloqueo por mantenimiento',
        summary: 'Asegura cierres tecnicos temporales para evitar reservas sobre espacios intervenidos.',
        icon: Wrench,
        metrics: [
          { label: 'Bloqueos activos', value: String(MAINTENANCE_BLOCKS.length), helper: 'Con cierre vigente', tone: 'rose' },
          { label: 'Espacios afectados', value: String(blockedAreas.length), helper: 'No reservables', tone: 'amber' },
          { label: 'Reagendadas', value: '3', helper: 'Reservas movidas', tone: 'blue' },
          { label: 'SLA tecnico', value: '36h', helper: 'Promedio de cierre', tone: 'emerald' },
        ],
        composer: {
          title: 'Nuevo bloqueo tecnico',
          description: 'Reserva una ventana de mantenimiento y detalla su motivo operativo.',
          fields: [
            { label: 'Espacio', placeholder: 'Ej: Gimnasio', disabled: !capabilities.canEdit },
            { label: 'Desde', placeholder: 'Selecciona fecha', type: 'date', disabled: !capabilities.canEdit },
            { label: 'Hasta', placeholder: 'Selecciona fecha', type: 'date', disabled: !capabilities.canEdit },
            { label: 'Motivo', placeholder: 'Trabajo o proveedor responsable', type: 'textarea', disabled: !capabilities.canEdit },
          ],
          action: capabilities.canEdit
            ? {
                label: 'Aplicar bloqueo',
                onClick: () =>
                  toast({
                    title: 'Bloqueo creado',
                    description: 'La agenda excluira el espacio durante la ventana tecnica.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canEdit ? undefined : 'Solo puedes revisar los cierres tecnicos ya programados.',
        },
        sections: [
          {
            title: 'Ventanas tecnicas',
            items: MAINTENANCE_BLOCKS.map((row) => ({
              title: row.space,
              subtitle: row.range,
              detail: row.reason,
              meta: ['Requiere reprogramacion automatica'],
              status: 'Bloqueado',
              tone: 'rose',
            })),
          },
        ],
      };

    // M06-11: Check-in y check-out - confirma uso real y liberacion del espacio.
    case 'm06_check_in_out':
      return {
        title: 'Check-in / Check-out',
        summary: 'Registra la entrada, salida y estado operativo de cada reserva del dia.',
        icon: CalendarClock,
        metrics: [
          { label: 'Reservas de hoy', value: String(confirmedReservations.length), helper: 'Agenda confirmada', tone: 'blue' },
          { label: 'En curso', value: '2', helper: 'Con check-in activo', tone: 'emerald' },
          { label: 'Pendiente salida', value: '1', helper: 'Requiere cierre', tone: 'amber' },
          { label: 'Porteria habilitada', value: roleId === 'porteria' ? 'Si' : 'No', helper: 'Operacion del turno', tone: 'violet' },
        ],
        composer: {
          title: 'Registrar novedad operativa',
          description: 'Usa este registro para entrada, salida o comentario de inspeccion.',
          fields: [
            { label: 'Reserva', placeholder: 'Ej: RES-2205', disabled: !capabilities.canCreate },
            { label: 'Accion', placeholder: 'Check-in / Check-out', disabled: !capabilities.canCreate },
            { label: 'Responsable', placeholder: 'Ej: Porteria turno B', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Detalle del estado del espacio', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Registrar movimiento',
                onClick: () =>
                  toast({
                    title: 'Movimiento guardado',
                    description: 'La bitacora de uso del espacio fue actualizada.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Solo puedes revisar el estado operativo de las reservas.',
        },
        sections: [
          {
            title: 'Seguimiento del dia',
            items: confirmedReservations.slice(0, 4).map((reservation, index) => ({
              title: `${reservation.area} - ${reservation.timeSlot}`,
              subtitle: `${reservation.resident} | ${reservation.unit}`,
              detail: index === 0 ? 'Check-in confirmado con porteria.' : 'Pendiente de validacion operativa.',
              meta: [reservation.date],
              status: index === 0 ? 'En uso' : 'Por iniciar',
              tone: index === 0 ? 'emerald' : 'amber',
            })),
          },
        ],
      };

    // M06-12: Evidencia del estado del espacio - soporta inspecciones antes y despues del uso.
    case 'm06_space_condition_evidence':
      return {
        title: 'Evidencia del estado del espacio',
        summary: 'Conserva fotos, notas y hallazgos para la entrega y devolucion de la zona comun.',
        icon: Camera,
        metrics: [
          { label: 'Inspecciones cargadas', value: String(EVIDENCE_ROWS.length), helper: 'Ultimos 7 dias', tone: 'blue' },
          { label: 'Pendientes de cierre', value: '1', helper: 'Falta evidencia final', tone: 'amber' },
          { label: 'Con novedad', value: '1', helper: 'Requiere seguimiento', tone: 'rose' },
          { label: 'Conformes', value: '5', helper: 'Sin hallazgos', tone: 'emerald' },
        ],
        composer: {
          title: 'Nueva evidencia',
          description: 'Registra el tipo de captura y el comentario asociado a la reserva.',
          fields: [
            { label: 'Reserva', placeholder: 'Ej: RES-2209', disabled: !capabilities.canCreate },
            { label: 'Momento', placeholder: 'Antes / Durante / Despues', disabled: !capabilities.canCreate },
            { label: 'Responsable', placeholder: 'Ej: Porteria PM', disabled: !capabilities.canCreate },
            { label: 'Observacion', placeholder: 'Hallazgo o conformidad', type: 'textarea', disabled: !capabilities.canCreate },
          ],
          action: capabilities.canCreate
            ? {
                label: 'Guardar evidencia',
                onClick: () =>
                  toast({
                    title: 'Evidencia registrada',
                    description: 'La inspeccion quedo asociada a la reserva seleccionada.',
                  }),
              }
            : undefined,
          disabledMessage: capabilities.canCreate ? undefined : 'Esta vista conserva la evidencia en modo consulta.',
        },
        sections: [
          {
            title: 'Historial de inspeccion',
            items: EVIDENCE_ROWS.map((row) => ({
              title: `${row.space} - ${row.reservation}`,
              subtitle: `${row.unit} | ${row.capture}`,
              detail: row.status,
              meta: ['Uso de camara y nota digital'],
              status: 'Con soporte',
              tone: 'blue',
            })),
          },
        ],
      };

    // M06-13: Historial de reservas - consolida trazabilidad por residente o unidad.
    case 'm06_reservation_history':
      return {
        title: 'Historial de reservas por unidad',
        summary: 'Consulta la trazabilidad historica de uso segun visibilidad del perfil activo.',
        icon: FileClock,
        metrics: [
          { label: 'Reservas visibles', value: String(visibleReservations.length), helper: isResidentProfile ? 'Filtradas para tu perfil' : 'Historial del conjunto', tone: 'blue' },
          { label: 'Confirmadas', value: String(visibleReservations.filter((reservation) => reservation.status === 'confirmed').length), helper: 'Con uso aprobado', tone: 'emerald' },
          { label: 'Canceladas', value: String(visibleReservations.filter((reservation) => reservation.status === 'cancelled').length), helper: 'Con cierre registrado', tone: 'amber' },
          { label: 'Cobertura', value: '12 meses', helper: 'Ventana de consulta', tone: 'violet' },
        ],
        sections: [
          {
            title: isResidentProfile ? 'Mi historial' : 'Historial consolidado',
            description: isResidentProfile
              ? 'La vista se filtra automaticamente a tus reservas visibles.'
              : 'Consulta trazabilidad por unidad, residente y espacio.',
            items: visibleReservations.slice(0, 6).map((reservation) => ({
              title: `${reservation.area} - ${reservation.date}`,
              subtitle: `${reservation.resident} | ${reservation.unit}`,
              detail: `Franja ${reservation.timeSlot}.`,
              meta: [reservation.status],
              status: reservation.status === 'confirmed' ? 'Cerrada' : 'Seguimiento',
              tone: reservation.status === 'confirmed' ? 'emerald' : 'amber',
            })),
          },
        ],
        footerActions: [
          {
            label: 'Descargar reporte',
            variant: 'outline',
            tone: 'slate',
            onClick: () =>
              toast({
                title: 'Reporte preparado',
                description: 'El historial visible quedo listo para exportacion.',
              }),
          },
        ],
      };

    // M06-14: Analitica de uso - mide demanda, ocupacion y recaudo de las zonas comunes.
    case 'm06_space_usage_analytics':
      return {
        title: 'Analitica de uso de espacios',
        summary: 'Identifica demanda, saturacion, recaudo y franjas con mayor ocupacion.',
        icon: TrendingUp,
        metrics: [
          { label: 'Ocupacion promedio', value: '74%', helper: 'Ultimos 30 dias', tone: 'blue' },
          { label: 'Franja pico', value: '18:00 - 22:00', helper: 'Mayor demanda', tone: 'violet' },
          { label: 'Recaudo estimado', value: `$${totalRevenue.toLocaleString()}`, helper: 'Consolidado mensual', tone: 'emerald' },
          { label: 'Espacio mas usado', value: 'Salon social', helper: 'Por numero de reservas', tone: 'amber' },
        ],
        sections: [
          {
            title: 'Ranking operativo',
            items: condoConfig.commonAreas.slice(0, 5).map((area, index) => ({
              title: area.name,
              subtitle: `${Math.max(3, 8 - index)} reservas esta semana`,
              detail: `Capacidad ${area.capacity} personas.`,
              meta: [index === 0 ? 'Mayor demanda' : 'Uso estable'],
              status: index < 2 ? 'Prioritario' : 'Regular',
              tone: index < 2 ? 'violet' : 'blue',
            })),
          },
          {
            title: 'Recomendaciones sugeridas',
            items: [
              {
                title: 'Abrir franja extendida para BBQ',
                subtitle: 'La demanda supera el 80% los fines de semana.',
                detail: 'Revisar cupos y costo diferencial para sabados.',
                meta: ['Impacto en recaudo'],
                status: 'Sugerencia IA',
                tone: 'emerald',
              },
              {
                title: 'Reducir mantenimiento en horario pico',
                subtitle: 'Gimnasio y salon coinciden con mayor uso vespertino.',
                detail: 'Mover cierres preventivos a la franja de 06:00.',
                meta: ['Mejora disponibilidad'],
                status: 'Analisis operativo',
                tone: 'amber',
              },
            ],
          },
        ],
      };
  }
};

export const ReservationFeatureAction = (props: FeatureActionProps) => {
  const workspace = getReservationWorkspace(props.featureId as ReservationFeatureId, props);

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
      {workspace.notices?.map((notice) => (
        <FeatureSectionCard key={notice.title} title={notice.title}>
          <p className="text-sm text-slate-600">{notice.detail}</p>
        </FeatureSectionCard>
      ))}

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
