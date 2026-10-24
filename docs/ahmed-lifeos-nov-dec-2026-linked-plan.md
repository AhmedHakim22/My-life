# خطة نوفمبر وديسمبر 2026 — جسر إلى أهداف 2027 المعتمدة

> **حالة الملف:** جاهز للربط والاستيراد في LifeOS عبر Codex (وليس دليلًا على التنفيذ).  
> **النطاق:** 1 نوفمبر – 31 ديسمبر 2026 · **المنطقة الزمنية:** `Africa/Cairo`  
> **الخطة الأصلية:** `ahmed-lifeos-2027-v1` — **معتمدة ومضافة مسبقًا**، فلا تعِد استيرادها.  
> **ميدتيرم الجامعة:** **7–21 نوفمبر 2026** — أولوية محمية.  
> **الهيكل المُضاف:** 8 أغلفة تمهيدية سنوية 2026 + 8 أغلفة ربع سنوية Q4 + **16 هدفًا شهريًا فقط (8 لنوفمبر و8 لديسمبر)**. الأغلفة للربط فقط وليست تكليفات جديدة.

## أولًا: التعليمات الجاهزة لـCodex

> **اقرأ هذا الملف كاملًا وافحص قاعدة البيانات وكود موقع مسار LifeOS قبل أي تعديل.** خطة 2027 موجودة ومعتمدة ومستوردة بالفعل؛ **لا تضف أي هدف من أهداف 2027 مرة ثانية ولا تعدّلها**. استخدم الـIDs الحقيقية لأهداف 2027 الموجودة في القاعدة بعد مطابقة معرّفاتها المصدرية الواردة أدناه، وأنشئ أهداف نوفمبر وديسمبر 2026 فقط من كتلة YAML.  
> نفّذ `dry-run` ونسخة احتياطية قبل الاستيراد، ثم `upsert` باستخدام المعرّف المستقر `id/source_goal_id`؛ تشغيل السكربت مرتين لا ينشئ أهدافًا أو مهام مكررة. في حال عدم إيجاد الهدف الأب من رؤى 2031 أو وجود أكثر من مطابقة، **توقف عن الربط المختلف عليه** واعرض تقريرًا، ولا تُنشئ هدف رؤية بديلًا.  
> احفظ `parent_id` كسلسلة رؤى موجودة ← هدف تمهيدي 2026 ← ربع Q4 2026 ← نوفمبر/ديسمبر 2026. احتفظ بـ`related_existing_2027_goal_ids` كرابط «يمهد لـ» أو `linked_goals` إلى الأهداف السنوية **الموجودة** لعام 2027. لا تُنشئ تبعية زمنية زائفة من هدف نوفمبر 2026 إلى هدف 2027 السنوي.  
> لو نموذج الموقع لا يدعم إلا مستويات صارمة (رؤية/سنوي/ربع/شهري)، فالأغلفة التمهيدية السنوية والربع سنوية موجودة بالفعل في البيانات للحفاظ على السلسلة الصحيحة. لا تولّد أي أهداف 2026 إضافية من عندك.  
> لو دعم «هدف شهري» مخفي على الهاتف، أظهر نوفمبر وديسمبر 2026 في فلتر واضح وأبرز الهدف الشهري الحالي، واربط المهام داخل هدف الشهر. أضف خيار «الهدف الذي يُمهّد له في 2027» في تفاصيل الهدف.  
> **حافظ على جميع بيانات المستخدم، XP، حالات الإنجاز الفعلية والـMilestones القائمة.** الأهداف والمهام المُضافة تبدأ «مخططة/غير منجزة»، ولا XP تلقائيًا. لا تُفعّل تكرارات بالآلاف؛ حوّل جلسات الكورسات المحددة أدناه إلى مهام بتاريخها، والعادات المتكررة إلى روتين واحد يُتابَع بالتواريخ من دون تكرار يومي غير مطلوب.  
> حوّل `life_area` لقيم مجالات الحياة الفعلية بعد قراءتها من الكود، واستخدم حقول النموذج: عنوان الهدف، لماذا هو مهم، مجال الحياة، الأفق الزمني، تاريخ الانتهاء المتوقع، الهدف الأب، والنية المقترحة.  
> **لا توقّع أي جمعية أو صرف أرباح أو عمل مالي فعلي**؛ مهام المال متابعة وتجهيز بيانات فقط. لا تعتبر إنهاء كتاب أو كورس حدث بالفعل عند الاستيراد.  
> بعد الاستيراد اعرض تقريرًا بالأهداف الجديدة (8+8+16)، الروابط الموجودة لعام 2027، المهام الجديدة، وعدد التكرارات = صفر، واختبر عرض الهاتف والفلتر الشهري.

## ثانيًا: طريقة عرض الخطة للمستخدم

### تقسيم نوفمبر 2026

| الفترة | الأولوية | الزواج والقراءة | التسويق | AI |
|---|---|---|---|---|
| **1–6 نوفمبر** | تحضير مركز للميد | تجهيز المصادر فقط إن لم يزاحم المذاكرة | 0 ساعة جديدة | 0 ساعة جديدة |
| **7–21 نوفمبر** | **امتحانات الميد**؛ مذاكرة المادة التالية أولًا | لا حصص إضافية إلزامية | 0 ساعة | 0 ساعة |
| **22–30 نوفمبر** | مراجعة فجوات الامتحانات والعودة للروتين | **ساعتان من كورس الزواج (من 4)** + بدء «الخطوبة الآمنة» | **ساعتان من الكورس** | **ساعتان من الكورس** |

> **استثناء مُتعمّد:** طلب 2–4 ساعات أسبوعيًا لكل من التسويق وAI يُطبّق في **الأسابيع العادية**؛ لا نفرضه أثناء الميد أو أيام تحضيره، لأن الاستعداد للجامعة والنوم والعبادات أولويات محمية. لا تُرحَّل ساعات 7–21 نوفمبر كـ«ديون» يجب تعويضها كلها.

### تقسيم ديسمبر 2026

