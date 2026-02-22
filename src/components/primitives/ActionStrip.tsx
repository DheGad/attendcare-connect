import { motion } from 'framer-motion';

interface ActionStripProps {
    action: string;
    priority: 'primary' | 'secondary';
    onClick?: () => void;
}

export function ActionStrip({ action, priority, onClick }: ActionStripProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative w-full overflow-hidden rounded-2xl p-4 flex items-center justify-between group transition-colors ${priority === 'primary'
                    ? 'bg-white text-black hover:bg-zinc-100'
                    : 'bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800'
                }`}
        >
            <span className="font-semibold tracking-wide">{action}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${priority === 'primary' ? 'bg-black text-white' : 'bg-zinc-800 text-white'
                }`}>
                →
            </div>
        </motion.button>
    );
}
