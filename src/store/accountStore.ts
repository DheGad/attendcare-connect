import { create } from 'zustand';
import { FileType, FileText, CheckCircle2, Activity } from 'lucide-react';

export interface MockFile {
    id: number;
    name: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    status: string;
    statusIcon: React.ElementType;
    statusColor: string;
    date: string;
}

export interface AccountState {
    mockFiles: MockFile[];
    notifyThreshold: string;
    sensorSensitivity: string;
    dataSharing: string;
    setNotifyThreshold: (threshold: string) => void;
    setSensorSensitivity: (sensitivity: string) => void;
    setDataSharing: (sharing: string) => void;
    addMockFile: (file: MockFile) => void;
    deleteMockFile: (id: number) => void;
    renameMockFile: (id: number, newName: string) => void;
}

export const useAccountStore = create<AccountState>()((set) => ({
    mockFiles: [
        { id: 1, name: 'Cardiology Consult Report.pdf', icon: FileType, color: 'text-blue-600', bg: 'bg-blue-50', status: '100% Indexed', statusIcon: CheckCircle2, statusColor: 'text-emerald-500', date: 'Oct 12' },
        { id: 2, name: 'Discharge Summary.pdf', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50', status: 'Processing (72%)', statusIcon: Activity, statusColor: 'text-amber-500', date: 'Sep 04' }
    ],
    notifyThreshold: 'Elevated & Critical',
    sensorSensitivity: 'High',
    dataSharing: 'Care Team Only',
    setNotifyThreshold: (threshold) => set({ notifyThreshold: threshold }),
    setSensorSensitivity: (sensitivity) => set({ sensorSensitivity: sensitivity }),
    setDataSharing: (sharing) => set({ dataSharing: sharing }),
    addMockFile: (file) => set((state) => ({ mockFiles: [file, ...state.mockFiles] })),
    deleteMockFile: (id) => set((state) => ({ mockFiles: state.mockFiles.filter(f => f.id !== id) })),
    renameMockFile: (id, newName) => set((state) => ({
        mockFiles: state.mockFiles.map(f => f.id === id ? { ...f, name: newName } : f)
    }))
}));
