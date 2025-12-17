
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStudentPerformance = async (students: any[]) => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    بصفتك مستشاراً إدارياً وتربوياً ذكياً لخبير تعليمي، قم بتحليل البيانات التالية لطلاب السنتر:
    البيانات المتاحة: ${JSON.stringify(students.map(s => ({id: s.id, name: s.name, balance: s.balance, attendance: s.attendanceRate})))}
    
    المطلوب:
    قدم نصيحة واحدة أو تنبيهاً واحداً (جملة أو جملتين كحد أقصى) يكون مركزاً جداً وعملياً.
    يجب أن تذكر كود الطالب (ID) في النصيحة إذا كنت تشير لحالة طالب محددة (مثلاً: "الطالب كود s1 يحتاج لمتابعة فورية بسبب تراجع الحضور").
    ركز على تحسين التحصيل المالي أو الالتزام التربوي.
    
    اجعل الرد باللغة العربية بأسلوب مشجع واحترافي. لا تستخدم قوائم أو نقاط، فقط نص مباشر ومركز.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 250,
        temperature: 0.7
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    return "نظامك يعمل بشكل جيد. استمر في متابعة الطلاب ذوي المديونيات العالية لتحسين التدفق المالي للسنتر.";
  }
};
