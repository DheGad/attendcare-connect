import { create } from 'zustand';

export interface OverviewState {
    lastRefresh: string;
    refreshData: () => void;
}

export const useOverviewStore = create<OverviewState>()((set) => ({
    lastRefresh: new Date().toISOString(),
    refreshData: () => set({ lastRefresh: new Date().toISOString() })
}));