| الأسبوع | الجامعة | كورس الزواج | القراءة | التسويق | AI |
|---|---|---|---|---|---|
| **1–6 ديسمبر** | 7 ساعات مذاكرة ذاتية كأساس | ساعة 3 | استكمال «الخطوبة الآمنة» | ساعتان | ساعتان |
| **7–13 ديسمبر** | مذاكرة + واجبات | ساعة 4 بحد أقصى **7 ديسمبر** ثم ملخص | استكمال «الخطوبة الآمنة» | ساعتان | ساعتان |
| **14–20 ديسمبر** | دراسة ومراجعة | مراجعة اختيارية فقط | إنهاء «الخطوبة الآمنة» نحو **15 ديسمبر**، وبدء «بيوت مطمئنة» | ساعتان | ساعتان |
| **21–27 ديسمبر** | دراسة ومراجعة | — | قراءة «بيوت مطمئنة» | ساعتان | ساعتان |
| **28–31 ديسمبر** | تقييم نهاية الشهر | — | إكمال «بيوت مطمئنة» إن سمح حجم الكتاب؛ خلاصة للكتابين | مراجعة اختيارية | مراجعة اختيارية |

**زمن الكورسات:** التسويق 2–4 ساعات **أسبوعيًا بشكل مستقل**، وAI كذلك، بدون اشتراط إكمال أيٍّ من الكورسين في ديسمبر. المستهدف الأساسي لكل كورس **8 ساعات في الأسابيع الأربعة الكاملة**، والطموح 16 ساعة إذا كانت الجامعة والنوم وباقي الحقوق مستقرة. لو التعلم جزءًا من ساعات عمل فلكون الفعلية، لا يُحسب الوقت مرتين.

**قراءة الكتابين:** عدد صفحات النسخ غير معلوم؛ لذلك تواريخ **15 و31 ديسمبر مواعيد مستهدفة وليست ضمانًا**. عند الحصول على الكتاب تُحسب الصفحات المتبقية على جلسات قراءة **25–35 دقيقة نحو 4 مرات أسبوعيًا**؛ إذا كانت كمية الصفحات لا تسمح بالإنهاء بفهم دون إرهاق، تُعدل المهام الفعلية ولا يُسجَّل إنجاز وهمي. الحد اليومي العام «صفحتان من كتاب» لا يكفي بالضرورة لإكمال كتابين في شهر.

### العادات والقيود المستمرة (بدون مضاعفة أهداف)

- الفرائض والأذكار والقرآن، ومراجعة الحفظ، ودرس الجمعة بعد العصر قدر الإمكان، والتزكية ومحاسبة النفس بلطف؛ وقت الميد لا يسقط هذا المسار.
- بر الوالدين وصلة الرحم، وزيارة الجدة غالبًا الجمعة بنحو 4 ساعات، مع مراعاة مواعيد الامتحانات الحقيقية.
- **7 ساعات نوم فعلي يوميًا**، وعدم بدء الجيم أو الملاكمة أو الرياضة الشديدة قبل تصريح المختص، والحركة حسب المسموح طبيًا.
- فلكون: تشغيل الطلبات والوفاء بالمواعيد والتفويض قدر الإمكان؛ **لا حملات توسع مفاجئة وقت الميد**.
- Sciora: التنسيق لتأجيل الأعمال الاختيارية وقت الامتحانات، والعودة التدريجية بعده.
- المال: استكمال سجلات فلكون في نوفمبر وديسمبر، استعدادًا لمراجعة **أهلية** توزيع الأرباح في يناير 2027، وليس تقريرًا بصرف آلي.

## ثالثًا: مثال على الربط الصحيح

```text
[موجود بالفعل] V-FAMILY — رؤية الأسرة والزواج حتى 2031
  └─ [يضاف] B26-A-FAMILY — بناء وعي الزواج قبل 2027
       └─ [يضاف] B26-Q4-FAMILY — كورس الزواج والتعلم
            ├─ [يضاف] B26-M11-FAMILY — أول ساعتين من الكورس، 2026-11-30
            └─ [يضاف] B26-M12-FAMILY — إكمال الكورس، 2026-12-31
                      ╰─ «يمهّد لـ» [موجود بالفعل] A-MARRIAGE (2027)

[موجود بالفعل] V-READ — «قراءة 75» (2030-01-01)
  └─ [يضاف] B26-A-READ → B26-Q4-READ
        ├─ [يضاف] B26-M11-READ — بدء «الخطوبة الآمنة»
        └─ [يضاف] B26-M12-READ — إكمال الكتابين
                      ╰─ «يمهّد لـ» [موجود بالفعل] A-READ وA-MARRIAGE
```

> **المهم:** الربط بالأهداف الأعلى يتحقق من `parent_id`، بينما الرابط إلى الهدف السنوي الموجود في **2027** هو `related_existing_2027_goal_ids` (علاقة «تمهيد/صلة»)، حتى تبقى التواريخ مرتبة منطقيًا.

## رابعًا: البيانات الأساسية الجاهزة للاستيراد (YAML — Source of Truth)

