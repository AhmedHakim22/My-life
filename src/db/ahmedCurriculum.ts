import type { TimetableSlot, AcademicQuiz, AcademicAssignment } from '../types';

/** 
 * Verified from SUBJECTS!A6:D14 and WEEK!A6:G14 of Ahmed_Study_Planner_Simple_Smart_v4.xlsx.
 * No individual exam dates in source; the Monday class end time is unknown.
 */
export const AHMED_CURRICULUM = {
  subjects: [
    {
      id: "subj-thermo",
      name: "Thermodynamics and Phase",
      code: "NAC 3510",
      professor: "د. محمود عادل",
      focus: "Normal",
      hall: "مدرج 5"
    },
    {
      id: "subj-quantum",
      name: "Quantum Phenomena I",
      code: "NAC 3504",
      professor: "أ.د. محمد شبل",
      focus: "Normal",
      hall: "مدرج ج"
    },
    {
      id: "subj-water",
      name: "Application of Nanomaterials for Water Treatment",
      code: "NAC 3501",
      professor: "أ.د. رندا محمد",
      focus: "Normal",
      hall: "مدرج ج"
    },
    {
      id: "subj-mgmt",
      name: "Management and Economics",
      code: "NAA 3508",
      professor: "أ.د. نهى محمد سيد",
      focus: "Normal",
      hall: "مدرج 7"
    },
    {
      id: "subj-solid",
      name: "Solid State",
      code: "NAP 3509",
      professor: "أ.د. عبير عبدالله حسن",
      focus: "Normal",
      hall: "مدرج 23"
    },
    {
      id: "subj-cs",
      name: "Computer Science",
      code: "NAA 3507",
      professor: "د. محمد الجيار",
      focus: "Normal",
      hall: "مدرج 5"
    },
    {
      id: "subj-spectro",
      name: "Molecular Spectroscopy",
      code: "NAC 3503",
      professor: "أ.د. حسين مصطفى",
      focus: "High",
      hall: "Online"
    },
    {
      id: "subj-biomed",
      name: "Nanotechnology in Biomedicine",
      code: "NAB 3502",
      professor: "أ.د. طارق عبد الموجود",
      focus: "High",
      hall: "مدرج 5"
    }
  ] as const,
  weeklySlots: [
    {
      id: "slot-sat-1",
      day: "السبت",
      startTime: "08:00",
      endTime: "10:00",
      subjectName: "Thermodynamics and Phase",
      subjectCode: "NAC 3510",
      format: "Campus",
      hall: "مدرج 5",
      notes: null
    },
    {
      id: "slot-sat-2",
      day: "السبت",
      startTime: "10:00",
      endTime: "12:00",
      subjectName: "Quantum Phenomena I",
      subjectCode: "NAC 3504",
      format: "Campus",
      hall: "مدرج ج",
      notes: null
    },
    {
      id: "slot-sat-3",
      day: "السبت",
      startTime: "14:00",
      endTime: "16:00",
      subjectName: "Application of Nanomaterials for Water Treatment",
      subjectCode: "NAC 3501",
      format: "Campus",
      hall: "مدرج ج",
      notes: null
    },
    {
      id: "slot-sun-1",
      day: "الأحد",
      startTime: "10:00",
      endTime: "12:00",
      subjectName: "Management and Economics",
      subjectCode: "NAA 3508",
      format: "Campus",
      hall: "مدرج 7",
      notes: null
    },
    {
      id: "slot-sun-2",
      day: "الأحد",
      startTime: "14:00",
      endTime: "16:00",
      subjectName: "Solid State",
      subjectCode: "NAP 3509",
      format: "Campus",
      hall: "مدرج 23",
      notes: null
    },
    {
      id: "slot-sun-3",
      day: "الأحد",
      startTime: "16:00",
      endTime: "19:00",
      subjectName: "Computer Science",
      subjectCode: "NAA 3507",
      format: "Campus",
      hall: "مدرج 5",
      notes: null
    },
    {
      id: "slot-mon-1",
      day: "الاثنين",
      startTime: "19:00",
      endTime: null,
      subjectName: "Molecular Spectroscopy",
      subjectCode: "NAC 3503",
      format: "Online",
      hall: "Online",
      notes: "الانتهاء غير معروف"
    },
    {
      id: "slot-tue-1",
      day: "الثلاثاء",
      startTime: "12:00",
      endTime: "14:00",
      subjectName: "Nanotechnology in Biomedicine",
      subjectCode: "NAB 3502",
      format: "Campus",
      hall: "مدرج 5",
      notes: null
    }
  ] as TimetableSlot[]
};

export const AHMED_DEFAULT_QUIZZES: Omit<AcademicQuiz, 'id'>[] = [
  {
    topic: 'كويز 1: الدوال الموجية ومعادلة شرودنجر',
    subjectId: 'subj-quantum',
    subjectName: 'Quantum Phenomena I',
    quizDate: '2026-10-25',
    syllabusScope: 'المحاضرة الأولى والثانية',
    lectureIds: ['session-1792675925480', 'session-1792675929470'],
    prepared: false,
    attended: false
  },
  {
    topic: 'كويز 1: قوانين الديناميكا الحرارية والاتزان',
    subjectId: 'subj-thermo',
    subjectName: 'Thermodynamics and Phase',
    quizDate: '2026-10-26',
    syllabusScope: 'المحاضرة 1 و 2',
    lectureIds: ['session-1792676060401', 'session-1792676161846'],
    prepared: false,
    attended: false
  },
  {
    topic: 'كويز 1: الجدوى الاقتصادية وإدارة المشروعات',
    subjectId: 'subj-mgmt',
    subjectName: 'Management and Economics',
    quizDate: '2026-10-28',
    syllabusScope: 'المحاضرة الأولى والثانية',
    lectureIds: ['session-1792675899623', 'session-1792675906083'],
    prepared: false,
    attended: false
  }
];

export const AHMED_DEFAULT_ASSIGNMENTS: Omit<AcademicAssignment, 'id'>[] = [
  {
    taskName: 'شيت 1: الدوال والتحويلات العددية في C++',
    subjectId: 'subj-cs',
    subjectName: 'Computer Science',
    deadline: '2026-10-26',
    lecture: 'Itro to c++',
    completed: false,
    submitted: false,
    blocked: false
  },
  {
    taskName: 'حل مسائل بنك الأسئلة وتلخيص أوراق البحث',
    subjectId: 'subj-water',
    subjectName: 'Application of Nanomaterials for Water Treatment',
    deadline: '2026-10-27',
    lecture: 'بنك الأسئلة',
    completed: false,
    submitted: false,
    blocked: false
  },
  {
    taskName: 'تكليف 1: الحسابات البلورية وتركيب المواد الصلبة',
    subjectId: 'subj-solid',
    subjectName: 'Solid State',
    deadline: '2026-10-29',
    lecture: 'الأولى',
    completed: false,
    submitted: false,
    blocked: false
  }
];

