import { useMemo, useState } from 'react';
import type { AccessLevel, RoleId } from '@/types/roles';
import { useAuthStore } from '@/store/useAuthStore';
import { FeatureActionButtons, FeatureSectionCard } from '@/components/features/shared/FeatureActionShell';
import { FeatureWorkspaceTable, type FeatureTableColumn } from '@/components/features/shared/FeatureWorkspaceTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/metrics';
import { downloadMockPdf } from '@/utils/mockPdf';

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

type AccountStatus = 'Al dia' | 'Pendiente del mes' | 'En mora' | 'Acuerdo vigente';
type HistoryStatus = 'Pagado' | 'Pendiente' | 'Vencido' | 'Parcial';

interface AccountRow {
  id: string;
  resident: string;
  role: 'Administrador' | 'Propietario' | 'Arrendatario';
  unit: string;
  currentCharge: number;
  overdueBalance: number;
  totalBalance: number;
  nextDueDate: string;
  status: AccountStatus;
  lastReceipt: string;
  blockedReservations: boolean;
  lastNotice: string;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
}

interface PaymentHistoryRow {
  id: string;
  resident: string;
  unit: string;
  period: string;
  concept: string;
  amount: number;
  paidAmount: number;
  status: HistoryStatus;
  channel: 'PSE' | 'Transferencia' | 'Tarjeta' | 'Caja';
  paidDate: string;
  receipt: string;
}

interface AgreementRow {
  id: string;
  resident: string;
  unit: string;
  total: number;
  installmentCount: number;
  nextInstallment: string;
  status: 'Vigente' | 'En revision' | 'Cumplido';
}

interface PromiseRow {
  id: string;
  resident: string;
  unit: string;
  promisedDate: string;
  amount: number;
  status: 'Pendiente' | 'Cumplida' | 'Vencida';
}

interface BatchRow {
  id: string;
  source: string;
  amount: number;
  referenceDate: string;
  status: 'Pendiente' | 'Conciliado' | 'Con novedad';
}

interface ChannelRow {
  id: string;
  channel: string;
  share: string;
  volume: number;
  fee: string;
  status: 'Activo' | 'Seguimiento';
}

interface CollectionLogRow {
  id: string;
  resident: string;
  unit: string;
  action: string;
  date: string;
  owner: string;
  result: string;
}

interface NoteRow {
  id: string;
  resident: string;
  unit: string;
  type: 'Nota credito' | 'Nota debito';
  amount: number;
  concept: string;
  status: 'Aplicada' | 'Pendiente';
}

interface ConnectorRow {
  id: string;
  bank: string;
  integration: string;
  lastSync: string;
  status: 'Operativa' | 'Revision manual';
}

interface CampaignRow {
  id: string;
  campaign: string;
  target: number;
  collected: number;
  dueDate: string;
}

const INITIAL_ACCOUNTS: AccountRow[] = [
  {
    id: 'acc-luis',
    resident: 'Luis Torres',
    role: 'Arrendatario',
    unit: 'Torre B - 504',
    currentCharge: 690000,
    overdueBalance: 1290000,
    totalBalance: 1980000,
    nextDueDate: '2026-05-31',
    status: 'En mora',
    lastReceipt: 'REC-2026-0311',
    blockedReservations: true,
    lastNotice: '2026-05-20',
    riskLevel: 'Alto',
  },
  {
    id: 'acc-laura',
    resident: 'Laura Sanchez',
    role: 'Propietario',
    unit: 'Torre A - 302',
    currentCharge: 0,
    overdueBalance: 1245000,
    totalBalance: 1245000,
    nextDueDate: '2026-05-10',
    status: 'En mora',
    lastReceipt: 'REC-2026-0198',
    blockedReservations: true,
    lastNotice: '2026-05-17',
    riskLevel: 'Alto',
  },
  {
    id: 'acc-javier',
    resident: 'Javier Pardo',
    role: 'Propietario',
    unit: 'Torre C - 1102',
    currentCharge: 780000,
    overdueBalance: 1560000,
    totalBalance: 2340000,
    nextDueDate: '2026-05-08',
    status: 'En mora',
    lastReceipt: 'REC-2026-0224',
    blockedReservations: true,
    lastNotice: '2026-05-18',
    riskLevel: 'Alto',
  },
  {
    id: 'acc-monica',
    resident: 'Monica Ospina',
    role: 'Arrendatario',
    unit: 'Torre A - 1203',
    currentCharge: 0,
    overdueBalance: 875000,
    totalBalance: 875000,
    nextDueDate: '2026-05-12',
    status: 'En mora',
    lastReceipt: 'REC-2026-0241',
    blockedReservations: false,
    lastNotice: '2026-05-16',
    riskLevel: 'Medio',
  },
  {
    id: 'acc-carolina',
    resident: 'Carolina Mejia',
    role: 'Propietario',
    unit: 'Torre D - 401',
    currentCharge: 710000,
    overdueBalance: 0,
    totalBalance: 710000,
    nextDueDate: '2026-05-30',
    status: 'Pendiente del mes',
    lastReceipt: 'REC-2026-0403',
    blockedReservations: false,
    lastNotice: '2026-05-02',
    riskLevel: 'Bajo',
  },
  {
    id: 'acc-diego',
    resident: 'Diego Bernal',
    role: 'Propietario',
    unit: 'Torre B - 203',
    currentCharge: 0,
    overdueBalance: 930000,
    totalBalance: 930000,
    nextDueDate: '2026-06-05',
    status: 'Acuerdo vigente',
    lastReceipt: 'REC-2026-0380',
    blockedReservations: false,
    lastNotice: '2026-05-14',
    riskLevel: 'Medio',
  },
];

