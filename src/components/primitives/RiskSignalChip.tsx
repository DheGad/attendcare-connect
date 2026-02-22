import { motion } from 'framer-motion';

interface RiskSignalChipProps {
    level: 'Elevated' | 'Immediate' | 'Stable';
    description: string;
}

export function RiskSignalChip({ level, description }: RiskSignalChipProps) {
    const styles = {
        Immediate: 'bg-red-500/20 text-red-500 border-red-500/30',
        Elevated: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
        Stable: 'bg-zinc-800 text-zinc-300 border-zinc-700'
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md ${styles[level]}`}
        >
            <span className="font-bold tracking-widest uppercase text-xs">
                {level}
            </span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
            <span className="text-sm font-medium">{description}</span>
        </motion.div>
    );
}
