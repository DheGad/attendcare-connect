"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { EventTransformer } from '@/components/transformers/EventTransformer';
import { TopStatusBar } from './TopStatusBar';
import { FloatingDock } from './FloatingDock';
import { AICareAvatar } from './AICareAvatar';
import { GuidedTourOverlay } from './GuidedTourOverlay';
import { usePathname } from 'next/navigation';

export function OSShell() {
    const { participantCondition } = usePatientCoreStore();
    const pathname = usePathname();

    // Background glow based on condition
    const bgGlow =
        participantCondition === 'critical' ? 'bg-red-900/10' :
            participantCondition === 'at-risk' ? 'bg-amber-900/10' :
                'bg-emerald-900/10';

    return (
        <div className={`relative w-full h-[100dvh] overflow-hidden bg-slate-50 text-slate-800 font-sans transition-colors duration-1000 ${bgGlow}`}>
            {/* Soft Healthcare Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

            {/* OS Chrome */}
            <TopStatusBar />

            {/* Main Canvas Area */}
            <main className="relative z-10 w-full h-[calc(100dvh-5rem-5rem)] mt-20 mb-20 overflow-y-auto no-scrollbar scroll-smooth p-4 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname + participantCondition}
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full max-w-7xl mx-auto"
                    >
                        <EventTransformer />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Global Navigation */}
            <FloatingDock />
            <AICareAvatar />
            <GuidedTourOverlay />

        </div>
    );
}
