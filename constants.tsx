
import React from 'react';
import { 
  LayoutDashboard, Users, School, Wallet, BrainCircuit, Settings, Plus, Search, 
  TrendingUp, UserCheck, AlertCircle, Calendar, Clock, QrCode, MessageSquare, 
  Video, FileText, ChevronRight, Filter, User, Info, CreditCard, History
} from 'lucide-react';

export const ICONS = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Students: <Users className="w-5 h-5" />,
  Groups: <School className="w-5 h-5" />,
  Finances: <Wallet className="w-5 h-5" />,
  AI: <BrainCircuit className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Plus: <Plus className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  Trend: <TrendingUp className="w-5 h-5" />,
  Attendance: <UserCheck className="w-5 h-5" />,
  Alert: <AlertCircle className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  QR: <QrCode className="w-5 h-5" />,
  WhatsApp: <MessageSquare className="w-5 h-5" />,
  Recording: <Video className="w-5 h-5" />,
  Reports: <FileText className="w-5 h-5" />,
  Next: <ChevronRight className="w-5 h-5" />,
  Filter: <Filter className="w-4 h-4" />,
  User: <User className="w-5 h-5" />,
  Info: <Info className="w-5 h-5" />,
  Card: <CreditCard className="w-5 h-5" />,
  History: <History className="w-5 h-5" />
};

export const MOCK_GROUPS: any[] = [
  { 
    id: 'g1', name: 'فيزياء - تالتة ثانوي (A)', subject: 'فيزياء', grade: 'الصف الثالث الثانوي', 
    type: 'hybrid', pricingType: 'monthly', price: 400, capacity: 50, currentCount: 42, 
    status: 'open', schedule: [{ day: 'الأحد', time: '04:00 م', room: 'قاعة 1' }]
  },
  { 
    id: 'g2', name: 'فيزياء - تانية ثانوي (B)', subject: 'فيزياء', grade: 'الصف الثاني الثانوي', 
    type: 'in-person', pricingType: 'per-session', price: 60, capacity: 30, currentCount: 30, 
    status: 'full', schedule: [{ day: 'الثلاثاء', time: '06:00 م', room: 'قاعة 3' }]
  }
];

export const MOCK_SESSIONS: any[] = [
  { id: 'sess1', groupName: 'فيزياء - تالتة ثانوي (A)', time: '04:00 م', room: 'قاعة 1', students: 42, type: 'hybrid' },
  { id: 'sess2', groupName: 'فيزياء - أولى ثانوي (C)', time: '07:00 م', room: 'قاعة 2', students: 25, type: 'online' }
];

export const MOCK_STUDENTS: any[] = [
  { 
    id: 's1', name: 'أحمد محمود سليمان', phone: '01012345678', centerId: 'c1', attendance: 92, grade: 88, balance: 0, status: 'active',
    parentPhone: '01099887766', groupIds: ['g1'], joinDate: '2023-09-01', notes: 'طالب ملتزم جداً ويهتم بالتفاصيل.',
    contacts: [{ relation: 'أب', name: 'محمود سليمان', phone: '01099887766' }],
    customFields: [{ label: 'المدرسة', value: 'مدرسة المتفوقين' }, { label: 'المنطقة', value: 'المعادي' }]
  },
  { 
    id: 's2', name: 'سارة محمد حسن', phone: '01198765432', centerId: 'c2', attendance: 78, grade: 95, balance: 150, status: 'debtor',
    parentPhone: '01122334455', groupIds: ['g2'], joinDate: '2023-10-15', notes: 'تحتاج متابعة في دفع الاشتراك الشهري.',
    contacts: [{ relation: 'أم', name: 'فاطمة الزهراء', phone: '01122334455' }],
    customFields: [{ label: 'المدرسة', value: 'القاهرة الرسمية' }]
  },
  { 
    id: 's3', name: 'ياسين علي كريم', phone: '01234567890', centerId: 'c1', attendance: 85, grade: 72, balance: 0, status: 'active',
    parentPhone: '01200011122', groupIds: ['g1'], joinDate: '2023-08-20', notes: 'مستوى أكاديمي متوسط يحتاج لتركيز أكبر.',
    contacts: [{ relation: 'خال', name: 'إبراهيم علي', phone: '01200011122' }],
    customFields: [{ label: 'المنطقة', value: 'مدينة نصر' }]
  }
];
