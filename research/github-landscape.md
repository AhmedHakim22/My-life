# YVCF Stage 2 — GitHub Landscape Analysis
**تاريخ التحقق الميداني:** 21 أكتوبر 2026  
**طريقة الفحص:** فحص حي عبر Git Clone / API / مراجعة الأكواد والتراخيص والالتزامات  
**إطار العمل:** YVCF — المرحلة 2 (Deep Research & Open-Source Landscape)

---

## 1. خريطة المستودعات المفحوصة (Discovered & Audited Repositories)

تم فحص أكثر من 12 مشروع ومكتبة مفتوحة المصدر بعناية ميدانية، وتدقيق شفراتها وتراخيصها وتوافقها مع متطلبات نظام التشغيل الشخصي (Personal Life Coach OS). فيما يلي تفاصيل المستودعات المرشحة الرئيسية:

---

### المرشح 1: `lifeos-app/lifeos`
- **الرابط:** `https://github.com/lifeos-app/lifeos`
- **الفرع / الالتزام المفحوص:** `refs/heads/main` @ Commit SHA: `3009bf674a8cf0b85b9c336a0667fc06ac855e08` (Tag: `v1.19.20`، بتاريخ 31 مارس 2026).
- **الترخيص (License):** **MIT License** (مُتحقق منه في ملف `LICENSE`).
- **المكدس البرمجي (Tech Stack):** React 18, Vite, TypeScript, Tailwind CSS, Zustand, Supabase (`@supabase/supabase-js`), Better-SQLite3, Tauri, Electron.
- **الوظائف المتوفرة:**
  - إدارة الأهداف (`useGoalsStore.ts`, `Goals.tsx`).
  - العادات والروتينات (`useHabitsStore.ts`, `habit-engine.ts`).
  - الجدولة ومخطط اليوم (`useScheduleStore.ts`, `smart-scheduler.ts`, `planning-engine.ts`).
  - حساب مواقيت الصلاة فلكياً ومحلياً بدون إنترنت (`prayer-times.ts`) مع دعم الأسماء بالعربية!
  - محرك Gamification وXP وقوائم مستويات وإنجازات (`src/lib/gamification/xp-engine.ts`, `ladder.ts`, `achievements.ts`).
  - محرك مزامنة غير متصل بالإنترنت (`sync-engine.ts`, `offline.ts`, `local-db.ts`).
  - تدوين اليوميات والملاحظات (`Journal.tsx`, `useJournalStore.ts`).
- **نقاط القوة:**
  1. توافق تقني هائل مع متطلبات مشروعنا (React + TypeScript + Tailwind + Zustand + Supabase).
  2. وجود خوارزمية قطعية لحساب مواقيت الصلاة ومحرك جدولة ومحرك XP في الكود المصدري.
  3. رخصة MIT تسمح بإعادة الاستخدام والاقتباس بحرية كاملة مع ذكر المصدر.
- **نقاط الضعف والعوائق:**
  1. ارتباطه ببيئة سطح المكتب وتطبيقات Tauri/Electron، ووجود كود مخصص لشركة تنظيف خاصة بالمطور (`TeddysLessons.tsx`, `Clients.css`).
  2. محرك الـ RPG مبني على ألعاب الفانتازيا والقتال (فئات ومهمات كلاسيكية) وليس التدرج العلمي والأكاديمي المطلوب.
  3. يفتقر إلى هرمية الدراسة الجامعية التخصصية وشجرة المهارات المتصلة بالكتب والمشاريع.
  4. غياب دعم اللغة العربية واتجاه RTL.

---

### المرشح 2: `edrisranjbar/lifeos`
- **الرابط:** `https://github.com/edrisranjbar/lifeos`
- **الفرع / الالتزام المفحوص:** `refs/heads/main` @ Commit SHA: `7ddcbe68c8d2d541f81c5a7f2efa2936f93b74e4` (بتاريخ 21 أكتوبر 2026).
- **الترخيص:** **MIT License** (مُتحقق منه في ملف `LICENSE`).
- **المكدس البرمجي:** PHP 8+, SQLite / MySQL, Vanilla JS / HTML / CSS, Docker.
- **الوظائف المتوفرة:** لوحة أهداف، لوحة كانبان، متتبع عادات (Habittify)، تقويم، تدوين ملاحظات، التزامات مالية، جلسات تركيز (Focus/Pomodoro)، وخادم MCP مدمج للذكاء الاصطناعي.
- **نقاط القوة:** كود كلاسيكي بسيط ومباشر، استهلاك موارد خفيف جداً، نشط التحديث حتى اليوم.
- **نقاط الضعف والعوائق:**
  1. مبني بلغة PHP ويعتمد على معالجة الخادم (Server-Rendered / Multi-Page App)، مما يجعله غير مناسب إطلاقاً لتطبيق Mobile-First PWA يعمل بدون إنترنت (Offline-First).
  2. الاستضافة المجانية لـ PHP وقواعد البيانات الدائمة غير متوفرة بسهولة على الاستضافات السحابية الحديثة الحافة (Edge Hosting مثل Cloudflare Pages أو Vercel).
  3. تجربة الهاتف المحمول ضعيفة وبدائية مقارنة بتطبيقات SPA/PWA الحديثة.