const INITIAL_HISTORY: PaymentHistoryRow[] = [
  { id: 'hist-01', resident: 'Luis Torres', unit: 'Torre B - 504', period: '2025-12', concept: 'Administracion', amount: 650000, paidAmount: 650000, status: 'Pagado', channel: 'PSE', paidDate: '2025-12-05', receipt: 'REC-2025-5512' },
  { id: 'hist-02', resident: 'Luis Torres', unit: 'Torre B - 504', period: '2026-01', concept: 'Administracion', amount: 660000, paidAmount: 660000, status: 'Pagado', channel: 'Transferencia', paidDate: '2026-01-07', receipt: 'REC-2026-0088' },
  { id: 'hist-03', resident: 'Luis Torres', unit: 'Torre B - 504', period: '2026-02', concept: 'Administracion', amount: 660000, paidAmount: 0, status: 'Vencido', channel: 'PSE', paidDate: '-', receipt: 'REC-2026-0147' },
  { id: 'hist-04', resident: 'Luis Torres', unit: 'Torre B - 504', period: '2026-03', concept: 'Administracion', amount: 670000, paidAmount: 320000, status: 'Parcial', channel: 'Tarjeta', paidDate: '2026-03-14', receipt: 'REC-2026-0311' },
  { id: 'hist-05', resident: 'Luis Torres', unit: 'Torre B - 504', period: '2026-04', concept: 'Administracion', amount: 670000, paidAmount: 0, status: 'Vencido', channel: 'PSE', paidDate: '-', receipt: 'REC-2026-0361' },
  { id: 'hist-06', resident: 'Luis Torres', unit: 'Torre B - 504', period: '2026-05', concept: 'Administracion', amount: 690000, paidAmount: 0, status: 'Pendiente', channel: 'PSE', paidDate: '-', receipt: 'REC-2026-0454' },
  { id: 'hist-07', resident: 'Laura Sanchez', unit: 'Torre A - 302', period: '2026-05', concept: 'Administracion', amount: 1245000, paidAmount: 0, status: 'Vencido', channel: 'Transferencia', paidDate: '-', receipt: 'REC-2026-0422' },
  { id: 'hist-08', resident: 'Javier Pardo', unit: 'Torre C - 1102', period: '2026-05', concept: 'Administracion y fondo de imprevistos', amount: 780000, paidAmount: 0, status: 'Pendiente', channel: 'PSE', paidDate: '-', receipt: 'REC-2026-0471' },
  { id: 'hist-09', resident: 'Monica Ospina', unit: 'Torre A - 1203', period: '2026-04', concept: 'Administracion', amount: 875000, paidAmount: 0, status: 'Vencido', channel: 'Caja', paidDate: '-', receipt: 'REC-2026-0375' },
  { id: 'hist-10', resident: 'Carolina Mejia', unit: 'Torre D - 401', period: '2026-04', concept: 'Administracion', amount: 700000, paidAmount: 700000, status: 'Pagado', channel: 'PSE', paidDate: '2026-04-04', receipt: 'REC-2026-0403' },
  { id: 'hist-11', resident: 'Diego Bernal', unit: 'Torre B - 203', period: '2026-05', concept: 'Cuota acuerdo', amount: 310000, paidAmount: 310000, status: 'Pagado', channel: 'Transferencia', paidDate: '2026-05-08', receipt: 'REC-2026-0438' },
  { id: 'hist-12', resident: 'Diego Bernal', unit: 'Torre B - 203', period: '2026-06', concept: 'Cuota acuerdo', amount: 310000, paidAmount: 0, status: 'Pendiente', channel: 'Transferencia', paidDate: '-', receipt: 'REC-2026-0528' },
];

const INITIAL_AGREEMENTS: AgreementRow[] = [
  { id: 'agr-01', resident: 'Diego Bernal', unit: 'Torre B - 203', total: 930000, installmentCount: 3, nextInstallment: '2026-06-05', status: 'Vigente' },
];

const INITIAL_PROMISES: PromiseRow[] = [
  { id: 'pro-01', resident: 'Luis Torres', unit: 'Torre B - 504', promisedDate: '2026-05-29', amount: 450000, status: 'Pendiente' },
  { id: 'pro-02', resident: 'Monica Ospina', unit: 'Torre A - 1203', promisedDate: '2026-05-27', amount: 300000, status: 'Vencida' },
];

const INITIAL_BATCHES: BatchRow[] = [
  { id: 'bat-01', source: 'Bancolombia PSE', amount: 12430000, referenceDate: '2026-05-24', status: 'Pendiente' },
  { id: 'bat-02', source: 'Davivienda recaudo QR', amount: 6820000, referenceDate: '2026-05-24', status: 'Conciliado' },
  { id: 'bat-03', source: 'Caja administracion', amount: 1460000, referenceDate: '2026-05-25', status: 'Con novedad' },
];

