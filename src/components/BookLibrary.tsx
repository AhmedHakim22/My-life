import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  BookMarked, 
  Layers,
  Search,
  X,
  Trash2,
  Edit3,
  Archive,
  Info
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { fireConfettiSuccess } from '../lib/confetti';
import { BOOK_CATEGORIES, type BookCategoryDef } from '../db/ahmedBooks181Data';
import { normalizeArabicText } from '../engines/ahmedBooks181Importer';

export const BookLibrary: React.FC = () => {
  const { 
    learningResources, 
    bookDetails, 
    readTwoPagesAction, 
    updateBookPage,
    addBook,
    deleteBook,
    editBook,
    showToast
  } = useAppStore();

  const [shelfFilter, setShelfFilter] = useState<'ALL' | 'Reading' | 'Want to Read' | 'Finished'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState<number>(0);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // Edit book modal state
  const [editingBookData, setEditingBookData] = useState<{ 
    id: string; 
    title: string; 
    author: string; 
    totalPages: string | number; 
    shelf: 'Reading' | 'Want to Read' | 'Finished' | 'Paused' | 'Dropped';
    categoryId: string;
    subcategory?: string;
  } | null>(null);

  const [deletingBook, setDeletingBook] = useState<{ id: string; title: string } | null>(null);

  // New book form fields
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTotalPages, setNewTotalPages] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('REL-01');
  const [newSubcategory, setNewSubcategory] = useState('');

  const handleReadTwoPages = async (resourceId: string) => {
    fireConfettiSuccess();
    await readTwoPagesAction(resourceId);
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedPages = newTotalPages.trim() ? parseInt(newTotalPages, 10) : 0;
    await addBook(
      newTitle.trim(),
      newAuthor.trim() || undefined,
      isNaN(parsedPages) ? 0 : parsedPages,
      undefined,
      newCategoryId || 'UNCATEGORIZED',
      newSubcategory.trim() || undefined
    );

    setNewTitle('');
    setNewAuthor('');
    setNewTotalPages('');
    setNewCategoryId('REL-01');
    setNewSubcategory('');
    setIsAddBookModalOpen(false);
    fireConfettiSuccess();
    showToast(`تمت إضافة كتاب "${newTitle}" بنجاح إلى مكتبتك 📚✨`);
  };

  const handleSaveEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookData) return;

    const pages = typeof editingBookData.totalPages === 'number'
      ? editingBookData.totalPages
      : parseInt(editingBookData.totalPages || '0', 10) || 0;

    await editBook(editingBookData.id, {
      title: editingBookData.title.trim(),
      author: editingBookData.author.trim(),
      totalPages: pages,
      shelf: editingBookData.shelf,
      categoryId: editingBookData.categoryId || 'UNCATEGORIZED',
      subcategory: editingBookData.subcategory?.trim() || undefined
    });

    setEditingBookData(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;
    await deleteBook(deletingBook.id);
    setDeletingBook(null);
  };

  // Join learningResources (type=BOOK) with bookDetails
  const allBooks = useMemo(() => {
    return learningResources
      .filter(r => r.type === 'BOOK')
      .map(resource => {
        const details = bookDetails.find(b => b.resourceId === resource.id);
        const categoryId = resource.categoryId || details?.categoryId || 'UNCATEGORIZED';
        return {
          ...resource,
          categoryId,
          details: details || {
            resourceId: resource.id,
            author: resource.provider || 'مؤلف غير محدد',
            totalPages: 0,
            currentPage: 0,
            shelf: 'Want to Read' as const,
            categoryId
          }
        };
      });
  }, [learningResources, bookDetails]);

  // Global Library Live Metrics (Strictly derived from actual saved database records)
  const totalBooksInLibrary = allBooks.length;
  const completedBooksCount = allBooks.filter(b => b.details.shelf === 'Finished' || b.status === 'COMPLETED').length;
  const readingBooksCount = allBooks.filter(b => b.details.shelf === 'Reading').length;

  // Category counts across all user books
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const key of Object.keys(BOOK_CATEGORIES)) {
      counts[key] = 0;
    }
    for (const b of allBooks) {
      const c = b.categoryId || 'UNCATEGORIZED';
      counts[c] = (counts[c] || 0) + 1;
    }
    return counts;
  }, [allBooks]);

  // Filtered Books List
  const filteredBooks = useMemo(() => {
    const normSearch = normalizeArabicText(searchQuery);

    return allBooks.filter(b => {
      // Shelf Filter
      if (shelfFilter !== 'ALL' && b.details.shelf !== shelfFilter) {
        return false;
      }
      // Category Filter
      if (selectedCategory !== 'ALL' && b.categoryId !== selectedCategory) {
        return false;
      }
      // Search Query
      if (normSearch) {
        const normTitle = normalizeArabicText(b.title);
        const normAuthor = normalizeArabicText(b.details.author || b.provider);
        const normSubcategory = normalizeArabicText(b.details.subcategory);
        const matches = normTitle.includes(normSearch) || 
                        normAuthor.includes(normSearch) || 
                        normSubcategory.includes(normSearch);
        if (!matches) return false;
      }
      return true;
    });
  }, [allBooks, shelfFilter, selectedCategory, searchQuery]);

  // Category Pills definition (10 main categories + UNCATEGORIZED if exists)
  const categoryPills = useMemo(() => {
    const list: Array<{ id: string; name: string; count: number; color?: string }> = [
      { id: 'ALL', name: 'كل الكتب', count: totalBooksInLibrary }
    ];

    for (const [id, def] of Object.entries(BOOK_CATEGORIES)) {
      const count = categoryCounts[id] || 0;
      // Show UNCATEGORIZED only if it contains books
      if (id === 'UNCATEGORIZED' && count === 0) continue;
      list.push({
        id,
        name: def.name,
        count,
        color: def.color
      });
    }

    return list;
  }, [totalBooksInLibrary, categoryCounts]);

  return (
    <div className="space-y-4 pb-24 pt-3 relative" dir="rtl">
      {/* 3D Ambient Emerald Glow */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="apple-card rounded-[28px] p-5 flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[11px] font-black text-emerald-400 tracking-wider uppercase">
            مكتبة القراءة والتعلم الذاتي
          </span>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
            مكتبة الكتب والتصنيفات 📚
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

      {/* Live Actual Metrics Counters (Derived from DB) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="apple-card p-3.5 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">إجمالي الكتب</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5 font-mono">
              {totalBooksInLibrary}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShelfFilter(shelfFilter === 'Finished' ? 'ALL' : 'Finished')}
          className={`apple-card p-3.5 rounded-3xl flex items-center justify-between text-right transition cursor-pointer pressable ${
            shelfFilter === 'Finished' ? 'border-teal-500/60 bg-teal-950/40 shadow-md shadow-teal-500/20' : ''
          }`}
          title="اضغط لتصفية الكتب المكتملة"
        >
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">مكتمل</span>
            <div className="text-xl font-black text-teal-400 mt-0.5 font-mono">
              {completedBooksCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </button>

        <div className="apple-card p-3.5 rounded-3xl flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">قيد القراءة</span>
            <div className="text-xl font-black text-sky-400 mt-0.5 font-mono">
              {readingBooksCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <BookMarked className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="ابحث بالعنوان أو اسم المؤلف أو الموضوع..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pr-10 pl-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Horizontal Carousel (Mobile-first) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>التصنيفات ({categoryPills.length - 1} فئات):</span>
          </span>
          {(selectedCategory !== 'ALL' || shelfFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setShelfFilter('ALL');
              }}
              className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryPills.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 pressable cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md shadow-emerald-500/25'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                style={!isSelected && cat.color ? { borderColor: `${cat.color}40` } : {}}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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

      {/* Active Filter Info & Results Count */}
      {(selectedCategory !== 'ALL' || shelfFilter !== 'ALL' || searchQuery.trim()) && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
          <span>
            النتائج المعروضة: <strong className="text-white font-mono">{filteredBooks.length}</strong> من إجمالي {totalBooksInLibrary}
          </span>
          {selectedCategory !== 'ALL' && (
            <span className="text-emerald-400 font-bold truncate max-w-[200px]">
              فئة: {BOOK_CATEGORIES[selectedCategory]?.name || selectedCategory}
            </span>
          )}
        </div>
      )}

      {/* Books List / Modern Glassmorphic Cards */}
      <div className="space-y-3.5">
        {filteredBooks.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center space-y-3 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">
              لا توجد كتب مطابقة للفلاتر المحددة
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              جرب تغيير الفئة المحددة أو إفراغ خانة البحث لعرض بقية كتب مكتبتك.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setShelfFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-2 bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl pressable cursor-pointer"
            >
              عرض جميع الكتب ({totalBooksInLibrary})
            </button>
          </div>
        ) : (
          filteredBooks.map(book => {
            const hasPages = book.details.totalPages > 0;
            const progressPercent = hasPages
              ? Math.min(100, Math.round((book.details.currentPage / book.details.totalPages) * 100))
              : 0;

            const categoryInfo = BOOK_CATEGORIES[book.categoryId] || BOOK_CATEGORIES['UNCATEGORIZED'];

            return (
              <div
                key={book.id}
                className="glass-panel border border-slate-800/80 rounded-3xl p-4.5 space-y-3.5 shadow-lg transition-all"
              >
                <div className="flex gap-3.5">
                  {/* 3D Book Cover Card */}
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
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/40 font-bold">
                        {book.details.shelf === 'Reading' ? 'قيد القراءة 📖' : book.details.shelf === 'Finished' ? 'مكتمل ✅' : 'في الانتظار ⏳'}
                      </span>
                      {categoryInfo && (
                        <span 
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-900/90"
                          style={{ color: categoryInfo.color, borderColor: `${categoryInfo.color}50` }}
                        >
                          {categoryInfo.name}
                        </span>
                      )}
                      {book.details.subcategory && (
                        <span className="text-[10px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-800">
                          {book.details.subcategory}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-extrabold text-white leading-snug">
                      {book.title}
                    </h3>

                    <p className="text-xs text-slate-400 truncate">
                      المؤلف: {book.details.author || 'غير محدد'}
                    </p>

                    {/* Progress Numbers */}
                    <div className="flex items-center justify-between text-xs text-slate-300 pt-0.5">
                      <span>
                        صفحة <strong className="text-emerald-400 font-mono">{book.details.currentPage}</strong>
                        {hasPages ? ` من ${book.details.totalPages}` : ' (إجمالي الصفحات غير محدد)'}
                      </span>
                      {hasPages && (
                        <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {hasPages && (
                      <div className="w-full bg-slate-950 neo-sunken h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}

                    {/* Book Note / Review notice if present */}
                    {book.details.note && (
                      <p className="text-[10px] text-amber-300/90 bg-amber-950/20 px-2 py-1 rounded-lg border border-amber-800/30 flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>{book.details.note}</span>
                      </p>
                    )}
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
                        totalPages: book.details.totalPages || '',
                        shelf: book.details.shelf,
                        categoryId: book.categoryId,
                        subcategory: book.details.subcategory
                      })}
                      className="p-1.5 text-slate-400 hover:text-sky-300 bg-slate-900/80 hover:bg-sky-950/40 rounded-xl border border-slate-700/60 transition-colors"
                      title="تعديل بيانات وتصنيف الكتاب"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Book */}
                    <button
                      type="button"
                      onClick={() => setDeletingBook({ id: book.id, title: book.title })}
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-rose-950/40 rounded-xl border border-slate-700/60 transition-colors"
                      title="حذف الكتاب نهائياً"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">إضافة كتاب جديد للمكتبة</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
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
                  placeholder="مثال: الداء والدواء، العادات الذرية..."
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
                  placeholder="مثال: ابن قيم الجوزية، جيمس كلير..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">التصنيف:</label>
                <select
                  value={newCategoryId}
                  onChange={e => setNewCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {Object.entries(BOOK_CATEGORIES).map(([catId, catDef]) => (
                    <option key={catId} value={catId}>
                      {catDef.name} {catId !== 'UNCATEGORIZED' ? `(${catId})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">التصنيف الفرعي (اختياري):</label>
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={e => setNewSubcategory(e.target.value)}
                  placeholder="مثال: تدبر القرآن، سيرة وأخلاق، عادات..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">إجمالي عدد الصفحات:</label>
                <input
                  type="number"
                  value={newTotalPages}
                  onChange={e => setNewTotalPages(e.target.value)}
                  min={1}
                  placeholder="مثال: 250 (اختياري، يحدده القارئ لاحقاً)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 cursor-pointer"
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
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">تعديل بيانات وتصنيف الكتاب</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingBookData(null)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
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

              {/* Category Field in Edit Modal */}
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">التصنيف:</label>
                <select
                  value={editingBookData.categoryId || 'UNCATEGORIZED'}
                  onChange={e => setEditingBookData({ ...editingBookData, categoryId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {Object.entries(BOOK_CATEGORIES).map(([catId, catDef]) => (
                    <option key={catId} value={catId}>
                      {catDef.name} {catId !== 'UNCATEGORIZED' ? `(${catId})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">التصنيف الفرعي (اختياري):</label>
                <input
                  type="text"
                  value={editingBookData.subcategory || ''}
                  onChange={e => setEditingBookData({ ...editingBookData, subcategory: e.target.value })}
                  placeholder="مثال: فقه، عقيدة، رواية عربية..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">إجمالي الصفحات:</label>
                <input
                  type="number"
                  value={editingBookData.totalPages}
                  onChange={e => setEditingBookData({ ...editingBookData, totalPages: e.target.value })}
                  min={0}
                  placeholder="غير محدد (0)"
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
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 cursor-pointer"
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
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
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
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 cursor-pointer"
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
