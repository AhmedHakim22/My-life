import React, { useState } from 'react';
import { 
  Cpu, 
  BookOpen, 
  Video, 
  FileText, 
  FolderPlus, 
  Plus, 
  Award, 
  Link2, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  PlayCircle,
  Trash2,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { Skill, LearningResource, CustomCategory } from '../types';
import { fireConfettiSuccess } from '../lib/confetti';

export const LearningWorkspace: React.FC = () => {
  const { 
    skills, 
    learningResources, 
    courseDetails, 
    categories, 
    skillResources,
    addSkill, 
    updateSkill,
    deleteSkill,
    addCourseResource, 
    linkSkillResource, 
    unlinkSkillResource, 
    addCategory, 
    deleteCategory 
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<'SKILLS' | 'COURSES' | 'RESOURCES' | 'CATEGORIES'>('SKILLS');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [linkingSkillId, setLinkingSkillId] = useState<string | null>(null);

  // Edit / Delete Skill state
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editSkillName, setEditSkillName] = useState('');
  const [editSkillCategory, setEditSkillCategory] = useState('تقني');
  const [editSkillTargetLevel, setEditSkillTargetLevel] = useState(5);

  // New Skill Form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('تقني');
  const [newSkillTargetLevel, setNewSkillTargetLevel] = useState(5);

  // New Course Form
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseUrl, setNewCourseUrl] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseLessonsCount, setNewCourseLessonsCount] = useState(0);

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<CustomCategory['type']>('SKILL');

  // Filter skills
  const filteredSkills = skills.filter(s => {
    const matchesCat = selectedCategoryFilter === 'ALL' || s.category === selectedCategoryFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filter courses
  const courses = learningResources.filter(r => r.type === 'COURSE');

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    await addSkill(newSkillName.trim(), newSkillCategory, newSkillTargetLevel);
    fireConfettiSuccess();
    setNewSkillName('');
    setIsAddSkillModalOpen(false);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    await addCourseResource(
      newCourseTitle.trim(),
      newCourseUrl.trim(),
      newCourseInstructor.trim(),
      120,
      Number(newCourseLessonsCount) || 0
    );
    fireConfettiSuccess();
    setNewCourseTitle('');
    setNewCourseUrl('');
    setNewCourseInstructor('');
    setIsAddCourseModalOpen(false);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    await addCategory({
      name: newCatName.trim(),
      type: newCatType,
      sortOrder: categories.length + 1
    });

    setNewCatName('');
    setIsAddCategoryModalOpen(false);
  };

  const getLinkedResourcesForSkill = (skillId: string) => {
    const links = skillResources.filter(sr => sr.skillId === skillId);
    return links
      .map(l => learningResources.find(r => r.id === l.resourceId))
      .filter(Boolean) as LearningResource[];
  };

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full">
              شبكة المعرفة والإتقان
            </span>
            <span className="text-xs text-slate-400">Knowledge & Skills Graph</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <span>مركز التعلم وشجرة المهارات</span>
            <Cpu className="w-6 h-6 text-purple-400" />
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'SKILLS' && (
            <button
              type="button"
              onClick={() => setIsAddSkillModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-600/25 pressable cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة مهارة</span>
            </button>
          )}

          {activeSubTab === 'COURSES' && (
            <button
              type="button"
              onClick={() => setIsAddCourseModalOpen(true)}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-sky-500/25 pressable cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة كورس</span>
            </button>
          )}

          {activeSubTab === 'CATEGORIES' && (
            <button
              type="button"
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 pressable cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>تصنيف جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Sub-tab Navigation */}
      <div className="grid grid-cols-4 p-1 rounded-2xl bg-slate-950/80 neo-sunken border border-slate-800 text-xs font-bold">
        {[
          { id: 'SKILLS', label: 'المهارات', icon: <Cpu className="w-3.5 h-3.5" /> },
          { id: 'COURSES', label: 'الكورسات', icon: <Video className="w-3.5 h-3.5" /> },
          { id: 'RESOURCES', label: 'المصادر', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'CATEGORIES', label: 'التصنيفات', icon: <Layers className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 pressable cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Sub-tab Content: SKILLS */}
      {activeSubTab === 'SKILLS' && (
        <div className="space-y-4">
          {/* Category Filter & Search */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث في شجرة المهارات (مثال: Python, أشباه الموصلات)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {['ALL', 'تقني', 'علمي', 'بزنس', 'مهارات ناعمة'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-purple-500 text-slate-950 border-purple-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'الكل' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Cards with Truthful Dual Progress & Linked Resources */}
          {filteredSkills.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl text-center space-y-3 border border-slate-800">
              <Cpu className="w-10 h-10 text-purple-400 mx-auto opacity-60" />
              <h3 className="text-sm font-bold text-slate-200">لا توجد مهارات مسجلة</h3>
              <p className="text-xs text-slate-400">
                أضف مهاراتك العلمية والتقنية، واربط بها الكورسات والكتب والمشاريع لإثبات الكفاءة الحقيقية.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSkills.map(skill => {
                const linked = getLinkedResourcesForSkill(skill.id);
                return (
                  <div
                    key={skill.id}
                    className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-3 hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/40">
                          {skill.category}
                        </span>
                        <h3 className="text-base font-extrabold text-white mt-1">
                          <span dir="ltr">{skill.name}</span>
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/40 border border-purple-800/50 px-2 py-0.5 rounded-lg">
                          مستوى {skill.baselineLevel} / {skill.targetLevel}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkill(skill);
                            setEditSkillName(skill.name);
                            setEditSkillCategory(skill.category);
                            setEditSkillTargetLevel(skill.targetLevel);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800/60 pressable cursor-pointer"
                          title="تعديل المهارة"
                          aria-label="تعديل المهارة"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSkill(skill)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 pressable cursor-pointer"
                          title="حذف المهارة"
                          aria-label="حذف المهارة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dual Progress: Consumption vs Competence */}
                    <div className="space-y-2 pt-1 border-t border-slate-800/60">
                      {/* 1. Content Consumption */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Video className="w-3 h-3 text-sky-400" />
                            استهلاك الكورسات والمصادر:
                          </span>
                          <span className="font-mono font-bold text-sky-400">{skill.contentProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-sky-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${skill.contentProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* 2. Demonstrated Competence */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Award className="w-3 h-3 text-purple-400" />
                            الإتقان والكفاءة بالمشاريع:
                          </span>
                          <span className="font-mono font-bold text-purple-400">{skill.demonstratedCompetence}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-purple-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${skill.demonstratedCompetence}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Truthful Dynamic Linked Resources (No More Static Strings!) */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/50">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1 font-medium">
                          <Link2 className="w-3 h-3 text-purple-400" />
                          <span>المصادر المرتبطة:</span>
                          <strong className="text-white font-mono">{linked.length}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setLinkingSkillId(skill.id)}
                          className="text-[10px] font-bold text-purple-400 hover:text-purple-300 pressable cursor-pointer"
                        >
                          + ربط مورد
                        </button>
                      </div>

                      {linked.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {linked.map(res => (
                            <span 
                              key={res.id}
                              className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1 truncate max-w-[200px]"
                            >
                              {res.type === 'BOOK' && <BookOpen className="w-2.5 h-2.5 text-emerald-400" />}
                              {res.type === 'COURSE' && <Video className="w-2.5 h-2.5 text-sky-400" />}
                              <span className="truncate">{res.title}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Sub-tab Content: COURSES */}
      {activeSubTab === 'COURSES' && (
        <div className="space-y-3">
          {courses.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl text-center space-y-3 border border-slate-800">
              <Video className="w-10 h-10 text-sky-400 mx-auto opacity-60" />
              <h3 className="text-sm font-bold text-slate-200">لا توجد كورسات مسجلة</h3>
              <p className="text-xs text-slate-400">
                أضف كورس يوتيوب أو دورة تدريبية وتابع إنجازك دون أي عدد دروس إجباري.
              </p>
              <button
                type="button"
                onClick={() => setIsAddCourseModalOpen(true)}
                className="bg-sky-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl pressable cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة كورس أول</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map(course => {
                const details = courseDetails.find(d => d.resourceId === course.id);
                return (
                  <div
                    key={course.id}
                    className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-sky-300 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800/40">
                          {course.provider || 'كورس تعليمي'}
                        </span>
                        <h3 className="text-sm font-extrabold text-white">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          المحاضر: {details?.instructor || 'غير محدد'}
                        </p>
                      </div>

                      {course.sourceUrl && (
                        <a
                          href={course.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 rounded-xl pressable"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/50">
                      <span>
                        الدروس: {details?.completedLessons || 0} / {details?.totalLessons || 0}
                      </span>
                      <span className="font-mono text-sky-400 font-bold">
                        {details && details.totalLessons > 0 
                          ? Math.round((details.completedLessons / details.totalLessons) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Sub-tab Content: CATEGORIES */}
      {activeSubTab === 'CATEGORIES' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-400">
              إدارة الأقسام والتصنيفات المخصصة لكل مهارة وكتاب ومصدر
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {categories.map(cat => (
              <div 
                key={cat.id}
                className="glass-panel p-3 rounded-2xl border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{cat.name}</div>
                  <span className="text-[10px] text-slate-500 font-mono">نوع: {cat.type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1 text-slate-600 hover:text-rose-400 pressable cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Sub-tab Content: RESOURCES HUB */}
      {activeSubTab === 'RESOURCES' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 px-1">
            المستودع الأصيل الموحد (Canonical Resource Hub): مورد واحد يمكن ربطه بعدة مهارات وأهداف دون استنساخ.
          </div>

          <div className="space-y-2">
            {learningResources.map(res => (
              <div
                key={res.id}
                className="glass-panel p-3 rounded-2xl border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400">
                    {res.type === 'BOOK' && <BookOpen className="w-4 h-4" />}
                    {res.type === 'COURSE' && <Video className="w-4 h-4" />}
                    {res.type === 'VIDEO' && <PlayCircle className="w-4 h-4" />}
                    {res.type === 'PAPER' && <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{res.title}</div>
                    <span className="text-[10px] text-slate-400">{res.provider || res.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Add Skill Modal */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>إضافة مهارة جديدة لشجرة المهارات</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddSkillModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسم المهارة *
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="مثال: Semiconductor Physics, Machine Learning, Python..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    التصنيف
                  </label>
                  <select
                    value={newSkillCategory}
                    onChange={e => setNewSkillCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="تقني">تقني</option>
                    <option value="علمي">علمي</option>
                    <option value="بزنس">بزنس</option>
                    <option value="مهارات ناعمة">مهارات ناعمة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    المستوى المستهدف
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSkillTargetLevel}
                    onChange={e => setNewSkillTargetLevel(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSkillModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-lg shadow-purple-600/25 pressable cursor-pointer"
                >
                  حفظ المهارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Add Course Modal (Without fabricated 10 lessons!) */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-sky-400" />
                <span>إضافة كورس ومسار تعليمي جديد</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عنوان الكورس *
                </label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={e => setNewCourseTitle(e.target.value)}
                  placeholder="مثال: مقدمة في فيزياء وتصنيع أشباه الموصلات..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  رابط الكورس (يوتيوب أو المنصة)
                </label>
                <input
                  type="url"
                  value={newCourseUrl}
                  onChange={e => setNewCourseUrl(e.target.value)}
                  placeholder="https://youtube.com/playlist..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    اسم المحاضر / المنصة
                  </label>
                  <input
                    type="text"
                    value={newCourseInstructor}
                    onChange={e => setNewCourseInstructor(e.target.value)}
                    placeholder="مثال: MIT OCW, Coursera..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    إجمالي الدروس (اختياري)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCourseLessonsCount}
                    onChange={e => setNewCourseLessonsCount(Number(e.target.value))}
                    placeholder="0 = غير محدد"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl shadow-lg shadow-sky-500/25 pressable cursor-pointer"
                >
                  حفظ الكورس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Linking Modal (Link Resource to Skill) */}
      {linkingSkillId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-purple-400" />
                <span>ربط مورد تعليمي بالمهارة</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setLinkingSkillId(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {learningResources.map(res => {
                const isLinked = skillResources.some(sr => sr.skillId === linkingSkillId && sr.resourceId === res.id);
                return (
                  <div
                    key={res.id}
                    className="p-3 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{res.title}</div>
                      <span className="text-[10px] text-slate-400">{res.type} — {res.provider}</span>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        if (isLinked) {
                          await unlinkSkillResource(linkingSkillId, res.id);
                        } else {
                          await linkSkillResource(linkingSkillId, res.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isLinked
                          ? 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                          : 'bg-purple-600 border-purple-500 text-white'
                      }`}
                    >
                      {isLinked ? 'فك الارتباط' : 'ربط بالمهارة'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Skill Confirmation Modal */}
      {deletingSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">حذف المهارة</h3>
                <p className="text-xs text-slate-400">تأكيد إزالة المهارة من شجرة المعرفة</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white">هل أنت متأكد من حذف مهارة "{deletingSkill.name}"؟</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                سيتم فك ارتباط المهارة بالكتب والكورسات دون حذف المصادر نفسها، وسيتم تسجيل شاهد حذف لمنع عودتها عند المزامنة.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={async () => {
                  await deleteSkill(deletingSkill.id);
                  setDeletingSkill(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl pressable cursor-pointer shadow-lg shadow-rose-900/40"
              >
                نعم، احذف المهارة
              </button>
              <button
                type="button"
                onClick={() => setDeletingSkill(null)}
                className="bg-slate-800 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl pressable cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">تعديل المهارة</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!editSkillName.trim()) return;
                await updateSkill(editingSkill.id, {
                  name: editSkillName.trim(),
                  category: editSkillCategory,
                  targetLevel: Number(editSkillTargetLevel) || 5
                });
                setEditingSkill(null);
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">اسم المهارة</label>
                <input
                  type="text"
                  value={editSkillName}
                  onChange={e => setEditSkillName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">التصنيف</label>
                <select
                  value={editSkillCategory}
                  onChange={e => setEditSkillCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="تقني">تقني (Technical)</option>
                  <option value="علمي">علمي (Scientific)</option>
                  <option value="بزنس">بزنس وإدارة (Business)</option>
                  <option value="مهارات ناعمة">مهارات ناعمة (Soft Skills)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">المستوى المستهدف (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={editSkillTargetLevel}
                  onChange={e => setEditSkillTargetLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl pressable cursor-pointer shadow-lg shadow-purple-900/40"
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="bg-slate-800 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl pressable cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