const INITIAL_CHANNELS: ChannelRow[] = [
  { id: 'cha-01', channel: 'PSE', share: '46%', volume: 21800000, fee: '1.9%', status: 'Activo' },
  { id: 'cha-02', channel: 'Transferencia', share: '24%', volume: 11300000, fee: '0%', status: 'Seguimiento' },
  { id: 'cha-03', channel: 'Tarjeta', share: '18%', volume: 8400000, fee: '2.8%', status: 'Activo' },
  { id: 'cha-04', channel: 'Caja de administracion', share: '12%', volume: 5600000, fee: '0%', status: 'Activo' },
];

const INITIAL_COLLECTION_LOG: CollectionLogRow[] = [
  { id: 'log-01', resident: 'Luis Torres', unit: 'Torre B - 504', action: 'Recordatorio por WhatsApp', date: '2026-05-20', owner: 'Sara Medina', result: 'Leido a las 09:12' },
  { id: 'log-02', resident: 'Laura Sanchez', unit: 'Torre A - 302', action: 'Llamada de seguimiento', date: '2026-05-19', owner: 'Jorge Rios', result: 'Solicito acuerdo en 48 horas' },
  { id: 'log-03', resident: 'Javier Pardo', unit: 'Torre C - 1102', action: 'Carta PDF enviada', date: '2026-05-18', owner: 'Lina Perez', result: 'Pendiente confirmacion' },
  { id: 'log-04', resident: 'Monica Ospina', unit: 'Torre A - 1203', action: 'Aviso de mora temprano', date: '2026-05-16', owner: 'Sara Medina', result: 'Promesa de pago registrada' },
];

const INITIAL_NOTES: NoteRow[] = [
  { id: 'note-01', resident: 'Carolina Mejia', unit: 'Torre D - 401', type: 'Nota credito', amount: 35000, concept: 'Descuento por pronto pago', status: 'Aplicada' },
  { id: 'note-02', resident: 'Luis Torres', unit: 'Torre B - 504', type: 'Nota debito', amount: 18000, concept: 'Interes de mora abril', status: 'Pendiente' },
];

const INITIAL_CONNECTORS: ConnectorRow[] = [
  { id: 'con-01', bank: 'Bancolombia', integration: 'Webhook PSE', lastSync: '2026-05-25 08:42', status: 'Operativa' },
  { id: 'con-02', bank: 'Davivienda', integration: 'Archivo plano', lastSync: '2026-05-25 07:55', status: 'Revision manual' },
];

const INITIAL_CAMPAIGNS: CampaignRow[] = [
  { id: 'cam-01', campaign: 'Fondo impermeabilizacion torre B', target: 18000000, collected: 12600000, dueDate: '2026-06-15' },
  { id: 'cam-02', campaign: 'Renovacion de gimnasio', target: 9500000, collected: 6100000, dueDate: '2026-07-01' },
];

const PERIOD_OPTIONS = ['Todos', '2026-05', '2026-04', '2026-03', '2026-02', '2026-01', '2025-12'] as const;

const statusPill = (value: string) => {
  const tone =
    value === 'Pagado' || value === 'Vigente' || value === 'Activo' || value === 'Operativa' || value === 'Cumplida' || value === 'Al dia'
      ? 'bg-emerald-100 text-emerald-700'
      : value === 'Pendiente' || value === 'Parcial' || value === 'Seguimiento' || value === 'Revision manual' || value === 'Pendiente del mes'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
};

const formatShortDate = (value: string) =>
  value === '-' ? value : new Date(value).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });

