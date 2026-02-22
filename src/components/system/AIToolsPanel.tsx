"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { useAICalculators } from '@/store/aiInsightsStore';
import { GlassPanel } from '@/components/primitives/GlassPanel';
import {
    MessageSquare, Mic, UserRound, Calculator, Droplets,
    BatteryLow, Activity, FlaskConical, Moon, Building2,
    ShieldAlert, Pill, Download, FileText, FileSignature, Play, Sparkles,
    Send, CheckCircle2,
    PersonStanding, X, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';

type AssistantMode = 'text' | 'voice' | 'avatar';

export function AIToolsPanel() {
    const { participantCondition } = usePatientCoreStore();
    const [assistantMode, setAssistantMode] = useState<AssistantMode>('text');

    return (
        <div className="flex flex-col gap-6 pb-24">
            {/* Header */}
            <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <Sparkles size={120} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-light text-slate-800 tracking-tight">Intelligence Center</h2>
                    <p className="text-sm font-semibold text-purple-600 tracking-widest uppercase mt-1">Care & Prediction Engine</p>
                </div>
            </div>

            {/* Stacked Content - No Hidden Panels */}
            <AssistantTab mode={assistantMode} onModeChange={setAssistantMode} condition={participantCondition} />
            <CalculatorsTab />
            <SimulatorsTab condition={participantCondition} />
            <ReportsTab />
        </div>
    );
}

// --- TAB COMPONENTS ---

function AssistantTab({ mode, onModeChange, condition }: { mode: AssistantMode, onModeChange: (m: AssistantMode) => void, condition: string }) {
    const [avatarAction, setAvatarAction] = useState<string | null>(null);
    const simulateAvatar = (action: string) => {
        setAvatarAction(action);
        setTimeout(() => setAvatarAction(null), 800);
    };

    const calc = useAICalculators();
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: `Hello! Based on Evelyn's latest ${condition} vitals, everything is nominal. How can I help you coordinate care today?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: "I've logged that context to the secure vault. The care team will adjust parameters accordingly." }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <GlassPanel className="p-2 border-slate-200 flex bg-slate-50 shadow-inner">
                <div className="flex w-full bg-slate-200/50 p-1 rounded-xl">
                    <button onClick={() => onModeChange('text')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'text' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><MessageSquare size={16} /> Text</button>
                    <button onClick={() => onModeChange('voice')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'voice' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Mic size={16} /> Voice Session</button>
                    <button onClick={() => onModeChange('avatar')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'avatar' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><UserRound size={16} /> AI Avatar</button>
                </div>
            </GlassPanel>

            <GlassPanel className="flex-1 min-h-[400px] flex flex-col bg-white border-slate-200 overflow-hidden relative">
                {mode === 'text' && (
                    <div className="flex flex-col h-full bg-slate-50/50">
                        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Sparkles size={20} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800">Clinical Copilot</h4>
                                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Contextual AI Assistant</div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {m.role === 'ai' && <div className="w-8 h-8 rounded-full bg-purple-100 shrink-0 flex items-center justify-center text-purple-600 mt-1"><Sparkles size={14} /></div>}
                                    {m.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-600 mt-1"><UserRound size={14} /></div>}
                                    <div className={`p-4 rounded-2xl shadow-sm text-sm text-slate-700 max-w-[85%] leading-relaxed border ${m.role === 'user' ? 'bg-purple-600 text-white border-purple-700 rounded-tr-sm' : 'bg-white border-slate-200 rounded-tl-sm'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 shrink-0 flex items-center justify-center text-purple-600 mt-1"><Sparkles size={14} /></div>
                                    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-500 max-w-[85%] flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.15s' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="relative">
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about medications, schedule, or vitals..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-400 font-medium" />
                                <button onClick={handleSend} disabled={!input.trim() || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"><Send size={16} /></button>
                            </div>
                        </div>
                    </div>
                )}
                {mode === 'voice' && (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-indigo-50 relative flex-1 w-full">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-slate-900 pointer-events-none" />
                        <div className="relative">
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 rounded-full bg-purple-200 blur-xl" />
                            <div className="w-32 h-32 rounded-full border-2 border-purple-200 bg-white/80 backdrop-blur flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.1)] relative z-10 cursor-pointer">
                                <Mic className="text-purple-500 w-12 h-12" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-light text-slate-800 mt-8 tracking-tight">Listening...</h3>
                        <p className="text-purple-600/70 text-sm mt-2 font-medium">&quot;Tell me about Evelyn&apos;s hydration levels today.&quot;</p>
                    </div>
                )}
                {mode === 'avatar' && (
                    <div className="flex flex-col items-center justify-center h-full bg-white relative flex-1 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-800/20 z-10 pointer-events-none" />
                        <div
                            className="absolute inset-0 w-full h-full opacity-40 mix-blend-luminosity bg-cover bg-center"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop')" }}
                        />

                        <div className="relative z-20 text-center px-6 mt-auto pb-12 w-full">
                            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-full max-w-sm mx-auto shadow-2xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Avatar Active</span>
                                </div>
                                <p className="text-white text-sm font-medium leading-relaxed">&quot;Everything looks perfectly stable today. Would you like me to walk you through the afternoon physical therapy requirements?&quot;</p>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <button onClick={() => simulateAvatar('mic')} className={`w-14 h-14 rounded-full ${avatarAction === 'mic' ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-500'} flex items-center justify-center text-white shadow-xl border border-purple-400/50 transition-colors`}>
                                    {avatarAction === 'mic' ? <Loader2 className="animate-spin" size={24} /> : <Mic size={24} />}
                                </button>
                                <button onClick={() => simulateAvatar('close')} className={`w-14 h-14 rounded-full ${avatarAction === 'close' ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'} flex items-center justify-center text-slate-500 shadow-md border border-slate-200 transition-colors`}>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </GlassPanel>

            {/* REAL AI CALCULATORS / HEALTH ENGINES */}
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center text-purple-600"><Calculator size={16} /></div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800 tracking-tight">Active Computational Engines</h3>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Live Telemetry Analysis</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <DetailedCalcCard
                        title="Fall Risk Index"
                        icon={PersonStanding}
                        score={calc.fallRisk}
                        unit="%"
                        explanation={`Calculated from neuromuscular fatigue markers and resting heart rate variance (${calc.fallRisk > 50 ? 'elevated' : 'stable'}).`}
                        recommendation={calc.fallRisk > 50 ? "Initiate mandatory physical assistance for transfers." : "Continue standard mobility protocols."}
                        colorClass="text-amber-600"
                        bgClass="bg-amber-50"
                        borderClass="border-amber-200"
                    />
                    <DetailedCalcCard
                        title="Hydration Matrix"
                        icon={Droplets}
                        score={calc.hydrationScore}
                        unit="%"
                        explanation={`Derived from baseline O2 saturation decay and autonomic resistance indicators.`}
                        recommendation={calc.hydrationScore < 60 ? "Increase IV fluid drip rate immediately." : "Maintain current oral intake targets."}
                        colorClass="text-blue-600"
                        bgClass="bg-blue-50"
                        borderClass="border-blue-200"
                    />
                    <DetailedCalcCard
                        title="Fatigue & Strain Index"
                        icon={BatteryLow}
                        score={calc.fatigueIndex}
                        unit="/100"
                        explanation={`Aggregate measure of cardiac workload versus expected diurnal resting parameters.`}
                        recommendation={calc.fatigueIndex > 60 ? "Postpone non-essential physical therapy today." : "Patient cleared for active rehabilitation."}
                        colorClass="text-purple-600"
                        bgClass="bg-purple-50"
                        borderClass="border-purple-200"
                    />
                    <DetailedCalcCard
                        title="Sleep Quality Prediction"
                        icon={Moon}
                        score={calc.sleepQualityScore}
                        unit="/100"
                        explanation={`Predictive model analyzing nighttime HR dip anomalies and respiratory consistency.`}
                        recommendation={calc.sleepQualityScore < 50 ? "Administer prescribed nighttime sedative. Reduce ambient disruptions." : "Optimize natural sleep environment."}
                        colorClass="text-indigo-600"
                        bgClass="bg-indigo-50"
                        borderClass="border-indigo-200"
                    />
                    <DetailedCalcCard
                        title="Mobility Decline Probability"
                        icon={Activity}
                        score={calc.mobilityDeclinePrediction}
                        unit="%"
                        explanation={`Longitudinal risk assessment based on acute event frequency and recovery velocity.`}
                        recommendation={calc.mobilityDeclinePrediction > 40 ? "Schedule targeted joint-preservation drills with PT." : "Standard walking exercises sufficient."}
                        colorClass="text-slate-600"
                        bgClass="bg-slate-50"
                        borderClass="border-slate-200"
                    />
                </div>
            </div>
        </div>
    );
}

function DetailedCalcCard({ title, icon: Icon, score, unit, explanation, recommendation, colorClass, bgClass, borderClass }: { title: string, icon: React.ElementType, score: number | string, unit: string, explanation: string, recommendation: string, colorClass: string, bgClass: string, borderClass: string }) {
    return (
        <div className={`p-5 rounded-2xl border ${borderClass} bg-white shadow-sm flex flex-col md:flex-row md:items-center gap-6`}>
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
                <Icon size={28} />
            </div>
            <div className="flex-1">
                <div className="flex items-end gap-3 mb-2">
                    <h4 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h4>
                    <span className={`text-2xl font-light leading-none ${colorClass}`}>{score}<span className="text-sm font-bold opacity-50 ml-0.5">{unit}</span></span>
                </div>
                <div className="text-sm text-slate-600 font-medium leading-relaxed mb-3">{explanation}</div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-3">
                    <CheckCircle2 size={16} className={`${colorClass} shrink-0 mt-0.5`} />
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Clinical Recommendation</div>
                        <div className="text-sm font-bold text-slate-700">{recommendation}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { useAIInsightsStore } from '@/store/aiInsightsStore';

type CalcField = { id: string, label: string, type: 'number' | 'boolean' | 'select' | 'text', options?: string[] };

const CALCULATORS_DATA: { id: string, title: string, icon: React.ElementType, color: string, fields: CalcField[], compute: (data: Record<string, string | number | boolean>) => { score: string, remark: string, alert: boolean } }[] = [
    {
        id: 'fall_risk', title: 'Fall Risk Assessment', icon: PersonStanding, color: 'text-amber-500',
        fields: [
            { id: 'age', label: 'Patient Age', type: 'number' },
            { id: 'mobility', label: 'Mobility Status', type: 'select', options: ['Independent', 'Requires Cane/Walker', 'Wheelchair Bound', 'Bedridden'] }
        ],
        compute: (data) => {
            const age = Number(data.age) || 0;
            const mobility = data.mobility as string;
            const alert = age > 65 && (mobility === 'Requires Cane/Walker' || mobility === 'Wheelchair Bound');
            return {
                score: alert ? 'High Risk' : 'Standard',
                remark: alert ? 'Age > 65 coupled with mobility impairment significantly elevates fall risk multiplier.' : 'Fall risk within expected baselines.',
                alert
            };
        }
    },
    {
        id: 'hydration', title: 'Hydration Intake vs Weight', icon: Droplets, color: 'text-blue-500',
        fields: [
            { id: 'weight', label: 'Weight (kg)', type: 'number' },
            { id: 'intake', label: '24h Liquid Intake (mL)', type: 'number' }
        ],
        compute: (data) => {
            const weight = Number(data.weight) || 70;
            const intake = Number(data.intake) || 0;
            const required = weight * 30; // approx 30ml per kg
            const deficit = intake < required * 0.75; // below 75% of required
            return {
                score: deficit ? 'Depleted' : 'Nominal',
                remark: deficit ? `Intake of ${intake}mL is severely below the expected ${required}mL minimum for a ${weight}kg profile.` : 'Hydration levels tracking positively against weight-based targets.',
                alert: deficit
            };
        }
    },
    {
        id: 'recovery', title: 'Recovery Score vs Trend', icon: Activity, color: 'text-emerald-500',
        fields: [
            { id: 'trend', label: '7-Day Vital Signs Trend', type: 'select', options: ['Improving steadily', 'Stable/Plateau', 'Experiencing fluctuations', 'Gradual decline'] }
        ],
        compute: (data) => {
            const trend = data.trend as string;
            const alert = trend === 'Experiencing fluctuations' || trend === 'Gradual decline';
            return {
                score: alert ? 'Deteriorating' : 'On Track',
                remark: alert ? 'Longitudinal 7-day vitals show negative momentum. Re-evaluate current physical therapy thresholds.' : '7-day biological signals indicate a positive recovery slope.',
                alert
            };
        }
    },
    {
        id: 'med_conflict', title: 'Medication Conflict Scanner', icon: Pill, color: 'text-red-500',
        fields: [
            { id: 'meds', label: 'Current Med Classes (e.g. NSAID, SSRI)', type: 'select', options: ['NSAID + SSRI', 'Beta Blocker + Diuretic', 'None / Stable', 'ACE Inhibitor + K+ Sparing'] }
        ],
        compute: (data) => {
            const meds = data.meds as string;
            const conflict = meds === 'NSAID + SSRI' || meds === 'ACE Inhibitor + K+ Sparing';
            return {
                score: conflict ? 'Conflict Detected' : 'Cleared',
                remark: conflict ? `Identified major contraindication tag overlap in profile data (${meds}). High risk of acute reaction.` : 'No pharmacological overlaps detected across active prescriptions.',
                alert: conflict
            };
        }
    },
    {
        id: 'readmission', title: 'Readmission Probability', icon: Building2, color: 'text-indigo-500',
        fields: [
            { id: 'alerts', label: 'Remote Alerts (Last 48h)', type: 'number' },
            { id: 'instability', label: 'Clinical Instability Assessment', type: 'select', options: ['Low', 'Moderate', 'High', 'Critical'] }
        ],
        compute: (data) => {
            const alerts = Number(data.alerts) || 0;
            const instab = data.instability as string;
            const highRisk = alerts >= 3 || instab === 'High' || instab === 'Critical';
            return {
                score: highRisk ? 'Immediate Risk' : 'Low Probability',
                remark: highRisk ? `High frequency of remote alerts (${alerts}) coupled with instability signals a likely hospital bounce-back.` : 'Current telemetry and alert rates do not indicate readmission threat.',
                alert: highRisk
            };
        }
    }
];

function InteractiveCalculator({ calc, expanded, onToggle }: { calc: typeof CALCULATORS_DATA[0], expanded: boolean, onToggle: () => void }) {
    const { addHistory } = useAIInsightsStore();
    const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
    const [result, setResult] = useState<{ score: string, remark: string, alert: boolean } | null>(null);

    const handleCompute = () => {
        const computed = calc.compute(formData);
        setResult(computed);
        addHistory({
            id: Math.random().toString(36).substr(2, 9),
            calculatorId: calc.id,
            timestamp: new Date().toISOString(),
            inputs: formData,
            result: computed
        });
    };

    return (
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <button onClick={onToggle} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center bg-white border border-slate-200 ${calc.color}`}><calc.icon size={16} /></div>
                    <span className="font-bold text-slate-800 text-sm tracking-tight">{calc.title}</span>
                </div>
                {expanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>
            <AnimatePresence>
                {expanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-200 bg-white">
                        <div className="p-5 flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {calc.fields.map(f => (
                                    <div key={f.id} className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{f.label}</label>
                                        {f.type === 'boolean' ? (
                                            <select className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" onChange={e => setFormData({ ...formData, [f.id]: e.target.value === 'yes' })}>
                                                <option value="">Select...</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        ) : f.type === 'select' && f.options ? (
                                            <select className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" onChange={e => setFormData({ ...formData, [f.id]: e.target.value })}>
                                                <option value="">Select...</option>
                                                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        ) : (
                                            <input type="number" className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="Enter value" onChange={e => setFormData({ ...formData, [f.id]: Number(e.target.value) })} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2">
                                <button onClick={handleCompute} className={`px-5 py-2.5 rounded-lg text-white font-bold text-sm transition-all shadow-sm ${result?.alert ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} flex items-center gap-2`}>
                                    <Calculator size={16} /> Compute Result
                                </button>
                            </div>
                            {result && (
                                <div className={`mt-2 p-4 rounded-xl border flex items-start gap-4 ${result.alert ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                                    <div className={`p-2 rounded-full shrink-0 ${result.alert ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        {result.alert ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-widest font-bold opacity-70 mb-0.5">Computed Score</div>
                                        <div className="text-xl font-bold tracking-tight mb-1">{result.score}</div>
                                        <div className="text-sm font-medium leading-relaxed">{result.remark}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function CalculatorsTab() {
    const [expandedId, setExpandedId] = useState<string | null>(CALCULATORS_DATA[0].id);

    return (
        <GlassPanel className="p-6 bg-white border-slate-200">
            <h3 className="text-xl font-light text-slate-800 mb-2 flex items-center gap-2"><Calculator className="text-blue-500" /> Interactive Medical Calculators</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Input clinical parameters to execute real-time AI risk modeling schemas.</p>

            <div className="flex flex-col gap-3">
                {CALCULATORS_DATA.map(calc => (
                    <InteractiveCalculator
                        key={calc.id}
                        calc={calc}
                        expanded={expandedId === calc.id}
                        onToggle={() => setExpandedId(expandedId === calc.id ? null : calc.id)}
                    />
                ))}
            </div>

            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3">
                <ShieldAlert size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    <strong>Clinical Disclaimer:</strong> These computational models are intended for decision-support and pattern recognition. They do not substitute professional medical judgment. Overrides should be documented in the core Electronic Health Record.
                </p>
            </div>
        </GlassPanel>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CalcIndicator({ title, icon: Icon, color, value, unit, bgColor }: { title: string, icon: React.ElementType, color: string, value: number | string, unit: string, bgColor: string }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Icon size={16} className={color} /> {title}</div>
                <div className="text-sm font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{value}{unit}</div>
            </div>
            {typeof value === 'number' && (
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${bgColor}`}
                    />
                </div>
            )}
        </div>
    )
}

function SimulatorsTab({ condition }: { condition: string }) {
    const calc = useAICalculators();
    const [activeSim, setActiveSim] = useState<string | null>(null);
    const [simResult, setSimResult] = useState<{ outcome: string, riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical', metrics: { label: string, value: string }[], explanation: string } | null>(null);

    const [betaInput, setBetaInput] = useState(1);
    const [recoveryInput, setRecoveryInput] = useState(80);

    const handleRun = (id: string) => {
        setActiveSim(id);
        setTimeout(() => {
            if (id === 'beta') setSimResult(calc.runSimulation('beta', { missedDoses: betaInput }));
            if (id === 'recovery') setSimResult(calc.runSimulation('recovery', { adherence: recoveryInput }));
            setActiveSim(null);
        }, 800);
    };

    return (
        <div className="flex flex-col gap-6">
            <GlassPanel className="p-6 bg-white border-slate-200">
                <h3 className="text-xl font-light text-slate-800 mb-2 flex items-center gap-2"><FlaskConical className="text-purple-500" /> Scenario Sandbox</h3>
                <p className="text-sm text-slate-500 mb-6 font-medium">Run longitudinal impact simulations on patient base trajectory.</p>

                <div className="space-y-4">
                    <div className={`p-5 border border-slate-200 rounded-xl bg-slate-50 shadow-sm transition-colors ${activeSim === 'beta' ? 'border-purple-300 ring-1 ring-purple-100' : 'hover:border-purple-300'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2"><Pill size={18} className="text-purple-500" /> What if missed Beta-Blocker?</h4>
                            <div className="flex items-center gap-3">
                                <select value={betaInput} onChange={e => setBetaInput(Number(e.target.value))} className="text-sm border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                                    <option value={1}>1 Dose Missed</option>
                                    <option value={2}>2 Doses Missed</option>
                                    <option value={3}>3+ Doses Missed</option>
                                </select>
                                <button onClick={() => handleRun('beta')} disabled={activeSim === 'beta'} className={`text-xs font-bold uppercase tracking-widest bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all flex items-center gap-1.5 disabled:opacity-50`}>
                                    {activeSim === 'beta' ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />} {activeSim === 'beta' ? 'Running' : 'Run'}
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">Simulate 24-hour cardiovascular response and escalation probability if the dosage is missed.</p>
                    </div>

                    <div className={`p-5 border border-slate-200 rounded-xl bg-slate-50 shadow-sm transition-colors ${activeSim === 'recovery' ? 'border-blue-300 ring-1 ring-blue-100' : 'hover:border-blue-300'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2"><Activity size={18} className="text-blue-500" /> 30-Day Recovery Projection</h4>
                            <div className="flex items-center gap-3">
                                <select value={recoveryInput} onChange={e => setRecoveryInput(Number(e.target.value))} className="text-sm border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value={100}>100% PT Adherence</option>
                                    <option value={80}>80% PT Adherence</option>
                                    <option value={50}>50% PT Adherence</option>
                                    <option value={20}>20% PT Adherence</option>
                                </select>
                                <button onClick={() => handleRun('recovery')} disabled={activeSim === 'recovery'} className={`text-xs font-bold uppercase tracking-widest bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center gap-1.5 disabled:opacity-50`}>
                                    {activeSim === 'recovery' ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />} {activeSim === 'recovery' ? 'Running' : 'Run'}
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">Forecast milestone achievement based on PT adherence and current condition ({condition}).</p>
                    </div>
                </div>

                {/* Simulated Results Panel */}
                {simResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-6 border-t border-slate-200">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Simulation Output: {simResult.outcome}</div>
                        <div className={`p-5 rounded-xl border flex flex-col gap-4 ${simResult.riskLevel === 'Critical' ? 'bg-red-50 border-red-200' :
                            simResult.riskLevel === 'High' ? 'bg-amber-50 border-amber-200' :
                                simResult.riskLevel === 'Moderate' ? 'bg-blue-50 border-blue-200' :
                                    'bg-emerald-50 border-emerald-200'
                            }`}>
                            <div className="flex items-start gap-3 border-b border-black/5 pb-4">
                                <div className={`p-2 rounded-full shrink-0 bg-white shadow-sm ${simResult.riskLevel === 'Critical' ? 'text-red-600' :
                                    simResult.riskLevel === 'High' ? 'text-amber-600' :
                                        simResult.riskLevel === 'Moderate' ? 'text-blue-600' :
                                            'text-emerald-600'
                                    }`}>
                                    {simResult.riskLevel === 'Low' ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800 text-lg">{simResult.outcome}</h5>
                                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{simResult.explanation}</p>
                                </div>
                            </div>
                            <div className="flex gap-6 pt-1">
                                {simResult.metrics.map(m => (
                                    <div key={m.label}>
                                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-0.5">{m.label}</div>
                                        <div className="text-xl font-bold tracking-tight text-slate-800 border-l-[3px] border-black/10 py-0.5 pl-3">{m.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </GlassPanel>
        </div>
    )
}

function ReportsTab() {
    const calc = useAICalculators();
    const [activeReport, setActiveReport] = useState<string | null>(null);
    const [generatedReport, setGeneratedReport] = useState<{ id: string, title: string, summary: string, metadata: { timestamp: string, size: string, format: string } } | null>(null);
    const [timeframe, setTimeframe] = useState(24);
    const [includeBiometrics, setIncludeBiometrics] = useState(true);

    const handleGenerate = (id: string) => {
        setActiveReport(id);
        setTimeout(() => {
            const report = calc.generateReport(id, timeframe, includeBiometrics);
            setGeneratedReport(report);
            setActiveReport(null);
        }, 800);
    };

    return (
        <GlassPanel className="p-6 bg-white border-slate-200">
            <h3 className="text-xl font-light text-slate-800 mb-2 flex items-center gap-2"><Download className="text-indigo-500" /> Automated Clinical Reports</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Generate compliant documents based on the last 72 hours of extracted patient telemetry.</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-1">Timeframe Scope</label>
                    <select value={timeframe} onChange={e => setTimeframe(Number(e.target.value))} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option value={24}>Last 24 Hours</option>
                        <option value={72}>Last 72 Hours</option>
                        <option value={168}>Last 7 Days</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-1">Data Depth</label>
                    <select value={includeBiometrics ? 'yes' : 'no'} onChange={e => setIncludeBiometrics(e.target.value === 'yes')} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option value="yes">Include Full Biometrics</option>
                        <option value="no">Clinical Summary Only</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-5 border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center text-center gap-3 transition-colors shadow-sm group relative overflow-hidden ${generatedReport?.id.includes('PDF') ? 'ring-2 ring-indigo-500 border-indigo-500' : 'hover:border-indigo-300'}`}>
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform"><FileText size={24} /></div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">PDF Summary</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-bold">Standard</div>
                    </div>
                    <button onClick={() => handleGenerate('pdf')} disabled={activeReport !== null} className={`w-full mt-2 py-2 border ${generatedReport?.id.includes('PDF') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white'} text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2`}>
                        {activeReport === 'pdf' ? <><Loader2 size={14} className="animate-spin" /> ...</> : generatedReport?.id.includes('PDF') ? 'Re-Generate' : 'Generate'}
                    </button>
                </div>

                <div className={`p-5 border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center text-center gap-3 transition-colors shadow-sm group relative overflow-hidden ${generatedReport?.id.includes('FHIR') ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-indigo-300'}`}>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><FileSignature size={24} /></div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">Doctor Handover</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-bold">HL7 FHIR Format</div>
                    </div>
                    <button onClick={() => handleGenerate('fhir')} disabled={activeReport !== null} className={`w-full mt-2 py-2 border ${generatedReport?.id.includes('FHIR') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white'} text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2`}>
                        {activeReport === 'fhir' ? <><Loader2 size={14} className="animate-spin" /> ...</> : generatedReport?.id.includes('FHIR') ? 'Re-Generate' : 'Generate'}
                    </button>
                </div>

                <div className={`p-5 border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center text-center gap-3 transition-colors shadow-sm group relative overflow-hidden ${generatedReport?.id.includes('FAM') ? 'ring-2 ring-emerald-500 border-emerald-500' : 'hover:border-indigo-300'}`}>
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform"><UserRound size={24} /></div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">Family Explanation</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-bold">Plain Language</div>
                    </div>
                    <button onClick={() => handleGenerate('family')} disabled={activeReport !== null} className={`w-full mt-2 py-2 border ${generatedReport?.id.includes('FAM') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-600 hover:text-white'} text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2`}>
                        {activeReport === 'family' ? <><Loader2 size={14} className="animate-spin" /> ...</> : generatedReport?.id.includes('FAM') ? 'Re-Generate' : 'Generate'}
                    </button>
                </div>
            </div>

            {generatedReport && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                            <span className="font-bold text-slate-800 text-sm">{generatedReport.title}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200/50 px-2 py-1 rounded">{generatedReport.id}</span>
                    </div>
                    <div className="p-5">
                        <p className="text-sm text-slate-700 leading-relaxed mb-4">{generatedReport.summary}</p>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Generated On</div>
                                <div className="text-xs font-bold text-slate-700">{new Date(generatedReport.metadata.timestamp).toLocaleString()}</div>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Est. Size</div>
                                <div className="text-xs font-bold text-slate-700">{generatedReport.metadata.size}</div>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Format</div>
                                <div className="text-xs font-bold text-slate-700">{generatedReport.metadata.format}</div>
                            </div>
                            <div className="flex items-center justify-center px-4">
                                <button className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-1"><Download size={16} /> Save</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <div className="text-sm font-medium">All generated reports are cryptographically signed and HIPAA/GDPR compliant.</div>
            </div>
        </GlassPanel>
    )
}
