"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export function ClientOnly({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return fallback ? fallback : (
            <div className="w-full h-full min-h-[50vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 opacity-50">
                    <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
                    <div className="text-sm font-medium text-slate-500 tracking-widest uppercase">Loading Interface...</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