```yaml
config:
  plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  plan_title: خطة نوفمبر وديسمبر 2026 التمهيدية المرتبطة بأهداف 2027
  status: READY_FOR_IMPORT
  user_requested_import: true
  year: 2026
  timezone: Africa/Cairo
  language: ar-EG
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  related_approved_plan_id: ahmed-lifeos-2027-v1
  preserve_approved_2027_plan: true
  import_policy: upsert_by_stable_source_id; no_duplicate; no_deletes
  default_import_status: planned_not_completed
  award_xp_on_import: false
  no_automatic_financial_commitments: true
  no_automatic_completion: true
  brief: يُضاف فقط ما يخص نوفمبر وديسمبر 2026؛ أهداف 2027 موجودة بالفعل ولا تُنشأ مرة أخرى.
  focus:
  - اجتياز ميد الجامعة 2026-11-07 إلى 2026-11-21
  - كورس الزواج 4 ساعات؛ يكتمل أوائل ديسمبر
  - كتاب الخطوبة الآمنة وكتاب بيوت مطمئنة
  - كورس التسويق 2–4 ساعات لكل أسبوع عادي
  - كورس AI من 2–4 ساعات لكل أسبوع عادي
  calendar_modes:
  - id: exam_prep
    from_date: '2026-11-01'
    to_date: '2026-11-06'
    university: مراجعات الميد أولوية
    marketing_course_minutes_per_week: 0
    ai_course_minutes_per_week: 0
    marriage_course_minutes_per_week: 0
  - id: midterms
    from_date: '2026-11-07'
    to_date: '2026-11-21'
    university: الامتحانات/المذاكرة أولوية
    marketing_course_minutes_per_week: 0
    ai_course_minutes_per_week: 0
    marriage_course_minutes_per_week: 0
    sciora_optional_paused: true
  - id: post_mid
    from_date: '2026-11-22'
    to_date: '2026-11-30'
    university: العودة تدريجيًا لسبع ساعات مذاكرة ذاتية أسبوعيًا
    marketing_course_minutes_per_week: 120
    ai_course_minutes_per_week: 120
    marriage_course_minutes_per_week: 120
  - id: december_normal
    from_date: '2026-12-01'
    to_date: '2026-12-31'
    university: 7 ساعات أسبوعيًا كبداية؛ تعديلها قبل أي اختبار آخر
    marketing_course_minutes_per_week_min: 120
    marketing_course_minutes_per_week_stretch: 240
    ai_course_minutes_per_week_min: 120
    ai_course_minutes_per_week_stretch: 240
    marriage_course_total_minutes: 120
    reading_four_sessions_per_week: true
  exam_period:
    start: '2026-11-07'
    end: '2026-11-21'
    override_optional_learning: true
    retain_core_worship: true
    protect_sleep_hours: 7
  note_on_2027_hierarchy: لا تجعل هدف نوفمبر أو ديسمبر 2026 ابنًا لهدف سنوي يبدأ في 2027. أنشئ أهدافًا تمهيدية 2026 متدرجة
    تحت الرؤية الموجودة، واربط أهداف 2027 بوسم related_existing_2027_goal_ids فقط.
goals:
- id: B26-A-UNI
  title: تهيئة الدراسة والبحث لبرنامج 2027 خلال نوفمبر وديسمبر 2026
  why: أحمي أدائي الجامعي أثناء ميد نوفمبر وأدخل 2027 بنظام مذاكرة قابل للاستمرار.
  horizon: annual
  parent_id: V-SCIENCE
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.
  milestones: []
  action_templates: []
  life_area: الجامعة والبحث العلمي
  blessed_intention_suggestion: طلب العلم النافع وإتقان الدراسة والوفاء بحقوق التعلم.
  related_existing_2027_goal_ids: &id001
  - A-UNI
  - A-RESEARCH
  legacy_vision_goal_id: V-SCIENCE
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-Q4-UNI
  title: عبور الميد وتثبيت أساس الدراسة لنهاية 2026
  why: أحمي أدائي الجامعي أثناء ميد نوفمبر وأدخل 2027 بنظام مذاكرة قابل للاستمرار.
  horizon: quarterly
  parent_id: B26-A-UNI
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.
  milestones: []
  action_templates: []
  life_area: الجامعة والبحث العلمي
  blessed_intention_suggestion: طلب العلم النافع وإتقان الدراسة والوفاء بحقوق التعلم.
  related_existing_2027_goal_ids: *id001
  legacy_vision_goal_id: V-SCIENCE
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M11-UNI
  title: اجتياز ميد نوفمبر 7–21 ومراجعة المواد دون تشتت
  why: الامتحانات أولوية خلال 7–21 نوفمبر وأي كورسات إضافية لا يجوز أن تضر الاستعداد.
  horizon: monthly
  parent_id: B26-Q4-UNI
  previous_goal_id: null
  start_date: '2026-11-01'
  target_date: '2026-11-30'
  success_criteria: تنفيذ خطة مراجعة قبل الميد وأثناءه، وتسجيل نقاط الضعف عقب آخر امتحان.
  priority: protected
  milestones: []
  action_templates: []
  tasks:
  - id: UNI11-01
    title: حصر المواد والموضوعات ومواعيد كل اختبار، وتجهيز خطة حل ومراجعة
    due_date: '2026-11-02'
    estimated_minutes: 45
    status: planned_not_completed
    completed: false
  - id: UNI11-02
    title: مراجعة مركزة يومية وحل أسئلة قبل بدء الميد
    due_date: '2026-11-06'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: UNI11-03
    title: 'خلال 7–21 نوفمبر: المذاكرة للاختبار التالي وتصحيح أخطاء الأسئلة السابقة'
    due_date: '2026-11-21'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: UNI11-04
    title: 'بعد الميد: حصر فجوات Spectroscopy وBiomedicine وباقي المقررات'
    due_date: '2026-11-26'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: UNI11-05
    title: العودة لكتلتين دراسيتين في أسبوع 22–30 نوفمبر
    due_date: '2026-11-30'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  life_area: الجامعة والبحث العلمي
  blessed_intention_suggestion: طلب العلم النافع وإتقان الدراسة والوفاء بحقوق التعلم.
  related_existing_2027_goal_ids: *id001
  legacy_vision_goal_id: V-SCIENCE
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M12-UNI
  title: تثبيت مذاكرة أسبوعية استعدادًا لاستكمال الترم و2027
  why: بدون مذاكرة منتظمة لن تكون أهداف GPA قابلة للتحقق.
  horizon: monthly
  parent_id: B26-Q4-UNI
  previous_goal_id: B26-M11-UNI
  start_date: '2026-12-01'
  target_date: '2026-12-31'
  success_criteria: خطة 7 ساعات ذاتية أسبوعيا قابلة للزيادة وفق نتائج الاختبارات، مع تسجيل الفعلي.
  priority: protected
  milestones: []
  action_templates: []
  tasks:
  - id: UNI12-01
    title: تحديد خطة مذاكرة أسبوعية بالمحاضرات المتأخرة والواجبات
    due_date: '2026-12-03'
    estimated_minutes: 45
    status: planned_not_completed
    completed: false
  - id: UNI12-02
    title: تنفيذ ومتابعة 7 ساعات مذاكرة فعلية في الأسبوع الأول
    due_date: '2026-12-06'
    estimated_minutes: 420
    status: planned_not_completed
    completed: false
  - id: UNI12-03
    title: مراجعة الأخطاء وحل مسائل المواد الصعبة في الأسبوع الثاني
    due_date: '2026-12-13'
    estimated_minutes: 420
    status: planned_not_completed
    completed: false
  - id: UNI12-04
    title: مراجعة أسبوعية مع حل مسائل واسترجاع في الأسبوع الثالث
    due_date: '2026-12-20'
    estimated_minutes: 420
    status: planned_not_completed
    completed: false
  - id: UNI12-05
    title: تقييم الأسبوع الرابع والاستعداد لامتحانات أو تكليفات نهاية الترم
    due_date: '2026-12-27'
    estimated_minutes: 420
    status: planned_not_completed
    completed: false
  - id: UNI12-06
    title: متابعة Sciora وفق المطلوب فقط بعد التنسيق، بلا التزامات جديدة وقت الميد
    due_date: '2026-12-31'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  life_area: الجامعة والبحث العلمي
  blessed_intention_suggestion: طلب العلم النافع وإتقان الدراسة والوفاء بحقوق التعلم.
  related_existing_2027_goal_ids: *id001
  legacy_vision_goal_id: V-SCIENCE
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-A-FAMILY
  title: بناء وعي الزواج والمسؤولية الأسرية قبل 2027
  why: أتهيأ للزواج بوعي ومسؤولية، دون الخلط بين التعلم وبين تحقق الجاهزية المالية.
  horizon: annual
  parent_id: V-FAMILY
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.
  milestones: []
  action_templates: []
  life_area: الأسرة والزواج
  blessed_intention_suggestion: بناء بيت قائم على المودة والرحمة والحقوق المتبادلة وبر الوالدين.
  related_existing_2027_goal_ids: &id002
  - A-MARRIAGE
  - A-FAMILY
  legacy_vision_goal_id: V-FAMILY
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-Q4-FAMILY
  title: كورس الزواج وتعلّم الاستعداد الأسري خلال نوفمبر وديسمبر
  why: أتهيأ للزواج بوعي ومسؤولية، دون الخلط بين التعلم وبين تحقق الجاهزية المالية.
  horizon: quarterly
  parent_id: B26-A-FAMILY
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.
  milestones: []
  action_templates: []
  life_area: الأسرة والزواج
  blessed_intention_suggestion: بناء بيت قائم على المودة والرحمة والحقوق المتبادلة وبر الوالدين.
  related_existing_2027_goal_ids: *id002
  legacy_vision_goal_id: V-FAMILY
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M11-FAMILY
  title: بدء كورس الزواج المكوّن من 4 ساعات بعد انتهاء الميد
  why: أتعلم أساسيات الاختيار والتواصل والمسؤولية من غير مزاحمة الاستعداد للامتحانات.
  horizon: monthly
  parent_id: B26-Q4-FAMILY
  previous_goal_id: null
  start_date: '2026-11-01'
  target_date: '2026-11-30'
  success_criteria: مشاهدة ساعتين من الأربع بعد 21 نوفمبر مع ملاحظات عملية؛ لا يُعتبر الكورس منتهيًا.
  priority: high
  milestones: []
  action_templates: []
  tasks:
  - id: FAM11-01
    title: تجهيز رابط كورس الزواج وملف ملاحظات أسئلة الزواج
    due_date: '2026-11-22'
    estimated_minutes: 15
    status: planned_not_completed
    completed: false
  - id: FAM11-02
    title: إنهاء الساعة الأولى من كورس الزواج مع 3 ملاحظات
    due_date: '2026-11-25'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: FAM11-03
    title: إنهاء الساعة الثانية من كورس الزواج مع 3 ملاحظات
    due_date: '2026-11-29'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: FAM11-04
    title: الحفاظ على صلة الأهل والجدة بأوقات متفق عليها حتى أثناء الميد
    due_date: '2026-11-30'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  life_area: الأسرة والزواج
  blessed_intention_suggestion: بناء بيت قائم على المودة والرحمة والحقوق المتبادلة وبر الوالدين.
  related_existing_2027_goal_ids: *id002
  legacy_vision_goal_id: V-FAMILY
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M12-FAMILY
  title: إكمال كورس الزواج 4 ساعات وتلخيص ما تعلمته
  why: أحوّل التعلم إلى أسئلة عملية وحدود واضحة بدل مشاهدة المحتوى فقط.
  horizon: monthly
  parent_id: B26-Q4-FAMILY
  previous_goal_id: B26-M11-FAMILY
  start_date: '2026-12-01'
  target_date: '2026-12-31'
  success_criteria: استكمال الساعتين المتبقيتين وإعداد صفحة مراجعة للمفاهيم والأسئلة الأساسية.
  priority: high
  milestones: []
  action_templates: []
  tasks:
  - id: FAM12-01
    title: إكمال الساعة الثالثة من كورس الزواج
    due_date: '2026-12-03'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: FAM12-02
    title: إكمال الساعة الرابعة من كورس الزواج
    due_date: '2026-12-07'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: FAM12-03
    title: 'تلخيص الكورس: 10 أفكار أو أسئلة أراجعها لاحقًا'
    due_date: '2026-12-10'
    estimated_minutes: 45
    status: planned_not_completed
    completed: false
  - id: FAM12-04
    title: صلة الرحم الأسبوعية وبر الوالدين دون تحويلها لنقاط شكلية
    due_date: '2026-12-31'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: FAM12-05
    title: كتابة قائمة أولية لمهارات الزواج التي تحتاج متابعة في 2027
    due_date: '2026-12-30'
    estimated_minutes: 30
    status: planned_not_completed
    completed: false
  life_area: الأسرة والزواج
  blessed_intention_suggestion: بناء بيت قائم على المودة والرحمة والحقوق المتبادلة وبر الوالدين.
  related_existing_2027_goal_ids: *id002
  legacy_vision_goal_id: V-FAMILY
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-A-FALCON
  title: الاستعداد لتطوير تسويق وتشغيل فلكون في 2027
  why: أتعلم التسويق بالتدرج وأطبّق ما ينفع فلكون دون تشتيت أو رفع مخاطر الطلبات.
  horizon: annual
  parent_id: V-FALCON
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.
  milestones: []
  action_templates: []
  life_area: فلكون والأعمال
  blessed_intention_suggestion: الكسب الحلال والإحسان للعملاء والوفاء بالالتزامات.
  related_existing_2027_goal_ids: &id003
  - A-FALCON
  legacy_vision_goal_id: V-FALCON
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-Q4-FALCON
  title: تعلم التسويق تدريجيًا دون تعطيل تشغيل فلكون أثناء الميد
  why: أتعلم التسويق بالتدرج وأطبّق ما ينفع فلكون دون تشتيت أو رفع مخاطر الطلبات.
  horizon: quarterly
  parent_id: B26-A-FALCON
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.
  milestones: []
  action_templates: []
  life_area: فلكون والأعمال
  blessed_intention_suggestion: الكسب الحلال والإحسان للعملاء والوفاء بالالتزامات.
  related_existing_2027_goal_ids: *id003
  legacy_vision_goal_id: V-FALCON
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M11-FALCON
  title: تفويض فلكون وقت الميد والعودة لكورس التسويق بعده
  why: أحمي وقت المذاكرة ولا أوقف تشغيل الطلبات أو أحمّل نفسي تعلّمًا إضافيًا أثناء الاختبارات.
  horizon: monthly
  parent_id: B26-Q4-FALCON
  previous_goal_id: null
  start_date: '2026-11-01'
  target_date: '2026-11-30'
  success_criteria: خطة تفويض واضحة للميد + ساعتان كورس تسويق خلال 22–30 نوفمبر.
  priority: high
  milestones: []
  action_templates: []
  tasks:
  - id: FAL11-01
    title: تحديد المسؤول عن الردود والطلبات والطباعة أثناء 7–21 نوفمبر
    due_date: '2026-11-05'
    estimated_minutes: 45
    status: planned_not_completed
    completed: false
  - id: FAL11-02
    title: متابعة تشغيل فلكون بالحد الضروري أثناء الميد دون حملات توسع جديدة
    due_date: '2026-11-21'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: FAL11-03
    title: 'كورس التسويق: جلسة 60 دقيقة بعد انتهاء الميد'
    due_date: '2026-11-25'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: FAL11-04
    title: 'كورس التسويق: جلسة 60 دقيقة + 3 أفكار قابلة للتجربة'
    due_date: '2026-11-29'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  life_area: فلكون والأعمال
  blessed_intention_suggestion: الكسب الحلال والإحسان للعملاء والوفاء بالالتزامات.
  related_existing_2027_goal_ids: *id003
  legacy_vision_goal_id: V-FALCON
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M12-FALCON
  title: الانتظام في كورس التسويق 2–4 ساعات أسبوعيًا
  why: أتعلم عناصر التسويق المتعلقة بفلكون وأقيّمها عمليًا بدل السعي لإنهاء كورس كامل بسرعة.
  horizon: monthly
  parent_id: B26-Q4-FALCON
  previous_goal_id: B26-M11-FALCON
  start_date: '2026-12-01'
  target_date: '2026-12-31'
  success_criteria: إنجاز 2 ساعة على الأقل في كل أسبوع كامل من ديسمبر؛ 8 ساعات إجمالًا حد عملي، و16 ساعة هدف أعلى، دون
    اشتراط إنهاء الكورس.
  priority: high
  milestones: []
  action_templates: []
  tasks:
  - id: FAL12-W1
    title: 'التسويق — الأسبوع 1: ساعتان من الكورس'
    due_date: '2026-12-06'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  - id: FAL12-W2
    title: 'التسويق — الأسبوع 2: ساعتان من الكورس'
    due_date: '2026-12-13'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  - id: FAL12-W3
    title: 'التسويق — الأسبوع 3: ساعتان من الكورس'
    due_date: '2026-12-20'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  - id: FAL12-W4
    title: 'التسويق — الأسبوع 4: ساعتان من الكورس'
    due_date: '2026-12-27'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  - id: FAL12-05
    title: تلخيص 5 أفكار تسويقية، واختيار تجربة صغيرة بميزانية لا تُنفَّذ دون تقييم
    due_date: '2026-12-29'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: FAL12-06
    title: 'اختياري: ساعة مراجعة بالكورس في أيام 28–31 ديسمبر لو فيه سعة'
    due_date: '2026-12-31'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  life_area: فلكون والأعمال
  blessed_intention_suggestion: الكسب الحلال والإحسان للعملاء والوفاء بالالتزامات.
  related_existing_2027_goal_ids: *id003
  legacy_vision_goal_id: V-FALCON
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-A-AI
  title: تمهيد تعلم حلول الذكاء الاصطناعي التطبيقية قبل 2027
  why: أبني مهارات عملية تسمح لي بتطبيق AI داخل فلكون ثم تقديم حلول مدفوعة مستقبلًا.
  horizon: annual
  parent_id: V-AI
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.
  milestones: []
  action_templates: []
  life_area: الذكاء الاصطناعي والأثر
  blessed_intention_suggestion: طلب العلم النافع وتوظيف التقنية بما ينفع الناس دون تضليل.
  related_existing_2027_goal_ids: &id004
  - A-AI
  - A-FALCON
  legacy_vision_goal_id: V-AI
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-Q4-AI
  title: استمرار كورس AI في الوقت المتاح ونقل الفهم إلى تطبيق بسيط
  why: أبني مهارات عملية تسمح لي بتطبيق AI داخل فلكون ثم تقديم حلول مدفوعة مستقبلًا.
  horizon: quarterly
  parent_id: B26-A-AI
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.
  milestones: []
  action_templates: []
  life_area: الذكاء الاصطناعي والأثر
  blessed_intention_suggestion: طلب العلم النافع وتوظيف التقنية بما ينفع الناس دون تضليل.
  related_existing_2027_goal_ids: *id004
  legacy_vision_goal_id: V-AI
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M11-AI
  title: استئناف كورس AI بعد الميد بواقع ساعتين
  why: الميد له الأولوية أولًا ثم أعود للتعلم تدريجيًا.
  horizon: monthly
  parent_id: B26-Q4-AI
  previous_goal_id: null
  start_date: '2026-11-01'
  target_date: '2026-11-30'
  success_criteria: ساعتان كورس AI بين 22 و30 نوفمبر، دون التزام دراسة الكورس أثناء الامتحانات.
  priority: high
  milestones: []
  action_templates: []
  tasks:
  - id: AI11-01
    title: تحديد الدرس التالي بكورس AI وتجهيز ملف ملاحظات
    due_date: '2026-11-22'
    estimated_minutes: 15
    status: planned_not_completed
    completed: false
  - id: AI11-02
    title: 'كورس AI: 60 دقيقة تعلم'
    due_date: '2026-11-26'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: AI11-03
    title: 'كورس AI: 60 دقيقة تعلم وتلخيص تطبيق عملي واحد'
    due_date: '2026-11-29'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  life_area: الذكاء الاصطناعي والأثر
  blessed_intention_suggestion: طلب العلم النافع وتوظيف التقنية بما ينفع الناس دون تضليل.
  related_existing_2027_goal_ids: *id004
  legacy_vision_goal_id: V-AI
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M12-AI
  title: الانتظام في كورس AI من ساعتين إلى 4 ساعات أسبوعيًا
  why: أستثمر في تعلم AI تطبيقيًا من دون إطلاق مشروع عميل قبل الاستعداد.
  horizon: monthly
  parent_id: B26-Q4-AI
  previous_goal_id: B26-M11-AI
  start_date: '2026-12-01'
  target_date: '2026-12-31'
  success_criteria: ساعتان أسبوعيًا على الأقل في أسابيع ديسمبر الأربعة، بإجمالي أساسي 8 ساعات، وطموح 16، مع ملاحظة تطبيقية
    واحدة.
  priority: high
  milestones: []
  action_templates: []
  tasks:
  - id: AI12-W1
    title: 'AI — الأسبوع 1: ساعتان من الكورس'
    due_date: '2026-12-06'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  - id: AI12-W2
    title: 'AI — الأسبوع 2: ساعتان من الكورس'
    due_date: '2026-12-13'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  - id: AI12-W3
    title: 'AI — الأسبوع 3: ساعتان من الكورس'
    due_date: '2026-12-20'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  - id: AI12-W4
    title: 'AI — الأسبوع 4: ساعتان من الكورس'
    due_date: '2026-12-27'
    estimated_minutes: 120
    status: planned_not_completed
    completed: false
  - id: AI12-05
    title: توثيق تجربة AI صغيرة مرتبطة بمشكلة من فلكون داخل وقت التعلم أو فلكون، دون ازدواج احتساب
    due_date: '2026-12-30'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: AI12-06
    title: 'اختياري: مراجعة 60 دقيقة لو الوقت يسمح في آخر ديسمبر'
    due_date: '2026-12-31'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  life_area: الذكاء الاصطناعي والأثر
  blessed_intention_suggestion: طلب العلم النافع وتوظيف التقنية بما ينفع الناس دون تضليل.
  related_existing_2027_goal_ids: *id004
  legacy_vision_goal_id: V-AI
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-A-FINANCE
  title: تجهيز الانضباط المالي واختبار أهلية توزيعات فلكون في 2027
  why: أفصل ربح الشركة عن دخلي الشخصي ولا أبني جمعية أو زواجًا على مال غير متاح.
  horizon: annual
  parent_id: V-FINANCE
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.
  milestones: []
  action_templates: []
  life_area: المال والادخار
  blessed_intention_suggestion: الأمانة في الحقوق وحسن تدبير المال والاستغناء بالحلال.
  related_existing_2027_goal_ids: &id005
  - A-FINANCE
  - A-FALCON
  - A-MARRIAGE
  legacy_vision_goal_id: V-FINANCE
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-Q4-FINANCE
  title: مراجعة الدفاتر والسيولة قبل أي توزيع أرباح
  why: أفصل ربح الشركة عن دخلي الشخصي ولا أبني جمعية أو زواجًا على مال غير متاح.
  horizon: quarterly
  parent_id: B26-A-FINANCE
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.
  milestones: []
  action_templates: []
  life_area: المال والادخار
  blessed_intention_suggestion: الأمانة في الحقوق وحسن تدبير المال والاستغناء بالحلال.
  related_existing_2027_goal_ids: *id005
  legacy_vision_goal_id: V-FINANCE
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M11-FINANCE
  title: جمع بيانات فلكون المالية المتفرقة دون التخمين
  why: الدفاتر الجزئية لا تثبت وجود سيولة قابلة للتوزيع.
  horizon: monthly
  parent_id: B26-Q4-FINANCE
  previous_goal_id: null
  start_date: '2026-11-01'
  target_date: '2026-11-30'
  success_criteria: تحديد مصادر البيانات والأشهر الناقصة وتصنيف المصروفات والتحصيلات غير الموثقة.
  priority: maintenance
  milestones: []
  action_templates: []
  tasks:
  - id: FIN11-01
    title: تجميع ملفات البيع والمصروفات والتحصيل الموجودة من آخر 3 شهور
    due_date: '2026-11-29'
    estimated_minutes: 90
    status: planned_not_completed
    completed: false
  - id: FIN11-02
    title: قائمة بالمبالغ الناقصة أو غير الموثقة لمراجعتها لاحقًا
    due_date: '2026-11-30'
    estimated_minutes: 45
    status: planned_not_completed
    completed: false
  life_area: المال والادخار
  blessed_intention_suggestion: الأمانة في الحقوق وحسن تدبير المال والاستغناء بالحلال.
  related_existing_2027_goal_ids: *id005
  legacy_vision_goal_id: V-FINANCE
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M12-FINANCE
  title: إغلاق سجل نوفمبر وديسمبر وإعداد مراجعة سيولة يناير
  why: اختبار التوزيعات يتطلب أرقامًا حقيقية والتزامات تشغيل واحتياطيًا مناسبًا.
  horizon: monthly
  parent_id: B26-Q4-FINANCE
  previous_goal_id: B26-M11-FINANCE
  start_date: '2026-12-01'
  target_date: '2026-12-31'
  success_criteria: ملخص مبيعات/تحصيلات/مصروفات/التزامات/سيولة لشهري نوفمبر وديسمبر مع بيان فجوات التوثيق.
  priority: maintenance
  milestones: []
  action_templates: []
  tasks:
  - id: FIN12-01
    title: تثبيت قالب تسجيل التدفقات النقدية اليومية والمبالغ المستحقة
    due_date: '2026-12-05'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  - id: FIN12-02
    title: مطابقة تحصيلات ومصاريف نوفمبر وتسجيل الفروق
    due_date: '2026-12-15'
    estimated_minutes: 90
    status: planned_not_completed
    completed: false
  - id: FIN12-03
    title: مراجعة حسابات ديسمبر والالتزامات التشغيلية القادمة
    due_date: '2026-12-30'
    estimated_minutes: 90
    status: planned_not_completed
    completed: false
  - id: FIN12-04
    title: إعداد قائمة شروط مراجعة التوزيع في يناير 2027؛ دون إجراء أي صرف
    due_date: '2026-12-31'
    estimated_minutes: 45
    status: planned_not_completed
    completed: false
  life_area: المال والادخار
  blessed_intention_suggestion: الأمانة في الحقوق وحسن تدبير المال والاستغناء بالحلال.
  related_existing_2027_goal_ids: *id005
  legacy_vision_goal_id: V-FINANCE
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-A-FAITH
  title: الثبات على القرآن والعبادات قبل انطلاق 2027
  why: أحفظ مكان العبادة في الجدول حتى مع ضغط الدراسة.
  horizon: annual
  parent_id: V-FAITH
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.
  milestones: []
  action_templates: []
  life_area: الدين والعبادات
  blessed_intention_suggestion: إخلاص العبادة لله وتحسين الخلق والمواظبة بغير تكلف.
  related_existing_2027_goal_ids: &id006
  - A-QURAN
  - A-FIQH
  legacy_vision_goal_id: V-FAITH
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-Q4-FAITH
  title: الحفاظ على أصل العبادات والتزكية أثناء الميد وبعده
  why: أحفظ مكان العبادة في الجدول حتى مع ضغط الدراسة.
  horizon: quarterly
  parent_id: B26-A-FAITH
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.
  milestones: []
  action_templates: []
  life_area: الدين والعبادات
  blessed_intention_suggestion: إخلاص العبادة لله وتحسين الخلق والمواظبة بغير تكلف.
  related_existing_2027_goal_ids: *id006
  legacy_vision_goal_id: V-FAITH
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M11-FAITH
  title: حماية الصلاة والقرآن والمراجعة ودرس الجمعة أثناء الميد
  why: أحافظ على عادتي التعبدية قريبًا من المعتاد حتى في الامتحانات.
  horizon: monthly
  parent_id: B26-Q4-FAITH
  previous_goal_id: null
  start_date: '2026-11-01'
  target_date: '2026-11-30'
  success_criteria: متابعة أسبوعية واقعية للصلاة والأذكار والقرآن ودرس الجمعة وفق الظروف دون منح تقييم للإخلاص.
  priority: protected
  milestones: []
  action_templates: []
  tasks:
  - id: FAITH11-01
    title: 'قرآن يومي: 15 دقيقة على الأقل في اليوم المزدحم مع مراجعة محفوظ سابق'
    due_date: '2026-11-30'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: FAITH11-02
    title: المحافظة على الصلاة والأذكار والسنن بحسب الاستطاعة
    due_date: '2026-11-30'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: FAITH11-03
    title: درس القرآن الجمعة بعد العصر إن كان قائمًا ولا يتعارض مع امتحان لازم
    due_date: '2026-11-27'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: FAITH11-04
    title: مراجعة خُلق واحد أسبوعيًا برفق وصدق
    due_date: '2026-11-30'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  life_area: الدين والعبادات
  blessed_intention_suggestion: إخلاص العبادة لله وتحسين الخلق والمواظبة بغير تكلف.
  related_existing_2027_goal_ids: *id006
  legacy_vision_goal_id: V-FAITH
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M12-FAITH
  title: تثبيت عادة القرآن والفقه والاستعداد لمسار 2027
  why: أدخل يناير وروتين الحفظ والمراجعة والفقه قائم بالفعل.
  horizon: monthly
  parent_id: B26-Q4-FAITH
  previous_goal_id: B26-M11-FAITH
  start_date: '2026-12-01'
  target_date: '2026-12-31'
  success_criteria: قرآن ومراجعة منتظمان وخطة واضحة لكتاب الفقه الميسر ومراجعة أخلاق أسبوعية.
  priority: protected
  milestones: []
  action_templates: []
  tasks:
  - id: FAITH12-01
    title: قرآن يومي 15 دقيقة حد أدنى، وزيادة 30–60 دقيقة عند سعة اليوم
    due_date: '2026-12-31'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: FAITH12-02
    title: تحديد ترتيب أبواب الفقه الميسر وآلية الاختبار بعد كل باب
    due_date: '2026-12-15'
    estimated_minutes: 45
    status: planned_not_completed
    completed: false
  - id: FAITH12-03
    title: الاستمرار في درس الجمعة ومراجعة السلوك الأسبوعية
    due_date: '2026-12-31'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  life_area: الدين والعبادات
  blessed_intention_suggestion: إخلاص العبادة لله وتحسين الخلق والمواظبة بغير تكلف.
  related_existing_2027_goal_ids: *id006
  legacy_vision_goal_id: V-FAITH
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-A-HEALTH
  title: حماية النوم والتعافي من الإصابة خلال نهاية 2026
  why: العبادة والدراسة والعمل تحتاج نومًا حقيقيًا وتعافيًا طبيًا.
  horizon: annual
  parent_id: V-HEALTH
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.
  milestones: []
  action_templates: []
  life_area: الصحة واللياقة
  blessed_intention_suggestion: حفظ الجسد والقدرة على أداء الحقوق والالتزامات.
  related_existing_2027_goal_ids: &id007
  - A-HEALTH
  legacy_vision_goal_id: V-HEALTH
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-Q4-HEALTH
  title: استقرار التعافي والنوم استعدادًا لعام 2027
  why: العبادة والدراسة والعمل تحتاج نومًا حقيقيًا وتعافيًا طبيًا.
  horizon: quarterly
  parent_id: B26-A-HEALTH
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.
  milestones: []
  action_templates: []
  life_area: الصحة واللياقة
  blessed_intention_suggestion: حفظ الجسد والقدرة على أداء الحقوق والالتزامات.
  related_existing_2027_goal_ids: *id007
  legacy_vision_goal_id: V-HEALTH
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M11-HEALTH
  title: حماية 7 ساعات نوم يوميًا واحترام قيود الإصابة أثناء الميد
  why: الإرهاق أو الانتكاسة يضعف المذاكرة والصحة.
  horizon: monthly
  parent_id: B26-Q4-HEALTH
  previous_goal_id: null
  start_date: '2026-11-01'
  target_date: '2026-11-30'
  success_criteria: متابعة النوم الواقعي وتطبيق تعليمات المختص دون بدء تمرين غير مسموح.
  priority: protected
  milestones: []
  action_templates: []
  tasks:
  - id: HEALTH11-01
    title: استهداف 7 ساعات نوم فعلي في اليوم وتدوين المتوسط أسبوعيًا
    due_date: '2026-11-30'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: HEALTH11-02
    title: الامتناع عن العودة للجيم/الملاكمة/الكرة دون سماح طبي
    due_date: '2026-11-30'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  life_area: الصحة واللياقة
  blessed_intention_suggestion: حفظ الجسد والقدرة على أداء الحقوق والالتزامات.
  related_existing_2027_goal_ids: *id007
  legacy_vision_goal_id: V-HEALTH
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M12-HEALTH
  title: استقرار النوم والعودة للحركة المناسبة طبيًا استعدادًا لـ2027
  why: أستعيد اللياقة بتدرج ولا أكرر الإصابة.
  horizon: monthly
  parent_id: B26-Q4-HEALTH
  previous_goal_id: B26-M11-HEALTH
  start_date: '2026-12-01'
  target_date: '2026-12-31'
  success_criteria: نوم فعلي ~7 ساعات، وحركة أو تأهيل وفق التوجيه الطبي فقط.
  priority: protected
  milestones: []
  action_templates: []
  tasks:
  - id: HEALTH12-01
    title: تقييم نمط النوم كل أسبوع وتعديل مواعيد الاستيقاظ تدريجيًا
    due_date: '2026-12-31'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: HEALTH12-02
    title: 'إن سمح الطبيب: نشاط تدريجي؛ وإن لم يسمح فالالتزام بالتعافي'
    due_date: '2026-12-31'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  life_area: الصحة واللياقة
  blessed_intention_suggestion: حفظ الجسد والقدرة على أداء الحقوق والالتزامات.
  related_existing_2027_goal_ids: *id007
  legacy_vision_goal_id: V-HEALTH
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-A-READ
  title: قراءة كتابَي الزواج تمهيدًا لأهداف 2027
  why: أفهم الخطوبة والحياة الأسرية نظريًا وأربط القراءة بالمسؤولية الشخصية.
  horizon: annual
  parent_id: V-READ
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي فقط لأهداف نوفمبر وديسمبر، وليس التزامًا سنويًا جديدًا منفصلًا.
  milestones: []
  action_templates: []
  life_area: القراءة والتعلم
  blessed_intention_suggestion: طلب العلم النافع وبناء وعي يحفظ حقوق الأسرة.
  related_existing_2027_goal_ids: &id008
  - A-READ
  - A-MARRIAGE
  legacy_vision_goal_id: V-READ
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-Q4-READ
  title: بدء الخطوبة الآمنة وإنهاء الكتابين قبل نهاية 2026 إن سمح الحجم والجدول
  why: أفهم الخطوبة والحياة الأسرية نظريًا وأربط القراءة بالمسؤولية الشخصية.
  horizon: quarterly
  parent_id: B26-A-READ
  start_date: '2026-11-01'
  target_date: '2026-12-31'
  previous_goal_id: null
  success_criteria: غلاف تنظيمي يربط شهري نوفمبر وديسمبر تحت الهدف التحضيري لعام 2026.
  milestones: []
  action_templates: []
  life_area: القراءة والتعلم
  blessed_intention_suggestion: طلب العلم النافع وبناء وعي يحفظ حقوق الأسرة.
  related_existing_2027_goal_ids: *id008
  legacy_vision_goal_id: V-READ
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M11-READ
  title: بدء قراءة كتاب الخطوبة الآمنة بعد انتهاء الميد
  why: القراءة المركزة في موضوع الزواج تساعد على اتخاذ قرارات أكثر وعيًا.
  horizon: monthly
  parent_id: B26-Q4-READ
  previous_goal_id: null
  start_date: '2026-11-01'
  target_date: '2026-11-30'
  success_criteria: البدء في الخطوبة الآمنة، وتحديد إجمالي صفحات النسخة الفعلية ثم قراءة نحو 20–30% منها إن أمكن.
  priority: high
  milestones: []
  action_templates: []
  tasks:
  - id: READ11-01
    title: الحصول على نسخة كتاب الخطوبة الآمنة وتدوين عدد صفحات النسخة
    due_date: '2026-11-22'
    estimated_minutes: 15
    status: planned_not_completed
    completed: false
  - id: READ11-02
    title: ثلاث جلسات قراءة 25–35 دقيقة بعد الميد مع ملاحظات
    due_date: '2026-11-29'
    estimated_minutes: 90
    status: planned_not_completed
    completed: false
  - id: READ11-03
    title: حساب خطة الصفحات المتبقية للوصول للنهاية يوم 15 ديسمبر
    due_date: '2026-11-30'
    estimated_minutes: 20
    status: planned_not_completed
    completed: false
  life_area: القراءة والتعلم
  blessed_intention_suggestion: طلب العلم النافع وبناء وعي يحفظ حقوق الأسرة.
  related_existing_2027_goal_ids: *id008
  legacy_vision_goal_id: V-READ
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
- id: B26-M12-READ
  title: إنهاء الخطوبة الآمنة وبيوت مطمئنة وتلخيص الفوائد
  why: أكمل ما بدأت وأحوّل الكتابين إلى مبادئ وأسئلة عملية.
  horizon: monthly
  parent_id: B26-Q4-READ
  previous_goal_id: B26-M11-READ
  start_date: '2026-12-01'
  target_date: '2026-12-31'
  success_criteria: إنهاء الكتابين عند إمكان ذلك بعد التحقق من عدد الصفحات؛ تلخيص أهم الأفكار دون استعجال مخل.
  priority: high
  milestones: []
  action_templates: []
  tasks:
  - id: READ12-01
    title: إتمام الخطوبة الآمنة أو تقييم الصفحات المتبقية حسب النسخة
    due_date: '2026-12-15'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: READ12-02
    title: بدء كتاب بيوت مطمئنة وتحديد عدد صفحاته الفعلي
    due_date: '2026-12-16'
    estimated_minutes: 30
    status: planned_not_completed
    completed: false
  - id: READ12-03
    title: جلسات قراءة 25–35 دقيقة، 4 مرات أسبوعيًا مع توزيع صفحات الكتاب
    due_date: '2026-12-30'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: READ12-04
    title: إنهاء بيوت مطمئنة إن كان حجم النسخة والوقت يسمحان
    due_date: '2026-12-31'
    estimated_minutes: 0
    status: planned_not_completed
    completed: false
  - id: READ12-05
    title: 'كتابة مقارنة مختصرة: 5 فوائد من كل كتاب وما الذي أريد تطبيقه'
    due_date: '2026-12-31'
    estimated_minutes: 60
    status: planned_not_completed
    completed: false
  life_area: القراءة والتعلم
  blessed_intention_suggestion: طلب العلم النافع وبناء وعي يحفظ حقوق الأسرة.
  related_existing_2027_goal_ids: *id008
  legacy_vision_goal_id: V-READ
  source_plan_id: ahmed-lifeos-2026-nov-dec-bridge-v1
  status: planned_not_completed
  completed: false
  initial_progress: 0
  initial_xp: 0
  bridge_2026: true
```