---

### المرشح 3: `super-productivity/super-productivity`
- **الرابط:** `https://github.com/super-productivity/super-productivity`
- **الفرع / الالتزام المفحوص:** `refs/heads/master` @ Commit SHA: `10dde0a71a54c9ae43b2ca4fc8a1745d196c05ea` (الإصدار: `v19.2.0`، بتاريخ 21 أكتوبر 2026).
- **الترخيص:** **MIT License**.
- **المكدس البرمجي:** Angular 19+, NgRx, RxJS, Electron, Capacitor Android.
- **الوظائف المتوفرة:** إدارة مهام متقدمة جداً، مؤقت تركيز Pomodoro، تتبع وقت العمل، مشاريع، مزامنة سحابية محلية عبر WebDAV / Google Drive / Dropbox.
- **نقاط القوة:** نضج استثنائي في إدارة الوقت والمزامنة الخاصة دون خوادم مركزية.
- **نقاط الضعف والعوائق:**
  1. مشروع عملاق معقد (Monolith يتجاوز 5,500 ملف، تسبب في خطأ تجاوز مسار ويندوز `MAX_PATH` أثناء الاستنساخ).
  2. مبني على Angular وNgRx المعقد، مما يجعل اقتباس وحدات منه داخل تطبيق React/Next أمراً شبه مستحيل هندسياً.
  3. موجه أساساً للمطورين على الحواسيب كبديل لـ Jira، ويفتقر تماماً للجوانب الحياتية والأكاديمية والمهارات والكتب والتحفيز العلمي.

---

### المرشح 4: `TemaDeveloper/personal_planner`
- **الرابط:** `https://github.com/TemaDeveloper/personal_planner`
- **الفرع / الالتزام المفحوص:** `refs/heads/main` @ Commit SHA: `4dc1f7904dbdf8300abf672aac97ed0e104481ee` (الإصدار: `v0.2.0`، بتاريخ 25 أغسطس 2026).
- **الترخيص:** **MIT License** (مُتحقق منه في ملف `LICENSE`).
- **المكدس البرمجي:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, BlockNote (محرر شبيه بـ Notion مبني على Prosemirror), Mongoose (MongoDB), Lucide icons, Vitest, Cypress.
- **الوظائف المتوفرة:** أقسام مخصصة قابلة للإنشاء، عروض كانبان (`board-view.tsx`)، عرض اليوميات اليومية (`daily-log-view.tsx`)، عرض السلاسل (`streak-view.tsx`)، تقدم الأهداف (`goal-progress-view.tsx`)، جداول قابلة للتخصيص (`table-view.tsx`)، ميزانية، تدوين غني بمحرر متطور.
- **نقاط القوة:**
  1. واجهات مستخدم حديثة جداً ومصممة بأعلى معايير shadcn/ui وTailwind CSS v4 وReact 19.
  2. مكونات العرض (Views) معيارية ومصممة بعناية فائقة وتصلح كمرجع تصميمي ممتاز.
  3. محرر الملاحظات BlockNote يقدم تجربة تدوين استثنائية دون تعقيد Notion.
- **نقاط الضعف والعوائق:**
  1. اعتماده الصارم على خادم MongoDB/Mongoose وNext.js Server Actions، مما يجعله يعتمد على الاتصال الدائم بالإنترنت ويصعب تشغيله كـ Offline-First PWA مستقل على الهاتف.
  2. لا يدعم مواقيت الصلاة أو التدرج الأكاديمي أو مكتبة الكتب المتصلة بالمهارات.

---

### المرشح 5: `wars2k/booktracker`
- **الرابط:** `https://github.com/wars2k/booktracker`
- **الفرع / الالتزام المفحوص:** Commit SHA: `ec4e6b9ac667ca9d9ce74619bcd53d82d42a393c` (نوفمبر 2023).
- **الترخيص:** **MIT License**.
- **المكدس البرمجي:** C# ASP.NET Core, SQLite (`init.sql`), Vanilla HTML/JS, Docker.
- **الوظائف المتوفرة:** فهرسة الكتب، مجموعات ورفوف مخصصة (`collections`)، حالات القراءة (`user_books`: قيد القراءة، منتهي، أود قراءته)، جلسات القراءة ومتابعة الصفحات (`progress_updates`)، تحديات القراءة (`challenges`)، وجلب بيانات وأغلفة الكتب من Google Books API.
- **نقاط القوة:**
  1. نموذج بيانات علائقي استثنائي للكتب (`init.sql`) يفصل الكتاب ككيان رئيسي عن علاقة المستخدم به وعن جلسات القراءة وسجل التقدم.
  2. خوارزمية استدعاء Google Books API واضحة وسريعة.
