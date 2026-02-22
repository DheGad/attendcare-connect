import { motion } from 'framer-motion';

interface TimelineEvent {
    time: string;
    desc: string;
}

interface TimelineSegmentProps {
    events: TimelineEvent[];
}

export function TimelineSegment({ events }: TimelineSegmentProps) {
    return (
        <div className="relative pl-6 space-y-8 border-l border-zinc-800 py-4">
            {events.map((event, i) => (
                <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                >
                    <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-zinc-800 border-2 border-black" />
                    <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-1">
                        {event.time}
                    </div>
                    <div className="text-lg text-zinc-200">
                        {event.desc}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
