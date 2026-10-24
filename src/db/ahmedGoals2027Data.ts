/**
 * Ahmed 2027 Approved Strategic Goals Plan Data
 * Source of Truth: docs/ahmed-lifeos-2027-goals.md
 * 195 Total Goals: 8 Visions, 11 Annual, 44 Quarterly, 132 Monthly.
 * Plan Status: APPROVED
 */

export interface RawGoalPlanItem {
  id: string;
  title: string;
  why: string;
  lifeArea: string;
  horizon: 'vision_3_5_years' | 'annual' | 'quarterly' | 'monthly';
  parentId: string | null;
  previousGoalId: string | null;
  targetDate: string;
  blessedIntentionSuggestion: string;
  successCriteria: string;
  milestones: string[];
  actionTemplates: string[];
  existingGoalMatch: {
    title: string;
    targetDate: string;
    preserveExistingText: boolean;
  } | null;
}

export interface Ahmed2027PlanConfig {
  planId: string;
  planTitle: string;
  status: 'APPROVED' | 'DRAFT_NOT_APPROVED';
  year: number;
  approvedByUser: boolean;
  approvedOn: string;
}

export const AHMED_2027_PLAN_CONFIG: Ahmed2027PlanConfig = {
  planId: "ahmed-lifeos-2027-v1",
  planTitle: "خطة أحمد 2027 — أهداف مترابطة لـ LifeOS",
  status: "APPROVED",
  year: 2027,
  approvedByUser: true,
  approvedOn: "2026-10-24"
};

