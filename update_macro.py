import re

with open('src/components/transformers/MacroEcosystem.tsx', 'r') as f:
    content = f.read()

# I will recreate MacroEcosystem.tsx to adhere to:
new_content = """\"use client\";

import { motion } from 'framer-motion';
import { useContextEngine, UserRole } from '@/store/contextEngine';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import { Calendar, CheckCircle2, FileText, Info, Search, Users, Activity, ExternalLink, ShieldAlert, ArrowRight, Network, RefreshCw, Layers, ZoomIn, Clock, ListFilter, SlidersHorizontal, MapPin, Building2, Globe, ShieldCheck, Database, FileSignature, UploadCloud, Send, Compass, Stethoscope, FastForward } from 'lucide-react';
import { useMemo, useState } from 'react';

const GLOBAL_HOSPITALS = [
    { id: 'stv-syd', name: "St. Vincent's Public Hosp.", location: "Sydney, NSW", country: "Australia", type: "Level 1 Trauma Center", specialties: ["Cardiology", "Orthopedics", "Neurology"], load: "Available", capability: "Direct API" },
    { id: 'rpa-nsw', name: "Royal Prince Alfred", location: "Camperdown, NSW", country: "Australia", type: "Major Referral", specialties: ["Oncology", "General Surgery"], load: "High Load", capability: "HL7 Only" },
    { id: 'aiims-del', name: "AIIMS New Delhi", location: "New Delhi", country: "India", type: "Apex Research", specialties: ["Cardiology", "Transplant"], load: "Critical", capability: "Manual Review" },
    { id: 'sgh-sg', name: "Singapore General", location: "Bukit Merah", country: "Singapore", type: "Tertiary Referral", specialties: ["Oncology", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'mayo-us', name: "Mayo Clinic", location: "Rochester, MN", country: "United States", type: "Research Center", specialties: ["Neurology", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'gstt-uk', name: "Guy's and St Thomas'", location: "London", country: "United Kingdom", type: "NHS Trust", specialties: ["Orthopedics", "Oncology"], load: "High Load", capability: "HL7 Only" },
    { id: 'mgr-ca', name: "Toronto General", location: "Toronto, ON", country: "Canada", type: "Research Hospital", specialties: ["Transplant", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'char-de', name: "Charité", location: "Berlin", country: "Germany", type: "University Hospital", specialties: ["Neurology", "General Surgery"], load: "High Load", capability: "HL7 Only" },
    { id: 'ap-hp-fr', name: "AP-HP", location: "Paris", country: "France", type: "Public Health System", specialties: ["Oncology", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'fujita-jp', name: "Fujita Health", location: "Aichi", country: "Japan", type: "Academic Medical Center", specialties: ["Robotic Surgery", "Neurology"], load: "Available", capability: "Direct API" },
    { id: 'asan-kr', name: "Asan Medical Center", location: "Seoul", country: "South Korea", type: "Comprehensive Care", specialties: ["Transplant", "Oncology"], load: "High Load", capability: "Direct API" },
    { id: 'cleveland-uae', name: "Cleveland Clinic AD", location: "Abu Dhabi", country: "United Arab Emirates", type: "Multispecialty", specialties: ["Cardiology", "Endocrinology"], load: "Available", capability: "Direct API" },
    { id: 'zurich-ch', name: "Universitätsspital Zürich", location: "Zurich", country: "Switzerland", type: "University Hospital", specialties: ["Neurology", "Cardiology"], load: "Available", capability: "HL7 Only" },
    { id: 'sheba-il', name: "Sheba Medical Center", location: "Tel HaShomer", country: "Israel", type: "Research Institute", specialties: ["Trauma", "Rehabilitation"], load: "Available", capability: "Direct API" },
    { id: 'auckland-nz', name: "Auckland City Hospital", location: "Auckland", country: "New Zealand", type: "Public Hospital", specialties: ["Pediatrics", "Cardiology"], load: "High Load", capability: "HL7 Only" },
    { id: 'netcare-za', name: "Netcare Milpark", location: "Johannesburg", country: "South Africa", type: "Private Hospital", specialties: ["Trauma", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'einstein-br', name: "Albert Einstein Hospital", location: "São Paulo", country: "Brazil", type: "Private Hospital", specialties: ["Oncology", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'medica-mx', name: "Médica Sur", location: "Mexico City", country: "Mexico", type: "Tertiary Care", specialties: ["Gastroenterology", "Cardiology"], load: "Available", capability: "HL7 Only" },
    { id: 'kingfaisal-sa', name: "King Faisal Specialist", location: "Riyadh", country: "Saudi Arabia", type: "Specialist Hospital", specialties: ["Oncology", "Transplant"], load: "Available", capability: "Direct API" }
];

export interface MacroEcosystemProps {
    role: UserRole;
    view?: 'clinical' | 'network';
}

export function MacroEcosystem({ role, view = 'clinical' }: MacroEcosystemProps) {
    const { systemLoad, participantCondition } = useContextEngine();
    const isRegulator = role === 'regulator';

    const [countryFilter, setCountryFilter] = useState('All');
    const [specialtyFilter, setSpecialtyFilter] = useState('All');

    const filteredHospitals = useMemo(() => {
        return GLOBAL_HOSPITALS.filter(h =>
            (countryFilter === 'All' || h.country === countryFilter) &&
            (specialtyFilter === 'All' || h.specialties.includes(specialtyFilter))
        );
    }, [countryFilter, specialtyFilter]);

    if (view === 'clinical') {
        return (
            <div className="flex flex-col gap-6 h-full pb-24 animate-in fade-in duration-500 max-w-5xl mx-auto w-full">
                <div className="mb-2">
                    <h2 className="text-3xl font-light text-slate-800 tracking-tight">Patient Clinical Review</h2>
                    <div className="text-sm text-slate-500 tracking-widest uppercase mt-1">Doctor oriented patient transfer preparation view</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassPanel delay={0.1} title="Local Facility Gateway" className="bg-white">
                        <div className="mt-6 flex flex-col gap-5 h-full">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="Search national provider directory (e.g. Royal Prince Alfred)..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 shadow-sm" />
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between flex-1 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
                                    <Building2 size={180} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
                                        <div>
                                            <div className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">St. Vincent&apos;s Public Hosp.</div>
                                            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" /> Sydney, NSW &bull; Level 1 Trauma Center</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold uppercase tracking-widest bg-emerald-100 px-2.5 py-1 rounded shadow-sm border border-emerald-200">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Secure Link
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 pt-4 border-t border-slate-200 mt-auto">
                                    <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                                        <ExternalLink size={16} className="text-slate-400" /> Referral Form
                                    </button>
                                    <button className="w-full py-3 bg-blue-600 border border-blue-500 text-white rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors">
                                        <UploadCloud size={16} /> Share Summary
                                    </button>
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

    if (view === 'network') {
        const uniqueCountries = ['All', ...Array.from(new Set(GLOBAL_HOSPITALS.map(h => h.country))).sort()];
        const uniqueSpecialties = ['All', ...Array.from(new Set(GLOBAL_HOSPITALS.flatMap(h => h.specialties))).sort()];

        return (
            <div className="flex flex-col gap-6 h-full pb-24 animate-in fade-in duration-500 max-w-5xl mx-auto w-full">
                <div className="mb-2">
                    <h2 className="text-3xl font-light text-slate-800 tracking-tight">Global Hospital Network</h2>
                    <div className="text-sm text-slate-500 tracking-widest uppercase mt-1">Independent International Directory Screen</div>
                </div>

                <GlassPanel delay={0.1} title="Network Filters & Discovery" className="bg-white border-blue-100 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 appearance-none font-medium shadow-sm transition-all focus:bg-white hover:border-slate-300"
                            >
                                {uniqueCountries.map(c => <option key={c} value={c}>{c === 'All' ? 'All Coverage Regions' : c}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                                value={specialtyFilter}
                                onChange={(e) => setSpecialtyFilter(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 appearance-none font-medium shadow-sm transition-all focus:bg-white hover:border-slate-300"
                            >
                                {uniqueSpecialties.map(s => <option key={s} value={s}>{s === 'All' ? 'All Clinical Specialties' : s}</option>)}
                            </select>
                        </div>
                    </div>
                </GlassPanel>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {filteredHospitals.map((hospital, idx) => (
                        <GlassPanel key={hospital.id} delay={0.2 + (idx * 0.05)} className="bg-white hover:shadow-lg transition-shadow border border-slate-200 hover:border-blue-300">
                            <div className="flex flex-col h-full gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                            <Building2 className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-800 tracking-tight leading-tight">{hospital.name}</h3>
                                            <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1 uppercase tracking-widest"><MapPin size={10} /> {hospital.location}, {hospital.country}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                                        {hospital.type}
                                    </span>
                                    {hospital.specialties.map(s => (
                                        <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-widest">
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-slate-100 mt-auto flex justify-between items-center text-xs">
                                    <div className={`font-bold flex items-center gap-1 ${hospital.capability === 'Direct API' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        <Network size={12} /> {hospital.capability}
                                    </div>
                                    <button className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700">
                                        Explore Node <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </GlassPanel>
                    ))}
                    {filteredHospitals.length === 0 && (
                         <div className="col-span-full py-12 text-center text-slate-500">
                             <Globe size={48} className="mx-auto mb-4 opacity-20" />
                             No routing paths match the current multi-dimensional filter criteria.
                         </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
"""

with open('src/components/transformers/MacroEcosystem.tsx', 'w') as f:
    f.write(new_content)
