import { cn } from '@/lib/utils';

type StatusType = 'verified' | 'pending' | 'rejected' | 'approved' | 'sangat_layak' | 'layak';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
}

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string; defaultLabel: string }> = {
    verified: {
        bg: 'bg-[#10B981]/10',
        text: 'text-[#10B981]',
        dot: 'bg-[#10B981]',
        defaultLabel: 'Terverifikasi',
    },
    pending: {
        bg: 'bg-[#F59E0B]/10',
        text: 'text-[#F59E0B]',
        dot: 'bg-[#F59E0B]',
        defaultLabel: 'Menunggu',
    },
    rejected: {
        bg: 'bg-[#EF4444]/10',
        text: 'text-[#EF4444]',
        dot: 'bg-[#EF4444]',
        defaultLabel: 'Ditolak',
    },
    approved: {
        bg: 'bg-[#10B981]/10',
        text: 'text-[#10B981]',
        dot: 'bg-[#10B981]',
        defaultLabel: 'Disetujui',
    },
    sangat_layak: {
        bg: 'bg-[#10B981]/10',
        text: 'text-[#10B981]',
        dot: 'bg-[#10B981]',
        defaultLabel: 'Sangat Layak',
    },
    layak: {
        bg: 'bg-[#3B82F6]/10',
        text: 'text-[#3B82F6]',
        dot: 'bg-[#3B82F6]',
        defaultLabel: 'Layak',
    },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                config.bg,
                config.text,
            )}
        >
            <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
            {label || config.defaultLabel}
        </span>
    );
}
