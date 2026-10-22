import React, { useState, useMemo } from 'react';
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
  PenTool,
  FileDown,
  BookOpen,
  Trash2,
  X,
  FileText,
  SlidersHorizontal,
  Quote,
  Check
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { JournalMode, JournalEntry } from '../types';
import { fireConfettiSuccess } from '../lib/confetti';
import { exportJournalToWord, calculateWordCount, formatArabicDateFriendly } from '../lib/wordExporter';

export const JournalWorkspace: React.FC = () => {
  const { 
    journalEntries, 
    learningResources, 
    bookDetails, 
    addJournalEntry, 
    deleteJournalEntry, 
    showToast 
  } = useAppStore();

  const [mode, setMode] = useState<JournalMode>('GUIDED_5_PROMPTS');
  const [searchTag, setSearchTag] = useState<string>('ALL');

  // Deletion state
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);

  // Word Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTitle, setExportTitle] = useState('مذكرات ومحطات مَسار');
  const [exportSubtitle, setExportSubtitle] = useState('توثيق الرحلة، خلاصة التجارب، والأفكار الملهمة');
  const [exportAuthor, setExportAuthor] = useState('أحمد حكيم');
  const [exportTag, setExportTag] = useState('ALL');
  const [exportSortOrder, setExportSortOrder] = useState<'CHRONOLOGICAL_ASC' | 'CHRONOLOGICAL_DESC'>('CHRONOLOGICAL_ASC');
  const [includeCoverPage, setIncludeCoverPage] = useState(true);
  const [includeStatsSummary, setIncludeStatsSummary] = useState(true);
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [includeBookAppendix, setIncludeBookAppendix] = useState(true);

  // Free writing form
  const [freeText, setFreeText] = useState('');
  const [tagsInput, setTagsInput] = useState('#تأمل #يوميات');

  // Guided 5 Prompts form
  const [q1, setQ1] = useState(''); // What happened?
  const [q2, setQ2] = useState(''); // What went well?
  const [q3, setQ3] = useState(''); // What was hard?
  const [q4, setQ4] = useState(''); // What did I learn?
  const [q5, setQ5] = useState(''); // Tomorrow's adjustment?

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    journalEntries.forEach(entry => {
      (entry.tags || []).forEach(t => {
        if (t.trim()) set.add(t.trim());
      });
    });
    return Array.from(set);
  }, [journalEntries]);

  // Prepared books for appendix
  const booksForAppendix = useMemo(() => {
    return bookDetails.map(b => {
      const res = learningResources.find(r => r.id === b.resourceId);
      return {
        title: res?.title || 'كتاب بدون عنوان',
        author: b.author,
        currentPage: b.currentPage,
        totalPages: b.totalPages,
        shelf: b.shelf
      };
    });
  }, [bookDetails, learningResources]);

  // Filtered entries for export preview
  const exportFilteredEntries = useMemo(() => {
    return journalEntries.filter(entry => {
      if (exportTag === 'ALL') return true;
      return (entry.tags || []).includes(exportTag);
    });
  }, [journalEntries, exportTag]);

  // Estimated words in export
  const exportEstimatedWords = useMemo(() => {
    return exportFilteredEntries.reduce((acc, curr) => acc + calculateWordCount(curr.content), 0);
  }, [exportFilteredEntries]);

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

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;
    await deleteJournalEntry(entryToDelete.id);
    setEntryToDelete(null);
  };

  const handleExecuteExport = () => {
    const result = exportJournalToWord(journalEntries, {
      bookTitle: exportTitle.trim() || 'مذكرات ومحطات مَسار',
      subtitle: exportSubtitle.trim(),
      authorName: exportAuthor.trim() || 'أحمد حكيم',
      filterTag: exportTag,
      sortOrder: exportSortOrder,
      includeCoverPage,
      includeStatsSummary,
      includeTableOfContents,
      includeBookAppendix,
      books: booksForAppendix
    });

    fireConfettiSuccess();
    showToast(`تم تصدير "${result.filename}" بنجاح! جاهز للفتح في Word 📖`);
    setIsExportModalOpen(false);
  };

  const handleSelectTagForExport = (tag: string) => {
    setExportTag(tag);
    if (tag === '#اقتباسات' || tag === '#اقتباس') {
      setExportTitle('كتاب الاقتباسات والأفكار الملهمة');
      setExportSubtitle('خلاصة العبارات، الحِكَم، والدروس من مسار الحياة والقراءة');
    } else if (tag === '#قصة_حياتي' || tag === '#سيرة_ذاتية') {
      setExportTitle('قصة حياتي ومحطات المسار');
      setExportSubtitle('سيرة شخصية وتوثيق الرحلة خطوة بخطوة');
    } else if (tag === 'ALL') {
      setExportTitle('مذكرات ومحطات مَسار');
      setExportSubtitle('توثيق الرحلة، خلاصة التجارب، والأفكار الملهمة');
    }
  };

  const filteredEntries = journalEntries.filter(entry => 
    searchTag === 'ALL' || (entry.tags || []).includes(searchTag)
  );

  return (
    <div className="space-y-4 pt-3 relative">
      {/* 3D Ambient Purple Glow */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="apple-card rounded-[28px] p-5 flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[11px] font-black text-emerald-400 tracking-wider uppercase">
            العقل الثاني • الملاحظات والتأمل الخاص
          </span>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
            اليوميات والتأمل 📝
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-black bg-emerald-950/80 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/40 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>مشفرة محلياً 100%</span>
        </div>
      </header>

      {/* Word Book Export Action Banner */}
      <div className="apple-card rounded-3xl p-4 border border-emerald-400/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/70 to-teal-950/40 flex items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/30 shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>تصدير كتاب المذكرات والخواطر</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/30">Word DOC</span>
            </div>
            <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
              حوّل تدويناتك واقتباساتك إلى كتاب وورد منسق ومجهز للطباعة ({journalEntries.length} تدوينات)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="shrink-0 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 pressable cursor-pointer"
        >
          <FileDown className="w-4 h-4 stroke-[2.5]" />
          <span>تصدير كتاب</span>
        </button>
      </div>

      {/* Mode Selector Segmented Control */}
      <div className="apple-segmented-container grid grid-cols-2 gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMode('GUIDED_5_PROMPTS')}
          className={`py-2 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 pressable cursor-pointer ${
            mode === 'GUIDED_5_PROMPTS'
              ? 'apple-pill-active'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>الأسئلة الخمسة الموجهة</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('FREE_WRITING')}
          className={`py-2 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 pressable cursor-pointer ${
            mode === 'FREE_WRITING'
              ? 'apple-pill-active'
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
                1. ماذا حدث اليوم في الجامعة أو العمل؟
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
            placeholder="اكتب أفكارك بحرية تامة.. أفكار وتطوير العمل، مشاعرك، تجارب النانو، أو اقتباس أعجبك..."
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
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              سجل اليوميات المحفوظة ({filteredEntries.length})
            </h3>
            {searchTag !== 'ALL' && (
              <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800/40 px-2 py-0.5 rounded-full font-mono">
                {searchTag}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all pressable cursor-pointer"
              title="تصدير المذكرات كملف وورد"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>تصدير Word</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Local Encrypted</span>
          </div>
        </div>

        {/* Tag Filter Chips */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              type="button"
              onClick={() => setSearchTag('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                searchTag === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              الكل ({journalEntries.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchTag(tag)}
                className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all shrink-0 cursor-pointer ${
                  searchTag === tag
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900/90 text-sky-400 hover:text-sky-200 border border-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {filteredEntries.slice().reverse().map(entry => (
            <div
              key={entry.id}
              className="glass-panel border border-slate-800/80 rounded-2xl p-4 space-y-2.5 shadow-md relative group"
            >
              <div className="flex items-center justify-between text-[11px] border-b border-slate-800/60 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {formatArabicDateFriendly(entry.date)}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40 font-mono">
                    {entry.mode === 'GUIDED_5_PROMPTS' ? 'تأمل موجه 🔮' : 'تدوين حر ✍️'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setEntryToDelete(entry)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-950/40 cursor-pointer"
                    title="حذف هذه التدوينة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pr-1">
                {entry.content}
              </div>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {entry.tags.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSearchTag(t)}
                      className="text-[10px] text-sky-400 font-mono bg-sky-950/60 hover:bg-sky-900/60 px-2 py-0.5 rounded-md border border-sky-800/40 transition-colors cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="glass-panel p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                {searchTag === 'ALL'
                  ? 'لا توجد تدوينات سابقة بعد. سجل أول جلسة تأمل لك اليوم بالأعلى!'
                  : `لا توجد تدوينات تحت الوسم "${searchTag}".`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-panel border border-rose-500/30 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">تأكيد حذف التدوينة</h3>
                <p className="text-[11px] text-slate-400">{entryToDelete.date}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              هل أنت متأكد من رغبتك في حذف هذه التدوينة؟ سيتم تسجيل شواهد الحذف لضمان عدم عودتها في المزامنة.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEntryToDelete(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-black shadow-lg shadow-rose-900/30 hover:brightness-110 transition-all cursor-pointer"
              >
                حذف نهائي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Word Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-panel border border-slate-700/80 rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-md">
                  <BookOpen className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">تصدير كتاب مذكراتك (Word DOC) 📖</h3>
                  <p className="text-[10px] text-emerald-400">تنسيق طباعي عربي أنيق قابل للتعديل والطباعة</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Type Selection / Intent */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                نوع الكتاب المراد استخراجه:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectTagForExport('ALL')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    exportTag === 'ALL'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>كتاب المذكرات كاملاً</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTagForExport('#اقتباسات')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    exportTag === '#اقتباسات'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Quote className="w-4 h-4 text-amber-400" />
                  <span>كتاب الاقتباسات</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTagForExport('#قصة_حياتي')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    exportTag === '#قصة_حياتي'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>قصة حياتي والمسار</span>
                </button>
              </div>
            </div>

            {/* Book Metadata Customization */}
            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  عنوان الكتاب الرئيسي:
                </label>
                <input
                  type="text"
                  value={exportTitle}
                  onChange={e => setExportTitle(e.target.value)}
                  placeholder="مثال: مذكرات ومحطات مَسار"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  العنوان الفرعي:
                </label>
                <input
                  type="text"
                  value={exportSubtitle}
                  onChange={e => setExportSubtitle(e.target.value)}
                  placeholder="مثال: توثيق الرحلة، خلاصة التجارب، والأفكار"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    اسم الكاتب / المؤلف:
                  </label>
                  <input
                    type="text"
                    value={exportAuthor}
                    onChange={e => setExportAuthor(e.target.value)}
                    placeholder="مثال: أحمد حكيم"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ترتيب الفصول:
                  </label>
                  <select
                    value={exportSortOrder}
                    onChange={e => setExportSortOrder(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="CHRONOLOGICAL_ASC">من الأقدم للأحدث (سرد روائي) ⏳</option>
                    <option value="CHRONOLOGICAL_DESC">من الأحدث للأقدم ⏱️</option>
                  </select>
                </div>
              </div>

              {/* Tag selector if available */}
              {allTags.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                    تصفية بالوسم المحدد:
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSelectTagForExport('ALL')}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        exportTag === 'ALL'
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      الكل ({journalEntries.length})
                    </button>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleSelectTagForExport(tag)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-all cursor-pointer ${
                          exportTag === tag
                            ? 'bg-sky-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-sky-400 border border-slate-800'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Layout Toggles */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 text-xs">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                تخصيص بنية المستند:
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${includeCoverPage ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>صفحة غلاف كتاب فاخرة (A4 Print Cover)</span>
                </span>
                <input
                  type="checkbox"
                  checked={includeCoverPage}
                  onChange={e => setIncludeCoverPage(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${includeStatsSummary ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>جدول إحصائيات التدوين والكلمات في الغلاف</span>
                </span>
                <input
                  type="checkbox"
                  checked={includeStatsSummary}
                  onChange={e => setIncludeStatsSummary(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${includeTableOfContents ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>فهرس المحطات واليوميات (Table of Contents)</span>
                </span>
                <input
                  type="checkbox"
                  checked={includeTableOfContents}
                  onChange={e => setIncludeTableOfContents(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
                <span className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${includeBookAppendix ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>ملحق سجل قراءات الكتب والمراجع ({booksForAppendix.length} كتب)</span>
                </span>
                <input
                  type="checkbox"
                  checked={includeBookAppendix}
                  onChange={e => setIncludeBookAppendix(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>
            </div>

            {/* Quick Live Preview Box */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">سيتم استخراج:</span>
                <span className="font-extrabold text-white text-xs">
                  {exportFilteredEntries.length} تدوينة • حوالي {exportEstimatedWords.toLocaleString('ar-EG')} كلمة
                </span>
              </div>

              <div className="text-left text-[10px] text-emerald-400 font-mono">
                Microsoft Word (.doc)
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={exportFilteredEntries.length === 0}
                onClick={handleExecuteExport}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 text-xs font-black shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileDown className="w-4 h-4 stroke-[2.5]" />
                <span>تحميل ملف Word المنسق الآن 📥</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
