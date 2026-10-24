# خطة أحمد 2027 — الأهداف المعتمدة والمترابطة في LifeOS

> **الحالة: معتمدة من أحمد بتاريخ 2026-10-24 — جاهزة للاستيراد إلى LifeOS.**  
> **التوقيت:** `Africa/Cairo` · **سنة التنفيذ:** `2027` · **صيغة البيانات:** YAML داخل Markdown  
> **عدد السجلات:** 195 هدفًا: 8 رؤى، 11 سنويًا، 44 ربع سنوي، 132 شهريًا.

> **معنى الاعتماد:** الأهداف والهيكل والتواريخ المستهدفة معتمدة كخطة للعمل؛ لا يعني أن الأهداف تحققت، أو أن موعد الزواج أو الجمعية أو الأرباح مضمون، ولا ينشئ التزامًا ماليًا تلقائيًا.

## 1. طريقة الاستخدام مع Codex

1. انسخ الملف كاملًا إلى مستودع الموقع، مثل: `docs/ahmed-lifeos-2027-goals.md`.
2. أعطِ Codex الأمر الوارد في القسم التالي. الخطة مُعتمدة ولا تحتاج إعادة أخذ موافقة على محتواها، لكن التطبيق لا يتم إلا بتنفيذ الكود. **لا تفترض وجود زر لاستيراد الأهداف في الواجهة**؛ يتم الإدراج عبر كود المشروع أو سكربت Seed/Import متوافق مع بنيته الحقيقية.
3. الكتلة تحت عنوان **البيانات الأساسية** هي المصدر الوحيد لكل الأهداف. احتفظ بالمعرّفات `id` كما هي.
4. شغّل وضع **معاينة أولًا / dry-run** يعرض عدد الإضافات والتحديثات والروابط، ثم نفّذ الاستيراد بعد نجاح الفحوص والتأكد من عدم فقد البيانات. لا تعتبر الأهداف مُنجزة تلقائيًا.
5. في الصفحة المصورة من LifeOS، يوجد حقل **الهدف الاستراتيجي الجديد**؛ تُطابق مفاتيح السجل `title`, `why`, `life_area`, `horizon`, `parent_id`, `target_date`, `blessed_intention_suggestion` حقول النموذج المقابلة. أسماء الحقول الفعلية في قاعدة بيانات مشروعك قد تختلف، وعلى Codex مطابقتها من الكود، لا افتراضها.

## 2. تعليمات تنفيذ الخطة المعتمدة — جاهزة لنسخها إلى Codex

> اقرأ الملف `docs/ahmed-lifeos-2027-goals.md` كله ثم افحص موديلات قاعدة البيانات والـAPI ونموذج "إضافة هدف استراتيجي جديد" وصفحة "الأهداف" والفلاتر والـmilestones والمهام والنيات. استخرج كتلة YAML من قسم "البيانات الأساسية" وتحَقَّق من صحتها قبل الكتابة. أنشئ سكربت Seed/Import **idempotent** (تشغيله مرتين لا يكرر الأهداف). ابدأ بعمل نسخة احتياطية، وأظهر dry-run بالعدد والروابط والتكرارات. اربط كل هدف بأبيه باستخدام `parent_id`، وربط التسلسل الشهري/الربعي بـ`previous_goal_id` إن كانت البنية تدعم ذلك، وإلا احتفظ به في metadata. أدخل المستويات بالترتيب: رؤية، سنوي، ربع سنوي، شهري. استخدم المعرّفات المرجعية `id` لعمل mapping إلى الـIDs الحقيقية في قاعدة البيانات. أضف الـmilestones والمهام التكرارية فقط إذا كانت موديلات المشروع تسمح؛ لا تحوّل أوصاف المهام إلى إنجازات أو XP. أظهر مستوى "هدف شهري (شهر)" في القائمة والفلاتر وأزرار الإنشاء/العرض إن كان مخفيًا، ولو الباك إند لا يدعمه فأضف دعمًا وترحيلًا آمنًا واختبارات. في الموبايل أعرض **أهداف الشهر الحالي أولًا**، واجعل الأهداف الأخرى قابلة للتصفية حسب الشهر والمجال والأب، مع Breadcrumb يوضح `رؤية ← سنوي ← ربع سنوي ← شهري`. لا تحذف الستة أهداف الموجودة ولا تكررها. وبالذات هدف **"قراءة 75" بتاريخ 2030-01-01**: ابحث عنه واربط الأهداف الجديدة به بدل إنشاء نسخة ثانية، ولا تستبدل نصه الحالي بدون موافقة صريحة. لا تغيّر XP الحالي ولا تسجل تقدمًا وهميًا. النيات المكتوبة اقتراحات نصية؛ اربطها بمكتبة النيات الموجودة فقط إذا كانت مطابقة، ولا تُنشئ نية رسمية مكررة دون مراجعة. وفّق أسماء مجالات الحياة مع القيم الحقيقية في التطبيق. لا تنفذ اتفاق جمعية أو صرف أرباح أو أي إجراء مالي فعلي. اعرض نتائج الاختبارات ومعاينة شجرة الأهداف، ثم نفّذ الاستيراد المعتمد بعد نجاح الفحوص، دون طلب اعتماد للخطة من جديد؛ استأذن فقط قبل إجراء تغييرات تدميرية أو مالية أو تعديل أهداف موجودة على خلاف قواعد الحفظ.

## 3. الترتيب الهرمي المطلوب

```text
رؤية 3–5 سنوات (حتى 2031؛ باستثناء هدف القراءة الموجود حتى 2030-01-01)
└── هدف سنوي (ينتهي 2027-12-31)
    ├── هدف الربع الأول (2027-03-31)
    │   ├── هدف يناير (2027-01-31)
    │   ├── هدف فبراير (2027-02-28)
    │   └── هدف مارس (2027-03-31)
    ├── هدف الربع الثاني (2027-06-30)
    ├── هدف الربع الثالث (2027-09-30)
    └── هدف الربع الرابع (2027-12-31)
```

- `parent_id`: **رابط التبعية الهرمية الإلزامي**، وليس مجرد اسم متشابه.
- `previous_goal_id`: التسلسل الزمني مع هدف الشهر/الربع السابق داخل المسار نفسه، وليس أبًا إضافيًا.
- `target_date`: التاريخ المتوقع للانتهاء في الصيغة `YYYY-MM-DD`، يعرض للمستخدم بتنسيق مصري مناسب.
- `blessed_intention_suggestion`: نص نية مقترح؛ الربط الحقيقي بالمكتبة اختياري كما يظهر في الصورة.
- `milestones`: معالم ربع سنوية مرجعية **غير منجزة عند الاستيراد**.
- `action_templates`: خطوات مقترحة؛ لا يُنشأ تكرار يومي آلي يملأ جدول المستخدم حتى يُفعَّل نظام المهام نفسه.
- `success_criteria`: معيار التحقق من الهدف؛ لا يعني تحقق النتيجة.

## 4. قواعد لا يجوز للكود تجاهلها

1. **الاستيراد لا يساوي التنفيذ:** كل شيء مخطط، لا تقدم ولا XP ولا نجاح افتراضي.
2. **الموجود لا يُحذف:** لا تمس البيانات التجريبية أو المستخدم ولا الستة أهداف النشطة إلا وفق قرار صريح؛ لا تكرر "قراءة 75".
3. **أولوية الهاتف:** أنشئ تبويبًا ظاهرًا باسم **الأهداف الشهرية**؛ فلتر الشهر الحالي يعرض 11 هدفًا شهريًا فقط، مع إمكانية رؤية الأرباع والرؤى بالضغط، بدل عرض كل الـ195 سجلًا دفعة واحدة.
4. **التاريخ المتوقع ليس ضمانًا:** خصوصًا نمو مبيعات فلكون وعميل AI والزواج والجمعية والنشر البحثي والـGPA.
5. **الخطة معتمدة، والإنجاز لم يحدث بعد:** احتفظ بعلامة `APPROVED` على مستوى خطة 2027، مع إبقاء كل هدف بحالة `planned_not_completed` أو المقابل لها في التطبيق. يجوز وضع الهدف «نشط» للعمل عليه، لكن لا تضعه «منجزًا» ولا تمنح XP عند الاستيراد.
6. **مجالات الحياة المقترحة:** الدين والعبادات، الأسرة والزواج، الجامعة والبحث العلمي، فلكون والأعمال، المال والادخار، الذكاء الاصطناعي والأثر، الصحة واللياقة، القراءة والتعلم. إذا كانت القوائم الفعلية مختلفة، طابقها بأمان أو اطلب مراجعة mapping.
7. **لو خالف الهدف الأدنى واقع الشهر:** عدّل التوقع في المراجعة، ولا تسجل تاريخ انتهاء جديدًا على أنه إنجاز.

## 5. البيانات الأساسية (YAML — استخدمها كـSource of Truth)