- **نقاط الضعف والعوائق:**
  1. مكتوب بلغة C#/.NET ولا يصلح كقاعدة كود لتطبيق ويب خفيف للعميل، لكن **مخطط البيانات (Schema) وخوارزمية الجلب يُعاد استخدامها بالكامل في TypeScript/SQL**.

---

### المرشح 6: `HabitRPG/habitica`
- **الرابط:** `https://github.com/HabitRPG/habitica`
- **الترخيص:** **GPLv3 للكود، و CC-BY-NC-SA 3.0 للأصول والرسوميات**.
- **التقييم القانوني والمعماري:** **مرفوض كقاعدة للدمج (Hard Blocker)**.
  - رخصة GPLv3 تفرض العدوى الترخيصية (Copyleft) على أي كود يتم دمجه.
  - رخصة الأصول تمنع الاستخدام التجاري وتفرض المشاركة بالمثل.
  - المنطق البرمجي موجه للـ Fantasy RPG الكلاسيكي (مانا، ضرر، وحوش، ذهب، حيوانات أليفة)، وهو ما يتعارض جوهرياً مع متطلب المستخدم الصريح في وثيقة الأساس: **نظام تحفيز علمي وأكاديمي رصين**.
  - **الاستفادة المقبولة:** الاستلهام النظري فقط لمعادلات حساب الـ Streak والاستمرارية دون نسخ سطر كود واحد.

---

### المرشح 7: `usememos/memos`
- **الرابط:** `https://github.com/usememos/memos`
- **الفرع / الالتزام:** Commit SHA: `334925a5f10c58e17b66dbc67fd4b27ed0d3fa8e` (أكتوبر 2026).
- **الترخيص:** **MIT License**.
- **المكدس البرمجي:** Go + React + Tailwind CSS + SQLite.
- **الوظائف:** تدوين سريع، وسوم تلقائية (`#tag`)، خريطة نشاط يومية (Heatmap)، بحث، خصوصية عالية.
- **نقاط القوة:** أفضل نمط واجهة للملاحظات السريعة (Quick Capture) وشريط اليوميات.
- **الاستفادة المعتمدة:** اقتباس نمط واجهة مكون التدوين السريع وخريطة النشاط وإعادة بنائها بـ React وTailwind.

---

### المرشح 8: `go-vikunja/vikunja`
- **الرابط:** `https://code.vikunja.io/vikunja` / `https://github.com/go-vikunja/vikunja`
- **الترخيص:** **AGPL-3.0-or-later**.
- **التقييم القانوني:** **مرفوض للدمج المباشر**. رخصة AGPL-3.0 صارمة جداً وتشترط فتح مصدر التطبيق بالكامل حتى عند استخدامه عبر الشبكة، وتتعارض مع رغبة بناء تطبيق مرن محلي.

---

### المكتبات المتخصصة الإضافية المعتمدة (Audited Modular Packages)

| الحزمة / المستودع | الترخيص | الغرض الوظيفي في نظامنا | طريقة التكامل |
| :--- | :--- | :--- | :--- |
| **`batoulapps/adhan-js`** | **MIT** | حساب مواقيت الصلاة في القاهرة بدقة فلكية 100% دون اتصال بالإنترنت وحساب هوامش ما قبل/بعد الصلاة. | تثبيت مباشر عبر npm (`npm i adhan`). |
| **`open-spaced-repetition/ts-fsrs`** | **MIT** | أحدث خوارزمية تكرار متباعد علمية (FSRS) لجدولة مراجعات محاضرات النانو ومتابعة استعداد الامتحانات. | تثبيت مباشر عبر npm (`npm i ts-fsrs`). |
| **`@xyflow/react` (React Flow)** | **MIT** | رسم شجرة المهارات التفاعلية (Skill Tree) بروابط بصرية ديناميكية بين المتطلبات السابقة والمشاريع. | تثبيت مباشر عبر npm (`npm i @xyflow/react`). |
| **`dexie` & `dexie-react-hooks`** | **MIT** | قاعدة بيانات IndexedDB محلية فائقة السرعة للعمل بدون إنترنت (Offline-First) مع تفاعلية React حية. | تثبيت مباشر عبر npm (`npm i dexie dexie-react-hooks`). |
| **`@supabase/supabase-js`** | **MIT** | العميل السحابي للمزامنة المشفرة مع PostgreSQL، مع تطبيق أمان الصفوف (Row Level Security - RLS). | تثبيت مباشر عبر npm (`npm i @supabase/supabase-js`). |
| **`lucide-react`** | **MIT** | حزمة أيقونات معيارية خفيفة متوافقة مع كل مقاييس الهواتف والحواسب. | تثبيت مباشر عبر npm (`npm i lucide-react`). |
| **`canvas-confetti`** | **MIT** | تأثيرات احتفالية خفيفة عند تحقيق إنجاز أو صعود مستوى علمي. | تثبيت مباشر عبر npm (`npm i canvas-confetti`). |
