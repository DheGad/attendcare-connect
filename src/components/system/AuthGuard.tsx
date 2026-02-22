"use client";

import { useSession } from "next-auth/react";
import { HeartHandshake } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <HeartHandshake className="w-12 h-12 text-blue-600" />
                    <div className="text-slate-600 font-medium tracking-wide">Connecting to Care Ledger...</div>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return <>{children}</>;
}
