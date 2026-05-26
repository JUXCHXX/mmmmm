import type { ReactNode } from 'react';
import { FeatureSectionCard } from '@/components/features/shared/FeatureActionShell';
import { cn } from '@/lib/utils';

export interface FeatureTableColumn<Row> {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const ALIGNMENT: Record<NonNullable<FeatureTableColumn<unknown>['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function FeatureWorkspaceTable<Row>({
  title,
  description,
  columns,
  rows,
  rowKey,
  emptyState = 'No hay registros para mostrar.',
  toolbar,
  footer,
}: {
  title: string;
  description?: string;
  columns: FeatureTableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  emptyState?: string;
  toolbar?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <FeatureSectionCard title={title} description={description}>
      <div className="space-y-4">
        {toolbar}

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        'px-4 py-3 font-semibold text-slate-600',
                        ALIGNMENT[column.align ?? 'left'],
                        column.className,
                      )}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.length ? (
                  rows.map((row) => (
                    <tr key={rowKey(row)} className="align-top">
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={cn(
                            'px-4 py-3 text-slate-700',
                            ALIGNMENT[column.align ?? 'left'],
                            column.className,
                          )}
                        >
                          {column.cell(row)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      {emptyState}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {footer}
      </div>
    </FeatureSectionCard>
  );
}

export default FeatureWorkspaceTable;
