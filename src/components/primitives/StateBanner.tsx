import { motion } from 'framer-motion';

interface StateBannerProps {
    type: 'neutral' | 'warning' | 'critical';
    label?: string;
}

export function StateBanner({ type, label }: StateBannerProps) {
    const styles = {
        neutral: 'bg-zinc-900 border-zinc-800 text-zinc-300',
        warning: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        critical: 'bg-red-500/10 border-red-500/20 text-red-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-2 rounded-full border text-sm font-medium tracking-wide w-fit flex items-center gap-2 ${styles[type]}`}
        >
            <div className={`w-2 h-2 rounded-full ${type === 'critical' ? 'bg-red-500 animate-pulse' : type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {label || (type === 'neutral' ? 'SYSTEM NOMINAL' : 'ATTENTION REQUIRED')}
        </motion.div>
    );
}