```yaml
config:
  plan_id: ahmed-lifeos-2027-v1
  previous_plan_ids:
  - ahmed-lifeos-2027-discussion-draft-v1
  approved_by_user: true
  approved_on: '2026-10-24'
  ready_for_import: true
  plan_title: خطة أحمد 2027 — أهداف مترابطة لـ LifeOS
  status: APPROVED
  language: ar-EG
  timezone: Africa/Cairo
  year: 2027
  default_import_status: planned_not_completed
  award_xp_on_import: false
  hierarchy:
    vision_3_5_years: رؤية 3-5 سنوات
    annual: هدف سنوي (12 شهر)
    quarterly: هدف ربع سنوي (3 شهور)
    monthly: هدف شهري (شهر)
  life_area_labels_are_suggestions: true
  no_automatic_financial_commitments: true
  notes:
  - الخطة والأهداف الاستراتيجية معتمدة من صاحبها، لكن الإنجاز والتقدم لم يحدثا بمجرد الاستيراد
  - التواريخ المقترحة مواعيد متوقعة وليست وعودًا
  - الأهداف المشروطة لا تتحول إلى إنجاز عند مجرد بلوغ التاريخ
  - عدم اختلاق نتائج أو دفعات أو بيانات مالية
goals:
- id: V-FAITH
  title: القرآن والفقه وتزكية النفس حتى 2031
  why: أسعى لإتمام حفظ القرآن الكريم وفهمه خلال سنوات الرؤية، وأتعلم أحكام ديني وأزكي نفسي وأحسن أخلاقي.
  life_area: الدين والعبادات
  horizon: vision_3_5_years
  parent_id: null
  previous_goal_id: null
  target_date: '2031-12-31'
  blessed_intention_suggestion: ابتغاء مرضاة الله وتزكية النفس.
  success_criteria: رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.
  milestones: []
  action_templates: []
  existing_goal_match: null
- id: V-FAMILY
  title: أسرة مستقرة وبر الوالدين وصلة الرحم حتى 2031
  why: أكون سندًا لأهلي وأتجه نحو زواج مستقر يقوم على المسؤولية والرحمة.
  life_area: الأسرة والزواج
  horizon: vision_3_5_years
  parent_id: null
  previous_goal_id: null
  target_date: '2031-12-31'
  blessed_intention_suggestion: بر الوالدين وصلة الأرحام والإحسان إلى الأهل.
  success_criteria: رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.
  milestones: []
  action_templates: []
  existing_goal_match: null
- id: V-SCIENCE
  title: التخصص العميق في النانو وأشباه الموصلات حتى 2031
  why: أبني أساسًا فيزيائيًا وبحثيًا عميقًا وأساهم في فريق بحث وتطوير ونموذج أولي مرتبط بأشباه الموصلات في مصر بحلول
    2031.
  life_area: الجامعة والبحث العلمي
  horizon: vision_3_5_years
  parent_id: null
  previous_goal_id: null
  target_date: '2031-12-31'
  blessed_intention_suggestion: تعلم علم نافع وتسخيره لخدمة الناس.
  success_criteria: رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.
  milestones: []
  action_templates: []
  existing_goal_match: null
- id: V-FALCON
  title: بناء مشروعات قوية ومستقلة تشغيليًا حتى 2031
  why: أؤسس ثلاثة مشروعات مستقرة على الأقل بحلول 2031، تبدأ بفلكون وتتدرج نحو بشرى وقهوة العلماء عند توفر القدرة
    دون تشتيت مبكر.
  life_area: فلكون والأعمال
  horizon: vision_3_5_years
  parent_id: null
  previous_goal_id: null
  target_date: '2031-12-31'
  blessed_intention_suggestion: الكسب الحلال والإتقان والوفاء بحقوق العملاء والعاملين.
  success_criteria: رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.
  milestones: []
  action_templates: []
  existing_goal_match: null
- id: V-FINANCE
  title: استقلال مالي شخصي مستدام حتى 2031
  why: أبني دخلًا شخصيًا مستقرًا ومدخرات واستثمارات متدرجة، وأستهدف على المدى البعيد قوة شرائية لدخل شهري تعادل
    15 جرام ذهب على الأقل دون مخاطر غير محسوبة.
  life_area: المال والادخار
  horizon: vision_3_5_years
  parent_id: null
  previous_goal_id: null
  target_date: '2031-12-31'
  blessed_intention_suggestion: الاستغناء بالحلال والقدرة على تحمل المسؤوليات والإنفاق النافع.
  success_criteria: رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.
  milestones: []
  action_templates: []
  existing_goal_match: null
- id: V-AI
  title: خبرة عملية في حلول AI ونشر العلم حتى 2031
  why: أجمع بين الذكاء الاصطناعي والعلوم والعمل التجاري في حلول عملية ومحتوى نافع للطلاب.
  life_area: الذكاء الاصطناعي والأثر
  horizon: vision_3_5_years
  parent_id: null
  previous_goal_id: null
  target_date: '2031-12-31'
  blessed_intention_suggestion: نفع الناس بالعلم والخبرة والعمل المتقن.
  success_criteria: رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.
  milestones: []
  action_templates: []
  existing_goal_match: null
- id: V-HEALTH
  title: الصحة واللياقة المستدامة حتى 2031
  why: أحافظ على جسد قوي ونوم كافٍ ولياقة تساعدني على العبادة والدراسة والعمل بلا إنهاك مستمر.
  life_area: الصحة واللياقة
  horizon: vision_3_5_years
  parent_id: null
  previous_goal_id: null
  target_date: '2031-12-31'
  blessed_intention_suggestion: حفظ الصحة والقوة على أداء المسؤوليات.
  success_criteria: رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.
  milestones: []
  action_templates: []
  existing_goal_match: null
- id: V-READ
  title: قراءة 75
  why: لأنه هيخليني مثقف أكتر وعندي وعي وثقافة. عاوز أقرأ الكتب اللي تفيدني سواء في الدين أو العلم أو علم النفس
    والبزنس وكتابة المحتوى؛ وأبني ثروة معلوماتية وقدرة على الفهم والإقناع.
  life_area: القراءة والتعلم
  horizon: vision_3_5_years
  parent_id: null
  previous_goal_id: null
  target_date: '2030-01-01'
  blessed_intention_suggestion: طلب العلم النافع والعمل به ونشر ما يفيد.
  success_criteria: رؤية بعيدة المدى؛ تُقاس من نتائج الأهداف السنوية المتصلة.
  milestones: []
  action_templates: []
  existing_goal_match:
    title: قراءة 75
    target_date: '2030-01-01'
    preserve_existing_text: true
- id: A-QURAN
  title: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027
  why: أريد فهم القرآن وحفظه بثبات، مع مراجعة حقيقية وتَسميع يثبت الإتقان؛ الطموح 6–7 أجزاء إذا سمح الواقع.
  life_area: الدين والعبادات
  horizon: annual
  parent_id: V-FAITH
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 90 صفحة جديدة متقنة تقريبًا ≈ 4.5 أجزاء؛ لا تُحسب الصفحة دون تسميع ومراجعة مؤجلة.
  milestones: []
  action_templates:
  - 15 دقيقة كحد أدنى في اليوم المزدحم
  - 30–60 دقيقة في الأيام المتاحة
  - درس القرآن الجمعة بعد العصر
  - تسميع ومراجعة أسبوعية واختبار احتفاظ شهري
- id: Q1-QURAN
  title: تأسيس حفظ ومراجعة متقنين حتى 20 صفحة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: quarterly
  parent_id: A-QURAN
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: تأسيس حفظ ومراجعة متقنين حتى 20 صفحة
  milestones:
  - تثبيت وقت الحفظ والتسميع
  - إتمام اختبار استرجاع للصفحات الجديدة
  action_templates: []
- id: M01-QURAN
  title: 7 صفحات جديدة متقنة تراكميًا
  why: 'خطوة يناير العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q1-QURAN
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 7 صفحات جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: M02-QURAN
  title: 14 صفحة جديدة متقنة تراكميًا
  why: 'خطوة فبراير العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q1-QURAN
  previous_goal_id: M01-QURAN
  target_date: '2027-02-28'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 14 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: M03-QURAN
  title: 20 صفحة جديدة متقنة تراكميًا
  why: 'خطوة مارس العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q1-QURAN
  previous_goal_id: M02-QURAN
  target_date: '2027-03-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 20 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: Q2-QURAN
  title: الوصول إلى 40 صفحة متقنة تراكميًا
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: quarterly
  parent_id: A-QURAN
  previous_goal_id: Q1-QURAN
  target_date: '2027-06-30'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: الوصول إلى 40 صفحة متقنة تراكميًا
  milestones:
  - مراجعة جميع المحفوظ من Q1
  - اختبار مؤجل للصفحات الجديدة
  action_templates: []
- id: M04-QURAN
  title: 27 صفحة جديدة متقنة تراكميًا
  why: 'خطوة أبريل العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q2-QURAN
  previous_goal_id: M03-QURAN
  target_date: '2027-04-30'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 27 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: M05-QURAN
  title: 34 صفحة جديدة متقنة تراكميًا
  why: 'خطوة مايو العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q2-QURAN
  previous_goal_id: M04-QURAN
  target_date: '2027-05-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 34 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: M06-QURAN
  title: 40 صفحة جديدة متقنة تراكميًا
  why: 'خطوة يونيو العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q2-QURAN
  previous_goal_id: M05-QURAN
  target_date: '2027-06-30'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 40 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: Q3-QURAN
  title: الوصول إلى 64 صفحة متقنة تراكميًا
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: quarterly
  parent_id: A-QURAN
  previous_goal_id: Q2-QURAN
  target_date: '2027-09-30'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: الوصول إلى 64 صفحة متقنة تراكميًا
  milestones:
  - تدارك مواطن الضعف في التسميع
  - رفع إجمالي الصفحات المتقنة
  action_templates: []
- id: M07-QURAN
  title: 48 صفحة جديدة متقنة تراكميًا
  why: 'خطوة يوليو العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q3-QURAN
  previous_goal_id: M06-QURAN
  target_date: '2027-07-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 48 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: M08-QURAN
  title: 56 صفحة جديدة متقنة تراكميًا
  why: 'خطوة أغسطس العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q3-QURAN
  previous_goal_id: M07-QURAN
  target_date: '2027-08-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 56 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: M09-QURAN
  title: 64 صفحة جديدة متقنة تراكميًا
  why: 'خطوة سبتمبر العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q3-QURAN
  previous_goal_id: M08-QURAN
  target_date: '2027-09-30'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 64 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: Q4-QURAN
  title: الوصول إلى 90 صفحة متقنة تراكميًا
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: quarterly
  parent_id: A-QURAN
  previous_goal_id: Q3-QURAN
  target_date: '2027-12-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: الوصول إلى 90 صفحة متقنة تراكميًا
  milestones:
  - الانتهاء من 4–5 أجزاء جديدة متقنة
  - اختبار شامل ومراجعة سنة الحفظ
  action_templates: []
- id: M10-QURAN
  title: 72 صفحة جديدة متقنة تراكميًا
  why: 'خطوة أكتوبر العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q4-QURAN
  previous_goal_id: M09-QURAN
  target_date: '2027-10-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 72 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: M11-QURAN
  title: 80 صفحة جديدة متقنة تراكميًا
  why: 'خطوة نوفمبر العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q4-QURAN
  previous_goal_id: M10-QURAN
  target_date: '2027-11-30'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 80 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: M12-QURAN
  title: 90 صفحة جديدة متقنة تراكميًا
  why: 'خطوة ديسمبر العملية نحو الهدف: إتقان حفظ 4–5 أجزاء جديدة من القرآن خلال 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q4-QURAN
  previous_goal_id: M11-QURAN
  target_date: '2027-12-31'
  blessed_intention_suggestion: التقرب إلى الله بالقرآن والعمل بما أتعلمه.
  success_criteria: 90 صفحة جديدة متقنة تراكميًا
  milestones: []
  action_templates:
  - حفظ وتسميع ومراجعة للقدر المقرر، مع اختبار استرجاع متأخر.
- id: A-FIQH
  title: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027
  why: أريد تعلّم أحكام الدين عمليًا وتحسين الفرائض والأذكار والسنن والأخلاق دون تحويل الإخلاص إلى أرقام.
  life_area: الدين والعبادات
  horizon: annual
  parent_id: V-FAITH
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: 100% من أبواب الطبعة المستخدمة بفهم واختبار بعد كل باب؛ انعكاس أسبوعي على خُلُق واحد، مع متابعة
    العبادات برفق.
  milestones: []
  action_templates:
  - مذاكرة فقه دورية مع اختبار لكل باب
  - الصلوات والأذكار والسنن وفق الاستطاعة
  - مراجعة خلق أسبوعية وتطبيق عملي
  - قريب من الإيقاع المعتاد حتى في أسابيع الامتحانات
- id: Q1-FIQH
  title: فهم واختبار أول 20% من أبواب الفقه الميسر
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: quarterly
  parent_id: A-FIQH
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: فهم واختبار أول 20% من أبواب الفقه الميسر
  milestones:
  - توثيق فهرس نسخة الكتاب
  - تسجيل نتيجة اختبار لكل باب منجز
  action_templates: []
- id: M01-FIQH
  title: إنجاز نحو 7% من أبواب الطبعة
  why: 'خطوة يناير العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q1-FIQH
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: إنجاز نحو 7% من أبواب الطبعة
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: M02-FIQH
  title: الوصول إلى 14% من الأبواب
  why: 'خطوة فبراير العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q1-FIQH
  previous_goal_id: M01-FIQH
  target_date: '2027-02-28'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 14% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: M03-FIQH
  title: الوصول إلى 20% من الأبواب
  why: 'خطوة مارس العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q1-FIQH
  previous_goal_id: M02-FIQH
  target_date: '2027-03-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 20% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: Q2-FIQH
  title: الوصول إلى 45% من أبواب الفقه الميسر
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: quarterly
  parent_id: A-FIQH
  previous_goal_id: Q1-FIQH
  target_date: '2027-06-30'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 45% من أبواب الفقه الميسر
  milestones:
  - الربط بين الأحكام وحالات تطبيقية
  - مراجعة أبواب Q1
  action_templates: []
- id: M04-FIQH
  title: الوصول إلى 28% من الأبواب
  why: 'خطوة أبريل العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q2-FIQH
  previous_goal_id: M03-FIQH
  target_date: '2027-04-30'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 28% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: M05-FIQH
  title: الوصول إلى 36% من الأبواب
  why: 'خطوة مايو العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q2-FIQH
  previous_goal_id: M04-FIQH
  target_date: '2027-05-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 36% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: M06-FIQH
  title: الوصول إلى 45% من الأبواب
  why: 'خطوة يونيو العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q2-FIQH
  previous_goal_id: M05-FIQH
  target_date: '2027-06-30'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 45% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: Q3-FIQH
  title: الوصول إلى 70% من أبواب الفقه الميسر
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: quarterly
  parent_id: A-FIQH
  previous_goal_id: Q2-FIQH
  target_date: '2027-09-30'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 70% من أبواب الفقه الميسر
  milestones:
  - الانتهاء من أبواب Q3 باختبار
  - تطبيق محاسبة خلقية أسبوعية
  action_templates: []
- id: M07-FIQH
  title: الوصول إلى 53% من الأبواب
  why: 'خطوة يوليو العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q3-FIQH
  previous_goal_id: M06-FIQH
  target_date: '2027-07-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 53% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: M08-FIQH
  title: الوصول إلى 62% من الأبواب
  why: 'خطوة أغسطس العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q3-FIQH
  previous_goal_id: M07-FIQH
  target_date: '2027-08-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 62% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: M09-FIQH
  title: الوصول إلى 70% من الأبواب
  why: 'خطوة سبتمبر العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q3-FIQH
  previous_goal_id: M08-FIQH
  target_date: '2027-09-30'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 70% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: Q4-FIQH
  title: إتمام الأبواب 100% واختبار مراجعة نهائي
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: quarterly
  parent_id: A-FIQH
  previous_goal_id: Q3-FIQH
  target_date: '2027-12-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: إتمام الأبواب 100% واختبار مراجعة نهائي
  milestones:
  - إتمام الكتاب بفهم واختبارات
  - خطة مراجعة الفقه لاحقًا
  action_templates: []
- id: M10-FIQH
  title: الوصول إلى 80% من الأبواب
  why: 'خطوة أكتوبر العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q4-FIQH
  previous_goal_id: M09-FIQH
  target_date: '2027-10-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 80% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: M11-FIQH
  title: الوصول إلى 90% من الأبواب
  why: 'خطوة نوفمبر العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q4-FIQH
  previous_goal_id: M10-FIQH
  target_date: '2027-11-30'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: الوصول إلى 90% من الأبواب
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: M12-FIQH
  title: إتمام 100% من الأبواب واختبار نهائي
  why: 'خطوة ديسمبر العملية نحو الهدف: إتمام الفقه الميسر بفهم وتزكية وعادات عبادة ثابتة في 2027.'
  life_area: الدين والعبادات
  horizon: monthly
  parent_id: Q4-FIQH
  previous_goal_id: M11-FIQH
  target_date: '2027-12-31'
  blessed_intention_suggestion: طلب الفقه في الدين والعمل بالعلم وإصلاح الخُلُق.
  success_criteria: إتمام 100% من الأبواب واختبار نهائي
  milestones: []
  action_templates:
  - دراسة الأبواب المحددة في فهرس نسختي، واختبار فهم، ومراجعة خُلُق أسبوعيًا.
- id: A-FAMILY
  title: صلة الرحم وبر الوالدين بانتظام طوال 2027
  why: النجاح في العمل والجامعة لا يعوض حقوق الوالدين والجدة والأهل؛ أريد حضورًا حقيقيًا وأخلاقًا أفضل معهم.
  life_area: الأسرة والزواج
  horizon: annual
  parent_id: V-FAMILY
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: زيارة أسبوعية للجدة نحو 4 ساعات؛ 3–5 ساعات نوعية أسبوعيًا للوالدين والإخوة والأقارب، مع مبادرة
    خدمة أسبوعية.
  milestones: []
  action_templates:
  - زيارة الجدة الجمعة بما يتوافق مع درس القرآن والتنقل
  - وقت نوعي للأهل 3–5 ساعات أسبوعيًا
  - مبادرة خدمة غير مطلوبة كل أسبوع
  - مراجعة المعاملة والكلام لا مجرد الساعات
- id: Q1-FAMILY
  title: تأسيس برنامج صلة الرحم الثابت
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: quarterly
  parent_id: A-FAMILY
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: تأسيس برنامج صلة الرحم الثابت
  milestones:
  - تثبيت الزيارة الأسبوعية
  - تخصيص وقت أسبوعي للأهل
  action_templates: []
- id: M01-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في يناير
  why: 'خطوة يناير العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q1-FAMILY
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في يناير
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: M02-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في فبراير
  why: 'خطوة فبراير العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q1-FAMILY
  previous_goal_id: M01-FAMILY
  target_date: '2027-02-28'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في فبراير
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: M03-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في مارس
  why: 'خطوة مارس العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q1-FAMILY
  previous_goal_id: M02-FAMILY
  target_date: '2027-03-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في مارس
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: Q2-FAMILY
  title: الاستمرار دون تضييع حق الأسرة وقت الانشغال
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: quarterly
  parent_id: A-FAMILY
  previous_goal_id: Q1-FAMILY
  target_date: '2027-06-30'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: الاستمرار دون تضييع حق الأسرة وقت الانشغال
  milestones:
  - تدارك أي زيارات فائتة
  - تحسين عادة سلوكية مع الأسرة
  action_templates: []
- id: M04-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في أبريل
  why: 'خطوة أبريل العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q2-FAMILY
  previous_goal_id: M03-FAMILY
  target_date: '2027-04-30'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في أبريل
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: M05-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في مايو
  why: 'خطوة مايو العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q2-FAMILY
  previous_goal_id: M04-FAMILY
  target_date: '2027-05-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في مايو
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: M06-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في يونيو
  why: 'خطوة يونيو العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q2-FAMILY
  previous_goal_id: M05-FAMILY
  target_date: '2027-06-30'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في يونيو
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: Q3-FAMILY
  title: المحافظة على التواصل أثناء الإجازة والتوسع
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: quarterly
  parent_id: A-FAMILY
  previous_goal_id: Q2-FAMILY
  target_date: '2027-09-30'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على التواصل أثناء الإجازة والتوسع
  milestones:
  - استمرار الزيارات وسط ضغط الإجازة
  - مبادرة بر منتظمة
  action_templates: []
- id: M07-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في يوليو
  why: 'خطوة يوليو العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q3-FAMILY
  previous_goal_id: M06-FAMILY
  target_date: '2027-07-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في يوليو
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: M08-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في أغسطس
  why: 'خطوة أغسطس العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q3-FAMILY
  previous_goal_id: M07-FAMILY
  target_date: '2027-08-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في أغسطس
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: M09-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في سبتمبر
  why: 'خطوة سبتمبر العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q3-FAMILY
  previous_goal_id: M08-FAMILY
  target_date: '2027-09-30'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في سبتمبر
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: Q4-FAMILY
  title: تقييم استدامة الصلة وجودة المعاملة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: quarterly
  parent_id: A-FAMILY
  previous_goal_id: Q3-FAMILY
  target_date: '2027-12-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: تقييم استدامة الصلة وجودة المعاملة
  milestones:
  - تقييم العلاقات ومراجعة الأخطاء
  - خطة استمرار في 2028
  action_templates: []
- id: M10-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في أكتوبر
  why: 'خطوة أكتوبر العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q4-FAMILY
  previous_goal_id: M09-FAMILY
  target_date: '2027-10-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في أكتوبر
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: M11-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في نوفمبر
  why: 'خطوة نوفمبر العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q4-FAMILY
  previous_goal_id: M10-FAMILY
  target_date: '2027-11-30'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في نوفمبر
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: M12-FAMILY
  title: المحافظة على زيارات الجدة ووقت الأسرة في ديسمبر
  why: 'خطوة ديسمبر العملية نحو الهدف: صلة الرحم وبر الوالدين بانتظام طوال 2027.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q4-FAMILY
  previous_goal_id: M11-FAMILY
  target_date: '2027-12-31'
  blessed_intention_suggestion: بر الوالدين وصلة الرحم والإحسان إلى الأهل.
  success_criteria: المحافظة على زيارات الجدة ووقت الأسرة في ديسمبر
  milestones: []
  action_templates:
  - زيارة أسبوعية وتواصل بنية البر، ومساعدة واحدة على الأقل دون طلب، ومراجعة سلوك أسبوعية.
- id: A-MARRIAGE
  title: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن
  why: أريد زواجًا مستقرًا ومسؤولًا؛ ديسمبر 2027 موعد مأمول لكنه يُؤجل إذا لم يستقر الدخل أو تكتمل المتطلبات.
  life_area: الأسرة والزواج
  horizon: annual
  parent_id: V-FAMILY
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: 'قائمة جاهزية: شقة مناسبة + تمويل مساهمة 200–300 ألف وفق الأسعار الفعلية + احتياطي بيت 45–60
    ألف أو ما يعادل 3 أشهر فعلية + دخل مستقر يغطي النفقة والأقساط بهامش.'
  milestones: []
  action_templates:
  - مراجعة شهرية لتكاليف التجهيز والتمويل
  - مراجعة أهلية أولية في سبتمبر
  - قرار نهائي بعد تحقق الشروط وليس قبلها
- id: Q1-MARRIAGE
  title: توثيق احتياجات الزواج ومساهمة الأسرة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: quarterly
  parent_id: A-MARRIAGE
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: توثيق احتياجات الزواج ومساهمة الأسرة
  milestones:
  - حصر التشطيب والأجهزة ومساهمة كل طرف
  - فصل تكلفة التجهيز عن احتياطي الطوارئ
  action_templates: []
- id: M01-MARRIAGE
  title: حصر احتياجات الزواج ومسؤوليات كل طرف
  why: 'خطوة يناير العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q1-MARRIAGE
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: حصر احتياجات الزواج ومسؤوليات كل طرف
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: M02-MARRIAGE
  title: الحصول على نطاقات أسعار واقعية
  why: 'خطوة فبراير العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q1-MARRIAGE
  previous_goal_id: M01-MARRIAGE
  target_date: '2027-02-28'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: الحصول على نطاقات أسعار واقعية
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: M03-MARRIAGE
  title: تحضير قائمة جاهزية الشقة والفرش
  why: 'خطوة مارس العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q1-MARRIAGE
  previous_goal_id: M02-MARRIAGE
  target_date: '2027-03-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: تحضير قائمة جاهزية الشقة والفرش
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: Q2-MARRIAGE
  title: تحديث الأسعار ومقارنة التمويل الواقعي
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: quarterly
  parent_id: A-MARRIAGE
  previous_goal_id: Q1-MARRIAGE
  target_date: '2027-06-30'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: تحديث الأسعار ومقارنة التمويل الواقعي
  milestones:
  - تحديث عروض الأسعار
  - تحديد فجوة التمويل دون افتراض دخل مستقبلي
  action_templates: []
- id: M04-MARRIAGE
  title: مراجعة تطور الدخل والادخار دون مبالغة
  why: 'خطوة أبريل العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q2-MARRIAGE
  previous_goal_id: M03-MARRIAGE
  target_date: '2027-04-30'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: مراجعة تطور الدخل والادخار دون مبالغة
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: M05-MARRIAGE
  title: تحديث تكلفة مساهمتي وتجهيزات البيت
  why: 'خطوة مايو العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q2-MARRIAGE
  previous_goal_id: M04-MARRIAGE
  target_date: '2027-05-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: تحديث تكلفة مساهمتي وتجهيزات البيت
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: M06-MARRIAGE
  title: تحديد فجوة التمويل منتصف العام
  why: 'خطوة يونيو العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q2-MARRIAGE
  previous_goal_id: M05-MARRIAGE
  target_date: '2027-06-30'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: تحديد فجوة التمويل منتصف العام
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: Q3-MARRIAGE
  title: اختبار الجاهزية المبدئية واتخاذ قرار التوقيت
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: quarterly
  parent_id: A-MARRIAGE
  previous_goal_id: Q2-MARRIAGE
  target_date: '2027-09-30'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: اختبار الجاهزية المبدئية واتخاذ قرار التوقيت
  milestones:
  - فحص جاهزية الشقة والدخل والاحتياطي
  - اتخاذ قرار مبدئي دون ضغط
  action_templates: []
- id: M07-MARRIAGE
  title: متابعة جاهزية الشقة وأي التزامات أسرية
  why: 'خطوة يوليو العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q3-MARRIAGE
  previous_goal_id: M06-MARRIAGE
  target_date: '2027-07-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: متابعة جاهزية الشقة وأي التزامات أسرية
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: M08-MARRIAGE
  title: تحديث عروض الأسعار وإمكانية السداد
  why: 'خطوة أغسطس العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q3-MARRIAGE
  previous_goal_id: M07-MARRIAGE
  target_date: '2027-08-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: تحديث عروض الأسعار وإمكانية السداد
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: M09-MARRIAGE
  title: قرار مبدئي بشأن توقيت الزواج حسب الجاهزية
  why: 'خطوة سبتمبر العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q3-MARRIAGE
  previous_goal_id: M08-MARRIAGE
  target_date: '2027-09-30'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: قرار مبدئي بشأن توقيت الزواج حسب الجاهزية
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: Q4-MARRIAGE
  title: إتمام الزواج فقط إن تحققت الشروط أو إعادة جدولة الموعد
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: quarterly
  parent_id: A-MARRIAGE
  previous_goal_id: Q3-MARRIAGE
  target_date: '2027-12-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: إتمام الزواج فقط إن تحققت الشروط أو إعادة جدولة الموعد
  milestones:
  - 'قرار موثق: تنفيذ مشروط أو تأجيل'
  - حفظ صندوق طوارئ البيت مستقلًا
  action_templates: []
- id: M10-MARRIAGE
  title: مراجعة نهائية للدخل والاحتياطي قبل أي التزام
  why: 'خطوة أكتوبر العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q4-MARRIAGE
  previous_goal_id: M09-MARRIAGE
  target_date: '2027-10-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: مراجعة نهائية للدخل والاحتياطي قبل أي التزام
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: M11-MARRIAGE
  title: التحضير فقط إن اكتملت شروط الجاهزية، وإلا تعديل الموعد
  why: 'خطوة نوفمبر العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q4-MARRIAGE
  previous_goal_id: M10-MARRIAGE
  target_date: '2027-11-30'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: التحضير فقط إن اكتملت شروط الجاهزية، وإلا تعديل الموعد
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: M12-MARRIAGE
  title: الزواج إذا اكتملت الشروط أو توثيق خطة مؤجلة آمنة
  why: 'خطوة ديسمبر العملية نحو الهدف: الجاهزية للزواج بنهاية 2027 دون التزام بموعد غير آمن.'
  life_area: الأسرة والزواج
  horizon: monthly
  parent_id: Q4-MARRIAGE
  previous_goal_id: M11-MARRIAGE
  target_date: '2027-12-31'
  blessed_intention_suggestion: العفاف وبناء أسرة على المودة وتحمل المسؤولية.
  success_criteria: الزواج إذا اكتملت الشروط أو توثيق خطة مؤجلة آمنة
  milestones: []
  action_templates:
  - تحديث قائمة الجاهزية بأرقام مثبتة، وتجنب التعاقد أو الاقتراض اعتمادًا على دخل متوقع.
- id: A-FINANCE
  title: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027
  why: حاليًا لا يوجد دخل شخصي مكتسب مضمون؛ أريد فصل أرباح فلكون عن دخلي، وبناء سيولة حقيقية قبل أي جمعية أو زواج.
  life_area: المال والادخار
  horizon: annual
  parent_id: V-FINANCE
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: مراجعة حسابات فلكون والسيولة، ثم اختبار 3 توزيعات أرباح فعلية متتالية قبل الجمعية؛ قسط لا يتجاوز
    25% من أقل فائض شخصي مع احتياطي 6 أقساط.
  milestones: []
  action_templates:
  - تسجيل الدخل الشخصي والمصروفات الفعلية شهريًا
  - مراجعة الربح والسيولة والالتزامات مع الشريك
  - تخصيص المدخرات لصناديق منفصلة
  - عدم احتساب التوزيعات قبل صرفها
- id: Q1-FINANCE
  title: إثبات سلامة الحسابات واختبار أهلية التوزيع
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: quarterly
  parent_id: A-FINANCE
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: إثبات سلامة الحسابات واختبار أهلية التوزيع
  milestones:
  - فصل الربح المحاسبي عن السيولة النقدية
  - مراجعة إمكانية التوزيع من يناير دون ضمان
  action_templates: []
- id: M01-FINANCE
  title: اختبار أهلية أول توزيع من فلكون بعد مراجعة الحسابات
  why: 'خطوة يناير العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q1-FINANCE
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: اختبار أهلية أول توزيع من فلكون بعد مراجعة الحسابات
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: M02-FINANCE
  title: توثيق صافي الدخل الشخصي الفعلي والتكاليف
  why: 'خطوة فبراير العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q1-FINANCE
  previous_goal_id: M01-FINANCE
  target_date: '2027-02-28'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: توثيق صافي الدخل الشخصي الفعلي والتكاليف
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: M03-FINANCE
  title: اختبار وجود 3 توزيعات متتالية إن بدأت في يناير
  why: 'خطوة مارس العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q1-FINANCE
  previous_goal_id: M02-FINANCE
  target_date: '2027-03-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: اختبار وجود 3 توزيعات متتالية إن بدأت في يناير
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: Q2-FINANCE
  title: اختبار انتظام الدخل والجمعية إن توافرت شروطها
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: quarterly
  parent_id: A-FINANCE
  previous_goal_id: Q1-FINANCE
  target_date: '2027-06-30'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: اختبار انتظام الدخل والجمعية إن توافرت شروطها
  milestones:
  - توثيق 3 توزيعات فعلية إن حدثت
  - رفض الجمعية إن لم يوجد احتياطي 6 أقساط
  action_templates: []
- id: M04-FINANCE
  title: مراجعة أهلية الجمعية فقط إذا توفر دخل واحتياطي
  why: 'خطوة أبريل العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q2-FINANCE
  previous_goal_id: M03-FINANCE
  target_date: '2027-04-30'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: مراجعة أهلية الجمعية فقط إذا توفر دخل واحتياطي
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: M05-FINANCE
  title: تسجيل الفائض الشخصي وبناء ادخار حقيقي
  why: 'خطوة مايو العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q2-FINANCE
  previous_goal_id: M04-FINANCE
  target_date: '2027-05-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: تسجيل الفائض الشخصي وبناء ادخار حقيقي
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: M06-FINANCE
  title: إعادة قياس انتظام الدخل ومخاطر التزامات الجمعية
  why: 'خطوة يونيو العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q2-FINANCE
  previous_goal_id: M05-FINANCE
  target_date: '2027-06-30'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: إعادة قياس انتظام الدخل ومخاطر التزامات الجمعية
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: Q3-FINANCE
  title: مراجعة توقيت الجمعية والادخار للزواج
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: quarterly
  parent_id: A-FINANCE
  previous_goal_id: Q2-FINANCE
  target_date: '2027-09-30'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: مراجعة توقيت الجمعية والادخار للزواج
  milestones:
  - فحص موثوقية الجمعية والتزامات ما بعد القبض
  - تقييم موعد قبض سبتمبر/أكتوبر بشرط القدرة
  action_templates: []
- id: M07-FINANCE
  title: مراجعة الحد الآمن للقسط والاحتياطي
  why: 'خطوة يوليو العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q3-FINANCE
  previous_goal_id: M06-FINANCE
  target_date: '2027-07-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: مراجعة الحد الآمن للقسط والاحتياطي
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: M08-FINANCE
  title: اختبار توافر 6 أقساط محفوظة ومجموعة موثوقة
  why: 'خطوة أغسطس العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q3-FINANCE
  previous_goal_id: M07-FINANCE
  target_date: '2027-08-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: اختبار توافر 6 أقساط محفوظة ومجموعة موثوقة
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: M09-FINANCE
  title: قبض جمعية فقط إن كانت قائمة فعلًا ومستوفية للشروط
  why: 'خطوة سبتمبر العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q3-FINANCE
  previous_goal_id: M08-FINANCE
  target_date: '2027-09-30'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: قبض جمعية فقط إن كانت قائمة فعلًا ومستوفية للشروط
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: Q4-FINANCE
  title: مراجعة الاستقرار المالي ووضع خطة 2028
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: quarterly
  parent_id: A-FINANCE
  previous_goal_id: Q3-FINANCE
  target_date: '2027-12-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: مراجعة الاستقرار المالي ووضع خطة 2028
  milestones:
  - حفظ احتياطي البيت مستقلًا
  - توثيق دخل 2027 الفعلي وخطة 2028
  action_templates: []
- id: M10-FINANCE
  title: قبض جمعية فقط إن كان موعدها آمنًا وتستمر الأقساط دون ضغط
  why: 'خطوة أكتوبر العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q4-FINANCE
  previous_goal_id: M09-FINANCE
  target_date: '2027-10-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: قبض جمعية فقط إن كان موعدها آمنًا وتستمر الأقساط دون ضغط
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: M11-FINANCE
  title: مراجعة التزامات ما بعد الزواج والاحتياطيات
  why: 'خطوة نوفمبر العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q4-FINANCE
  previous_goal_id: M10-FINANCE
  target_date: '2027-11-30'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: مراجعة التزامات ما بعد الزواج والاحتياطيات
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: M12-FINANCE
  title: إقفال دخل ومدخرات 2027 وبناء ميزانية 2028
  why: 'خطوة ديسمبر العملية نحو الهدف: إطلاق دخل شخصي موثق ومدخرات آمنة خلال 2027.'
  life_area: المال والادخار
  horizon: monthly
  parent_id: Q4-FINANCE
  previous_goal_id: M11-FINANCE
  target_date: '2027-12-31'
  blessed_intention_suggestion: الاستقلال بالكسب الحلال وحفظ الحقوق وتجنب الالتزامات المرهقة.
  success_criteria: إقفال دخل ومدخرات 2027 وبناء ميزانية 2028
  milestones: []
  action_templates:
  - مطابقة حسابات الشركة ثم تسجيل التوزيعات الفعلية ومصروفاتي وفائضي؛ عدم سداد قسط قبل تحقق الشروط.
- id: A-UNI
  title: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027
  why: أريد مستوى أكاديمي يؤهلني للبحث والدراسات العليا؛ 3.50 هدف أعلى، لكنه يتطلب أداءً فصليًا ممتازًا.
  life_area: الجامعة والبحث العلمي
  horizon: annual
  parent_id: V-SCIENCE
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: هدف CGPA 3.30/5؛ طموح 3.50/5. الحساب يعتمد على 78 ساعة مكتملة و32 متوقعة؛ يحتاج معدل نحو 3.64
    لتحقيق 3.30.
  milestones: []
  action_templates:
  - 7 ساعات مذاكرة ذاتية أسبوعيًا كبداية أثناء الدراسة
  - 15–20 ساعة أو أكثر حسب الحاجة في الامتحانات
  - الاثنين يوم مذاكرة رئيسي والأربعاء بديل
  - قياس الفهم والاختبارات لا ساعات الجلوس فقط
- id: Q1-UNI
  title: تأسيس روتين مذاكرة وتحديد فجوات المواد
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: quarterly
  parent_id: A-UNI
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: تأسيس روتين مذاكرة وتحديد فجوات المواد
  milestones:
  - بدء مذاكرة منتظمة قبل تراكم المحاضرات
  - قياس أداء المواد الصعبة
  action_templates: []
- id: M01-UNI
  title: تطبيق خطة مذاكرة تتكيف مع محاضرات واختبارات يناير
  why: 'خطوة يناير العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q1-UNI
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: تطبيق خطة مذاكرة تتكيف مع محاضرات واختبارات يناير
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: M02-UNI
  title: مراجعة المقررات الصعبة ومنع تراكم فبراير
  why: 'خطوة فبراير العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q1-UNI
  previous_goal_id: M01-UNI
  target_date: '2027-02-28'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: مراجعة المقررات الصعبة ومنع تراكم فبراير
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: M03-UNI
  title: تقييم نتائج الاختبارات والتكليفات في مارس
  why: 'خطوة مارس العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q1-UNI
  previous_goal_id: M02-UNI
  target_date: '2027-03-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: تقييم نتائج الاختبارات والتكليفات في مارس
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: Q2-UNI
  title: حماية نتائج الاختبارات ومعالجة التأخر
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: quarterly
  parent_id: A-UNI
  previous_goal_id: Q1-UNI
  target_date: '2027-06-30'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: حماية نتائج الاختبارات ومعالجة التأخر
  milestones:
  - زيادة ساعات الدراسة عند ضعف النتائج
  - تسليم التكليفات في مواعيدها
  action_templates: []
- id: M04-UNI
  title: تطبيق 7 ساعات أساسية وتعديلها بنتائج أبريل
  why: 'خطوة أبريل العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q2-UNI
  previous_goal_id: M03-UNI
  target_date: '2027-04-30'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: تطبيق 7 ساعات أساسية وتعديلها بنتائج أبريل
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: M05-UNI
  title: رفع المذاكرة إن اقتربت اختبارات مايو
  why: 'خطوة مايو العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q2-UNI
  previous_goal_id: M04-UNI
  target_date: '2027-05-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: رفع المذاكرة إن اقتربت اختبارات مايو
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: M06-UNI
  title: تفعيل وضع الامتحانات حسب التقويم الفعلي في يونيو
  why: 'خطوة يونيو العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q2-UNI
  previous_goal_id: M05-UNI
  target_date: '2027-06-30'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: تفعيل وضع الامتحانات حسب التقويم الفعلي في يونيو
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: Q3-UNI
  title: استثمار الفترات المتاحة في تثبيت المهارات العلمية
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: quarterly
  parent_id: A-UNI
  previous_goal_id: Q2-UNI
  target_date: '2027-09-30'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: استثمار الفترات المتاحة في تثبيت المهارات العلمية
  milestones:
  - مراجعة نتائج الفصل وتصحيح الاستراتيجية
  - تعلم مهارة علمية مرتبطة بالدراسة عند توافر وقت
  action_templates: []
- id: M07-UNI
  title: تحليل نقاط الضعف واستخلاص دروس الفصل في يوليو
  why: 'خطوة يوليو العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q3-UNI
  previous_goal_id: M06-UNI
  target_date: '2027-07-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: تحليل نقاط الضعف واستخلاص دروس الفصل في يوليو
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: M08-UNI
  title: مراجعة علمية خفيفة عند عدم وجود دراسة منتظمة في أغسطس
  why: 'خطوة أغسطس العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q3-UNI
  previous_goal_id: M07-UNI
  target_date: '2027-08-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: مراجعة علمية خفيفة عند عدم وجود دراسة منتظمة في أغسطس
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: M09-UNI
  title: تحديث المقررات وبناء روتين بداية الفصل في سبتمبر
  why: 'خطوة سبتمبر العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q3-UNI
  previous_goal_id: M08-UNI
  target_date: '2027-09-30'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: تحديث المقررات وبناء روتين بداية الفصل في سبتمبر
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: Q4-UNI
  title: إنهاء 2027 بأفضل معدل ممكن نحو 3.30
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: quarterly
  parent_id: A-UNI
  previous_goal_id: Q3-UNI
  target_date: '2027-12-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: إنهاء 2027 بأفضل معدل ممكن نحو 3.30
  milestones:
  - التحقق من التراكمي الفعلي
  - خطة دراسية حسب نتائج الفصول
  action_templates: []
- id: M10-UNI
  title: حماية وقت المذاكرة ونتائج أكتوبر
  why: 'خطوة أكتوبر العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q4-UNI
  previous_goal_id: M09-UNI
  target_date: '2027-10-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: حماية وقت المذاكرة ونتائج أكتوبر
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: M11-UNI
  title: مراجعة وتحضير امتحانات نوفمبر حسب التقويم
  why: 'خطوة نوفمبر العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q4-UNI
  previous_goal_id: M10-UNI
  target_date: '2027-11-30'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: مراجعة وتحضير امتحانات نوفمبر حسب التقويم
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: M12-UNI
  title: حساب المعدل الفعلي بنهاية السنة ووضع خطة التحسين
  why: 'خطوة ديسمبر العملية نحو الهدف: رفع المعدل التراكمي إلى 3.30/5 بنهاية 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q4-UNI
  previous_goal_id: M11-UNI
  target_date: '2027-12-31'
  blessed_intention_suggestion: إتقان العلم النافع والاستعداد لخدمة المجتمع بالتخصص.
  success_criteria: حساب المعدل الفعلي بنهاية السنة ووضع خطة التحسين
  milestones: []
  action_templates:
  - شرح المفهوم، استرجاع دون النظر، حل مسائل، اختبار قصير، وتسجيل الأخطاء حسب جدول الدراسة الحقيقي.
- id: A-RESEARCH
  title: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027
  why: أحتاج تجربة سؤال ومنهج وتجربة وتحليل ونقد علمي تمهد لمساري في النانو وأشباه الموصلات.
  life_area: الجامعة والبحث العلمي
  horizon: annual
  parent_id: V-SCIENCE
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: مساهمة موثقة في مشروع مع نتائج أولية قابلة للتحليل ومخرج تقرير/بوستر؛ النشر العلمي هدف إضافي
    غير مضمون.
  milestones: []
  action_templates:
  - 4–9 ساعات أسبوعيًا حسب احتياج المشروع أثناء الدراسة
  - 7–10 ساعات في الإجازة
  - إيقاف الأعمال الاختيارية وقت الامتحانات بعد التنسيق
- id: Q1-RESEARCH
  title: تحديد السؤال البحثي والمنهج مع Sciora
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: quarterly
  parent_id: A-RESEARCH
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: تحديد السؤال البحثي والمنهج مع Sciora
  milestones:
  - سؤال بحثي محدد وقابل للاختبار
  - مراجعة أدبيات مركزة وخطة أولية
  action_templates: []
- id: M01-RESEARCH
  title: فهم نطاق المشروع وسؤال البحث
  why: 'خطوة يناير العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q1-RESEARCH
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: فهم نطاق المشروع وسؤال البحث
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: M02-RESEARCH
  title: مراجعة أوراق أساسية وتوضيح الفجوة
  why: 'خطوة فبراير العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q1-RESEARCH
  previous_goal_id: M01-RESEARCH
  target_date: '2027-02-28'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: مراجعة أوراق أساسية وتوضيح الفجوة
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: M03-RESEARCH
  title: الاتفاق على منهج أو خطة تحليل قابلة للتنفيذ
  why: 'خطوة مارس العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q1-RESEARCH
  previous_goal_id: M02-RESEARCH
  target_date: '2027-03-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: الاتفاق على منهج أو خطة تحليل قابلة للتنفيذ
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: Q2-RESEARCH
  title: تنفيذ تجارب أو تحليل بيانات أولية
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: quarterly
  parent_id: A-RESEARCH
  previous_goal_id: Q1-RESEARCH
  target_date: '2027-06-30'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: تنفيذ تجارب أو تحليل بيانات أولية
  milestones:
  - توثيق بروتوكول أو خطة تحليل
  - نتائج أولية مع سجل أخطاء
  action_templates: []
- id: M04-RESEARCH
  title: تنفيذ خطوة بحثية موثقة أو تهيئة تحليل
  why: 'خطوة أبريل العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q2-RESEARCH
  previous_goal_id: M03-RESEARCH
  target_date: '2027-04-30'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: تنفيذ خطوة بحثية موثقة أو تهيئة تحليل
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: M05-RESEARCH
  title: جمع أول دفعة بيانات أو اختبار منهج
  why: 'خطوة مايو العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q2-RESEARCH
  previous_goal_id: M04-RESEARCH
  target_date: '2027-05-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: جمع أول دفعة بيانات أو اختبار منهج
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: M06-RESEARCH
  title: تحليل النتائج الأولية وحدودها
  why: 'خطوة يونيو العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q2-RESEARCH
  previous_goal_id: M05-RESEARCH
  target_date: '2027-06-30'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: تحليل النتائج الأولية وحدودها
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: Q3-RESEARCH
  title: تحليل النتائج وصياغة مخرج علمي أولي
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: quarterly
  parent_id: A-RESEARCH
  previous_goal_id: Q2-RESEARCH
  target_date: '2027-09-30'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: تحليل النتائج وصياغة مخرج علمي أولي
  milestones:
  - تحليل الرسومات والقيود العلمية
  - مسودة تقرير أو بوستر
  action_templates: []
- id: M07-RESEARCH
  title: استثمار الإجازة في تقدم تجريبي أو تحليلي
  why: 'خطوة يوليو العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q3-RESEARCH
  previous_goal_id: M06-RESEARCH
  target_date: '2027-07-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: استثمار الإجازة في تقدم تجريبي أو تحليلي
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: M08-RESEARCH
  title: استكمال البيانات وضبط الجودة
  why: 'خطوة أغسطس العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q3-RESEARCH
  previous_goal_id: M07-RESEARCH
  target_date: '2027-08-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: استكمال البيانات وضبط الجودة
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: M09-RESEARCH
  title: تجهيز مسودة نتائج علمية قابلة للنقد
  why: 'خطوة سبتمبر العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q3-RESEARCH
  previous_goal_id: M08-RESEARCH
  target_date: '2027-09-30'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: تجهيز مسودة نتائج علمية قابلة للنقد
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: Q4-RESEARCH
  title: تسليم تقرير أو بوستر علمي قابل للمناقشة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: quarterly
  parent_id: A-RESEARCH
  previous_goal_id: Q3-RESEARCH
  target_date: '2027-12-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: تسليم تقرير أو بوستر علمي قابل للمناقشة
  milestones:
  - تقييم نقدي مع الفريق أو المشرف
  - نسخة نهائية من التقرير أو البوستر
  action_templates: []
- id: M10-RESEARCH
  title: صياغة تفسير وتحفظات النتائج
  why: 'خطوة أكتوبر العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q4-RESEARCH
  previous_goal_id: M09-RESEARCH
  target_date: '2027-10-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: صياغة تفسير وتحفظات النتائج
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: M11-RESEARCH
  title: مراجعة المسودة مع الفريق والمشرف
  why: 'خطوة نوفمبر العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q4-RESEARCH
  previous_goal_id: M10-RESEARCH
  target_date: '2027-11-30'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: مراجعة المسودة مع الفريق والمشرف
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: M12-RESEARCH
  title: إخراج تقرير أو بوستر بنتائج صادقة وحدود واضحة
  why: 'خطوة ديسمبر العملية نحو الهدف: مساهمة بحثية حقيقية في Sciora بنتائج وتقرير أو بوستر في 2027.'
  life_area: الجامعة والبحث العلمي
  horizon: monthly
  parent_id: Q4-RESEARCH
  previous_goal_id: M11-RESEARCH
  target_date: '2027-12-31'
  blessed_intention_suggestion: طلب العلم النافع والأمانة العلمية والإضافة المعرفية.
  success_criteria: إخراج تقرير أو بوستر بنتائج صادقة وحدود واضحة
  milestones: []
  action_templates:
  - تقدم بحثي قابل للتحقق من دفتر المعمل أو ملفات التحليل؛ لا تخترع نتائج أو تنشر دون مراجعة.
- id: A-FALCON
  title: 'فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027'
  why: أريد بناء شركة عالية الجودة لا تعتمد على وجودي اليومي، مع 3000 طلب/شهر وربح 150–200 ألف كطموح غير مضمون.
  life_area: فلكون والأعمال
  horizon: annual
  parent_id: V-FALCON
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: 1500 طلب مؤكد شهريًا بنهاية ديسمبر كهدف أساسي طموح، 3000 stretch؛ الربح والسيولة ورضا العملاء
    وقدرة الفريق شروط مكملة.
  milestones: []
  action_templates:
  - 17–20 ساعة أسبوعيًا في الدراسة بعد التفويض
  - 8–12 ساعة في الامتحانات
  - 21–25 ساعة أسبوعيًا في الإجازة
  - متابعة أسبوعية للطلبات الصافية والأخطاء والردود والسيولة
- id: Q1-FALCON
  title: بناء عمليات وقياس تدفقات الطلبات والربحية
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: quarterly
  parent_id: A-FALCON
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: بناء عمليات وقياس تدفقات الطلبات والربحية
  milestones:
  - توحيد سجلات التشغيل والمال
  - بدء قياس مصدر الطلب وتكلفته وجودته
  action_templates: []
- id: M01-FALCON
  title: هدف استرشادي 400 طلب مؤكد في يناير مع قياس الربحية
  why: 'خطوة يناير العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q1-FALCON
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 400 طلب مؤكد في يناير مع قياس الربحية
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: M02-FALCON
  title: هدف استرشادي 450 طلب مؤكد في فبراير وتحسين الردود
  why: 'خطوة فبراير العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q1-FALCON
  previous_goal_id: M01-FALCON
  target_date: '2027-02-28'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 450 طلب مؤكد في فبراير وتحسين الردود
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: M03-FALCON
  title: هدف استرشادي 550 طلب مؤكد في مارس وتوثيق العمليات
  why: 'خطوة مارس العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q1-FALCON
  previous_goal_id: M02-FALCON
  target_date: '2027-03-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 550 طلب مؤكد في مارس وتوثيق العمليات
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: Q2-FALCON
  title: توسيع ما أثبت الجدوى واختبار التفويض
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: quarterly
  parent_id: A-FALCON
  previous_goal_id: Q1-FALCON
  target_date: '2027-06-30'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: توسيع ما أثبت الجدوى واختبار التفويض
  milestones:
  - تحسين معدل إتمام الطلبات والوقت
  - اختبار الفريق وقت ضغط الامتحانات
  action_templates: []
- id: M04-FALCON
  title: هدف استرشادي 650 طلب مؤكد في أبريل بتوسع منضبط
  why: 'خطوة أبريل العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q2-FALCON
  previous_goal_id: M03-FALCON
  target_date: '2027-04-30'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 650 طلب مؤكد في أبريل بتوسع منضبط
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: M05-FALCON
  title: هدف استرشادي 750 طلب مؤكد في مايو دون تراجع الجودة
  why: 'خطوة مايو العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q2-FALCON
  previous_goal_id: M04-FALCON
  target_date: '2027-05-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 750 طلب مؤكد في مايو دون تراجع الجودة
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: M06-FALCON
  title: هدف استرشادي 850 طلب مؤكد في يونيو مع اختبار التفويض
  why: 'خطوة يونيو العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q2-FALCON
  previous_goal_id: M05-FALCON
  target_date: '2027-06-30'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 850 طلب مؤكد في يونيو مع اختبار التفويض
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: Q3-FALCON
  title: رفع السعة والجودة بالتوسع المنضبط
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: quarterly
  parent_id: A-FALCON
  previous_goal_id: Q2-FALCON
  target_date: '2027-09-30'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: رفع السعة والجودة بالتوسع المنضبط
  milestones:
  - اختبار طاقة الطباعة وبديل للمورد
  - تكرار قنوات تسويق مربحة
  action_templates: []
- id: M07-FALCON
  title: هدف استرشادي 950 طلب مؤكد في يوليو وفحص سعة المورد
  why: 'خطوة يوليو العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q3-FALCON
  previous_goal_id: M06-FALCON
  target_date: '2027-07-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 950 طلب مؤكد في يوليو وفحص سعة المورد
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: M08-FALCON
  title: هدف استرشادي 1050 طلب مؤكد في أغسطس وتحسين تكلفة البيع
  why: 'خطوة أغسطس العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q3-FALCON
  previous_goal_id: M07-FALCON
  target_date: '2027-08-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 1050 طلب مؤكد في أغسطس وتحسين تكلفة البيع
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: M09-FALCON
  title: هدف استرشادي 1150 طلب مؤكد في سبتمبر واستقرار التسليم
  why: 'خطوة سبتمبر العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q3-FALCON
  previous_goal_id: M08-FALCON
  target_date: '2027-09-30'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 1150 طلب مؤكد في سبتمبر واستقرار التسليم
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: Q4-FALCON
  title: استهداف 1500 طلب شهريًا مربحًا مع استقلال تشغيل
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: quarterly
  parent_id: A-FALCON
  previous_goal_id: Q3-FALCON
  target_date: '2027-12-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: استهداف 1500 طلب شهريًا مربحًا مع استقلال تشغيل
  milestones:
  - اختبار هدف ديسمبر وفق صافي الربح والجودة
  - توثيق قدرة الفريق على تشغيل الروتين
  action_templates: []
- id: M10-FALCON
  title: هدف استرشادي 1300 طلب مؤكد في أكتوبر بتحكم في التأخيرات
  why: 'خطوة أكتوبر العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q4-FALCON
  previous_goal_id: M09-FALCON
  target_date: '2027-10-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 1300 طلب مؤكد في أكتوبر بتحكم في التأخيرات
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: M11-FALCON
  title: هدف استرشادي 1400 طلب مؤكد في نوفمبر مع هامش سيولة
  why: 'خطوة نوفمبر العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q4-FALCON
  previous_goal_id: M10-FALCON
  target_date: '2027-11-30'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف استرشادي 1400 طلب مؤكد في نوفمبر مع هامش سيولة
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: M12-FALCON
  title: هدف 1500 طلب مؤكد مربح في ديسمبر؛ 3000 هدف طموح فقط
  why: 'خطوة ديسمبر العملية نحو الهدف: فلكون: 1500 طلب شهريًا مربحًا واستقلال تشغيلي بنهاية 2027.'
  life_area: فلكون والأعمال
  horizon: monthly
  parent_id: Q4-FALCON
  previous_goal_id: M11-FALCON
  target_date: '2027-12-31'
  blessed_intention_suggestion: رزق حلال وخدمة العملاء بإتقان والوفاء بحقوق فريق العمل.
  success_criteria: هدف 1500 طلب مؤكد مربح في ديسمبر؛ 3000 هدف طموح فقط
  milestones: []
  action_templates:
  - متابعة الطلبات المؤكدة والربح والمرتجعات وسرعة الرد والتأخير وتفويض الروتين؛ أوقف التوسع إذا تعطلت الجودة.
- id: A-AI
  title: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027
  why: أريد تحويل تعلم AI إلى تطبيقات داخل فلكون ثم خدمة مدفوعة قابلة للبيع للشركات، ونشر خبرة نافعة للطلاب.
  life_area: الذكاء الاصطناعي والأثر
  horizon: annual
  parent_id: V-AI
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: مشروعان مدفوعان مكتملان لشركتين مختلفتين كحد نجاح؛ الهدف 3 والـstretch خمسة، دون ادعاء نتائج
    عميل.
  milestones: []
  action_templates:
  - 2–3 ساعات مستقلة أسبوعيًا أثناء الدراسة
  - 2–3 ساعات تطبيق AI داخل ساعات فلكون نفسها دون ازدواج
  - 7–10 ساعات أسبوعيًا أثناء الإجازة
  - بوستان LinkedIn شهريًا عند توفر الوقت؛ لا عقود جديدة وقت الامتحانات
- id: Q1-AI
  title: تطبيق حالة AI حقيقية بفلكون والسعي لأول عميل
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: quarterly
  parent_id: A-AI
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: تطبيق حالة AI حقيقية بفلكون والسعي لأول عميل
  milestones:
  - اختيار مشكلة قابلة للقياس داخل فلكون
  - ملف عرض خدمة واضح واستهداف مارس لأول عميل
  action_templates: []
- id: M01-AI
  title: اختيار مشكلة واحدة في فلكون لتطبيق AI
  why: 'خطوة يناير العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q1-AI
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: اختيار مشكلة واحدة في فلكون لتطبيق AI
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: M02-AI
  title: قياس قبل/بعد وإنشاء نموذج أو أتمتة أولية
  why: 'خطوة فبراير العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q1-AI
  previous_goal_id: M01-AI
  target_date: '2027-02-28'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: قياس قبل/بعد وإنشاء نموذج أو أتمتة أولية
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: M03-AI
  title: عرض خدمة والسعي لأول اتفاق مدفوع في مارس
  why: 'خطوة مارس العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q1-AI
  previous_goal_id: M02-AI
  target_date: '2027-03-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: عرض خدمة والسعي لأول اتفاق مدفوع في مارس
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: Q2-AI
  title: تسليم خدمة محددة وبناء دراسة حالة مدفوعة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: quarterly
  parent_id: A-AI
  previous_goal_id: Q1-AI
  target_date: '2027-06-30'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: تسليم خدمة محددة وبناء دراسة حالة مدفوعة
  milestones:
  - تسليم مشروعات محددة النطاق دون تضارب جامعي
  - توثيق نتائج حقيقية قبل/بعد
  action_templates: []
- id: M04-AI
  title: تسليم أو تحسين المشروع الأول حسب الاتفاق الفعلي
  why: 'خطوة أبريل العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q2-AI
  previous_goal_id: M03-AI
  target_date: '2027-04-30'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: تسليم أو تحسين المشروع الأول حسب الاتفاق الفعلي
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: M05-AI
  title: استهداف عميل ثانٍ بحل محدود النطاق
  why: 'خطوة مايو العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q2-AI
  previous_goal_id: M04-AI
  target_date: '2027-05-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: استهداف عميل ثانٍ بحل محدود النطاق
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: M06-AI
  title: توثيق فائدة العميل وتجنب ضغط الامتحانات
  why: 'خطوة يونيو العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q2-AI
  previous_goal_id: M05-AI
  target_date: '2027-06-30'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: توثيق فائدة العميل وتجنب ضغط الامتحانات
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: Q3-AI
  title: تعميق المهارة وخدمة شركات أخرى ضمن السعة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: quarterly
  parent_id: A-AI
  previous_goal_id: Q2-AI
  target_date: '2027-09-30'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: تعميق المهارة وخدمة شركات أخرى ضمن السعة
  milestones:
  - تحسين التسعير والتسليم والتواصل
  - إدارة عميل واحد أو عدد محدود وفق الوقت
  action_templates: []
- id: M07-AI
  title: تطوير مهارة AI تطبيقية في الإجازة
  why: 'خطوة يوليو العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q3-AI
  previous_goal_id: M06-AI
  target_date: '2027-07-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: تطوير مهارة AI تطبيقية في الإجازة
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: M08-AI
  title: تحسين عرض الخدمة والملف التسويقي
  why: 'خطوة أغسطس العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q3-AI
  previous_goal_id: M07-AI
  target_date: '2027-08-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: تحسين عرض الخدمة والملف التسويقي
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: M09-AI
  title: السعي لمشروع مدفوع آخر ضمن السعة
  why: 'خطوة سبتمبر العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q3-AI
  previous_goal_id: M08-AI
  target_date: '2027-09-30'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: السعي لمشروع مدفوع آخر ضمن السعة
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: Q4-AI
  title: الوصول إلى 2–3 شركات بمشروعات مدفوعة مكتملة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: quarterly
  parent_id: A-AI
  previous_goal_id: Q3-AI
  target_date: '2027-12-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: الوصول إلى 2–3 شركات بمشروعات مدفوعة مكتملة
  milestones:
  - إتمام مشروعين على الأقل لشركتين مختلفتين
  - توثيق 2–3 دراسات حالة منضبطة
  action_templates: []
- id: M10-AI
  title: تنفيذ تعاقدات محدودة لا تؤثر على الجامعة
  why: 'خطوة أكتوبر العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q4-AI
  previous_goal_id: M09-AI
  target_date: '2027-10-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: تنفيذ تعاقدات محدودة لا تؤثر على الجامعة
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: M11-AI
  title: تصفية الالتزامات القائمة وتسليمها
  why: 'خطوة نوفمبر العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q4-AI
  previous_goal_id: M10-AI
  target_date: '2027-11-30'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: تصفية الالتزامات القائمة وتسليمها
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: M12-AI
  title: حصر المشاريع المدفوعة المكتملة ونشر دروس مستفادة
  why: 'خطوة ديسمبر العملية نحو الهدف: إنهاء 2–3 مشروعات AI Business Solutions مدفوعة في 2027.'
  life_area: الذكاء الاصطناعي والأثر
  horizon: monthly
  parent_id: Q4-AI
  previous_goal_id: M11-AI
  target_date: '2027-12-31'
  blessed_intention_suggestion: استخدام التقنية في نفع الناس وحل المشكلات بإتقان وصدق.
  success_criteria: حصر المشاريع المدفوعة المكتملة ونشر دروس مستفادة
  milestones: []
  action_templates:
  - تعلم وتطبيق وقياس مشكلة واحدة؛ لا تحسب مشروعًا مدفوعًا إلا بعد تسليم فعلي لشركة خارج فلكون.
- id: A-HEALTH
  title: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027
  why: الصحة والنوم أساس القدرة على أداء الواجبات، والعودة للرياضة يجب ألا تزيد الإصابة.
  life_area: الصحة واللياقة
  horizon: annual
  parent_id: V-HEALTH
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: 7 ساعات نوم فعلية في اليوم؛ بعد السماح الطبي 3 حصص رياضية أسبوعيًا نحو 1.5 ساعة تشمل الانتقال،
    وحركة مناسبة 20 دقيقة يوميًا.
  milestones: []
  action_templates:
  - لا رياضة مخالفة للتوجيه الطبي أثناء التعافي
  - تدرج في العودة عند التصريح الطبي
  - تقييم التعب والنوم وآلام الإصابة أسبوعيًا
- id: Q1-HEALTH
  title: تثبيت النوم والتعافي والعودة الطبية الآمنة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: quarterly
  parent_id: A-HEALTH
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: تثبيت النوم والتعافي والعودة الطبية الآمنة
  milestones:
  - تطبيق تعليمات التعافي
  - تحسين انتظام 7 ساعات نوم فعلية
  action_templates: []
- id: M01-HEALTH
  title: مراجعة التصريح الطبي وتحسين النوم في يناير
  why: 'خطوة يناير العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q1-HEALTH
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: مراجعة التصريح الطبي وتحسين النوم في يناير
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: M02-HEALTH
  title: زيادة الحركة تدريجيًا إذا سمحت الحالة في فبراير
  why: 'خطوة فبراير العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q1-HEALTH
  previous_goal_id: M01-HEALTH
  target_date: '2027-02-28'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: زيادة الحركة تدريجيًا إذا سمحت الحالة في فبراير
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: M03-HEALTH
  title: تثبيت روتين نشاط مناسب طبيًا في مارس
  why: 'خطوة مارس العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q1-HEALTH
  previous_goal_id: M02-HEALTH
  target_date: '2027-03-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: تثبيت روتين نشاط مناسب طبيًا في مارس
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: Q2-HEALTH
  title: تطوير انتظام نشاط بدني مناسب للحالة
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: quarterly
  parent_id: A-HEALTH
  previous_goal_id: Q1-HEALTH
  target_date: '2027-06-30'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: تطوير انتظام نشاط بدني مناسب للحالة
  milestones:
  - الوصول التدريجي لحصص رياضية منتظمة بعد السماح
  - مراقبة الألم والإجهاد
  action_templates: []
- id: M04-HEALTH
  title: قياس ثبات النوم والنشاط في أبريل
  why: 'خطوة أبريل العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q2-HEALTH
  previous_goal_id: M03-HEALTH
  target_date: '2027-04-30'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: قياس ثبات النوم والنشاط في أبريل
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: M05-HEALTH
  title: الاقتراب من 3 حصص أسبوعية إذا سمحت الحالة في مايو
  why: 'خطوة مايو العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q2-HEALTH
  previous_goal_id: M04-HEALTH
  target_date: '2027-05-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: الاقتراب من 3 حصص أسبوعية إذا سمحت الحالة في مايو
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: M06-HEALTH
  title: الحفاظ على الرياضة دون الإضرار بالدراسة في يونيو
  why: 'خطوة يونيو العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q2-HEALTH
  previous_goal_id: M05-HEALTH
  target_date: '2027-06-30'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: الحفاظ على الرياضة دون الإضرار بالدراسة في يونيو
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: Q3-HEALTH
  title: بناء عادات لياقة دون إفراط
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: quarterly
  parent_id: A-HEALTH
  previous_goal_id: Q2-HEALTH
  target_date: '2027-09-30'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: بناء عادات لياقة دون إفراط
  milestones:
  - الالتزام دون تحميل زائد
  - الحفاظ على حركة يومية مناسبة
  action_templates: []
- id: M07-HEALTH
  title: الاستفادة من الإجازة لنشاط بدني منتظم في يوليو
  why: 'خطوة يوليو العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q3-HEALTH
  previous_goal_id: M06-HEALTH
  target_date: '2027-07-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: الاستفادة من الإجازة لنشاط بدني منتظم في يوليو
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: M08-HEALTH
  title: رفع الجودة البدنية تدريجيًا دون إصابة في أغسطس
  why: 'خطوة أغسطس العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q3-HEALTH
  previous_goal_id: M07-HEALTH
  target_date: '2027-08-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: رفع الجودة البدنية تدريجيًا دون إصابة في أغسطس
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: M09-HEALTH
  title: تكييف التمارين مع عودة الجامعة في سبتمبر
  why: 'خطوة سبتمبر العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q3-HEALTH
  previous_goal_id: M08-HEALTH
  target_date: '2027-09-30'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: تكييف التمارين مع عودة الجامعة في سبتمبر
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: Q4-HEALTH
  title: المحافظة على نظام لياقة ونوم قابل للاستمرار
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: quarterly
  parent_id: A-HEALTH
  previous_goal_id: Q3-HEALTH
  target_date: '2027-12-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: المحافظة على نظام لياقة ونوم قابل للاستمرار
  milestones:
  - مراجعة التقدم واللياقة دون مبالغة
  - خطة استمرار للعام التالي
  action_templates: []
- id: M10-HEALTH
  title: حماية النوم في أكتوبر رغم ضغط فلكون
  why: 'خطوة أكتوبر العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q4-HEALTH
  previous_goal_id: M09-HEALTH
  target_date: '2027-10-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: حماية النوم في أكتوبر رغم ضغط فلكون
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: M11-HEALTH
  title: تقليل الحمل إذا ظهرت علامات إجهاد في نوفمبر
  why: 'خطوة نوفمبر العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q4-HEALTH
  previous_goal_id: M10-HEALTH
  target_date: '2027-11-30'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: تقليل الحمل إذا ظهرت علامات إجهاد في نوفمبر
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: M12-HEALTH
  title: تقييم اللياقة والنوم ووضع خطة 2028
  why: 'خطوة ديسمبر العملية نحو الهدف: استعادة اللياقة والنوم الكافي بشكل مستدام في 2027.'
  life_area: الصحة واللياقة
  horizon: monthly
  parent_id: Q4-HEALTH
  previous_goal_id: M11-HEALTH
  target_date: '2027-12-31'
  blessed_intention_suggestion: حفظ نعمة الصحة والقوة على القيام بالعبادات والمسؤوليات.
  success_criteria: تقييم اللياقة والنوم ووضع خطة 2028
  milestones: []
  action_templates:
  - تسجيل النوم الفعلي وحصص الحركة المسموح بها، والتوقف أو مراجعة المختص عند تدهور الأعراض.
- id: A-READ
  title: قراءة صفحتين يوميًا على الأقل خلال 2027
  why: خطوة صغيرة منتظمة نحو هدف قراءة 75 كتابًا بحلول 1 يناير 2030 وبناء معرفة نافعة في الدين والعلوم والبزنس.
  life_area: القراءة والتعلم
  horizon: annual
  parent_id: V-READ
  previous_goal_id: null
  target_date: '2027-12-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 730 صفحة في سنة من 365 يومًا إذا استمرت صفحتان كل يوم؛ عدد الكتب الفعلي يعتمد على طولها.
  milestones: []
  action_templates:
  - صفحتان بعد العشاء أو بعد الشروق
  - تسجيل الصفحات بدل افتراض أن الكتاب الواحد حجم ثابت
  - ملخص قصير للفكرة التي تستحق التطبيق
- id: Q1-READ
  title: حوالي 180 صفحة مقروءة بنهاية مارس
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: quarterly
  parent_id: A-READ
  previous_goal_id: null
  target_date: '2027-03-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: حوالي 180 صفحة مقروءة بنهاية مارس
  milestones:
  - اختيار كتاب أو كتب ذات أولوية
  - تثبيت قراءة يومية سهلة
  action_templates: []
- id: M01-READ
  title: 62 صفحة تراكميًا بنهاية يناير
  why: 'خطوة يناير العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q1-READ
  previous_goal_id: null
  target_date: '2027-01-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 62 صفحة تراكميًا بنهاية يناير
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: M02-READ
  title: 118 صفحة تراكميًا بنهاية فبراير
  why: 'خطوة فبراير العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q1-READ
  previous_goal_id: M01-READ
  target_date: '2027-02-28'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 118 صفحة تراكميًا بنهاية فبراير
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: M03-READ
  title: 180 صفحة تراكميًا بنهاية مارس
  why: 'خطوة مارس العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q1-READ
  previous_goal_id: M02-READ
  target_date: '2027-03-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 180 صفحة تراكميًا بنهاية مارس
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: Q2-READ
  title: حوالي 362 صفحة بنهاية يونيو
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: quarterly
  parent_id: A-READ
  previous_goal_id: Q1-READ
  target_date: '2027-06-30'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: حوالي 362 صفحة بنهاية يونيو
  milestones:
  - تسجيل الصفحات المقروءة فعليًا
  - تطبيق فكرة مما قُرئ
  action_templates: []
- id: M04-READ
  title: 240 صفحة تراكميًا بنهاية أبريل
  why: 'خطوة أبريل العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q2-READ
  previous_goal_id: M03-READ
  target_date: '2027-04-30'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 240 صفحة تراكميًا بنهاية أبريل
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: M05-READ
  title: 302 صفحة تراكميًا بنهاية مايو
  why: 'خطوة مايو العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q2-READ
  previous_goal_id: M04-READ
  target_date: '2027-05-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 302 صفحة تراكميًا بنهاية مايو
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: M06-READ
  title: 362 صفحة تراكميًا بنهاية يونيو
  why: 'خطوة يونيو العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q2-READ
  previous_goal_id: M05-READ
  target_date: '2027-06-30'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 362 صفحة تراكميًا بنهاية يونيو
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: Q3-READ
  title: حوالي 546 صفحة بنهاية سبتمبر
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: quarterly
  parent_id: A-READ
  previous_goal_id: Q2-READ
  target_date: '2027-09-30'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: حوالي 546 صفحة بنهاية سبتمبر
  milestones:
  - الاستمرار في الإجازة
  - تقييم الكتاب التالي بحسب فائدته
  action_templates: []
- id: M07-READ
  title: 424 صفحة تراكميًا بنهاية يوليو
  why: 'خطوة يوليو العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q3-READ
  previous_goal_id: M06-READ
  target_date: '2027-07-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 424 صفحة تراكميًا بنهاية يوليو
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: M08-READ
  title: 486 صفحة تراكميًا بنهاية أغسطس
  why: 'خطوة أغسطس العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q3-READ
  previous_goal_id: M07-READ
  target_date: '2027-08-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 486 صفحة تراكميًا بنهاية أغسطس
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: M09-READ
  title: 546 صفحة تراكميًا بنهاية سبتمبر
  why: 'خطوة سبتمبر العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q3-READ
  previous_goal_id: M08-READ
  target_date: '2027-09-30'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 546 صفحة تراكميًا بنهاية سبتمبر
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: Q4-READ
  title: 730 صفحة تقريبًا بنهاية ديسمبر
  why: 'مرحلة ربع سنوية لتحقيق الهدف السنوي: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: quarterly
  parent_id: A-READ
  previous_goal_id: Q3-READ
  target_date: '2027-12-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 730 صفحة تقريبًا بنهاية ديسمبر
  milestones:
  - تسجيل حصيلة القراءة السنوية
  - تحسين خطة الوصول لهدف 75 كتابًا
  action_templates: []
- id: M10-READ
  title: 608 صفحات تراكميًا بنهاية أكتوبر
  why: 'خطوة أكتوبر العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q4-READ
  previous_goal_id: M09-READ
  target_date: '2027-10-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 608 صفحات تراكميًا بنهاية أكتوبر
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: M11-READ
  title: 668 صفحة تراكميًا بنهاية نوفمبر
  why: 'خطوة نوفمبر العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q4-READ
  previous_goal_id: M10-READ
  target_date: '2027-11-30'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 668 صفحة تراكميًا بنهاية نوفمبر
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
- id: M12-READ
  title: 730 صفحة تراكميًا بنهاية ديسمبر
  why: 'خطوة ديسمبر العملية نحو الهدف: قراءة صفحتين يوميًا على الأقل خلال 2027.'
  life_area: القراءة والتعلم
  horizon: monthly
  parent_id: Q4-READ
  previous_goal_id: M11-READ
  target_date: '2027-12-31'
  blessed_intention_suggestion: اكتساب علم نافع والعمل به ونقله بأمانة.
  success_criteria: 730 صفحة تراكميًا بنهاية ديسمبر
  milestones: []
  action_templates:
  - قراءة صفحتين يوميًا وتسجيل الرقم الحقيقي، وكتابة فائدة مختصرة حين تستحق.
```

