"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { X, Stethoscope } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function AICareAvatar() {
    const { participantCondition, aiInsights } = usePatientCoreStore();
    const pathname = usePathname();
    const userRole = pathname.split('/')[1] || 'family';
    const [isOpen, setIsOpen] = useState(false);

    // Deterministic Contextual Narrator Logic (Professional Care Coordinator Tone)
    let narrativeMessage = '';

    if (participantCondition === 'stable') {
        if (userRole === 'family') narrativeMessage = "Evelyn's vital signs and environmental markers remain stable. Continuous monitoring is active.";
        else if (userRole === 'worker') narrativeMessage = "Environmental sensors and localized telemetry report nominal baselines. Proceed with scheduled protocols.";
        else if (userRole === 'provider') narrativeMessage = "Hemodynamics and respiratory patterns demonstrate sustained stability. Continue baseline protocol.";
        else narrativeMessage = "The ecosystem is operating at optimal compliance. Zero clinical deviations detected.";
    } else {
        // Explain the anomaly professionally
        const latestInsight = aiInsights.find(i => i.severity !== 'info')?.message || "A minor variance was detected.";

        if (userRole === 'family') narrativeMessage = `Clinical observation: ${latestInsight} The on-duty care team has been notified and is reviewing the telemetry data automatically.`;
        else if (userRole === 'worker') narrativeMessage = `Priority observation: ${latestInsight} Please refer to the Action Center for updated tasks.`;
        else if (userRole === 'provider') narrativeMessage = `Clinical telemetry flag: ${latestInsight} Please review the respiratory and saturation streams for potential intervention.`;
        else narrativeMessage = `Audit flag raised: ${latestInsight} The system has automatically isolated the event and requested clinical review.`;
    }

    useEffect(() => {
        // Proactively pop up if not stable
        const timer = setTimeout(() => {
            if (participantCondition !== 'stable') {
                setIsOpen(true);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [participantCondition]);

    return (
        <>
            {/* Narrator Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border transition-colors ${isOpen ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200 text-teal-600 hover:text-teal-700'
                    }`}
            >
                {isOpen ? <X className="text-slate-500" size={24} /> : <Stethoscope size={24} />}
            </motion.button>

            {/* Contextual Narrative Bubble */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-44 right-6 z-50 w-80 sm:w-80 bg-white/95 backdrop-blur-3xl border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-5 py-3 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="text-teal-600" size={16} />
                                <span className="font-semibold text-slate-800 text-sm tracking-wide">Care Coordinator</span>
                            </div>
                        </div>

                        {/* Message Feed */}
                        <div className="p-6">
                            <p className="text-slate-700 text-[14px] leading-relaxed">
                                {narrativeMessage}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
