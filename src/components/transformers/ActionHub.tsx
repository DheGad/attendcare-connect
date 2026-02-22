"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, ShieldCheck, Building2, FileText, Pill, X, Send, PhoneCall, CalendarPlus, FileCheck } from 'lucide-react';
import { usePatientCoreStore } from '@/store/patientCoreStore';
import { usePathname } from 'next/navigation';

type ModalType = 'assistant' | 'doctor' | 'provider' | 'hospital' | 'plan' | 'medication' | null;

export function ActionHub() {
    const { aiInsights } = usePatientCoreStore();
    const pathname = usePathname();
    const userRole = pathname.split('/')[1] || 'family';
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [messageInput, setMessageInput] = useState('');
    const [actionStates, setActionStates] = useState<Record<string, 'idle' | 'loading' | 'success'>>({});

    const simulateAction = (name: string) => {
        setActionStates(prev => ({ ...prev, [name]: 'loading' }));
        setTimeout(() => {
            setActionStates(prev => ({ ...prev, [name]: 'success' }));
        }, 800);
    };

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        setMessageInput('');
        // In a real app, this would append to a chat history
    };

    const renderModalContent = () => {
        switch (activeModal) {
            case 'assistant':
                return (
                    <div className="flex flex-col h-auto min-h-[300px]">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Care Coordinator AI</h3>
                                <p className="text-xs font-medium text-slate-500">Ask any questions about the current state</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden relative rounded-xl border border-slate-200 bg-slate-50 flex flex-col min-h-[250px]">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                                <span className="text-slate-400 font-medium">Avatar Interface Embedded</span>
                            </div>
                            {/* Embedded avatar UI */}
                            <div className="relative z-10 flex-1 p-4 overflow-y-auto w-full">
                                <div className="max-w-[80%] float-left clear-both mb-4">
                                    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                        <p className="text-sm font-medium text-slate-700">Hello. I am reviewing the current metrics for this patient based on your role as {userRole}. How can I assist with your coordination tasks right now?</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your care question..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-shadow"
                            />
                            <button onClick={handleSendMessage} className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl transition-colors shadow-sm">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                );
            case 'doctor':
                return (
                    <div className="flex flex-col h-auto">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Primary Care Physician</h3>
                                <p className="text-xs font-medium text-slate-500">Dr. Sarah Jenkins (Cardiology)</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <button onClick={() => simulateAction('telehealth')} disabled={actionStates['telehealth'] !== undefined} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group disabled:opacity-80">
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-full group-hover:scale-110 transition-transform"><PhoneCall size={20} /></div>
                                <div className="text-left flex-1">
                                    <h4 className="font-semibold text-slate-800 text-sm">Request Telehealth Visit</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">Average wait time: 14 mins</p>
                                </div>
                                {actionStates['telehealth'] === 'loading' && <span className="text-blue-600 animate-pulse text-xs font-bold">Requesting...</span>}
                                {actionStates['telehealth'] === 'success' && <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><FileCheck size={14} /> Sent</span>}
                            </button>
                            <button onClick={() => simulateAction('secure_msg')} disabled={actionStates['secure_msg'] !== undefined} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group disabled:opacity-80">
                                <div className="p-2 bg-slate-100 text-slate-700 rounded-full group-hover:scale-110 transition-transform"><FileText size={20} /></div>
                                <div className="text-left flex-1">
                                    <h4 className="font-semibold text-slate-800 text-sm">Send Secure Message</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">Attach recent telemetry automatically</p>
                                </div>
                                {actionStates['secure_msg'] === 'loading' && <span className="text-blue-600 animate-pulse text-xs font-bold">Sending...</span>}
                                {actionStates['secure_msg'] === 'success' && <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><FileCheck size={14} /> Delivered</span>}
                            </button>
                            <button onClick={() => simulateAction('schedule_inperson')} disabled={actionStates['schedule_inperson'] !== undefined} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group disabled:opacity-80">
                                <div className="p-2 bg-slate-100 text-slate-700 rounded-full group-hover:scale-110 transition-transform"><CalendarPlus size={20} /></div>
                                <div className="text-left flex-1">
                                    <h4 className="font-semibold text-slate-800 text-sm">Schedule In-Person APPT</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">Next available: Thursday 9:00 AM</p>
                                </div>
                                {actionStates['schedule_inperson'] === 'loading' && <span className="text-blue-600 animate-pulse text-xs font-bold">Booking...</span>}
                                {actionStates['schedule_inperson'] === 'success' && <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><FileCheck size={14} /> Confirmed</span>}
                            </button>
                        </div>
                    </div>
                );
            case 'provider':
                return (
                    <div className="flex flex-col h-auto">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Care Provider Agency</h3>
                                <p className="text-xs font-medium text-slate-500">Apex Healthcare Services</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <h4 className="text-sm font-semibold text-slate-800 mb-2">Current Shift</h4>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-medium text-slate-500">Worker:</span>
                                    <span className="font-semibold text-slate-700">Michael Chen</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-500">Time remaining:</span>
                                    <span className="font-semibold text-emerald-600">3h 45m</span>
                                </div>
                            </div>
                            <button onClick={() => simulateAction('contact_manager')} disabled={actionStates['contact_manager'] !== undefined} className="w-full flex justify-center py-3 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 font-semibold text-sm transition-colors shadow-sm disabled:opacity-80">
                                {actionStates['contact_manager'] === 'loading' ? 'Pinging Manager...' : actionStates['contact_manager'] === 'success' ? 'Message Sent to Manager' : 'Contact Duty Manager'}
                            </button>
                            <button onClick={() => simulateAction('schedule_change')} disabled={actionStates['schedule_change'] !== undefined} className="w-full flex justify-center py-3 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 font-semibold text-sm transition-colors shadow-sm disabled:opacity-80">
                                {actionStates['schedule_change'] === 'loading' ? 'Submitting Request...' : actionStates['schedule_change'] === 'success' ? 'Request Logged with HR' : 'Request Schedule Change'}
                            </button>
                        </div>
                    </div>
                );
            case 'hospital':
                return (
                    <div className="flex flex-col h-auto">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Metro General Hospital</h3>
                                <p className="text-xs font-medium text-slate-500">Discharge Hub Integration</p>
                            </div>
                        </div>
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl mb-4 text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-indigo-500">
                                <FileCheck size={24} />
                            </div>
                            <h4 className="text-sm font-semibold text-indigo-900 mb-1">Compliance Sync Active</h4>
                            <p className="text-xs font-medium text-indigo-700/70">All remote vitals are currently streaming to the central hospital EMR system without error.</p>
                        </div>
                        {actionStates['progress_report'] === 'success' ? (
                            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-sm font-semibold flex items-center justify-center gap-2">
                                <FileCheck size={18} /> Manual Report Successfully Transmitted
                            </div>
                        ) : (
                            <button onClick={() => simulateAction('progress_report')} disabled={actionStates['progress_report'] === 'loading'} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-80">
                                {actionStates['progress_report'] === 'loading' ? 'Encrypting & Transmitting...' : 'Transmit Manual Progress Report'}
                            </button>
                        )}
                    </div>
                );
            case 'plan':
                return (
                    <div className="flex flex-col h-auto max-h-[60vh]">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Generated Care Plan</h3>
                                <p className="text-xs font-medium text-slate-500">Based on recent telemetry & AI insights</p>
                            </div>
                        </div>
                        <div className="overflow-y-auto pr-2 space-y-3 flex-1 no-scrollbar">
                            {aiInsights.length > 0 ? (
                                aiInsights.map((insight) => (
                                    <div key={insight.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex gap-3">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{insight.message}</p>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-2 block">Extracted from System Logs</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 font-medium text-center py-8">Standard baseline care plan in effect. No dynamic anomalies require custom generation.</p>
                            )}
                        </div>
                        {actionStates['regenerate_plan'] === 'success' ? (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-semibold flex items-center justify-center gap-2 mt-4">
                                <FileCheck size={18} /> New AI Care Plan Generated and Saved
                            </div>
                        ) : (
                            <button onClick={() => simulateAction('regenerate_plan')} disabled={actionStates['regenerate_plan'] === 'loading'} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm mt-4 disabled:opacity-80 flex justify-center items-center gap-2">
                                {actionStates['regenerate_plan'] === 'loading' ? <span className="animate-pulse">Generating Novel Insights...</span> : 'Regenerate from Latest Data'}
                            </button>
                        )}
                    </div>
                );
            case 'medication':
                return (
                    <div className="flex flex-col h-auto">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <Pill size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Medication Record</h3>
                                <p className="text-xs font-medium text-slate-500">Current pharmacological plan</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 border border-slate-200 rounded-xl bg-white flex justify-between items-center shadow-sm">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Lisinopril 10mg</h4>
                                    <p className="text-xs font-medium text-slate-500">1x Daily (Morning)</p>
                                </div>
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-bold rounded">Taken Today</span>
                            </div>
                            <div className="p-3 border border-slate-200 rounded-xl bg-white flex justify-between items-center shadow-sm">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Metoprolol 25mg</h4>
                                    <p className="text-xs font-medium text-slate-500">2x Daily (Morn/Eve)</p>
                                </div>
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-bold rounded">1/2 Taken</span>
                            </div>
                            <div className="p-3 border border-slate-200 rounded-xl bg-white flex justify-between items-center shadow-sm">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Atorvastatin 20mg</h4>
                                    <p className="text-xs font-medium text-slate-500">1x Daily (Night)</p>
                                </div>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase tracking-widest font-bold rounded">Pending</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="px-1 mt-6 mb-2">
            <h3 className="text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Patient Action Hub</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <button onClick={() => setActiveModal('assistant')} className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-teal-300 hover:shadow-md transition-all shadow-sm text-slate-700 group">
                    <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Brain size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold text-center mt-1">Talk to Care<br />Assistant</span>
                </button>

                <button onClick={() => setActiveModal('doctor')} className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all shadow-sm text-slate-700 group">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Activity size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold text-center mt-1">Contact<br />Doctor</span>
                </button>

                <button onClick={() => setActiveModal('provider')} className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all shadow-sm text-slate-700 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <ShieldCheck size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold text-center mt-1">Contact Care<br />Provider</span>
                </button>

                <button onClick={() => setActiveModal('hospital')} className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all shadow-sm text-slate-700 group">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Building2 size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold text-center mt-1">Connect<br />Hospital</span>
                </button>

                <button onClick={() => setActiveModal('plan')} className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-amber-300 hover:shadow-md transition-all shadow-sm text-slate-700 group">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <FileText size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold text-center mt-1">View Care<br />Plan</span>
                </button>

                <button onClick={() => setActiveModal('medication')} className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-red-300 hover:shadow-md transition-all shadow-sm text-slate-700 group">
                    <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Pill size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold text-center mt-1">View<br />Medications</span>
                </button>
            </div>

            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-2"
                            >
                                <X size={20} />
                            </button>
                            {renderModalContent()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
