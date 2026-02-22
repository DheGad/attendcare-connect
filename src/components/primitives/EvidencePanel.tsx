import { motion } from 'framer-motion';

interface EvidencePanelProps {
    title: string;
    value: string;
    className?: string;
}

export function EvidencePanel({ title, value, className = '' }: EvidencePanelProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ${className}`}
        >
            <h3 className="text-sm text-slate-500 font-semibold tracking-wide uppercase mb-2">
                {title}
            </h3>
            <div className="text-2xl font-semibold text-slate-800 tracking-tight">
                {value}
            </div>
        </motion.div>
    );
}
