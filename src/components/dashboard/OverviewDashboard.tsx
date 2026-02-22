"use client";

import { motion } from 'framer-motion';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { useFamilyStore } from '@/store/familyStore';
import { useWorkerStore } from '@/store/workerStore';
import { useOverviewStore } from '@/store/overviewStore';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import {
    MessageSquareText,
    Stethoscope,
    Building2,
    ClipboardList,
    Pill,
    BellRing,
    FileText,
    Users,
    CalendarClock,
    Activity,
    AlertCircle,
    CheckCircle2,
    BrainCircuit,
    Heart,
    User,
    ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const QUICK_CARDS = [
    { id: 'chat', title: 'Talk to AI Avatar', icon: MessageSquareText, color: 'text-purple-600', bg: 'bg-purple-100', targetRoute: '/ai-insights' },
    { id: 'doctor', title: 'Contact Doctor', icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-100', targetRoute: '/patient-review' },
    { id: 'hospitals', title: 'Connect Hospital', icon: Building2, color: 'text-teal-600', bg: 'bg-teal-100', targetRoute: '/hospital-network' },
    { id: 'care_plan', title: 'Care Plan', icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-100', targetRoute: '/family' },
    { id: 'meds', title: 'View Medications', icon: Pill, color: 'text-indigo-600', bg: 'bg-indigo-100', targetRoute: '/family' },
    { id: 'alerts', title: 'Recent Alerts', icon: BellRing, color: 'text-rose-600', bg: 'bg-rose-100', targetRoute: '/deep-history' },
    { id: 'reports', title: 'Upload Records', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-200', targetRoute: '/account' },
    { id: 'family', title: 'Family Status', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100', targetRoute: '/family' },
    { id: 'visits', title: 'Upcoming Visits', icon: CalendarClock, color: 'text-cyan-600', bg: 'bg-cyan-100', targetRoute: '/deep-history' },
];

export function OverviewDashboard() {
    const { participantCondition } = usePatientCoreStore();
    const router = useRouter();
    const isStable = participantCondition === 'stable';
    const { vitalsSummary, recommendation, heartRateStream, oxygenStream } = useFamilyStore();
    const tasks = useWorkerStore(state => state.tasks);
    const activeTasks = tasks.filter(t => t.status === 'active' || t.status === 'pending');

    // Derived family status block since we decoupled it from patientCoreStore
    const familyStatus = {
        condition: participantCondition,
        vitalsSummary,
        recommendation,
        lastHR: Math.round(heartRateStream[heartRateStream.length - 1]?.value || 75),
        lastO2: Math.round(oxygenStream[oxygenStream.length - 1]?.value || 98)
    };
    useOverviewStore(); // Registering overviewStore usage

    // Dynamically render interior card content based on type
    const renderCardStats = (id: string) => {
        switch (id) {
            case 'chat': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Contextual AI</div><div className="text-sm font-semibold text-purple-700 mt-1">Standby for queries</div></>;
            case 'doctor': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Provider Link</div><div className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded mt-1 shadow-sm">Available 24/7</div></>;
            case 'hospitals': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Network Route</div><div className="text-sm font-semibold text-teal-700 mt-1">18 Global Nodes</div></>;
            case 'care_plan': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Protocols</div><div className="text-sm font-semibold text-emerald-700 mt-1">{activeTasks.length} Pending Actions</div></>;
            case 'meds': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Adherence Metrics</div><div className="text-sm font-semibold text-indigo-700 mt-1">100% Tracking</div></>;
            case 'alerts': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Anomaly Radar</div><div className="text-sm font-semibold text-rose-700 mt-1">{isStable ? '0 Anomalies' : 'Action Required'}</div></>;
            case 'reports': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Audit Trail</div><div className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded mt-1 shadow-sm">HIPAA Compliant</div></>;
            case 'family': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Status Summary</div><div className="text-xs font-semibold text-amber-700 mt-1 line-clamp-2 leading-relaxed text-left">{familyStatus.vitalsSummary}</div></>;
            case 'visits': return <><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Scheduling Route</div><div className="text-sm font-semibold text-cyan-700 mt-1">Next: PT @ 14:00</div></>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 pb-24 relative animate-in fade-in duration-500">
            {/* Patient Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-800 break-words">Evelyn Vance</h1>
                    <div className="text-sm text-slate-600 font-medium break-words leading-relaxed">
                        Age: 78 &bull; Conditions: Hypertension, Mild Cognitive Impairment
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide uppercase flex items-center gap-2 border ${isStable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    <Activity size={16} />
                    Risk Level: {isStable ? 'Low / Stable' : 'Elevated / At-Risk'}
                </div>
            </div>

            {/* Care Workspaces */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Care Workspaces</h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <button onClick={() => router.push('/family')} className="p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm focus:outline-none flex flex-col items-center gap-3 text-sm">
                        <Heart className="text-rose-500" size={24} />
                        Family Workspace
                    </button>
                    <button onClick={() => router.push('/worker')} className="p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm focus:outline-none flex flex-col items-center gap-3 text-sm">
                        <User className="text-blue-500" size={24} />
                        Worker Workspace
                    </button>
                    <button onClick={() => router.push('/provider')} className="p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm focus:outline-none flex flex-col items-center gap-3 text-sm">
                        <Stethoscope className="text-teal-500" size={24} />
                        Provider Workspace
                    </button>
                    <button onClick={() => router.push('/hospital')} className="p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm focus:outline-none flex flex-col items-center gap-3 text-sm">
                        <Building2 className="text-indigo-500" size={24} />
                        Hospital Workspace
                    </button>
                    <button onClick={() => router.push('/regulator')} className="p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm focus:outline-none flex flex-col items-center gap-3 text-sm">
                        <ShieldCheck className="text-slate-600" size={24} />
                        Regulator Workspace
                    </button>
                </div>
            </div>

            {/* Mission Control Header & Daily Summary */}
            <GlassPanel delay={0.1} className="p-6 md:p-8 bg-blue-50 border border-blue-100 shadow-sm rounded-2xl w-full">
                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold tracking-widest uppercase text-blue-500 break-words">Mission Control Dashboard</h2>
                    <h3 className="text-xl md:text-2xl font-normal text-blue-900 leading-relaxed break-words">
                        {isStable
                            ? "Today Evelyn is completely stable. Her next medication is scheduled in 2 hours."
                            : "Evelyn requires attention today. A care coordinator is reviewing her vitals."}
                    </h3>
                </div>
            </GlassPanel>

            {/* Quick Access Live Widgets */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {QUICK_CARDS.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <motion.button
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + (idx * 0.05), duration: 0.4 }}
                            onClick={() => router.push(card.targetRoute)}
                            className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md p-5 rounded-2xl flex flex-col items-start gap-1 text-left transition-all group active:scale-95 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start w-full mb-2">
                                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center group-hover:scale-110 shadow-sm transition-transform`}>
                                    <Icon className={`${card.color} w-5 h-5`} />
                                </div>
                            </div>
                            <span className="font-bold text-slate-800 text-sm tracking-tight">{card.title}</span>
                            {renderCardStats(card.id)}
                        </motion.button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Column 1: Actions & Schedule */}
                <div className="flex flex-col gap-6">
                    {/* Today Care Plan */}
                    <GlassPanel delay={0.4} title="Today's Care Plan" className="bg-white border-slate-200 shadow-sm">
                        <div className="mt-4 flex flex-col gap-3">
                            {activeTasks.length > 0 ? activeTasks.map(task => (
                                <div key={task.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                                            <ClipboardList size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm tracking-tight">{task.title}</div>
                                            <div className="text-xs text-slate-500">{task.priority === 'critical' ? 'Urgent' : 'Routine'} &bull; {task.time}</div>
                                        </div>
                                    </div>
                                    <button className="text-emerald-600 hover:text-emerald-700 font-bold p-2 text-xs uppercase tracking-widest bg-emerald-50 rounded-lg border border-emerald-100 transition-colors">
                                        Start
                                    </button>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-slate-400 font-medium text-sm">
                                    All protocols completed for today.
                                </div>
                            )}
                        </div>
                    </GlassPanel>

                    {/* Upcoming Appointments */}
                    <GlassPanel delay={0.45} title="Upcoming Appointments" className="bg-white border-slate-200 shadow-sm">
                        <div className="mt-4 flex flex-col gap-3">
                            <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl flex items-start gap-4 shadow-sm relative overflow-hidden group hover:border-cyan-200 transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 shadow-inner relative z-10 border border-cyan-200">
                                    <Stethoscope size={20} />
                                </div>
                                <div className="relative z-10 w-full">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-bold text-cyan-900 text-sm tracking-tight">Physical Therapy</div>
                                        <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest bg-white/60 px-2 py-0.5 rounded">Today, 2:00 PM</div>
                                    </div>
                                    <div className="text-xs text-cyan-800/80 leading-relaxed font-medium">Dr. Miller - Telehealth link ready in portal.</div>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* Column 2: Alerts & Intelligence */}
                <div className="flex flex-col gap-6">
                    {/* Recent Alerts Timeline */}
                    <GlassPanel delay={0.5} title="Recent Alerts Timeline" className="bg-white border-slate-200 shadow-sm">
                        <div className="mt-4 flex flex-col gap-3">
                            {!isStable ? (
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors cursor-pointer" onClick={() => router.push('/deep-history')}>
                                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-inner relative z-10 border border-amber-200">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="relative z-10 w-full">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-amber-900 text-sm tracking-tight">Vitals Instability</div>
                                            <div className="text-xs font-semibold text-amber-700">10 mins ago</div>
                                        </div>
                                        <div className="text-xs text-amber-800/80 leading-relaxed font-medium">Recent telemetry indicates minor instability. Coordinator notified.</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-6 text-center gap-2 border border-dashed border-slate-200 rounded-xl">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-1 border border-emerald-100 shadow-sm">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div className="font-bold text-slate-700 text-sm">Zero Active Alerts</div>
                                    <div className="text-xs text-slate-400">Sensors detecting normal baseline.</div>
                                </div>
                            )}

                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 shadow-inner">
                                    <Pill size={14} />
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <div className="font-bold text-slate-700 text-xs">Medication Adjusted</div>
                                        <div className="text-[10px] text-slate-400">14 hours ago</div>
                                    </div>
                                    <div className="text-[11px] text-slate-500">Lisinopril dosage modified by Dr. Chen to manage evening spikes.</div>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Last AI Summary */}
                    <GlassPanel delay={0.55} title="Last AI Summary" className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <BrainCircuit size={100} className="text-purple-600" />
                        </div>
                        <div className="mt-2 text-sm text-purple-900/80 leading-relaxed relative z-10">
                            <p className="mb-3 font-medium">Based on the previous 72 hours of telemetry, overall recovery trajectory is positive.</p>
                            <ul className="list-disc pl-5 space-y-1.5 text-xs text-purple-800">
                                <li><strong>Sleep Architecture:</strong> Improved deep sleep cycles (+15%).</li>
                                <li><strong>Mobility:</strong> Steps increased daily, remaining fall risk is low.</li>
                                <li><strong>Recommendation:</strong> Proceed with standard physical therapy session today. Maintain current hydration targets.</li>
                            </ul>
                            <button onClick={() => router.push('/ai-insights')} className="mt-4 text-xs font-bold text-purple-700 hover:text-purple-800 hover:underline uppercase tracking-wide flex items-center gap-1">
                                Open Full Analysis &rarr;
                            </button>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
}
