import { useState, type ElementType } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { AdminPaymentsView, TenantPaymentsView } from '@/components/features/payments';
import jsPDF from 'jspdf';
import {
  CreditCard,
  Eye,
  Download,
  Wallet,
  AlertCircle,
  Landmark,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  FileText,
} from 'lucide-react';
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from '@/hooks/use-toast';

type CouncilTab = 'resumen' | 'cartera' | 'presupuesto' | 'movimientos' | 'historico';

interface CollectionTowerRow {
  tower: string;
  totalUnits: number;
  onTime: number;
  overdue: number;
  collectionRate: number;
  collectedAmount: number;
}

interface DebtorRow {
  unit: string;
  resident: string;
  overdueMonths: string;
  amountDue: number;
  status: string;
}

interface MonthlyHistoryRow {
  month: string;
  collected: number;
  budget: number;
}

interface BudgetRow {
  item: string;
  budgeted: number;
  executed: number;
  available: number;
  executionRate: number;
}

interface MovementRow {
  date: string;
  type: 'Ingreso' | 'Egreso';
  description: string;
  amount: number;
  balance: number;
}

const panelClass = 'bg-white rounded-xl border border-gray-200 shadow-sm';

const summaryCards = [
  {
    title: 'Recaudo del mes',
    value: 18450000,
    subtitle: '38 de 48 unidades al dia',
    icon: Wallet,
    accent: 'text-emerald-500',
  },
  {
    title: 'Cartera vencida',
    value: 4200000,
    subtitle: '4 unidades en mora',
    icon: AlertCircle,
    accent: 'text-red-500',
  },
  {
    title: 'Presupuesto mensual',
    value: 22000000,
    subtitle: '84% ejecutado',
    icon: TrendingUp,
    accent: 'text-amber-500',
  },
  {
    title: 'Saldo en caja/banco',
    value: 6380000,
    subtitle: 'Cuenta corriente Bancolombia',
    icon: Landmark,
    accent: 'text-blue-500',
  },
];

const collectionByTower: CollectionTowerRow[] = [
  { tower: 'Torre 1', totalUnits: 16, onTime: 14, overdue: 2, collectionRate: 87.5, collectedAmount: 6125000 },
  { tower: 'Torre 2', totalUnits: 16, onTime: 13, overdue: 3, collectionRate: 81.3, collectedAmount: 5687500 },
  { tower: 'Torre 3', totalUnits: 16, onTime: 11, overdue: 5, collectionRate: 68.8, collectedAmount: 4812500 },
  { tower: 'Conjunto', totalUnits: 48, onTime: 38, overdue: 10, collectionRate: 79.2, collectedAmount: 16625000 },
];

const debtorRows: DebtorRow[] = [
  { unit: 'Apto 203', resident: 'J. Martinez', overdueMonths: '3 meses', amountDue: 1150000, status: 'Acuerdo de pago' },
  { unit: 'Apto 315', resident: 'R. Ospina', overdueMonths: '2 meses', amountDue: 767000, status: 'Notificado' },
  { unit: 'Apto 108', resident: 'L. Vargas', overdueMonths: '4 meses', amountDue: 1534000, status: 'Proceso juridico' },
  { unit: 'Apto 412', resident: 'C. Herrera', overdueMonths: '1 mes', amountDue: 383500, status: 'Pendiente' },
];

const monthlyHistory: MonthlyHistoryRow[] = [
  { month: 'Dic 2025', collected: 19200000, budget: 22000000 },
  { month: 'Ene 2026', collected: 17800000, budget: 22000000 },
  { month: 'Feb 2026', collected: 20100000, budget: 22000000 },
  { month: 'Mar 2026', collected: 18900000, budget: 22000000 },
  { month: 'Abr 2026', collected: 19450000, budget: 22000000 },
  { month: 'May 2026', collected: 18450000, budget: 22000000 },
];

