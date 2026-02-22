import { create } from 'zustand';

export interface ProviderState {
    riskLevel: 'stable' | 'at-risk' | 'critical';
    clinicalSummary: string;
    biomarkerTrend: string;
    activeAlerts: string[];
    setRiskLevel: (level: 'stable' | 'at-risk' | 'critical') => void;
}

export const useProviderStore = create<ProviderState>()((set) => ({
    riskLevel: 'at-risk',
    clinicalSummary: 'Monitor for potential arrhythmias and desaturation. Patient shows mild fatigue but vitals are stabilized within secondary parameters.',
    biomarkerTrend: 'Stable',
    activeAlerts: ['HR_TACHYCARDIA_DETECTED'],
    setRiskLevel: (level) => set({ riskLevel: level })
}));
