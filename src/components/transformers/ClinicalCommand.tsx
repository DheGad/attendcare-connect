"use client";

import { GlassPanel } from '@/components/primitives/GlassPanel';
import { Users, Clock, AlertTriangle } from 'lucide-react';
import { useProviderStore } from '@/store/providerStore';

export function ClinicalCommand() {
    const { riskLevel, clinicalSummary, biomarkerTrend, activeAlerts } = useProviderStore();
    const hrAnomaly = activeAlerts.some(a => a.includes('HR_'));
    const o2Anomaly = activeAlerts.some(a => a.includes('O2_'));

    return (
        <div className="flex flex-col gap-6 pb-24 h-full">
            {/* Header section representing Operational Coordination */}
            <GlassPanel delay={0.1} className="p-6 bg-white border-slate-200">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-light text-slate-800 tracking-tight">Operational Coordination</h2>
                        <div className="text-sm font-semibold text-slate-500 tracking-widest uppercase mt-1">Provider Dashboard</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl border bg-blue-50 border-blue-200 text-blue-700">
                        <div className="text-[10px] font-bold tracking-widest uppercase opacity-70 mb-1">Shift Status</div>
                        <div className="text-sm font-semibold">Active: Dr. Aris • 14 Patients</div>
                    </div>
                </div>
            </GlassPanel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assigned Patients List */}
                <GlassPanel delay={0.2} title="Assigned Patients" className="bg-white">
                    <div className="mt-4 space-y-3">
                        {[
                            { name: 'Smith, John', room: '204-A', status: 'Stable', time: '10m ago' },
                            {
                                name: 'Vance, Evelyn',
                                room: 'Home Care',
                                status: riskLevel === 'stable' ? 'Stable' : riskLevel === 'at-risk' ? 'Review Needed' : 'Critical Escalation',
                                time: 'Live',
                                alert: riskLevel !== 'stable'
                            },
                            { name: 'Chen, Wei', room: '312-B', status: 'Pending Discharge', time: '1h ago' }
                        ].map((patient, i) => (
                            <div key={i} className={`p-4 rounded-xl border flex justify-between items-center ${patient.alert ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
                                <div>
                                    <div className={`font-semibold ${patient.alert ? 'text-amber-900' : 'text-slate-800'}`}>{patient.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                        <span className="font-medium">{patient.room}</span> • {patient.status}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xs font-bold uppercase tracking-wider ${patient.alert ? 'text-amber-700' : 'text-emerald-600'}`}>
                                        {patient.alert ? 'Action Req' : 'Nominal'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 justify-end"><Clock size={10} /> {patient.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                {/* Staff Coordination Summary */}
                <GlassPanel delay={0.3} title="Staff Coordination" className="bg-white">
                    <div className="mt-4 space-y-4">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Users size={16} className="text-indigo-500" /> Active Roster</h4>
                                <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded uppercase">Shift 2A</span>
                            </div>
                            <div className="text-sm text-slate-600 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-700">RN. Sarah J.</span>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">On Floor</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-700">PT. Marcus T.</span>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">In Session</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-700">MD. Aris S.</span>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Rounding</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* Care Plan Management */}
                <GlassPanel delay={0.4} title="Care Plan Management" className="bg-white flex-1">
                    <div className="mt-4 space-y-3">
                        <div className={`p-4 border-l-4 rounded-r-xl shadow-sm border border-slate-200 border-l-0 ${riskLevel === 'stable' ? 'border-l-teal-500 bg-slate-50' : 'border-l-amber-500 bg-amber-50/30'}`}>
                            <div className="text-sm font-semibold text-slate-800">Review Active Telemetry <span className="text-slate-500 font-normal">(E. Vance)</span></div>
                            <div className="text-xs text-slate-600 mt-1.5 leading-relaxed">{clinicalSummary} Biomarkers: <span className="font-bold">{biomarkerTrend}</span>. {hrAnomaly && 'HR Anomaly Detected.'} {o2Anomaly && 'O2 Anomaly Detected.'}</div>
                        </div>
                        <div className="p-4 border-l-4 border-l-emerald-500 bg-slate-50 rounded-r-xl shadow-sm border border-slate-200 border-l-0">
                            <div className="text-sm font-semibold text-slate-800">PT Escalation Authorized <span className="text-slate-500 font-normal">(J. Smith)</span></div>
                            <div className="text-xs text-slate-600 mt-1.5 leading-relaxed">Confirmed weight-bearing transition guidelines signed off by orthopedics.</div>
                        </div>
                    </div>
                </GlassPanel>

                <div className="flex flex-col gap-6">
                    {/* Documentation Completeness */}
                    <GlassPanel delay={0.5} title="Documentation Completeness" className="bg-white">
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-slate-700">Daily Charting Compliance</span>
                                <span className="text-indigo-600 font-bold">85%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 shadow-inner">
                                <div className="bg-indigo-500 h-2.5 rounded-full shadow-sm" style={{ width: '85%' }}></div>
                            </div>
                            <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200 font-medium">
                                <AlertTriangle size={14} className="inline mr-1 text-amber-500 -mt-0.5" />
                                3 Patient summaries pending sign-off before end of shift.
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Service Performance KPIs */}
                    <GlassPanel delay={0.6} title="Service Performance Indicators" className="bg-white flex-1">
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Avg Response Time</div>
                                <div className="text-2xl font-light text-slate-800">4.2 <span className="text-sm font-medium text-slate-500">min</span></div>
                            </div>
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Interventions</div>
                                <div className="text-2xl font-light text-slate-800">12 <span className="text-sm font-medium text-slate-500">today</span></div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
}
