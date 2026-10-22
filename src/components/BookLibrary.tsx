import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  BookMarked, 
  Layers,
  ArrowRight,
  TrendingUp,
  X,
  Trash2,
  Edit3,
  Archive
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { fireConfettiSuccess } from '../lib/confetti';

export const BookLibrary: React.FC = () => {
  const { 
    learningResources, 
    bookDetails, 
    readTwoPagesAction, 
    updateBookPage,
    addBook,
    deleteBook,
    editBook,
    archiveBook,
    showToast
  } = useAppStore();

  const [shelfFilter, setShelfFilter] = useState<'ALL' | 'Reading' | 'Want to Read' | 'Finished'>('ALL');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState<number>(0);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // Edit book modal state
  const [editingBookData, setEditingBookData] = useState<{ id: string; title: string; author: string; totalPages: number; shelf: any } | null>(null);
  const [deletingBook, setDeletingBook] = useState<{ id: string; title: string } | null>(null);

  // New book form fields
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTotalPages, setNewTotalPages] = useState(250);

  const handleReadTwoPages = async (resourceId: string) => {
    fireConfettiSuccess();
    await readTwoPagesAction(resourceId);
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addBook(newTitle, newAuthor, newTotalPages);
    setNewTitle('');
    setNewAuthor('');
    setNewTotalPages(250);
    setIsAddBookModalOpen(false);
    fireConfettiSuccess();
    showToast(`تمت إضافة كتاب "${newTitle}" بنجاح إلى مكتبتك 📚✨`);
  };

  const handleSaveEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookData) return;
    await editBook(editingBookData.id, {
      title: editingBookData.title,
      author: editingBookData.author,
      totalPages: editingBookData.totalPages,
      shelf: editingBookData.shelf
    });
    setEditingBookData(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;
    await deleteBook(deletingBook.id);
    setDeletingBook(null);
  };

  // Join learningResources (type=BOOK) with bookDetails
  const books = learningResources
    .filter(r => r.type === 'BOOK')
    .map(resource => {
      const details = bookDetails.find(b => b.resourceId === resource.id);
      return {
        ...resource,
        details: details || {
          resourceId: resource.id,
          author: 'مؤلف غير محدد',
          totalPages: 200,
          currentPage: 0,
          shelf: 'Reading' as const
        }
      };
    })
    .filter(b => shelfFilter === 'ALL' || b.details.shelf === shelfFilter);

  return (
    <div className="space-y-4 pb-24 pt-3 relative">
      {/* 3D Ambient Emerald Glow (Trend 8) */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="apple-card rounded-[28px] p-5 flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[11px] font-black text-emerald-400 tracking-wider uppercase">
            مكتبة القراءة والتعلم الذاتي
          </span>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
            مكتبة الكتب وقراءات النانو 📚
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddBookModalOpen(true)}
          className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 pressable cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة كتاب</span>
        </button>
      </header>

      {/* Shelf Filter Segmented Control */}
      <div className="apple-segmented-container grid grid-cols-4 gap-1 text-xs font-bold">
        {[
          { id: 'ALL', label: 'الكل' },
          { id: 'Reading', label: 'أقرأه حالياً' },
          { id: 'Want to Read', label: 'قائمة الانتظار' },
          { id: 'Finished', label: 'أكملته' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setShelfFilter(tab.id as any)}
            className={`py-2 text-[11px] font-bold rounded-2xl transition-all pressable cursor-pointer text-center ${
              shelfFilter === tab.id
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Books List / Modern Glassmorphic Cards */}
      <div className="space-y-3.5">
        {books.map(book => {
          const progressPercent = Math.min(
            100,
            Math.round((book.details.currentPage / Math.max(1, book.details.totalPages)) * 100)
          );

          return (
            <div
              key={book.id}
              className="glass-panel border border-slate-800/80 rounded-3xl p-4.5 space-y-3.5 shadow-lg transition-all"
            >
              <div className="flex gap-3.5">
                {/* 3D Book Cover Card (Trend 8) */}
                <div className="w-16 h-24 bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-800 rounded-2xl border border-slate-600/50 shrink-0 flex items-center justify-center text-slate-400 overflow-hidden shadow-xl shadow-black/50 relative group">
                  {book.details.coverUrl ? (
                    <img src={book.details.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-2 text-center flex flex-col items-center">
                      <BookOpen className="w-6 h-6 text-emerald-400" />
                      <span className="text-[9px] text-slate-400 mt-1 font-mono line-clamp-1">{book.title.slice(0, 10)}</span>
                    </div>
                  )}
                  {/* Subtle 3D book spine overlay */}
                  <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-black/40 border-l border-white/10" />
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/40 font-bold">
                      {book.details.shelf === 'Reading' ? 'قيد القراءة 📖' : book.details.shelf === 'Finished' ? 'مكتمل ✅' : 'في الانتظار ⏳'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">سجل كنسي</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white truncate">
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-400 truncate">
                    المؤلف: {book.details.author || 'غير محدد'}
                  </p>

                  {/* Progress Numbers */}
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span>
                      صفحة <strong className="text-emerald-400 font-mono">{book.details.currentPage}</strong> من {book.details.totalPages}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
                  </div>

                  {/* Progress Bar (Trend 2 Neo-Sunken) */}
                  <div className="w-full bg-slate-950 neo-sunken h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions & Atomic Read Button */}
              <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-slate-800/70 gap-2">
                <button
                  type="button"
                  onClick={() => handleReadTwoPages(book.id)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/30 pressable cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>قرأت صفحتين (+15 XP)</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {editingPageId === book.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={pageInput}
                        onChange={e => setPageInput(Number(e.target.value))}
                        className="w-16 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 text-xs text-center text-white font-mono"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateBookPage(book.id, pageInput);
                          setEditingPageId(null);
                          showToast('تم تحديث الصفحة الحالية 📖');
                        }}
                        className="text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 px-2.5 py-1 rounded-xl font-bold pressable cursor-pointer"
                      >
                        حفظ
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPageId(book.id);
                        setPageInput(book.details.currentPage);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-700/60 pressable cursor-pointer"
                    >
                      تعديل الصفحة
                    </button>
                  )}

                  {/* Edit Book Details */}
                  <button
                    type="button"
                    onClick={() => setEditingBookData({
                      id: book.id,
                      title: book.title,
                      author: book.details.author || '',
                      totalPages: book.details.totalPages,
                      shelf: book.details.shelf
                    })}
                    className="p-1.5 text-slate-400 hover:text-sky-300 bg-slate-900/80 hover:bg-sky-950/40 rounded-xl border border-slate-700/60 transition-colors"
                    title="تعديل بيانات الكتاب"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Book */}
                  <button
                    type="button"
                    onClick={() => setDeletingBook({ id: book.id, title: book.title })}
                    className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-rose-950/40 rounded-xl border border-slate-700/60 transition-colors"
                    title="حذف الكتاب"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">إضافة كتاب جديد للمكتبة</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">عنوان الكتاب:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: Atomic Habits, مقدمة في النانوتكنولوجي..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">اسم المؤلف (اختياري):</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder="مثال: James Clear"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">إجمالي عدد الصفحات:</label>
                <input
                  type="number"
                  value={newTotalPages}
                  onChange={e => setNewTotalPages(Number(e.target.value))}
                  min={1}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ الكتاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBookData && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">تعديل بيانات الكتاب</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingBookData(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBook} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">عنوان الكتاب:</label>
                <input
                  type="text"
                  value={editingBookData.title}
                  onChange={e => setEditingBookData({ ...editingBookData, title: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">اسم المؤلف:</label>
                <input
                  type="text"
                  value={editingBookData.author}
                  onChange={e => setEditingBookData({ ...editingBookData, author: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">إجمالي الصفحات:</label>
                <input
                  type="number"
                  value={editingBookData.totalPages}
                  onChange={e => setEditingBookData({ ...editingBookData, totalPages: Number(e.target.value) })}
                  min={1}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">الحالة / الرف:</label>
                <select
                  value={editingBookData.shelf}
                  onChange={e => setEditingBookData({ ...editingBookData, shelf: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Reading">قيد القراءة 📖</option>
                  <option value="Want to Read">في قائمة الانتظار ⏳</option>
                  <option value="Finished">مكتمل ✅</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBookData(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Book Confirmation Modal */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center gap-2 text-rose-400 border-b border-slate-800 pb-3">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">تأكيد حذف الكتاب</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              هل أنت متأكد من حذف كتاب <strong className="text-white font-bold">"{deletingBook.title}"</strong>؟
            </p>
            <p className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              💡 سيتم تسجيل علامة الحذف (Tombstone) لضمان عدم عودته عند إعادة التحميل أو المزامنة، مع الحفاظ على أي مهارات مرتبطة دون حذفها.
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-rose-950/50 pressable cursor-pointer"
              >
                تأكيد الحذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
