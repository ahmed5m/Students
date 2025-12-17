
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Group, Student } from '../types';
import { MoreVertical, Users, MapPin, CreditCard, Plus, X, Save, Trash2, Edit } from 'lucide-react';

interface Props {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  students: Student[];
}

const GroupManagement: React.FC<Props> = ({ groups, setGroups, students }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState<Partial<Group>>({
    name: '', subject: '', grade: '', type: 'hybrid', pricingType: 'monthly',
    price: 0, capacity: 50, status: 'open', schedule: [{ day: 'السبت', time: '04:00 م' }]
  });

  const handleOpenAdd = () => {
    setEditingGroup(null);
    setFormData({
      name: '', subject: '', grade: '', type: 'hybrid', pricingType: 'monthly',
      price: 0, capacity: 50, status: 'open', schedule: [{ day: 'السبت', time: '04:00 م' }]
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData(group);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل تريد حذف هذه المجموعة؟ سيتم فك ارتباط الطلاب بها.')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...formData } as Group : g));
    } else {
      const newGroup = {
        ...formData,
        id: 'g' + Math.random().toString(36).substr(2, 5),
        currentCount: 0
      } as Group;
      setGroups([...groups, newGroup]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 relative group">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {ICONS.Search}
          </span>
          <input 
            type="text" 
            placeholder="البحث عن مجموعة..." 
            className="w-full pr-12 pl-6 py-4 bg-white border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all font-medium text-sm"
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> مجموعة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const groupStudentsCount = students.filter(s => s.groupIds.includes(group.id)).length;
          return (
            <div key={group.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl ${
                    group.type === 'hybrid' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {group.type === 'online' ? ICONS.Recording : ICONS.Groups}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenEdit(group)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(group.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{group.name}</h4>
                  <p className="text-sm font-bold text-slate-400">{group.grade}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">الموعد</p>
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                      {ICONS.Calendar} {group.schedule[0]?.day || 'غير محدد'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">السعر</p>
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                      <CreditCard size={16} className="text-emerald-500" /> {group.price} ج.م
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">الإشغال</span>
                    <span className="text-slate-900">{groupStudentsCount} / {group.capacity} طالب</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (groupStudentsCount/group.capacity) > 0.9 ? 'bg-rose-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(groupStudentsCount / group.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden p-10 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-slate-900">{editingGroup ? 'تعديل المجموعة' : 'مجموعة جديدة'}</h3>
              <button type="button" onClick={() => setIsFormOpen(false)}><X /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="اسم المجموعة" className="px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" />
              <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="المادة" className="px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" />
              <input required value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} placeholder="المرحلة الدراسية" className="px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" />
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} placeholder="السعر" className="px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" />
              <input required type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} placeholder="السعة القصوى" className="px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" />
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold">
                <option value="in-person">حضوري</option>
                <option value="online">أونلاين</option>
                <option value="hybrid">هجين</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              <Save size={20} /> حفظ المجموعة
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
