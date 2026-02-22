import { create } from 'zustand';

export interface Hospital {
    id: string;
    name: string;
    location: string;
    country: string;
    type: string;
    specialties: string[];
    load: string;
    capability: string;
}

export const GLOBAL_HOSPITALS: Hospital[] = [
    { id: 'stv-syd', name: "St. Vincent's Public Hosp.", location: "Sydney, NSW", country: "Australia", type: "Level 1 Trauma Center", specialties: ["Cardiology", "Orthopedics", "Neurology"], load: "Available", capability: "Direct API" },
    { id: 'rpa-nsw', name: "Royal Prince Alfred", location: "Camperdown, NSW", country: "Australia", type: "Major Referral", specialties: ["Oncology", "General Surgery"], load: "High Load", capability: "HL7 Only" },
    { id: 'aiims-del', name: "AIIMS New Delhi", location: "New Delhi", country: "India", type: "Apex Research", specialties: ["Cardiology", "Transplant"], load: "Critical", capability: "Manual Review" },
    { id: 'sgh-sg', name: "Singapore General", location: "Bukit Merah", country: "Singapore", type: "Tertiary Referral", specialties: ["Oncology", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'mayo-us', name: "Mayo Clinic", location: "Rochester, MN", country: "United States", type: "Research Center", specialties: ["Neurology", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'gstt-uk', name: "Guy's and St Thomas'", location: "London", country: "United Kingdom", type: "NHS Trust", specialties: ["Orthopedics", "Oncology"], load: "High Load", capability: "HL7 Only" },
    { id: 'mgr-ca', name: "Toronto General", location: "Toronto, ON", country: "Canada", type: "Research Hospital", specialties: ["Transplant", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'char-de', name: "Charité", location: "Berlin", country: "Germany", type: "University Hospital", specialties: ["Neurology", "General Surgery"], load: "High Load", capability: "HL7 Only" },
    { id: 'ap-hp-fr', name: "AP-HP", location: "Paris", country: "France", type: "Public Health System", specialties: ["Oncology", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'fujita-jp', name: "Fujita Health", location: "Aichi", country: "Japan", type: "Academic Medical Center", specialties: ["Robotic Surgery", "Neurology"], load: "Available", capability: "Direct API" },
    { id: 'asan-kr', name: "Asan Medical Center", location: "Seoul", country: "South Korea", type: "Comprehensive Care", specialties: ["Transplant", "Oncology"], load: "High Load", capability: "Direct API" },
    { id: 'cleveland-uae', name: "Cleveland Clinic AD", location: "Abu Dhabi", country: "United Arab Emirates", type: "Multispecialty", specialties: ["Cardiology", "Endocrinology"], load: "Available", capability: "Direct API" },
    { id: 'zurich-ch', name: "Universitätsspital Zürich", location: "Zurich", country: "Switzerland", type: "University Hospital", specialties: ["Neurology", "Cardiology"], load: "Available", capability: "HL7 Only" },
    { id: 'sheba-il', name: "Sheba Medical Center", location: "Tel HaShomer", country: "Israel", type: "Research Institute", specialties: ["Trauma", "Rehabilitation"], load: "Available", capability: "Direct API" },
    { id: 'auckland-nz', name: "Auckland City Hospital", location: "Auckland", country: "New Zealand", type: "Public Hospital", specialties: ["Pediatrics", "Cardiology"], load: "High Load", capability: "HL7 Only" },
    { id: 'netcare-za', name: "Netcare Milpark", location: "Johannesburg", country: "South Africa", type: "Private Hospital", specialties: ["Trauma", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'einstein-br', name: "Albert Einstein Hospital", location: "São Paulo", country: "Brazil", type: "Private Hospital", specialties: ["Oncology", "Cardiology"], load: "Available", capability: "Direct API" },
    { id: 'medica-mx', name: "Médica Sur", location: "Mexico City", country: "Mexico", type: "Tertiary Care", specialties: ["Gastroenterology", "Cardiology"], load: "Available", capability: "HL7 Only" },
    { id: 'kingfaisal-sa', name: "King Faisal Specialist", location: "Riyadh", country: "Saudi Arabia", type: "Specialist Hospital", specialties: ["Oncology", "Transplant"], load: "Available", capability: "Direct API" }
];

export interface HospitalState {
    hospitals: Hospital[];
    countryFilter: string;
    specialtyFilter: string;
    capabilityFilter: string;
    setCountryFilter: (filter: string) => void;
    setSpecialtyFilter: (filter: string) => void;
    setCapabilityFilter: (filter: string) => void;
}

export const useHospitalStore = create<HospitalState>()((set) => ({
    hospitals: GLOBAL_HOSPITALS,
    countryFilter: 'All',
    specialtyFilter: 'All',
    capabilityFilter: 'All',
    setCountryFilter: (filter) => set({ countryFilter: filter }),
    setSpecialtyFilter: (filter) => set({ specialtyFilter: filter }),
    setCapabilityFilter: (filter) => set({ capabilityFilter: filter })
}));
