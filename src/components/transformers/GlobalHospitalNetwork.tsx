"use client";

import { useHospitalStore } from '@/store/hospitalStore';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import { CheckCircle2, ArrowRight, Network, MapPin, Building2, Globe, Stethoscope, Loader2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { useOverviewStore } from '@/store/overviewStore';

export interface GlobalHospitalNetworkProps {
    role: string;
}

const getFlag = (country: string) => {
    const flags: Record<string, string> = {
        'Australia': '🇦🇺', 'India': '🇮🇳', 'Singapore': '🇸🇬', 'United States': '🇺🇸',
        'United Kingdom': '🇬🇧', 'Canada': '🇨🇦', 'Germany': '🇩🇪', 'France': '🇫🇷',
        'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'United Arab Emirates': '🇦🇪', 'Switzerland': '🇨🇭',
        'Israel': '🇮🇱', 'New Zealand': '🇳🇿', 'South Africa': '🇿🇦', 'Brazil': '🇧🇷',
        'Mexico': '🇲🇽', 'Saudi Arabia': '🇸🇦'
    };
    return flags[country] || '🏥';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GlobalHospitalNetwork({ role }: GlobalHospitalNetworkProps) {
    const { hospitals: GLOBAL_HOSPITALS, countryFilter, specialtyFilter, capabilityFilter, setCountryFilter, setSpecialtyFilter, setCapabilityFilter } = useHospitalStore();
    const { heartRateStream } = usePatientCoreStore();
    useOverviewStore(); // Enforce overviewStore read access

    const currentHR = heartRateStream[heartRateStream.length - 1]?.value || '--';
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHospitals = useMemo(() => {
        return GLOBAL_HOSPITALS.filter(h => {
            const matchesCountry = countryFilter === 'All' || h.country === countryFilter;
            const matchesSpecialty = specialtyFilter === 'All' || h.specialties.includes(specialtyFilter);
            const matchesCapability = capabilityFilter === 'All' || h.capability === capabilityFilter;
            const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCountry && matchesSpecialty && matchesCapability && matchesSearch;
        });
    }, [GLOBAL_HOSPITALS, countryFilter, specialtyFilter, capabilityFilter, searchQuery]);

    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [pingedNodes, setPingedNodes] = useState<Record<string, number>>({});

    const handleTransmit = (id: string) => {
        setActiveNode(id);
        setTimeout(() => {
            setActiveNode(null);
            setPingedNodes(prev => ({ ...prev, [id]: Math.floor(Math.random() * 40) + 12 }));
        }, 800);
    };

    const uniqueCountries = ['All', ...Array.from(new Set(GLOBAL_HOSPITALS.map(h => h.country))).sort()];
    const uniqueSpecialties = ['All', ...Array.from(new Set(GLOBAL_HOSPITALS.flatMap(h => h.specialties))).sort()];
    const uniqueCapabilities = ['All', ...Array.from(new Set(GLOBAL_HOSPITALS.map(h => h.capability))).sort()];

    return (
        <div className="flex flex-col gap-6 h-full pb-24 animate-in fade-in duration-500 max-w-5xl mx-auto w-full">
            <div className="mb-2">
                <h2 className="text-3xl font-light text-slate-800 tracking-tight">Global Care Network</h2>
                <ul className="text-sm text-slate-500 mt-3 space-y-1.5 list-disc pl-5 font-medium">
                    <li>Cross-border care coordination</li>
                    <li>Digital referral compatibility</li>
                    <li>Transfer readiness visibility</li>
                    <li>Specialty discovery</li>
                </ul>
            </div>

            <GlassPanel delay={0.1} title="Network Filters & Discovery" className="bg-white border-slate-200 shadow-md">
                <div className="mb-4 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search hospitals or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 shadow-sm"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="relative">
                        <Network className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            value={capabilityFilter}
                            onChange={(e) => setCapabilityFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 appearance-none font-medium shadow-sm transition-all focus:bg-white hover:border-slate-300"
                        >
                            {uniqueCapabilities.map(c => <option key={c} value={c}>{c === 'All' ? 'All Tech Capabilities' : c}</option>)}
                        </select>
                    </div>
                </div>
            </GlassPanel>

            <div className="flex-1 overflow-y-auto pr-2 min-h-[400px] mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pb-12">
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
                                            <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1 uppercase tracking-widest"><MapPin size={10} /> {hospital.location}, {getFlag(hospital.country)} {hospital.country}</div>
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

                                <div className="pt-4 border-t border-slate-100 mt-auto flex flex-col gap-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <div className={`font-bold flex items-center gap-1 ${hospital.capability === 'Direct API' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            <Network size={12} /> {hospital.capability}
                                        </div>
                                        <button onClick={() => handleTransmit(hospital.id)} disabled={activeNode !== null || (pingedNodes[hospital.id] !== undefined)} className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors">
                                            {activeNode === hospital.id ? <><Loader2 size={12} className="animate-spin" /> Transmitting Payload</> : pingedNodes[hospital.id] !== undefined ? <><CheckCircle2 size={12} className="text-emerald-500" /> Transmitted</> : <>Transmit Telemetry <ArrowRight size={12} /></>}
                                        </button>
                                    </div>
                                    {pingedNodes[hospital.id] !== undefined && (
                                        <div className="w-full bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-xs text-emerald-700 flex justify-between items-center animate-in fade-in zoom-in-95 duration-300">
                                            <div className="font-bold flex items-center gap-1 truncate"><CheckCircle2 size={12} /> Secure Handshake (HR: {currentHR}bpm)</div>
                                            <div className="font-mono ml-2">{pingedNodes[hospital.id]}ms</div>
                                        </div>
                                    )}
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
        </div>
    );
}