export const PaymentsFeatureWorkspace = ({
  featureId,
  accessLevel,
  roleId,
}: {
  featureId: PaymentFeatureId;
  accessLevel: AccessLevel;
  roleId: RoleId;
}) => {
  const user = useAuthStore((state) => state.user);
  const [accounts, setAccounts] = useState<AccountRow[]>(INITIAL_ACCOUNTS);
  const [history, setHistory] = useState<PaymentHistoryRow[]>(INITIAL_HISTORY);
  const [agreements, setAgreements] = useState<AgreementRow[]>(INITIAL_AGREEMENTS);
  const [promises, setPromises] = useState<PromiseRow[]>(INITIAL_PROMISES);
  const [batches, setBatches] = useState<BatchRow[]>(INITIAL_BATCHES);
  const [channels, setChannels] = useState<ChannelRow[]>(INITIAL_CHANNELS);
  const [collectionLog, setCollectionLog] = useState<CollectionLogRow[]>(INITIAL_COLLECTION_LOG);
  const [notes, setNotes] = useState<NoteRow[]>(INITIAL_NOTES);
  const [connectors, setConnectors] = useState<ConnectorRow[]>(INITIAL_CONNECTORS);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>(INITIAL_CAMPAIGNS);
  const [search, setSearch] = useState('');
  const [periodFilter, setPeriodFilter] = useState<(typeof PERIOD_OPTIONS)[number]>('Todos');
  const [refinancingTotal, setRefinancingTotal] = useState('1980000');
  const [refinancingInstallments, setRefinancingInstallments] = useState('6');
  const [simulatedInstallment, setSimulatedInstallment] = useState<number | null>(null);

  const isResidentView =
    roleId === 'arrendatario' ||
    roleId === 'propietario' ||
    accessLevel === 'OWN_DATA_ONLY';

  const residentFallback =
    roleId === 'propietario'
      ? { resident: 'Carolina Mejia', unit: 'Torre D - 401' }
      : { resident: 'Luis Torres', unit: 'Torre B - 504' };

  const activeResident = accounts.find((row) => row.resident === user?.name)
    ? user?.name ?? residentFallback.resident
    : residentFallback.resident;

  const activeUnit = accounts.find((row) => row.resident === user?.name)?.unit ?? residentFallback.unit;

  const visibleAccounts = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return accounts.filter((row) => {
      const scopeMatch = !isResidentView || row.resident === activeResident || row.unit === activeUnit;
      const searchMatch =
        !normalized ||
        row.resident.toLowerCase().includes(normalized) ||
        row.unit.toLowerCase().includes(normalized);

      return scopeMatch && searchMatch;
    });
  }, [accounts, activeResident, activeUnit, isResidentView, search]);

  const visibleHistory = useMemo(() => {
    return history.filter((row) => {
      const scopeMatch = !isResidentView || row.resident === activeResident || row.unit === activeUnit;
      const periodMatch = periodFilter === 'Todos' || row.period === periodFilter;
      return scopeMatch && periodMatch;
    });
  }, [activeResident, activeUnit, history, isResidentView, periodFilter]);

  const visibleAgreements = useMemo(
    () =>
      agreements.filter(
        (row) => !isResidentView || row.resident === activeResident || row.unit === activeUnit,
      ),
    [activeResident, activeUnit, agreements, isResidentView],
  );

  const visiblePromises = useMemo(
    () =>
      promises.filter(
        (row) => !isResidentView || row.resident === activeResident || row.unit === activeUnit,
      ),
    [activeResident, activeUnit, isResidentView, promises],
  );

  const visibleNotes = useMemo(
    () =>
      notes.filter((row) => !isResidentView || row.resident === activeResident || row.unit === activeUnit),
    [activeResident, activeUnit, isResidentView, notes],
  );

  const visibleCollectionLog = useMemo(
    () =>
      collectionLog.filter(
        (row) => !isResidentView || row.resident === activeResident || row.unit === activeUnit,
      ),
    [activeResident, activeUnit, collectionLog, isResidentView],
  );

  const currentMorosos = useMemo(
    () => visibleAccounts.filter((row) => row.overdueBalance > 0).sort((left, right) => right.totalBalance - left.totalBalance),
    [visibleAccounts],
  );

  const totals = useMemo(
    () => ({
      visibleDebt: visibleAccounts.reduce((sum, row) => sum + row.totalBalance, 0),
      overdue: currentMorosos.reduce((sum, row) => sum + row.overdueBalance, 0),
      collected: visibleHistory
        .filter((row) => row.status === 'Pagado' || row.status === 'Parcial')
        .reduce((sum, row) => sum + row.paidAmount, 0),
    }),
    [currentMorosos, visibleAccounts, visibleHistory],
  );

  const appendCollectionLog = (resident: string, unit: string, action: string, result: string) => {
    setCollectionLog((current) => [
      {
        id: `log-${Date.now()}`,
        resident,
        unit,
        action,
        date: '2026-05-25',
        owner: roleId === 'admin' ? 'Administracion' : resident,
        result,
      },
      ...current,
    ]);
  };

  const handleDownloadReceipt = (row: PaymentHistoryRow) => {
    downloadMockPdf({
      fileName: `recibo-${row.receipt}.pdf`,
      title: `Recibo ${row.receipt}`,
      lines: [
        `Residente: ${row.resident}`,
        `Unidad: ${row.unit}`,
        `Periodo: ${row.period}`,
        `Concepto: ${row.concept}`,
        `Valor: ${formatCurrency(row.amount)}`,
        `Pagado: ${formatCurrency(row.paidAmount)}`,
      ],
    });

    toast({
      title: 'Recibo preparado',
      description: `Se descargo el soporte ${row.receipt}.`,
    });
  };

  const handleCreateAgreement = (row: AccountRow) => {
    setAccounts((current) =>
      current.map((entry) =>
        entry.id === row.id
          ? { ...entry, status: 'Acuerdo vigente', blockedReservations: false }
          : entry,
      ),
    );
    setAgreements((current) => [
      {
        id: `agr-${Date.now()}`,
        resident: row.resident,
        unit: row.unit,
        total: row.totalBalance,
        installmentCount: 4,
        nextInstallment: '2026-06-10',
        status: 'En revision',
      },
      ...current,
    ]);
    appendCollectionLog(row.resident, row.unit, 'Acuerdo de pago', 'Plan en 4 cuotas creado en la vista.');
    toast({
      title: 'Acuerdo creado',
      description: `${row.resident} quedo con plan sugerido para su saldo actual.`,
    });
  };

  const handleRegisterPartialPayment = (row: AccountRow) => {
    const paymentValue = Math.min(250000, row.totalBalance);

    setAccounts((current) =>
      current.map((entry) => {
        if (entry.id !== row.id) {
          return entry;
        }

        const nextOverdue = Math.max(0, entry.overdueBalance - paymentValue);
        const nextTotal = Math.max(0, entry.totalBalance - paymentValue);
        const nextStatus: AccountStatus =
          nextTotal === 0
            ? 'Al dia'
            : nextOverdue === 0
            ? 'Pendiente del mes'
            : entry.status;

        return {
          ...entry,
          overdueBalance: nextOverdue,
          totalBalance: nextTotal,
          status: nextStatus,
        };
      }),
    );

    setHistory((current) => [
      {
        id: `hist-${Date.now()}`,
        resident: row.resident,
        unit: row.unit,
        period: '2026-05',
        concept: 'Abono parcial registrado en cartera',
        amount: paymentValue,
        paidAmount: paymentValue,
        status: 'Parcial',
        channel: 'PSE',
        paidDate: '2026-05-25',
        receipt: `REC-2026-${String(Date.now()).slice(-4)}`,
      },
      ...current,
    ]);

    appendCollectionLog(row.resident, row.unit, 'Abono parcial', `Se registro un abono por ${formatCurrency(paymentValue)}.`);
    toast({
      title: 'Abono aplicado',
      description: `${row.resident} redujo su saldo en ${formatCurrency(paymentValue)}.`,
    });
  };

  const handleSendReminder = (row: AccountRow) => {
    setAccounts((current) =>
      current.map((entry) =>
        entry.id === row.id ? { ...entry, lastNotice: '2026-05-25' } : entry,
      ),
    );
    appendCollectionLog(row.resident, row.unit, 'Recordatorio de pago', 'Mensaje enviado por correo y WhatsApp.');
    toast({
      title: 'Recordatorio enviado',
      description: `${row.resident} recibio el detalle actualizado de su saldo.`,
    });
  };

  const handleToggleReservationBlock = (row: AccountRow) => {
    setAccounts((current) =>
      current.map((entry) =>
        entry.id === row.id
          ? { ...entry, blockedReservations: !entry.blockedReservations }
          : entry,
      ),
    );

    toast({
      title: row.blockedReservations ? 'Bloqueo levantado' : 'Bloqueo activado',
      description: `La unidad ${row.unit} actualizo su restriccion operativa.`,
    });
  };

  const handlePromiseStatus = (row: PromiseRow, status: PromiseRow['status']) => {
    setPromises((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, status } : entry)),
    );
    appendCollectionLog(row.resident, row.unit, 'Promesa de pago', `Estado actualizado a ${status.toLowerCase()}.`);
  };

  const handleReconcileBatch = (row: BatchRow) => {
    setBatches((current) =>
      current.map((entry) =>
        entry.id === row.id ? { ...entry, status: 'Conciliado' } : entry,
      ),
    );
    toast({
      title: 'Lote conciliado',
      description: `${row.source} quedo cruzado con recaudo interno.`,
    });
  };

  const handleApplyNote = (row: NoteRow) => {
    setNotes((current) =>
      current.map((entry) =>
        entry.id === row.id ? { ...entry, status: 'Aplicada' } : entry,
      ),
    );
    toast({
      title: 'Ajuste aplicado',
      description: `La nota sobre ${row.unit} ya impacta el saldo visible.`,
    });
  };

  const handleSyncConnector = (row: ConnectorRow) => {
    setConnectors((current) =>
      current.map((entry) =>
        entry.id === row.id
          ? { ...entry, lastSync: '2026-05-25 10:12', status: 'Operativa' }
          : entry,
      ),
    );
    toast({
      title: 'Conector actualizado',
      description: `${row.bank} reporto sincronizacion exitosa.`,
    });
  };

  const handleRecordCampaignPayment = (row: CampaignRow) => {
    setCampaigns((current) =>
      current.map((entry) =>
        entry.id === row.id
          ? {
              ...entry,
              collected: Math.min(entry.target, entry.collected + 650000),
            }
          : entry,
      ),
    );
    toast({
      title: 'Aporte registrado',
      description: `La campana ${row.campaign} incremento su recaudo visible.`,
    });
  };

  const handleSimulateRefinancing = () => {
    const total = Number(refinancingTotal);
    const installments = Number(refinancingInstallments);

    if (!total || !installments) {
      return;
    }

    setSimulatedInstallment(Math.round(total / installments));
  };

  const accountColumns: FeatureTableColumn<AccountRow>[] = [
    {
      key: 'resident',
      header: isResidentView ? 'Tu cuenta' : 'Residente',
      cell: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{row.resident}</p>
          <p className="text-xs text-slate-500">{row.unit}</p>
        </div>
      ),
    },
    {
      key: 'balance',
      header: 'Saldo total',
      cell: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{formatCurrency(row.totalBalance)}</p>
          <p className="text-xs text-slate-500">
            Mora {formatCurrency(row.overdueBalance)}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (row) => statusPill(row.status),
    },
    {
      key: 'notice',
      header: 'Ultimo movimiento',
      cell: (row) => (
        <div className="space-y-1">
          <p>{formatShortDate(row.lastNotice)}</p>
          <p className="text-xs text-slate-500">{row.lastReceipt}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => handleSendReminder(row)}>
            Avisar
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleRegisterPartialPayment(row)}>
            Abono
          </Button>
          <Button size="sm" onClick={() => handleCreateAgreement(row)}>
            Acuerdo
          </Button>
        </div>
      ),
      align: 'right',
    },
  ];

  const historyColumns: FeatureTableColumn<PaymentHistoryRow>[] = [
    {
      key: 'period',
      header: 'Periodo',
      cell: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{row.period}</p>
          <p className="text-xs text-slate-500">{row.concept}</p>
        </div>
      ),
    },
    {
      key: 'resident',
      header: isResidentView ? 'Detalle' : 'Unidad',
      cell: (row) => (
        <div className="space-y-1">
          <p>{isResidentView ? row.unit : row.resident}</p>
          <p className="text-xs text-slate-500">{isResidentView ? row.resident : row.unit}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Valor',
      cell: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{formatCurrency(row.amount)}</p>
          <p className="text-xs text-slate-500">Pagado {formatCurrency(row.paidAmount)}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (row) => statusPill(row.status),
    },
    {
      key: 'actions',
      header: 'Soporte',
      cell: (row) => (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => handleDownloadReceipt(row)}>
            PDF
          </Button>
        </div>
      ),
      align: 'right',
    },
  ];

  const accountToolbar = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={isResidentView ? 'Buscar en tu cuenta...' : 'Buscar residente o unidad...'}
        className="md:max-w-sm"
      />
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        <span>Saldo visible:</span>
        <span className="font-semibold text-slate-900">{formatCurrency(totals.visibleDebt)}</span>
      </div>
    </div>
  );

  const historyToolbar = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-600" htmlFor="period-filter">
          Periodo
        </label>
        <select
          id="period-filter"
          value={periodFilter}
          onChange={(event) => setPeriodFilter(event.target.value as (typeof PERIOD_OPTIONS)[number])}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Recaudado en el rango: <span className="font-semibold text-slate-900">{formatCurrency(totals.collected)}</span>
      </div>
    </div>
  );

  const renderAccounts = (title: string, description: string) => (
    <FeatureWorkspaceTable
      title={title}
      description={description}
      columns={accountColumns}
      rows={visibleAccounts}
      rowKey={(row) => row.id}
      toolbar={accountToolbar}
      emptyState="No hay estados de cuenta que coincidan con el filtro actual."
    />
  );

  const renderHistory = (title: string, description: string) => (
    <FeatureWorkspaceTable
      title={title}
      description={description}
      columns={historyColumns}
      rows={visibleHistory}
      rowKey={(row) => row.id}
      toolbar={historyToolbar}
      emptyState="No hay pagos en el periodo seleccionado."
    />
  );

  const renderMorosos = (title: string, description: string) => (
    <FeatureWorkspaceTable
      title={title}
      description={description}
      rowKey={(row) => row.id}
      rows={currentMorosos}
      columns={[
        {
          key: 'resident',
          header: 'Unidad',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.unit}</p>
              <p className="text-xs text-slate-500">{row.resident}</p>
            </div>
          ),
        },
        {
          key: 'overdue',
          header: 'Mora',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{formatCurrency(row.overdueBalance)}</p>
              <p className="text-xs text-slate-500">Riesgo {row.riskLevel}</p>
            </div>
          ),
        },
        {
          key: 'block',
          header: 'Restriccion',
          cell: (row) => statusPill(row.blockedReservations ? 'Activa' : 'Libre'),
        },
        {
          key: 'actions',
          header: 'Acciones',
          cell: (row) => (
            <div className="flex flex-wrap justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => handleSendReminder(row)}>
                Notificar
              </Button>
              <Button size="sm" onClick={() => handleToggleReservationBlock(row)}>
                {row.blockedReservations ? 'Levantar bloqueo' : 'Bloquear reservas'}
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
      footer={
        <p className="text-xs text-slate-500">
          Morosos visibles: {currentMorosos.length}. Total vencido {formatCurrency(totals.overdue)}.
        </p>
      }
    />
  );

  const renderAgreements = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Tus acuerdos activos' : 'Acuerdos de pago activos'}
      description="Cada registro deja visible la proxima cuota y el estado del plan."
      rowKey={(row) => row.id}
      rows={visibleAgreements}
      columns={[
        {
          key: 'resident',
          header: isResidentView ? 'Plan' : 'Residente',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{isResidentView ? row.unit : row.resident}</p>
              <p className="text-xs text-slate-500">{isResidentView ? row.resident : row.unit}</p>
            </div>
          ),
        },
        {
          key: 'total',
          header: 'Valor',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{formatCurrency(row.total)}</p>
              <p className="text-xs text-slate-500">{row.installmentCount} cuotas</p>
            </div>
          ),
        },
        {
          key: 'next',
          header: 'Proxima cuota',
          cell: (row) => formatShortDate(row.nextInstallment),
        },
        {
          key: 'status',
          header: 'Estado',
          cell: (row) => statusPill(row.status),
        },
      ]}
    />
  );

  const renderPromises = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Tus promesas registradas' : 'Promesas de pago vigentes'}
      description="Puedes actualizar el resultado de cada compromiso y dejar la trazabilidad al dia."
      rowKey={(row) => row.id}
      rows={visiblePromises}
      columns={[
        {
          key: 'resident',
          header: isResidentView ? 'Detalle' : 'Residente',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{isResidentView ? row.promisedDate : row.resident}</p>
              <p className="text-xs text-slate-500">{row.unit}</p>
            </div>
          ),
        },
        {
          key: 'amount',
          header: 'Valor',
          cell: (row) => formatCurrency(row.amount),
        },
        {
          key: 'status',
          header: 'Estado',
          cell: (row) => statusPill(row.status),
        },
        {
          key: 'actions',
          header: 'Actualizar',
          cell: (row) => (
            <div className="flex flex-wrap justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => handlePromiseStatus(row, 'Cumplida')}>
                Cumplida
              </Button>
              <Button size="sm" onClick={() => handlePromiseStatus(row, 'Vencida')}>
                Vencida
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderCollectionLog = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Seguimiento sobre tu cuenta' : 'Historial de gestion de cartera'}
      description="Cada llamada, carta o mensaje queda visible en esta bitacora."
      rowKey={(row) => row.id}
      rows={visibleCollectionLog}
      columns={[
        {
          key: 'action',
          header: 'Gestion',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.action}</p>
              <p className="text-xs text-slate-500">{row.result}</p>
            </div>
          ),
        },
        {
          key: 'resident',
          header: isResidentView ? 'Responsable' : 'Cuenta',
          cell: (row) => (
            <div className="space-y-1">
              <p>{isResidentView ? row.owner : row.resident}</p>
              <p className="text-xs text-slate-500">{row.unit}</p>
            </div>
          ),
        },
        {
          key: 'date',
          header: 'Fecha',
          cell: (row) => formatShortDate(row.date),
        },
      ]}
    />
  );

  const renderBatches = () => (
    <FeatureWorkspaceTable
      title="Lotes pendientes por conciliar"
      description="Cada lote deja visible la fuente bancaria, monto y estado de cruce."
      rowKey={(row) => row.id}
      rows={batches}
      columns={[
        {
          key: 'source',
          header: 'Fuente',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.source}</p>
              <p className="text-xs text-slate-500">{row.referenceDate}</p>
            </div>
          ),
        },
        {
          key: 'amount',
          header: 'Monto',
          cell: (row) => formatCurrency(row.amount),
        },
        {
          key: 'status',
          header: 'Estado',
          cell: (row) => statusPill(row.status),
        },
        {
          key: 'actions',
          header: 'Accion',
          cell: (row) => (
            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleReconcileBatch(row)}>
                Conciliar
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderChannels = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Canales disponibles para tu pago' : 'Canales activos de recaudo'}
      description="La vista compara volumen, participacion y costo por cada medio."
      rowKey={(row) => row.id}
      rows={channels}
      columns={[
        {
          key: 'channel',
          header: 'Canal',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.channel}</p>
              <p className="text-xs text-slate-500">Comision {row.fee}</p>
            </div>
          ),
        },
        {
          key: 'share',
          header: 'Participacion',
          cell: (row) => row.share,
        },
        {
          key: 'volume',
          header: 'Volumen',
          cell: (row) => formatCurrency(row.volume),
        },
        {
          key: 'status',
          header: 'Estado',
          cell: (row) => statusPill(row.status),
        },
      ]}
    />
  );

  const renderNotes = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Ajustes aplicados a tu cuenta' : 'Notas credito y debito'}
      description="Cada ajuste muestra el valor, el concepto y si ya impacta la cartera."
      rowKey={(row) => row.id}
      rows={visibleNotes}
      columns={[
        {
          key: 'type',
          header: 'Tipo',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.type}</p>
              <p className="text-xs text-slate-500">{row.unit}</p>
            </div>
          ),
        },
        {
          key: 'concept',
          header: 'Concepto',
          cell: (row) => row.concept,
        },
        {
          key: 'amount',
          header: 'Valor',
          cell: (row) => formatCurrency(row.amount),
        },
        {
          key: 'actions',
          header: 'Estado',
          cell: (row) => (
            <div className="flex flex-wrap justify-end gap-2">
              {statusPill(row.status)}
              {row.status === 'Pendiente' && (
                <Button size="sm" variant="outline" onClick={() => handleApplyNote(row)}>
                  Aplicar
                </Button>
              )}
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderConnectors = () => (
    <FeatureWorkspaceTable
      title="Conectores bancarios"
      description="Sincroniza recaudo, verifica el ultimo corte y corrige alertas visibles."
      rowKey={(row) => row.id}
      rows={connectors}
      columns={[
        {
          key: 'bank',
          header: 'Entidad',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.bank}</p>
              <p className="text-xs text-slate-500">{row.integration}</p>
            </div>
          ),
        },
        {
          key: 'lastSync',
          header: 'Ultima sincronizacion',
          cell: (row) => row.lastSync,
        },
        {
          key: 'status',
          header: 'Estado',
          cell: (row) => statusPill(row.status),
        },
        {
          key: 'actions',
          header: 'Accion',
          cell: (row) => (
            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleSyncConnector(row)}>
                Sincronizar
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderCampaigns = () => (
    <FeatureWorkspaceTable
      title="Campanas de recaudo"
      description="Monitorea metas extraordinarias y registra nuevos aportes visibles."
      rowKey={(row) => row.id}
      rows={campaigns}
      columns={[
        {
          key: 'campaign',
          header: 'Campana',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.campaign}</p>
              <p className="text-xs text-slate-500">Cierre {formatShortDate(row.dueDate)}</p>
            </div>
          ),
        },
        {
          key: 'target',
          header: 'Meta',
          cell: (row) => formatCurrency(row.target),
        },
        {
          key: 'collected',
          header: 'Recaudado',
          cell: (row) => formatCurrency(row.collected),
        },
        {
          key: 'actions',
          header: 'Accion',
          cell: (row) => (
            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleRecordCampaignPayment(row)}>
                Registrar aporte
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderAging = () => {
    const agingRows = currentMorosos.map((row) => {
      const over60 = Math.round(row.overdueBalance * 0.62);
      const from31To60 = Math.round(row.overdueBalance * 0.24);
      const from1To30 = row.overdueBalance - over60 - from31To60;

      return {
        ...row,
        from1To30,
        from31To60,
        over60,
      };
    });

    return (
      <FeatureWorkspaceTable
        title={isResidentView ? 'Antiguedad de tu saldo' : 'Cartera por antiguedad'}
        description="La cartera vencida se distribuye en bandas para priorizar cobro y negociacion."
        rowKey={(row) => row.id}
        rows={agingRows}
        columns={[
          {
            key: 'resident',
            header: isResidentView ? 'Cuenta' : 'Unidad',
            cell: (row) => (
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{isResidentView ? row.resident : row.unit}</p>
                <p className="text-xs text-slate-500">{isResidentView ? row.unit : row.resident}</p>
              </div>
            ),
          },
          { key: '1-30', header: '1-30 dias', cell: (row) => formatCurrency(row.from1To30) },
          { key: '31-60', header: '31-60 dias', cell: (row) => formatCurrency(row.from31To60) },
          { key: '60+', header: 'Mas de 60 dias', cell: (row) => formatCurrency(row.over60) },
        ]}
      />
    );
  };

  const renderRisk = () => (
    <FeatureWorkspaceTable
      title={isResidentView ? 'Alertas sobre tu comportamiento de pago' : 'Alertas predictivas de mora'}
      description="La priorizacion combina saldo, recurrencia de atraso y actividad reciente."
      rowKey={(row) => row.id}
      rows={currentMorosos}
      columns={[
        {
          key: 'unit',
          header: 'Cuenta',
          cell: (row) => (
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{row.unit}</p>
              <p className="text-xs text-slate-500">{row.resident}</p>
            </div>
          ),
        },
        {
          key: 'score',
          header: 'Score',
          cell: (row) =>
            row.riskLevel === 'Alto' ? '89/100' : row.riskLevel === 'Medio' ? '74/100' : '42/100',
        },
        {
          key: 'risk',
          header: 'Riesgo',
          cell: (row) => statusPill(row.riskLevel),
        },
        {
          key: 'actions',
          header: 'Accion sugerida',
          cell: (row) => (
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => handleSendReminder(row)}>
                Crear seguimiento
              </Button>
            </div>
          ),
          align: 'right',
        },
      ]}
    />
  );

  const renderRefinancing = () => (
    <FeatureSectionCard
      title={isResidentView ? 'Simular plan para tu saldo' : 'Simulador de refinanciacion'}
      description="Ajusta valor y numero de cuotas para ver el impacto inmediato en la cuota proyectada."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Saldo a refinanciar</span>
            <Input
              value={refinancingTotal}
              onChange={(event) => setRefinancingTotal(event.target.value)}
              inputMode="numeric"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Numero de cuotas</span>
            <Input
              value={refinancingInstallments}
              onChange={(event) => setRefinancingInstallments(event.target.value)}
              inputMode="numeric"
            />
          </label>
          <div className="md:col-span-2">
            <FeatureActionButtons
              actions={[
                {
                  label: 'Calcular propuesta',
                  onClick: handleSimulateRefinancing,
                },
              ]}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm font-semibold text-blue-700">Resultado visible</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {simulatedInstallment ? formatCurrency(simulatedInstallment) : 'Sin simulacion'}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {simulatedInstallment
              ? `Cuota estimada para ${refinancingInstallments} meses.`
              : 'Ajusta los datos y calcula una propuesta para compartir con el residente.'}
          </p>
        </div>
      </div>
    </FeatureSectionCard>
  );

  switch (featureId) {
    case 'm04_auto_payment_reconciliation':
      return renderBatches();

    case 'm04_multichannel_collection':
      return renderChannels();

    case 'm04_payment_agreements':
      return renderAgreements();

    case 'm04_payment_promises':
      return renderPromises();

    case 'm04_blocking_by_mora':
      return renderMorosos(
        'Restricciones por mora',
        'Define si la unidad mantiene bloqueos sobre reservas y certificaciones mientras exista saldo vencido.',
      );

    case 'm04_collection_history':
      return renderCollectionLog();

    case 'm04_aging_portfolio':
      return renderAging();

    case 'm04_progressive_mora_notification':
      return renderMorosos(
        isResidentView ? 'Tus avisos de cartera' : 'Notificacion progresiva por mora',
        'Cada accion deja visible fecha de envio y contexto del saldo para mantener seguimiento real.',
      );

    case 'm04_refinancing_simulator':
      return renderRefinancing();

    case 'm04_campaign_collection':
      return renderCampaigns();

    case 'm04_partial_payments':
      return renderAccounts(
        isResidentView ? 'Abonos parciales disponibles' : 'Pagos parciales sobre cartera',
        'Registra abonos inmediatos y observa como se reduce el saldo visible en la tabla.',
      );

    case 'm04_credit_debit_notes':
      return renderNotes();

    case 'm04_bank_integration':
      return renderConnectors();

    case 'm04_daily_collection_board':
      return renderHistory(
        isResidentView ? 'Tus pagos de los ultimos 6 meses' : 'Recaudo consolidado del periodo',
        'La tabla incluye el ultimo semestre, estado del pago y descarga del soporte asociado.',
      );

    case 'm04_predictive_mora_alerts':
      return renderRisk();

    default:
      return (
        <>
          {renderAccounts(
            isResidentView ? 'Tu estado de cuenta' : 'Estados de cuenta del conjunto',
            'Vista operativa con saldos en COP, mora y acciones inmediatas sobre cada cuenta.',
          )}
          {renderHistory(
            isResidentView ? 'Tu historial de pagos' : 'Historial de pagos de los ultimos 6 meses',
            'Incluye recaudo, estado de cada periodo y soportes descargables.',
          )}
        </>
      );
  }
};

export default PaymentsFeatureWorkspace;
