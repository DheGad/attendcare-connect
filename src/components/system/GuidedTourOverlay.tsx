"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const TOUR_CONTENT: Record<string, { title: string; description: string; action: string }> = {
    family: {
        title: "Welcome to the Guardian View",
        description: "This interface translates complex medical data into plain language. The central Vitality Sphere pulses calmly when everything is nominal, and your Narrative Timeline explains exactly what the care team is doing.",
        action: "Enter Guardian View"
    },
    worker: {
        title: "Operations Console Activated",
        description: "Your protocol matrix is strictly sequenced. You must complete tasks chronologically. If you attempt an action out of sequence or outside a scheduled time window, the API Safety Guardrail will block it to ensure compliance.",
        action: "Start Shift"
    },
    provider: {
        title: "Clinical Command Ready",
        description: "You have access to the raw Event Ledger telemetry. Variance alerts will appear here instantly if patient vitals deviate from their baseline condition. The AI streams background diagnostic insights continually.",
        action: "Initialize Command"
    },
    hospital: {
        title: "Macro Ecosystem Dashboard",
        description: "This view tracks thousands of distributed nodes. The System Load indicates global capacity. Use the Discharge Readiness indicators to make safe, data-driven scaling decisions.",
        action: "View Operations"
    },
    regulator: {
        title: "Compliance & Oversight",
        description: "You have absolute transparency. The Audit Replay Engine allows you to physically rewind the system state to investigate any historical anomalies based on immutable ledger facts.",
        action: "Enter Oversight"
    }
};

export function GuidedTourOverlay() {
    const pathname = usePathname();
    const userRole = pathname.split('/')[1] || 'family';
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleAcknowledge = useCallback(() => {
        localStorage.setItem(`hasSeenTour_${userRole}`, 'true');
        setIsVisible(false);
    }, [userRole]);

    useEffect(() => {
        // Run once per role per device (or session for this demo)
        const tourKey = `hasSeenTour_${userRole}`;
        const hasSeen = localStorage.getItem(tourKey);

        if (!hasSeen) {
            // Slight delay to let the OS boot up
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [userRole]);

    useEffect(() => {
        if (isVisible) {
            const startTime = Date.now();
            const duration = 20000;

            const int = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const p = Math.min((elapsed / duration) * 100, 100);
                setProgress(p);

                if (p >= 100) {
                    clearInterval(int);
                    handleAcknowledge();
                }
            }, 100);

            return () => clearInterval(int);
        }
    }, [isVisible, handleAcknowledge]);

    if (!isVisible) return null;

    const content = TOUR_CONTENT[userRole] || TOUR_CONTENT['family'];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 via-transparent to-slate-900/40 pointer-events-none" />

                <motion.div
                    initial={{ y: 20, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                    className="relative max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl overflow-hidden"
                >
                    {/* Animated Edge Glow */}
                    <div className="absolute inset-0 border border-teal-500/20 rounded-3xl animate-pulse pointer-events-none" />

                    {/* 20 Second Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
                        <div className="h-full bg-teal-500 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="flex items-center gap-3 text-teal-600 mb-6 relative z-10">
                        <Sparkles size={24} />
                        <span className="text-sm font-bold tracking-widest uppercase">Contextual Onboarding</span>
                        <span className="ml-auto text-xs text-teal-600/50 font-mono font-semibold">{Math.ceil((20000 - (progress / 100) * 20000) / 1000)}s</span>
                    </div>

                    <h2 className="text-3xl font-light text-slate-800 mb-4 leading-tight relative z-10">
                        {content.title}
                    </h2>

                    <p className="text-slate-600 font-medium leading-relaxed text-lg mb-8 relative z-10">
                        {content.description}
                    </p>

                    <button
                        onClick={handleAcknowledge}
                        className="w-full group relative z-10 flex items-center justify-center gap-2 py-4 rounded-xl bg-teal-600 text-white font-bold tracking-wide hover:bg-teal-700 transition-all active:scale-95 shadow-sm"
                    >
                        {content.action}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
