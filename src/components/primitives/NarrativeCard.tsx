import { motion } from 'framer-motion';

interface NarrativeCardProps {
    text: string;
}

export function NarrativeCard({ text }: NarrativeCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white/90 leading-relaxed max-w-2xl text-center"
        >
            {text}
        </motion.div>
    );
}