## 6. قيود التشغيل الأسبوعية المرتبطة بالأهداف

| الوضع | فلكون | المذاكرة الذاتية | Sciora | AI مستقل | قواعد أخرى |
|---|---:|---:|---:|---:|---|
| الدراسة | 17–20 س/أسبوع | 7 س كبداية مع زيادة عند الحاجة | 4–9 س | 2–3 س | 7 ساعات نوم فعلية/يوم، حقوق العبادة والأسرة، نشاط بعد السماح الطبي |
| الامتحانات | 8–12 س | 15–20 س أو أكثر حسب المنهج | إيقاف الاختياري | صفر اختياري | لا وعود تسليم جديدة؛ نحمي العبادة والنوم والحقوق |
| الإجازة | 21–25 س | حسب الدراسة الفعلية | 7–10 س | 7–10 س | تعلم التسويق نحو 10 س إضافية فقط إن سمح الوقت |

**ملحوظة:** 2–3 ساعات AI داخل فلكون تُحتسب **ضمن ساعات فلكون** ولا تُضاف مرة ثانية. وأوقات الصلوات والقرآن والأسرة والرياضة تُحجز قبل توزيع العمل المرن.

### نقاط ثابتة من الجدول المعروف

- **الاثنين:** مذاكرة عميقة ضمن فترات `08:00–12:00` و`13:30–15:30` و`17:00–18:30` كتدرج نهائي، ومحاضرة Spectroscopy `19:00–21:00`، على أن يكون وقت المذاكرة الصافي أقل من زمن الحجز.
- **الأربعاء:** ساعتان احتياطيتان للتعويض الدراسي عند الحاجة.
- **الجمعة:** درس قرآن بعد العصر، وزيارة الجدة نحو أربع ساعات مع تنظيم المواصلات والوقت الواقعي.
- **الجامعة:** تُربط بقائمة المواعيد الفعلية بعد مراجعتها، خاصة مع أي تغيّر فصلي في جدول المحاضرات.
- **الرياضة:** 20 دقيقة يومية فقط إذا كانت مناسبة صحيًا، و3 حصص أسبوعية تدريجيًا بعد تصريح المختص؛ حصة التمرين نفسها تُحتسب من الحركة اليومية.
- **القراءة:** صفحتان يوميًا بعد العشاء أو بعد الشروق حسب الأنسب.

