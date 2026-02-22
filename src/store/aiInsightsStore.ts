import { create } from 'zustand';
import { usePatientCoreStore } from '@/store/patientCoreStore';

export interface Insight {
    id: string;
    timestamp: string;
    source: string;
    message: string;
    severity: 'info' | 'warning' | 'alert';
}

export interface CalculatorHistoryEntry {
    id: string;
    calculatorId: string;
    timestamp: string;
    inputs: Record<string, string | number | boolean>;
    result: { score: string; remark: string; alert: boolean };
}

export interface AIInsightsState {
    insights: Insight[];
    history: CalculatorHistoryEntry[];
    addInsight: (insight: Insight) => void;
    addHistory: (entry: CalculatorHistoryEntry) => void;
}

export const useAIInsightsStore = create<AIInsightsState>()((set) => ({
    insights: [],
    history: [],
    addInsight: (insight) => set((state) => ({ insights: [insight, ...state.insights].slice(0, 50) })),
    addHistory: (entry) => set((state) => ({ history: [entry, ...state.history].slice(0, 50) }))
}));

// Background loop specific to AI Insights tab
if (typeof window !== 'undefined') {
    setInterval(() => {
        const state = useAIInsightsStore.getState();
        const types = ['Agent Sub-Routine', 'Biosensor Network', 'Vision Model', 'Predictive Node'];
        const statuses = ['nominal', 'calibrating', 'tracking', 'analyzing variance'];

        if (Math.random() > 0.5) {
            state.addInsight({
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toLocaleTimeString(),
                source: types[Math.floor(Math.random() * types.length)],
                message: `Status: ${statuses[Math.floor(Math.random() * statuses.length)]}. Context window updated.`,
                severity: 'info'
            });
        }
    }, 5000);
}

export const useAICalculators = () => {
    const condition = usePatientCoreStore(state => state.participantCondition);

    // Decoupled mock values for this store
    const lastHR = 76;
    const lastO2 = 98;

    const hrFactor = Math.abs(lastHR - 75) / 50;
    const o2Factor = Math.max(0, 100 - lastO2) / 15;

    const baseRisk = condition === 'critical' ? 80 : condition === 'at-risk' ? 40 : 10;

    return {
        fallRisk: Math.min(100, Math.round(baseRisk + hrFactor * 20)),
        hydrationScore: Math.max(0, Math.round(100 - (baseRisk * 0.5) - (hrFactor * 15))),
        fatigueIndex: Math.min(100, Math.round((baseRisk * 0.8) + (o2Factor * 40))),
        infectionProbability: Math.min(100, Math.round(15 + hrFactor * 30)),
        recoveryProjection: condition === 'stable' ? '3-5 Days' : condition === 'at-risk' ? '7-10 Days' : 'Indeterminate (Awaiting Stabilization)',
        readmissionRisk: Math.min(100, Math.round(baseRisk * 1.1 + hrFactor * 10 + o2Factor * 20)),
        sleepQualityScore: Math.max(0, Math.round(100 - (baseRisk * 0.7) - (hrFactor * 25))),
        mobilityDeclinePrediction: Math.min(100, Math.round((baseRisk * 0.9) + (hrFactor * 30))),

        // Phase 4: Interactive Simulation Computations
        runSimulation: (simType: string, inputs: Record<string, number>): { outcome: string, riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical', metrics: { label: string, value: string }[], explanation: string } => {
            if (simType === 'beta') {
                const missedDoses = inputs.missedDoses || 1;
                const baseHr = lastHR;
                const projectedHr = baseHr + (missedDoses * 12);
                let risk: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
                if (projectedHr > 90) risk = 'Moderate';
                if (projectedHr > 110) risk = 'High';
                if (projectedHr > 130) risk = 'Critical';

                return {
                    outcome: `Tachycardia Escalaration (HR ${projectedHr} bpm)`,
                    riskLevel: risk,
                    metrics: [
                        { label: 'Projected Peak HR', value: `${projectedHr} bpm` },
                        { label: 'Arrhythmia Probability', value: `${missedDoses * 15}%` }
                    ],
                    explanation: `Missing ${missedDoses} consecutive doses of Beta-Blockers removes sympathetic nervous system inhibition, leading to a projected peak heart rate of ${projectedHr} bpm within 24 hours. The risk of secondary atrial fibrillation increases linearly.`
                };
            }
            if (simType === 'recovery') {
                const ptSessions = inputs.ptSessions || 3;
                const adherence = inputs.adherence || 80;
                const baseRecovery = 40;
                const projectedScore = Math.min(100, Math.round(baseRecovery + (ptSessions * 5) * (adherence / 100)));
                let pace = 'Nominal Recovery';
                if (projectedScore > 70) pace = 'Accelerated Recovery';
                if (projectedScore < 50) pace = 'Stagnant Recovery';

                return {
                    outcome: pace,
                    riskLevel: projectedScore < 50 ? 'High' : 'Low',
                    metrics: [
                        { label: 'Projected Mobility Score', value: `${projectedScore}/100` },
                        { label: 'Days to Independence', value: `${Math.max(5, 60 - projectedScore)} days` }
                    ],
                    explanation: `Based on an input of ${ptSessions} PT sessions/week at ${adherence}% physiological exertion adherence, the patient's musculoskeletal framework is projected to reach a mobility score of ${projectedScore}/100 in 30 days.`
                };
            }
            return { outcome: 'Unknown Scenario', riskLevel: 'Low', metrics: [], explanation: 'Cannot compute.' };
        },

        // Phase 4: Report Generation Engine
        generateReport: (reportType: string, timeframe: number, includeBiometrics: boolean): { id: string, title: string, summary: string, metadata: { timestamp: string, size: string, format: string } } => {
            const timeStr = timeframe === 24 ? '24-Hour' : timeframe === 72 ? '72-Hour' : '7-Day';
            const bioStr = includeBiometrics ? ' with full biometric telemetry trace' : '';
            const timestamp = new Date().toISOString();

            if (reportType === 'pdf') {
                return {
                    id: `REP-PDF-${Math.floor(Math.random() * 10000)}`,
                    title: `Standard Clinical Summary (${timeStr})`,
                    summary: `Generated standard PDF summary covering the last ${timeStr}${bioStr}. Document includes medication adherence logs, risk indices, and nursing observations.`,
                    metadata: { timestamp, size: '2.4 MB', format: 'PDF/A' }
                };
            }
            if (reportType === 'fhir') {
                return {
                    id: `REP-FHIR-${Math.floor(Math.random() * 10000)}`,
                    title: `HL7 FHIR Interoperability Bundle`,
                    summary: `Compiled raw structured data conforming to HL7 FHIR R4 standard for the past ${timeStr}${bioStr}. Ready for direct EMR ingestion (Epic/Cerner compatible).`,
                    metadata: { timestamp, size: '840 KB', format: 'JSON/FHIR' }
                };
            }
            // default 'family'
            return {
                id: `REP-FAM-${Math.floor(Math.random() * 10000)}`,
                title: `Family Plain-Language Update`,
                summary: `Translated complex clinical terminology from the last ${timeStr} into accessible language. Note: Biometric inclusion is simplified for non-clinical reading.`,
                metadata: { timestamp, size: '1.2 MB', format: 'Secure PDF' }
            };
        }
    };
};
