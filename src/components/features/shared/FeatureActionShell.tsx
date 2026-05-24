import type { ReactNode } from 'react';
import type { AccessLevel } from '@/types/roles';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Eye, PencilLine, ShieldCheck, UserRound } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Tone = 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet';

interface ToneStyles {
  panel: string;
  border: string;
  text: string;
  badge: string;
  icon: string;
}

const TONE_MAP: Record<Tone, ToneStyles> = {
  slate: {
    panel: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-700',
    icon: 'text-slate-600',
  },
  blue: {
    panel: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    icon: 'text-blue-600',
  },
  emerald: {
    panel: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: 'text-emerald-600',
  },
  amber: {
    panel: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    icon: 'text-amber-600',
  },
  rose: {
    panel: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    icon: 'text-rose-600',
  },
  violet: {
    panel: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    icon: 'text-violet-600',
  },
};

export interface FeatureMetric {
  label: string;
  value: string;
  helper?: string;
  tone?: Tone;
}

export interface FeatureItem {
  title: string;
  subtitle?: string;
  detail?: string;
  meta?: string[];
  status?: string;
  tone?: Tone;
}

export interface FeatureActionButton {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'outline';
  tone?: Tone;
  disabled?: boolean;
}

export interface FeatureFormField {
  label: string;
  placeholder: string;
  type?: 'text' | 'number' | 'date' | 'textarea';
  defaultValue?: string;
  disabled?: boolean;
}

export interface FeatureActionCapabilities {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  isReadOnly: boolean;
  isOwnDataOnly: boolean;
}

const ACCESS_TONE: Record<AccessLevel, Tone> = {
  FULL_ACCESS: 'emerald',
  LIMITED: 'blue',
  READ_ONLY: 'amber',
  OWN_DATA_ONLY: 'violet',
  NONE: 'rose',
};

const ACCESS_LABEL: Record<AccessLevel, string> = {
  FULL_ACCESS: 'Acceso completo',
  LIMITED: 'Acceso parcial',
  READ_ONLY: 'Solo lectura',
  OWN_DATA_ONLY: 'Solo tus datos',
  NONE: 'Sin acceso',
};

const ACCESS_COPY: Record<AccessLevel, string> = {
  FULL_ACCESS: 'Puedes consultar, crear, editar y cerrar el flujo completo.',
  LIMITED: 'Puedes operar el flujo principal con restricciones del perfil activo.',
  READ_ONLY: 'Puedes revisar la informacion, pero no modificarla ni crear nuevos registros.',
  OWN_DATA_ONLY: 'La vista se limita a tus datos y a las acciones permitidas para tu perfil.',
  NONE: 'Esta funcion no esta disponible para tu perfil actual.',
};

const ACCESS_ICON: Record<AccessLevel, LucideIcon> = {
  FULL_ACCESS: ShieldCheck,
  LIMITED: PencilLine,
  READ_ONLY: Eye,
  OWN_DATA_ONLY: UserRound,
  NONE: AlertTriangle,
};

export const getFeatureCapabilities = (accessLevel: AccessLevel): FeatureActionCapabilities => ({
  canCreate:
    accessLevel === 'FULL_ACCESS' ||
    accessLevel === 'LIMITED' ||
    accessLevel === 'OWN_DATA_ONLY',
  canEdit:
    accessLevel === 'FULL_ACCESS' ||
    accessLevel === 'LIMITED' ||
    accessLevel === 'OWN_DATA_ONLY',
  canDelete: accessLevel === 'FULL_ACCESS',
  canView: accessLevel !== 'NONE',
  isReadOnly: accessLevel === 'READ_ONLY',
  isOwnDataOnly: accessLevel === 'OWN_DATA_ONLY',
});