const budgetRows: BudgetRow[] = [
  { item: 'Administracion', budgeted: 8000000, executed: 7200000, available: 800000, executionRate: 90 },
  { item: 'Mantenimiento', budgeted: 5000000, executed: 3800000, available: 1200000, executionRate: 76 },
  { item: 'Seguridad', budgeted: 4500000, executed: 4500000, available: 0, executionRate: 100 },
  { item: 'Servicios publicos', budgeted: 3000000, executed: 2100000, available: 900000, executionRate: 70 },
  { item: 'Imprevistos', budgeted: 1500000, executed: 420000, available: 1080000, executionRate: 28 },
  { item: 'TOTAL', budgeted: 22000000, executed: 18020000, available: 3980000, executionRate: 82 },
];

const movementRows: MovementRow[] = [
  { date: '2026-05-27', type: 'Ingreso', description: 'Cuotas ordinarias Torre 1', amount: 2450000, balance: 6380000 },
  { date: '2026-05-26', type: 'Egreso', description: 'Pago servicio de vigilancia', amount: 1800000, balance: 3930000 },
  { date: '2026-05-25', type: 'Ingreso', description: 'Recaudo cuota extraordinaria', amount: 1250000, balance: 5730000 },
  { date: '2026-05-24', type: 'Egreso', description: 'Mantenimiento ascensor Torre 2', amount: 980000, balance: 4480000 },
  { date: '2026-05-22', type: 'Ingreso', description: 'Transferencias PSE residentes', amount: 3210000, balance: 5460000 },
  { date: '2026-05-20', type: 'Egreso', description: 'Factura energia zonas comunes', amount: 640000, balance: 2250000 },
  { date: '2026-05-18', type: 'Ingreso', description: 'Acuerdo de pago cartera', amount: 540000, balance: 2890000 },
  { date: '2026-05-16', type: 'Egreso', description: 'Compra insumos de aseo', amount: 320000, balance: 2350000 },
  { date: '2026-05-14', type: 'Ingreso', description: 'Cuotas ordinarias Torre 3', amount: 2760000, balance: 2670000 },
  { date: '2026-05-12', type: 'Egreso', description: 'Pago reparacion hidraulica', amount: 890000, balance: 3560000 },
];

const councilTabs: Array<{ id: CouncilTab; label: string; icon: ElementType }> = [
  { id: 'resumen', label: 'Resumen', icon: BarChart3 },
  { id: 'cartera', label: 'Cartera', icon: AlertCircle },
  { id: 'presupuesto', label: 'Presupuesto', icon: Building2 },
  { id: 'movimientos', label: 'Movimientos', icon: CreditCard },
  { id: 'historico', label: 'Historico', icon: TrendingUp },
];

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s/g, '');

const formatPercent = (value: number, digits = 1) => `${value.toFixed(digits)}%`;

