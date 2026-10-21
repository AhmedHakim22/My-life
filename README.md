# نظام إدارة الحياة والتدريب الشخصي (Personal Life Coach OS)
> **إطار العمل:** YVCF — تطوير المنتجات على 14 مرحلة (من مرحلة 0 إلى مرحلة 13)  
> **المنهجية:** البحث في غيت هب أولاً ← إعادة الاستخدام الذكي ← التكامل الآمن ← بناء الناقص فقط  
> **المنصة المستهدفة:** تطبيق ويب تقدمي يركز على الهاتف أولاً (Mobile-First PWA)  
> **الحالة الراهنة:** اكتمال المراحل 0 و 1 و 2، والتوقف عند بوابة الاعتماد الأولى (**Gate A**) بانتظار موافقة المالك.

---

## 🧭 خريطة التوثيق والمشروع (Documentation Map)

### تقارير المراحل المنجزة (Stages 0–2):
- [`docs/00-project-intake.md`](file:///D:/~/نظام%20حياتي/docs/00-project-intake.md): استيعاب متطلبات المشروع، سياق المستخدم، ونطاق الـ MVP.
- [`docs/01-problem-discovery.md`](file:///D:/~/نظام%20حياتي/docs/01-problem-discovery.md): تفكيك الأسباب الجذرية ومصفوفة المشكلات والحلول السلوكية.
- [`research/github-landscape.md`](file:///D:/~/نظام%20حياتي/research/github-landscape.md): خريطة وتحليل أكثر من 12 مستودع مفتوح المصدر على غيت هب.
- [`research/repository-scorecard.md`](file:///D:/~/نظام%20حياتي/research/repository-scorecard.md): بطاقة التقييم الموزونة (100 نقطة) للمشاريع المرشحة.
- [`research/license-audit.md`](file:///D:/~/نظام%20حياتي/research/license-audit.md): التدقيق القانوني للتراخيص ومنع تلوث الـ Copyleft.
- [`research/security-findings.md`](file:///D:/~/نظام%20حياتي/research/security-findings.md): معايير الخصوصية، أمان البيانات، ومنع تسريب اليوميات.
- [`research/reuse-matrix.md`](file:///D:/~/نظام%20حياتي/research/reuse-matrix.md): مصفوفة إعادة الاستخدام الدقيقة ميزة بميزة.
- [`research/proof-of-concept.md`](file:///D:/~/نظام%20حياتي/research/proof-of-concept.md): أدلة الفحص الميداني والاختبارات التجريبية الحية.
- [`research/final-base-recommendation.md`](file:///D:/~/نظام%20حياتي/research/final-base-recommendation.md): التوصية المعمارية النهائية ونموذج التكلفة الصفرية.

### سجلات الذاكرة الدائمة (Durable Project Memory):
- [`AGENTS.md`](file:///D:/~/نظام%20حياتي/AGENTS.md): التوجيهات الحاكمة لأي وكيل ذكاء اصطناعي يعمل على الكود.
- [`docs/PROJECT_STATE.md`](file:///D:/~/نظام%20حياتي/docs/PROJECT_STATE.md): الحالة الحالية الموثقة والخطوات القادمة.
- [`docs/DECISIONS.md`](file:///D:/~/نظام%20حياتي/docs/DECISIONS.md): القرارات المعمارية والمنتجية المعتمدة.
- [`docs/CHANGELOG.md`](file:///D:/~/نظام%20حياتي/docs/CHANGELOG.md): سجل التغييرات المؤرخة.
- [`docs/ROADMAP.md`](file:///D:/~/نظام%20حياتي/docs/ROADMAP.md): خارطة الطريق والمراحل الـ 14.
- [`docs/KNOWN_ISSUES.md`](file:///D:/~/نظام%20حياتي/docs/KNOWN_ISSUES.md): المشكلات المكتشفة وتتبع حلها.
- [`docs/FEATURE_REGISTRY.md`](file:///D:/~/نظام%20حياتي/docs/FEATURE_REGISTRY.md): سجل الميزات وحالاتها التفصيلية.
- [`docs/INTEGRATION_REGISTRY.md`](file:///D:/~/نظام%20حياتي/docs/INTEGRATION_REGISTRY.md): سجل الحزم والمكتبات الخارجية والواجهات.
- [`OPEN_SOURCE_ATTRIBUTIONS.md`](file:///D:/~/نظام%20حياتي/OPEN_SOURCE_ATTRIBUTIONS.md): حقوق الملكية الفكرية والعزو للمشاريع المفتوحة.

---

## 🛠️ الأساس التقني المعتمد (Recommended Stack - Strategy D)
- **الواجهة الأمامية:** React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui.
- **الهاتف والعمل دون اتصال:** Mobile-First PWA (Workbox Service Worker) + Dexie.js (IndexedDB).
- **المزامنة وقاعدة البيانات:** Supabase PostgreSQL مع RLS مشفر.
- **مواقيت الصلاة:** مكتبة `adhan` (فلكية محلية في القاهرة 100% بدون إنترنت).
- **مراجعات المذاكرة:** خوارزمية `ts-fsrs` للتكرار المتباعد العلمي لمواد النانو.
- **شجرة المهارات:** حزمة `@xyflow/react` للتفاعل البصري اللمسي.
- **استدعاء الكتب والمصادر:** Open Library REST API + YouTube oEmbed مجاناً.
- **التكلفة الشهرية:** **$0.00 / 0 جنيه مصري** (مستضاف على باقات Cloudflare وSupabase المجانية الدائمة).
