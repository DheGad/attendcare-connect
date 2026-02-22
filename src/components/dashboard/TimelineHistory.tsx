"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import {
    Activity, Clock, Pill,
    FileText, Stethoscope, AlertTriangle,
    ArrowRightCircle, ChevronDown, CheckCircle2, Search
} from 'lucide-react';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { useHistoryStore, Timescale, EventCategory, TimelineEvent } from '@/store/historyStore';

export function TimelineHistory() {
    const { participantCondition } = usePatientCoreStore();
    const { events: DUMMY_EVENTS } = useHistoryStore();
    const [timescale, setTimescale] = useState<Timescale>('24h');
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Inject dynamic state-based event if critical
    // Inject dynamic state-based event if critical
    const baseEvents = DUMMY_EVENTS[timescale];
    const initialEvents = participantCondition === 'critical' && timescale === '24h' ? [
        { id: 'crit-1', time: 'Just Now', category: 'escalation', title: 'Critical Telemetry Variance', description: 'SpO2 drops below 92% sustained. Automated escalation to rapid response team initiated.', author: 'System Alert' } as TimelineEvent,
        ...baseEvents
    ] : baseEvents;

    const events = initialEvents.filter(evt => evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || evt.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex flex-col gap-6 h-full animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
            {/* Header & Zoom Controls */}
            <GlassPanel className="p-5 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Deep Clinical Timeline</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Cross-institutional longitudinal patient history.</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner w-full md:w-auto overflow-x-auto no-scrollbar">
                    <ZoomBtn active={timescale === '24h'} onClick={() => setTimescale('24h')} label="24 Hours" />
                    <ZoomBtn active={timescale === '7d'} onClick={() => setTimescale('7d')} label="7 Days" />
                    <ZoomBtn active={timescale === '30d'} onClick={() => setTimescale('30d')} label="30 Days" />
                    <ZoomBtn active={timescale === '6mo'} onClick={() => setTimescale('6mo')} label="6 Months" />
                </div>
            </GlassPanel>

            {/* Search UI */}
            <div className="relative w-full shadow-sm rounded-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    placeholder="Search clinical events, vitals, or medication history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-slate-400"
                />
            </div>

            {/* Timeline UI */}
            <div className="flex-1 bg-white relative py-1px px-4 md:px-12 border-none">
                <div className="absolute left-8 md:left-[104px] top-4 bottom-10 w-0.5 bg-slate-200 rounded-full" />

                <div className="space-y-6 relative z-10 w-full overflow-y-auto max-h-[60vh] pb-10 pr-4 styled-scrollbar">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 pl-16 md:pl-[140px] mb-4 mt-4">
                        <Clock size={14} /> Tracking {timescale} Horizon
                    </div>

                    {events.map((evt) => (
                        <div key={evt.id} className="relative flex items-start gap-6 group w-full">
                            {/* Time (Desktop) */}
                            <div className="w-20 shrink-0 text-right pt-[10px] hidden md:block">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{evt.time}</span>
                            </div>

                            {/* Node */}
                            <div className="relative">
                                <div className={`absolute -left-[51px] md:-left-4 md:-translate-x-1/2 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 ${getCategoryBg(evt.category)}`}>
                                    <CategoryIcon category={evt.category} />
                                </div>
                            </div>

                            {/* Content */}
                            <div
                                onClick={() => toggleExpand(evt.id)}
                                className="flex-1 bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow hover:border-slate-300 ml-12 md:ml-0 group-hover:bg-white cursor-pointer"
                            >
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2 md:hidden">{evt.time}</div>
                                <div className="flex justify-between items-start mb-2 gap-4 flex-wrap">
                                    <h4 className="text-base font-bold text-slate-800">{evt.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${getCategoryBadge(evt.category)}`}>
                                            {evt.category}
                                        </span>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${expandedIds.has(evt.id) ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                <div className={`grid transition-all duration-300 ${expandedIds.has(evt.id) ? 'grid-rows-[1fr] opacity-100 mt-2 mb-4' : 'grid-rows-[0fr] opacity-0 m-0'}`}>
                                    <div className="overflow-hidden text-sm text-slate-600 leading-relaxed font-medium">
                                        {evt.description}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 pt-3 border-t border-slate-100">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold tracking-tighter shadow-inner">
                                        {evt.author.substring(0, 2).toUpperCase()}
                                    </div>
                                    {evt.author}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 pl-16 md:pl-[140px] mt-6">
                        <ArrowRightCircle size={14} className="-rotate-90" /> End of log
                    </div>
                </div>
            </div>
        </div>
    );
}

function ZoomBtn({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`relative flex-1 md:flex-none px-4 py-2 rounded-lg text-[11px] uppercase tracking-widest font-bold transition-colors z-10 ${active ? 'text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            {active && (
                <motion.div
                    layoutId="activeZoom"
                    className="absolute inset-0 bg-white border border-slate-200 rounded-lg -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            )}
            <span className="relative z-10">{label}</span>
        </button>
    )
}

function CategoryIcon({ category }: { category: EventCategory }) {
    switch (category) {
        case 'vitals': return <Activity size={16} className="text-blue-600" />;
        case 'intervention': return <Stethoscope size={16} className="text-purple-600" />;
        case 'medication': return <Pill size={16} className="text-teal-600" />;
        case 'note': return <FileText size={16} className="text-slate-600" />;
        case 'escalation': return <AlertTriangle size={16} className="text-red-600" />;
        case 'discharge': return <CheckCircle2 size={16} className="text-emerald-600" />;
    }
}

function getCategoryBg(category: EventCategory) {
    switch (category) {
        case 'vitals': return 'bg-blue-100';
        case 'intervention': return 'bg-purple-100';
        case 'medication': return 'bg-teal-100';
        case 'note': return 'bg-slate-100';
        case 'escalation': return 'bg-red-100 ring-4 ring-red-50';
        case 'discharge': return 'bg-emerald-100';
    }
}

function getCategoryBadge(category: EventCategory) {
    switch (category) {
        case 'vitals': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'intervention': return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'medication': return 'bg-teal-50 text-teal-700 border-teal-200';
        case 'note': return 'bg-slate-50 text-slate-700 border-slate-200';
        case 'escalation': return 'bg-red-50 text-red-700 border-red-200';
        case 'discharge': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
}
