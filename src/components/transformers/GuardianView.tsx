"use client";

import { usePatientCoreStore } from '@/store/patientCoreStore';
import { useFamilyStore } from '@/store/familyStore';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import { Heart, Activity, Pill, AlertCircle, Users, CalendarClock, ArrowRight, Check, CheckSquare, Send } from 'lucide-react';
import { useState } from 'react';

export function GuardianView() {
    const { participantCondition: condition } = usePatientCoreStore();
    const { vitalsSummary, recommendation, heartRateStream, oxygenStream } = useFamilyStore();
    const isStable = condition === 'stable';

    const currentHR = heartRateStream?.[heartRateStream.length - 1]?.value || 72;
    const currentO2 = oxygenStream?.[oxygenStream.length - 1]?.value || 98;

    // Editable Mock State
    const [medsConfirmed, setMedsConfirmed] = useState(false);
    const [note, setNote] = useState('');
    const [routines, setRoutines] = useState([
        { id: 1, title: 'Morning Walk (15 mins)', done: true },
        { id: 2, title: 'Low-Sodium Lunch', done: false },
        { id: 3, title: 'Evening Vitals Check', done: false }
    ]);

    const toggleRoutine = (id: number) => {
        setRoutines(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
    };

    const handleNoteSubmit = () => {
        if (!note.trim()) return;
        alert("Caregiver Note Saved:\n" + note);
        setNote('');
    };

    return (
        <div className="flex flex-col h-full gap-6 pb-24 relative">

            {/* PERSISTENT PATIENT HEADER - FAMILY VIEW STANDARD */}
            <GlassPanel delay={0.05} className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 border-none shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                        {isStable ? <Heart className="text-emerald-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" /> :
                            <AlertCircle className="text-amber-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-pulse" />}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Evelyn Vance</h2>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${isStable ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                                {isStable ? 'Safe & Resting' : 'Attention Required'}
                            </span>
                            <span className="text-indigo-200 text-xs font-medium">Active Monitoring Session</span>
                        </div>
                    </div>
                </div>
            </GlassPanel>

            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">

                {/* Sentence 1: Condition & Reassurance */}
                <GlassPanel delay={0.1} className={`p-5 bg-white border-l-4 shadow-sm ${isStable ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full shrink-0 ${isStable ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Condition is {isStable ? 'Stable' : 'Elevated'}</h3>
                            <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                {vitalsSummary}
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Live Signals / Telemetry */}
                <GlassPanel delay={0.15} className="p-5 bg-slate-900 border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50" />
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity size={14} className="text-blue-400" /> Live Signals Streaming
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 relative">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Heart Rate</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-light text-white tracking-tighter">{currentHR}</span>
                                <span className="text-sm font-medium text-slate-500">bpm</span>
                            </div>
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 relative">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Blood Oxygen</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-light text-white tracking-tighter">{currentO2}</span>
                                <span className="text-sm font-medium text-slate-500">%</span>
                            </div>
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        </div>
                    </div>
                </GlassPanel>

                {/* Caregiver Actions & Next Steps */}
                <GlassPanel delay={0.2} className="p-5 bg-white border-l-4 border-l-blue-500 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-full text-blue-600 shrink-0">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Caregiver Actions &amp; Next Steps</h3>
                            <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                {recommendation}
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Editable Section: Daily Routines Checklist */}
                <GlassPanel delay={0.25} className="p-5 bg-white shadow-sm flex flex-col gap-3">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                        <CheckSquare size={16} className="text-teal-600" /> Today&apos;s Routine
                    </h4>
                    <div className="flex flex-col gap-2">
                        {routines.map(routine => (
                            <button
                                key={routine.id}
                                onClick={() => toggleRoutine(routine.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${routine.done ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white border-slate-200 text-slate-800 hover:border-teal-300'}`}
                            >
                                <div className={`flex items-center justify-center w-6 h-6 rounded ${routine.done ? 'bg-teal-500 text-white' : 'border-2 border-slate-300 text-transparent'}`}>
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                <span className={`text-sm font-medium ${routine.done ? 'line-through decoration-slate-300' : ''}`}>{routine.title}</span>
                            </button>
                        ))}
                    </div>
                </GlassPanel>


                {/* Editable Section: Medication Adherence */}
                <GlassPanel delay={0.3} className="p-5 bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className={medsConfirmed ? "text-teal-500 transition-all duration-1000" : "text-amber-500 transition-all duration-1000"} strokeDasharray={medsConfirmed ? "100, 100" : "50, 100"} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Pill className={medsConfirmed ? "text-teal-600 w-5 h-5" : "text-amber-600 w-5 h-5"} />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Medications</div>
                            <div className="text-base font-bold text-slate-800">{medsConfirmed ? '100% Adherence' : 'Pending Confirmation'}</div>
                            <div className={`text-sm font-medium mt-0.5 ${medsConfirmed ? 'text-teal-600' : 'text-amber-600'}`}>
                                {medsConfirmed ? 'All morning doses taken.' : 'Evening dosage pending.'}
                            </div>
                        </div>
                    </div>

                    {!medsConfirmed ? (
                        <button
                            onClick={() => setMedsConfirmed(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm tracking-wide rounded-lg transition-colors border border-amber-200"
                        >
                            Confirm Dose
                        </button>
                    ) : (
                        <div className="px-4 py-2 bg-teal-50 text-teal-700 font-bold text-sm rounded-lg border border-teal-100 flex items-center gap-2">
                            <Check size={16} /> Logged
                        </div>
                    )}
                </GlassPanel>

                {/* Editable Section: Caregiver Notes */}
                <GlassPanel delay={0.35} className="p-5 bg-white shadow-sm flex flex-col gap-3">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Add Caregiver Note</h4>
                    <div className="flex gap-2">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Notice any changes? How is Evelyn feeling today?"
                            className="flex-1 w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none h-20"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleNoteSubmit}
                            disabled={!note.trim()}
                            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                            <Send size={16} /> Submit Note
                        </button>
                    </div>
                </GlassPanel>

                {/* Visit Reminder */}
                <GlassPanel delay={0.4} className="p-5 bg-white shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                            <CalendarClock size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Upcoming Visit</div>
                            <div className="text-base font-bold text-slate-800">Cardiology Follow-up</div>
                            <div className="text-sm font-medium text-slate-500 mt-0.5">Tomorrow at 10:00 AM</div>
                        </div>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
                </GlassPanel>

            </div>
        </div>
    );
}
