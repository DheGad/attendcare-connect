import { GuardianView } from './GuardianView';
import { OperationsConsole } from './OperationsConsole';
import { ClinicalCommand } from './ClinicalCommand';
import { PatientClinicalReview } from './PatientClinicalReview';
import { GlobalHospitalNetwork } from './GlobalHospitalNetwork';
import { AIToolsPanel } from '../system/AIToolsPanel';
import { AccountPanel } from '../system/AccountPanel';
import { OverviewDashboard } from '../dashboard/OverviewDashboard';
import { TimelineHistory } from '../dashboard/TimelineHistory';

import { usePathname } from 'next/navigation';

/**
 * EventTransformer: The routing hub for the UI layer based on Context.
 */
export function EventTransformer() {
    const pathname = usePathname();
    const userRole = pathname.split('/')[1] || 'family';

    // Global Feature Overrides (Cross-Role)
    if (pathname.includes('/overview') || pathname === '/') {
        return <OverviewDashboard />; // refined dashboard
    }

    if (pathname.includes('/insights') || pathname.includes('/ai-insights')) {
        return <AIToolsPanel />;
    }

    if (pathname.includes('/account')) {
        return <AccountPanel />;
    }

    // Role + Page Matrix Implementation
    if (pathname.includes('/deep-history')) {
        if (userRole === 'hospital' || userRole === 'regulator') {
            return <GlobalHospitalNetwork role={userRole} />;
        }
        return <TimelineHistory />;
    }

    if (pathname.includes('/family')) {
        switch (userRole) {
            case 'family':
                return <GuardianView />;
            case 'worker':
                return <OperationsConsole />;
            case 'provider':
                return <ClinicalCommand />;
            case 'hospital':
            case 'regulator':
                return <PatientClinicalReview role={userRole} />;
            default:
                return null;
        }
    }

    return null;
}