const progressTone = (value: number) => {
  if (value > 95) return 'bg-red-500';
  if (value >= 80) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const exportPaymentsReportPDF = () => {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 18;

  const addLine = (text: string, gap = 6) => {
    if (y > 280) {
      pdf.addPage();
      y = 18;
    }
    pdf.text(text, 14, y);
    y += gap;
  };

  pdf.setFontSize(16);
  addLine('BUNTY - Informe financiero consejo', 8);
  pdf.setFontSize(10);
  addLine('Torres del Parque Residencial');
  addLine(`Fecha de exportacion: ${new Date().toLocaleDateString('es-CO')}`, 8);

  pdf.setFontSize(12);
  addLine('Resumen general', 7);
  pdf.setFontSize(10);
  summaryCards.forEach((card) => addLine(`${card.title}: ${formatCOP(card.value)} | ${card.subtitle}`));

  y += 3;
  pdf.setFontSize(12);
  addLine('Recaudo por torre', 7);
  pdf.setFontSize(10);
  collectionByTower.forEach((row) =>
    addLine(
      `${row.tower}: ${row.onTime}/${row.totalUnits} al dia | Mora ${row.overdue} | Recaudo ${formatPercent(
        row.collectionRate,
      )} | ${formatCOP(row.collectedAmount)}`,
    ),
  );

  y += 3;
  pdf.setFontSize(12);
  addLine('Morosos', 7);
  pdf.setFontSize(10);
  debtorRows.forEach((row) =>
    addLine(`${row.unit} - ${row.resident} | ${row.overdueMonths} | ${formatCOP(row.amountDue)} | ${row.status}`),
  );

  y += 3;
  pdf.setFontSize(12);
  addLine('Presupuesto vs ejecucion', 7);
  pdf.setFontSize(10);
  budgetRows.forEach((row) =>
    addLine(
      `${row.item}: Presupuestado ${formatCOP(row.budgeted)} | Ejecutado ${formatCOP(row.executed)} | Disponible ${formatCOP(
        row.available,
      )} | ${row.executionRate}%`,
    ),
  );

  y += 3;
  pdf.setFontSize(12);
  addLine('Historico de recaudos', 7);
  pdf.setFontSize(10);
  monthlyHistory.forEach((row) =>
    addLine(
      `${row.month}: ${formatCOP(row.collected)} recaudado / ${formatCOP(row.budget)} presupuesto | ${formatPercent(
        (row.collected / row.budget) * 100,
      )}`,
    ),
  );

  y += 3;
  pdf.setFontSize(12);
  addLine('Ultimos movimientos', 7);
  pdf.setFontSize(10);
  movementRows.forEach((row) =>
    addLine(`${row.date} | ${row.type} | ${row.description} | ${formatCOP(row.amount)} | Saldo ${formatCOP(row.balance)}`),
  );

  pdf.save('informe-financiero-consejo.pdf');
  toast({
    title: 'Informe exportado',
    description: 'El informe financiero del consejo fue descargado en PDF.',
  });
};

const exportDebtorsPDF = () => {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 18;

  pdf.setFontSize(16);
  pdf.text('BUNTY - Lista de morosos', 14, y);
  y += 8;
  pdf.setFontSize(10);
  pdf.text(`Fecha de exportacion: ${new Date().toLocaleDateString('es-CO')}`, 14, y);
  y += 10;

  debtorRows.forEach((row) => {
    if (y > 280) {
      pdf.addPage();
      y = 18;
    }
    pdf.text(
      `${row.unit} | ${row.resident} | ${row.overdueMonths} | ${formatCOP(row.amountDue)} | ${row.status}`,
      14,
      y,
    );
    y += 8;
  });

  pdf.save('morosos-consejo.pdf');
  toast({
    title: 'Lista exportada',
    description: 'La lista de morosos fue descargada en PDF.',
  });
};

const SummarySection = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className={`${panelClass} p-4`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCOP(card.value)}</p>
                <p className="text-sm text-gray-500 mt-2">{card.subtitle}</p>
              </div>
              <Icon className={`w-5 h-5 ${card.accent}`} strokeWidth={1.8} />
            </div>
          </div>
        );
      })}
    </div>

    <div className={`${panelClass} p-6`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado de recaudo por torre</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="pb-3 pr-4 font-medium">Torre</th>
              <th className="pb-3 pr-4 font-medium">Total Unidades</th>
              <th className="pb-3 pr-4 font-medium">Al dia</th>
              <th className="pb-3 pr-4 font-medium">En mora</th>
              <th className="pb-3 pr-4 font-medium">% Recaudo</th>
              <th className="pb-3 font-medium">Valor recaudado</th>
            </tr>
          </thead>
          <tbody>
            {collectionByTower.map((row) => (
              <tr key={row.tower} className="border-b border-gray-100 last:border-b-0">
                <td className="py-4 pr-4 font-medium text-gray-900">{row.tower}</td>
                <td className="py-4 pr-4 text-gray-600">{row.totalUnits}</td>
                <td className="py-4 pr-4 text-gray-600">{row.onTime}</td>
                <td className="py-4 pr-4 text-gray-600">{row.overdue}</td>
                <td className="py-4 pr-4 min-w-[180px]">
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-primary/70 rounded-full" style={{ width: `${row.collectionRate}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{formatPercent(row.collectionRate)}</span>
                  </div>
                </td>
                <td className="py-4 font-medium text-gray-900">{formatCOP(row.collectedAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const DebtorsSection = () => (
  <div className="space-y-6">
    <div className={`${panelClass} p-6`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Morosos</h2>
          <p className="text-sm text-gray-500 mt-1">Vista parcial por privacidad, sin acciones de cobro.</p>
        </div>
        <button
          onClick={exportDebtorsPDF}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Exportar lista morosos PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="pb-3 pr-4 font-medium">Unidad</th>
              <th className="pb-3 pr-4 font-medium">Residente</th>
              <th className="pb-3 pr-4 font-medium">Meses en mora</th>
              <th className="pb-3 pr-4 font-medium">Valor adeudado</th>
              <th className="pb-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {debtorRows.map((row) => (
              <tr key={row.unit} className="border-b border-gray-100 last:border-b-0">
                <td className="py-4 pr-4 font-medium text-gray-900">{row.unit}</td>
                <td className="py-4 pr-4 text-gray-600">{row.resident}</td>
                <td className="py-4 pr-4 text-gray-600">{row.overdueMonths}</td>
                <td className="py-4 pr-4 font-medium text-gray-900">{formatCOP(row.amountDue)}</td>
                <td className="py-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className={`${panelClass} p-6`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado de recaudo por torre</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="pb-3 pr-4 font-medium">Torre</th>
              <th className="pb-3 pr-4 font-medium">Total Unidades</th>
              <th className="pb-3 pr-4 font-medium">Al dia</th>
              <th className="pb-3 pr-4 font-medium">En mora</th>
              <th className="pb-3 pr-4 font-medium">% Recaudo</th>
              <th className="pb-3 font-medium">Valor recaudado</th>
            </tr>
          </thead>
          <tbody>
            {collectionByTower.map((row) => (
              <tr key={row.tower} className="border-b border-gray-100 last:border-b-0">
                <td className="py-4 pr-4 font-medium text-gray-900">{row.tower}</td>
                <td className="py-4 pr-4 text-gray-600">{row.totalUnits}</td>
                <td className="py-4 pr-4 text-gray-600">{row.onTime}</td>
                <td className="py-4 pr-4 text-gray-600">{row.overdue}</td>
                <td className="py-4 pr-4 min-w-[180px]">
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-primary/70 rounded-full" style={{ width: `${row.collectionRate}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{formatPercent(row.collectionRate)}</span>
                  </div>
                </td>
                <td className="py-4 font-medium text-gray-900">{formatCOP(row.collectedAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const BudgetSection = () => (
  <div className={`${panelClass} p-6`}>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Presupuesto vs ejecucion</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="pb-3 pr-4 font-medium">Rubro</th>
            <th className="pb-3 pr-4 font-medium">Presupuestado</th>
            <th className="pb-3 pr-4 font-medium">Ejecutado</th>
            <th className="pb-3 pr-4 font-medium">Disponible</th>
            <th className="pb-3 font-medium">% Ejecucion</th>
          </tr>
        </thead>
        <tbody>
          {budgetRows.map((row) => (
            <tr key={row.item} className={`border-b border-gray-100 last:border-b-0 ${row.item === 'TOTAL' ? 'bg-gray-50' : ''}`}>
              <td className="py-4 pr-4 font-medium text-gray-900">{row.item}</td>
              <td className="py-4 pr-4 text-gray-600">{formatCOP(row.budgeted)}</td>
              <td className="py-4 pr-4 text-gray-600">{formatCOP(row.executed)}</td>
              <td className="py-4 pr-4 text-gray-600">{formatCOP(row.available)}</td>
              <td className="py-4 min-w-[190px]">
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${progressTone(row.executionRate)}`} style={{ width: `${Math.min(row.executionRate, 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{row.executionRate}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MovementsSection = () => (
  <div className={`${panelClass} p-6`}>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ultimos movimientos</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="pb-3 pr-4 font-medium">Fecha</th>
            <th className="pb-3 pr-4 font-medium">Tipo</th>
            <th className="pb-3 pr-4 font-medium">Descripcion</th>
            <th className="pb-3 pr-4 font-medium">Valor</th>
            <th className="pb-3 font-medium">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {movementRows.map((row) => (
            <tr key={`${row.date}-${row.description}`} className="border-b border-gray-100 last:border-b-0">
              <td className="py-4 pr-4 text-gray-600">{row.date}</td>
              <td className="py-4 pr-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                    row.type === 'Ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {row.type === 'Ingreso' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {row.type}
                </span>
              </td>
              <td className="py-4 pr-4 text-gray-600">{row.description}</td>
              <td className={`py-4 pr-4 font-medium ${row.type === 'Ingreso' ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCOP(row.amount)}
              </td>
              <td className="py-4 font-medium text-gray-900">{formatCOP(row.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const HistorySection = () => (
  <div className="space-y-6">
    <div className={`${panelClass} p-6`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de recaudos ultimos 6 meses</h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value: number) => `$${Math.round(value / 1000000)}M`}
            />
            <Tooltip
              formatter={(value: number | string, name: string) => [formatCOP(Number(value)), name === 'collected' ? 'Recaudado' : 'Presupuesto']}
              contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', background: '#FFFFFF' }}
            />
            <Legend formatter={(value) => (value === 'collected' ? 'Recaudado' : 'Presupuesto')} />
            <Bar dataKey="collected" fill="#0F7A5C" radius={[8, 8, 0, 0]} />
            <Bar dataKey="budget" fill="#CBD5E1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className={`${panelClass} p-6`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen mensual</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="pb-3 pr-4 font-medium">Mes</th>
              <th className="pb-3 pr-4 font-medium">Recaudado</th>
              <th className="pb-3 pr-4 font-medium">Presupuesto</th>
              <th className="pb-3 font-medium">% Cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            {monthlyHistory.map((row) => {
              const compliance = (row.collected / row.budget) * 100;
              return (
                <tr key={row.month} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-4 pr-4 font-medium text-gray-900">{row.month}</td>
                  <td className="py-4 pr-4 text-gray-600">{formatCOP(row.collected)}</td>
                  <td className="py-4 pr-4 text-gray-600">{formatCOP(row.budget)}</td>
                  <td className="py-4 min-w-[190px]">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-primary/70 rounded-full" style={{ width: `${Math.min(compliance, 100)}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{formatPercent(compliance)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CouncilPaymentsView = () => {
  const [activeTab, setActiveTab] = useState<CouncilTab>('resumen');

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <CreditCard className="icon-responsive-lg text-primary" /> Finanzas del Conjunto
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Torres del Parque Residencial · Vista Consejo</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
            <Eye className="w-3.5 h-3.5" />
            Solo lectura · Supervision financiera
          </span>
          <button
            onClick={exportPaymentsReportPDF}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Exportar Informe PDF
          </button>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {councilTabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TabIcon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {activeTab === 'resumen' && <SummarySection />}
        {activeTab === 'cartera' && <DebtorsSection />}
        {activeTab === 'presupuesto' && <BudgetSection />}
        {activeTab === 'movimientos' && <MovementsSection />}
        {activeTab === 'historico' && <HistorySection />}
      </motion.div>
    </div>
  );
};

export default function PaymentsPage() {
  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.roleId === 'super_admin' || user?.roleId === 'admin';
  const isCouncil = user?.roleId === 'consejo';
  const isTenant = user?.roleId === 'arrendatario' || user?.roleId === 'propietario';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {isAdmin ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <CreditCard className="icon-responsive-lg text-primary" /> Pagos y Cartera
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Dashboard de recaudos, cartera y gestion de pagos</p>
            </div>
          </div>
          <div className="bg-white border border-black/8 rounded-xl p-6 shadow-sm">
            <AdminPaymentsView />
          </div>
        </>
      ) : isCouncil ? (
        <CouncilPaymentsView />
      ) : isTenant ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <CreditCard className="icon-responsive-lg text-primary" /> Pagos y Cartera
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Tu estado de cuenta e historial de pagos</p>
            </div>
          </div>
          <div className="bg-white border border-black/8 rounded-xl p-6 shadow-sm">
            <TenantPaymentsView />
          </div>
        </>
      ) : (
        <div className={`${panelClass} p-8 text-center`}>
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 mb-2">Modulo financiero</p>
          <p className="text-sm text-gray-500">No tienes acceso a este modulo. Contacta con administracion.</p>
        </div>
      )}
    </motion.div>
  );
}
