"use client";

import { usePatientCoreStore } from '@/store/patientCoreStore';
import { useHospitalStore } from '@/store/hospitalStore';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import { CheckCircle2, Search, Activity, ExternalLink, Building2, Database, FileSignature, UploadCloud, Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';

export interface PatientClinicalReviewProps {
    role: string;
}

export function PatientClinicalReview({ }: PatientClinicalReviewProps) {
    const { participantCondition } = usePatientCoreStore();
    const { hospitals } = useHospitalStore();

    const [actionState, setActionState] = useState<'idle' | 'loading' | 'success'>('idle');
    const [referralState, setReferralState] = useState<'idle' | 'loading' | 'success'>('idle');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHospitalId, setSelectedHospitalId] = useState<string>("stv-syd");

    const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

    const handleShare = () => {
        setActionState('loading');
        setTimeout(() => setActionState('success'), 800);
    };

    const handleReferral = () => {
        setReferralState('loading');
        setTimeout(() => setReferralState('success'), 800);
    };

    return (
        <div className="flex flex-col gap-6 h-full pb-24 animate-in fade-in duration-500 max-w-5xl mx-auto w-full">
            <div className="mb-2">
                <h2 className="text-3xl font-light text-slate-800 tracking-tight">Patient Clinical Review</h2>
                <div className="text-sm text-slate-500 tracking-widest uppercase mt-1">Doctor oriented patient transfer preparation view</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassPanel delay={0.1} title="Local Facility Gateway" className="bg-white">
                    <div className="mt-6 flex flex-col gap-5 h-full">
                        <div className="relative z-20">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search national provider directory (e.g. Royal Prince Alfred)..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 shadow-sm transition-all focus:bg-white" />
                            {searchQuery && (
                                <div className="absolute top-full mt-2 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                                    {hospitals.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.location.toLowerCase().includes(searchQuery.toLowerCase())).map(h => (
                                        <div key={h.id} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0" onClick={() => { setSelectedHospitalId(h.id); setSearchQuery(""); }}>
                                            <div className="font-bold text-sm text-slate-800">{h.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{h.location} &bull; {h.type}</div>
                                        </div>
                                    ))}
                                    {hospitals.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.location.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                        <div className="p-4 text-sm text-slate-500 text-center">No matching facilities found.</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between flex-1 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
                                <Building2 size={180} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
                                    <div>
                                        <div className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">{selectedHospital.name}</div>
                                        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" /> {selectedHospital.location} &bull; {selectedHospital.type}</div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold uppercase tracking-widest bg-emerald-100 px-2.5 py-1 rounded shadow-sm border border-emerald-200">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Secure Link
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 pt-4 border-t border-slate-200 mt-auto">
                                {referralState === 'success' ? (
                                    <div className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Referral Transmitted</div>
                                ) : (
                                    <button onClick={handleReferral} disabled={referralState === 'loading'} className="w-full py-3 border rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors bg-white border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-70">
                                        {referralState === 'loading' ? <><Loader2 size={16} className="animate-spin text-slate-400" /> Sending...</> : <><ExternalLink size={16} className="text-slate-400" /> Referral Form</>}
                                    </button>
                                )}
                                {actionState === 'success' ? (
                                    <div className="w-full py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Summary Shared</div>
                                ) : (
                                    <button onClick={handleShare} disabled={actionState === 'loading'} className="w-full py-3 border rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors bg-blue-600 border-blue-500 text-white hover:bg-blue-500 disabled:opacity-70">
                                        {actionState === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><UploadCloud size={16} /> Share Summary</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel delay={0.2} title="Discharge & Preparation Metrics" className="bg-white">
                    <div className="mt-4 flex flex-col gap-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                            <Activity className="text-orange-500 shrink-0" size={24} />
                            <div>
                                <div className="text-sm font-bold text-slate-800">Critical Handover Protocol</div>
                                <div className="text-xs text-slate-600 mt-1">Patient exhibiting {participantCondition} trajectory. Verify receiving facility capability.</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <FileSignature className="text-slate-500 shrink-0" size={24} />
                            <div>
                                <div className="text-sm font-bold text-slate-800">Standardized Records Compiled</div>
                                <div className="text-xs text-slate-600 mt-1">HL7 summary generated and ready for direct secure transmission.</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 mt-auto">
                            <Database className="text-blue-500 shrink-0" size={24} />
                            <div>
                                <div className="text-sm font-bold text-slate-800">Telemetry Disconnect Scheduled</div>
                                <div className="text-xs text-slate-600 mt-1">Sensors calibrated for mobile transport mode.</div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