export const FeatureActionShell = ({
  onClose,
  title,
  summary,
  moduleCode,
  accessLevel,
  icon: Icon,
  children,
  footer,
}: {
  onClose: () => void;
  title: string;
  summary: string;
  moduleCode: string;
  accessLevel: AccessLevel;
  icon: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
}) => {
  const tone = TONE_MAP[ACCESS_TONE[accessLevel]];
  const AccessIcon = ACCESS_ICON[accessLevel];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#0D2B4E] p-3 text-white shadow-sm">
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-left text-2xl">{title}</DialogTitle>
              <DialogDescription className="text-left text-sm text-slate-600">
                {summary}
              </DialogDescription>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {moduleCode}
              </p>
            </div>
          </div>

          <div className={cn('rounded-2xl border p-4', tone.panel, tone.border)}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AccessIcon className={cn('mt-0.5 h-5 w-5', tone.icon)} />
                <div className="space-y-1">
                  <p className={cn('text-sm font-semibold', tone.text)}>
                    {ACCESS_LABEL[accessLevel]}
                  </p>
                  <p className="text-sm text-slate-600">{ACCESS_COPY[accessLevel]}</p>
                </div>
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', tone.badge)}>
                Perfil operativo
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">{children}</div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-4">
          {footer}
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FeatureMetricGrid = ({ metrics }: { metrics: FeatureMetric[] }) => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
    {metrics.map((metric) => {
      const tone = TONE_MAP[metric.tone ?? 'slate'];

      return (
        <div
          key={`${metric.label}-${metric.value}`}
          className={cn('rounded-2xl border p-4', tone.panel, tone.border)}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {metric.label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
          {metric.helper && <p className="mt-1 text-xs text-slate-500">{metric.helper}</p>}
        </div>
      );
    })}
  </div>
);

export const FeatureSectionCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 space-y-1">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    {children}
  </section>
);

export const FeatureItemList = ({ items }: { items: FeatureItem[] }) => (
  <div className="space-y-3">
    {items.map((item, index) => {
      const tone = TONE_MAP[item.tone ?? 'slate'];

      return (
        <div
          key={`${item.title}-${index}`}
          className={cn('rounded-2xl border p-4', tone.panel, tone.border)}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              {item.subtitle && <p className="text-sm text-slate-600">{item.subtitle}</p>}
              {item.detail && <p className="text-sm text-slate-500">{item.detail}</p>}
            </div>
            {item.status && (
              <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', tone.badge)}>
                {item.status}
              </span>
            )}
          </div>
          {!!item.meta?.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.meta.map((entry) => (
                <span
                  key={entry}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {entry}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export const FeatureFormCard = ({
  title,
  description,
  fields,
  disabledMessage,
  action,
}: {
  title: string;
  description?: string;
  fields: FeatureFormField[];
  disabledMessage?: string;
  action?: FeatureActionButton;
}) => (
  <FeatureSectionCard title={title} description={description}>
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <label key={`${field.label}-${field.placeholder}`} className="space-y-2">
          <span className="text-sm font-medium text-slate-700">{field.label}</span>
          {field.type === 'textarea' ? (
            <textarea
              rows={4}
              defaultValue={field.defaultValue}
              disabled={field.disabled}
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#1E7EC8]"
            />
          ) : (
            <input
              type={field.type ?? 'text'}
              defaultValue={field.defaultValue}
              disabled={field.disabled}
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#1E7EC8]"
            />
          )}
        </label>
      ))}
    </div>
    {(action || disabledMessage) && (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {disabledMessage ? <p className="text-xs text-slate-500">{disabledMessage}</p> : <span />}
        {action && (
          <FeatureActionButtons
            actions={[
              {
                ...action,
                variant: action.variant ?? 'default',
              },
            ]}
          />
        )}
      </div>
    )}
  </FeatureSectionCard>
);

export const FeatureActionButtons = ({ actions }: { actions: FeatureActionButton[] }) => (
  <div className="flex flex-wrap items-center gap-3">
    {actions.map((action) => {
      const tone = TONE_MAP[action.tone ?? (action.variant === 'outline' ? 'slate' : 'blue')];

      return (
        <Button
          key={action.label}
          variant={action.variant ?? 'default'}
          disabled={action.disabled}
          onClick={action.onClick}
          className={cn(
            action.variant === 'outline' && tone.text,
            action.variant === 'outline' && tone.border,
          )}
        >
          {action.label}
        </Button>
      );
    })}
  </div>
);
