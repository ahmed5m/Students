
import React, { useState } from 'react';
import { analyzeStudentPerformance } from '../services/geminiService';
import { MOCK_STUDENTS, ICONS } from '../constants';
import { Sparkles, Brain, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

const AIAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeStudentPerformance(MOCK_STUDENTS);
    setAnalysis(result || "فشل التحليل.");
    setLoading(false);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Hero AI Section */}
      <div className="relative p-10 lg:p-16 rounded-[3rem] overflow-hidden bg-slate-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shadow-inner border border-white/20">
            <Sparkles className="text-blue-400 w-10 h-10 animate-pulse" />
          </div>
          <div className="max-w-2xl space-y-4">
            <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight">مساعدك التربوي الذكي</h3>
            <p className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed">
              استخدم قوة الذكاء الاصطناعي لتحويل بيانات طلابك إلى رؤى وقرارات تربوية حكيمة في ثوانٍ.
            </p>
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="group relative bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-bold text-lg hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50 shadow-2xl shadow-blue-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : <Brain size={24} />}
            {loading ? 'جاري تحليل البيانات...' : 'ابدأ التحليل الآن'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
          <div className="flex items-center justify-between border-b border-slate-50 pb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Brain size={28} />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-slate-900">تقرير الأداء التحليلي</h4>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">توليد بواسطة GEMINI AI</p>
              </div>
            </div>
            <div className="hidden sm:flex bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold items-center gap-2">
              <CheckCircle2 size={16} /> البيانات محدثة
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {analysis.split('\n\n').map((section, idx) => {
                const isWarning = section.includes('تنبيه') || section.includes('متابعة');
                const isLight = section.includes('نصيحة') || section.includes('تحسين');
                
                return (
                  <div key={idx} className={`p-6 rounded-[2rem] ${isWarning ? 'bg-rose-50 border border-rose-100' : isLight ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-xl mt-1 ${isWarning ? 'text-rose-500' : isLight ? 'text-amber-500' : 'text-blue-500'}`}>
                        {isWarning ? <AlertTriangle size={20} /> : isLight ? <Lightbulb size={20} /> : <CheckCircle2 size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{section.trim()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Sparkles className="text-blue-500" />, title: "توقع النتائج", desc: "تنبؤ دقيق بأداء الطلاب في الامتحانات النهائية بناءً على المعطيات." },
          { icon: <Brain className="text-indigo-500" />, title: "تخصيص المتابعة", desc: "تحديد دقيق للطلاب الذين يحتاجون لمتابعة خاصة فورية." },
          { icon: <Lightbulb className="text-amber-500" />, title: "استراتيجيات نمو", desc: "نصائح عملية لزيادة إنتاجية السناتر وتحسين تجربة الطالب." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-5">{item.icon}</div>
            <h5 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h5>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAnalysis;