export const AHMED_2027_GOALS_DATA: RawGoalPlanItem[] = [
  {
    "id": "V-FAITH",
    "title": "القرآن والفقه وتزكية النفس حتى 2031",
    "why": "أسعى لإتمام حفظ القرآن الكريم وفهمه خلال سنوات الرؤية، وأتعلم أحكام ديني وأزكي نفسي وأحسن أخلاقي.",
    "lifeArea": "الدين والعبادات",
    "horizon": "vision_3_5_years",
    "parentId": null,
    "previousGoalId": null,
    "targetDate": "2031-12-31",
    "blessedIntentionSuggestion": "ابتغاء مرضاة الله وتزكية النفس.",
    "successCriteria": "رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.",
    "milestones": [],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "V-FAMILY",
    "title": "أسرة مستقرة وبر الوالدين وصلة الرحم حتى 2031",
    "why": "أكون سندًا لأهلي وأتجه نحو زواج مستقر يقوم على المسؤولية والرحمة.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "vision_3_5_years",
    "parentId": null,
    "previousGoalId": null,
    "targetDate": "2031-12-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الأرحام والإحسان إلى الأهل.",
    "successCriteria": "رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.",
    "milestones": [],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "V-SCIENCE",
    "title": "التخصص العميق في النانو وأشباه الموصلات حتى 2031",
    "why": "أبني أساسًا فيزيائيًا وبحثيًا عميقًا وأساهم في فريق بحث وتطوير ونموذج أولي مرتبط بأشباه الموصلات في مصر بحلول 2031.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "vision_3_5_years",
    "parentId": null,
    "previousGoalId": null,
    "targetDate": "2031-12-31",
    "blessedIntentionSuggestion": "تعلم علم نافع وتسخيره لخدمة الناس.",
    "successCriteria": "رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.",
    "milestones": [],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "V-FALCON",
    "title": "بناء مشروعات قوية ومستقلة تشغيليًا حتى 2031",
    "why": "أؤسس ثلاثة مشروعات مستقرة على الأقل بحلول 2031، تبدأ بفلكون وتتدرج نحو بشرى وقهوة العلماء عند توفر القدرة دون تشتيت مبكر.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "vision_3_5_years",
    "parentId": null,
    "previousGoalId": null,
    "targetDate": "2031-12-31",
    "blessedIntentionSuggestion": "الكسب الحلال والإتقان والوفاء بحقوق العملاء والعاملين.",
    "successCriteria": "رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.",
    "milestones": [],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "V-FINANCE",
    "title": "استقلال مالي شخصي مستدام حتى 2031",
    "why": "أبني دخلًا شخصيًا مستقرًا ومدخرات واستثمارات متدرجة، وأستهدف على المدى البعيد قوة شرائية لدخل شهري تعادل 15 جرام ذهب على الأقل دون مخاطر غير محسوبة.",
    "lifeArea": "المال والادخار",
    "horizon": "vision_3_5_years",
    "parentId": null,
    "previousGoalId": null,
    "targetDate": "2031-12-31",
    "blessedIntentionSuggestion": "الاستغناء بالحلال والقدرة على تحمل المسؤوليات والإنفاق النافع.",
    "successCriteria": "رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.",
    "milestones": [],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "V-AI",
    "title": "خبرة عملية في حلول AI ونشر العلم حتى 2031",
    "why": "أجمع بين الذكاء الاصطناعي والعلوم والعمل التجاري في حلول عملية ومحتوى نافع للطلاب.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "vision_3_5_years",
    "parentId": null,
    "previousGoalId": null,
    "targetDate": "2031-12-31",
    "blessedIntentionSuggestion": "نفع الناس بالعلم والخبرة والعمل المتقن.",
    "successCriteria": "رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.",
    "milestones": [],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "V-HEALTH",
    "title": "الصحة واللياقة المستدامة حتى 2031",
    "why": "أحافظ على جسد قوي ونوم كافٍ ولياقة تساعدني على العبادة والدراسة والعمل بلا إنهاك مستمر.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "vision_3_5_years",
    "parentId": null,
    "previousGoalId": null,
    "targetDate": "2031-12-31",
    "blessedIntentionSuggestion": "حفظ الصحة والقوة على أداء المسؤوليات.",
    "successCriteria": "رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.",
    "milestones": [],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "V-READ",
    "title": "قراءة 75",
    "why": "لأنه هيخليني مثقف أكتر وعندي وعي وثقافة. عاوز أقرأ الكتب اللي تفيدني سواء في الدين أو العلم أو علم النفس والبزنس وكتابة المحتوى؛ وأبني ثروة معلوماتية وقدرة على الفهم والإقناع.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "vision_3_5_years",
    "parentId": null,
    "previousGoalId": null,
    "targetDate": "2030-01-01",
    "blessedIntentionSuggestion": "طلب العلم النافع والعمل به ونشر ما يفيد.",
    "successCriteria": "رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.",
    "milestones": [],
    "actionTemplates": [],
    "existingGoalMatch": {
      "title": "قراءة 75",
      "targetDate": "2030-01-01",
      "preserveExistingText": true
    }
  },
  {
    "id": "A-QURAN",
    "title": "إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027",
    "why": "أريد فهم القرآن وحفظه بثبات، مع مراجعة حقيقية وتَسميع يثبت الإتقان؛ الطموح 6–7 أجزاء إذا سمح الواقع.",
    "lifeArea": "الدين والعبادات",
    "horizon": "annual",
    "parentId": "V-FAITH",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "90 صفحة جديدة متقنة تقريبًا ≈ 4.5 أجزاء؛ لا تُحسب الصفحة دون تسميع ومراجعة مؤجلة.",
    "milestones": [],
    "actionTemplates": [
      "15 دقيقة كحد أدنى في اليوم المزدحم",
      "30–60 دقيقة في الأيام المتاحة",
      "درس القرآن الجمعة بعد العصر",
      "تسميع ومراجعة أسبوعية واختبار احتفاظ شهري"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-QURAN",
    "title": "تأسيس حفظ ومراجعة متقنين حتى 20 صفحة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "quarterly",
    "parentId": "A-QURAN",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "تأسيس حفظ ومراجعة متقنين حتى 20 صفحة",
    "milestones": [
      "تثبيت وقت الحفظ والتسميع",
      "إتمام اختبار استرجاع للصفحات الجديدة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-QURAN",
    "title": "7 صفحات جديدة متقنة تراكميًا",
    "why": "خطوة يناير العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q1-QURAN",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "7 صفحات جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-QURAN",
    "title": "14 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة فبراير العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q1-QURAN",
    "previousGoalId": "M01-QURAN",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "14 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-QURAN",
    "title": "20 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة مارس العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q1-QURAN",
    "previousGoalId": "M02-QURAN",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "20 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-QURAN",
    "title": "الوصول إلى 40 صفحة متقنة تراكميًا",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "quarterly",
    "parentId": "A-QURAN",
    "previousGoalId": "Q1-QURAN",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "الوصول إلى 40 صفحة متقنة تراكميًا",
    "milestones": [
      "مراجعة جميع المحفوظ من Q1",
      "اختبار مؤجل للصفحات الجديدة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-QURAN",
    "title": "27 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة أبريل العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q2-QURAN",
    "previousGoalId": "M03-QURAN",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "27 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-QURAN",
    "title": "34 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة مايو العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q2-QURAN",
    "previousGoalId": "M04-QURAN",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "34 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-QURAN",
    "title": "40 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة يونيو العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q2-QURAN",
    "previousGoalId": "M05-QURAN",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "40 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-QURAN",
    "title": "الوصول إلى 64 صفحة متقنة تراكميًا",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "quarterly",
    "parentId": "A-QURAN",
    "previousGoalId": "Q2-QURAN",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "الوصول إلى 64 صفحة متقنة تراكميًا",
    "milestones": [
      "تدارك مواطن الضعف في التسميع",
      "رفع إجمالي الصفحات المتقنة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-QURAN",
    "title": "48 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة يوليو العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q3-QURAN",
    "previousGoalId": "M06-QURAN",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "48 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-QURAN",
    "title": "56 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة أغسطس العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q3-QURAN",
    "previousGoalId": "M07-QURAN",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "56 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-QURAN",
    "title": "64 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة سبتمبر العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q3-QURAN",
    "previousGoalId": "M08-QURAN",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "64 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-QURAN",
    "title": "الوصول إلى 90 صفحة متقنة تراكميًا",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "quarterly",
    "parentId": "A-QURAN",
    "previousGoalId": "Q3-QURAN",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "الوصول إلى 90 صفحة متقنة تراكميًا",
    "milestones": [
      "الانتهاء من 4–5 أجزاء جديدة متقنة",
      "اختبار شامل ومراجعة سنة الحفظ"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-QURAN",
    "title": "72 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة أكتوبر العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q4-QURAN",
    "previousGoalId": "M09-QURAN",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "72 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-QURAN",
    "title": "80 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة نوفمبر العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q4-QURAN",
    "previousGoalId": "M10-QURAN",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "80 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-QURAN",
    "title": "90 صفحة جديدة متقنة تراكميًا",
    "why": "خطوة ديسمبر العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q4-QURAN",
    "previousGoalId": "M11-QURAN",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "التقرب إلى الله بالقرآن والعمل بما أتعلمه.",
    "successCriteria": "90 صفحة جديدة متقنة تراكميًا",
    "milestones": [],
    "actionTemplates": [
      "حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-FIQH",
    "title": "إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027",
    "why": "أريد تعلّم أحكام الدين عمليًا وتحسين الفرائض والأذكار والسنن والأخلاق دون تحويل الإخلاص إلى أرقام.",
    "lifeArea": "الدين والعبادات",
    "horizon": "annual",
    "parentId": "V-FAITH",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "100% من أبواب الطبعة المستخدمة بفهم واختبار بعد كل باب؛ انعكاس أسبوعي على خُلُق واحد، مع متابعة العبادات برفق.",
    "milestones": [],
    "actionTemplates": [
      "مذاكرة فقه دورية مع اختبار لكل باب",
      "الصلوات والأذكار والسنن وفق الاستطاعة",
      "مراجعة خلق أسبوعية وتطبيق عملي",
      "قريب من الإيقاع المعتاد حتى في أسابيع الامتحانات"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-FIQH",
    "title": "فهم واختبار أول 20% من أبواب الفقه الميسر",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "quarterly",
    "parentId": "A-FIQH",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "فهم واختبار أول 20% من أبواب الفقه الميسر",
    "milestones": [
      "توثيق فهرس نسخة الكتاب",
      "تسجيل نتيجة اختبار لكل باب منجز"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-FIQH",
    "title": "إنجاز نحو 7% من أبواب الطبعة",
    "why": "خطوة يناير العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q1-FIQH",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "إنجاز نحو 7% من أبواب الطبعة",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-FIQH",
    "title": "الوصول إلى 14% من الأبواب",
    "why": "خطوة فبراير العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q1-FIQH",
    "previousGoalId": "M01-FIQH",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 14% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-FIQH",
    "title": "الوصول إلى 20% من الأبواب",
    "why": "خطوة مارس العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q1-FIQH",
    "previousGoalId": "M02-FIQH",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 20% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-FIQH",
    "title": "الوصول إلى 45% من أبواب الفقه الميسر",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "quarterly",
    "parentId": "A-FIQH",
    "previousGoalId": "Q1-FIQH",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 45% من أبواب الفقه الميسر",
    "milestones": [
      "الربط بين الأحكام وحالات تطبيقية",
      "مراجعة أبواب Q1"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-FIQH",
    "title": "الوصول إلى 28% من الأبواب",
    "why": "خطوة أبريل العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q2-FIQH",
    "previousGoalId": "M03-FIQH",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 28% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-FIQH",
    "title": "الوصول إلى 36% من الأبواب",
    "why": "خطوة مايو العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q2-FIQH",
    "previousGoalId": "M04-FIQH",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 36% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-FIQH",
    "title": "الوصول إلى 45% من الأبواب",
    "why": "خطوة يونيو العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q2-FIQH",
    "previousGoalId": "M05-FIQH",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 45% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-FIQH",
    "title": "الوصول إلى 70% من أبواب الفقه الميسر",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "quarterly",
    "parentId": "A-FIQH",
    "previousGoalId": "Q2-FIQH",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 70% من أبواب الفقه الميسر",
    "milestones": [
      "الانتهاء من أبواب Q3 باختبار",
      "تطبيق محاسبة خلقية أسبوعية"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-FIQH",
    "title": "الوصول إلى 53% من الأبواب",
    "why": "خطوة يوليو العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q3-FIQH",
    "previousGoalId": "M06-FIQH",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 53% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-FIQH",
    "title": "الوصول إلى 62% من الأبواب",
    "why": "خطوة أغسطس العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q3-FIQH",
    "previousGoalId": "M07-FIQH",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 62% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-FIQH",
    "title": "الوصول إلى 70% من الأبواب",
    "why": "خطوة سبتمبر العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q3-FIQH",
    "previousGoalId": "M08-FIQH",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 70% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-FIQH",
    "title": "إتمام الأبواب 100% واختبار مراجعة نهائي",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "quarterly",
    "parentId": "A-FIQH",
    "previousGoalId": "Q3-FIQH",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "إتمام الأبواب 100% واختبار مراجعة نهائي",
    "milestones": [
      "إتمام الكتاب بفهم واختبارات",
      "خطة مراجعة الفقه لاحقًا"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-FIQH",
    "title": "الوصول إلى 80% من الأبواب",
    "why": "خطوة أكتوبر العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q4-FIQH",
    "previousGoalId": "M09-FIQH",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 80% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-FIQH",
    "title": "الوصول إلى 90% من الأبواب",
    "why": "خطوة نوفمبر العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q4-FIQH",
    "previousGoalId": "M10-FIQH",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "الوصول إلى 90% من الأبواب",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-FIQH",
    "title": "إتمام 100% من الأبواب واختبار نهائي",
    "why": "خطوة ديسمبر العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.",
    "lifeArea": "الدين والعبادات",
    "horizon": "monthly",
    "parentId": "Q4-FIQH",
    "previousGoalId": "M11-FIQH",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.",
    "successCriteria": "إتمام 100% من الأبواب واختبار نهائي",
    "milestones": [],
    "actionTemplates": [
      "دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-FAMILY",
    "title": "صلة الرحم وبر الوالدين بانتظام طوال 2027",
    "why": "النجاح في العمل والجامعة لا يعوض حقوق الوالدين والجدة والأهل؛ أريد حضورًا حقيقيًا وأخلاقًا أفضل معهم.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "annual",
    "parentId": "V-FAMILY",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "زيارة أسبوعية للجدة نحو 4 ساعات؛ 3–5 ساعات نوعية أسبوعيًا للوالدين والإخوة والأقارب، مع مبادرة خدمة أسبوعية.",
    "milestones": [],
    "actionTemplates": [
      "زيارة الجدة الجمعة بما يتوافق مع درس القرآن والتنقل",
      "وقت نوعي للأهل 3–5 ساعات أسبوعيًا",
      "مبادرة خدمة غير مطلوبة كل أسبوع",
      "مراجعة المعاملة والكلام لا مجرد الساعات"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-FAMILY",
    "title": "تأسيس برنامج صلة الرحم الثابت",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "quarterly",
    "parentId": "A-FAMILY",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "تأسيس برنامج صلة الرحم الثابت",
    "milestones": [
      "تثبيت الزيارة الأسبوعية",
      "تخصيص وقت أسبوعي للأهل"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في يناير",
    "why": "خطوة يناير العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q1-FAMILY",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في يناير",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في فبراير",
    "why": "خطوة فبراير العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q1-FAMILY",
    "previousGoalId": "M01-FAMILY",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في فبراير",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في مارس",
    "why": "خطوة مارس العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q1-FAMILY",
    "previousGoalId": "M02-FAMILY",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في مارس",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-FAMILY",
    "title": "الاستمرار دون تضييع حق الأسرة وقت الانشغال",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "quarterly",
    "parentId": "A-FAMILY",
    "previousGoalId": "Q1-FAMILY",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "الاستمرار دون تضييع حق الأسرة وقت الانشغال",
    "milestones": [
      "تدارك أي زيارات فائتة",
      "تحسين عادة سلوكية مع الأسرة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في أبريل",
    "why": "خطوة أبريل العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q2-FAMILY",
    "previousGoalId": "M03-FAMILY",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في أبريل",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في مايو",
    "why": "خطوة مايو العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q2-FAMILY",
    "previousGoalId": "M04-FAMILY",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في مايو",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في يونيو",
    "why": "خطوة يونيو العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q2-FAMILY",
    "previousGoalId": "M05-FAMILY",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في يونيو",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-FAMILY",
    "title": "المحافظة على التواصل أثناء الإجازة والتوسع",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "quarterly",
    "parentId": "A-FAMILY",
    "previousGoalId": "Q2-FAMILY",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على التواصل أثناء الإجازة والتوسع",
    "milestones": [
      "استمرار الزيارات وسط ضغط الإجازة",
      "مبادرة بر منتظمة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في يوليو",
    "why": "خطوة يوليو العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q3-FAMILY",
    "previousGoalId": "M06-FAMILY",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في يوليو",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في أغسطس",
    "why": "خطوة أغسطس العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q3-FAMILY",
    "previousGoalId": "M07-FAMILY",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في أغسطس",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في سبتمبر",
    "why": "خطوة سبتمبر العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q3-FAMILY",
    "previousGoalId": "M08-FAMILY",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في سبتمبر",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-FAMILY",
    "title": "تقييم استدامة الصلة وجودة المعاملة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "quarterly",
    "parentId": "A-FAMILY",
    "previousGoalId": "Q3-FAMILY",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "تقييم استدامة الصلة وجودة المعاملة",
    "milestones": [
      "تقييم العلاقات ومراجعة الأخطاء",
      "خطة استمرار في 2028"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في أكتوبر",
    "why": "خطوة أكتوبر العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q4-FAMILY",
    "previousGoalId": "M09-FAMILY",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في أكتوبر",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في نوفمبر",
    "why": "خطوة نوفمبر العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q4-FAMILY",
    "previousGoalId": "M10-FAMILY",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في نوفمبر",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-FAMILY",
    "title": "المحافظة على زيارات الجدة ووقت الأسرة في ديسمبر",
    "why": "خطوة ديسمبر العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q4-FAMILY",
    "previousGoalId": "M11-FAMILY",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "بر الوالدين وصلة الرحم والإحسان إلى الأهل.",
    "successCriteria": "المحافظة على زيارات الجدة ووقت الأسرة في ديسمبر",
    "milestones": [],
    "actionTemplates": [
      "زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-MARRIAGE",
    "title": "الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن",
    "why": "أريد زواجًا مستقرًا ومسؤولًا؛ ديسمبر 2027 موعد مأمول لكنه يُؤجل إذا لم يستقر الدخل أو تكتمل المتطلبات.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "annual",
    "parentId": "V-FAMILY",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "قائمة جاهزية: شقة مناسبة + تمويل مساهمة 200–300 ألف وفق الأسعار الفعلية + احتياطي بيت 45–60 ألف أو ما يعادل 3 أشهر فعلية + دخل مستقر يغطي النفقة والأقساط بهامش.",
    "milestones": [],
    "actionTemplates": [
      "مراجعة شهرية لتكاليف التجهيز والتمويل",
      "مراجعة أهلية أولية في سبتمبر",
      "قرار نهائي بعد تحقق الشروط وليس قبلها"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-MARRIAGE",
    "title": "توثيق احتياجات الزواج ومساهمة الأسرة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "quarterly",
    "parentId": "A-MARRIAGE",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "توثيق احتياجات الزواج ومساهمة الأسرة",
    "milestones": [
      "حصر التشطيب والأجهزة ومساهمة كل طرف",
      "فصل تكلفة التجهيز عن احتياطي الطوارئ"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-MARRIAGE",
    "title": "حصر احتياجات الزواج ومسؤوليات كل طرف",
    "why": "خطوة يناير العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q1-MARRIAGE",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "حصر احتياجات الزواج ومسؤوليات كل طرف",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-MARRIAGE",
    "title": "الحصول على نطاقات أسعار واقعية",
    "why": "خطوة فبراير العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q1-MARRIAGE",
    "previousGoalId": "M01-MARRIAGE",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "الحصول على نطاقات أسعار واقعية",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-MARRIAGE",
    "title": "تحضير قائمة جاهزية الشقة والفرش",
    "why": "خطوة مارس العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q1-MARRIAGE",
    "previousGoalId": "M02-MARRIAGE",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "تحضير قائمة جاهزية الشقة والفرش",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-MARRIAGE",
    "title": "تحديث الأسعار ومقارنة التمويل الواقعي",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "quarterly",
    "parentId": "A-MARRIAGE",
    "previousGoalId": "Q1-MARRIAGE",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "تحديث الأسعار ومقارنة التمويل الواقعي",
    "milestones": [
      "تحديث عروض الأسعار",
      "تحديد فجوة التمويل دون افتراض دخل مستقبلي"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-MARRIAGE",
    "title": "مراجعة تطور الدخل والادخار دون مبالغة",
    "why": "خطوة أبريل العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q2-MARRIAGE",
    "previousGoalId": "M03-MARRIAGE",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "مراجعة تطور الدخل والادخار دون مبالغة",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-MARRIAGE",
    "title": "تحديث تكلفة مساهمتي وتجهيزات البيت",
    "why": "خطوة مايو العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q2-MARRIAGE",
    "previousGoalId": "M04-MARRIAGE",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "تحديث تكلفة مساهمتي وتجهيزات البيت",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-MARRIAGE",
    "title": "تحديد فجوة التمويل منتصف العام",
    "why": "خطوة يونيو العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q2-MARRIAGE",
    "previousGoalId": "M05-MARRIAGE",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "تحديد فجوة التمويل منتصف العام",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-MARRIAGE",
    "title": "اختبار الجاهزية المبدئية واتخاذ قرار التوقيت",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "quarterly",
    "parentId": "A-MARRIAGE",
    "previousGoalId": "Q2-MARRIAGE",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "اختبار الجاهزية المبدئية واتخاذ قرار التوقيت",
    "milestones": [
      "فحص جاهزية الشقة والدخل والاحتياطي",
      "اتخاذ قرار مبدئي دون ضغط"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-MARRIAGE",
    "title": "متابعة جاهزية الشقة وأي التزامات أسرية",
    "why": "خطوة يوليو العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q3-MARRIAGE",
    "previousGoalId": "M06-MARRIAGE",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "متابعة جاهزية الشقة وأي التزامات أسرية",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-MARRIAGE",
    "title": "تحديث عروض الأسعار وإمكانية السداد",
    "why": "خطوة أغسطس العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q3-MARRIAGE",
    "previousGoalId": "M07-MARRIAGE",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "تحديث عروض الأسعار وإمكانية السداد",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-MARRIAGE",
    "title": "قرار مبدئي بشأن توقيت الزواج حسب الجاهزية",
    "why": "خطوة سبتمبر العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q3-MARRIAGE",
    "previousGoalId": "M08-MARRIAGE",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "قرار مبدئي بشأن توقيت الزواج حسب الجاهزية",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-MARRIAGE",
    "title": "إتمام الزواج فقط إن تحققت الشروط أو إعادة جدولة الموعد",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "quarterly",
    "parentId": "A-MARRIAGE",
    "previousGoalId": "Q3-MARRIAGE",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "إتمام الزواج فقط إن تحققت الشروط أو إعادة جدولة الموعد",
    "milestones": [
      "قرار موثق: تنفيذ مشروط أو تأجيل",
      "حفظ صندوق طوارئ البيت مستقلًا"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-MARRIAGE",
    "title": "مراجعة نهائية للدخل والاحتياطي قبل أي التزام",
    "why": "خطوة أكتوبر العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q4-MARRIAGE",
    "previousGoalId": "M09-MARRIAGE",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "مراجعة نهائية للدخل والاحتياطي قبل أي التزام",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-MARRIAGE",
    "title": "التحضير فقط إن اكتملت شروط الجاهزية، وإلا تعديل الموعد",
    "why": "خطوة نوفمبر العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q4-MARRIAGE",
    "previousGoalId": "M10-MARRIAGE",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "التحضير فقط إن اكتملت شروط الجاهزية، وإلا تعديل الموعد",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-MARRIAGE",
    "title": "الزواج إذا اكتملت الشروط أو توثيق خطة مؤجلة آمنة",
    "why": "خطوة ديسمبر العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.",
    "lifeArea": "الأسرة والزواج",
    "horizon": "monthly",
    "parentId": "Q4-MARRIAGE",
    "previousGoalId": "M11-MARRIAGE",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "العفاف وبناء أسرة على المودة وتحمل المسؤولية.",
    "successCriteria": "الزواج إذا اكتملت الشروط أو توثيق خطة مؤجلة آمنة",
    "milestones": [],
    "actionTemplates": [
      "تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-FINANCE",
    "title": "إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027",
    "why": "حاليًا لا يوجد دخل شخصي مكتسب مضمون؛ أريد فصل أرباح فلكون عن دخلي، وبناء سيولة حقيقية قبل أي جمعية أو زواج.",
    "lifeArea": "المال والادخار",
    "horizon": "annual",
    "parentId": "V-FINANCE",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "مراجعة حسابات فلكون والسيولة، ثم اختبار 3 توزيعات أرباح فعلية متتالية قبل الجمعية؛ قسط لا يتجاوز 25% من أقل فائض شخصي مع احتياطي 6 أقساط.",
    "milestones": [],
    "actionTemplates": [
      "تسجيل الدخل الشخصي والمصروفات الفعلية شهريًا",
      "مراجعة الربح والسيولة والالتزامات مع الشريك",
      "تخصيص المدخرات لصناديق منفصلة",
      "عدم احتساب التوزيعات قبل صرفها"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-FINANCE",
    "title": "إثبات سلامة الحسابات واختبار أهلية التوزيع",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "quarterly",
    "parentId": "A-FINANCE",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "إثبات سلامة الحسابات واختبار أهلية التوزيع",
    "milestones": [
      "فصل الربح المحاسبي عن السيولة النقدية",
      "مراجعة إمكانية التوزيع من يناير دون ضمان"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-FINANCE",
    "title": "اختبار أهلية أول توزيع من فلكون بعد مراجعة الحسابات",
    "why": "خطوة يناير العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q1-FINANCE",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "اختبار أهلية أول توزيع من فلكون بعد مراجعة الحسابات",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-FINANCE",
    "title": "توثيق صافي الدخل الشخصي الفعلي والتكاليف",
    "why": "خطوة فبراير العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q1-FINANCE",
    "previousGoalId": "M01-FINANCE",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "توثيق صافي الدخل الشخصي الفعلي والتكاليف",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-FINANCE",
    "title": "اختبار وجود 3 توزيعات متتالية إن بدأت في يناير",
    "why": "خطوة مارس العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q1-FINANCE",
    "previousGoalId": "M02-FINANCE",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "اختبار وجود 3 توزيعات متتالية إن بدأت في يناير",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-FINANCE",
    "title": "اختبار انتظام الدخل والجمعية إن توافرت شروطها",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "quarterly",
    "parentId": "A-FINANCE",
    "previousGoalId": "Q1-FINANCE",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "اختبار انتظام الدخل والجمعية إن توافرت شروطها",
    "milestones": [
      "توثيق 3 توزيعات فعلية إن حدثت",
      "رفض الجمعية إن لم يوجد احتياطي 6 أقساط"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-FINANCE",
    "title": "مراجعة أهلية الجمعية فقط إذا توفر دخل واحتياطي",
    "why": "خطوة أبريل العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q2-FINANCE",
    "previousGoalId": "M03-FINANCE",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "مراجعة أهلية الجمعية فقط إذا توفر دخل واحتياطي",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-FINANCE",
    "title": "تسجيل الفائض الشخصي وبناء ادخار حقيقي",
    "why": "خطوة مايو العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q2-FINANCE",
    "previousGoalId": "M04-FINANCE",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "تسجيل الفائض الشخصي وبناء ادخار حقيقي",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-FINANCE",
    "title": "إعادة قياس انتظام الدخل ومخاطر التزامات الجمعية",
    "why": "خطوة يونيو العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q2-FINANCE",
    "previousGoalId": "M05-FINANCE",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "إعادة قياس انتظام الدخل ومخاطر التزامات الجمعية",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-FINANCE",
    "title": "مراجعة توقيت الجمعية والادخار للزواج",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "quarterly",
    "parentId": "A-FINANCE",
    "previousGoalId": "Q2-FINANCE",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "مراجعة توقيت الجمعية والادخار للزواج",
    "milestones": [
      "فحص موثوقية الجمعية والتزامات ما بعد القبض",
      "تقييم موعد قبض سبتمبر/أكتوبر بشرط القدرة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-FINANCE",
    "title": "مراجعة الحد الآمن للقسط والاحتياطي",
    "why": "خطوة يوليو العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q3-FINANCE",
    "previousGoalId": "M06-FINANCE",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "مراجعة الحد الآمن للقسط والاحتياطي",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-FINANCE",
    "title": "اختبار توافر 6 أقساط محفوظة ومجموعة موثوقة",
    "why": "خطوة أغسطس العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q3-FINANCE",
    "previousGoalId": "M07-FINANCE",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "اختبار توافر 6 أقساط محفوظة ومجموعة موثوقة",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-FINANCE",
    "title": "قبض جمعية فقط إن كانت قائمة فعلًا ومستوفية للشروط",
    "why": "خطوة سبتمبر العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q3-FINANCE",
    "previousGoalId": "M08-FINANCE",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "قبض جمعية فقط إن كانت قائمة فعلًا ومستوفية للشروط",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-FINANCE",
    "title": "مراجعة الاستقرار المالي ووضع خطة 2028",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "quarterly",
    "parentId": "A-FINANCE",
    "previousGoalId": "Q3-FINANCE",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "مراجعة الاستقرار المالي ووضع خطة 2028",
    "milestones": [
      "حفظ احتياطي البيت مستقلًا",
      "توثيق دخل 2027 الفعلي وخطة 2028"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-FINANCE",
    "title": "قبض جمعية فقط إن كان موعدها آمنًا وتستمر الأقساط دون ضغط",
    "why": "خطوة أكتوبر العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q4-FINANCE",
    "previousGoalId": "M09-FINANCE",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "قبض جمعية فقط إن كان موعدها آمنًا وتستمر الأقساط دون ضغط",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-FINANCE",
    "title": "مراجعة التزامات ما بعد الزواج والاحتياطيات",
    "why": "خطوة نوفمبر العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q4-FINANCE",
    "previousGoalId": "M10-FINANCE",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "مراجعة التزامات ما بعد الزواج والاحتياطيات",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-FINANCE",
    "title": "إقفال دخل ومدخرات 2027 وبناء ميزانية 2028",
    "why": "خطوة ديسمبر العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.",
    "lifeArea": "المال والادخار",
    "horizon": "monthly",
    "parentId": "Q4-FINANCE",
    "previousGoalId": "M11-FINANCE",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.",
    "successCriteria": "إقفال دخل ومدخرات 2027 وبناء ميزانية 2028",
    "milestones": [],
    "actionTemplates": [
      "مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-UNI",
    "title": "رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027",
    "why": "أريد مستوى أكاديمي يؤهلني للبحث والدراسات العليا؛ 3.50 هدف أعلى، لكنه يتطلب أداءً فصليًا ممتازًا.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "annual",
    "parentId": "V-SCIENCE",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "هدف CGPA 3.30/5؛ طموح 3.50/5. الحساب يعتمد على 78 ساعة مكتملة و32 متوقعة؛ يحتاج معدل نحو 3.64 لتحقيق 3.30.",
    "milestones": [],
    "actionTemplates": [
      "7 ساعات مذاكرة ذاتية أسبوعيًا كبداية أثناء الدراسة",
      "15–20 ساعة أو أكثر حسب الحاجة في الامتحانات",
      "الاثنين يوم مذاكرة رئيسي والأربعاء بديل",
      "قياس الفهم والاختبارات لا ساعات الجلوس فقط"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-UNI",
    "title": "تأسيس روتين مذاكرة وتحديد فجوات المواد",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "quarterly",
    "parentId": "A-UNI",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "تأسيس روتين مذاكرة وتحديد فجوات المواد",
    "milestones": [
      "بدء مذاكرة منتظمة قبل تراكم المحاضرات",
      "قياس أداء المواد الصعبة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-UNI",
    "title": "تطبيق خطة مذاكرة تتكيف مع محاضرات واختبارات يناير",
    "why": "خطوة يناير العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q1-UNI",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "تطبيق خطة مذاكرة تتكيف مع محاضرات واختبارات يناير",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-UNI",
    "title": "مراجعة المقررات الصعبة ومنع تراكم فبراير",
    "why": "خطوة فبراير العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q1-UNI",
    "previousGoalId": "M01-UNI",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "مراجعة المقررات الصعبة ومنع تراكم فبراير",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-UNI",
    "title": "تقييم نتائج الاختبارات والتكليفات في مارس",
    "why": "خطوة مارس العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q1-UNI",
    "previousGoalId": "M02-UNI",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "تقييم نتائج الاختبارات والتكليفات في مارس",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-UNI",
    "title": "حماية نتائج الاختبارات ومعالجة التأخر",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "quarterly",
    "parentId": "A-UNI",
    "previousGoalId": "Q1-UNI",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "حماية نتائج الاختبارات ومعالجة التأخر",
    "milestones": [
      "زيادة ساعات الدراسة عند ضعف النتائج",
      "تسليم التكليفات في مواعيدها"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-UNI",
    "title": "تطبيق 7 ساعات أساسية وتعديلها بنتائج أبريل",
    "why": "خطوة أبريل العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q2-UNI",
    "previousGoalId": "M03-UNI",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "تطبيق 7 ساعات أساسية وتعديلها بنتائج أبريل",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-UNI",
    "title": "رفع المذاكرة إن اقتربت اختبارات مايو",
    "why": "خطوة مايو العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q2-UNI",
    "previousGoalId": "M04-UNI",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "رفع المذاكرة إن اقتربت اختبارات مايو",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-UNI",
    "title": "تفعيل وضع الامتحانات حسب التقويم الفعلي في يونيو",
    "why": "خطوة يونيو العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q2-UNI",
    "previousGoalId": "M05-UNI",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "تفعيل وضع الامتحانات حسب التقويم الفعلي في يونيو",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-UNI",
    "title": "استثمار الفترات المتاحة في تثبيت المهارات العلمية",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "quarterly",
    "parentId": "A-UNI",
    "previousGoalId": "Q2-UNI",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "استثمار الفترات المتاحة في تثبيت المهارات العلمية",
    "milestones": [
      "مراجعة نتائج الفصل وتصحيح الاستراتيجية",
      "تعلم مهارة علمية مرتبطة بالدراسة عند توافر وقت"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-UNI",
    "title": "تحليل نقاط الضعف واستخلاص دروس الفصل في يوليو",
    "why": "خطوة يوليو العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q3-UNI",
    "previousGoalId": "M06-UNI",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "تحليل نقاط الضعف واستخلاص دروس الفصل في يوليو",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-UNI",
    "title": "مراجعة علمية خفيفة عند عدم وجود دراسة منتظمة في أغسطس",
    "why": "خطوة أغسطس العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q3-UNI",
    "previousGoalId": "M07-UNI",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "مراجعة علمية خفيفة عند عدم وجود دراسة منتظمة في أغسطس",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-UNI",
    "title": "تحديث المقررات وبناء روتين بداية الفصل في سبتمبر",
    "why": "خطوة سبتمبر العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q3-UNI",
    "previousGoalId": "M08-UNI",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "تحديث المقررات وبناء روتين بداية الفصل في سبتمبر",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-UNI",
    "title": "إنهاء 2027 بأفضل معدل ممكن نحو 3.30",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "quarterly",
    "parentId": "A-UNI",
    "previousGoalId": "Q3-UNI",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "إنهاء 2027 بأفضل معدل ممكن نحو 3.30",
    "milestones": [
      "التحقق من التراكمي الفعلي",
      "خطة دراسية حسب نتائج الفصول"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-UNI",
    "title": "حماية وقت المذاكرة ونتائج أكتوبر",
    "why": "خطوة أكتوبر العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q4-UNI",
    "previousGoalId": "M09-UNI",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "حماية وقت المذاكرة ونتائج أكتوبر",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-UNI",
    "title": "مراجعة وتحضير امتحانات نوفمبر حسب التقويم",
    "why": "خطوة نوفمبر العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q4-UNI",
    "previousGoalId": "M10-UNI",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "مراجعة وتحضير امتحانات نوفمبر حسب التقويم",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-UNI",
    "title": "حساب المعدل الفعلي بنهاية السنة ووضع خطة التحسين",
    "why": "خطوة ديسمبر العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q4-UNI",
    "previousGoalId": "M11-UNI",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.",
    "successCriteria": "حساب المعدل الفعلي بنهاية السنة ووضع خطة التحسين",
    "milestones": [],
    "actionTemplates": [
      "شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-RESEARCH",
    "title": "مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027",
    "why": "أحتاج تجربة سؤال ومنهج وتجربة وتحليل ونقد علمي تمهد لمساري في النانو وأشباه الموصلات.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "annual",
    "parentId": "V-SCIENCE",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "مساهمة موثقة في مشروع مع نتائج أولية قابلة للتحليل ومخرج تقرير/بوستر؛ النشر العلمي هدف إضافي غير مضمون.",
    "milestones": [],
    "actionTemplates": [
      "4–9 ساعات أسبوعيًا حسب احتياج المشروع أثناء الدراسة",
      "7–10 ساعات في الإجازة",
      "إيقاف الأعمال الاختيارية وقت الامتحانات بعد التنسيق"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-RESEARCH",
    "title": "تحديد السؤال البحثي والمنهج مع Sciora",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "quarterly",
    "parentId": "A-RESEARCH",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "تحديد السؤال البحثي والمنهج مع Sciora",
    "milestones": [
      "سؤال بحثي محدد وقابل للاختبار",
      "مراجعة أدبيات مركزة وخطة أولية"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-RESEARCH",
    "title": "فهم نطاق المشروع وسؤال البحث",
    "why": "خطوة يناير العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q1-RESEARCH",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "فهم نطاق المشروع وسؤال البحث",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-RESEARCH",
    "title": "مراجعة أوراق أساسية وتوضيح الفجوة",
    "why": "خطوة فبراير العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q1-RESEARCH",
    "previousGoalId": "M01-RESEARCH",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "مراجعة أوراق أساسية وتوضيح الفجوة",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-RESEARCH",
    "title": "الاتفاق على منهج أو خطة تحليل قابلة للتنفيذ",
    "why": "خطوة مارس العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q1-RESEARCH",
    "previousGoalId": "M02-RESEARCH",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "الاتفاق على منهج أو خطة تحليل قابلة للتنفيذ",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-RESEARCH",
    "title": "تنفيذ تجارب أو تحليل بيانات أولية",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "quarterly",
    "parentId": "A-RESEARCH",
    "previousGoalId": "Q1-RESEARCH",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "تنفيذ تجارب أو تحليل بيانات أولية",
    "milestones": [
      "توثيق بروتوكول أو خطة تحليل",
      "نتائج أولية مع سجل أخطاء"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-RESEARCH",
    "title": "تنفيذ خطوة بحثية موثقة أو تهيئة تحليل",
    "why": "خطوة أبريل العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q2-RESEARCH",
    "previousGoalId": "M03-RESEARCH",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "تنفيذ خطوة بحثية موثقة أو تهيئة تحليل",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-RESEARCH",
    "title": "جمع أول دفعة بيانات أو اختبار منهج",
    "why": "خطوة مايو العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q2-RESEARCH",
    "previousGoalId": "M04-RESEARCH",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "جمع أول دفعة بيانات أو اختبار منهج",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-RESEARCH",
    "title": "تحليل النتائج الأولية وحدودها",
    "why": "خطوة يونيو العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q2-RESEARCH",
    "previousGoalId": "M05-RESEARCH",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "تحليل النتائج الأولية وحدودها",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-RESEARCH",
    "title": "تحليل النتائج وصياغة مخرج علمي أولي",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "quarterly",
    "parentId": "A-RESEARCH",
    "previousGoalId": "Q2-RESEARCH",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "تحليل النتائج وصياغة مخرج علمي أولي",
    "milestones": [
      "تحليل الرسومات والقيود العلمية",
      "مسودة تقرير أو بوستر"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-RESEARCH",
    "title": "استثمار الإجازة في تقدم تجريبي أو تحليلي",
    "why": "خطوة يوليو العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q3-RESEARCH",
    "previousGoalId": "M06-RESEARCH",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "استثمار الإجازة في تقدم تجريبي أو تحليلي",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-RESEARCH",
    "title": "استكمال البيانات وضبط الجودة",
    "why": "خطوة أغسطس العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q3-RESEARCH",
    "previousGoalId": "M07-RESEARCH",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "استكمال البيانات وضبط الجودة",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-RESEARCH",
    "title": "تجهيز مسودة نتائج علمية قابلة للنقد",
    "why": "خطوة سبتمبر العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q3-RESEARCH",
    "previousGoalId": "M08-RESEARCH",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "تجهيز مسودة نتائج علمية قابلة للنقد",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-RESEARCH",
    "title": "تسليم تقرير أو بوستر علمي قابل للمناقشة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "quarterly",
    "parentId": "A-RESEARCH",
    "previousGoalId": "Q3-RESEARCH",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "تسليم تقرير أو بوستر علمي قابل للمناقشة",
    "milestones": [
      "تقييم نقدي مع الفريق أو المشرف",
      "نسخة نهائية من التقرير أو البوستر"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-RESEARCH",
    "title": "صياغة تفسير وتحفظات النتائج",
    "why": "خطوة أكتوبر العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q4-RESEARCH",
    "previousGoalId": "M09-RESEARCH",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "صياغة تفسير وتحفظات النتائج",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-RESEARCH",
    "title": "مراجعة المسودة مع الفريق والمشرف",
    "why": "خطوة نوفمبر العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q4-RESEARCH",
    "previousGoalId": "M10-RESEARCH",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "مراجعة المسودة مع الفريق والمشرف",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-RESEARCH",
    "title": "إخراج تقرير أو بوستر بنتائج صادقة وحدود واضحة",
    "why": "خطوة ديسمبر العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.",
    "lifeArea": "الجامعة والبحث العلمي",
    "horizon": "monthly",
    "parentId": "Q4-RESEARCH",
    "previousGoalId": "M11-RESEARCH",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "طلب العلم النافع والأمانة العلمية والإضافة المعرفية.",
    "successCriteria": "إخراج تقرير أو بوستر بنتائج صادقة وحدود واضحة",
    "milestones": [],
    "actionTemplates": [
      "تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-FALCON",
    "title": "فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027",
    "why": "أريد بناء شركة عالية الجودة لا تعتمد على وجودي اليومي، مع 3000 طلب/شهر وربح 150–200 ألف كطموح غير مضمون.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "annual",
    "parentId": "V-FALCON",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "1500 طلب مؤكد شهريًا بنهاية ديسمبر كهدف أساسي طموح، 3000 stretch؛ الربح والسيولة ورضا العملاء وقدرة الفريق شروط مكملة.",
    "milestones": [],
    "actionTemplates": [
      "17–20 ساعة أسبوعيًا في الدراسة بعد التفويض",
      "8–12 ساعة في الامتحانات",
      "21–25 ساعة أسبوعيًا في الإجازة",
      "متابعة أسبوعية للطلبات الصافية والأخطاء والردود والسيولة"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-FALCON",
    "title": "بناء عمليات وقياس تدفقات الطلبات والربحية",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "quarterly",
    "parentId": "A-FALCON",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "بناء عمليات وقياس تدفقات الطلبات والربحية",
    "milestones": [
      "توحيد سجلات التشغيل والمال",
      "بدء قياس مصدر الطلب وتكلفته وجودته"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-FALCON",
    "title": "هدف استرشادي 400 طلب مؤكد في يناير مع قياس الربحية",
    "why": "خطوة يناير العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q1-FALCON",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 400 طلب مؤكد في يناير مع قياس الربحية",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-FALCON",
    "title": "هدف استرشادي 450 طلب مؤكد في فبراير وتحسين الردود",
    "why": "خطوة فبراير العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q1-FALCON",
    "previousGoalId": "M01-FALCON",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 450 طلب مؤكد في فبراير وتحسين الردود",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-FALCON",
    "title": "هدف استرشادي 550 طلب مؤكد في مارس وتوثيق العمليات",
    "why": "خطوة مارس العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q1-FALCON",
    "previousGoalId": "M02-FALCON",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 550 طلب مؤكد في مارس وتوثيق العمليات",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-FALCON",
    "title": "توسيع ما أثبت الجدوى واختبار التفويض",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "quarterly",
    "parentId": "A-FALCON",
    "previousGoalId": "Q1-FALCON",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "توسيع ما أثبت الجدوى واختبار التفويض",
    "milestones": [
      "تحسين معدل إتمام الطلبات والوقت",
      "اختبار الفريق وقت ضغط الامتحانات"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-FALCON",
    "title": "هدف استرشادي 650 طلب مؤكد في أبريل بتوسع منضبط",
    "why": "خطوة أبريل العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q2-FALCON",
    "previousGoalId": "M03-FALCON",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 650 طلب مؤكد في أبريل بتوسع منضبط",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-FALCON",
    "title": "هدف استرشادي 750 طلب مؤكد في مايو دون تراجع الجودة",
    "why": "خطوة مايو العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q2-FALCON",
    "previousGoalId": "M04-FALCON",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 750 طلب مؤكد في مايو دون تراجع الجودة",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-FALCON",
    "title": "هدف استرشادي 850 طلب مؤكد في يونيو مع اختبار التفويض",
    "why": "خطوة يونيو العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q2-FALCON",
    "previousGoalId": "M05-FALCON",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 850 طلب مؤكد في يونيو مع اختبار التفويض",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-FALCON",
    "title": "رفع السعة والجودة بالتوسع المنضبط",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "quarterly",
    "parentId": "A-FALCON",
    "previousGoalId": "Q2-FALCON",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "رفع السعة والجودة بالتوسع المنضبط",
    "milestones": [
      "اختبار طاقة الطباعة وبديل للمورد",
      "تكرار قنوات تسويق مربحة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-FALCON",
    "title": "هدف استرشادي 950 طلب مؤكد في يوليو وفحص سعة المورد",
    "why": "خطوة يوليو العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q3-FALCON",
    "previousGoalId": "M06-FALCON",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 950 طلب مؤكد في يوليو وفحص سعة المورد",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-FALCON",
    "title": "هدف استرشادي 1050 طلب مؤكد في أغسطس وتحسين تكلفة البيع",
    "why": "خطوة أغسطس العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q3-FALCON",
    "previousGoalId": "M07-FALCON",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 1050 طلب مؤكد في أغسطس وتحسين تكلفة البيع",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-FALCON",
    "title": "هدف استرشادي 1150 طلب مؤكد في سبتمبر واستقرار التسليم",
    "why": "خطوة سبتمبر العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q3-FALCON",
    "previousGoalId": "M08-FALCON",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 1150 طلب مؤكد في سبتمبر واستقرار التسليم",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-FALCON",
    "title": "استهداف 1500 طلب شهريًا مربحًا مع استقلال تشغيل",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "quarterly",
    "parentId": "A-FALCON",
    "previousGoalId": "Q3-FALCON",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "استهداف 1500 طلب شهريًا مربحًا مع استقلال تشغيل",
    "milestones": [
      "اختبار هدف ديسمبر وفق صافي الربح والجودة",
      "توثيق قدرة الفريق على تشغيل الروتين"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-FALCON",
    "title": "هدف استرشادي 1300 طلب مؤكد في أكتوبر بتحكم في التأخيرات",
    "why": "خطوة أكتوبر العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q4-FALCON",
    "previousGoalId": "M09-FALCON",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 1300 طلب مؤكد في أكتوبر بتحكم في التأخيرات",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-FALCON",
    "title": "هدف استرشادي 1400 طلب مؤكد في نوفمبر مع هامش سيولة",
    "why": "خطوة نوفمبر العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q4-FALCON",
    "previousGoalId": "M10-FALCON",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف استرشادي 1400 طلب مؤكد في نوفمبر مع هامش سيولة",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-FALCON",
    "title": "هدف 1500 طلب مؤكد مربح في ديسمبر؛ 3000 هدف طموح فقط",
    "why": "خطوة ديسمبر العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.",
    "lifeArea": "فلكون والأعمال",
    "horizon": "monthly",
    "parentId": "Q4-FALCON",
    "previousGoalId": "M11-FALCON",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.",
    "successCriteria": "هدف 1500 طلب مؤكد مربح في ديسمبر؛ 3000 هدف طموح فقط",
    "milestones": [],
    "actionTemplates": [
      "متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-AI",
    "title": "إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027",
    "why": "أريد تحويل تعلم AI إلى تطبيقات داخل فلكون ثم خدمة مدفوعة قابلة للبيع للشركات، ونشر خبرة نافعة للطلاب.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "annual",
    "parentId": "V-AI",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "مشروعان مدفوعان مكتملان لشركتين مختلفتين كحد نجاح؛ الهدف 3 والـstretch خمسة، دون ادعاء نتائج عميل.",
    "milestones": [],
    "actionTemplates": [
      "2–3 ساعات مستقلة أسبوعيًا أثناء الدراسة",
      "2–3 ساعات تطبيق AI داخل ساعات فلكون نفسها دون ازدواج",
      "7–10 ساعات أسبوعيًا أثناء الإجازة",
      "بوستان LinkedIn شهريًا عند توفر الوقت؛ لا عقود جديدة وقت الامتحانات"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-AI",
    "title": "تطبيق حالة AI حقيقية بفلكون والسعي لأول عميل",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "quarterly",
    "parentId": "A-AI",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "تطبيق حالة AI حقيقية بفلكون والسعي لأول عميل",
    "milestones": [
      "اختيار مشكلة قابلة للقياس داخل فلكون",
      "ملف عرض خدمة واضح واستهداف مارس لأول عميل"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-AI",
    "title": "اختيار مشكلة واحدة في فلكون لتطبيق AI",
    "why": "خطوة يناير العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q1-AI",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "اختيار مشكلة واحدة في فلكون لتطبيق AI",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-AI",
    "title": "قياس قبل/بعد وإنشاء نموذج أو أتمتة أولية",
    "why": "خطوة فبراير العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q1-AI",
    "previousGoalId": "M01-AI",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "قياس قبل/بعد وإنشاء نموذج أو أتمتة أولية",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-AI",
    "title": "عرض خدمة والسعي لأول اتفاق مدفوع في مارس",
    "why": "خطوة مارس العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q1-AI",
    "previousGoalId": "M02-AI",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "عرض خدمة والسعي لأول اتفاق مدفوع في مارس",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-AI",
    "title": "تسليم خدمة محددة وبناء دراسة حالة مدفوعة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "quarterly",
    "parentId": "A-AI",
    "previousGoalId": "Q1-AI",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "تسليم خدمة محددة وبناء دراسة حالة مدفوعة",
    "milestones": [
      "تسليم مشروعات محددة النطاق دون تضارب جامعي",
      "توثيق نتائج حقيقية قبل/بعد"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-AI",
    "title": "تسليم أو تحسين المشروع الأول حسب الاتفاق الفعلي",
    "why": "خطوة أبريل العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q2-AI",
    "previousGoalId": "M03-AI",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "تسليم أو تحسين المشروع الأول حسب الاتفاق الفعلي",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-AI",
    "title": "استهداف عميل ثانٍ بحل محدود النطاق",
    "why": "خطوة مايو العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q2-AI",
    "previousGoalId": "M04-AI",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "استهداف عميل ثانٍ بحل محدود النطاق",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-AI",
    "title": "توثيق فائدة العميل وتجنب ضغط الامتحانات",
    "why": "خطوة يونيو العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q2-AI",
    "previousGoalId": "M05-AI",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "توثيق فائدة العميل وتجنب ضغط الامتحانات",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-AI",
    "title": "تعميق المهارة وخدمة شركات أخرى ضمن السعة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "quarterly",
    "parentId": "A-AI",
    "previousGoalId": "Q2-AI",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "تعميق المهارة وخدمة شركات أخرى ضمن السعة",
    "milestones": [
      "تحسين التسعير والتسليم والتواصل",
      "إدارة عميل واحد أو عدد محدود وفق الوقت"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-AI",
    "title": "تطوير مهارة AI تطبيقية في الإجازة",
    "why": "خطوة يوليو العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q3-AI",
    "previousGoalId": "M06-AI",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "تطوير مهارة AI تطبيقية في الإجازة",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-AI",
    "title": "تحسين عرض الخدمة والملف التسويقي",
    "why": "خطوة أغسطس العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q3-AI",
    "previousGoalId": "M07-AI",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "تحسين عرض الخدمة والملف التسويقي",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-AI",
    "title": "السعي لمشروع مدفوع آخر ضمن السعة",
    "why": "خطوة سبتمبر العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q3-AI",
    "previousGoalId": "M08-AI",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "السعي لمشروع مدفوع آخر ضمن السعة",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-AI",
    "title": "الوصول إلى 2–3 شركات بمشروعات مدفوعة مكتملة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "quarterly",
    "parentId": "A-AI",
    "previousGoalId": "Q3-AI",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "الوصول إلى 2–3 شركات بمشروعات مدفوعة مكتملة",
    "milestones": [
      "إتمام مشروعين على الأقل لشركتين مختلفتين",
      "توثيق 2–3 دراسات حالة منضبطة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-AI",
    "title": "تنفيذ تعاقدات محدودة لا تؤثر على الجامعة",
    "why": "خطوة أكتوبر العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q4-AI",
    "previousGoalId": "M09-AI",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "تنفيذ تعاقدات محدودة لا تؤثر على الجامعة",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-AI",
    "title": "تصفية الالتزامات القائمة وتسليمها",
    "why": "خطوة نوفمبر العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q4-AI",
    "previousGoalId": "M10-AI",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "تصفية الالتزامات القائمة وتسليمها",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-AI",
    "title": "حصر المشاريع المدفوعة المكتملة ونشر دروس مستفادة",
    "why": "خطوة ديسمبر العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.",
    "lifeArea": "الذكاء الاصطناعي والأثر",
    "horizon": "monthly",
    "parentId": "Q4-AI",
    "previousGoalId": "M11-AI",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.",
    "successCriteria": "حصر المشاريع المدفوعة المكتملة ونشر دروس مستفادة",
    "milestones": [],
    "actionTemplates": [
      "تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-HEALTH",
    "title": "استعادة اللياقة والنوم الكافي بشكل مستدام في 2027",
    "why": "الصحة والنوم أساس القدرة على أداء الواجبات، والعودة للرياضة يجب ألا تزيد الإصابة.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "annual",
    "parentId": "V-HEALTH",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "7 ساعات نوم فعلية في اليوم؛ بعد السماح الطبي 3 حصص رياضية أسبوعيًا نحو 1.5 ساعة تشمل الانتقال، وحركة مناسبة 20 دقيقة يوميًا.",
    "milestones": [],
    "actionTemplates": [
      "لا رياضة مخالفة للتوجيه الطبي أثناء التعافي",
      "تدرج في العودة عند التصريح الطبي",
      "تقييم التعب والنوم وآلام الإصابة أسبوعيًا"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-HEALTH",
    "title": "تثبيت النوم والتعافي والعودة الطبية الآمنة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "quarterly",
    "parentId": "A-HEALTH",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "تثبيت النوم والتعافي والعودة الطبية الآمنة",
    "milestones": [
      "تطبيق تعليمات التعافي",
      "تحسين انتظام 7 ساعات نوم فعلية"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-HEALTH",
    "title": "مراجعة التصريح الطبي وتحسين النوم في يناير",
    "why": "خطوة يناير العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q1-HEALTH",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "مراجعة التصريح الطبي وتحسين النوم في يناير",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-HEALTH",
    "title": "زيادة الحركة تدريجيًا إذا سمحت الحالة في فبراير",
    "why": "خطوة فبراير العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q1-HEALTH",
    "previousGoalId": "M01-HEALTH",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "زيادة الحركة تدريجيًا إذا سمحت الحالة في فبراير",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-HEALTH",
    "title": "تثبيت روتين نشاط مناسب طبيًا في مارس",
    "why": "خطوة مارس العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q1-HEALTH",
    "previousGoalId": "M02-HEALTH",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "تثبيت روتين نشاط مناسب طبيًا في مارس",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-HEALTH",
    "title": "تطوير انتظام نشاط بدني مناسب للحالة",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "quarterly",
    "parentId": "A-HEALTH",
    "previousGoalId": "Q1-HEALTH",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "تطوير انتظام نشاط بدني مناسب للحالة",
    "milestones": [
      "الوصول التدريجي لحصص رياضية منتظمة بعد السماح",
      "مراقبة الألم والإجهاد"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-HEALTH",
    "title": "قياس ثبات النوم والنشاط في أبريل",
    "why": "خطوة أبريل العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q2-HEALTH",
    "previousGoalId": "M03-HEALTH",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "قياس ثبات النوم والنشاط في أبريل",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-HEALTH",
    "title": "الاقتراب من 3 حصص أسبوعية إذا سمحت الحالة في مايو",
    "why": "خطوة مايو العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q2-HEALTH",
    "previousGoalId": "M04-HEALTH",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "الاقتراب من 3 حصص أسبوعية إذا سمحت الحالة في مايو",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-HEALTH",
    "title": "الحفاظ على الرياضة دون الإضرار بالدراسة في يونيو",
    "why": "خطوة يونيو العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q2-HEALTH",
    "previousGoalId": "M05-HEALTH",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "الحفاظ على الرياضة دون الإضرار بالدراسة في يونيو",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-HEALTH",
    "title": "بناء عادات لياقة دون إفراط",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "quarterly",
    "parentId": "A-HEALTH",
    "previousGoalId": "Q2-HEALTH",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "بناء عادات لياقة دون إفراط",
    "milestones": [
      "الالتزام دون تحميل زائد",
      "الحفاظ على حركة يومية مناسبة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-HEALTH",
    "title": "الاستفادة من الإجازة لنشاط بدني منتظم في يوليو",
    "why": "خطوة يوليو العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q3-HEALTH",
    "previousGoalId": "M06-HEALTH",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "الاستفادة من الإجازة لنشاط بدني منتظم في يوليو",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-HEALTH",
    "title": "رفع الجودة البدنية تدريجيًا دون إصابة في أغسطس",
    "why": "خطوة أغسطس العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q3-HEALTH",
    "previousGoalId": "M07-HEALTH",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "رفع الجودة البدنية تدريجيًا دون إصابة في أغسطس",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-HEALTH",
    "title": "تكييف التمارين مع عودة الجامعة في سبتمبر",
    "why": "خطوة سبتمبر العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q3-HEALTH",
    "previousGoalId": "M08-HEALTH",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "تكييف التمارين مع عودة الجامعة في سبتمبر",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-HEALTH",
    "title": "المحافظة على نظام لياقة ونوم قابل للاستمرار",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "quarterly",
    "parentId": "A-HEALTH",
    "previousGoalId": "Q3-HEALTH",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "المحافظة على نظام لياقة ونوم قابل للاستمرار",
    "milestones": [
      "مراجعة التقدم واللياقة دون مبالغة",
      "خطة استمرار للعام التالي"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-HEALTH",
    "title": "حماية النوم في أكتوبر رغم ضغط فلكون",
    "why": "خطوة أكتوبر العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q4-HEALTH",
    "previousGoalId": "M09-HEALTH",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "حماية النوم في أكتوبر رغم ضغط فلكون",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-HEALTH",
    "title": "تقليل الحمل إذا ظهرت علامات إجهاد في نوفمبر",
    "why": "خطوة نوفمبر العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q4-HEALTH",
    "previousGoalId": "M10-HEALTH",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "تقليل الحمل إذا ظهرت علامات إجهاد في نوفمبر",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-HEALTH",
    "title": "تقييم اللياقة والنوم ووضع خطة 2028",
    "why": "خطوة ديسمبر العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.",
    "lifeArea": "الصحة واللياقة",
    "horizon": "monthly",
    "parentId": "Q4-HEALTH",
    "previousGoalId": "M11-HEALTH",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.",
    "successCriteria": "تقييم اللياقة والنوم ووضع خطة 2028",
    "milestones": [],
    "actionTemplates": [
      "تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "A-READ",
    "title": "قراءة صفحتين يوميًا على الأقل خلال 2027",
    "why": "خطوة صغيرة منتظمة نحو هدف قراءة 75 كتابًا بحلول 1 يناير 2030 وبناء معرفة نافعة في الدين والعلوم والبزنس.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "annual",
    "parentId": "V-READ",
    "previousGoalId": null,
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "730 صفحة في سنة من 365 يومًا إذا استمرت صفحتان كل يوم؛ عدد الكتب الفعلي يعتمد على طولها.",
    "milestones": [],
    "actionTemplates": [
      "صفحتان بعد العشاء أو بعد الشروق",
      "تسجيل الصفحات بدل افتراض أن الكتاب الواحد حجم ثابت",
      "ملخص قصير للفكرة التي تستحق التطبيق"
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q1-READ",
    "title": "حوالي 180 صفحة مقروءة بنهاية مارس",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "quarterly",
    "parentId": "A-READ",
    "previousGoalId": null,
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "حوالي 180 صفحة مقروءة بنهاية مارس",
    "milestones": [
      "اختيار كتاب أو كتب ذات أولوية",
      "تثبيت قراءة يومية سهلة"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M01-READ",
    "title": "62 صفحة تراكميًا بنهاية يناير",
    "why": "خطوة يناير العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q1-READ",
    "previousGoalId": null,
    "targetDate": "2027-01-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "62 صفحة تراكميًا بنهاية يناير",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M02-READ",
    "title": "118 صفحة تراكميًا بنهاية فبراير",
    "why": "خطوة فبراير العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q1-READ",
    "previousGoalId": "M01-READ",
    "targetDate": "2027-02-28",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "118 صفحة تراكميًا بنهاية فبراير",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M03-READ",
    "title": "180 صفحة تراكميًا بنهاية مارس",
    "why": "خطوة مارس العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q1-READ",
    "previousGoalId": "M02-READ",
    "targetDate": "2027-03-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "180 صفحة تراكميًا بنهاية مارس",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q2-READ",
    "title": "حوالي 362 صفحة بنهاية يونيو",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "quarterly",
    "parentId": "A-READ",
    "previousGoalId": "Q1-READ",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "حوالي 362 صفحة بنهاية يونيو",
    "milestones": [
      "تسجيل الصفحات المقروءة فعليًا",
      "تطبيق فكرة مما قُرئ"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M04-READ",
    "title": "240 صفحة تراكميًا بنهاية أبريل",
    "why": "خطوة أبريل العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q2-READ",
    "previousGoalId": "M03-READ",
    "targetDate": "2027-04-30",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "240 صفحة تراكميًا بنهاية أبريل",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M05-READ",
    "title": "302 صفحة تراكميًا بنهاية مايو",
    "why": "خطوة مايو العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q2-READ",
    "previousGoalId": "M04-READ",
    "targetDate": "2027-05-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "302 صفحة تراكميًا بنهاية مايو",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M06-READ",
    "title": "362 صفحة تراكميًا بنهاية يونيو",
    "why": "خطوة يونيو العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q2-READ",
    "previousGoalId": "M05-READ",
    "targetDate": "2027-06-30",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "362 صفحة تراكميًا بنهاية يونيو",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q3-READ",
    "title": "حوالي 546 صفحة بنهاية سبتمبر",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "quarterly",
    "parentId": "A-READ",
    "previousGoalId": "Q2-READ",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "حوالي 546 صفحة بنهاية سبتمبر",
    "milestones": [
      "الاستمرار في الإجازة",
      "تقييم الكتاب التالي بحسب فائدته"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M07-READ",
    "title": "424 صفحة تراكميًا بنهاية يوليو",
    "why": "خطوة يوليو العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q3-READ",
    "previousGoalId": "M06-READ",
    "targetDate": "2027-07-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "424 صفحة تراكميًا بنهاية يوليو",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M08-READ",
    "title": "486 صفحة تراكميًا بنهاية أغسطس",
    "why": "خطوة أغسطس العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q3-READ",
    "previousGoalId": "M07-READ",
    "targetDate": "2027-08-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "486 صفحة تراكميًا بنهاية أغسطس",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M09-READ",
    "title": "546 صفحة تراكميًا بنهاية سبتمبر",
    "why": "خطوة سبتمبر العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q3-READ",
    "previousGoalId": "M08-READ",
    "targetDate": "2027-09-30",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "546 صفحة تراكميًا بنهاية سبتمبر",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "Q4-READ",
    "title": "730 صفحة تقريبًا بنهاية ديسمبر",
    "why": "مرحلة ربع سنوية لتحقيق الهدف السنوي: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "quarterly",
    "parentId": "A-READ",
    "previousGoalId": "Q3-READ",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "730 صفحة تقريبًا بنهاية ديسمبر",
    "milestones": [
      "تسجيل حصيلة القراءة السنوية",
      "تحسين خطة الوصول لهدف 75 كتابًا"
    ],
    "actionTemplates": [],
    "existingGoalMatch": null
  },
  {
    "id": "M10-READ",
    "title": "608 صفحات تراكميًا بنهاية أكتوبر",
    "why": "خطوة أكتوبر العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q4-READ",
    "previousGoalId": "M09-READ",
    "targetDate": "2027-10-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "608 صفحات تراكميًا بنهاية أكتوبر",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M11-READ",
    "title": "668 صفحة تراكميًا بنهاية نوفمبر",
    "why": "خطوة نوفمبر العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q4-READ",
    "previousGoalId": "M10-READ",
    "targetDate": "2027-11-30",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "668 صفحة تراكميًا بنهاية نوفمبر",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  },
  {
    "id": "M12-READ",
    "title": "730 صفحة تراكميًا بنهاية ديسمبر",
    "why": "خطوة ديسمبر العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.",
    "lifeArea": "القراءة والتعلم",
    "horizon": "monthly",
    "parentId": "Q4-READ",
    "previousGoalId": "M11-READ",
    "targetDate": "2027-12-31",
    "blessedIntentionSuggestion": "اكتساب علم نافع والعمل به ونقله بأمانة.",
    "successCriteria": "730 صفحة تراكميًا بنهاية ديسمبر",
    "milestones": [],
    "actionTemplates": [
      "قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق."
    ],
    "existingGoalMatch": null
  }
];
