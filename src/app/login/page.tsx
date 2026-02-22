"use client";

import { useSession, signIn } from "next-auth/react";
import { HeartHandshake, KeyRound, Mail, Fingerprint, ShieldCheck, ChevronRight, Activity, Users, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMethod, setLoginMethod] = useState<'options' | 'email'>('options');
    const [previewRole, setPreviewRole] = useState<'family' | 'provider' | 'hospital'>('family');

    // If already authenticated via next-auth, redirect to overview immediately.
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/overview");
        }
    }, [status, router]);

    const handleLoginSuccess = () => {
        signIn('credentials', { callbackUrl: `/${previewRole}` });
    };

    return (
        <div className="flex h-[100dvh] w-full items-center justify-center bg-[#F5F7FA] p-4 sm:p-8 font-sans">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white/50 pointer-events-none" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={loginMethod}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md z-10"
                >
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 relative overflow-hidden">

                        <div className="flex flex-col items-center gap-3 text-center mb-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 shadow-inner border border-blue-100/50">
                                <Activity className="w-8 h-8" strokeWidth={2} />
                            </div>
                            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">AttendCare Connect</h1>
                            <p className="text-slate-500 text-sm max-w-[280px] leading-relaxed">
                                Secure clinical gateway. Empowering independence through coordinated support.
                            </p>
                        </div>

                        {loginMethod === 'options' ? (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => signIn('google', { callbackUrl: `/${previewRole}` })}
                                    className="w-full relative flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm group"
                                >
                                    <svg className="w-5 h-5 absolute left-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>

                                <button
                                    onClick={() => setLoginMethod('email')}
                                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3.5 px-6 rounded-xl transition-all shadow-sm"
                                >
                                    <Mail className="absolute left-5 w-5 h-5 text-slate-400" />
                                    <span>Continue with Email</span>
                                </button>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-slate-100"></div>
                                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">Or</span>
                                    <div className="flex-grow border-t border-slate-100"></div>
                                </div>

                                <button
                                    onClick={() => handleLoginSuccess()}
                                    className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 font-semibold py-4 px-5 rounded-xl transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-1.5 rounded-lg shadow-sm"><KeyRound size={18} className="text-blue-600" /></div>
                                        <div className="flex flex-col items-start leading-tight">
                                            <span className="text-sm">Guest Demo Mode</span>
                                            <span className="text-[10px] uppercase tracking-wider opacity-70">Interactive walkthrough</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="opacity-50" />
                                </button>

                                <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-400 font-medium py-3 px-6 rounded-xl mt-2 opacity-60 cursor-not-allowed border border-slate-100">
                                    <Fingerprint className="w-4 h-4" />
                                    <span className="text-sm">Biometric Login (Coming Soon)</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setLoginMethod('options')}
                                    className="text-xs text-blue-600 font-medium hover:underline self-start mb-2"
                                >
                                    ← Back to options
                                </button>

                                <div className="space-y-3 relative z-10">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1 mb-1 block">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button className="text-xs text-blue-600 font-medium hover:underline self-start mt-1 inline-block">
                                        Send Magic Link instead
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1 mb-2 block">Login As (Demo Preview)</label>
                                    <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
                                        <button
                                            onClick={() => setPreviewRole('family')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${previewRole === 'family' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <Users size={14} /> Family
                                        </button>
                                        <button
                                            onClick={() => setPreviewRole('provider')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${previewRole === 'provider' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <HeartHandshake size={14} /> Provider
                                        </button>
                                        <button
                                            onClick={() => setPreviewRole('hospital')}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${previewRole === 'hospital' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <Building2 size={14} /> Hospital
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleLoginSuccess()}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20 mt-2"
                                >
                                    Sign In Securely
                                </button>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                Your data is encrypted end-to-end. By logging in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> covering strict medical data usage.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
