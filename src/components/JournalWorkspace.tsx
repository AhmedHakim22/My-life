import React, { useState } from 'react';
import { 
  BookMarked, 
  Lock, 
  Plus, 
  Sparkles, 
  Tag, 
  Search, 
  Calendar,
  ShieldCheck,
  CheckCircle2,
  PenTool
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { JournalMode } from '../types';
import { fireConfettiSuccess } from '../lib/confetti';

export const JournalWorkspace: React.FC = () => {
  const { journalEntries, addJournalEntry, showToast } = useAppStore();
  const [mode, setMode] = useState<JournalMode>('GUIDED_5_PROMPTS');
  const [searchTag, setSearchTag] = useState<string>('ALL');

  // Free writing form
  const [freeText, setFreeText] = useState('');
  const [tagsInput, setTagsInput] = useState('#تأمل #يوميات');

  // Guided 5 Prompts form
  const [q1, setQ1] = useState(''); // What happened?
  const [q2, setQ2] = useState(''); // What went well?
  const [q3, setQ3] = useState(''); // What was hard?
  const [q4, setQ4] = useState(''); // What did I learn?
  const [q5, setQ5] = useState(''); // Tomorrow's adjustment?

  const handleSaveFree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeText.trim()) return;
    const tags = tagsInput.split(' ').filter(t => t.startsWith('#'));
    await addJournalEntry(freeText, 'FREE_WRITING', tags);
    setFreeText('');
    fireConfettiSuccess();
    showToast('تم حفظ اليوميات بأمان وتشفير تام في جهازك 🔒');
  };

  const handleSaveGuided = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedContent = `
**ماذا حدث اليوم:** ${q1 || 'عادي'}
**ما الذي نجح بشكل رائع:** ${q2 || 'الحمد لله'}
**ما التحدي أو الشيء الصعب:** ${q3 || 'لا يوجد'}
**ماذا تعلمت واستفدت:** ${q4 || 'مراجعة المفاهيم'}
**تعديل الغد المقترح:** ${q5 || 'التركيز على المذاكرة مبكراً'}
    `.trim();

    await addJournalEntry(formattedContent, 'GUIDED_5_PROMPTS', ['#يوميات_موجهة', '#مراجعة_يومية']);
    setQ1('');
    setQ2('');
    setQ3('');
    setQ4('');
    setQ5('');
    fireConfettiSuccess();
    showToast('تم حفظ جلسة التأمل الموجهة (+20 XP) 🔮');
  };

  const filteredEntries = journalEntries.filter(entry => 
    searchTag === 'ALL' || entry.tags.includes(searchTag)
  );

  return (
    <div className="space-y-4 pt-3 relative">
      {/* 3D Ambient Purple Glow */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header (Trend 9 Bold Typography & Trend 4 Glassmorphism) */}
      <header className="glass-panel rounded-3xl p-4.5 flex items-center justify-between border border-white/10 shadow-xl shadow-black/40">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
            العقل الثاني • الملاحظات والتأمل الخاص
          </span>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
            اليوميات والتأمل 📝
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-950/80 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-700/50 shadow-inner">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>مشفرة محلياً 100%</span>
        </div>
      </header>

      {/* Mode Selector Segmented Control */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950/80 neo-sunken border border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMode('GUIDED_5_PROMPTS')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 pressable cursor-pointer ${
            mode === 'GUIDED_5_PROMPTS'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold shadow-md shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>الأسئلة الخمسة الموجهة</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('FREE_WRITING')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 pressable cursor-pointer ${
            mode === 'FREE_WRITING'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold shadow-md shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>تدوين حر ومفتوح</span>
        </button>
      </div>

      {/* Entry Forms */}
      {mode === 'GUIDED_5_PROMPTS' ? (
        <form onSubmit={handleSaveGuided} className="glass-panel border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                1. ماذا حدث اليوم في الجامعة أو فالكون؟
              </label>
              <textarea
                value={q1}
                onChange={e => setQ1(e.target.value)}
                placeholder="أبرز الأحداث والمحاضرات..."
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                2. ما الذي نجح بشكل ممتاز وشعرت فيه بإنجاز؟
              </label>
              <textarea
                value={q2}
                onChange={e => setQ2(e.target.value)}
                placeholder="عادة أتقنتها، صفحتين قرأتها، كفر صممته..."
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-amber-400 block mb-1">
                3. ما التحدي أو الشيء الذي كان صعباً عليك؟
              </label>
              <textarea
                value={q3}
                onChange={e => setQ3(e.target.value)}
                placeholder="تشتت، مسألة نانو صعبة، تأجيل..."
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-sky-400 block mb-1">
                4. ماذا تعلمت اليوم كدرس للحياة أو العلم؟
              </label>
              <textarea
                value={q4}
                onChange={e => setQ4(e.target.value)}
                placeholder="خلاصة أو فكرة جديدة..."
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-purple-400 block mb-1">
                5. ما التعديل الصغير الذي ستطبقه غداً؟
              </label>
              <textarea
                value={q5}
                onChange={e => setQ5(e.target.value)}
                placeholder="النوم أبكر بـ 30 دقيقة، البدء بمحاضرة النانو..."
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 pressable cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>حفظ التأمل الموجه في الأرشيف (+20 XP)</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleSaveFree} className="glass-panel border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <textarea
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            placeholder="اكتب أفكارك بحرية تامة.. أفكار تسويق فالكون، مشاعرك، تجارب النانو..."
            rows={6}
            required
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
          />

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">الوسوم (هاشتاج):</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 pressable cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>حفظ التدوينة الخاصة</span>
          </button>
        </form>
      )}

      {/* Previous Entries Timeline */}
      <section className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
            سجل اليوميات المحفوظة ({filteredEntries.length})
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Local Encrypted</span>
        </div>

        <div className="space-y-2.5">
          {filteredEntries.slice().reverse().map(entry => (
            <div
              key={entry.id}
              className="glass-panel border border-slate-800/80 rounded-2xl p-4 space-y-2 shadow-md"
            >
              <div className="flex items-center justify-between text-[11px] border-b border-slate-800/60 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {entry.date}
                </span>

                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40 font-mono">
                  {entry.mode === 'GUIDED_5_PROMPTS' ? 'تأمل موجه 🔮' : 'تدوين حر ✍️'}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pr-1">
                {entry.content}
              </div>

              {entry.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {entry.tags.map(t => (
                    <span key={t} className="text-[10px] text-sky-400 font-mono bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/40">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
              لا توجد تدوينات سابقة بعد. سجل أول جلسة تأمل لك اليوم بالأعلى!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
