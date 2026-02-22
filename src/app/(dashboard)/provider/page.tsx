"use client";

import { PatientClinicalReview } from "@/components/transformers/PatientClinicalReview";
import { usePathname } from "next/navigation";

export default function PatientReviewPage() {
    const pathname = usePathname();
    const userRole = pathname.split('/')[1] || 'provider';
    return <PatientClinicalReview role={userRole} />;
}