## 7. قيود المال والزواج — بوابات قرار لا مهام واجبة الدفع

- **نوفمبر وديسمبر 2026:** تسوية بيانات فلكون قدر الإمكان ومراجعة المصروفات والتحصيلات والاحتياطي.
- **يناير 2027:** مراجعة *إمكانية* توزيع 20–30% من ربح الشركة بعد ضمان التزاماتها واحتياطيها؛ لا صرف تلقائي.
- **حصة أحمد النظرية:** 50% من إجمالي التوزيعات. التقدير الراهن من الربح المقدّر 15–22 ألف جنيه للشركة = نحو 1,500–3,300 جنيه للشخص شهريًا **فقط إذا جرى التوزيع فعلًا**.
- **الجمعية:** لا دخول قبل 3 أشهر متتالية من توزيعات شخصية حقيقية، واحتياطي منفصل لـ6 أقساط، وقسط أقصى = 25% من أقل فائض شخصي شهري محقق، وموعد قبض مفضل سبتمبر أو أكتوبر 2027 إذا أمكن دون مخاطرة. الجمعية ليست دخلًا إضافيًا.
- **الزواج:** مساهمة تقديرية 200–300 ألف جنيه وتجهيز الشقة، واحتياطي للبيت 3 أشهر (حوالي 45–60 ألف وفق ميزانية معيشة تقديرية 15–20 ألف/شهر). دخل شخصي يغطي الإنفاق والالتزامات بهامش. ديسمبر 2027 **مشروط**، ويؤجل إذا لم يستقر الدخل.
- **هدف CGPA:** 3.30/5 بنهاية 2027؛ 3.50/5 stretch، والـ7 ساعات دراسة ليست سقفًا مضمون الكفاية.
- **نمو فلكون:** 1,500 طلب/شهر أساسي طموح بنهاية ديسمبر؛ 3,000 و150–200 ألف ربح صافي شهريًا stretch **غير مضمون** ويخضع لقياس الربح والسيولة والجودة.

