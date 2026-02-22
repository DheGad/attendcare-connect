"use client";

import { motion, AnimatePresence } from 'framer-motion';

// Placeholder import for the transformer that will render the actual content
import { EventTransformer } from '@/components/transformers/EventTransformer';

import { usePathname } from 'next/navigation';

export function ViewStateManager() {
    const pathname = usePathname();

    // Determine transition physics based on spatial navigation
    // Up/Down = Y axis, Forward/Back = Scale/Opacity
    const variants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 1000 : direction < 0 ? -1000 : 0,
            opacity: 0,
            scale: direction === 0 ? 0.9 : 1, // Z-axis forward transition
        }),
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            y: direction < 0 ? 1000 : direction > 0 ? -1000 : 0,
            opacity: 0,
            scale: direction === 0 ? 1.1 : 1, // Z-axis back transition
        }),
    };

    // Derive scroll direction from event phase just for spatial mapping (up/down)
    const direction = 0; // Default to neutral z-axis transition
    const eventPhase = 'current';

    return (
        <div className="relative w-full h-full overflow-hidden bg-black text-white selection:bg-white/20">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={`${pathname}-${eventPhase}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        y: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.3, ease: 'easeOut' }
                    }}
                    className="absolute inset-0 flex flex-col p-4 sm:p-6 lg:p-8"
                >
                    {/* Top level situation layer */}
                    <header className="mb-6 flex items-center justify-between">
                        Live State — {pathname}
                    </header>

                    <main className="flex-1 flex flex-col justify-end pb-[15vh]">
                        {/* The transforming core visualizer */}
                        <EventTransformer />
                    </main>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

