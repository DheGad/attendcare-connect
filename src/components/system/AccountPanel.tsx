"use client";

import { useSession, signOut } from "next-auth/react";
import { GlassPanel } from "@/components/primitives/GlassPanel";
import { User, CheckCircle2, ShieldCheck, History, LogOut, UploadCloud, FileType, Activity, ClipboardList, BriefcaseMedical, BellRing, SlidersHorizontal, Lock, TrendingUp, Download, Bot, Users, PhoneCall, X, Edit2 } from "lucide-react";
import { usePatientCoreStore } from "@/store/patientCoreStore";
import { useAccountStore } from "@/store/accountStore";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function AccountPanel() {
    const { heartRateStream } = usePatientCoreStore();
    const pathname = usePathname();
    const userRole = pathname.split('/')[1] || 'family';
    const { data: session } = useSession();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // NEW: Module Activation States
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done'>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeModal, setActiveModal] = useState<'report' | 'trends' | 'pdf' | null>(null);

    // Unified Generation State
    const [genStatus, setGenStatus] = useState<'idle' | 'generating' | 'complete'>('idle');
    const [genProgress, setGenProgress] = useState(0);

    // Mock Files State
    const {
        mockFiles, notifyThreshold, sensorSensitivity, dataSharing,
        addMockFile, deleteMockFile, renameMockFile, setNotifyThreshold, setSensorSensitivity, setDataSharing
    } = useAccountStore();

    const handleUploadClick = () => {
        if (uploadStatus === 'uploading') return;
        setUploadStatus('uploading');
        setUploadProgress(0);

        let p = 0;
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 20) + 15;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setUploadStatus('done');
                addMockFile({
                    id: Date.now(),
                    name: 'New_Lab_Results_Sync.pdf',
                    icon: FileType,
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-100',
                    status: '100% Indexed',
                    statusIcon: CheckCircle2,
                    statusColor: 'text-emerald-500',
                    date: 'Just Now'
                });
                setTimeout(() => {
                    setUploadStatus('idle');
                    setUploadProgress(0);
                }, 3000);
            }
            setUploadProgress(p);
        }, 400);
    };

    const handleDeleteFile = (id: number) => {
        deleteMockFile(id);
    };

    const handleRenameFile = (id: number, currentName: string) => {
        const newName = window.prompt("Rename file", currentName);
        if (newName && newName.trim() !== "" && newName.trim() !== currentName) {
            renameMockFile(id, newName.trim());
        }
    };

    const handleGenerativeAction = (type: 'report' | 'trends' | 'pdf') => {
        setActiveModal(type);
        setGenStatus('generating');
        setGenProgress(0);

        const interval = setInterval(() => {
            setGenProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setGenStatus('complete');
                    return 100;
                }
                return prev + Math.floor(Math.random() * 20) + 10;
            });
        }, 300);
    };

    // Settings State handled by accountStore

    const getPermissions = () => {
        switch (userRole) {
            case 'family': return ['View Live Signals', 'Read AI Insights', 'Download Reports'];
            case 'worker': return ['Acknowledge Tasks', 'Log Incident Reports', 'Update Shifts'];
            case 'provider': return ['Review Telemetry', 'Authorize Interventions', 'Access Deep History'];
            case 'hospital': return ['View Macro Statistics', 'Audit Care Teams', 'Manage Bed Capacity'];
            case 'regulator': return ['Full Audit Replay', 'Compliance Reporting', 'System Override'];
            default: return ['Read Only'];
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-24 h-full">
            {/* NEW: Patient Profile Center */}
            <GlassPanel delay={0.05} title="Patient Profile & Clinical Context" className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                <User className="text-slate-400" size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-slate-800">Evelyn Vance</h3>
                                <p className="text-sm text-slate-500">DOB: 12/04/1948 (78 years) • Primary Care: Dr. S. Aris</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="bg-blue-50 text-blue-700 text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold border border-blue-100">Hypertension</span>
                                    <span className="bg-blue-50 text-blue-700 text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold border border-blue-100">Mild Osteoarthritis</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="text-emerald-600" size={16} />
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Active Medications</h4>
                                </div>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• Lisinopril 10mg (Morning)</li>
                                    <li>• Celecoxib 200mg (PRN)</li>
                                    <li>• Atorvastatin 20mg (Evening)</li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <BriefcaseMedical className="text-red-500" size={16} />
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Allergies & Alerts</h4>
                                </div>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li className="text-red-600 font-medium">• Penicillin (Severe)</li>
                                    <li>• Latex (Mild sensitivity)</li>
                                    <li className="italic text-slate-400 mt-2">Fall Risk: Elevated</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-2 mb-3">
                            <ClipboardList className="text-indigo-500" size={18} />
                            <h4 className="text-sm font-bold text-slate-700">Routines & Preferences</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            Prefers morning hygiene routines before 9:00 AM. Breakfast typically involves light oat-based meals. Values independence but accepts assistance with stair navigation. Avoid loud alerts during rest periods (1PM - 3PM).
                        </p>

                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-bold text-purple-700 mb-1">AI Care Avatar Integration</div>
                            <p className="text-[10px] text-purple-600 leading-relaxed">
                                Monitoring logic and voice interactions are securely personalized using this clinical profile baseline.
                            </p>
                        </div>
                    </div>
                </div>
            </GlassPanel>

            {/* NEW: Medical Records & Document Vault */}
            <GlassPanel delay={0.1} title="Personal Health Vault & Self-Monitoring" className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
                        {/* Drag and drop zone */}
                        <div
                            onClick={handleUploadClick}
                            className={`bg-slate-50 border-b border-slate-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors ${uploadStatus === 'uploading' ? 'opacity-80 pointer-events-none' : ''}`}
                        >
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                {uploadStatus === 'uploading' ? <Activity size={24} className="animate-spin" /> : <UploadCloud size={24} />}
                            </div>
                            <h4 className="text-sm font-bold text-slate-700">
                                {uploadStatus === 'uploading' ? `Uploading & Indexing... (${uploadProgress}%)` : uploadStatus === 'done' ? 'Upload Complete!' : 'Upload Medical Records'}
                            </h4>
                            {uploadStatus === 'uploading' && (
                                <div className="w-full max-w-xs h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            )}
                            {uploadStatus !== 'uploading' && <p className="text-xs text-slate-500 mt-1">Click to browse or Drag &amp; drop PDF files</p>}
                            <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                AI Understanding Active
                            </div>
                        </div>
                        {/* Recent Uploads List */}
                        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Recent Uploads
                        </div>
                        <div className="flex-1 overflow-y-auto min-h-[140px]">
                            {mockFiles.map(file => (
                                <div key={file.id} className="group flex items-start sm:items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors animate-in slide-in-from-top-2">
                                    <div className="flex items-start sm:items-center gap-3 w-full pr-4 overflow-hidden">
                                        <div className={`p-2 w-9 h-9 flex items-center justify-center ${file.bg} ${file.color} rounded-lg shrink-0 mt-1 sm:mt-0`}><file.icon size={18} /></div>
                                        <div className="break-words min-w-0 pr-2">
                                            <div className="text-sm font-bold text-slate-800 leading-tight mb-1">{file.name}</div>
                                            <div className="text-[10px] sm:text-xs flex items-center gap-1 mt-0.5"><file.statusIcon size={12} className={`shrink-0 ${file.statusColor}`} /> <span className="font-medium opacity-80">{file.status}</span> <span className="hidden sm:inline">&bull;</span> {file.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex bg-slate-50 rounded-md border border-slate-200 overflow-hidden shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleRenameFile(file.id, file.name)} className="text-blue-600 p-2 hover:bg-blue-100 transition-colors" title="Rename"><Edit2 size={14} /></button>
                                        <div className="w-px bg-slate-200"></div>
                                        <button onClick={() => handleDeleteFile(file.id)} className="text-red-500 p-2 hover:bg-red-100 transition-colors" title="Delete"><X size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {mockFiles.length === 0 && (
                                <div className="p-8 text-center flex flex-col items-center gap-2">
                                    <Activity size={24} className="text-slate-300" />
                                    <div className="text-sm font-semibold text-slate-500">Vault is empty</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button onClick={() => handleGenerativeAction('report')} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm group text-left">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform shrink-0"><Bot size={24} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">Generate Self-Health Report</h4>
                                <p className="text-xs text-slate-500 font-medium">Analyze recent notes and vitals into a structured summary for your next doctor visit.</p>
                            </div>
                        </button>

                        <button onClick={() => handleGenerativeAction('trends')} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm group text-left">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform shrink-0"><TrendingUp size={24} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">Track Personal Trends</h4>
                                <p className="text-xs text-slate-500 font-medium">Visualize 30-day improvements in your mobility, pain levels, and sleep quality.</p>
                            </div>
                        </button>

                        <button onClick={() => handleGenerativeAction('pdf')} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:border-amber-300 hover:bg-amber-50 transition-all shadow-sm group text-left">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 transition-transform shrink-0"><Download size={24} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">Download History PDF</h4>
                                <p className="text-xs text-slate-500 font-medium">Export a complete, offline summary of all recorded events and telemetry.</p>
                            </div>
                        </button>
                    </div>
                </div>
            </GlassPanel>

            {/* NEW: Intelligence Control Center */}
            <GlassPanel delay={0.15} title="Intelligence Control Center" className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BellRing size={18} /></div>
                            <h4 className="text-sm font-bold text-slate-800">Notification Threshold</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 h-8 leading-relaxed">Determine what level of clinical deviation triggers an immediate alert.</p>
                        <select
                            value={notifyThreshold}
                            onChange={(e) => setNotifyThreshold(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-sm font-medium text-slate-700 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
                        >
                            <option value="All Events">All Events (Verbose)</option>
                            <option value="Elevated & Critical">Elevated & Critical</option>
                            <option value="Critical Only">Critical Only</option>
                        </select>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><SlidersHorizontal size={18} /></div>
                            <h4 className="text-sm font-bold text-slate-800">Sensor Sensitivity</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 h-8 leading-relaxed">Adjust ambient telemetry sampling rates. High increases battery drain.</p>
                        <select
                            value={sensorSensitivity}
                            onChange={(e) => setSensorSensitivity(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-sm font-medium text-slate-700 rounded-lg p-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                        >
                            <option value="High">High (Sub-second)</option>
                            <option value="Balanced">Balanced (Standard)</option>
                            <option value="Low">Low (Power Saving)</option>
                        </select>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Lock size={18} /></div>
                            <h4 className="text-sm font-bold text-slate-800">Data Sharing & Privacy</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 h-8 leading-relaxed">Manage external routing of encrypted clinical telemetry.</p>
                        <select
                            value={dataSharing}
                            onChange={(e) => setDataSharing(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-sm font-medium text-slate-700 rounded-lg p-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm transition-all"
                        >
                            <option value="Care Team Only">Care Team Only</option>
                            <option value="Hospital EMR">Sync to Hospital EMR</option>
                            <option value="Anonymized Research">Donate to Research</option>
                        </select>
                    </div>
                </div>
            </GlassPanel>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassPanel delay={0.2} title="Identity & Role Context" className="flex flex-col gap-4 bg-white">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 mt-2 shadow-sm">
                        <div className="p-3 bg-blue-100 rounded-full"><User className="text-blue-600" size={24} /></div>
                        <div>
                            <div className="text-base font-semibold text-slate-800 tracking-wide">{session?.user?.name || 'Guest User'}</div>
                            <div className="text-sm text-slate-500">{session?.user?.email || 'Authenticated Session'}</div>
                        </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-teal-600" size={20} />
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Active Role</div>
                                <div className="text-sm font-semibold text-slate-800 capitalize tracking-wide">{userRole} Portal</div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel delay={0.3} title="Family &amp; Access Control" className="flex flex-col bg-white">
                    <div className="flex flex-col gap-4 mt-4 h-full">
                        {/* Care Circle */}
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Users size={14} className="text-blue-500" /> Care Circle Members</h4>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">SR</div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-800">Sarah Reynolds</div>
                                    <div className="text-xs text-slate-500">Primary Caregiver (Daughter)</div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">TC</div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-800">Tom Carter</div>
                                    <div className="text-xs text-slate-500">Physical Therapist</div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm">
                            <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2"><PhoneCall size={14} /> Emergency Contacts</h4>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Michael Vance</div>
                                    <div className="text-xs text-red-600 font-medium mt-0.5">Husband &bull; (555) 123-4567</div>
                                </div>
                                <button className="text-xs font-bold text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-100 transition-colors">Call</button>
                            </div>
                        </div>

                        {/* Active Permissions */}
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm flex-1">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={14} className="text-teal-500" /> Active Role Permissions</h4>
                            <div className="space-y-2">
                                {getPermissions().map((perm, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> {perm}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel delay={0.4} title="Security & Session" className="lg:col-span-2 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                                <History size={20} className="text-indigo-500" />
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Login</div>
                                    <div className="text-sm font-medium tracking-wide text-slate-700">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 opacity-80 shadow-sm">
                                <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Switch Role</div>
                                    <div className="text-sm font-medium tracking-wide text-slate-700">Use Top Navigation Bar</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4">
                            {!session && (
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
                                    <p className="text-xs font-bold text-blue-800 tracking-wide">Link external provider for seamless access</p>
                                    <button className="w-full bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                                        Sign in with Google
                                    </button>
                                </div>
                            )}

                            {showLogoutConfirm ? (
                                <div className="w-full h-full bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col justify-center gap-4 shadow-sm">
                                    <p className="text-sm text-red-700 text-center font-semibold tracking-wide">End session and securely sign out?</p>
                                    <div className="flex gap-3">
                                        <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex-1 bg-red-600 hover:bg-red-500 text-white shadow-md text-sm py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 font-bold tracking-wide">
                                            <LogOut size={16} /> Confirm
                                        </button>
                                        <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 text-sm py-2.5 rounded-xl transition-all border border-slate-300 font-bold tracking-wide shadow-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button className="w-full h-full flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl p-4 text-base font-bold tracking-wide text-red-600 hover:text-red-700 transition-all min-h-[80px] shadow-sm mt-auto" onClick={() => setShowLogoutConfirm(true)}>
                                    <LogOut size={20} /> Sign Out Securely
                                </button>
                            )}
                        </div>
                    </div>
                </GlassPanel>
            </div>
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg">
                                {activeModal === 'report' ? 'Self-Health Report' : activeModal === 'trends' ? '30-Day Trend Analysis' : 'Exporting PDF Data...'}
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 transition-colors">
                                <LogOut size={16} />
                            </button>
                        </div>
                        <div className="p-6 bg-white flex-1 overflow-y-auto min-h-[300px] flex flex-col justify-center">

                            {genStatus === 'generating' ? (
                                <div className="flex flex-col items-center justify-center h-full gap-8 py-8 animate-in zoom-in-95 duration-300">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center bg-slate-50 shadow-inner align-middle">
                                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-emerald-500 animate-spin transition-all"></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-700">{genProgress}%</div>
                                    </div>
                                    <div className="text-center w-full max-w-xs space-y-2">
                                        <h4 className="text-lg font-bold text-slate-800">
                                            {activeModal === 'report' ? 'Synthesizing Records...' : activeModal === 'trends' ? 'Calculating Trajectories...' : 'Compiling PDF Securely...'}
                                        </h4>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 ease-out" style={{ width: `${genProgress}%` }} />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-2 animate-pulse">Running Neural Models</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {activeModal === 'report' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Bot size={24} /></div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">AI Clinical Summary</div>
                                                    <div className="text-xs text-slate-500">Generated strictly from validated patient telemetry.</div>
                                                </div>
                                            </div>
                                            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-sm leading-loose font-medium">
                                                &quot;Evelyn has maintained a stable baseline over the past 7 days. Heart rate averaged {heartRateStream[heartRateStream.length - 1]?.value || 72}bpm with no acute desaturation events. Medication adherence is mathematically at 100%. Physical therapy notes indicate a +15% velocity improvement in stair navigation.&quot;
                                            </div>
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-6 mb-3 px-2">Key Discussion Points for Doctor</div>
                                            <ul className="text-sm text-slate-600 space-y-3 px-2">
                                                <li className="flex gap-3">
                                                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                                    <span>Ask about reducing <strong>Lisinopril dosage</strong> due to stable AM readings.</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                                    <span>Discuss minor skin irritation reported near the <strong>wearable sensor site</strong>.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                    {activeModal === 'trends' && (
                                        <div className="flex flex-col h-full gap-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp size={24} /></div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">30-Day Mobility Trajectory</div>
                                                    <div className="text-xs text-slate-500">Comparing current period against historical baseline.</div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                                <div className="flex items-end gap-2 h-40 border-b border-l border-slate-300 pb-2 pl-2 relative">
                                                    {[40, 45, 50, 48, 55, 60, 65, 75, 80, 85].map((h, i) => (
                                                        <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-sm shadow-sm hover:opacity-80 transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded">Day {i * 3}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
                                                <Activity size={24} className="text-emerald-600 shrink-0 mt-1" />
                                                <div>
                                                    <h4 className="font-bold text-emerald-800 text-sm mb-1">Significant Improvement Detected</h4>
                                                    <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                                                        A steady 45% upward trajectory has been modeled following the new physical therapy routine introduced on Oct 2nd. At this velocity, patient will reach historical mobility levels by Nov 15th.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {activeModal === 'pdf' && (
                                        <div className="flex flex-col items-center justify-center h-full gap-6 py-6 text-center">
                                            <div className="w-24 h-24 rounded-full bg-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.2)] flex items-center justify-center border border-emerald-100">
                                                <CheckCircle2 size={40} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-xl mb-2">Export Completely Synthesized</div>
                                                <div className="text-sm text-slate-500 px-4 leading-relaxed font-medium">All clinical history, sensor telemetry logs, and care team notes have been compiled into a secure, portable PDF format.</div>
                                            </div>

                                            <div className="w-full mt-4 flex gap-3">
                                                <button onClick={() => setActiveModal(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm border border-slate-300">
                                                    Close
                                                </button>
                                                <button onClick={() => setActiveModal(null)} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2">
                                                    <Download size={18} /> Save to Device
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
