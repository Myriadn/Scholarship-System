import { cn } from '@/lib/utils';

export interface Column {
    key: string;
    label: string;
    className?: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: Record<string, unknown>[];
    onRowClick?: (row: Record<string, unknown>, index: number) => void;
}

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
    return (
        <div className="w-full overflow-auto rounded-lg border border-[#E2E8F0]">
            <table className="w-full min-w-full divide-y divide-[#E2E8F0]">
                <thead className="bg-[#F8FAFC]">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(
                                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]',
                                    column.className,
                                )}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[#64748B]">
                                Tidak ada data yang tersedia
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={cn(
                                    'transition-colors hover:bg-[#F8FAFC]',
                                    onRowClick && 'cursor-pointer',
                                )}
                                onClick={() => onRowClick?.(row, rowIndex)}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            'whitespace-nowrap px-4 py-3 text-sm text-[#0F172A]',
                                            column.className,
                                        )}
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : (row[column.key] as React.ReactNode) ?? '—'}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
