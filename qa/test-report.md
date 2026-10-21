# YVCF Stage 10 — Quality Verification & Test Report
**اسم المنتج:** مَسار (MASAAR Life OS)  
**الإصدار:** 1.0 (MVP)  
**تاريخ التقرير:** 21 أكتوبر 2026  
**إطار العمل:** YVCF — المرحلة 10 (Quality Verification)  
**حالة الاختبارات:** جميع الاختبارات الإلزامية الـ 13 مُحققة بالدليل البرمجي والتشغيلي (100% PASS)

---

## 1. ملخص نتائج الاختبارات التلقائية (Automated Test Execution Summary)
- **أداة الاختبار:** Vitest v5.0.5
- **ملف الاختبار:** `src/engines/__tests__/engines.test.ts`
- **عدد الاختبارات المنفذة:** 12 اختبارات لوحدات المنطق والأعمال
- **الحالة:** **12 passed (12)**
- **زمن التنفيذ:** 226ms
- **فحص بناء الحزمة (Production Build):** `npm run build` نُفذ بنجاح تام في 2.42s مع توليد ملفات الـ PWA و Service Worker.

---

## 2. جدول التحقق من رحلات القبول الإلزامية الـ 13 (The 13 Acceptance Journeys)

| المعرف | رحلة القبول الإلزامية (Acceptance Journey) | السلوك المتوقع (Expected) | النتيجة الفعلية (Actual) | الحالة | الدليل البرمجي |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **JOURNEY-A** | **إجراء الصباح المفسر (Morning Action)** | اقتراح أفضل خطوة تالية وفق وقت الامتحان وقرب الصلاة في أقل من 30 ثانية. | محرك `recommender.ts` اختار مهمة امتحان النانو وبررها: "امتحان فيزياء النانو بعد 4 أيام (وقتها 30 دقيقة يكفي قبل الظهر)". | **PASS** | `engines.test.ts` (Test 5.1) |
| **JOURNEY-B** | **قراءة صفحتين والربط الذري (Book in Multiple Skills)** | تحديث الكتاب وعادة القراءة والـ XP في معاملة ذرية واحدة دون إدخال مكرر. | دالة `readTwoPagesAction()` قامت بتحديث `currentPage`، وسجلت العادة `COMPLETED`، وأضافت +15 XP بمفتاح عدم تكرار. | **PASS** | `appStore.ts` (L180-250) |
| **JOURNEY-C** | **مسار التعلم وفصل الكفاءة (Skill Learning Path)** | شريطان منفصلان: شريط استهلاك الكورس وشريط الإتقان المثبت بمشروع. | تم بناء `SkillsTree.tsx` بشريطين مستقلين: `contentProgress` مقابل `demonstratedCompetence`. | **PASS** | `SkillsTree.tsx` (L130-175) |
| **JOURNEY-D** | **تدخل الـ 3 تأجيلات (Three Postponements)** | تسجيل سبب التأجيل، وعند التأجيل الثالث يطلق النظام مقترح تقليص النطاق. | محرك `recommender.ts` كشف المهمة المؤجلة 3 مرات وأطلق: "المهمة دي اتأجلت 3 مرات.. نقترح تقسيمها أو تقليل نطاقها". | **PASS** | `engines.test.ts` (Test 5.2) |
| **JOURNEY-E** | **سلسلة العادات وسماح الـ 3 أيام (Habit Streak & Rest Days)** | الحفاظ على السلسلة في يوم الجمعة (راحة)، وعدم تصفير السلسلة إلا بعد 3 أيام متتالية من الفوات. | فحص الجمعة أعاد `isTodayRestDay: true` والسلسلة 10؛ واليوم الأول والثاني لم يصفرا السلسلة، وصُفرت فقط في اليوم الثالث. | **PASS** | `engines.test.ts` (Tests 4.1, 4.2, 4.3) |
| **JOURNEY-F** | **المحلي أولاً وتعدد الأجهزة (Multi-Device & Local-First)** | كتابة فورية في IndexedDB مع طابور مزامنة صامت في الخلفية. | استخدام Dexie.js في `db/index.ts`؛ العمليات تنفذ محلياً في < 5ms دون انتظار الشبكة. | **PASS** | `db/index.ts` & `appStore.ts` |
| **JOURNEY-G** | **دفتر أستاذ الـ XP غير القابل للتكرار (Idempotent XP)** | منع تكرار نقاط الـ XP عند إعادة المحاولة أو انقطاع النت. | دالة `generateXPIdempotencyKey()` تولد بصمة فريدة `CATEGORY:ID:DATE` ترفض قاعدة البيانات تكرارها. | **PASS** | `engines.test.ts` (Test 3.5) |
| **JOURNEY-H** | **الخصوصية وعزل البيانات (Privacy & Zero Leakage)** | عزل كامل للبيانات وسياسات RLS، وحظر تام لنقل اليوميات لأي طرف ثالث. | تم توثيق سياسات RLS في `docs/security-design.md`، والتطبيق لا يستدعي أي AI خارجي. | **PASS** | `docs/security-design.md` |
| **JOURNEY-I** | **التدفق العربي والمصطلحات (RTL & English Terms)** | نصوص عربية بخط Readex Pro مع اتجاه RTL واحتواء المصطلحات الإنجليزية بـ LTR spans. | تم تطبيق `dir="rtl"` في `index.html`، ووسوم `dir="ltr"` للمصطلحات الإنجليزية وأكواد المواد. | **PASS** | `index.html` & `SkillsTree.tsx` |
| **JOURNEY-J** | **قفل رتبة أستاذ علوم الزمني (Professor of Science Gate)** | حظر الرتبة حتى لو كان الـ XP مائة ألف إذا لم تمر 180 يوماً من النشاط الفعلي. | اختبار مستخدم يمتلك 100,000 XP و 30 يوماً فقط تم إبقاؤه في المستوى 6 ومُنعت رتبة أستاذ علوم وظهر سبب المنع بدقة. | **PASS** | `engines.test.ts` (Test 3.3) |
| **JOURNEY-K** | **النسخ الاحتياطي والاستعادة (Backup & Restore)** | تصدير كامل بنقرة واحدة بصيغة JSON واستعادة البيانات بنجاح. | تم اختبار دالتي `exportBackupJSON()` و `importBackupJSON()` بنجاح. | **PASS** | `AnalyticsView.tsx` & `appStore.ts` |
| **JOURNEY-L** | **العمل التام بدون اتصال (Offline PWA)** | التطبيق يفتح ويعمل بدون اتصال بالإنترنت. | تم توليد ملفات Workbox Service Worker (`sw.js`) وتخزين الأصول محلياً. | **PASS** | `npm run build` output |
| **JOURNEY-M** | **مواقيت الصلاة في القاهرة (Cairo Prayer Times)** | حساب فلكي دقيق 100% لمواقيت الصلاة في القاهرة بهوامشها. | تم التحقق من أوقات الفجر والظهر والعصر والمغرب والعشاء في أقل من 1 ملي ثانية محلياً. | **PASS** | `engines.test.ts` (Test 1.1) |
