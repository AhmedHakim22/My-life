import React, { useState } from 'react';
import { 
  Atom, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  GraduationCap, 
  Sparkles, 
  TreeDeciduous, 
  Plus, 
  Video, 
  Award, 
  BookOpen, 
  Edit3, 
  Trash2, 
  X,
  FileText,
  CheckSquare,
  Brain,
  Rocket,
  MapPin,
  Check,
  Flame,
  ChevronDown,
  Info,
  Globe
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { StudySessionStatus, StudySession, Skill, UniversitySubject, AcademicQuiz, AcademicAssignment, StudentActivityTask } from '../types';
import { fireConfettiSuccess } from '../lib/confetti';

export const UniversityWorkspace: React.FC = () => {
  const { 
    universitySubjects, 
    studySessions, 
    timetableSlots,
    academicQuizzes,
    academicAssignments,
    studentActivities,
    addUniversitySubject,
    updateUniversitySubject,
    deleteUniversitySubject,
    addStudySession,
    deleteStudySession,
    toggleLectureStep,
    addQuiz,
    toggleQuizPrepared,
    toggleQuizAttended,
    recordQuizScore,
    deleteQuiz,
    addAssignment,
    toggleAssignmentCompleted,
    toggleAssignmentSubmitted,
    deleteAssignment,
    addStudentActivity,
    toggleStudentActivityDone,
    deleteStudentActivity,
    recordStudyReview,
    skills,
    addSkill,
    showToast
  } = useAppStore();

  // Sub-tabs: Ahmed's Study Planner System
  type PlannerTab = 'LECTURES' | 'ASSIGNMENTS' | 'QUIZZES' | 'TIMETABLE' | 'ACTIVITIES' | 'SKILLS';
  const [activeTab, setActiveTab] = useState<PlannerTab>('LECTURES');

  // Selected Subject for Lecture View
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    universitySubjects[0]?.id || ''
  );
  const selectedSubject = universitySubjects.find(s => s.id === selectedSubjectId) || universitySubjects[0];
  const subjectSessions = studySessions.filter(s => s.subjectId === selectedSubject?.id);

  // Modals state
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isAddQuizOpen, setIsAddQuizOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [reviewingSession, setReviewingSession] = useState<StudySession | null>(null);

  // Form State: Subject
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subYear, setSubYear] = useState<number>(3);
  const [subSemester, setSubSemester] = useState<number>(1);
  const [subProfessor, setSubProfessor] = useState('');
  const [subExamDate, setSubExamDate] = useState('');
  const [subFocus, setSubFocus] = useState<'High' | 'Normal'>('Normal');
  const [subDifficulty, setSubDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

  // Form State: Lecture
  const [newLectureTitle, setNewLectureTitle] = useState('');
  const [newLectureNum, setNewLectureNum] = useState<number>(1);
  const [newLectureNotes, setNewLectureNotes] = useState('');

  // Form State: Assignment
  const [asgnName, setAsgnName] = useState('');
  const [asgnSubId, setAsgnSubId] = useState('');
  const [asgnDeadline, setAsgnDeadline] = useState('');

  // Form State: Quiz
  const [quizTopic, setQuizTopic] = useState('');
  const [quizSubId, setQuizSubId] = useState('');
  const [quizDate, setQuizDate] = useState('');
  const [quizSyllabus, setQuizSyllabus] = useState('');

  // Form State: Activity
  const [actName, setActName] = useState('NASA Space Apps');
  const [actTask, setActTask] = useState('');
  const [actDeadline, setActDeadline] = useState('');

  // Skills Tree State
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('ALL');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('علمي');

  // KPI Calculations from Ahmed's Sheet Logic
  const lecturesToStudyCount = studySessions.filter(s => s.materialReady && !s.studyDone).length;
  const readyToSubmitCount = academicAssignments.filter(a => a.completed && !a.submitted).length;
  
  // Midterm countdown (tentative start: 2026-11-07)
  const today = new Date();
  const midtermDate = new Date('2026-11-07');
  const diffTime = midtermDate.getTime() - today.getTime();
  const daysToMidterm = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Next 7 days quizzes count
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const quizzesNext7Days = academicQuizzes.filter(q => {
    if (!q.quizDate || q.attended) return false;
    const qDate = new Date(q.quizDate);
    return qDate >= today && qDate <= sevenDaysFromNow;
  }).length;

  const openActivityCount = studentActivities.filter(a => !a.done).length;

  // Open Edit Subject Modal
  const openEditSubjectModal = (subj: UniversitySubject) => {
    setSubName(subj.name);
    setSubCode(subj.code);
    setSubYear(subj.academicYear);
    setSubSemester(subj.semester);
    setSubProfessor(subj.professor || '');
    setSubExamDate(subj.examDate || '');
    setSubFocus(subj.focus || 'Normal');
    setSubDifficulty(subj.difficulty || 'MEDIUM');
    setIsEditSubjectOpen(true);
  };

  // Handlers
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;

    const newId = await addUniversitySubject({
      name: subName.trim(),
      code: subCode.trim().toUpperCase(),
      academicYear: Number(subYear),
      semester: Number(subSemester),
      professor: subProfessor.trim() || undefined,
      examDate: subExamDate || undefined,
      focus: subFocus,
      difficulty: subDifficulty
    });

    setSelectedSubjectId(newId);
    setIsAddSubjectOpen(false);
    fireConfettiSuccess();
  };

  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;

    await updateUniversitySubject(selectedSubject.id, {
      name: subName.trim(),
      code: subCode.trim().toUpperCase(),
      academicYear: Number(subYear),
      semester: Number(subSemester),
      professor: subProfessor.trim() || undefined,
      examDate: subExamDate || undefined,
      focus: subFocus,
      difficulty: subDifficulty
    });

    setIsEditSubjectOpen(false);
    fireConfettiSuccess();
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;
    if (confirm(`حذف مقرر "${selectedSubject.name}" وجميع محاضراته؟`)) {
      await deleteUniversitySubject(selectedSubject.id);
      setIsEditSubjectOpen(false);
      const remaining = universitySubjects.filter(s => s.id !== selectedSubject.id);
      if (remaining.length > 0) setSelectedSubjectId(remaining[0].id);
    }
  };

  const handleOpenAddLecture = () => {
    if (!selectedSubject) return;
    const currentLectures = studySessions.filter(s => s.subjectId === selectedSubject.id);
    const maxNum = currentLectures.reduce((max, s) => Math.max(max, s.lectureNumber || 0), 0);
    const nextNum = maxNum + 1;
    setNewLectureNum(nextNum);
    setNewLectureTitle(`المحاضرة ${nextNum}`);
    setNewLectureNotes('');
    setIsAddLectureOpen(true);
  };

  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !newLectureTitle.trim()) return;

    await addStudySession({
      subjectId: selectedSubject.id,
      title: newLectureTitle.trim(),
      type: 'LECTURE',
      lectureNumber: Number(newLectureNum) || 1,
      status: 'STUDIED',
      materialReady: false,
      studyDone: false,
      reviseDone: false,
      solveDone: false,
      notes: newLectureNotes.trim() || undefined
    });

    setNewLectureTitle('');
    setNewLectureNotes('');
    setIsAddLectureOpen(false);
    fireConfettiSuccess();
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgnName.trim()) return;
    const targetSub = universitySubjects.find(s => s.id === asgnSubId) || selectedSubject;

    await addAssignment({
      taskName: asgnName.trim(),
      subjectId: targetSub?.id || 'subj-other',
      subjectName: targetSub?.name || 'مقرر عام',
      deadline: asgnDeadline || new Date().toISOString().split('T')[0],
      completed: false,
      submitted: false,
      blocked: false
    });

    setAsgnName('');
    setAsgnDeadline('');
    setIsAddAssignmentOpen(false);
    fireConfettiSuccess();
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;
    const targetSub = universitySubjects.find(s => s.id === quizSubId) || selectedSubject;

    await addQuiz({
      topic: quizTopic.trim(),
      subjectId: targetSub?.id || 'subj-other',
      subjectName: targetSub?.name || 'مقرر عام',
      quizDate: quizDate || new Date().toISOString().split('T')[0],
      syllabusScope: quizSyllabus.trim() || undefined,
      prepared: false,
      attended: false
    });

    setQuizTopic('');
    setQuizSyllabus('');
    setIsAddQuizOpen(false);
    fireConfettiSuccess();
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTask.trim()) return;

    await addStudentActivity({
      activityName: actName,
      taskName: actTask.trim(),
      deadline: actDeadline || undefined,
      done: false
    });

    setActTask('');
    setActDeadline('');
    setIsAddActivityOpen(false);
    fireConfettiSuccess();
  };

  const handleReviewFSRS = async (grade: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY') => {
    if (!reviewingSession) return;
    if (grade === 'GOOD' || grade === 'EASY') fireConfettiSuccess();
    await recordStudyReview(reviewingSession.id, grade);
    setReviewingSession(null);
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    await addSkill(newSkillName, newSkillCategory);
    setNewSkillName('');
    setIsAddingSkill(false);
    fireConfettiSuccess();
    showToast(`تمت إضافة مهارة "${newSkillName}" بنجاح 🌳`);
  };

  const filteredSkills = skills.filter(s => selectedSkillCategory === 'ALL' || s.category === selectedSkillCategory);

  return (
    <div className="space-y-4 pb-24 pt-3 relative">
      {/* 3D Ambient Purple Glow (Trend 8) */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header & Ahmed's Study Pulse Dashboard (Apple HIG Design) */}
      <header className="apple-card rounded-[28px] p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-sky-300 tracking-wider uppercase flex items-center gap-1.5">
              <span>AHMED STUDY PLANNER</span>
              <span className="text-sky-400">✦</span>
              <span className="text-purple-300">جامعة القاهرة • نانوتكنولوجي</span>
            </span>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
              الأكاديمية ونبض المواد 🎓
            </h1>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.3)]">
            <Atom className="w-5 h-5 animate-spin-slow" />
          </div>
        </div>

        {/* Ahmed's Golden Rule Banner */}
        <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-400/30 flex items-center gap-2 text-xs text-sky-200 shadow-sm backdrop-blur-md">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <b>القاعدة الذهبية:</b> خطوة واحدة كل مرة — شوف الكويز أو التسليم الأقرب، وبعدها ذاكر المادة الأعلى أولوية.
          </span>
        </div>

        {/* Ahmed's 5 Quick Workload KPIs */}
        <div className="grid grid-cols-5 gap-1.5 text-center">
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[9px] text-slate-400 font-bold">باقي عالميد</div>
            <div className="text-xs font-black text-red-400 font-mono mt-0.5">{daysToMidterm} يوم</div>
          </div>
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[9px] text-slate-400 font-bold">للمذاكرة</div>
            <div className="text-xs font-black text-sky-300 font-mono mt-0.5">{lecturesToStudyCount} مح</div>
          </div>
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[9px] text-slate-400 font-bold">جاهز للتسليم</div>
            <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">{readyToSubmitCount} واجب</div>
          </div>
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[9px] text-slate-400 font-bold">كويز 7 أيام</div>
            <div className="text-xs font-black text-amber-400 font-mono mt-0.5">{quizzesNext7Days}</div>
          </div>
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[9px] text-slate-400 font-bold">NASA & Sciora</div>
            <div className="text-xs font-black text-purple-300 font-mono mt-0.5">{openActivityCount} نشاط</div>
          </div>
        </div>

        {/* Ahmed's 6 Sub-Tabs Navigation */}
        <div className="apple-segmented-container grid grid-cols-3 sm:grid-cols-6 gap-1 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('LECTURES')}
            className={`py-2 px-1.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 pressable cursor-pointer ${
              activeTab === 'LECTURES'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>المحاضرات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ASSIGNMENTS')}
            className={`py-2 px-1.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 pressable cursor-pointer ${
              activeTab === 'ASSIGNMENTS'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>التكليفات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('QUIZZES')}
            className={`py-2 px-1.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 pressable cursor-pointer ${
              activeTab === 'QUIZZES'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>الكويزات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TIMETABLE')}
            className={`py-2 px-1.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 pressable cursor-pointer ${
              activeTab === 'TIMETABLE'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>الجدول</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACTIVITIES')}
            className={`py-2 px-1.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 pressable cursor-pointer ${
              activeTab === 'ACTIVITIES'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>الأنشطة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SKILLS')}
            className={`py-2 px-1.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 pressable cursor-pointer ${
              activeTab === 'SKILLS'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TreeDeciduous className="w-3.5 h-3.5" />
            <span>المهارات</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 01 / LECTURES TRACKER (Ahmed's 3-step Study Checklist)   */}
      {/* ======================================================== */}
      {activeTab === 'LECTURES' && (
        <div className="space-y-4">
          {/* Top Bar with Add Subject Button */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300">
              المقررات المسجلة ({universitySubjects.length})
            </span>

            <button
              type="button"
              onClick={() => {
                setSubName('');
                setSubCode('');
                setSubProfessor('');
                setSubExamDate('');
                setIsAddSubjectOpen(true);
              }}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/25 pressable cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة مادة جديدة</span>
            </button>
          </div>

          {/* Subject Selector Pills (Horizontal Scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {universitySubjects.map(sub => {
              const isSelected = sub.id === selectedSubject?.id;
              return (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 pressable cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/25'
                      : 'glass-panel border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5" />
                  <span>{sub.name}</span>
                  {sub.focus === 'High' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" title="أولوية مرتفعة High Focus" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Subject Overview Card */}
          {selectedSubject && (
            <section className="glass-panel-glow rounded-3xl p-5 space-y-4 border border-sky-500/30 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-sky-950/80 text-sky-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-sky-700/50">
                      {selectedSubject.code}
                    </span>
                    {selectedSubject.focus === 'High' && (
                      <span className="text-[10px] bg-amber-950/80 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-600/40">
                        High Focus ⭐
                      </span>
                    )}
                    {selectedSubject.hall && (
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {selectedSubject.hall}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-black text-white mt-1">
                    {selectedSubject.name}
                  </h2>
                  <p className="text-xs text-slate-300 font-medium">
                    المحاضر: <strong className="text-white">{selectedSubject.professor || 'غير محدد'}</strong>
                    {selectedSubject.scheduleDescription && (
                      <span className="text-slate-400 mr-2">({selectedSubject.scheduleDescription})</span>
                    )}
                  </p>
                </div>

                {/* Exam Date Pill */}
                {selectedSubject.examDate && (
                  <div className="bg-red-950/60 border border-red-600/40 p-3 rounded-2xl text-center shrink-0 shadow-lg shadow-red-950/40">
                    <Calendar className="w-4 h-4 text-red-400 mx-auto" />
                    <div className="text-[10px] text-red-300 font-bold mt-1">امتحان ميدترم</div>
                    <div className="text-[11px] text-white font-mono font-black mt-0.5">
                      {selectedSubject.examDate}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Toolbar: Edit & Add Lecture */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                <button
                  type="button"
                  onClick={() => openEditSubjectModal(selectedSubject)}
                  className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3.5 rounded-xl border border-slate-700 flex items-center gap-1.5 pressable cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>تعديل المادة</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddLecture}
                  className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 pressable cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة محاضرة جديدة</span>
                </button>
              </div>
            </section>
          )}

          {/* Ahmed's Lecture Checklist Cards: Study, Revise, Solve */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                محاضرات المقرر ({subjectSessions.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Study ☑ • Revise ☑ • Solve ☑
              </span>
            </div>

            <div className="space-y-3">
              {subjectSessions.map(session => (
                <div
                  key={session.id}
                  className="glass-panel border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60 font-mono">
                          محاضرة {session.lectureNumber || 1}
                        </span>
                        {session.materialReady ? (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/40 font-bold">
                            الداتا جاهزة 📂
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                            الداتا غير متوفرة بعد
                          </span>
                        )}
                        {session.priority === 'High' && (
                          <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700/40 font-bold">
                            High Priority ⭐
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug pt-0.5">
                        {session.title}
                      </h4>
                      {session.notes && (
                        <p className="text-[11px] text-slate-400">{session.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setReviewingSession(session)}
                        className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/50 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 pressable cursor-pointer shadow-md"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                        <span>FSRS</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`حذف المحاضرة "${session.title}"؟`)) {
                            await deleteStudySession(session.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ahmed's 4 Toggle Checkboxes */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/60">
                    {/* 1. Material Ready Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleLectureStep(session.id, 'material')}
                      className={`p-2 rounded-xl border text-center transition-all pressable cursor-pointer ${
                        session.materialReady
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[9px]">الداتا مجهزة</div>
                      <div className="text-xs font-mono font-bold mt-0.5">
                        {session.materialReady ? '1 ☑' : '0 ☐'}
                      </div>
                    </button>

                    {/* 2. Study Step */}
                    <button
                      type="button"
                      onClick={() => toggleLectureStep(session.id, 'study')}
                      className={`p-2 rounded-xl border text-center transition-all pressable cursor-pointer ${
                        session.studyDone
                          ? 'bg-sky-950/60 border-sky-500/50 text-sky-300 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[9px]">Study (مذاكرة)</div>
                      <div className="text-xs font-mono font-bold mt-0.5">
                        {session.studyDone ? '1 ☑' : '0 ☐'}
                      </div>
                    </button>

                    {/* 3. Revise Step */}
                    <button
                      type="button"
                      onClick={() => toggleLectureStep(session.id, 'revise')}
                      className={`p-2 rounded-xl border text-center transition-all pressable cursor-pointer ${
                        session.reviseDone
                          ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[9px]">Revise (مراجعة)</div>
                      <div className="text-xs font-mono font-bold mt-0.5">
                        {session.reviseDone ? '1 ☑' : '0 ☐'}
                      </div>
                    </button>

                    {/* 4. Solve Step */}
                    <button
                      type="button"
                      onClick={() => toggleLectureStep(session.id, 'solve')}
                      className={`p-2 rounded-xl border text-center transition-all pressable cursor-pointer ${
                        session.solveDone
                          ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[9px]">Solve (حل شيت)</div>
                      <div className="text-xs font-mono font-bold mt-0.5">
                        {session.solveDone ? '1 ☑' : '0 ☐'}
                      </div>
                    </button>
                  </div>
                </div>
              ))}

              {subjectSessions.length === 0 && (
                <div className="glass-panel p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400 space-y-2">
                  <FileText className="w-6 h-6 text-sky-400 mx-auto" />
                  <p className="font-bold">لا توجد محاضرات مضافة لهذا المقرر بعد</p>
                  <button
                    type="button"
                    onClick={handleOpenAddLecture}
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold text-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    اضغط هنا لإضافة أول محاضرة
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* 02 / ASSIGNMENTS TRACKER (Completed vs Submitted)         */}
      {/* ======================================================== */}
      {activeTab === 'ASSIGNMENTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                جدول التكليفات والواجبات ({academicAssignments.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                القاعدة: الواجب الـ Completed فقط يفضل ظاهر في قائمتك لحد ما يتعلم Submitted!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddAssignmentOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/30 pressable cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة تكليف</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {academicAssignments.map(asgn => (
              <div
                key={asgn.id}
                className={`glass-panel border rounded-2xl p-4 space-y-3 transition-all ${
                  asgn.submitted ? 'border-emerald-500/40 opacity-75' : asgn.completed ? 'border-sky-500/40' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                        {asgn.subjectName}
                      </span>
                      <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700/40 font-mono">
                        موعد التسليم: {asgn.deadline}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {asgn.taskName}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteAssignment(asgn.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Ahmed's Completed vs Submitted Controls */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => toggleAssignmentCompleted(asgn.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all pressable cursor-pointer flex items-center justify-center gap-2 ${
                      asgn.completed
                        ? 'bg-sky-950/70 border-sky-500 text-sky-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{asgn.completed ? 'تم الحل (Completed ☑)' : 'أكملت الحل؟ (1/0)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAssignmentSubmitted(asgn.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all pressable cursor-pointer flex items-center justify-center gap-2 ${
                      asgn.submitted
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{asgn.submitted ? 'سُلِّم رسمياً (Submitted ☑)' : 'سلّمته؟ (1/0)'}</span>
                  </button>
                </div>
              </div>
            ))}

            {academicAssignments.length === 0 && (
              <div className="glass-panel p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400 space-y-2">
                <CheckSquare className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold">لا توجد تكليفات أو واجبات مسجلة حالياً</p>
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(true)}
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة تكليف جديد
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 03 / QUIZZES TRACKER (Prepared vs Attended & Scores)      */}
      {/* ======================================================== */}
      {activeTab === 'QUIZZES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                جدول الكويزات والامتحانات ({academicQuizzes.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                علم على الاستعداد والحضور، وسجل درجتك اختيارياً!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddQuizOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-900/30 pressable cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة كويز</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {academicQuizzes.map(quiz => (
              <div
                key={quiz.id}
                className="glass-panel border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                        {quiz.subjectName}
                      </span>
                      <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700/40 font-mono">
                        تاريخ الكويز: {quiz.quizDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {quiz.topic}
                    </h4>
                    {quiz.syllabusScope && (
                      <p className="text-[11px] text-slate-400">نطاق المنهج: {quiz.syllabusScope}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteQuiz(quiz.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Ahmed's Prepared vs Attended Checkboxes */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => toggleQuizPrepared(quiz.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all pressable cursor-pointer flex items-center justify-center gap-2 ${
                      quiz.prepared
                        ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{quiz.prepared ? 'مستعد للكويز (Prepared ☑)' : 'استعديت؟ (1/0)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleQuizAttended(quiz.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all pressable cursor-pointer flex items-center justify-center gap-2 ${
                      quiz.attended
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>{quiz.attended ? 'حضرت الكويز (Attended ☑)' : 'حضرت؟ (1/0)'}</span>
                  </button>
                </div>
              </div>
            ))}

            {academicQuizzes.length === 0 && (
              <div className="glass-panel p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400 space-y-2">
                <Brain className="w-6 h-6 text-amber-400 mx-auto" />
                <p className="font-bold">لا توجد كويزات مسجلة حالياً</p>
                <button
                  type="button"
                  onClick={() => setIsAddQuizOpen(true)}
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة موعد كويز قادم
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 04 / WEEKLY TIMETABLE (Ahmed's Class Schedule)           */}
      {/* ======================================================== */}
      {activeTab === 'TIMETABLE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                جدول المحاضرات الجامعية الأسبوعي 🏫
              </h3>
              <p className="text-[11px] text-slate-400">
                يوم الكلية: 2 ساعة مذاكرة صافية كقاعدة بسيطة.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء'].map(day => {
              const daySlots = timetableSlots.filter(s => s.day === day);
              if (daySlots.length === 0) return null;

              return (
                <div key={day} className="glass-panel border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-sm font-black text-sky-400">{day}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                      يوم كلية • 2 ساعة مذاكرة مقترحة
                    </span>
                  </div>

                  <div className="space-y-2">
                    {daySlots.map(slot => (
                      <div
                        key={slot.id}
                        className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                              {slot.subjectCode}
                            </span>
                            <span className="text-xs font-bold text-white">{slot.subjectName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                            <span>{slot.startTime} – {slot.endTime ?? 'وقت الانتهاء غير محدد'}</span>
                            <span>•</span>
                            <span className="text-emerald-400">{slot.hall}</span>
                            <span>•</span>
                            <span className="text-slate-500">{slot.format}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 05 / ACTIVITIES (NASA Space Apps & Sciora)                */}
      {/* ======================================================== */}
      {activeTab === 'ACTIVITIES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                الأنشطة والمسابقات (NASA & Sciora) 🚀
              </h3>
              <p className="text-[11px] text-slate-400">
                سجل مهامك بالأنشطة الخارجية وتابع مواعيد المسابقة!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddActivityOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-900/30 pressable cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة نشاط</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {studentActivities.map(act => (
              <div
                key={act.id}
                className="glass-panel border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-purple-950/80 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-800/40">
                      {act.activityName}
                    </span>
                    {act.deadline && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        الموعد: {act.deadline}
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs font-bold leading-snug truncate ${act.done ? 'line-through text-slate-500' : 'text-white'}`}>
                    {act.taskName}
                  </h4>
                  {act.notes && (
                    <p className="text-[10px] text-slate-500 truncate">{act.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleStudentActivityDone(act.id)}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all pressable cursor-pointer ${
                      act.done ? 'bg-purple-500 text-white border-purple-400 shadow-md' : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {act.done && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteStudentActivity(act.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 06 / SKILLS TREE & LINKED COURSES                         */}
      {/* ======================================================== */}
      {activeTab === 'SKILLS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300">
              شجرة المهارات والكفاءات ({filteredSkills.length})
            </span>

            <button
              type="button"
              onClick={() => setIsAddingSkill(true)}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-400 hover:to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-fuchsia-900/30 pressable cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة مهارة</span>
            </button>
          </div>

          {/* Add Skill Modal/Form */}
          {isAddingSkill && (
            <form onSubmit={handleCreateSkill} className="glass-panel-purple rounded-3xl p-4.5 space-y-3.5 border border-purple-500/40">
              <h3 className="text-xs font-bold text-purple-200">إضافة مهارة تقنية أو علمية جديدة</h3>
              <input
                type="text"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="اسم المهارة (مثلاً: Nanomaterials Synthesis, Python)..."
                required
                autoFocus
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
              />

              <div className="flex gap-1.5 flex-wrap">
                {(['علمي', 'تقني', 'لغات', 'بزنس', 'مهارات ناعمة'] as Skill['category'][]).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewSkillCategory(cat)}
                    className={`flex-1 py-1.5 px-2 text-[11px] rounded-xl border font-bold transition-all pressable cursor-pointer ${
                      newSkillCategory === cat 
                        ? 'bg-purple-500 text-white border-purple-400 shadow-md' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ المهارة في الشجرة
                </button>
              </div>
            </form>
          )}

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'علمي', 'تقني', 'لغات', 'بزنس', 'مهارات ناعمة'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedSkillCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all pressable cursor-pointer ${
                  selectedSkillCategory === cat
                    ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                    : 'glass-panel border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'جميع المهارات' : cat}
              </button>
            ))}
          </div>

          {/* Skills Cards with Dual-Bar */}
          <div className="space-y-3">
            {filteredSkills.map(skill => (
              <div
                key={skill.id}
                className="glass-panel border border-slate-800/80 rounded-3xl p-4.5 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-flex items-center gap-1 ${
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
                    <h3 className="text-sm font-bold text-white mt-1.5 flex items-center gap-2">
                      <span dir="ltr">{skill.name}</span>
                    </h3>
                  </div>

                  <div className="text-left font-mono">
                    <span className="text-xs font-extrabold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
                      المستوى {skill.baselineLevel} / {skill.targetLevel}
                    </span>
                  </div>
                </div>

                {/* Dual Metric Bars */}
                <div className="space-y-2.5 pt-1 border-t border-slate-800/60">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Video className="w-3.5 h-3.5 text-sky-400" />
                        استهلاك الكورسات والمصادر:
                      </span>
                      <span className="font-mono font-bold text-sky-400">{skill.contentProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 neo-sunken h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.contentProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        الإتقان العملي والمشاريع:
                      </span>
                      <span className="font-mono font-bold text-purple-400">{skill.demonstratedCompetence}%</span>
                    </div>
                    <div className="w-full bg-slate-950 neo-sunken h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.demonstratedCompetence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD SUBJECT                                       */}
      {/* ======================================================== */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Atom className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">إضافة مقرر أكاديمي جديد</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddSubjectOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">اسم المقرر / المادة:</label>
                <input
                  type="text"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  placeholder="مثال: Thermodynamics and Phase"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">كود المادة:</label>
                  <input
                    type="text"
                    value={subCode}
                    onChange={e => setSubCode(e.target.value)}
                    placeholder="مثال: NAC 3510"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">الأولوية (Focus):</label>
                  <select
                    value={subFocus}
                    onChange={e => setSubFocus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Normal">عادية (Normal)</option>
                    <option value="High">مرتفعة (High Focus ⭐)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">المحاضر / دكتور المقرر:</label>
                <input
                  type="text"
                  value={subProfessor}
                  onChange={e => setSubProfessor(e.target.value)}
                  placeholder="مثال: د. محمود عادل"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">تاريخ امتحان الميدترم:</label>
                <input
                  type="date"
                  value={subExamDate}
                  onChange={e => setSubExamDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ المقرر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT SUBJECT                                      */}
      {/* ======================================================== */}
      {isEditSubjectOpen && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">تعديل بيانات المقرر</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditSubjectOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubject} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">اسم المقرر:</label>
                <input
                  type="text"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">كود المادة:</label>
                  <input
                    type="text"
                    value={subCode}
                    onChange={e => setSubCode(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">التركيز (Focus):</label>
                  <select
                    value={subFocus}
                    onChange={e => setSubFocus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High Focus ⭐</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">المحاضر:</label>
                <input
                  type="text"
                  value={subProfessor}
                  onChange={e => setSubProfessor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">موعد الامتحان:</label>
                <input
                  type="date"
                  value={subExamDate}
                  onChange={e => setSubExamDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleDeleteSubject}
                  className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف المقرر
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditSubjectOpen(false)}
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD LECTURE                                       */}
      {/* ======================================================== */}
      {isAddLectureOpen && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">إضافة محاضرة جديدة</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddLectureOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLecture} className="space-y-3">
              <p className="text-xs text-sky-300 font-medium">المقرر: {selectedSubject.name}</p>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">رقم المحاضرة:</label>
                  <input
                    type="number"
                    value={newLectureNum}
                    onChange={e => setNewLectureNum(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono text-center"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">عنوان المحاضرة:</label>
                  <input
                    type="text"
                    value={newLectureTitle}
                    onChange={e => setNewLectureTitle(e.target.value)}
                    placeholder="مثال: Lecture 2 — Quantum Tunneling"
                    required
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLectureOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ المحاضرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD ASSIGNMENT                                    */}
      {/* ======================================================== */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">إضافة تكليف / واجب جديد</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddAssignmentOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">اسم التكليف / الشيت:</label>
                <input
                  type="text"
                  value={asgnName}
                  onChange={e => setAsgnName(e.target.value)}
                  placeholder="مثال: شيت 1: حسابات أشباه الموصلات"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">المقرر التابع له:</label>
                <select
                  value={asgnSubId || selectedSubject?.id}
                  onChange={e => setAsgnSubId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {universitySubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">موعد التسليم (Deadline):</label>
                <input
                  type="date"
                  value={asgnDeadline}
                  onChange={e => setAsgnDeadline(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ التكليف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD QUIZ                                          */}
      {/* ======================================================== */}
      {isAddQuizOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">إضافة موعد كويز</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddQuizOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">موضوع الكويز:</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={e => setQuizTopic(e.target.value)}
                  placeholder="مثال: Quiz 1 — Molecular Spectroscopy"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">المقرر:</label>
                <select
                  value={quizSubId || selectedSubject?.id}
                  onChange={e => setQuizSubId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {universitySubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">تاريخ الكويز:</label>
                <input
                  type="date"
                  value={quizDate}
                  onChange={e => setQuizDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">النطاق والمنهج (اختياري):</label>
                <input
                  type="text"
                  value={quizSyllabus}
                  onChange={e => setQuizSyllabus(e.target.value)}
                  placeholder="مثال: المحاضرة 1 و 2 فقط"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddQuizOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ موعد الكويز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD STUDENT ACTIVITY                              */}
      {/* ======================================================== */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">إضافة مهمة نشاط / مسابقة</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddActivityOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">النشاط أو المسابقة:</label>
                <select
                  value={actName}
                  onChange={e => setActName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="NASA Space Apps">NASA Space Apps</option>
                  <option value="Sciora">Sciora</option>
                  <option value="مسابقة أخرى">مسابقة أخرى</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">اسم المهمة أو الفعالية:</label>
                <input
                  type="text"
                  value={actTask}
                  onChange={e => setActTask(e.target.value)}
                  placeholder="مثال: تسليم المشروع النهائي، حضور البوتكامب..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">الموعد (اختياري):</label>
                <input
                  type="date"
                  value={actDeadline}
                  onChange={e => setActDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ النشاط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FSRS Review Rating Modal (Spaced Repetition) */}
      {reviewingSession && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-purple-500/50 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="text-center space-y-1">
              <span className="text-[10px] text-purple-400 uppercase font-black tracking-wider">
                خوارزمية التكرار المتباعد العلمية (FSRS)
              </span>
              <h3 className="text-base font-bold text-white">
                تقييم مستوى استيعابك للمحاضرة
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 font-medium">{reviewingSession.title}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleReviewFSRS('AGAIN')}
                className="p-3 rounded-2xl border border-red-700/60 bg-red-950/50 text-red-300 text-center hover:bg-red-900/50 pressable cursor-pointer shadow-md"
              >
                <div className="text-xs font-bold">نسيتها</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Again</div>
              </button>

              <button
                type="button"
                onClick={() => handleReviewFSRS('HARD')}
                className="p-3 rounded-2xl border border-amber-700/60 bg-amber-950/50 text-amber-300 text-center hover:bg-amber-900/50 pressable cursor-pointer shadow-md"
              >
                <div className="text-xs font-bold">صعبة</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Hard</div>
              </button>

              <button
                type="button"
                onClick={() => handleReviewFSRS('GOOD')}
                className="p-3 rounded-2xl border border-blue-700/60 bg-blue-950/50 text-blue-300 text-center hover:bg-blue-900/50 pressable cursor-pointer shadow-md"
              >
                <div className="text-xs font-bold">جيدة</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Good</div>
              </button>

              <button
                type="button"
                onClick={() => handleReviewFSRS('EASY')}
                className="p-3 rounded-2xl border border-emerald-700/60 bg-emerald-950/50 text-emerald-300 text-center hover:bg-emerald-900/50 pressable cursor-pointer shadow-md"
              >
                <div className="text-xs font-bold">سهلة</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Easy</div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setReviewingSession(null)}
              className="w-full text-xs text-slate-400 hover:text-slate-200 py-2"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
