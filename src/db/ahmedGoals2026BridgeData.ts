// ============================================================================
// Ahmed LifeOS November & December 2026 Bridge Plan to 2027 Goals
// Source: Ahmed_LifeOS_Nov_Dec_2026_Linked_Plan.md (YAML Source of Truth)
// Generated automatically - Idempotent, zero duplicate risks, 0 XP baseline
// ============================================================================

export interface Ahmed2026TaskDef {
  id: string;
  title: string;
  dueDate: string;
  estimatedMinutes: number;
}

export interface Ahmed2026GoalDef {
  id: string;
  title: string;
  why: string;
  horizon: 'annual' | 'quarterly' | 'monthly';
  parentId: string;
  startDate: string;
  targetDate: string;
  previousGoalId?: string | null;
  successCriteria: string;
  lifeArea: string;
  blessedIntentionSuggestion?: string;
  relatedExisting2027GoalIds: string[];
  priority?: string | null;
  tasks?: Ahmed2026TaskDef[] | null;
  bridge2026: boolean;
}

export const AHMED_2026_BRIDGE_CONFIG = {
  "planId": "ahmed-lifeos-2026-nov-dec-bridge-v1",
  "planTitle": "خطة نوفمبر وديسمبر 2026 التمهيدية المرتبطة بأهداف 2027",
  "status": "READY_FOR_IMPORT",
  "year": 2026,
  "startDate": "2026-11-01",
  "targetDate": "2026-12-31",
  "relatedApprovedPlanId": "ahmed-lifeos-2027-v1",
  "examPeriod": {
    "start": "2026-11-07",
    "end": "2026-11-21",
    "override_optional_learning": true,
    "retain_core_worship": true,
    "protect_sleep_hours": 7
  }
};

