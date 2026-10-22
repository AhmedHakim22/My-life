import React, { useState } from 'react';
import { Cpu, Plus, Code, CheckCircle2, Award, ExternalLink, BookOpen, Video, Trash2, Globe } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { Skill } from '../types';

export const SkillsTree: React.FC = () => {
  const { skills, addSkill, deleteSkill, learningResources } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('تقني');
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  const categories = ['ALL', 'تقني', 'علمي', 'لغات', 'بزنس', 'مهارات ناعمة'];
  const filteredSkills = skills.filter(s => selectedCategory === 'ALL' || s.category === selectedCategory);

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    await addSkill(newSkillName, newSkillCategory);
    setNewSkillName('');
    setIsAddingSkill(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-xs font-medium text-purple-400 tracking-wide uppercase">مكتبة وشجرة المهارات</span>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            شجرة المهارات 🌳
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingSkill(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md shadow-purple-900/30"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          إضافة مهارة
        </button>
      </div>

      {/* Add Skill Dialog */}
      {isAddingSkill && (
        <form onSubmit={handleCreateSkill} className="bg-slate-900 border border-purple-500/40 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-purple-300">إضافة مهارة جديدة</h3>
          <input
            type="text"
            value={newSkillName}
            onChange={e => setNewSkillName(e.target.value)}
            placeholder="اسم المهارة (مثلاً: Machine Learning, Prompt Engineering)..."
            required
            autoFocus
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          />
          <div className="flex gap-1.5 flex-wrap">
            {(['تقني', 'علمي', 'لغات', 'بزنس', 'مهارات ناعمة'] as Skill['category'][]).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setNewSkillCategory(cat)}
                className={`flex-1 py-1 px-2 text-[11px] rounded-lg border font-medium ${
                  newSkillCategory === cat ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold' : 'border-slate-800 text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsAddingSkill(false)}
              className="text-xs text-slate-400 px-3 py-1.5"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white font-bold text-xs px-4 py-1.5 rounded-xl"
            >
              حفظ المهارة
            </button>
          </div>
        </form>
      )}

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              selectedCategory === cat
                ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'جميع المهارات' : cat}
          </button>
        ))}
      </div>

      {/* Skills Cards with Dual-Bar (Consumption vs Competence) */}
      <div className="space-y-3">
        {filteredSkills.map(skill => (
          <div
            key={skill.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold inline-flex items-center gap-1 ${
                  skill.category === 'لغات'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40'
                    : skill.category === 'علمي'
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/40'
                    : skill.category === 'بزنس'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800/40'
                    : 'bg-purple-950/80 text-purple-300 border-purple-800/40'
                }`}>
                  {skill.category === 'لغات' && <Globe className="w-2.5 h-2.5" />}
                  {skill.category}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1 flex items-center gap-2">
                  <span dir="ltr">{skill.name}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400 font-mono">
                  المستوى {skill.baselineLevel} / {skill.targetLevel}
                </span>
                <button
                  type="button"
                  onClick={() => setDeletingSkillId(skill.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 pressable cursor-pointer"
                  title="حذف المهارة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dual Metric Bars */}
            <div className="space-y-2 pt-1 border-t border-slate-800/60">
              {/* 1. Content Consumption Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Video className="w-3 h-3 text-sky-400" />
                    استهلاك الكورسات والمصادر:
                  </span>
                  <span className="font-mono font-bold text-sky-400">{skill.contentProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all"
                    style={{ width: `${skill.contentProgress}%` }}
                  />
                </div>
              </div>

              {/* 2. Demonstrated Competence Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Award className="w-3 h-3 text-purple-400" />
                    الإتقان والكفاءة بالمشاريع:
                  </span>
                  <span className="font-mono font-bold text-purple-400">{skill.demonstratedCompetence}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{ width: `${skill.demonstratedCompetence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-800/40">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-500" />
                مرتبط بـ 2 مصادر ومشاريع
              </span>
              <span className="text-slate-500">سجل كنسي موحد</span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Skill Confirm Modal */}
      {deletingSkillId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-5 max-w-sm w-full space-y-3">
            <h3 className="text-sm font-bold text-white">تأكيد حذف المهارة</h3>
            <p className="text-xs text-slate-300">هل أنت متأكد من حذف هذه المهارة من شجرة المهارات؟</p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeletingSkillId(null)}
                className="text-xs text-slate-400 px-3 py-1.5"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteSkill(deletingSkillId);
                  setDeletingSkillId(null);
                }}
                className="bg-rose-600 text-white font-bold text-xs px-4 py-1.5 rounded-xl"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
