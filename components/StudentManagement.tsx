
import React, { useState } from 'react';
import { MOCK_STUDENTS, ICONS } from '../constants';
import { Student, StudentContact, CustomField } from '../types';
import { 
  MoreHorizontal, Mail, Phone, ExternalLink, X, 
  MessageSquare, User, Info, CreditCard, History,
  ShieldCheck, AlertCircle, FileText, UserPlus,
  UserCheck, TrendingUp, Trash2, Save, CheckCircle
} from 'lucide-react';

const StudentManagement: React.FC = () => {
  // --- States ---
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    phone: '',
    parentPhone: '',
    status: 'active',
    balance: 0,
    notes: '',
    groupIds: [],
    contacts: [],
    customFields: []
  });

  // --- Helpers ---
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.includes(searchTerm) || s.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">نشط</span>;
      case 'suspended': return <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">موقوف</span>;
      case 'debtor': return <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100">مديون</span>;
      default: return null;
    }
  };

  // --- CRUD Operations ---
  const handleOpenAddForm = () => {
    setFormMode('add');
    setFormData({
      name: '', phone: '', parentPhone: '', status: 'active', balance: 0, notes: '',
      groupIds: [], contacts: [], customFields: [], joinDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100, grade: 0, qrCode: 'QR_' + Math.random().toString(36).substr(2, 9)
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (student: Student) => {
    setFormMode('edit');
    setFormData(student);
    setIsFormOpen(true);
    setSelectedStudent(null); // Close details drawer
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب نهائياً؟ لا يمكن التراجع عن هذه الخطوة.')) {
      setStudents(students.filter(s => s.id !== id));
      setSelectedStudent(null);
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'add') {
      const newStudent = {
        ...formData,
        id: 's' + (students.length + 1),
      } as Student;
      setStudents([newStudent, ...students]);
    } else {
      setStudents(students.map(s => s.id === formData.id ? (formData as Student) : s));
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8 relative">
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 group">
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
              {ICONS.Search}
            </span>
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو الرقم..." 
              className="w-full pr-12 pl-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="all">كل الحالات</option>
            <option value="active">النشطين</option>
            <option value="debtor">المديونين</option>
            <option value="suspended">الموقوفين</option>
          </select>
        </div>
        
        <button 
          onClick={handleOpenAddForm}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-[1.5rem] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
        >
          <UserPlus size={20} />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-right min-w-[800px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الطالب</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الالتزام</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المستوى</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحساب</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedStudent(student)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center font-black text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-bold tracking-tight">{student.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-emerald-500`} style={{ width: `${student.attendanceRate || 0}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-emerald-600">{student.attendanceRate || 0}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-blue-600">{student.grade || 0}%</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-sm font-black ${student.balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {student.balance > 0 ? `${student.balance} ج.م` : 'خالص'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button className="p-2.5 text-slate-400 hover:text-blue-600 transition-all">{ICONS.WhatsApp}</button>
                      <button onClick={() => handleOpenEditForm(student)} className="p-2.5 text-slate-400 hover:text-amber-600 transition-all"><ExternalLink size={18} /></button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="p-2.5 text-slate-400 hover:text-rose-600 transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center text-slate-300">
                      <User size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-black">لا يوجد طلاب مطابقين للبحث</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Form Modal (Add/Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsFormOpen(false)}></div>
          <form 
            onSubmit={handleSaveStudent}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900">
                {formMode === 'add' ? 'إضافة طالب جديد' : 'تعديل بيانات الطالب'}
              </h3>
              <button type="button" onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">اسم الطالب رباعي</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold" 
                    placeholder="مثال: أحمد محمد علي حسن"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">رقم الموبايل</label>
                  <input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold" 
                    placeholder="01xxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">رقم ولي الأمر</label>
                  <input 
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                    type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold" 
                    placeholder="01xxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">الحالة الدراسية</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold"
                  >
                    <option value="active">نشط</option>
                    <option value="debtor">مديون</option>
                    <option value="suspended">موقف</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">المديونية (ج.م)</label>
                  <input 
                    value={formData.balance}
                    onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})}
                    type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold" 
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">ملاحظات إضافية</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold min-h-[100px]"
                  placeholder="أي ملاحظات حول الطالب..."
                ></textarea>
              </div>
            </div>

            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                type="submit"
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {formMode === 'add' ? 'إضافة الطالب للقاعدة' : 'حفظ التغييرات'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black hover:bg-slate-50 transition-all"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Student Details Drawer/Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedStudent(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-left-0 duration-300">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                  <X size={24} className="text-slate-400" />
                </button>
                <h3 className="text-xl font-black text-slate-900">ملف الطالب التفصيلي</h3>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all">{ICONS.WhatsApp}</button>
                <button 
                  onClick={() => handleOpenEditForm(selectedStudent)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20"
                >تعديل البيانات</button>
              </div>
            </div>

            <div className="p-8 space-y-10">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl text-white font-black shadow-2xl">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedStudent.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {getStatusBadge(selectedStudent.status)}
                    <span className="text-xs font-bold text-slate-400">انضم في {selectedStudent.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'نسبة الحضور', value: `${selectedStudent.attendanceRate || 0}%`, icon: <UserCheck size={18} />, color: 'emerald' },
                  { label: 'المعدل الأكاديمي', value: `${selectedStudent.grade || 0}%`, icon: <TrendingUp size={18} />, color: 'blue' },
                  { label: 'الحالة المالية', value: selectedStudent.balance > 0 ? `${selectedStudent.balance} ج.م` : 'خالص', icon: <CreditCard size={18} />, color: selectedStudent.balance > 0 ? 'rose' : 'slate' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                    <div className={`text-${stat.color}-600 mb-2`}>{stat.icon}</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-lg font-black text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Info Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contacts */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-50 pb-2">
                    <Phone size={16} className="text-blue-500" /> جهات الاتصال
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-400">رقم الطالب</p>
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.phone}</p>
                      </div>
                      <button className="text-blue-600">{ICONS.WhatsApp}</button>
                    </div>
                    {selectedStudent.contacts && selectedStudent.contacts.map((contact, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-400">{contact.relation}: {contact.name}</p>
                          <p className="text-sm font-bold text-slate-700">{contact.phone}</p>
                        </div>
                        <button className="text-blue-600">{ICONS.WhatsApp}</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Fields */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-50 pb-2">
                    <Info size={16} className="text-amber-500" /> معلومات إضافية
                  </h4>
                  <div className="space-y-3">
                    {selectedStudent.customFields && selectedStudent.customFields.map((field, i) => (
                      <div key={i} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400">{field.label}</span>
                        <span className="text-sm font-bold text-slate-700">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-50 pb-2">
                  <FileText size={16} className="text-indigo-500" /> ملاحظات المدرس
                </h4>
                <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                    "{selectedStudent.notes || 'لا توجد ملاحظات حالياً.'}"
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleDeleteStudent(selectedStudent.id)}
                  className="flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm border border-rose-100 hover:bg-rose-100 transition-all"
                >
                  <Trash2 size={18} /> حذف الطالب
                </button>
                <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                  <History size={18} /> سجل الحضور الكامل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
