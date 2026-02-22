"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import { Check, Activity, Battery, Smile, ActivitySquare, Utensils } from 'lucide-react';

const METRICS = [
    { id: 'pain', label: 'Pain Level', icon: Activity, colors: ['from-teal-400 to-teal-600', 'from-amber-400 to-amber-600', 'from-red-400 to-red-600'] },
    { id: 'energy', label: 'Energy', icon: Battery, colors: ['from-red-400 to-red-600', 'from-amber-400 to-amber-600', 'from-teal-400 to-teal-600'] },
    { id: 'mood', label: 'Mood', icon: Smile, colors: ['from-red-400 to-red-600', 'from-amber-400 to-amber-600', 'from-teal-400 to-teal-600'] },
    { id: 'mobility', label: 'Mobility', icon: ActivitySquare, colors: ['from-red-400 to-red-600', 'from-amber-400 to-amber-600', 'from-teal-400 to-teal-600'] },
    { id: 'appetite', label: 'Appetite', icon: Utensils, colors: ['from-red-400 to-red-600', 'from-amber-400 to-amber-600', 'from-teal-400 to-teal-600'] }
];

export function WellnessSliders() {
    const [values, setValues] = useState<Record<string, number>>({
        pain: 20,
        energy: 80,
        mood: 90,
        mobility: 75,
        appetite: 100
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSlide = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        setValues(prev => ({ ...prev, [id]: parseInt(e.target.value) }));
    };

    const getGradient = (id: string, val: number) => {
        const conf = METRICS.find(m => m.id === id);
        if (!conf) return 'from-blue-400 to-blue-600';
        if (val < 33) return conf.colors[0];
        if (val < 66) return conf.colors[1];
        return conf.colors[2];
    };

    const getLabel = (id: string, val: number) => {
        if (id === 'pain') {
            if (val < 33) return "None";
            if (val < 66) return "Moderate";
            return "Severe";
        }
        if (val < 33) return "Low";
        if (val < 66) return "Okay";
        return "Great";
    };

    if (isSubmitted) {
        return (
            <GlassPanel delay={0.1} className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <Check size={32} />
                </div>
                <h3 className="text-xl text-white/90 font-medium mb-2">Check-in Complete</h3>
                <p className="text-white/50 text-sm">Thank you, Evelyn. Your care team has received your update.</p>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel delay={0.1} title="Morning Check-In" className="mb-6">
            <p className="text-white/50 text-sm mb-6">Drag the sliders to let us know how you are feeling right now.</p>
            <div className="space-y-8">
                {METRICS.map(metric => {
                    const val = values[metric.id];
                    const gradient = getGradient(metric.id, val);
                    const label = getLabel(metric.id, val);
                    const Icon = metric.icon;

                    return (
                        <div key={metric.id} className="relative">
                            <div className="flex justify-between items-end mb-3">
                                <div className="flex items-center gap-2">
                                    <Icon size={18} className="text-white/70" />
                                    <span className="text-white/90 font-medium tracking-wide">{metric.label}</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/50">{label}</span>
                            </div>

                            {/* Google-Style Liquid Slider (Large touch target) */}
                            <div className="relative h-12 w-full rounded-2xl bg-white/5 overflow-hidden border border-white/10 touch-none group">
                                <motion.div
                                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${gradient} opacity-80`}
                                    initial={false}
                                    animate={{ width: `${val}%` }}
                                    transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={val}
                                    onChange={(e) => handleSlide(metric.id, e)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => setIsSubmitted(true)}
                className="w-full mt-8 py-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-bold tracking-wide transition-all active:scale-95"
            >
                Submit Check-In
            </button>
        </GlassPanel>
    );
}
