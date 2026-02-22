"use client";

import { motion } from 'framer-motion';
import { DataPoint } from '@/store/patientCoreStore';

interface LiveSignalChartProps {
    data: DataPoint[];
    color: 'emerald' | 'amber' | 'red' | 'teal';
    label: string;
    unit: string;
}

export function LiveSignalChart({ data, color, label, unit }: LiveSignalChartProps) {
    const currentVal = data[data.length - 1]?.value.toFixed(0) || '0';
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d.value - 50) / 100) * 100}`).join(' ');

    const strokeColors = {
        emerald: 'stroke-emerald-500',
        amber: 'stroke-amber-500',
        red: 'stroke-red-500',
        teal: 'stroke-teal-500',
    };

    const textColors = {
        emerald: 'text-emerald-600',
        amber: 'text-amber-600',
        red: 'text-red-600',
        teal: 'text-teal-600',
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-semibold text-slate-500 tracking-wide">{label}</span>
                <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-semibold tracking-tighter ${textColors[color]}`}>{currentVal}</span>
                    <span className="text-xs font-semibold font-mono text-slate-400">{unit}</span>
                </div>
            </div>

            <div className="relative w-full h-24 mt-auto">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="100" y2="20" className="stroke-slate-200" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="0" y1="50" x2="100" y2="50" className="stroke-slate-200" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="0" y1="80" x2="100" y2="80" className="stroke-slate-200" strokeWidth="1" strokeDasharray="2 2" />

                    <motion.polyline
                        points={points}
                        fill="none"
                        className={`${strokeColors[color]}`}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0.8 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "linear", repeat: Infinity }}
                        style={{ filter: `drop-shadow(0 0 8px var(--tw-shadow-color))` }}
                    />
                </svg>
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
