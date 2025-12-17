
export type Tab = 'dashboard' | 'groups' | 'students' | 'finances' | 'ai-analysis' | 'settings' | 'attendance';

export type GroupType = 'in-person' | 'online' | 'hybrid';
export type PricingType = 'monthly' | 'per-session' | 'package';
export type GroupStatus = 'open' | 'full' | 'paused' | 'ended';

export interface Group {
  id: string;
  name: string;
  subject: string;
  grade: string;
  type: GroupType;
  pricingType: PricingType;
  price: number;
  capacity: number;
  currentCount: number;
  status: GroupStatus;
  schedule: { day: string; time: string; room?: string }[];
}

export interface StudentContact {
  relation: string;
  name: string;
  phone: string;
}

export interface CustomField {
  label: string;
  value: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  parentPhone: string;
  groupIds: string[];
  attendanceRate: number;
  grade: number;
  balance: number;
  status: 'active' | 'suspended' | 'debtor';
  qrCode: string;
  contacts: StudentContact[];
  customFields: CustomField[];
  notes: string;
  joinDate: string;
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  type: 'payment' | 'debt';
  date: string;
  note: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  groupId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}
