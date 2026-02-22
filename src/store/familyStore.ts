import { create } from 'zustand';

export interface DataPoint {
    time: string;
    value: number;
}

export interface FamilyState {
    tasks: { id: number; taskCode: string; time: string; title: string; status: 'active' | 'done' | 'pending' | 'locked'; priority: 'normal' | 'high' | 'critical'; missed: boolean }[];
    heartRateStream: DataPoint[];
    oxygenStream: DataPoint[];
    vitalsSummary: string;
    recommendation: string;
    setTasks: (tasks: FamilyState['tasks']) => void;
    addHeartRateData: (val: number) => void;
    addOxygenData: (val: number) => void;
}

export const useFamilyStore = create<FamilyState>()((set) => ({
    tasks: [
        { id: 1, taskCode: 'ENV_SAFET', time: '08:00', title: 'Check Environment Safety', status: 'done', priority: 'normal', missed: false },
        { id: 2, taskCode: 'VIT_BASE', time: '10:00', title: 'Verify Vitals Baseline', status: 'active', priority: 'high', missed: false },
        { id: 3, taskCode: 'MED_PRN', time: '14:00', title: 'Administer PRN Medication', status: 'pending', priority: 'critical', missed: false }
    ],
    heartRateStream: [],
    oxygenStream: [],
    vitalsSummary: "Evelyn's energy levels seem a bit strained right now, and she might feel a little out of breath. Higher chance of slipping today.",
    recommendation: "Assistance recommended. Please make sure she stays seated, drinks some water, and rests for a bit.",
    setTasks: (tasks) => set({ tasks }),
    addHeartRateData: (val) => set((state) => ({ heartRateStream: [...state.heartRateStream.slice(-19), { time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }), value: val }] })),
    addOxygenData: (val) => set((state) => ({ oxygenStream: [...state.oxygenStream.slice(-19), { time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }), value: val }] }))
}));

// Background loop specific to Family tab
if (typeof window !== 'undefined') {
    setInterval(() => {
        const state = useFamilyStore.getState();
        const baseHR = 95;
        const baseO2 = 94;
        state.addHeartRateData(Math.round(baseHR + (Math.random() * 10 - 5)));
        state.addOxygenData(Math.round(baseO2 + (Math.random() * 4 - 2)));
    }, 2000);
}
