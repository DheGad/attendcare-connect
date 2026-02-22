import { motion } from 'framer-motion';

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    title?: string;
}

export function GlassPanel({ children, className = '', delay = 0, title }: GlassPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            className={`relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-sm shadow-slate-200/50 ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent pointer-events-none" />

            {title && (
                <div className="mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-sm" />
                    <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">{title}</h3>
                </div>
            )}

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
