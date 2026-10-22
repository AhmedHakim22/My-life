import React, { useState } from 'react';
import { X, Check, Book, Video, FileText, CheckSquare, Loader2 } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { fireConfettiSuccess } from '../lib/confetti';

export const QuickCaptureModal: React.FC = () => {
  const { isQuickCaptureOpen, setQuickCaptureOpen, addTask, addBook, addCourseResource, addJournalEntry } = useAppStore();
  const [tab, setTab] = useState<'TASK' | 'BOOK' | 'COURSE' | 'NOTE'>('TASK');

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'P1_URGENT_IMPORTANT' | 'P2_IMPORTANT' | 'P3_NORMAL'>('P2_IMPORTANT');
  const [taskMinutes, setTaskMinutes] = useState(30);

  // Book form & lookup
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPages, setBookPages] = useState(250);
  const [bookCover, setBookCover] = useState('');
  const [isSearchingBook, setIsSearchingBook] = useState(false);

  // Course form & lookup
  const [courseUrl, setCourseUrl] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [isSearchingCourse, setIsSearchingCourse] = useState(false);

  // Note form
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('#تأمل');

  if (!isQuickCaptureOpen) return null;

  const handleBookLookup = async () => {
    if (!bookTitle.trim()) return;
    setIsSearchingBook(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(bookTitle)}&limit=1`);
      const data = await res.json();
      if (data.docs && data.docs.length > 0) {
        const doc = data.docs[0];
        setBookTitle(doc.title || bookTitle);
        if (doc.author_name?.[0]) setBookAuthor(doc.author_name[0]);
        if (doc.number_of_pages_median) setBookPages(doc.number_of_pages_median);
        if (doc.cover_i) setBookCover(`https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingBook(false);
    }
  };

  const handleCourseLookup = async () => {
    if (!courseUrl.trim()) return;
    setIsSearchingCourse(true);
    try {
      if (courseUrl.includes('youtube.com') || courseUrl.includes('youtu.be')) {
        const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(courseUrl)}&format=json`);
        const data = await res.json();
        if (data.title) setCourseTitle(data.title);
        if (data.author_name) setCourseInstructor(data.author_name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingCourse(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'TASK' && taskTitle.trim()) {
      await addTask(taskTitle, taskPriority, taskMinutes);
      setTaskTitle('');
    } else if (tab === 'BOOK' && bookTitle.trim()) {
      await addBook(bookTitle, bookAuthor, bookPages, bookCover);
      setBookTitle('');
      setBookAuthor('');
      setBookCover('');
    } else if (tab === 'COURSE' && courseTitle.trim()) {
      await addCourseResource(courseTitle, courseUrl, courseInstructor);
      setCourseUrl('');
      setCourseTitle('');
      setCourseInstructor('');
    } else if (tab === 'NOTE' && noteContent.trim()) {
      const tags = noteTags.split(' ').filter(t => t.startsWith('#'));
      await addJournalEntry(noteContent, 'FREE_WRITING', tags);
      setNoteContent('');
    }
    fireConfettiSuccess();
    setQuickCaptureOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="apple-card border border-white/[0.1] rounded-t-[32px] sm:rounded-[26px] w-full max-w-md p-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <span>تسجيل سريع (Quick Capture)</span>
          </h2>
          <button
            type="button"
            onClick={() => setQuickCaptureOpen(false)}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#8e8e93] hover:text-white flex items-center justify-center pressable cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="apple-segmented-container grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => setTab('TASK')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'TASK' ? 'apple-pill-active' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>مهمة</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('BOOK')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'BOOK' ? 'apple-pill-active' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Book className="w-3.5 h-3.5" />
            <span>كتاب</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('COURSE')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'COURSE' ? 'apple-pill-active' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>كورس</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('NOTE')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'NOTE' ? 'apple-pill-active' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>فكرة</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'TASK' && (
            <>
              <input
                type="text"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="عنوان المهمة (مثلاً: تجهيز بوست فالكون أو شيت النانو)..."
                autoFocus
                required
                className="w-full bg-slate-950/70 border border-sky-400/25 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
              />
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTaskPriority('P1_URGENT_IMPORTANT')}
                  className={`py-2 text-[11px] rounded-xl border font-bold transition-all ${
                    taskPriority === 'P1_URGENT_IMPORTANT' ? 'bg-red-950/70 border-red-500 text-red-300 shadow-sm' : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  عاجل ومهم 🔴
                </button>
                <button
                  type="button"
                  onClick={() => setTaskPriority('P2_IMPORTANT')}
                  className={`py-2 text-[11px] rounded-xl border font-bold transition-all ${
                    taskPriority === 'P2_IMPORTANT' ? 'bg-sky-950/70 border-sky-400 text-sky-200 shadow-sm' : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  استراتيجي 🔵
                </button>
                <button
                  type="button"
                  onClick={() => setTaskPriority('P3_NORMAL')}
                  className={`py-2 text-[11px] rounded-xl border font-bold transition-all ${
                    taskPriority === 'P3_NORMAL' ? 'bg-slate-800 border-slate-600 text-slate-200 shadow-sm' : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  عادي ⚪
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">الوقت التقديري:</span>
                {[15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTaskMinutes(mins)}
                    className={`px-2.5 py-1 text-[11px] rounded-md font-mono border ${
                      taskMinutes === mins ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {mins}د
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === 'BOOK' && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bookTitle}
                  onChange={e => setBookTitle(e.target.value)}
                  placeholder="عنوان الكتاب..."
                  autoFocus
                  required
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleBookLookup}
                  disabled={isSearchingBook}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 rounded-xl border border-slate-700 flex items-center gap-1"
                >
                  {isSearchingBook ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'بحث غلاف'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={bookAuthor}
                  onChange={e => setBookAuthor(e.target.value)}
                  placeholder="اسم المؤلف (اختياري)..."
                  className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
                <input
                  type="number"
                  value={bookPages}
                  onChange={e => setBookPages(Number(e.target.value))}
                  placeholder="عدد الصفحات..."
                  className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </>
          )}

          {tab === 'COURSE' && (
            <>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={courseUrl}
                  onChange={e => setCourseUrl(e.target.value)}
                  placeholder="رابط يوتيوب أو المنصة التعليمية..."
                  autoFocus
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleCourseLookup}
                  disabled={isSearchingCourse}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 rounded-xl border border-slate-700 flex items-center gap-1"
                >
                  {isSearchingCourse ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'جلب بيانات'}
                </button>
              </div>
              <input
                type="text"
                value={courseTitle}
                onChange={e => setCourseTitle(e.target.value)}
                placeholder="عنوان الكورس أو المحاضرة..."
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
            </>
          )}

          {tab === 'NOTE' && (
            <>
              <textarea
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="اكتب فكرة سريعة، خاطرة، أو مراجعة شخصية..."
                rows={3}
                autoFocus
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed"
              />
              <input
                type="text"
                value={noteTags}
                onChange={e => setNoteTags(e.target.value)}
                placeholder="وسوم مفصولة بمسافة (مثلاً: #فالكون #نانو #فكرة)..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-400 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
              />
            </>
          )}

          <button
            type="submit"
            className="apple-btn-primary w-full py-3.5 text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-sky-400/30"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>حفظ فوري في مَسار</span>
          </button>
        </form>
      </div>
    </div>
  );
};
