
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { Student, Group, Transaction, AttendanceRecord, Tab } from '../types';
import { analyzeStudentPerformance } from '../services/geminiService';
import { 
  TrendingUp, Users, School, AlertCircle, Sparkles, Brain, 
  Clock, Calendar as CalendarIcon, ChevronLeft, Zap, Plus,
  ArrowUpRight, ArrowDownRight, Target, Activity, Download,
  PlayCircle, QrCode, Search, X, CheckCircle2, BellRing,
  ArrowLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  students: Student[];
  groups: Group[];
  transactions: Transaction[];
  attendance: AttendanceRecord[];
  setActiveTab: (tab: Tab) => void;
  setAttendance: (a: AttendanceRecord[]) => void;
  setStudents: (s: Student[]) => void;
}

const Dashboard: React.FC<Props> = ({ students, groups, transactions, attendance, setActiveTab, setAttendance, setStudents }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);

  // Statistics Calculation
  const todayDate = new Date().toLocaleDateString('ar-EG');
  const todayIncome = transactions
    .filter(t => t.date === todayDate && t.type === 'payment')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebt = students.reduce((acc, curr) => acc + (curr.balance > 0 ? curr.balance : 0), 0);
  const avgAttendance = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / students.length) 
    : 0;

  useEffect(() => {
    const fetchAiBrief = async () => {
      if (students.length > 0) {
        setIsAiLoading(true);
        const insight = await analyzeStudentPerformance(students);
        setAiInsight(insight);
        setIsAiLoading(false);
      }
    };
    fetchAiBrief();
  }, [students]);

  const chartData = groups.map(g => ({
    name: g.name.split('-')[0].trim(),
    طلاب: students.filter(s => s.groupIds.includes(g.id)).length,
    سعة: g.capacity
  }));

  // QR Attendance Handler
  const handleQRSearch = (code: string) => {
    setQrInput(code);
    const student = students.find(s => s.id.toLowerCase() === code.toLowerCase());
    setFoundStudent(student || null);
  };

  const processQuickAttendance = () => {
    if (foundStudent) {
      const today = new Date().toLocaleDateString('ar-EG');
      const alreadyMarked = attendance.find(r => r.studentId === foundStudent.id && r.date === today);
      
      if (alreadyMarked) {
        alert('هذا الطالب مسجل حضور بالفعل اليوم!');
        return;
      }

      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        studentId: foundStudent.id,
        groupId: foundStudent.groupIds[0] || 'unknown',
        date: today,
        status: 'present'
      };

      const updatedAttendance = [newRecord, ...attendance];
      setAttendance(updatedAttendance);
      
      // Update local student attendance rate for immediate feedback
      setStudents(students.map(s => {
        if (s.id === foundStudent.id) {
          const studentRecords = updatedAttendance.filter(r => r.studentId === s.id);
          const presentCount = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
          return { ...s, attendanceRate: Math.round((presentCount / studentRecords.length) * 100) };
        }
        return s;
      }));

      alert(`تم تحضير الطالب: ${foundStudent.name} بنجاح!`);
      setIsQRModalOpen(false);
      setQrInput('');
      setFoundStudent(null);
    }
  };

  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const currentDay = daysOfWeek[new Date().getDay()];
  const todaysSessions = groups.filter(g => g.schedule.some(s => s.day === currentDay));

  // Alerts logic
  const urgentAlerts = [
    ...(students.filter(s => s.balance > 250).length > 0 ? [{ id: 1, type: 'finance', msg: `هناك ${students.filter(s => s.balance > 250).length} طلاب لديهم مديونيات مرتفعة تحتاج تحصيل.` }] : []),
    ...(avgAttendance < 75 ? [{ id: 2, type: 'attendance', msg: "انخفاض ملحوظ في معدل حضور السنتر هذا الأسبوع." }] : []),
    { id: 3, type: 'schedule', msg: `لديك ${todaysSessions.length} حصص مجدولة لليوم.` }
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700 no-scrollbar">
      {/* Upper Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-500/20">
              <Activity size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">مركز الإدارة الذكي</h1>
              <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">مرحباً بك في لوحة تحكم EduCenter Pro</p>
            </div>
          </div>
          
          <p className="text-slate-600 font-medium text-lg max-w-2xl leading-relaxed">
            النظام يعمل بكفاءة. تدير حالياً <span className="text-blue-600 font-black">{students.length} طالب</span> في <span className="text-indigo-600 font-black">{groups.length} مجموعة</span>. 
            تأكد من متابعة جدول حصص اليوم والتنبيهات المالية.
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => setIsQRModalOpen(true)} className="px-8 py-4 bg-slate-950 text-white rounded-3xl font-black text-sm shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95">
              <QrCode size={20} className="text-blue-500" /> تسجيل حضور سريع (QR)
            </button>
            <button onClick={() => setActiveTab('students')} className="px-8 py-4 bg-blue-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95">
              <Plus size={20} /> إضافة طالب جديد
            </button>
            <button onClick={() => setActiveTab('finances')} className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-3xl font-black text-sm hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95">
              <Target size={20} className="text-blue-600" /> إدارة المالية
            </button>
          </div>
        </div>
        
        {/* AI Powered Insight Card */}
        <div className="lg:col-span-4 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white p-8 rounded-[3rem] border border-blue-50 shadow-xl flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Brain size={24} className={isAiLoading ? 'animate-spin' : ''} />
                  </div>
                  <span className="text-sm font-black text-slate-800">توصية المساعد الذكي</span>
                </div>
                <Sparkles className="text-amber-400" size={20} />
              </div>
              
              <div className="flex-1 min-h-[100px]">
                {isAiLoading ? (
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-100 rounded-full w-full animate-pulse"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-5/6 animate-pulse"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-4/6 animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-base font-bold text-slate-600 leading-relaxed italic">
                    "{aiInsight || "أضف مزيداً من الطلاب والمجموعات للحصول على رؤى تربوية ومالية مخصصة للسنتر."}"
                  </p>
                )}
              </div>
            </div>
            
            <button onClick={() => setActiveTab('ai-analysis')} className="mt-8 text-blue-600 text-[11px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-3 transition-all border-t border-slate-50 pt-4">
              عرض التحليل الأكاديمي الشامل <ArrowLeft size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'تحصيل اليوم', value: `${todayIncome.toLocaleString()} ج.م`, icon: <TrendingUp />, bg: 'bg-emerald-50 text-emerald-600', trend: 'مستقر', color: '#10b981' },
          { label: 'إجمالي الطلاب', value: students.length, icon: <Users />, bg: 'bg-blue-50 text-blue-600', trend: 'في ازدياد', color: '#3b82f6' },
          { label: 'متوسط الحضور', value: `${avgAttendance}%`, icon: <Zap />, bg: 'bg-amber-50 text-amber-600', trend: 'جيد جداً', color: '#f59e0b' },
          { label: 'مديونيات معلقة', value: `${totalDebt.toLocaleString()} ج.م`, icon: <AlertCircle />, bg: 'bg-rose-50 text-rose-600', trend: 'تحتاج تحصيل', color: '#f43f5e' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">{stat.trend}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            <div className="w-full h-1 bg-slate-50 rounded-full mt-6 overflow-hidden">
               <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: stat.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Occupancy Chart */}
        <div className="lg:col-span-8 bg-white p-8 lg:p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900">إشغال القاعات اليوم</h3>
              <p className="text-sm font-bold text-slate-400 mt-1">توزيع الطلاب المسجلين مقارنة بسعة القاعة المتاحة</p>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={() => { alert('جاري تجهيز تقرير الإشغال بصيغة PDF...'); }} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all active:scale-95"
              >
                <Download size={16} /> تصدير التقرير
              </button>
            </div>
          </div>
          <div className="h-[350px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700} } />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }} />
                <Bar dataKey="طلاب" radius={[12, 12, 12, 12]} barSize={45}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#6366f1'} />)}
                </Bar>
                <Bar dataKey="سعة" fill="#f1f5f9" radius={[12, 12, 12, 12]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Schedule & Notifications Section */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Schedule Section */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col flex-1">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 جدول اليوم <PlayCircle className="text-blue-600" size={24} />
               </h3>
               <span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">{currentDay}</span>
            </div>
            
            <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[400px]">
              {todaysSessions.length > 0 ? todaysSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="p-6 bg-slate-50 border border-transparent hover:border-blue-200 hover:bg-white rounded-[2.5rem] transition-all flex items-center gap-4 group cursor-pointer" 
                  onClick={() => setActiveTab('attendance')}
                >
                  <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                     <Clock size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900 line-clamp-1">{session.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      {session.schedule.find(s => s.day === currentDay)?.time} • {session.schedule.find(s => s.day === currentDay)?.room || 'قاعة غير محددة'}
                    </p>
                  </div>
                  <div className="p-3 bg-white text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronLeft size={20} />
                  </div>
                </div>
              )) : (
                <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
                   <CalendarIcon className="mx-auto text-slate-300 mb-4" size={40} />
                   <p className="text-slate-400 font-bold text-sm leading-relaxed">أهلاً يا دكتور، يبدو أنه لا توجد حصص مجدولة لهذا اليوم.</p>
                </div>
              )}
            </div>

            {/* Notifications Feed */}
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
               <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                 <BellRing size={18} className="text-rose-500" /> تنبيهات هامة
               </h4>
               <div className="space-y-3">
                  {urgentAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed flex gap-3 ${
                      alert.type === 'finance' ? 'bg-rose-50 border-rose-100 text-rose-700' : 
                      alert.type === 'attendance' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-blue-50 border-blue-100 text-blue-700'
                    }`}>
                      <AlertCircle size={16} className="shrink-0" />
                      {alert.msg}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Quick Attendance Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsQRModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <QrCode size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">التحضير السريع</h3>
                </div>
                <button onClick={() => setIsQRModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                  <X size={24} />
                </button>
             </div>

             <div className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">كود الطالب أو مسح الـ QR</label>
                   <div className="relative">
                      <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                      <input 
                        autoFocus
                        value={qrInput}
                        onChange={(e) => handleQRSearch(e.target.value)}
                        placeholder="أدخل كود الطالب يدوياً (مثال: s1)..." 
                        className="w-full pr-14 pl-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-blue-500 focus:bg-white outline-none font-black text-xl transition-all"
                      />
                   </div>
                </div>
                
                {foundStudent ? (
                  <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300">
                     <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-emerald-600 font-black text-2xl shadow-sm border border-emerald-50">
                          {foundStudent.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-lg font-black text-emerald-900">{foundStudent.name}</p>
                           <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1">كود الطالب: {foundStudent.id}</p>
                        </div>
                     </div>
                     <button onClick={processQuickAttendance} className="bg-emerald-600 text-white p-4 rounded-2xl hover:bg-emerald-700 transition-all active:scale-90 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 size={24} />
                     </button>
                  </div>
                ) : qrInput && (
                  <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] text-center flex flex-col items-center gap-3 animate-in fade-in">
                     <AlertCircle className="text-rose-500" size={32} />
                     <p className="text-rose-700 font-black text-sm">عذراً، لم يتم العثور على طالب بهذا الكود في السنتر.</p>
                  </div>
                )}
                
                <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">EduCenter Pro QR Scanning Engine v1.0</p>
             </div>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/20">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white text-slate-400 rounded-2xl shadow-sm"><History className="w-6 h-6" /></div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">آخر التحركات المالية</h3>
          </div>
          <button onClick={() => setActiveTab('finances')} className="text-blue-600 text-sm font-black hover:bg-blue-50 px-6 py-3 rounded-2xl transition-all border border-blue-100 active:scale-95">
            عرض السجل الكامل
          </button>
        </div>
        <div className="p-4">
          {transactions.length > 0 ? transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center justify-between p-8 hover:bg-slate-50 rounded-[2.5rem] transition-all group">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-inner transition-transform group-hover:scale-110 ${t.type === 'payment' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {t.type === 'payment' ? '+$' : '-$'}
                </div>
                <div>
                  <p className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">{t.studentName}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{t.note || 'عملية مجمعة'}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[10px] font-black text-slate-400">{t.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <p className={`text-xl font-black tracking-tight ${t.type === 'payment' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'payment' ? '+' : '-'}{t.amount.toLocaleString()} ج.م
                </p>
                <div className={`mt-2 flex items-center justify-end gap-1 text-[10px] font-black uppercase ${t.type === 'payment' ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {t.type === 'payment' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                   {t.type === 'payment' ? 'تم التحصيل' : 'مديونية'}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <CalendarIcon size={48} />
              </div>
              <p className="text-slate-400 font-black text-lg">لا توجد حركات مالية مسجلة لهذا اليوم بعد.</p>
              <button onClick={() => setActiveTab('finances')} className="mt-4 text-blue-600 font-bold text-sm">تسجيل معاملة يدوية</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper components for consistency
const History = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
const TrendingDown = ({ size }: { size: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>;

export default Dashboard;
