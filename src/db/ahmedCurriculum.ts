import type { TimetableSlot } from '../types';

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