export const AHMED_2026_BRIDGE_GOALS_DATA: Ahmed2026GoalDef[] = [
  {
    "id": "B26-A-UNI",
    "title": "تهيئة الدراسة والبحث لبرنامج 2027 خلال نوفمبر وديسمبر 2026",
    "why": "أحمي أدائي الجامعي أثناء ميد نوفمبر وأدخل 2027 بنظام مذاكرة قابل للاستمرار.",
    "horizon": "annual",
    "parentId": "V-SCIENCE",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.",
    "lifeArea": "الجامعة والبحث العلمي",
    "blessedIntentionSuggestion": "طلب العلم النافع وإتقان الدراسة والوفاء بحقوق التعلم.",
    "relatedExisting2027GoalIds": [
      "A-UNI",
      "A-RESEARCH"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-Q4-UNI",
    "title": "عبور الميد وتثبيت أساس الدراسة لنهاية 2026",
    "why": "أحمي أدائي الجامعي أثناء ميد نوفمبر وأدخل 2027 بنظام مذاكرة قابل للاستمرار.",
    "horizon": "quarterly",
    "parentId": "B26-A-UNI",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.",
    "lifeArea": "الجامعة والبحث العلمي",
    "blessedIntentionSuggestion": "طلب العلم النافع وإتقان الدراسة والوفاء بحقوق التعلم.",
    "relatedExisting2027GoalIds": [
      "A-UNI",
      "A-RESEARCH"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-M11-UNI",
    "title": "اجتياز ميد نوفمبر 7–21 ومراجعة المواد دون تشتت",
    "why": "الامتحانات أولوية خلال 7–21 نوفمبر وأي كورسات إضافية لا يجوز أن تضر الاستعداد.",
    "horizon": "monthly",
    "parentId": "B26-Q4-UNI",
    "startDate": "2026-11-01",
    "targetDate": "2026-11-30",
    "previousGoalId": null,
    "successCriteria": "تنفيذ خطة مراجعة قبل الميد وأثناءه، وتسجيل نقاط الضعف عقب آخر امتحان.",
    "lifeArea": "الجامعة والبحث العلمي",
    "blessedIntentionSuggestion": "طلب العلم النافع وإتقان الدراسة والوفاء بحقوق التعلم.",
    "relatedExisting2027GoalIds": [
      "A-UNI",
      "A-RESEARCH"
    ],
    "priority": "protected",
    "tasks": [
      {
        "id": "UNI11-01",
        "title": "حصر المواد والموضوعات ومواعيد كل اختبار، وتجهيز خطة حل ومراجعة",
        "dueDate": "2026-11-02",
        "estimatedMinutes": 45
      },
      {
        "id": "UNI11-02",
        "title": "مراجعة مركزة يومية وحل أسئلة قبل بدء الميد",
        "dueDate": "2026-11-06",
        "estimatedMinutes": 0
      },
      {
        "id": "UNI11-03",
        "title": "خلال 7–21 نوفمبر: المذاكرة للاختبار التالي وتصحيح أخطاء الأسئلة السابقة",
        "dueDate": "2026-11-21",
        "estimatedMinutes": 0
      },
      {
        "id": "UNI11-04",
        "title": "بعد الميد: حصر فجوات Spectroscopy وBiomedicine وباقي المقررات",
        "dueDate": "2026-11-26",
        "estimatedMinutes": 60
      },
      {
        "id": "UNI11-05",
        "title": "العودة لكتلتين دراسيتين في أسبوع 22–30 نوفمبر",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 120
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-M12-UNI",
    "title": "تثبيت مذاكرة أسبوعية استعدادًا لاستكمال الترم و2027",
    "why": "بدون مذاكرة منتظمة لن تكون أهداف GPA قابلة للتحقق.",
    "horizon": "monthly",
    "parentId": "B26-Q4-UNI",
    "startDate": "2026-12-01",
    "targetDate": "2026-12-31",
    "previousGoalId": "B26-M11-UNI",
    "successCriteria": "خطة 7 ساعات ذاتية أسبوعيا قابلة للزيادة وفق نتائج الاختبارات، مع تسجيل الفعلي.",
    "lifeArea": "الجامعة والبحث العلمي",
    "blessedIntentionSuggestion": "طلب العلم النافع وإتقان الدراسة والوفاء بحقوق التعلم.",
    "relatedExisting2027GoalIds": [
      "A-UNI",
      "A-RESEARCH"
    ],
    "priority": "protected",
    "tasks": [
      {
        "id": "UNI12-01",
        "title": "تحديد خطة مذاكرة أسبوعية بالمحاضرات المتأخرة والواجبات",
        "dueDate": "2026-12-03",
        "estimatedMinutes": 45
      },
      {
        "id": "UNI12-02",
        "title": "تنفيذ ومتابعة 7 ساعات مذاكرة فعلية في الأسبوع الأول",
        "dueDate": "2026-12-06",
        "estimatedMinutes": 420
      },
      {
        "id": "UNI12-03",
        "title": "مراجعة الأخطاء وحل مسائل المواد الصعبة في الأسبوع الثاني",
        "dueDate": "2026-12-13",
        "estimatedMinutes": 420
      },
      {
        "id": "UNI12-04",
        "title": "مراجعة أسبوعية مع حل مسائل واسترجاع في الأسبوع الثالث",
        "dueDate": "2026-12-20",
        "estimatedMinutes": 420
      },
      {
        "id": "UNI12-05",
        "title": "تقييم الأسبوع الرابع والاستعداد لامتحانات أو تكليفات نهاية الترم",
        "dueDate": "2026-12-27",
        "estimatedMinutes": 420
      },
      {
        "id": "UNI12-06",
        "title": "متابعة Sciora وفق المطلوب فقط بعد التنسيق، بلا التزامات جديدة وقت الميد",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 0
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-A-FAMILY",
    "title": "بناء وعي الزواج والمسؤولية الأسرية قبل 2027",
    "why": "أتهيأ للزواج بوعي ومسؤولية، دون الخلط بين التعلم وبين تحقق الجاهزية المالية.",
    "horizon": "annual",
    "parentId": "V-FAMILY",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.",
    "lifeArea": "الأسرة والزواج",
    "blessedIntentionSuggestion": "بناء بيت قائم على المودة والرحمة والحقوق المتبادلة وبر الوالدين.",
    "relatedExisting2027GoalIds": [
      "A-MARRIAGE",
      "A-FAMILY"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-Q4-FAMILY",
    "title": "كورس الزواج وتعلّم الاستعداد الأسري خلال نوفمبر وديسمبر",
    "why": "أتهيأ للزواج بوعي ومسؤولية، دون الخلط بين التعلم وبين تحقق الجاهزية المالية.",
    "horizon": "quarterly",
    "parentId": "B26-A-FAMILY",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.",
    "lifeArea": "الأسرة والزواج",
    "blessedIntentionSuggestion": "بناء بيت قائم على المودة والرحمة والحقوق المتبادلة وبر الوالدين.",
    "relatedExisting2027GoalIds": [
      "A-MARRIAGE",
      "A-FAMILY"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-M11-FAMILY",
    "title": "بدء كورس الزواج المكوّن من 4 ساعات بعد انتهاء الميد",
    "why": "أتعلم أساسيات الاختيار والتواصل والمسؤولية من غير مزاحمة الاستعداد للامتحانات.",
    "horizon": "monthly",
    "parentId": "B26-Q4-FAMILY",
    "startDate": "2026-11-01",
    "targetDate": "2026-11-30",
    "previousGoalId": null,
    "successCriteria": "مشاهدة ساعتين من الأربع بعد 21 نوفمبر مع ملاحظات عملية؛ لا يُعتبر الكورس منتهيًا.",
    "lifeArea": "الأسرة والزواج",
    "blessedIntentionSuggestion": "بناء بيت قائم على المودة والرحمة والحقوق المتبادلة وبر الوالدين.",
    "relatedExisting2027GoalIds": [
      "A-MARRIAGE",
      "A-FAMILY"
    ],
    "priority": "high",
    "tasks": [
      {
        "id": "FAM11-01",
        "title": "تجهيز رابط كورس الزواج وملف ملاحظات أسئلة الزواج",
        "dueDate": "2026-11-22",
        "estimatedMinutes": 15
      },
      {
        "id": "FAM11-02",
        "title": "إنهاء الساعة الأولى من كورس الزواج مع 3 ملاحظات",
        "dueDate": "2026-11-25",
        "estimatedMinutes": 60
      },
      {
        "id": "FAM11-03",
        "title": "إنهاء الساعة الثانية من كورس الزواج مع 3 ملاحظات",
        "dueDate": "2026-11-29",
        "estimatedMinutes": 60
      },
      {
        "id": "FAM11-04",
        "title": "الحفاظ على صلة الأهل والجدة بأوقات متفق عليها حتى أثناء الميد",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 0
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-M12-FAMILY",
    "title": "إكمال كورس الزواج 4 ساعات وتلخيص ما تعلمته",
    "why": "أحوّل التعلم إلى أسئلة عملية وحدود واضحة بدل مشاهدة المحتوى فقط.",
    "horizon": "monthly",
    "parentId": "B26-Q4-FAMILY",
    "startDate": "2026-12-01",
    "targetDate": "2026-12-31",
    "previousGoalId": "B26-M11-FAMILY",
    "successCriteria": "استكمال الساعتين المتبقيتين وإعداد صفحة مراجعة للمفاهيم والأسئلة الأساسية.",
    "lifeArea": "الأسرة والزواج",
    "blessedIntentionSuggestion": "بناء بيت قائم على المودة والرحمة والحقوق المتبادلة وبر الوالدين.",
    "relatedExisting2027GoalIds": [
      "A-MARRIAGE",
      "A-FAMILY"
    ],
    "priority": "high",
    "tasks": [
      {
        "id": "FAM12-01",
        "title": "إكمال الساعة الثالثة من كورس الزواج",
        "dueDate": "2026-12-03",
        "estimatedMinutes": 60
      },
      {
        "id": "FAM12-02",
        "title": "إكمال الساعة الرابعة من كورس الزواج",
        "dueDate": "2026-12-07",
        "estimatedMinutes": 60
      },
      {
        "id": "FAM12-03",
        "title": "تلخيص الكورس: 10 أفكار أو أسئلة أراجعها لاحقًا",
        "dueDate": "2026-12-10",
        "estimatedMinutes": 45
      },
      {
        "id": "FAM12-04",
        "title": "صلة الرحم الأسبوعية وبر الوالدين دون تحويلها لنقاط شكلية",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 0
      },
      {
        "id": "FAM12-05",
        "title": "كتابة قائمة أولية لمهارات الزواج التي تحتاج متابعة في 2027",
        "dueDate": "2026-12-30",
        "estimatedMinutes": 30
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-A-FALCON",
    "title": "الاستعداد لتطوير تسويق وتشغيل فلكون في 2027",
    "why": "أتعلم التسويق بالتدرج وأطبّق ما ينفع فلكون دون تشتيت أو رفع مخاطر الطلبات.",
    "horizon": "annual",
    "parentId": "V-FALCON",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.",
    "lifeArea": "فلكون والأعمال",
    "blessedIntentionSuggestion": "الكسب الحلال والإحسان للعملاء والوفاء بالالتزامات.",
    "relatedExisting2027GoalIds": [
      "A-FALCON"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-Q4-FALCON",
    "title": "تعلم التسويق تدريجيًا دون تعطيل تشغيل فلكون أثناء الميد",
    "why": "أتعلم التسويق بالتدرج وأطبّق ما ينفع فلكون دون تشتيت أو رفع مخاطر الطلبات.",
    "horizon": "quarterly",
    "parentId": "B26-A-FALCON",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.",
    "lifeArea": "فلكون والأعمال",
    "blessedIntentionSuggestion": "الكسب الحلال والإحسان للعملاء والوفاء بالالتزامات.",
    "relatedExisting2027GoalIds": [
      "A-FALCON"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-M11-FALCON",
    "title": "تفويض فلكون وقت الميد والعودة لكورس التسويق بعده",
    "why": "أحمي وقت المذاكرة ولا أوقف تشغيل الطلبات أو أحمّل نفسي تعلّمًا إضافيًا أثناء الاختبارات.",
    "horizon": "monthly",
    "parentId": "B26-Q4-FALCON",
    "startDate": "2026-11-01",
    "targetDate": "2026-11-30",
    "previousGoalId": null,
    "successCriteria": "خطة تفويض واضحة للميد + ساعتان كورس تسويق خلال 22–30 نوفمبر.",
    "lifeArea": "فلكون والأعمال",
    "blessedIntentionSuggestion": "الكسب الحلال والإحسان للعملاء والوفاء بالالتزامات.",
    "relatedExisting2027GoalIds": [
      "A-FALCON"
    ],
    "priority": "high",
    "tasks": [
      {
        "id": "FAL11-01",
        "title": "تحديد المسؤول عن الردود والطلبات والطباعة أثناء 7–21 نوفمبر",
        "dueDate": "2026-11-05",
        "estimatedMinutes": 45
      },
      {
        "id": "FAL11-02",
        "title": "متابعة تشغيل فلكون بالحد الضروري أثناء الميد دون حملات توسع جديدة",
        "dueDate": "2026-11-21",
        "estimatedMinutes": 0
      },
      {
        "id": "FAL11-03",
        "title": "كورس التسويق: جلسة 60 دقيقة بعد انتهاء الميد",
        "dueDate": "2026-11-25",
        "estimatedMinutes": 60
      },
      {
        "id": "FAL11-04",
        "title": "كورس التسويق: جلسة 60 دقيقة + 3 أفكار قابلة للتجربة",
        "dueDate": "2026-11-29",
        "estimatedMinutes": 60
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-M12-FALCON",
    "title": "الانتظام في كورس التسويق 2–4 ساعات أسبوعيًا",
    "why": "أتعلم عناصر التسويق المتعلقة بفلكون وأقيّمها عمليًا بدل السعي لإنهاء كورس كامل بسرعة.",
    "horizon": "monthly",
    "parentId": "B26-Q4-FALCON",
    "startDate": "2026-12-01",
    "targetDate": "2026-12-31",
    "previousGoalId": "B26-M11-FALCON",
    "successCriteria": "إنجاز 2 ساعة على الأقل في كل أسبوع كامل من ديسمبر؛ 8 ساعات إجمالًا حد عملي، و16 ساعة هدف أعلى، دون اشتراط إنهاء الكورس.",
    "lifeArea": "فلكون والأعمال",
    "blessedIntentionSuggestion": "الكسب الحلال والإحسان للعملاء والوفاء بالالتزامات.",
    "relatedExisting2027GoalIds": [
      "A-FALCON"
    ],
    "priority": "high",
    "tasks": [
      {
        "id": "FAL12-W1",
        "title": "التسويق — الأسبوع 1: ساعتان من الكورس",
        "dueDate": "2026-12-06",
        "estimatedMinutes": 120
      },
      {
        "id": "FAL12-W2",
        "title": "التسويق — الأسبوع 2: ساعتان من الكورس",
        "dueDate": "2026-12-13",
        "estimatedMinutes": 120
      },
      {
        "id": "FAL12-W3",
        "title": "التسويق — الأسبوع 3: ساعتان من الكورس",
        "dueDate": "2026-12-20",
        "estimatedMinutes": 120
      },
      {
        "id": "FAL12-W4",
        "title": "التسويق — الأسبوع 4: ساعتان من الكورس",
        "dueDate": "2026-12-27",
        "estimatedMinutes": 120
      },
      {
        "id": "FAL12-05",
        "title": "تلخيص 5 أفكار تسويقية، واختيار تجربة صغيرة بميزانية لا تُنفَّذ دون تقييم",
        "dueDate": "2026-12-29",
        "estimatedMinutes": 60
      },
      {
        "id": "FAL12-06",
        "title": "اختياري: ساعة مراجعة بالكورس في أيام 28–31 ديسمبر لو فيه سعة",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 60
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-A-AI",
    "title": "تمهيد تعلم حلول الذكاء الاصطناعي التطبيقية قبل 2027",
    "why": "أبني مهارات عملية تسمح لي بتطبيق AI داخل فلكون ثم تقديم حلول مدفوعة مستقبلًا.",
    "horizon": "annual",
    "parentId": "V-AI",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "blessedIntentionSuggestion": "طلب العلم النافع وتوظيف التقنية بما ينفع الناس دون تضليل.",
    "relatedExisting2027GoalIds": [
      "A-AI",
      "A-FALCON"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-Q4-AI",
    "title": "استمرار كورس AI في الوقت المتاح ونقل الفهم إلى تطبيق بسيط",
    "why": "أبني مهارات عملية تسمح لي بتطبيق AI داخل فلكون ثم تقديم حلول مدفوعة مستقبلًا.",
    "horizon": "quarterly",
    "parentId": "B26-A-AI",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "blessedIntentionSuggestion": "طلب العلم النافع وتوظيف التقنية بما ينفع الناس دون تضليل.",
    "relatedExisting2027GoalIds": [
      "A-AI",
      "A-FALCON"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-M11-AI",
    "title": "استئناف كورس AI بعد الميد بواقع ساعتين",
    "why": "الميد له الأولوية أولًا ثم أعود للتعلم تدريجيًا.",
    "horizon": "monthly",
    "parentId": "B26-Q4-AI",
    "startDate": "2026-11-01",
    "targetDate": "2026-11-30",
    "previousGoalId": null,
    "successCriteria": "ساعتان كورس AI بين 22 و30 نوفمبر، دون التزام دراسة الكورس أثناء الامتحانات.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "blessedIntentionSuggestion": "طلب العلم النافع وتوظيف التقنية بما ينفع الناس دون تضليل.",
    "relatedExisting2027GoalIds": [
      "A-AI",
      "A-FALCON"
    ],
    "priority": "high",
    "tasks": [
      {
        "id": "AI11-01",
        "title": "تحديد الدرس التالي بكورس AI وتجهيز ملف ملاحظات",
        "dueDate": "2026-11-22",
        "estimatedMinutes": 15
      },
      {
        "id": "AI11-02",
        "title": "كورس AI: 60 دقيقة تعلم",
        "dueDate": "2026-11-26",
        "estimatedMinutes": 60
      },
      {
        "id": "AI11-03",
        "title": "كورس AI: 60 دقيقة تعلم وتلخيص تطبيق عملي واحد",
        "dueDate": "2026-11-29",
        "estimatedMinutes": 60
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-M12-AI",
    "title": "الانتظام في كورس AI من ساعتين إلى 4 ساعات أسبوعيًا",
    "why": "أستثمر في تعلم AI تطبيقيًا من دون إطلاق مشروع عميل قبل الاستعداد.",
    "horizon": "monthly",
    "parentId": "B26-Q4-AI",
    "startDate": "2026-12-01",
    "targetDate": "2026-12-31",
    "previousGoalId": "B26-M11-AI",
    "successCriteria": "ساعتان أسبوعيًا على الأقل في أسابيع ديسمبر الأربعة، بإجمالي أساسي 8 ساعات، وطموح 16، مع ملاحظة تطبيقية واحدة.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "blessedIntentionSuggestion": "طلب العلم النافع وتوظيف التقنية بما ينفع الناس دون تضليل.",
    "relatedExisting2027GoalIds": [
      "A-AI",
      "A-FALCON"
    ],
    "priority": "high",
    "tasks": [
      {
        "id": "AI12-W1",
        "title": "AI — الأسبوع 1: ساعتان من الكورس",
        "dueDate": "2026-12-06",
        "estimatedMinutes": 120
      },
      {
        "id": "AI12-W2",
        "title": "AI — الأسبوع 2: ساعتان من الكورس",
        "dueDate": "2026-12-13",
        "estimatedMinutes": 120
      },
      {
        "id": "AI12-W3",
        "title": "AI — الأسبوع 3: ساعتان من الكورس",
        "dueDate": "2026-12-20",
        "estimatedMinutes": 120
      },
      {
        "id": "AI12-W4",
        "title": "AI — الأسبوع 4: ساعتان من الكورس",
        "dueDate": "2026-12-27",
        "estimatedMinutes": 120
      },
      {
        "id": "AI12-05",
        "title": "توثيق تجربة AI صغيرة مرتبطة بمشكلة من فلكون داخل وقت التعلم أو فلكون، دون ازدواج احتساب",
        "dueDate": "2026-12-30",
        "estimatedMinutes": 60
      },
      {
        "id": "AI12-06",
        "title": "اختياري: مراجعة 60 دقيقة لو الوقت يسمح في آخر ديسمبر",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 60
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-A-FINANCE",
    "title": "تجهيز الانضباط المالي واختبار أهلية توزيعات فلكون في 2027",
    "why": "أفصل ربح الشركة عن دخلي الشخصي ولا أبني جمعية أو زواجًا على مال غير متاح.",
    "horizon": "annual",
    "parentId": "V-FINANCE",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.",
    "lifeArea": "المال والادخار",
    "blessedIntentionSuggestion": "الأمانة في الحقوق وحسن تدبير المال والاستغناء بالحلال.",
    "relatedExisting2027GoalIds": [
      "A-FINANCE",
      "A-FALCON",
      "A-MARRIAGE"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-Q4-FINANCE",
    "title": "مراجعة الدفاتر والسيولة قبل أي توزيع أرباح",
    "why": "أفصل ربح الشركة عن دخلي الشخصي ولا أبني جمعية أو زواجًا على مال غير متاح.",
    "horizon": "quarterly",
    "parentId": "B26-A-FINANCE",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.",
    "lifeArea": "المال والادخار",
    "blessedIntentionSuggestion": "الأمانة في الحقوق وحسن تدبير المال والاستغناء بالحلال.",
    "relatedExisting2027GoalIds": [
      "A-FINANCE",
      "A-FALCON",
      "A-MARRIAGE"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-M11-FINANCE",
    "title": "جمع بيانات فلكون المالية المتفرقة دون التخمين",
    "why": "الدفاتر الجزئية لا تثبت وجود سيولة قابلة للتوزيع.",
    "horizon": "monthly",
    "parentId": "B26-Q4-FINANCE",
    "startDate": "2026-11-01",
    "targetDate": "2026-11-30",
    "previousGoalId": null,
    "successCriteria": "تحديد مصادر البيانات والأشهر الناقصة وتصنيف المصروفات والتحصيلات غير الموثقة.",
    "lifeArea": "المال والادخار",
    "blessedIntentionSuggestion": "الأمانة في الحقوق وحسن تدبير المال والاستغناء بالحلال.",
    "relatedExisting2027GoalIds": [
      "A-FINANCE",
      "A-FALCON",
      "A-MARRIAGE"
    ],
    "priority": "maintenance",
    "tasks": [
      {
        "id": "FIN11-01",
        "title": "تجميع ملفات البيع والمصروفات والتحصيل الموجودة من آخر 3 شهور",
        "dueDate": "2026-11-29",
        "estimatedMinutes": 90
      },
      {
        "id": "FIN11-02",
        "title": "قائمة بالمبالغ الناقصة أو غير الموثقة لمراجعتها لاحقًا",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 45
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-M12-FINANCE",
    "title": "إغلاق سجل نوفمبر وديسمبر وإعداد مراجعة سيولة يناير",
    "why": "اختبار التوزيعات يتطلب أرقامًا حقيقية والتزامات تشغيل واحتياطيًا مناسبًا.",
    "horizon": "monthly",
    "parentId": "B26-Q4-FINANCE",
    "startDate": "2026-12-01",
    "targetDate": "2026-12-31",
    "previousGoalId": "B26-M11-FINANCE",
    "successCriteria": "ملخص مبيعات/تحصيلات/مصروفات/التزامات/سيولة لشهري نوفمبر وديسمبر مع بيان فجوات التوثيق.",
    "lifeArea": "المال والادخار",
    "blessedIntentionSuggestion": "الأمانة في الحقوق وحسن تدبير المال والاستغناء بالحلال.",
    "relatedExisting2027GoalIds": [
      "A-FINANCE",
      "A-FALCON",
      "A-MARRIAGE"
    ],
    "priority": "maintenance",
    "tasks": [
      {
        "id": "FIN12-01",
        "title": "تثبيت قالب تسجيل التدفقات النقدية اليومية والمبالغ المستحقة",
        "dueDate": "2026-12-05",
        "estimatedMinutes": 60
      },
      {
        "id": "FIN12-02",
        "title": "مطابقة تحصيلات ومصاريف نوفمبر وتسجيل الفروق",
        "dueDate": "2026-12-15",
        "estimatedMinutes": 90
      },
      {
        "id": "FIN12-03",
        "title": "مراجعة حسابات ديسمبر والالتزامات التشغيلية القادمة",
        "dueDate": "2026-12-30",
        "estimatedMinutes": 90
      },
      {
        "id": "FIN12-04",
        "title": "إعداد قائمة شروط مراجعة التوزيع في يناير 2027؛ دون إجراء أي صرف",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 45
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-A-FAITH",
    "title": "الثبات على القرآن والعبادات قبل انطلاق 2027",
    "why": "أحفظ مكان العبادة في الجدول حتى مع ضغط الدراسة.",
    "horizon": "annual",
    "parentId": "V-FAITH",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.",
    "lifeArea": "الدين والعبادات",
    "blessedIntentionSuggestion": "إخلاص العبادة لله وتحسين الخلق والمواظبة بغير تكلف.",
    "relatedExisting2027GoalIds": [
      "A-QURAN",
      "A-FIQH"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-Q4-FAITH",
    "title": "الحفاظ على أصل العبادات والتزكية أثناء الميد وبعده",
    "why": "أحفظ مكان العبادة في الجدول حتى مع ضغط الدراسة.",
    "horizon": "quarterly",
    "parentId": "B26-A-FAITH",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.",
    "lifeArea": "الدين والعبادات",
    "blessedIntentionSuggestion": "إخلاص العبادة لله وتحسين الخلق والمواظبة بغير تكلف.",
    "relatedExisting2027GoalIds": [
      "A-QURAN",
      "A-FIQH"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-M11-FAITH",
    "title": "حماية الصلاة والقرآن والمراجعة ودرس الجمعة أثناء الميد",
    "why": "أحافظ على عادتي التعبدية قريبًا من المعتاد حتى في الامتحانات.",
    "horizon": "monthly",
    "parentId": "B26-Q4-FAITH",
    "startDate": "2026-11-01",
    "targetDate": "2026-11-30",
    "previousGoalId": null,
    "successCriteria": "متابعة أسبوعية واقعية للصلاة والأذكار والقرآن ودرس الجمعة وفق الظروف دون منح تقييم للإخلاص.",
    "lifeArea": "الدين والعبادات",
    "blessedIntentionSuggestion": "إخلاص العبادة لله وتحسين الخلق والمواظبة بغير تكلف.",
    "relatedExisting2027GoalIds": [
      "A-QURAN",
      "A-FIQH"
    ],
    "priority": "protected",
    "tasks": [
      {
        "id": "FAITH11-01",
        "title": "قرآن يومي: 15 دقيقة على الأقل في اليوم المزدحم مع مراجعة محفوظ سابق",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 0
      },
      {
        "id": "FAITH11-02",
        "title": "المحافظة على الصلاة والأذكار والسنن بحسب الاستطاعة",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 0
      },
      {
        "id": "FAITH11-03",
        "title": "درس القرآن الجمعة بعد العصر إن كان قائمًا ولا يتعارض مع امتحان لازم",
        "dueDate": "2026-11-27",
        "estimatedMinutes": 0
      },
      {
        "id": "FAITH11-04",
        "title": "مراجعة خُلق واحد أسبوعيًا برفق وصدق",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 0
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-M12-FAITH",
    "title": "تثبيت عادة القرآن والفقه والاستعداد لمسار 2027",
    "why": "أدخل يناير وروتين الحفظ والمراجعة والفقه قائم بالفعل.",
    "horizon": "monthly",
    "parentId": "B26-Q4-FAITH",
    "startDate": "2026-12-01",
    "targetDate": "2026-12-31",
    "previousGoalId": "B26-M11-FAITH",
    "successCriteria": "قرآن ومراجعة منتظمان وخطة واضحة لكتاب الفقه الميسر ومراجعة أخلاق أسبوعية.",
    "lifeArea": "الدين والعبادات",
    "blessedIntentionSuggestion": "إخلاص العبادة لله وتحسين الخلق والمواظبة بغير تكلف.",
    "relatedExisting2027GoalIds": [
      "A-QURAN",
      "A-FIQH"
    ],
    "priority": "protected",
    "tasks": [
      {
        "id": "FAITH12-01",
        "title": "قرآن يومي 15 دقيقة حد أدنى، وزيادة 30–60 دقيقة عند سعة اليوم",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 0
      },
      {
        "id": "FAITH12-02",
        "title": "تحديد ترتيب أبواب الفقه الميسر وآلية الاختبار بعد كل باب",
        "dueDate": "2026-12-15",
        "estimatedMinutes": 45
      },
      {
        "id": "FAITH12-03",
        "title": "الاستمرار في درس الجمعة ومراجعة السلوك الأسبوعية",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 0
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-A-HEALTH",
    "title": "حماية النوم والتعافي من الإصابة خلال نهاية 2026",
    "why": "العبادة والدراسة والعمل تحتاج نومًا حقيقيًا وتعافيًا طبيًا.",
    "horizon": "annual",
    "parentId": "V-HEALTH",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.",
    "lifeArea": "الصحة واللياقة",
    "blessedIntentionSuggestion": "حفظ الجسد والقدرة على أداء الحقوق والالتزامات.",
    "relatedExisting2027GoalIds": [
      "A-HEALTH"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-Q4-HEALTH",
    "title": "استقرار التعافي والنوم استعدادًا لعام 2027",
    "why": "العبادة والدراسة والعمل تحتاج نومًا حقيقيًا وتعافيًا طبيًا.",
    "horizon": "quarterly",
    "parentId": "B26-A-HEALTH",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.",
    "lifeArea": "الصحة واللياقة",
    "blessedIntentionSuggestion": "حفظ الجسد والقدرة على أداء الحقوق والالتزامات.",
    "relatedExisting2027GoalIds": [
      "A-HEALTH"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-M11-HEALTH",
    "title": "حماية 7 ساعات نوم يوميًا واحترام قيود الإصابة أثناء الميد",
    "why": "الإرهاق أو الانتكاسة يضعف المذاكرة والصحة.",
    "horizon": "monthly",
    "parentId": "B26-Q4-HEALTH",
    "startDate": "2026-11-01",
    "targetDate": "2026-11-30",
    "previousGoalId": null,
    "successCriteria": "متابعة النوم الواقعي وتطبيق تعليمات المختص دون بدء تمرين غير مسموح.",
    "lifeArea": "الصحة واللياقة",
    "blessedIntentionSuggestion": "حفظ الجسد والقدرة على أداء الحقوق والالتزامات.",
    "relatedExisting2027GoalIds": [
      "A-HEALTH"
    ],
    "priority": "protected",
    "tasks": [
      {
        "id": "HEALTH11-01",
        "title": "استهداف 7 ساعات نوم فعلي في اليوم وتدوين المتوسط أسبوعيًا",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 0
      },
      {
        "id": "HEALTH11-02",
        "title": "الامتناع عن العودة للجيم/الملاكمة/الكرة دون سماح طبي",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 0
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-M12-HEALTH",
    "title": "استقرار النوم والعودة للحركة المناسبة طبيًا استعدادًا لـ2027",
    "why": "أستعيد اللياقة بتدرج ولا أكرر الإصابة.",
    "horizon": "monthly",
    "parentId": "B26-Q4-HEALTH",
    "startDate": "2026-12-01",
    "targetDate": "2026-12-31",
    "previousGoalId": "B26-M11-HEALTH",
    "successCriteria": "نوم فعلي ~7 ساعات، وحركة أو تأهيل وفق التوجيه الطبي فقط.",
    "lifeArea": "الصحة واللياقة",
    "blessedIntentionSuggestion": "حفظ الجسد والقدرة على أداء الحقوق والالتزامات.",
    "relatedExisting2027GoalIds": [
      "A-HEALTH"
    ],
    "priority": "protected",
    "tasks": [
      {
        "id": "HEALTH12-01",
        "title": "تقييم نمط النوم كل أسبوع وتعديل مواعيد الاستيقاظ تدريجيًا",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 0
      },
      {
        "id": "HEALTH12-02",
        "title": "إن سمح الطبيب: نشاط تدريجي؛ وإن لم يسمح فالالتزام بالتعافي",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 0
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-A-READ",
    "title": "قراءة كتابَي الزواج تمهيدًا لأهداف 2027",
    "why": "أفهم الخطوبة والحياة الأسرية نظريًا وأربط القراءة بالمسؤولية الشخصية.",
    "horizon": "annual",
    "parentId": "V-READ",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.",
    "lifeArea": "القراءة والتعلم",
    "blessedIntentionSuggestion": "طلب العلم النافع وبناء وعي يحفظ حقوق الأسرة.",
    "relatedExisting2027GoalIds": [
      "A-READ",
      "A-MARRIAGE"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-Q4-READ",
    "title": "بدء الخطوبة الآمنة وإنهاء الكتابين قبل نهاية 2026 إن سمح الحجم والجدول",
    "why": "أفهم الخطوبة والحياة الأسرية نظريًا وأربط القراءة بالمسؤولية الشخصية.",
    "horizon": "quarterly",
    "parentId": "B26-A-READ",
    "startDate": "2026-11-01",
    "targetDate": "2026-12-31",
    "previousGoalId": null,
    "successCriteria": "غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.",
    "lifeArea": "القراءة والتعلم",
    "blessedIntentionSuggestion": "طلب العلم النافع وبناء وعي يحفظ حقوق الأسرة.",
    "relatedExisting2027GoalIds": [
      "A-READ",
      "A-MARRIAGE"
    ],
    "priority": null,
    "tasks": null,
    "bridge2026": true
  },
  {
    "id": "B26-M11-READ",
    "title": "بدء قراءة كتاب الخطوبة الآمنة بعد انتهاء الميد",
    "why": "القراءة المركزة في موضوع الزواج تساعد على اتخاذ قرارات أكثر وعيًا.",
    "horizon": "monthly",
    "parentId": "B26-Q4-READ",
    "startDate": "2026-11-01",
    "targetDate": "2026-11-30",
    "previousGoalId": null,
    "successCriteria": "البدء في الخطوبة الآمنة، وتحديد إجمالي صفحات النسخة الفعلية ثم قراءة نحو 20–30% منها إن أمكن.",
    "lifeArea": "القراءة والتعلم",
    "blessedIntentionSuggestion": "طلب العلم النافع وبناء وعي يحفظ حقوق الأسرة.",
    "relatedExisting2027GoalIds": [
      "A-READ",
      "A-MARRIAGE"
    ],
    "priority": "high",
    "tasks": [
      {
        "id": "READ11-01",
        "title": "الحصول على نسخة كتاب الخطوبة الآمنة وتدوين عدد صفحات النسخة",
        "dueDate": "2026-11-22",
        "estimatedMinutes": 15
      },
      {
        "id": "READ11-02",
        "title": "ثلاث جلسات قراءة 25–35 دقيقة بعد الميد مع ملاحظات",
        "dueDate": "2026-11-29",
        "estimatedMinutes": 90
      },
      {
        "id": "READ11-03",
        "title": "حساب خطة الصفحات المتبقية للوصول للنهاية يوم 15 ديسمبر",
        "dueDate": "2026-11-30",
        "estimatedMinutes": 20
      }
    ],
    "bridge2026": true
  },
  {
    "id": "B26-M12-READ",
    "title": "إنهاء الخطوبة الآمنة وبيوت مطمئنة وتلخيص الفوائد",
    "why": "أكمل ما بدأت وأحوّل الكتابين إلى مبادئ وأسئلة عملية.",
    "horizon": "monthly",
    "parentId": "B26-Q4-READ",
    "startDate": "2026-12-01",
    "targetDate": "2026-12-31",
    "previousGoalId": "B26-M11-READ",
    "successCriteria": "إنهاء الكتابين عند إمكان ذلك بعد التحقق من عدد الصفحات؛ تلخيص أهم الأفكار دون استعجال مخل.",
    "lifeArea": "القراءة والتعلم",
    "blessedIntentionSuggestion": "طلب العلم النافع وبناء وعي يحفظ حقوق الأسرة.",
    "relatedExisting2027GoalIds": [
      "A-READ",
      "A-MARRIAGE"
    ],
    "priority": "high",
    "tasks": [
      {
        "id": "READ12-01",
        "title": "إتمام الخطوبة الآمنة أو تقييم الصفحات المتبقية حسب النسخة",
        "dueDate": "2026-12-15",
        "estimatedMinutes": 0
      },
      {
        "id": "READ12-02",
        "title": "بدء كتاب بيوت مطمئنة وتحديد عدد صفحاته الفعلي",
        "dueDate": "2026-12-16",
        "estimatedMinutes": 30
      },
      {
        "id": "READ12-03",
        "title": "جلسات قراءة 25–35 دقيقة، 4 مرات أسبوعيًا مع توزيع صفحات الكتاب",
        "dueDate": "2026-12-30",
        "estimatedMinutes": 0
      },
      {
        "id": "READ12-04",
        "title": "إنهاء بيوت مطمئنة إن كان حجم النسخة والوقت يسمحان",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 0
      },
      {
        "id": "READ12-05",
        "title": "كتابة مقارنة مختصرة: 5 فوائد من كل كتاب وما الذي أريد تطبيقه",
        "dueDate": "2026-12-31",
        "estimatedMinutes": 60
      }
    ],
    "bridge2026": true
  }
];
