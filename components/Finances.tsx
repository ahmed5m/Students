
import React, { useState } from 'react';
import { Transaction, Student } from '../types';
import { ICONS } from '../constants';
import { 
  Plus, Download, TrendingUp, TrendingDown, Wallet, 
  Calendar, Search, Filter, ArrowUpRight, ArrowDownRight,
  FileText, CreditCard, User, X, Save, PieChart as PieChartIcon,
  BarChart as BarChartIcon, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, Legend
} from 'recharts';

interface Props {
  transactions: Transaction[];
  students: Student[];
  setTransactions: (t: Transaction[]) => void;
  setStudents: (s: Student[]) => void;
}

const Finances: React.FC<Props> = ({ transactions, students, setTransactions, setStudents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    amount: 0,
    type: 'payment',
    note: '',
    studentId: '',
    date: new Date().toLocaleDateString('ar-EG')
  });

  // Basic stats
  const totalIncome = transactions.filter(t => t.type === 'payment').reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebt = students.reduce((acc, curr) => acc + (curr.balance > 0 ? curr.balance : 0), 0);
  const collectedThisMonth = transactions
    .filter(t => t.type === 'payment')
    .reduce((acc, curr) => acc + curr.amount, 0); // Simplified for mock; would filter by date month normally

  // Chart data preparation (Mocking monthly distribution based on dates if available)
  // Since mock data might not have many months, we'll create a trend view
  const monthlyData = [
    { month: 'سبتمبر', دخل: 4500, ديون: 1200 },
    { month: 'أكتوبر', دخل: 5200, ديون: 800 },
    { month: 'نوفمبر', دخل: 4800, ديون: 1500 },
    { month: 'ديسمبر', دخل: 6100, ديون: 400 },
    { month: 'يناير', دخل: totalIncome, ديون: totalDebt },
  ];

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.studentId || !newTx.amount) return;

    const student = students.find(s => s.id === newTx.studentId);
    if (!student) return;

    const transaction: Transaction = {
      id: 't' + Math.random().toString(36).substr(2, 5),
      studentId: student.id,
      studentName: student.name,
      amount: Number(newTx.amount),
      type: newTx.type as 'payment' | 'debt',
      date: new Date().toLocaleDateString('ar-EG'),
      note: newTx.note || ''
    };

    setTransactions([transaction, ...transactions]);

    // Update student balance
    setStudents(students.map(s => {
      if (s.id === student.id) {
        const adjustment = transaction.type === 'payment' ? -transaction.amount : transaction.amount;
        return { ...s, balance: Math.max(0, s.balance + adjustment), status: (s.balance + adjustment) > 0 ? 'debtor' : 'active' };
      }
      return s;
    }));

    setIsModalOpen(false);
    setNewTx({ amount: 0, type: 'payment', note: '', studentId: '', date: new Date().toLocaleDateString('ar-EG') });
  };

  const filteredTransactions = transactions.filter(t => 
    t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 no-scrollbar">
      {/* Header & Main Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
             التحليلات المالية <Wallet className="text-blue-600" />
          </h2>
          <p className="text-slate-400 font-bold mt-1 text-sm uppercase tracking-widest">إدارة التحصيل، الديون، وتدفقات السيولة</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { alert('جاري تصدير التقرير المالي المفصل...'); }}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-3xl font-black text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Download size={18} /> تصدير Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={20} /> تسجيل معاملة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي المحصل', value: totalIncome, icon: <TrendingUp />, color: 'emerald', bg: 'bg-emerald-50 text-emerald-600', trend: '+12%' },
          { label: 'مديونيات الطلاب', value: totalDebt, icon: <TrendingDown />, color: 'rose', bg: 'bg-rose-50 text-rose-600', trend: '-5%' },
          { label: 'تحصيل متوقع', value: totalIncome + totalDebt, icon: <Activity />, color: 'blue', bg: 'bg-blue-50 text-blue-600', trend: 'مستهدف' },
          { label: 'صافي التدفق', value: totalIncome - 500, icon: <Wallet />, color: 'indigo', bg: 'bg-indigo-50 text-indigo-600', trend: 'بعد المصاريف' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-5">
              <div className={`p-4 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value.toLocaleString()} <span className="text-sm font-bold">ج.م</span></p>
          </div>
        ))}
      </div>

      {/* Advanced Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Income Trends Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">تطور التدفق المالي <BarChartIcon size={24} className="text-blue-600" /></h3>
              <p className="text-sm font-bold text-slate-400 mt-1">مقارنة بين التحصيل الفعلي والديون المسجلة شهرياً</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                 <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span> الدخل
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                 <span className="w-2.5 h-2.5 bg-slate-100 rounded-full"></span> الديون
               </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="دخل" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="ديون" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Payment Health */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">توجهات الطلاب <PieChartIcon size={20} className="text-indigo-600" /></h3>
          <div className="space-y-6 flex-1">
             <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">طلاب بمديونيات مرتفعة (>200)</p>
                <div className="flex items-center justify-between">
                   <span className="text-2xl font-black text-rose-600">{students.filter(s => s.balance > 200).length} طالب</span>
                   <button className="text-blue-600 p-2 hover:bg-white rounded-xl transition-all"><ArrowUpRight size={20}/></button>
                </div>
             </div>
             <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem]">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">نسبة التحصيل الشهري</p>
                <div className="flex items-center justify-between">
                   <span className="text-2xl font-black text-indigo-700">84%</span>
                   <div className="w-16 h-16 relative">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="32" cy="32" r="28" fill="transparent" stroke="#e0e7ff" strokeWidth="6" />
                         <circle cx="32" cy="32" r="28" fill="transparent" stroke="#4f46e5" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="28" />
                      </svg>
                   </div>
                </div>
             </div>
             <div className="mt-auto space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mr-2">أكثر الطلاب التزاماً</h4>
                <div className="flex -space-x-3 space-x-reverse">
                   {students.slice(0, 5).map((s, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-blue-600" title={s.name}>
                        {s.name.charAt(0)}
                      </div>
                   ))}
                   <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">+12</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white text-slate-900 rounded-2xl shadow-sm border border-slate-100"><FileText /></div>
              <h3 className="text-2xl font-black text-slate-900">سجل المعاملات</h3>
           </div>
           
           <div className="flex gap-4 flex-1 max-w-lg">
              <div className="relative flex-1">
                 <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث باسم الطالب أو الملاحظة..." 
                  className="w-full pr-12 pl-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                 />
              </div>
              <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all"><Filter size={20} /></button>
           </div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-right min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">المعاملة / الطالب</th>
                <th className="px-10 py-6">المبلغ</th>
                <th className="px-10 py-6">الحالة</th>
                <th className="px-10 py-6">التاريخ</th>
                <th className="px-10 py-6">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${t.type === 'payment' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {t.type === 'payment' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                       </div>
                       <div>
                          <p className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">{t.studentName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">كود الطالب: {t.studentId}</p>
                       </div>
                    </div>
                  </td>
                  <td className={`px-10 py-7 text-xl font-black ${t.type === 'payment' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'payment' ? '+' : '-'}{t.amount.toLocaleString()} <span className="text-xs">ج.م</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${t.type === 'payment' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.type === 'payment' ? 'تحصيل نقدي' : 'مديونية مسجلة'}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-sm font-bold text-slate-400">{t.date}</td>
                  <td className="px-10 py-7">
                    <p className="text-sm font-bold text-slate-600 max-w-[200px] truncate" title={t.note}>{t.note || 'اشتراك الحصة / الشهر'}</p>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <CreditCard className="text-slate-100" size={64} />
                         <p className="text-slate-400 font-bold text-lg">لا توجد سجلات مالية مطابقة للبحث حالياً.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <form 
            onSubmit={handleRecordTransaction}
            className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <CreditCard className="text-blue-600" /> تسجيل معاملة جديدة
               </h3>
               <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-slate-900 transition-all">
                 <X size={24} />
               </button>
            </div>

            <div className="p-10 space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">اختيار الطالب</label>
                  <div className="relative">
                     <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                     <select 
                      required
                      value={newTx.studentId}
                      onChange={e => setNewTx({...newTx, studentId: e.target.value})}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold appearance-none"
                     >
                        <option value="">-- اختر من القائمة --</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">المبلغ (ج.م)</label>
                     <input 
                      required
                      type="number"
                      value={newTx.amount}
                      onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-lg outline-none focus:border-blue-500"
                      placeholder="0"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">نوع المعاملة</label>
                     <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                        <button 
                          type="button"
                          onClick={() => setNewTx({...newTx, type: 'payment'})}
                          className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${newTx.type === 'payment' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}
                        >تحصيل</button>
                        <button 
                          type="button"
                          onClick={() => setNewTx({...newTx, type: 'debt'})}
                          className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${newTx.type === 'debt' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400'}`}
                        >مديونية</button>
                     </div>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">ملاحظات / وصف</label>
                  <textarea 
                    value={newTx.note}
                    onChange={e => setNewTx({...newTx, note: e.target.value})}
                    placeholder="مثال: اشتراك شهر يناير، دفعة تحت الحساب..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 min-h-[100px]"
                  />
               </div>
               
               <button 
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
               >
                  <Save size={20} /> تأكيد وتسجيل المعاملة
               </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Finances;
