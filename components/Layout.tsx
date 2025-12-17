
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Tab } from '../types';
import { Menu, X, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: ICONS.Dashboard },
    { id: 'attendance', label: 'التحضير', icon: ICONS.Attendance },
    { id: 'groups', label: 'المجموعات', icon: ICONS.Groups },
    { id: 'students', label: 'الطلاب', icon: ICONS.Students },
    { id: 'finances', label: 'المالية', icon: ICONS.Finances },
    { id: 'ai-analysis', label: 'الذكاء الاصطناعي', icon: ICONS.AI },
    { id: 'settings', label: 'الإعدادات', icon: ICONS.Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['IBM_Plex_Sans_Arabic']">
      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50 px-2 h-20 flex items-center justify-around shadow-2xl">
        {menuItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-black">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-80 bg-slate-950 text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-black text-2xl">E</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-white">EduCenter <span className="text-blue-500">Pro</span></h1>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">نظام الإدارة الشامل</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2 no-scrollbar overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 group ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-500 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                  {item.icon}
                </span>
                <span className="font-bold text-sm">{item.label}</span>
                {activeTab === item.id && <div className="mr-auto w-1.5 h-6 bg-white rounded-full"></div>}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-900">
            <div className="bg-slate-900/50 p-4 rounded-[1.5rem] border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl shadow-inner">م</div>
                <div>
                  <p className="text-sm font-black text-white">أ/ محمد علي</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">مدرس فيزياء خبير</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-12 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 text-slate-500 hover:bg-slate-100 rounded-2xl">
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-900 hidden sm:block">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-3.5 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">
              <Bell size={24} />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 pb-32 lg:pb-12 bg-slate-50/30">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
