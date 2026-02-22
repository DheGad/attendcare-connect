import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'family' | 'worker' | 'provider' | 'hospital' | 'regulator';
// Note: Condition is reconstructed dynamically now, not just hardcoded labels
export type ParticipantCondition = 'stable' | 'at-risk' | 'critical';
export type SystemMode = 'LIVE' | 'DEMO';

export interface DataPoint {
    time: string;
    value: number;
}

export interface Insight {
    id: string;
    timestamp: string;
    source: string;
    message: string;
    severity: 'info' | 'warning' | 'alert';
}

export interface InterfaceState {
    // Mode
    systemMode: SystemMode;
    toggleMode: () => void;

    // Core Context
    participantCondition: ParticipantCondition;
    activePatientContext: string | null;

    // Data State
    heartRateStream: DataPoint[];
    oxygenStream: DataPoint[];
    aiInsights: Insight[];
    systemLoad: number;

    // Actions
    setCondition: (condition: ParticipantCondition) => void;
    setActivePatientContext: (ctx: string | null) => void;

    // Real API Sync
    syncLiveState: () => Promise<void>;

    // Data Stream Actions (for DEMO and API injections)
    addHeartRateData: (val: number) => void;
    addOxygenData: (val: number) => void;
    addInsight: (insight: Insight) => void;
    setSystemLoad: (load: number) => void;
    setFullState: (partial: Partial<InterfaceState>) => void;
}

export const usePatientCoreStore = create<InterfaceState>()(
    persist(
        (set) => ({
            systemMode: 'LIVE', // Default as per strict rule
            toggleMode: () => set((state) => ({ systemMode: state.systemMode === 'LIVE' ? 'DEMO' : 'LIVE' })),

            participantCondition: 'at-risk',
            activePatientContext: 'evelyn_vance', // Default demo patient

            heartRateStream: [],
            oxygenStream: [],
            aiInsights: [],
            systemLoad: 0,

            setCondition: (condition) => set({ participantCondition: condition }),
            setActivePatientContext: (ctx) => set({ activePatientContext: ctx }),

            addHeartRateData: (val) => set((state) => ({
                heartRateStream: [...state.heartRateStream.slice(-19), { time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }), value: val }]
            })),
            addOxygenData: (val) => set((state) => ({
                oxygenStream: [...state.oxygenStream.slice(-19), { time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }), value: val }]
            })),
            addInsight: (insight) => set((state) => ({
                aiInsights: [insight, ...state.aiInsights].slice(0, 50)
            })),
            setSystemLoad: (load) => set({ systemLoad: load }),
            setFullState: (partial) => set(partial),

            syncLiveState: async () => {
                try {
                    const res = await fetch('/api/state');
                    if (res.ok) {
                        const data = await res.json();
                        // Assumes data maps to InterfaceState structure payload
                        set((state) => ({
                            ...state,
                            heartRateStream: data.heartRateStream || state.heartRateStream,
                            oxygenStream: data.oxygenStream || state.oxygenStream,
                            aiInsights: data.aiInsights || state.aiInsights,
                            systemLoad: data.systemLoad ?? state.systemLoad,
                            participantCondition: data.participantCondition || state.participantCondition
                        }));
                    }
                } catch (e) {
                    console.error("Live sync failed", e);
                }
            }
        }),
        {
            name: 'attendcare-connect-storage',
            partialize: (state) => ({
                activePatientContext: state.activePatientContext
            }),
        }
    )
);

// Background Loop Engine
if (typeof window !== 'undefined') {
    // Fast cycle for rendering streams
    setInterval(() => {
        const state = usePatientCoreStore.getState();

        if (state.systemMode === 'DEMO') {
            // Original Mock Generators
            const baseHR = state.participantCondition === 'critical' ? 120 : state.participantCondition === 'at-risk' ? 95 : 75;
            const baseO2 = state.participantCondition === 'critical' ? 88 : state.participantCondition === 'at-risk' ? 94 : 98;

            state.addHeartRateData(Math.round(baseHR + (Math.random() * 10 - 5)));
            state.addOxygenData(Math.round(baseO2 + (Math.random() * 4 - 2)));
            state.setSystemLoad(Math.round(Math.max(10, Math.min(95, state.systemLoad + (Math.random() * 10 - 5)))));
        } else {
            // LIVE MODE connects to the real PostgreSQL DB via API reconstructor
            state.syncLiveState();
        }
    }, 2000);

    // Mock Insights (Only in DEMO)
    setInterval(() => {
        const state = usePatientCoreStore.getState();
        if (state.systemMode === 'DEMO') {
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
        }
    }, 5000);
}

// ==========================================
// CORE COMPUTATION ONLY
// ==========================================
