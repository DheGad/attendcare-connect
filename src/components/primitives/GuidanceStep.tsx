import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface GuidanceStepProps {
    step: number;
    title: string;
    status: 'pending' | 'completed' | 'locked';
}

export function GuidanceStep({ step, title, status }: GuidanceStepProps) {
    return (
        <motion.div
            layout
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${status === 'locked'
                    ? 'opacity-40 grayscale'
                    : status === 'completed'
                        ? 'bg-emerald-900/20 border border-emerald-900/30'
                        : 'bg-zinc-900 border border-zinc-800'
                }`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${status === 'completed'
                    ? 'bg-emerald-500 text-black'
                    : status === 'pending'
                        ? 'bg-white text-black'
                        : 'bg-zinc-800 text-zinc-500'
                }`}>
                {status === 'completed' ? <Check size={16} strokeWidth={3} /> : step}
            </div>
            <span className={`text-lg transition-colors ${status === 'completed' ? 'text-emerald-400 font-medium' : 'text-zinc-200'
                }`}>
                {title}
            </span>
        </motion.div>
    );
}
