import { create } from 'zustand';

export type Timescale = '24h' | '7d' | '30d' | '6mo';
export type EventCategory = 'vitals' | 'intervention' | 'medication' | 'note' | 'escalation' | 'discharge';

export interface TimelineEvent {
    id: string;
    time: string;
    category: EventCategory;
    title: string;
    description: string;
    author: string;
}

export interface HistoryState {
    events: Record<Timescale, TimelineEvent[]>;
    addEvent: (timescale: Timescale, event: TimelineEvent) => void;
}

export const useHistoryStore = create<HistoryState>()((set) => ({
    events: {
        '24h': [
            { id: '1', time: '14:30', category: 'vitals', title: 'Routine Telemetry Check', description: 'BP 118/75, HR 72, SpO2 99%. All within nominal baseline range.', author: 'Auto-Sensor Hub' },
            { id: '2', time: '12:00', category: 'medication', title: 'Midday Administration', description: 'Lisinopril 10mg administered successfully. Patient reported no adverse effects.', author: 'Nurse Marcus' },
            { id: '3', time: '09:15', category: 'intervention', title: 'Physical Therapy', description: 'Completed 30m mobility circuit. Gait stable. Minor fatigue noted post-exercise.', author: 'PT Sarah Jenkins' },
            { id: '4', time: '07:00', category: 'note', title: 'Morning Handover', description: 'Patient slept well through the night. No respiratory distress observed.', author: 'Dr. Aris' },
        ],
        '7d': [
            { id: '1', time: 'Yesterday', category: 'escalation', title: 'Minor HR Anomaly', description: 'Brief tachycardia episode (HR 110) lasting 4 minutes. Resolved spontaneously without intervention.', author: 'System Alert' },
            { id: '2', time: '3 Days Ago', category: 'medication', title: 'Dosage Adjustment', description: 'Evening beta-blocker dosage tapered down by 5mg per cardiology review.', author: 'Dr. Chen' },
            { id: '3', time: '5 Days Ago', category: 'note', title: 'Weekly Dietitian Review', description: 'Sodium intake optimized. Hydration compliance improved to 90% of daily target.', author: 'Dietitian Roberts' },
        ],
        '30d': [
            { id: '1', time: 'Oct 12', category: 'intervention', title: 'Cardiology Follow-up', description: 'Echocardiogram results stable. No signs of progressive hypertrophy.', author: 'Dr. Chen' },
            { id: '2', time: 'Oct 04', category: 'discharge', title: 'Step-down Protocol Initiated', description: 'Patient successfully transitioned from intensive monitoring to standard home telemetry.', author: 'Care Coordinator' },
            { id: '3', time: 'Sep 28', category: 'escalation', title: 'ER Visit - Fluid Overload', description: 'Brief readmission for IV diuretics following sudden weight gain. Stabilized within 24h.', author: 'St. Vincent ER' },
        ],
        '6mo': [
            { id: '1', time: 'Last Month', category: 'note', title: 'Monthly Summary', description: 'Overall trajectory positive. Readmission risk decreased by 14%.', author: 'AI Analytics Engine' },
            { id: '2', time: '3 Months Ago', category: 'intervention', title: 'Pacemaker Optimization', description: 'Routine hardware check and threshold calibration. Pacing ratio optimal.', author: 'Device Clinic' },
            { id: '3', time: '5 Months Ago', category: 'discharge', title: 'Initial Discharge', description: 'Discharged from acute care following primary intervention. Home monitoring equipment installed.', author: 'Dr. Aris' },
        ]
    },
    addEvent: (timescale, event) => set((state) => ({
        events: {
            ...state.events,
            [timescale]: [event, ...state.events[timescale]]
        }
    }))
}));
