import { cn } from '@/lib/utils';
import { type LucideProps } from 'lucide-react';

interface StatCardProps {
    icon: React.ComponentType<LucideProps>;
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    variant?: 'default' | 'warning' | 'success' | 'danger';
}

const variantStyles = {
    default: {
        container: 'border-[#E2E8F0]',
        iconBg: 'bg-[#1E3A8A]/10',
        iconColor: 'text-[#1E3A8A]',
        accent: 'bg-[#1E3A8A]',
    },
    warning: {
        container: 'border-[#F59E0B]/20',
        iconBg: 'bg-[#F59E0B]/10',
        iconColor: 'text-[#F59E0B]',
        accent: 'bg-[#F59E0B]',
    },
    success: {
        container: 'border-[#10B981]/20',
        iconBg: 'bg-[#10B981]/10',
        iconColor: 'text-[#10B981]',
        accent: 'bg-[#10B981]',
    },
    danger: {
        container: 'border-[#EF4444]/20',
        iconBg: 'bg-[#EF4444]/10',
        iconColor: 'text-[#EF4444]',
        accent: 'bg-[#EF4444]',
    },
};

export function StatCard({ icon: IconComponent, label, value, trend, trendUp, variant = 'default' }: StatCardProps) {
    const styles = variantStyles[variant];

    return (
        <div className={cn('relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm', styles.container)}>
            {/* Accent line at top */}
            <div className={cn('absolute top-0 left-0 h-1 w-full', styles.accent)} />

            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-[#64748B]">{label}</p>
                    <p className="text-3xl font-bold tracking-tight text-[#0F172A]">{value}</p>
                    {trend && (
                        <div className="flex items-center gap-1">
                            <span
                                className={cn(
                                    'inline-flex items-center gap-0.5 text-xs font-medium',
                                    trendUp ? 'text-[#10B981]' : 'text-[#EF4444]',
                                )}
                            >
                                {trendUp ? '↑' : '↓'} {trend}
                            </span>
                            <span className="text-xs text-[#64748B]">dari bulan lalu</span>
                        </div>
                    )}
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', styles.iconBg)}>
                    <IconComponent className={cn('h-6 w-6', styles.iconColor)} />
                </div>
            </div>
        </div>
    );
}
