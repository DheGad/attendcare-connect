import { create } from 'zustand';

export interface WorkerTask {
    id: number;
    taskCode: string;
    time: string;
    title: string;
    status: 'done' | 'active' | 'pending' | 'locked';
    priority: 'normal' | 'high' | 'critical';
    missed: boolean;
}

export interface WorkerState {
    tasks: WorkerTask[];
    setTasks: (tasks: WorkerTask[]) => void;
    completeActiveTask: () => void;
}

export const useWorkerStore = create<WorkerState>()((set) => ({
    tasks: [
        { id: 1, taskCode: 'ENV_SAFET', time: '08:00', title: 'Check Environment Safety', status: 'done', priority: 'normal', missed: false },
        { id: 2, taskCode: 'VIT_BASE', time: '10:00', title: 'Verify Vitals Baseline', status: 'active', priority: 'high', missed: true },
        { id: 3, taskCode: 'MED_PRN', time: '14:00', title: 'Administer PRN Medication', status: 'pending', priority: 'critical', missed: false }
    ],
    setTasks: (tasks) => set({ tasks }),
    completeActiveTask: () => set((state) => {
        const activeIdx = state.tasks.findIndex(t => t.status === 'active');
        if (activeIdx === -1) return state;
        const newTasks = [...state.tasks];
        newTasks[activeIdx] = { ...newTasks[activeIdx], status: 'done', missed: false };
        if (activeIdx + 1 < newTasks.length) {
            newTasks[activeIdx + 1] = { ...newTasks[activeIdx + 1], status: 'active' };
        }
        return { tasks: newTasks };
    })
}));
