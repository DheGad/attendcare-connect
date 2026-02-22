"use client";

import { useEffect, useState } from 'react';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { useRouter } from 'next/navigation';

export function TopStatusBar() {
    const router = useRouter();
    const [time, setTime] = useState<string>('');
    const [sessionSeconds, setSessionSeconds] = useState<number>(0);
    const { participantCondition } = usePatientCoreStore();

    useEffect(() => {
        const updateTime = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        updateTime();
        const int = setInterval(() => {
            updateTime();
            setSessionSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(int);
    }, []);

    const formatSessionTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    };



    return (
        <header className="fixed top-0 left-0 w-full z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shrink-0 shadow-sm md:shadow-none">
            <div className="flex px-4 py-3 justify-between items-center w-full max-w-[1400px] mx-auto gap-4">
                {/* Brand / Condition Indicator */}
                <div
                    className="flex flex-col pr-6 border-r border-slate-200 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push('/overview')}
                >
                    <div className="flex items-center gap-3 mb-1">
                        <div className={`w-2 h-2 rounded-full ${participantCondition === 'stable' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : participantCondition === 'at-risk' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'}`} />
                        <span className="text-xs font-black tracking-widest text-slate-800">ATTENDCARE <span className="text-blue-600">CONNECT</span></span>
                        {time && <span className="text-[11px] font-mono text-slate-400 tracking-wider ml-2 hidden lg:inline-block">{time}</span>}
                    </div>
                </div>
                {/* Session Timer */}
                <div className="hidden lg:flex items-center gap-1.5 ml-2 mr-auto pl-6">
                    <div className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="flex w-1.5 h-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-500"></span>
                        </span>
                        Session: {formatSessionTime(sessionSeconds)}
                    </div>
                </div>


            </div>
        </header>
    );
}