## 8. فحوص قبل استيراد الخطة المعتمدة

- [ ] أخذ نسخة احتياطية وقراءة بنية جداول الأهداف/النيات/المعالم/المهام.
- [ ] `dry-run` يثبت **8 رؤى + 11 سنوي + 44 ربع سنوي + 132 شهري = 195 سجلًا مرجعيًا** قبل خصم الرؤى الموجودة فعلًا.
- [ ] منع تكرار هدف "قراءة 75" الموجود والمحافظة على وصفه الأصلي وتاريخه.
- [ ] مطابقة كل `parent_id` بالأب الصحيح، وعدم وجود ربط دائري.
- [ ] ظهور "هدف شهري" عند الإضافة والفلترة والعرض على الهاتف.
- [ ] نجاح الاختبار عند إعادة تشغيل الاستيراد مرتين بلا نسخ إضافية.
- [ ] عدم تعديل XP أو نقل أي هدف تلقائيًا إلى "مكتمل".
- [ ] اختبارات عرض العربية RTL وتاريخ الإنجاز المتوقع في البطاقات ونافذة الإضافة.
- [ ] ظهور خطة 2027 في حالة **معتمدة (APPROVED)**، مع إبقاء جميع الأهداف الجديدة **مخططة وغير مكتملة**، وصفر XP أو تقدم ناتج عن عملية الاستيراد نفسها.
