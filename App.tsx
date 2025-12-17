
import React, { useState, useEffect } from 'react';
import { Tab, Student, Group, Transaction, AttendanceRecord } from './types';
import { MOCK_STUDENTS, MOCK_GROUPS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import GroupManagement from './components/GroupManagement';
import AIAnalysis from './components/AIAnalysis';
import Finances from './components/Finances';
import Attendance from './components/Attendance';
import { Settings as SettingsIcon, ShieldCheck, QrCode, CreditCard, RefreshCcw, BellRing } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Data Persistence Logic
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ecp_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('ecp_groups');
    return saved ? JSON.parse(saved) : MOCK_GROUPS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ecp_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('ecp_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecp_students', JSON.stringify(students));
    localStorage.setItem('ecp_groups', JSON.stringify(groups));
    localStorage.setItem('ecp_transactions', JSON.stringify(transactions));
    localStorage.setItem('ecp_attendance', JSON.stringify(attendance));
  }, [students, groups, transactions, attendance]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            students={students} 
            groups={groups} 
            transactions={transactions} 
            attendance={attendance} 
            setActiveTab={setActiveTab}
            setAttendance={setAttendance}
            setStudents={setStudents}
          />
        );
      case 'groups':
        return <GroupManagement groups={groups} setGroups={setGroups} students={students} />;
      case 'students':
        return <StudentManagement students={students} setStudents={setStudents} groups={groups} setTransactions={setTransactions} />;
      case 'attendance':
        return <Attendance students={students} groups={groups} attendance={attendance} setAttendance={setAttendance} setStudents={setStudents} />;
      case 'finances':
        return <Finances transactions={transactions} students={students} setTransactions={setTransactions} setStudents={setStudents} />;
      case 'ai-analysis':
        return <AIAnalysis students={students} />;
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
               <div className="flex items-center gap-4 mb-10">
                 <div className="p-4 bg-slate-100 text-slate-900 rounded-[1.5rem]">
                   <SettingsIcon size={28} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-slate-900">تخصيص النظام</h3>
                    <p className="text-slate-400 font-bold mt-1 tracking-tight uppercase text-xs">إعدادات الحساب والمركز التعليمي</p>
                 </div>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                  { label: 'تنبيهات الواتساب التلقائية', desc: 'إرسال رسائل غياب فورية لولي الأمر.', icon: <BellRing className="text-blue-500" />, enabled: true },
                  { label: 'نظام الـ QR Code للطلاب', desc: 'تفعيل مسح الأكواد لتسجيل الحضور السريع.', icon: <QrCode className="text-indigo-500" />, enabled: true },
                  { label: 'بوابة الدفع الإلكتروني', desc: 'قبول المدفوعات عبر المحافظ الإلكترونية.', icon: <CreditCard className="text-emerald-500" />, enabled: false },
                  { label: 'تشفير بيانات الطلاب', desc: 'تأمين الملفات الشخصية بأعلى معايير الحماية.', icon: <ShieldCheck className="text-purple-500" />, enabled: true }
                ].map((pref, i) => (
                  <div key={i} className="flex items-start justify-between p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">{pref.icon}</div>
                      <div>
                        <p className="font-black text-slate-800 text-sm mb-1">{pref.label}</p>
                        <p className="text-[10px] font-bold text-slate-400 leading-tight">{pref.desc}</p>
                      </div>
                    </div>
                    <button className={`w-12 h-7 rounded-full relative transition-all shrink-0 ${pref.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${pref.enabled ? 'right-6' : 'right-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-slate-50">
                 <div className="flex items-center justify-between p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                    <div className="flex gap-4 items-center">
                       <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm"><RefreshCcw size={24} /></div>
                       <div>
                          <p className="font-black text-rose-900 text-sm">تصفير بيانات السنتر</p>
                          <p className="text-xs font-bold text-rose-600/70">سيتم مسح كافة الطلاب والمجموعات والماليات بشكل نهائي.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => { if(confirm('تحذير: هذا الإجراء سيمسح كل البيانات. هل أنت متأكد؟')) { localStorage.clear(); window.location.reload(); } }} 
                      className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-xs hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                    >
                      بدء سنتر جديد
                    </button>
                 </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard 
            students={students} 
            groups={groups} 
            transactions={transactions} 
            attendance={attendance} 
            setActiveTab={setActiveTab}
            setAttendance={setAttendance}
            setStudents={setStudents}
          />
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
