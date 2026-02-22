"use client";

import { motion } from 'framer-motion';
import { LayoutGrid, Activity, Brain, History, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS: { href: string; label: string; subtitle: string; icon: React.ElementType }[] = [
    { href: '/overview', label: 'Overview', subtitle: 'Dashboard', icon: LayoutGrid },
    { href: '/family', label: 'Family View', subtitle: 'Live Signals', icon: Activity },
    { href: '/ai-insights', label: 'AI Insights', subtitle: 'Intelligence', icon: Brain },
    { href: '/deep-history', label: 'Deep History', subtitle: 'Hospital Review', icon: History },
    { href: '/account', label: 'Account', subtitle: 'Action Center', icon: ShieldAlert },
];

export function FloatingDock() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 md:bottom-6 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:right-auto z-50 w-full md:max-w-lg px-2 md:px-4 pb-4 md:pb-0 pt-2 md:pt-0 bg-gradient-to-t from-white via-white/80 to-transparent md:bg-none">
            <div className="flex items-center gap-1 p-2 rounded-2xl md:bg-white/90 bg-white/95 backdrop-blur-3xl border border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:shadow-xl overflow-x-auto no-scrollbar snap-x snap-mandatory flex-nowrap justify-start md:justify-center">
                {TABS.map(tab => {
                    const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`relative flex flex-col items-center justify-center min-w-[76px] px-2 py-4 md:py-3 shrink-0 rounded-xl transition-all duration-300 snap-center ${isActive ? 'text-teal-600 scale-105' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="dock-indicator"
                                    className="absolute inset-0 rounded-xl bg-teal-50 border border-teal-100 shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon size={20} className="mb-1 drop-shadow-lg z-10" strokeWidth={isActive ? 2.5 : 1.5} />
                            <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap z-10">{tab.label}</span>
                            {isActive ? (
                                <motion.span
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-[7.5px] uppercase tracking-widest text-teal-600/70 mt-0.5 z-10 hidden sm:block"
                                >
                                    {tab.subtitle}
                                </motion.span>
                            ) : null}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
