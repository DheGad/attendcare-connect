"use client";

import { motion } from 'framer-motion';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { useWorkerStore } from '@/store/workerStore';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import { CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
export function OperationsConsole() {
    const { participantCondition, syncLiveState } = usePatientCoreStore();
    const { data: session } = useSession();

    // Derived task state from workerStore
    const { tasks, completeActiveTask } = useWorkerStore();

    // Sync tasks if the global condition shifts
    useEffect(() => {
        // Keep worker context stable
    }, [participantCondition]); // only re-sync on major condition changes

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleConfirmStep = async () => {
        const activeTask = tasks.find(t => t.status === 'active');
        if (!activeTask || !session?.user) return;

        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const now = new Date();
            const start = new Date(now.getTime() - 60000);
            const end = new Date(now.getTime() + 60000);

            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    workerId: (session.user as any).id,
                    participantId: 'cmlvxgdyx0001w7mwq8j323dz',
                    taskCode: activeTask.taskCode,
                    timeWindowStart: start.toISOString(),
                    timeWindowEnd: end.toISOString(),
                    requiredPreviousTask: activeTask.id > 1 ? tasks[activeTask.id - 2].taskCode : null
                })
            });

            const data = await res.json();

            if (res.ok) {
                completeActiveTask();
                await syncLiveState();
            } else {
                setErrorMsg(data.errors?.[0] || 'Validation failed');
            }
        } catch {
            setErrorMsg('System disconnected');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 h-full pb-24">
            <GlassPanel delay={0.1} title="Shift Checklist & Protocol Guardrails" className="flex-1 flex flex-col pt-4 bg-white">
                <div className="space-y-3 overflow-y-auto pr-2 no-scrollbar">
                    {tasks.map((task) => (
                        <div key={task.id} className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${task.status === 'done' ? 'bg-slate-50 border-slate-200 opacity-50' :
                            task.status === 'active' ? (task.missed ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-teal-50 border-teal-200 shadow-sm') :
                                'bg-slate-50 opacity-40 border-slate-100 grayscale'
                            }`}>
                            <div className="flex items-center gap-4">
                                {task.status === 'done' ? <CheckCircle2 className="text-emerald-500" /> :
                                    task.status === 'active' ? (task.missed ? <AlertTriangle className="text-red-500 animate-pulse" /> : <Clock className="text-teal-600 animate-pulse" />) :
                                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300" />}
                                <div>
                                    <div className={`text-sm md:text-base font-semibold ${task.status === 'active' ? 'text-slate-800' : 'text-slate-500'}`}>
                                        {task.title}
                                    </div>
                                    {task.missed && task.status === 'active' && (
                                        <div className="text-xs text-red-600 font-bold mt-1 tracking-widest uppercase">Overdue / Priority Escalate</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${task.priority === 'critical' ? 'text-red-700 bg-red-100 border-red-200' :
                                    task.priority === 'high' ? 'text-amber-700 bg-amber-100 border-amber-200' :
                                        'text-blue-700 bg-blue-100 border-blue-200'
                                    }`}>{task.priority}</span>
                                <span className="text-xs font-semibold font-mono text-slate-500">{task.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm flex gap-3 items-start shadow-sm">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <div className="font-bold tracking-widest uppercase text-xs text-red-600 mb-1">Safety Guardrail Active</div>
                            <div className="leading-relaxed font-medium">{errorMsg}. Please resolve this to ensure patient safety before proceeding.</div>
                        </div>
                    </motion.div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-200">
                    <button
                        onClick={handleConfirmStep}
                        disabled={isSubmitting || !tasks.some(t => t.status === 'active')}
                        className="w-full flex justify-center items-center py-4 rounded-xl bg-blue-600 text-white font-bold tracking-wide hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Quick Action Selection'}
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
}
