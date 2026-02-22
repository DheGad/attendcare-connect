import { create } from 'zustand';

export interface RegulatorLog {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    status: 'compliant' | 'flagged' | 'under_review';
}

export interface RegulatorState {
    auditLogs: RegulatorLog[];
    complianceScore: number;
}

export const useRegulatorStore = create<RegulatorState>()(() => ({
    auditLogs: [
        { id: 'LOG_001', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Medication Administration', actor: 'Worker_04', status: 'compliant' },
        { id: 'LOG_002', timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'Vitals Override', actor: 'Provider_Alpha', status: 'flagged' }
    ],
    complianceScore: 98.4
}));
