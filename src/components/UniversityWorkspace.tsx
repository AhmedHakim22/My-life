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
import type { StudySessionStatus, StudySession, Skill, UniversitySubject, AcademicQuiz, AcademicAssignment, StudentActivityTask, TimetableSlot } from '../types';
import { fireConfettiSuccess } from '../lib/confetti';
import { getCalendarDaysDiff } from '../engines/recommender';

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
    updateStudySession,
    deleteStudySession,
    toggleLectureStep,
    addQuiz,
    updateQuiz,
    toggleQuizPrepared,
    toggleQuizAttended,
    recordQuizScore,
    deleteQuiz,
    toggleLectureQuizLink,
    linkLectureToQuizzes,
    addAssignment,
    toggleAssignmentCompleted,
    toggleAssignmentSubmitted,
    deleteAssignment,
    addStudentActivity,
    toggleStudentActivityDone,
    deleteStudentActivity,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
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
  const [newLectureQuizIds, setNewLectureQuizIds] = useState<string[]>([]);

  // Form State: Edit Lecture
  const [editingLecture, setEditingLecture] = useState<StudySession | null>(null);
  const [editLectureNum, setEditLectureNum] = useState<number>(1);
  const [editLectureTitle, setEditLectureTitle] = useState<string>('');
  const [editLectureNotes, setEditLectureNotes] = useState<string>('');
  const [editLecturePriority, setEditLecturePriority] = useState<'High' | 'Normal'>('Normal');
  const [editLectureQuizIds, setEditLectureQuizIds] = useState<string[]>([]);

  // Quick Link Session to Quizzes Modal
  const [quickLinkSession, setQuickLinkSession] = useState<StudySession | null>(null);

  // Form State: Assignment
  const [asgnName, setAsgnName] = useState('');
  const [asgnSubId, setAsgnSubId] = useState('');
  const [asgnDeadline, setAsgnDeadline] = useState('');

  // Form State: Quiz
  const [quizTopic, setQuizTopic] = useState('');
  const [quizSubId, setQuizSubId] = useState('');
  const [quizDate, setQuizDate] = useState('');
  const [quizSyllabus, setQuizSyllabus] = useState('');
  const [quizLectureIds, setQuizLectureIds] = useState<string[]>([]);

  // Editing Quiz State
  const [editingQuiz, setEditingQuiz] = useState<AcademicQuiz | null>(null);
  const [editQuizTopic, setEditQuizTopic] = useState('');
  const [editQuizSubId, setEditQuizSubId] = useState('');
  const [editQuizDate, setEditQuizDate] = useState('');
  const [editQuizSyllabus, setEditQuizSyllabus] = useState('');
  const [editQuizLectureIds, setEditQuizLectureIds] = useState<string[]>([]);

  // Form State: Activity
  const [actName, setActName] = useState('NASA Space Apps');
  const [actTask, setActTask] = useState('');
  const [actDeadline, setActDeadline] = useState('');

  // Skills Tree State
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('ALL');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('علمي');

  // Timetable State & CRUD
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<string>('ALL');
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [slotDay, setSlotDay] = useState<TimetableSlot['day']>('السبت');
  const [slotSubjectSelect, setSlotSubjectSelect] = useState<string>('custom');
  const [slotSubjectName, setSlotSubjectName] = useState('');
  const [slotSubjectCode, setSlotSubjectCode] = useState('');
  const [slotStartTime, setSlotStartTime] = useState('08:00');
  const [slotEndTime, setSlotEndTime] = useState('10:00');
  const [slotHall, setSlotHall] = useState('مدرج 5');
  const [slotFormat, setSlotFormat] = useState<'Campus' | 'Online'>('Campus');
  const [slotNotes, setSlotNotes] = useState('');

  // Editing Slot State
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [editSlotDay, setEditSlotDay] = useState<TimetableSlot['day']>('السبت');
  const [editSlotSubjectName, setEditSlotSubjectName] = useState('');
  const [editSlotSubjectCode, setEditSlotSubjectCode] = useState('');
  const [editSlotStartTime, setEditSlotStartTime] = useState('08:00');
  const [editSlotEndTime, setEditSlotEndTime] = useState('');
  const [editSlotHall, setEditSlotHall] = useState('مدرج 5');
  const [editSlotFormat, setEditSlotFormat] = useState<'Campus' | 'Online'>('Campus');
  const [editSlotNotes, setEditSlotNotes] = useState('');

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
    setNewLectureQuizIds([]);
    setIsAddLectureOpen(true);
  };

  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !newLectureTitle.trim()) return;

    const newId = await addStudySession({
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

    if (newLectureQuizIds.length > 0) {
      await linkLectureToQuizzes(newId, newLectureQuizIds);
    }

    setNewLectureTitle('');
    setNewLectureNotes('');
    setNewLectureQuizIds([]);
    setIsAddLectureOpen(false);
    fireConfettiSuccess();
  };

  const openEditLectureModal = (session: StudySession) => {
    setEditingLecture(session);
    setEditLectureNum(session.lectureNumber || 1);
    setEditLectureTitle(session.title);
    setEditLectureNotes(session.notes || '');
    setEditLecturePriority(session.priority || 'Normal');
    const linked = academicQuizzes
      .filter(q => q.lectureIds?.includes(session.id))
      .map(q => q.id);
    setEditLectureQuizIds(linked);
  };

  const handleSaveEditLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture || !editLectureTitle.trim()) return;

    await updateStudySession(editingLecture.id, {
      lectureNumber: Number(editLectureNum) || 1,
      title: editLectureTitle.trim(),
      notes: editLectureNotes.trim() || undefined,
      priority: editLecturePriority
    });

    await linkLectureToQuizzes(editingLecture.id, editLectureQuizIds);

    setEditingLecture(null);
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
      lectureIds: quizLectureIds.length > 0 ? quizLectureIds : undefined,
      prepared: false,
      attended: false
    });

    setQuizTopic('');
    setQuizSyllabus('');
    setQuizDate('');
    setQuizLectureIds([]);
    setIsAddQuizOpen(false);
    fireConfettiSuccess();
  };

  const openEditQuizModal = (quiz: AcademicQuiz) => {
    setEditingQuiz(quiz);
    setEditQuizTopic(quiz.topic);
    setEditQuizSubId(quiz.subjectId);
    setEditQuizDate(quiz.quizDate);
    setEditQuizSyllabus(quiz.syllabusScope || '');
    setEditQuizLectureIds(quiz.lectureIds || []);
  };

  const handleUpdateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz || !editQuizTopic.trim()) return;
    const targetSub = universitySubjects.find(s => s.id === editQuizSubId) || universitySubjects.find(s => s.id === editingQuiz.subjectId);

    await updateQuiz(editingQuiz.id, {
      topic: editQuizTopic.trim(),
      subjectId: targetSub?.id || editingQuiz.subjectId,
      subjectName: targetSub?.name || editingQuiz.subjectName,
      quizDate: editQuizDate || editingQuiz.quizDate,
      syllabusScope: editQuizSyllabus.trim() || undefined,
      lectureIds: editQuizLectureIds.length > 0 ? editQuizLectureIds : undefined
    });

    setEditingQuiz(null);
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

  // Timetable Handlers
  const TIMETABLE_DAYS: Array<TimetableSlot['day']> = [
    'السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'
  ];

  const handleOpenAddSlotModal = (presetDay?: TimetableSlot['day']) => {
    if (presetDay) {
      setSlotDay(presetDay);
    } else if (selectedTimetableDay !== 'ALL' && TIMETABLE_DAYS.includes(selectedTimetableDay as any)) {
      setSlotDay(selectedTimetableDay as TimetableSlot['day']);
    } else {
      setSlotDay('السبت');
    }

    if (universitySubjects.length > 0) {
      setSlotSubjectSelect(universitySubjects[0].id);
      setSlotSubjectName(universitySubjects[0].name);
      setSlotSubjectCode(universitySubjects[0].code);
      if (universitySubjects[0].hall) setSlotHall(universitySubjects[0].hall);
    } else {
      setSlotSubjectSelect('custom');
      setSlotSubjectName('');
      setSlotSubjectCode('');
      setSlotHall('مدرج 5');
    }
    setSlotStartTime('08:00');
    setSlotEndTime('10:00');
    setSlotFormat('Campus');
    setSlotNotes('');
    setIsAddSlotOpen(true);
  };

  const handleSubjectSelectChange = (val: string) => {
    setSlotSubjectSelect(val);
    if (val === 'custom') {
      setSlotSubjectName('');
      setSlotSubjectCode('');
    } else {
      const found = universitySubjects.find(s => s.id === val);
      if (found) {
        setSlotSubjectName(found.name);
        setSlotSubjectCode(found.code);
        if (found.hall) setSlotHall(found.hall);
      }
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotSubjectName.trim()) {
      showToast('يرجى كتابة اسم المادة أو اختيارها من القائمة');
      return;
    }
    if (!slotStartTime.trim()) {
      showToast('يرجى تحديد وقت بداية الحصة');
      return;
    }

    try {
      await addTimetableSlot({
        day: slotDay,
        startTime: slotStartTime.trim(),
        endTime: slotEndTime.trim() ? slotEndTime.trim() : null,
        subjectName: slotSubjectName.trim(),
        subjectCode: slotSubjectCode.trim() || 'NAC',
        format: slotFormat,
        hall: slotHall.trim() || 'قاعة / مدرج',
        notes: slotNotes.trim() ? slotNotes.trim() : null
      });
      setIsAddSlotOpen(false);
      showToast('تمت إضافة الحصة إلى الجدول بنجاح 📅');
      fireConfettiSuccess();
    } catch (err) {
      console.error('Error creating timetable slot:', err);
      showToast('حدث خطأ أثناء إضافة الحصة للجدول');
    }
  };

  const openEditSlotModal = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setEditSlotDay(slot.day);
    setEditSlotSubjectName(slot.subjectName);
    setEditSlotSubjectCode(slot.subjectCode);
    setEditSlotStartTime(slot.startTime);
    setEditSlotEndTime(slot.endTime || '');
    setEditSlotHall(slot.hall || '');
    setEditSlotFormat(slot.format || 'Campus');
    setEditSlotNotes(slot.notes || '');
  };

  const handleSaveEditSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    if (!editSlotSubjectName.trim()) {
      showToast('يرجى كتابة اسم المادة');
      return;
    }
    if (!editSlotStartTime.trim()) {
      showToast('يرجى تحديد وقت البداية');
      return;
    }

    try {
      await updateTimetableSlot(editingSlot.id, {
        day: editSlotDay,
        startTime: editSlotStartTime.trim(),
        endTime: editSlotEndTime.trim() ? editSlotEndTime.trim() : null,
        subjectName: editSlotSubjectName.trim(),
        subjectCode: editSlotSubjectCode.trim() || 'NAC',
        format: editSlotFormat,
        hall: editSlotHall.trim() || 'قاعة / مدرج',
        notes: editSlotNotes.trim() ? editSlotNotes.trim() : null
      });
      setEditingSlot(null);
      showToast('تم تحديث بيانات الحصة بنجاح ✏️');
    } catch (err) {
      console.error('Error updating timetable slot:', err);
      showToast('حدث خطأ أثناء تعديل الحصة');
    }
  };

  const handleDeleteSlot = async (slot: TimetableSlot) => {
    if (confirm(`هل أنت متأكد من حذف حصة "${slot.subjectName}" يوم ${slot.day}؟`)) {
      try {
        await deleteTimetableSlot(slot.id);
        showToast('تم حذف الحصة من الجدول 🗑️');
      } catch (err) {
        console.error('Error deleting timetable slot:', err);
        showToast('حدث خطأ أثناء حذف الحصة');
      }
    }
  };

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
              {subjectSessions.map(session => {
                const linkedQuizzes = academicQuizzes.filter(q => q.lectureIds?.includes(session.id));
                return (
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

                        {linkedQuizzes.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                              <Brain className="w-3 h-3 text-amber-400" />
                              كويزات مرتبطة ({linkedQuizzes.length}):
                            </span>
                            {linkedQuizzes.map(q => {
                              const diff = getCalendarDaysDiff(q.quizDate);
                              return (
                                <span
                                  key={q.id}
                                  className={`text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-bold ${
                                    diff === 0
                                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                                      : diff === 1
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                      : 'bg-amber-950/60 text-amber-200 border-amber-700/40'
                                  }`}
                                >
                                  <span>🎯 {q.topic}</span>
                                  <span className="font-mono text-[9px] opacity-80">({q.quizDate})</span>
                                  {diff === 0 && <span className="text-[9px] font-black text-rose-400">اليوم! 🚨</span>}
                                  {diff === 1 && <span className="text-[9px] font-black text-amber-400">غداً! ⚡</span>}
                                  {diff > 1 && diff <= 3 && <span className="text-[9px] font-semibold text-sky-400">بعد {diff} أيام</span>}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                        <button
                          type="button"
                          onClick={() => setQuickLinkSession(session)}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 pressable cursor-pointer shadow-md transition-all ${
                            linkedQuizzes.length > 0
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                              : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-amber-300 hover:border-amber-500/40'
                          }`}
                          title="ربط المحاضرة بكويز"
                        >
                          <Brain className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden sm:inline">ربط بكويز</span>
                          {linkedQuizzes.length > 0 && (
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                              {linkedQuizzes.length}
                            </span>
                          )}
                        </button>

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
                          onClick={() => openEditLectureModal(session)}
                          className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800/80 rounded-lg transition pressable cursor-pointer"
                          title="تعديل المحاضرة"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
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
              );
            })}

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
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                        {quiz.subjectName}
                      </span>
                      <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700/40 font-mono">
                        تاريخ الكويز: {quiz.quizDate}
                      </span>
                      {(() => {
                        const diff = getCalendarDaysDiff(quiz.quizDate);
                        if (diff === 0) return <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">كويز اليوم! 🚨</span>;
                        if (diff === 1) return <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">كويز غداً! ⚡</span>;
                        if (diff > 1 && diff <= 3) return <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded-full font-bold">بعد {diff} أيام 📅</span>;
                        return null;
                      })()}
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {quiz.topic}
                    </h4>

                    {quiz.syllabusScope && (
                      <p className="text-[11px] text-slate-400">نطاق المنهج: {quiz.syllabusScope}</p>
                    )}

                    {/* Attached Lectures List & Readiness Check */}
                    {quiz.lectureIds && quiz.lectureIds.length > 0 && (() => {
                      const attachedSessions = quiz.lectureIds
                        .map(id => studySessions.find(s => s.id === id))
                        .filter((s): s is StudySession => Boolean(s));
                      const hasUnstudied = attachedSessions.some(s => !s.studyDone);

                      return (
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">المحاضرات الداخلة:</span>
                            {hasUnstudied ? (
                              <span className="text-[10px] text-rose-400 font-bold bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/50">
                                محاضرات لم تُدرس بعد ⚠️
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                                جاهزة للمراجعة ✓
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {attachedSessions.map(sess => (
                              <span
                                key={sess.id}
                                className={`text-[10px] px-2 py-0.5 rounded-md border font-medium flex items-center gap-1 ${
                                  sess.studyDone 
                                    ? 'bg-emerald-950/50 border-emerald-700/40 text-emerald-300' 
                                    : 'bg-amber-950/50 border-amber-700/40 text-amber-300'
                                }`}
                              >
                                <span>{sess.studyDone ? '✓' : '○'}</span>
                                <span>{sess.lectureNumber ? `م${sess.lectureNumber}` : sess.title}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditQuizModal(quiz)}
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 rounded-lg transition"
                      title="تعديل الكويز"
                      aria-label="تعديل الكويز"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuiz(quiz.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
                      title="حذف الكويز"
                      aria-label="حذف الكويز"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
          {/* Header with Title and Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>جدول المحاضرات والسكاشن الأسبوعي 🏫</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تنظيم وتعديل حصص الأسبوع ومواعيدها مع مزامنة فورية على كل أجهزتك
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenAddSlotModal()}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-2xl flex items-center justify-center gap-1.5 pressable cursor-pointer shadow-lg shadow-sky-500/20 self-start sm:self-auto transition-transform"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة حصة جديدة</span>
            </button>
          </div>

          {/* Days Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedTimetableDay('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all pressable cursor-pointer ${
                selectedTimetableDay === 'ALL'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              الكل ({timetableSlots.length})
            </button>
            {TIMETABLE_DAYS.map(day => {
              const count = timetableSlots.filter(s => s.day === day).length;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedTimetableDay(day)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all pressable cursor-pointer flex items-center gap-1.5 ${
                    selectedTimetableDay === day
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{day}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedTimetableDay === day ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-sky-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Slots Content Grouped by Day */}
          <div className="space-y-4">
            {(selectedTimetableDay === 'ALL' ? TIMETABLE_DAYS : [selectedTimetableDay as TimetableSlot['day']]).map(day => {
              const daySlots = timetableSlots
                .filter(s => s.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              if (daySlots.length === 0) {
                // If specific day selected and empty, show prompt
                if (selectedTimetableDay !== 'ALL') {
                  return (
                    <div key={day} className="glass-panel border border-dashed border-slate-800 rounded-3xl p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">لا توجد حصص مسجلة يوم {day}</h4>
                        <p className="text-xs text-slate-400">يمكنك إضافة محاضرة أو سكشن لهذا اليوم بضغطة واحدة</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenAddSlotModal(day)}
                        className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 pressable cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة حصة ليوم {day}</span>
                      </button>
                    </div>
                  );
                }
                return null;
              }

              return (
                <div key={day} className="glass-panel border border-slate-800/90 rounded-3xl p-4 sm:p-5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-sky-400">{day}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800 font-bold">
                        {daySlots.length} {daySlots.length === 1 ? 'حصة' : 'حصص'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAddSlotModal(day)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 p-1 rounded-lg hover:bg-slate-800/60 transition pressable cursor-pointer"
                      title={`إضافة حصة جديدة ليوم ${day}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-[11px]">إضافة</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {daySlots.map(slot => (
                      <div
                        key={slot.id}
                        className="bg-slate-900/80 hover:bg-slate-900/95 transition-colors p-3.5 rounded-2xl border border-slate-800/80 flex items-start justify-between gap-3 shadow-md"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="text-[10px] bg-slate-800 text-sky-300 font-mono font-bold px-2 py-0.5 rounded-md border border-slate-700/50">
                              {slot.subjectCode}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {slot.subjectName}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                              slot.format === 'Online'
                                ? 'bg-purple-950/70 border-purple-700/50 text-purple-300'
                                : 'bg-emerald-950/70 border-emerald-700/50 text-emerald-300'
                            }`}>
                              {slot.format === 'Online' ? '💻 أونلاين' : '🏛️ حضوري'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 flex items-center flex-wrap gap-x-3 gap-y-1 font-medium">
                            <span className="inline-flex items-center gap-1 text-slate-300 font-mono">
                              <Clock className="w-3 h-3 text-sky-400" />
                              <span>{slot.startTime} {slot.endTime ? `– ${slot.endTime}` : '(غير محدد النهاية)'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                              <MapPin className="w-3 h-3" />
                              <span>{slot.hall}</span>
                            </span>
                          </div>

                          {slot.notes && (
                            <p className="text-[11px] text-slate-400 bg-slate-950/40 px-2 py-1 rounded-lg border border-slate-800/60 inline-block mt-0.5">
                              {slot.notes}
                            </p>
                          )}
                        </div>

                        {/* Actions: Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          <button
                            type="button"
                            onClick={() => openEditSlotModal(slot)}
                            className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-xl transition pressable cursor-pointer"
                            title="تعديل الحصة"
                          >
                            <Edit3 className="w-4 h-4 text-sky-400" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(slot)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition pressable cursor-pointer"
                            title="حذف الحصة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty State when ALL selected and no slots at all */}
            {timetableSlots.length === 0 && (
              <div className="glass-panel border border-dashed border-slate-800 rounded-3xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">الجدول الدراسي فارغ حالياً</h4>
                  <p className="text-xs text-slate-400">أضف محاضراتك وسكاشنك لتنظيم أسبوعك الجامعي</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddSlotModal()}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 pressable cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة أول حصة في الجدول</span>
                </button>
              </div>
            )}
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

              {/* Link to Quizzes in Add Lecture Modal */}
              {(() => {
                const subjectQuizzes = academicQuizzes.filter(q => q.subjectId === selectedSubject.id);
                if (subjectQuizzes.length === 0) return null;

                return (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-amber-400" />
                        <span>ربط بكويزات هذا المقرر ({newLectureQuizIds.length}):</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {newLectureQuizIds.length < subjectQuizzes.length && (
                          <button
                            type="button"
                            onClick={() => setNewLectureQuizIds(subjectQuizzes.map(q => q.id))}
                            className="text-[10px] text-sky-400 hover:text-sky-300"
                          >
                            تحديد الكل
                          </button>
                        )}
                        {newLectureQuizIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setNewLectureQuizIds([])}
                            className="text-[10px] text-amber-400 hover:text-amber-300"
                          >
                            مسح التحديد
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-28 overflow-y-auto space-y-1 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                      {subjectQuizzes.map(quiz => {
                        const isSelected = newLectureQuizIds.includes(quiz.id);
                        return (
                          <button
                            key={quiz.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setNewLectureQuizIds(newLectureQuizIds.filter(id => id !== quiz.id));
                              } else {
                                setNewLectureQuizIds([...newLectureQuizIds, quiz.id]);
                              }
                            }}
                            className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                              isSelected 
                                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold' 
                                : 'text-slate-400 hover:bg-slate-800/60 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                                isSelected ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'border-slate-700'
                              }`}>
                                {isSelected ? '✓' : ''}
                              </span>
                              <span className="truncate">{quiz.topic}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {quiz.quizDate}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

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
      {/* MODAL: EDIT LECTURE                                      */}
      {/* ======================================================== */}
      {editingLecture && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">تعديل المحاضرة</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingLecture(null)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditLecture} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">رقم المحاضرة:</label>
                  <input
                    type="number"
                    value={editLectureNum}
                    onChange={e => setEditLectureNum(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono text-center"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">عنوان المحاضرة:</label>
                  <input
                    type="text"
                    value={editLectureTitle}
                    onChange={e => setEditLectureTitle(e.target.value)}
                    placeholder="مثال: Lecture 2 — Data Structures"
                    required
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">الأولوية:</label>
                <select
                  value={editLecturePriority}
                  onChange={e => setEditLecturePriority(e.target.value as 'High' | 'Normal')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Normal">أولوية عادية (Normal)</option>
                  <option value="High">أولوية قصوى (High Priority ⭐)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">ملاحظات وروابط (اختياري):</label>
                <textarea
                  value={editLectureNotes}
                  onChange={e => setEditLectureNotes(e.target.value)}
                  placeholder="ملاحظات أو رابط سلايدات..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              {/* Link to Quizzes in Edit Lecture Modal */}
              {(() => {
                const subjectQuizzes = academicQuizzes.filter(q => q.subjectId === (editingLecture.subjectId || selectedSubject?.id));
                if (subjectQuizzes.length === 0) return null;

                return (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-amber-400" />
                        <span>ربط بكويزات هذا المقرر ({editLectureQuizIds.length}):</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {editLectureQuizIds.length < subjectQuizzes.length && (
                          <button
                            type="button"
                            onClick={() => setEditLectureQuizIds(subjectQuizzes.map(q => q.id))}
                            className="text-[10px] text-sky-400 hover:text-sky-300"
                          >
                            تحديد الكل
                          </button>
                        )}
                        {editLectureQuizIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setEditLectureQuizIds([])}
                            className="text-[10px] text-amber-400 hover:text-amber-300"
                          >
                            مسح التحديد
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-28 overflow-y-auto space-y-1 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                      {subjectQuizzes.map(quiz => {
                        const isSelected = editLectureQuizIds.includes(quiz.id);
                        return (
                          <button
                            key={quiz.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setEditLectureQuizIds(editLectureQuizIds.filter(id => id !== quiz.id));
                              } else {
                                setEditLectureQuizIds([...editLectureQuizIds, quiz.id]);
                              }
                            }}
                            className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                              isSelected 
                                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold' 
                                : 'text-slate-400 hover:bg-slate-800/60 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                                isSelected ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'border-slate-700'
                              }`}>
                                {isSelected ? '✓' : ''}
                              </span>
                              <span className="truncate">{quiz.topic}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {quiz.quizDate}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLecture(null)}
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

              {/* Select lectures included in this quiz */}
              {(() => {
                const currentSubId = quizSubId || selectedSubject?.id;
                const targetSessions = studySessions
                  .filter(s => s.subjectId === currentSubId)
                  .sort((a, b) => (a.lectureNumber || 0) - (b.lectureNumber || 0));

                if (targetSessions.length === 0) return null;

                return (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-300 font-bold block">
                        تحديد المحاضرات الداخلة ({quizLectureIds.length} من {targetSessions.length}):
                      </label>
                      <div className="flex items-center gap-2">
                        {quizLectureIds.length < targetSessions.length && (
                          <button
                            type="button"
                            onClick={() => setQuizLectureIds(targetSessions.map(s => s.id))}
                            className="text-[10px] text-sky-400 hover:text-sky-300"
                          >
                            تحديد الكل
                          </button>
                        )}
                        {quizLectureIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setQuizLectureIds([])}
                            className="text-[10px] text-amber-400 hover:text-amber-300"
                          >
                            مسح التحديد
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                      {targetSessions.map(sess => {
                        const isSelected = quizLectureIds.includes(sess.id);
                        return (
                          <button
                            key={sess.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setQuizLectureIds(quizLectureIds.filter(id => id !== sess.id));
                              } else {
                                setQuizLectureIds([...quizLectureIds, sess.id]);
                              }
                            }}
                            className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                              isSelected 
                                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold' 
                                : 'text-slate-400 hover:bg-slate-800/60 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                                isSelected ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'border-slate-700'
                              }`}>
                                {isSelected ? '✓' : ''}
                              </span>
                              <span className="truncate">
                                {sess.lectureNumber ? `م${sess.lectureNumber}: ` : ''}{sess.title}
                              </span>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              sess.studyDone ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                            }`}>
                              {sess.studyDone ? 'مدروسة' : 'لم تدرس'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

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
      {/* MODAL: EDIT QUIZ                                         */}
      {/* ======================================================== */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">تعديل بيانات الكويز</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingQuiz(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateQuiz} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">موضوع الكويز:</label>
                <input
                  type="text"
                  value={editQuizTopic}
                  onChange={e => setEditQuizTopic(e.target.value)}
                  placeholder="مثال: Quiz 1"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">المقرر:</label>
                <select
                  value={editQuizSubId}
                  onChange={e => {
                    setEditQuizSubId(e.target.value);
                    setEditQuizLectureIds([]);
                  }}
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
                  value={editQuizDate}
                  onChange={e => setEditQuizDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Select lectures included in this quiz */}
              {(() => {
                const targetSessions = studySessions
                  .filter(s => s.subjectId === editQuizSubId)
                  .sort((a, b) => (a.lectureNumber || 0) - (b.lectureNumber || 0));

                if (targetSessions.length === 0) return null;

                return (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-300 font-bold block">
                        تحديد المحاضرات الداخلة ({editQuizLectureIds.length} من {targetSessions.length}):
                      </label>
                      <div className="flex items-center gap-2">
                        {editQuizLectureIds.length < targetSessions.length && (
                          <button
                            type="button"
                            onClick={() => setEditQuizLectureIds(targetSessions.map(s => s.id))}
                            className="text-[10px] text-sky-400 hover:text-sky-300"
                          >
                            تحديد الكل
                          </button>
                        )}
                        {editQuizLectureIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setEditQuizLectureIds([])}
                            className="text-[10px] text-amber-400 hover:text-amber-300"
                          >
                            مسح التحديد
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                      {targetSessions.map(sess => {
                        const isSelected = editQuizLectureIds.includes(sess.id);
                        return (
                          <button
                            key={sess.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setEditQuizLectureIds(editQuizLectureIds.filter(id => id !== sess.id));
                              } else {
                                setEditQuizLectureIds([...editQuizLectureIds, sess.id]);
                              }
                            }}
                            className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                              isSelected 
                                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold' 
                                : 'text-slate-400 hover:bg-slate-800/60 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                                isSelected ? 'bg-amber-500 border-amber-400 text-slate-950 font-black' : 'border-slate-700'
                              }`}>
                                {isSelected ? '✓' : ''}
                              </span>
                              <span className="truncate">
                                {sess.lectureNumber ? `م${sess.lectureNumber}: ` : ''}{sess.title}
                              </span>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              sess.studyDone ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                            }`}>
                              {sess.studyDone ? 'مدروسة' : 'لم تدرس'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">النطاق والمنهج (اختياري):</label>
                <input
                  type="text"
                  value={editQuizSyllabus}
                  onChange={e => setEditQuizSyllabus(e.target.value)}
                  placeholder="مثال: المحاضرة 1 و 2 فقط"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuiz(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ التعديلات
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

      {/* ======================================================== */}
      {/* Modal: Add Timetable Slot                                */}
      {/* ======================================================== */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">إضافة حصة جديدة للجدول</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddSlotOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-3.5">
              {/* Day selection */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">اليوم:</label>
                <select
                  value={slotDay}
                  onChange={e => setSlotDay(e.target.value as TimetableSlot['day'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {TIMETABLE_DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Subject selector or custom */}
              {universitySubjects.length > 0 && (
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">اختيار المادة من المقررات:</label>
                  <select
                    value={slotSubjectSelect}
                    onChange={e => handleSubjectSelectChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {universitySubjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                    <option value="custom">-- كتابة مادة / سكشن مخصص --</option>
                  </select>
                </div>
              )}

              {/* Subject Name */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">اسم المادة / الحصة:</label>
                <input
                  type="text"
                  value={slotSubjectName}
                  onChange={e => setSlotSubjectName(e.target.value)}
                  placeholder="مثال: Thermodynamics and Phase"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Subject Code */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">كود المادة (اختياري):</label>
                <input
                  type="text"
                  value={slotSubjectCode}
                  onChange={e => setSlotSubjectCode(e.target.value)}
                  placeholder="مثال: NAC 3510"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* Timing: Start and End time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">وقت البداية:</label>
                  <input
                    type="time"
                    value={slotStartTime}
                    onChange={e => setSlotStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">وقت الانتهاء (اختياري):</label>
                  <input
                    type="time"
                    value={slotEndTime}
                    onChange={e => setSlotEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Format & Hall */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">نوع الحضور:</label>
                  <select
                    value={slotFormat}
                    onChange={e => setSlotFormat(e.target.value as 'Campus' | 'Online')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Campus">🏛️ حضوري (Campus)</option>
                    <option value="Online">💻 أونلاين (Online)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">المكان / القاعة:</label>
                  <input
                    type="text"
                    value={slotHall}
                    onChange={e => setSlotHall(e.target.value)}
                    placeholder="مثال: مدرج 5 أو زووم"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">ملاحظات إضافية (اختياري):</label>
                <input
                  type="text"
                  value={slotNotes}
                  onChange={e => setSlotNotes(e.target.value)}
                  placeholder="مثال: سكشن تمارين مع المعيد"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  إضافة الحصة للجدول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Timetable Slot                               */}
      {/* ======================================================== */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">تعديل بيانات الحصة الدراسية</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingSlot(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSlot} className="space-y-3.5">
              {/* Day */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">اليوم:</label>
                <select
                  value={editSlotDay}
                  onChange={e => setEditSlotDay(e.target.value as TimetableSlot['day'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {TIMETABLE_DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Subject Name */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">اسم المادة:</label>
                <input
                  type="text"
                  value={editSlotSubjectName}
                  onChange={e => setEditSlotSubjectName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Subject Code */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">كود المادة:</label>
                <input
                  type="text"
                  value={editSlotSubjectCode}
                  onChange={e => setEditSlotSubjectCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">وقت البداية:</label>
                  <input
                    type="time"
                    value={editSlotStartTime}
                    onChange={e => setEditSlotStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">وقت الانتهاء (اختياري):</label>
                  <input
                    type="time"
                    value={editSlotEndTime}
                    onChange={e => setEditSlotEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Format & Hall */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">نوع الحضور:</label>
                  <select
                    value={editSlotFormat}
                    onChange={e => setEditSlotFormat(e.target.value as 'Campus' | 'Online')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Campus">🏛️ حضوري (Campus)</option>
                    <option value="Online">💻 أونلاين (Online)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">المكان / القاعة:</label>
                  <input
                    type="text"
                    value={editSlotHall}
                    onChange={e => setEditSlotHall(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">ملاحظات إضافية:</label>
                <input
                  type="text"
                  value={editSlotNotes}
                  onChange={e => setEditSlotNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const toDelete = editingSlot;
                    setEditingSlot(null);
                    handleDeleteSlot(toDelete);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold p-1.5 rounded-lg hover:bg-red-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الحصة</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlot(null)}
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

      {/* ======================================================== */}
      {/* MODAL: QUICK LINK LECTURE TO QUIZZES                     */}
      {/* ======================================================== */}
      {quickLinkSession && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">ربط المحاضرة بكويزات</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setQuickLinkSession(null)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-amber-400 font-bold">
                  محاضرة {quickLinkSession.lectureNumber || 1}
                </div>
                <div className="text-sm font-extrabold text-white">
                  {quickLinkSession.title}
                </div>
                <p className="text-[10px] text-slate-400">
                  انقر على أي كويز بالأسفل لربطه بالمحاضرة أو فك الربط فوراً وبنقرة واحدة.
                </p>
              </div>

              {(() => {
                const subjectQuizzes = academicQuizzes.filter(
                  q => q.subjectId === (quickLinkSession.subjectId || selectedSubject?.id)
                );

                if (subjectQuizzes.length === 0) {
                  return (
                    <div className="text-center py-5 space-y-3">
                      <p className="text-xs text-slate-400">
                        لا توجد كويزات مسجلة لهذا المقرر حالياً.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const sessId = quickLinkSession.id;
                          const subId = quickLinkSession.subjectId;
                          setQuickLinkSession(null);
                          setQuizSubId(subId);
                          setQuizLectureIds([sessId]);
                          setIsAddQuizOpen(true);
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer pressable"
                      >
                        + إضافة كويز جديد لهذا المقرر
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-300 font-bold block">
                      الكويزات المتاحة لهذا المقرر ({subjectQuizzes.length}):
                    </label>
                    <div className="space-y-2 max-h-56 overflow-y-auto p-1">
                      {subjectQuizzes.map(quiz => {
                        const isLinked = quiz.lectureIds?.includes(quickLinkSession.id) ?? false;
                        const diff = getCalendarDaysDiff(quiz.quizDate);
                        return (
                          <button
                            key={quiz.id}
                            type="button"
                            onClick={async () => {
                              await toggleLectureQuizLink(quickLinkSession.id, quiz.id);
                            }}
                            className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between pressable cursor-pointer ${
                              isLinked
                                ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-850'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-5 h-5 rounded-lg flex items-center justify-center border text-xs font-bold ${
                                isLinked
                                  ? 'bg-amber-500 border-amber-400 text-slate-950'
                                  : 'border-slate-700 bg-slate-900 text-transparent'
                              }`}>
                                ✓
                              </span>
                              <div>
                                <div className="text-xs font-bold leading-tight">
                                  {quiz.topic}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  {quiz.quizDate}
                                </div>
                              </div>
                            </div>

                            <div>
                              {diff === 0 ? (
                                <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                                  اليوم! 🚨
                                </span>
                              ) : diff === 1 ? (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                                  غداً! ⚡
                                </span>
                              ) : (
                                <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                                  بعد {diff} ي
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuickLinkSession(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
