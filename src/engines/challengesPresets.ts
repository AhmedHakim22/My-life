import type { Challenge } from '../types';

export const CHALLENGE_90_DAYS_PRESET: Omit<Challenge, 'currentDay' | 'completedDaysCount' | 'createdAt' | 'updatedAt'> = {
  id: 'preset-90-days-90-mins',
  title: 'روتين التسعين يوم × تسعين دقيقة',
  description: 'وزّع نجاحاتك — 90 دقيقة فقط من أصل 1440 دقيقة من يومك (بدون جوال أو مشتتات) لتحسين حياتك وبناء انضباط حديدي.',
  durationDays: 90,
  status: 'QUEUED',
  xpReward: 1000,
  trophyIcon: '🏆',
  tasks: [
    {
      id: 'task-cold-shower',
      title: 'استحمام بماء بارد',
      durationMinutes: 10,
      category: 'HEALTH',
      icon: '🧊',
      isMandatory: true
    },
    {
      id: 'task-quran-reading',
      title: 'ورد يومي من القرآن (قراءة أو استماع)',
      durationMinutes: 10,
      category: 'FAITH',
      icon: '📖',
      isMandatory: true
    },
    {
      id: 'task-movement-exercise',
      title: 'نشاط حركي (أي نوع رياضة)',
      durationMinutes: 20,
      category: 'HEALTH',
      icon: '🏃',
      isMandatory: true
    },
    {
      id: 'task-book-reading',
      title: 'قراءة كتاب أو مقال مفيد',
      durationMinutes: 15,
      category: 'LEARNING',
      icon: '📚',
      isMandatory: true
    },
    {
      id: 'task-self-care',
      title: 'اهتمام يومي بنفسك (قهوة، سقي نبتة، لقاء، صلة)',
      durationMinutes: 10,
      category: 'MINDSET',
      icon: '☕',
      isMandatory: true
    },
    {
      id: 'task-skill-learning',
      title: 'تعلم مهارة أو تجربة شيء جديد ومفيد',
      durationMinutes: 15,
      category: 'LEARNING',
      icon: '💡',
      isMandatory: true
    },
    {
      id: 'task-witr-review',
      title: 'ركعة وتر + جلسة مراجعة وتأمل يومية',
      durationMinutes: 10,
      category: 'FAITH',
      icon: '🌙',
      isMandatory: true
    }
  ]
};

export const CHALLENGE_30_DAYS_PRESET: Omit<Challenge, 'currentDay' | 'completedDaysCount' | 'createdAt' | 'updatedAt'> = {
  id: 'preset-30-days-focus',
  title: 'تحدي الانضباط المركز (30 يوماً)',
  description: 'شهر كامل من التركيز المتواصل، الاستيقاظ المنظم، وبناء عادات النجاح الأكاديمي والمهني.',
  durationDays: 30,
  status: 'QUEUED',
  xpReward: 400,
  trophyIcon: '⚡',
  tasks: [
    {
      id: 'task-early-wake',
      title: 'الاستيقاظ المبكر وصلاة الفجر حاضر',
      durationMinutes: 20,
      category: 'FAITH',
      icon: '🌅',
      isMandatory: true
    },
    {
      id: 'task-deep-study',
      title: 'جلسة تركيز ومذاكرة عميقة بدون هاتف',
      durationMinutes: 45,
      category: 'LEARNING',
      icon: '🎯',
      isMandatory: true
    },
    {
      id: 'task-physical-fitness',
      title: '20 دقيقة نشاط حركي وتمارين بدنية',
      durationMinutes: 20,
      category: 'HEALTH',
      icon: '💪',
      isMandatory: true
    },
    {
      id: 'task-evening-audit',
      title: 'مراجعة المسار وتخطيط الغد في 5 دقائق',
      durationMinutes: 5,
      category: 'PRODUCTIVITY',
      icon: '📝',
      isMandatory: true
    }
  ]
};

export const CHALLENGE_21_DAYS_PRESET: Omit<Challenge, 'currentDay' | 'completedDaysCount' | 'createdAt' | 'updatedAt'> = {
  id: 'preset-21-days-habits',
  title: 'تحدي غرس العادات الذهبية (21 يوماً)',
  description: 'ثلاثة أسابيع كافية لترسيخ المسارات العصبية لأي عادة جديدة في حياتك وفق المبدأ العلمي لبناء السلوك.',
  durationDays: 21,
  status: 'QUEUED',
  xpReward: 250,
  trophyIcon: '🎯',
  tasks: [
    {
      id: 'task-daily-quran',
      title: 'قراءة صفحتين أو أكثر من القرآن الكريم',
      durationMinutes: 10,
      category: 'FAITH',
      icon: '📖',
      isMandatory: true
    },
    {
      id: 'task-water-habit',
      title: 'شرب 2 لتر ماء ورياضة خفيفة',
      durationMinutes: 15,
      category: 'HEALTH',
      icon: '💧',
      isMandatory: true
    },
    {
      id: 'task-read-pages',
      title: 'قراءة صفحتين في كتاب النانو أو التخصص',
      durationMinutes: 10,
      category: 'LEARNING',
      icon: '📖',
      isMandatory: true
    }
  ]
};

export const ALL_CHALLENGE_PRESETS = [
  CHALLENGE_90_DAYS_PRESET,
  CHALLENGE_30_DAYS_PRESET,
  CHALLENGE_21_DAYS_PRESET
];
