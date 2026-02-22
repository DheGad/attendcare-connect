"use client";

import { GlobalHospitalNetwork } from "@/components/transformers/GlobalHospitalNetwork";
import { usePathname } from "next/navigation";

export default function HospitalNetworkPage() {
    const pathname = usePathname();
    const userRole = pathname.split('/')[1] || 'hospital';
    console.log("MARKER: hospital network page rendering");
    return <GlobalHospitalNetwork role={userRole} />;
}
