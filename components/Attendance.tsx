
import React, { useState, useEffect } from 'react';
import { Group, Student, AttendanceRecord } from '../types';
// Import School icon which was missing and causing a reference error
import { UserCheck, Search, Calendar, ChevronLeft, Check, X, Clock, QrCode, User, School } from 'lucide-react';

interface Props {
  students: Student[];
  groups: Group[];
  attendance: AttendanceRecord[];
  setAttendance: (a: AttendanceRecord[]) => void;
  setStudents: (s: Student[]) => void;
}

const Attendance: React.FC<Props> = ({ students, groups, attendance, setAttendance, setStudents }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [search, setSearch] = useState('');
  const [codeSearch, setCodeSearch] = useState('');

  const groupStudents = students.filter(s => s.groupIds.includes(selectedGroup));
  const filteredStudents = groupStudents.filter(s => 
    (s.name.includes(search)) && 
    (codeSearch === '' || s.id.toLowerCase().includes(codeSearch.toLowerCase()))
  );

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const today = new Date().toLocaleDateString('ar-EG');
    
    // Prevent duplicate marking for same day/group
    const alreadyMarked = attendance.find(r => r.studentId === studentId && r.date === today && r.groupId === selectedGroup);
    if (alreadyMarked) {
      alert('هذا الطالب مسجل بالفعل في كشف حضور اليوم لهذه المجموعة.');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      groupId: selectedGroup,
      date: today,
      status
    };

    const updatedAttendance = [newRecord, ...attendance];
    setAttendance(updatedAttendance);
    
    // Update student attendance rate calculation
    setStudents(students.map(s => {
      if (s.id === studentId) {
        const studentRecords = updatedAttendance.filter(r => r.studentId === studentId);
        const presentCount = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
        const rate = Math.round((presentCount / studentRecords.length) * 100);
        return { ...s, attendanceRate: rate };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Selection & Filters Header */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Group Selector */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">المجموعة الدراسية</label>
            <div className="relative">
              <School className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
              <select 
                value={selectedGroup}
                onChange={e => { setSelectedGroup(e.target.value); setCodeSearch(''); setSearch(''); }}
                className="w-full pr-12 pl-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent font-black outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
              >
                <option value="">-- اختر مجموعة --</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>
          
          {/* Name Search */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">بحث بالاسم</label>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="اسم الطالب..."
                className="w-full pr-12 pl-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Code / QR Search */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">كود الطالب / QR</label>
            <div className="relative">
              <QrCode className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              <input 
                value={codeSearch}
                onChange={e => setCodeSearch(e.target.value)}
                placeholder="أدخل الكود (e.g. s1)..."
                className="w-full pr-12 pl-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent font-black text-blue-600 outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {!selectedGroup ? (
        <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="text-slate-200" size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-400">يرجى اختيار مجموعة دراسية أولاً</h3>
          <p className="text-slate-300 font-bold mt-4 max-w-sm mx-auto leading-relaxed">
            يمكنك بعد ذلك تسجيل الحضور يدوياً أو استخدام كود الـ QR للوصول السريع لملف الطالب.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm animate-in slide-in-from-bottom-8 duration-500">
          <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">كشف حضور: {groups.find(g => g.id === selectedGroup)?.name}</h3>
              <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {new Date().toLocaleDateString('ar-EG')}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span>{groupStudents.length} طالب مسجل</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="px-8 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase">حاضر</span>
                <span className="text-xl font-black">{attendance.filter(r => r.groupId === selectedGroup && r.date === new Date().toLocaleDateString('ar-EG') && (r.status === 'present' || r.status === 'late')).length}</span>
              </div>
              <div className="px-8 py-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase">غائب</span>
                <span className="text-xl font-black">{attendance.filter(r => r.groupId === selectedGroup && r.date === new Date().toLocaleDateString('ar-EG') && r.status === 'absent').length}</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-slate-50">
            {filteredStudents.length > 0 ? filteredStudents.map(student => {
              const record = attendance.find(r => r.studentId === student.id && r.date === new Date().toLocaleDateString('ar-EG'));
              const isSearchingCode = codeSearch !== '' && student.id.toLowerCase() === codeSearch.toLowerCase();

              return (
                <div key={student.id} className={`p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50/50 transition-all ${isSearchingCode ? 'bg-blue-50/80 border-r-8 border-blue-600 shadow-inner' : ''}`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-sm transition-transform ${isSearchingCode ? 'bg-blue-600 text-white animate-bounce' : 'bg-white border border-slate-100 text-slate-400'}`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-black text-slate-900 leading-tight">{student.name}</p>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${isSearchingCode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>ID: {student.id}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5"><User size={12} /> {student.phone}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className={`text-[11px] font-black flex items-center gap-1.5 ${student.attendanceRate > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          <TrendingUp size={12} /> التزام {student.attendanceRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {record ? (
                      <div className={`px-8 py-5 rounded-3xl font-black text-sm flex items-center gap-3 shadow-sm animate-in zoom-in-95 duration-300 ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 
                        record.status === 'late' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {record.status === 'present' ? <CheckCircle2 size={20}/> : record.status === 'late' ? <Clock size={20}/> : <X size={20}/>}
                        <span className="tracking-tight">تم تسجيل الـ {record.status === 'present' ? 'حضور' : record.status === 'late' ? 'تأخير' : 'غياب'} بنجاح</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => markAttendance(student.id, 'present')} 
                          className="group p-5 bg-white border border-slate-100 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 min-w-[70px] active:scale-90"
                        >
                          <Check size={24} />
                          <span className="text-[8px] font-black uppercase tracking-widest">حاضر</span>
                        </button>
                        <button 
                          onClick={() => markAttendance(student.id, 'late')} 
                          className="group p-5 bg-white border border-slate-100 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 min-w-[70px] active:scale-90"
                        >
                          <Clock size={24} />
                          <span className="text-[8px] font-black uppercase tracking-widest">تأخير</span>
                        </button>
                        <button 
                          onClick={() => markAttendance(student.id, 'absent')} 
                          className="group p-5 bg-white border border-slate-100 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 min-w-[70px] active:scale-90"
                        >
                          <X size={24} />
                          <span className="text-[8px] font-black uppercase tracking-widest">غائب</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="py-24 text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-slate-200" size={32} />
                 </div>
                 <p className="text-slate-400 font-bold text-lg">
                   {groupStudents.length > 0 ? 'لا توجد نتائج مطابقة لبيانات البحث الحالية.' : 'لا يوجد طلاب مسجلين في هذه المجموعة حتى الآن.'}
                 </p>
                 {groupStudents.length === 0 && (
                   <button className="mt-4 text-blue-600 font-black text-sm hover:underline">إضافة طلاب لهذه المجموعة</button>
                 )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Internal icon helpers for standalone component feel
const CheckCircle2 = ({ size, className }: { size: number, className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const TrendingUp = ({ size, className }: { size: number, className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

export default Attendance;
