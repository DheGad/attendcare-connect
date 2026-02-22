"use client";

import { useRegulatorStore } from "@/store/regulatorStore";
import { ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { GlassPanel } from "@/components/primitives/GlassPanel";

export default function RegulatorPage() {
    const { auditLogs, complianceScore } = useRegulatorStore();

    return (
        <div className="flex flex-col gap-6 pb-24 h-full">
            <header className="mb-2">
                <h1 className="text-3xl font-light tracking-tight text-slate-800">Audit & Compliance</h1>
                <p className="text-slate-500 font-medium mt-1">Immutable log view for regulatory oversight.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassPanel delay={0.1} className="p-6 bg-teal-50 border border-teal-100 text-teal-900 shadow-sm flex flex-col justify-center items-center text-center">
                    <ShieldCheck size={48} className="text-teal-500 mb-4" />
                    <div className="text-5xl font-black tracking-tighter">{complianceScore}%</div>
                    <div className="text-sm font-bold tracking-widest uppercase text-teal-600/70 mt-2">Network Compliance</div>
                </GlassPanel>

                <GlassPanel delay={0.2} title="System Audit Logs" className="md:col-span-2 p-6 bg-white overflow-y-auto max-h-[500px]">
                    <div className="space-y-4">
                        {auditLogs.map(log => (
                            <div key={log.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {log.status === 'compliant' ? <CheckCircle2 className="text-emerald-500" /> : <AlertTriangle className="text-amber-500" />}
                                    <div>
                                        <div className="font-bold text-slate-800">{log.action}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-1">Actor: {log.actor}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${log.status === 'compliant' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {log.status}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-2 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
