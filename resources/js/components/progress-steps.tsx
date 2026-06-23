import { cn } from '@/lib/utils';
import { type LucideProps } from 'lucide-react';

export interface ProgressStep {
    label: string;
    icon: React.ComponentType<LucideProps>;
    status: 'completed' | 'active' | 'pending';
    description?: string;
}

interface ProgressStepsProps {
    steps: ProgressStep[];
}

const statusStyles = {
    completed: {
        circle: 'bg-[#10B981] border-[#10B981] text-white',
        line: 'bg-[#10B981]',
        label: 'text-[#10B981] font-medium',
        description: 'text-[#10B981]/80',
    },
    active: {
        circle: 'bg-[#1E3A8A] border-[#1E3A8A] text-white ring-4 ring-[#1E3A8A]/20',
        line: 'bg-[#E2E8F0]',
        label: 'text-[#0F172A] font-semibold',
        description: 'text-[#64748B]',
    },
    pending: {
        circle: 'bg-white border-[#CBD5E1] text-[#94A3B8]',
        line: 'bg-[#E2E8F0]',
        label: 'text-[#94A3B8]',
        description: 'text-[#94A3B8]',
    },
};

export function ProgressSteps({ steps }: ProgressStepsProps) {
    return (
        <div className="w-full">
            {steps.map((step, index) => {
                const styles = statusStyles[step.status];
                const isLast = index === steps.length - 1;

                return (
                    <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
                        {/* Vertical connector line */}
                        {!isLast && (
                            <div
                                className={cn(
                                    'absolute left-[15px] top-10 h-full w-0.5',
                                    step.status === 'completed' ? 'bg-[#10B981]' : 'bg-[#E2E8F0]',
                                )}
                            />
                        )}

                        {/* Circle icon */}
                        <div className={cn('relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2', styles.circle)}>
                            <step.icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center pt-0.5">
                            <span className={cn('text-sm', styles.label)}>{step.label}</span>
                            {step.description && (
                                <span className={cn('mt-0.5 text-xs', styles.description)}>{step.description}</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
