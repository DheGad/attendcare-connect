"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { Terminal, AlertTriangle, Info } from 'lucide-react';

export function AIInsightStream() {
    const { aiInsights } = usePatientCoreStore();

    return (
        <div className="h-full flex flex-col font-mono">
            <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-200 pb-2">
                <Terminal size={14} />
                <span className="text-[10px] uppercase font-semibold tracking-widest">Agent Logic Stream</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
                <AnimatePresence initial={false}>
                    {aiInsights.map((insight) => (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            className="text-[11px] leading-relaxed border-l-2 pl-3 py-1 border-slate-300"
                        >
                            <div className="flex items-center gap-2 mb-1 text-slate-500 font-medium">
                                <span>{insight.timestamp}</span>
                                <span>•</span>
                                <span className="text-teal-600 font-bold">{insight.source}</span>
                                {insight.severity === 'alert' && <AlertTriangle size={10} className="text-red-600" />}
                                {insight.severity === 'info' && <Info size={10} className="text-blue-600" />}
                            </div>
                            <div className="text-slate-700 font-medium">{insight.message}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
