// ============================================================================
// Ahmed LifeOS Books Library Data (181 Books)
// Source: LifeOS_Library_Codex_Ready.md
// Generated automatically - Idempotent, zero duplicate risk, 0 XP baseline
// ============================================================================

export interface RawBookItem {
  id: string;
  title: string;
  author: string;
  categoryId: string;
  subcategory: string;
  level: string;
  priority: string;
  note?: string | null;
}

export interface BookCategoryDef {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const BOOK_CATEGORIES: Record<string, BookCategoryDef> = {
  'REL-01': {
    id: 'REL-01',
    name: 'القرآن والتزكية',
    description: 'تدبر القرآن، الرقائق، تزكية النفس، الأخلاق والتربية الإيمانية',
    color: '#10b981'
  },
  'REL-02': {
    id: 'REL-02',
    name: 'علوم الشريعة',
    description: 'الفقه، العقيدة، الحديث، السيرة، التفسير، أصول الفقه',
    color: '#14b8a6'
  },
  'THK-01': {
    id: 'THK-01',
    name: 'الفكر والحضارة الإسلامية',
    description: 'الفكر الإسلامي، المناظرات، الحضارة، التاريخ، الدراسات الفكرية',
    color: '#06b6d4'
  },
  'KNOW-01': {
    id: 'KNOW-01',
    name: 'الثقافة العامة ومراجعات الكتب',
    description: 'عروض الكتب، القراءات النقدية، المعارف المتنوعة وعبر التخصصات',
    color: '#8b5cf6'
  },
  'SCI-01': {
    id: 'SCI-01',
    name: 'العلوم والفيزياء',
    description: 'تبسيط العلوم الطبيعية، الفيزياء، الفلك والعلوم الأساسية',
    color: '#38bdf8'
  },
  'PSY-01': {
    id: 'PSY-01',
    name: 'علم النفس والعلاقات',
    description: 'علم النفس، العلاقات، الصدمات، الصحة النفسية',
    color: '#f43f5e'
  },
  'DEV-01': {
    id: 'DEV-01',
    name: 'تطوير الذات والإنتاجية',
    description: 'العادات، التركيز، إدارة الوقت، مهارات التفكير، النوم',
    color: '#f59e0b'
  },
  'BUS-01': {
    id: 'BUS-01',
    name: 'المال والأعمال',
    description: 'المال، الثقافة المالية، الأعمال',
    color: '#eab308'
  },
  'LIT-01': {
    id: 'LIT-01',
    name: 'اللغة والأدب والشعر',
    description: 'النثر، التراث الأدبي، البيان، الشعر',
    color: '#ec4899'
  },
  'NOV-01': {
    id: 'NOV-01',
    name: 'الروايات',
    description: 'الرواية العربية، الرواية المترجمة',
    color: '#6366f1'
  },
  'UNCATEGORIZED': {
    id: 'UNCATEGORIZED',
    name: 'غير مصنف',
    description: 'للكتب القديمة التي لم يُحدَّد لها تصنيف',
    color: '#94a3b8'
  }
};

export const AHMED_BOOKS_181_DATA: RawBookItem[] = [
  {
    "id": "BK-AFC5F1E3C4",
    "title": "فاتتني صلاة",
    "author": "إسلام جمال",
    "categoryId": "REL-01",
    "subcategory": "عبادة وصلاة",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-BC9C2E3ECE",
    "title": "لأنك الله — الجزء الأول",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "أسماء الله الحسنى",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-C994AA18A9",
    "title": "لأنك الله — الجزء الثاني",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "أسماء الله الحسنى",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-FCA61A467E",
    "title": "معجزات الذكر",
    "author": "أحمد حسني",
    "categoryId": "REL-01",
    "subcategory": "ذكر وعبادة",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "راجع المؤلف والطبعة قبل الاقتناء"
  },
  {
    "id": "BK-DEF87C14C3",
    "title": "أول مرة أتدبر القرآن",
    "author": "عادل محمد خليل",
    "categoryId": "REL-01",
    "subcategory": "تدبر القرآن",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-A75EB9542A",
    "title": "المشوق إلى القرآن",
    "author": "عمرو الشرقاوي",
    "categoryId": "REL-01",
    "subcategory": "تدبر القرآن",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-C69CB0496E",
    "title": "الطريق إلى القرآن",
    "author": "إبراهيم السكران",
    "categoryId": "REL-01",
    "subcategory": "القرآن والتزكية",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-85473D3A60",
    "title": "رقائق القرآن",
    "author": "إبراهيم السكران",
    "categoryId": "REL-01",
    "subcategory": "القرآن والتزكية",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-105188846B",
    "title": "مجموع نسائم القرآن",
    "author": "إبراهيم السكران",
    "categoryId": "REL-01",
    "subcategory": "القرآن والتزكية",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-4F74148688",
    "title": "خلق المسلم",
    "author": "محمد الغزالي",
    "categoryId": "REL-01",
    "subcategory": "تزكية وأخلاق",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-0CC0DBFA60",
    "title": "جدد حياتك",
    "author": "محمد الغزالي",
    "categoryId": "REL-01",
    "subcategory": "تزكية وأخلاق",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-58255EEBC8",
    "title": "فن الذكر والدعاء",
    "author": "محمد الغزالي",
    "categoryId": "REL-01",
    "subcategory": "تزكية وأخلاق",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-D10B80BDDE",
    "title": "الجانب العاطفي في الإسلام",
    "author": "محمد الغزالي",
    "categoryId": "REL-01",
    "subcategory": "تزكية وأخلاق",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-AE1A590BB0",
    "title": "الداء والدواء",
    "author": "ابن قيم الجوزية",
    "categoryId": "REL-01",
    "subcategory": "تزكية النفس",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-C3B93A06D6",
    "title": "نظرية الصباح",
    "author": "هدى عبد الرحمن النمر",
    "categoryId": "REL-01",
    "subcategory": "تربية وتزكية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-51CC2C6DF2",
    "title": "الأسئلة الأربعة لضبط بوصلتك في الحياة",
    "author": "هدى عبد الرحمن النمر",
    "categoryId": "REL-01",
    "subcategory": "تربية وتزكية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-EAD64420D2",
    "title": "سباق نحو الجنان",
    "author": "خالد أبو شادي",
    "categoryId": "REL-01",
    "subcategory": "رقائق وعمل صالح",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-B5789151FF",
    "title": "صفقات رابحة",
    "author": "خالد أبو شادي",
    "categoryId": "REL-01",
    "subcategory": "رقائق وعمل صالح",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-C9176B71C0",
    "title": "جرعات الدواء",
    "author": "خالد أبو شادي",
    "categoryId": "REL-01",
    "subcategory": "رقائق وعمل صالح",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-ED3B122298",
    "title": "مع الله",
    "author": "سلمان العودة",
    "categoryId": "REL-01",
    "subcategory": "تربية وسير",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-4DEFFA3759",
    "title": "مع المصطفى",
    "author": "سلمان العودة",
    "categoryId": "REL-01",
    "subcategory": "تربية وسير",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-997DE4D2A3",
    "title": "مع الأئمة",
    "author": "سلمان العودة",
    "categoryId": "REL-01",
    "subcategory": "تربية وسير",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-3AF88783B9",
    "title": "بناتي",
    "author": "سلمان العودة",
    "categoryId": "REL-01",
    "subcategory": "تربية وسير",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-D213F70E7D",
    "title": "خمسون شمعة",
    "author": "عبد الكريم بكار",
    "categoryId": "REL-01",
    "subcategory": "تربية وفكر",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-EA72ECB2CA",
    "title": "وهي هكذا",
    "author": "عبد الكريم بكار",
    "categoryId": "REL-01",
    "subcategory": "تربية وفكر",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-CAEFE31B61",
    "title": "العيش في الزمن الصعب",
    "author": "عبد الكريم بكار",
    "categoryId": "REL-01",
    "subcategory": "تربية وفكر",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-FC1CD5667C",
    "title": "مهذب مدارج السالكين",
    "author": "صالح الشامي",
    "categoryId": "REL-01",
    "subcategory": "تزكية وسلوك",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-EDCEFF527A",
    "title": "ميثاق العهد",
    "author": "فريد الأنصاري",
    "categoryId": "REL-01",
    "subcategory": "تربية وفكر إسلامي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "عنوان «التوحيد والوساطة» يحتاج مراجعة الصياغة الكاملة"
  },
  {
    "id": "BK-FD2BBE2773",
    "title": "الفطرية",
    "author": "فريد الأنصاري",
    "categoryId": "REL-01",
    "subcategory": "تربية وفكر إسلامي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "عنوان «التوحيد والوساطة» يحتاج مراجعة الصياغة الكاملة"
  },
  {
    "id": "BK-16D5EF94A1",
    "title": "التوحيد والوساطة",
    "author": "فريد الأنصاري",
    "categoryId": "REL-01",
    "subcategory": "تربية وفكر إسلامي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "عنوان «التوحيد والوساطة» يحتاج مراجعة الصياغة الكاملة"
  },
  {
    "id": "BK-F24D082F55",
    "title": "شخصية المسلم",
    "author": "محمد علي الهاشمي",
    "categoryId": "REL-01",
    "subcategory": "أخلاق وتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-DD369AA671",
    "title": "شخصية المرأة المسلمة",
    "author": "محمد علي الهاشمي",
    "categoryId": "REL-01",
    "subcategory": "أخلاق وتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-AD47863E38",
    "title": "صور من حياة الصحابة",
    "author": "عبد الرحمن رأفت الباشا",
    "categoryId": "REL-01",
    "subcategory": "سير وتربية",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-3F24D3D5B7",
    "title": "صور من حياة التابعين",
    "author": "عبد الرحمن رأفت الباشا",
    "categoryId": "REL-01",
    "subcategory": "سير وتربية",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-F4EA3F4BB3",
    "title": "رسائل من القرآن",
    "author": "أدهم شرقاوي",
    "categoryId": "REL-01",
    "subcategory": "أدب إيماني",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "سلسلة رسائل؛ تم تفسير الترشيح العام بأنها هذه السلسلة على سبيل الترجيح"
  },
  {
    "id": "BK-DFFC4B35FC",
    "title": "رسائل من النبي ﷺ",
    "author": "أدهم شرقاوي",
    "categoryId": "REL-01",
    "subcategory": "أدب إيماني",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "سلسلة رسائل؛ تم تفسير الترشيح العام بأنها هذه السلسلة على سبيل الترجيح"
  },
  {
    "id": "BK-DE76C16545",
    "title": "رسائل من الصحابة",
    "author": "أدهم شرقاوي",
    "categoryId": "REL-01",
    "subcategory": "أدب إيماني",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "سلسلة رسائل؛ تم تفسير الترشيح العام بأنها هذه السلسلة على سبيل الترجيح"
  },
  {
    "id": "BK-537EDBC954",
    "title": "رسائل من التابعين",
    "author": "أدهم شرقاوي",
    "categoryId": "REL-01",
    "subcategory": "أدب إيماني",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "سلسلة رسائل؛ تم تفسير الترشيح العام بأنها هذه السلسلة على سبيل الترجيح"
  },
  {
    "id": "BK-E534D9BB79",
    "title": "رسائل من عمر بن الخطاب",
    "author": "أدهم شرقاوي",
    "categoryId": "REL-01",
    "subcategory": "أدب إيماني",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "سلسلة رسائل؛ تم تفسير الترشيح العام بأنها هذه السلسلة على سبيل الترجيح"
  },
  {
    "id": "BK-22D2340A41",
    "title": "الرجل النبيل",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "السيرة والتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-FF491A93AE",
    "title": "حلية الوقار",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "السيرة والتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-95156FF49E",
    "title": "سوار أمي",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "السيرة والتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-501669E90F",
    "title": "إلى الظل: قوانين للحياة",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "السيرة والتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-7DA9B3F518",
    "title": "عبق وأيام",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "السيرة والتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-3DAD534688",
    "title": "أعمق من الكلمة: آفاق حوارية",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "السيرة والتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-65A0888E52",
    "title": "يوسفيات",
    "author": "علي بن جابر الفيفي",
    "categoryId": "REL-01",
    "subcategory": "السيرة والتربية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-DDEB75C449",
    "title": "يوميات قرآنية",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-A678F6A840",
    "title": "دليل صحبة سورة البقرة",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-818298E043",
    "title": "دليل صحبة سورة آل عمران",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-DD7C6F641B",
    "title": "دليل صحبة الزهراوين",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-B2CE1167B2",
    "title": "دليل صحبة العشر الأخير",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-C94A9CD834",
    "title": "دليل صحبة سور يس إلى الحديد",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-A09A557B30",
    "title": "أيها الصديق",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-4606BBA4DF",
    "title": "مَثاني",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-28B8E77BD5",
    "title": "جُدد بيض في صحبة الكتاب المجيد",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-A544632AD5",
    "title": "التذوق القرآني",
    "author": "مركز آيات",
    "categoryId": "REL-01",
    "subcategory": "تدبر وبرامج قرآنية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "مركز آيات جهة ناشرة لا مؤلف فردي؛ بعض الإصدارات للأطفال أو للمربين"
  },
  {
    "id": "BK-3852AA65F3",
    "title": "معاني الأذكار",
    "author": "محمد صالح المنجد",
    "categoryId": "REL-01",
    "subcategory": "الأذكار ومعانيها",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": "شرح معاني الأذكار؛ يختلف عن كتاب الأذكار للنووي؛ صفحة/عدد صفحات مختلف بحسب الطبعة"
  },
  {
    "id": "BK-F0C2CBEE13",
    "title": "الفقه الميسر",
    "author": "نخبة من العلماء",
    "categoryId": "REL-02",
    "subcategory": "فقه",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-0A566B9452",
    "title": "200 سؤال وجواب في العقيدة",
    "author": "حافظ أحمد حكمي",
    "categoryId": "REL-02",
    "subcategory": "عقيدة",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-E4A74840B2",
    "title": "العقيدة الطحاوية",
    "author": "أبو جعفر الطحاوي",
    "categoryId": "REL-02",
    "subcategory": "عقيدة",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": "القراءة مع شرح معتبر مناسبة أكثر"
  },
  {
    "id": "BK-FA5D214C7E",
    "title": "العقيدة في ضوء الكتاب والسنة",
    "author": "عمر الأشقر",
    "categoryId": "REL-02",
    "subcategory": "عقيدة",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-8000D9CC6F",
    "title": "شرح الأربعين النووية",
    "author": "محمد بن صالح العثيمين",
    "categoryId": "REL-02",
    "subcategory": "حديث وشروح",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-009C17F63C",
    "title": "شرح رياض الصالحين",
    "author": "محمد بن صالح العثيمين",
    "categoryId": "REL-02",
    "subcategory": "حديث وشروح",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-5DB1C9318F",
    "title": "صحيح البخاري",
    "author": "الإمام البخاري",
    "categoryId": "REL-02",
    "subcategory": "الحديث النبوي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "كتاب مرجعي؛ يفضل قراءته مع شرح"
  },
  {
    "id": "BK-13585EBDCD",
    "title": "صحيح مسلم",
    "author": "الإمام مسلم",
    "categoryId": "REL-02",
    "subcategory": "الحديث النبوي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "كتاب مرجعي؛ يفضل قراءته مع شرح"
  },
  {
    "id": "BK-63B293B9F4",
    "title": "كيف عاملهم صلى الله عليه وسلم",
    "author": "محمد صالح المنجد",
    "categoryId": "REL-02",
    "subcategory": "سيرة وأخلاق",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-3305D31765",
    "title": "السيرة النبوية",
    "author": "علي الصلابي",
    "categoryId": "REL-02",
    "subcategory": "السيرة",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-7711DA51FF",
    "title": "فقه السيرة",
    "author": "محمد الغزالي",
    "categoryId": "REL-02",
    "subcategory": "السيرة",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-64AAD733A7",
    "title": "التفسير الميسر",
    "author": "مجموعة من العلماء",
    "categoryId": "REL-02",
    "subcategory": "التفسير",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-8411F42882",
    "title": "المختصر في التفسير",
    "author": "مركز تفسير للدراسات القرآنية",
    "categoryId": "REL-02",
    "subcategory": "التفسير",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-54E5F6F411",
    "title": "تفسير السعدي",
    "author": "عبد الرحمن السعدي",
    "categoryId": "REL-02",
    "subcategory": "التفسير",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-E89A8EAE4F",
    "title": "تفسير ابن كثير",
    "author": "ابن كثير",
    "categoryId": "REL-02",
    "subcategory": "التفسير",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "مرجع موسع"
  },
  {
    "id": "BK-BDB72211C1",
    "title": "مختصر تفسير الطبري",
    "author": "إسلام منصور عبد الحميد",
    "categoryId": "REL-02",
    "subcategory": "التفسير",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-F757442677",
    "title": "مقدمة في علم أصول الفقه",
    "author": "أحمد سالم",
    "categoryId": "REL-02",
    "subcategory": "أصول الفقه",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-9322A580DB",
    "title": "الحكم الشرعي",
    "author": "عبد الرقيب الشامي",
    "categoryId": "REL-02",
    "subcategory": "أصول الفقه",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-71FB97BEB1",
    "title": "فقه تاريخ الفقه",
    "author": "هيثم الرومي",
    "categoryId": "REL-02",
    "subcategory": "تاريخ الفقه",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-29C84A1B6A",
    "title": "السنة النبوية ومكانتها في التشريع",
    "author": "مصطفى السباعي",
    "categoryId": "REL-02",
    "subcategory": "علوم السنة",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-4F5EB055B2",
    "title": "الأنوار الكاشفة",
    "author": "عبد الرحمن بن يحيى المعلمي اليماني",
    "categoryId": "REL-02",
    "subcategory": "علوم الحديث ونقد",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-1FA7FDC66E",
    "title": "المدخل إلى الشريعة والفقه الإسلامي",
    "author": "عمر الأشقر",
    "categoryId": "REL-02",
    "subcategory": "فقه ومدخل للشريعة",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-F0F7DBB0F3",
    "title": "رياض الصالحين",
    "author": "يحيى بن شرف النووي",
    "categoryId": "REL-02",
    "subcategory": "الحديث النبوي والآداب",
    "level": "متوسط",
    "priority": "عالية",
    "note": "النص الأصلي للإمام النووي؛ مختلف عن شرح رياض الصالحين الموجود في المكتبة؛ أبواب موضوعية للآيات والأحاديث"
  },
  {
    "id": "BK-7E80CEC16E",
    "title": "معارج العلوم من الأمية إلى الإمامة",
    "author": "محمد بن محمد الأسطل",
    "categoryId": "REL-02",
    "subcategory": "منهجية طلب العلم الشرعي",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": "عنوان واحد؛ Noor-Book.com اسم موقع وليس جزءًا من العنوان؛ دليل منهجي مطوّل في طلب العلم"
  },
  {
    "id": "BK-9D6A55384A",
    "title": "النبأ العظيم",
    "author": "محمد عبد الله دراز",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي",
    "level": "متقدم",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-133B48F0AC",
    "title": "الدين",
    "author": "محمد عبد الله دراز",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي",
    "level": "متقدم",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-AFC93475BF",
    "title": "الإسلام بين الشرق والغرب",
    "author": "علي عزت بيجوفيتش",
    "categoryId": "THK-01",
    "subcategory": "فلسفة وحضارة",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-67E94AB3C5",
    "title": "الإعلان الإسلامي",
    "author": "علي عزت بيجوفيتش",
    "categoryId": "THK-01",
    "subcategory": "فلسفة وحضارة",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-61881BC3C3",
    "title": "هروبي إلى الحرية",
    "author": "علي عزت بيجوفيتش",
    "categoryId": "THK-01",
    "subcategory": "فلسفة وحضارة",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-E45F2DC8B2",
    "title": "معالم المنهج الإسلامي",
    "author": "محمد عمارة",
    "categoryId": "THK-01",
    "subcategory": "فكر معاصر",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-E9B81EABBB",
    "title": "هل الإسلام هو الحل",
    "author": "محمد عمارة",
    "categoryId": "THK-01",
    "subcategory": "فكر معاصر",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-DB4F7F9C16",
    "title": "شبهات حول الإسلام",
    "author": "محمد قطب",
    "categoryId": "THK-01",
    "subcategory": "فكر ونقد",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-2BD8F7DEC7",
    "title": "مغالطات",
    "author": "محمد قطب",
    "categoryId": "THK-01",
    "subcategory": "فكر ونقد",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-503B952544",
    "title": "مفاهيم ينبغي أن تصحح",
    "author": "محمد قطب",
    "categoryId": "THK-01",
    "subcategory": "فكر ونقد",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-742164A8B7",
    "title": "لا أعلم هويتي",
    "author": "حسام حامد",
    "categoryId": "THK-01",
    "subcategory": "هوية وفكر",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-6178EEF362",
    "title": "شموع النهار",
    "author": "عبد الله العجيري",
    "categoryId": "THK-01",
    "subcategory": "فكر ونقد",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-2CD551542F",
    "title": "ينبوع الغواية الفكرية",
    "author": "عبد الله العجيري",
    "categoryId": "THK-01",
    "subcategory": "فكر ونقد",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-F5BAD7AE89",
    "title": "مسلكيات",
    "author": "إبراهيم السكران",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي ونقد ثقافي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "بعض الأعمال رسائل أو دراسات وليست بالضرورة كتبًا مستقلة"
  },
  {
    "id": "BK-E9FD42821A",
    "title": "الماجريات",
    "author": "إبراهيم السكران",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي ونقد ثقافي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "بعض الأعمال رسائل أو دراسات وليست بالضرورة كتبًا مستقلة"
  },
  {
    "id": "BK-097C607E60",
    "title": "سلطة الثقافة الغالبة",
    "author": "إبراهيم السكران",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي ونقد ثقافي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "بعض الأعمال رسائل أو دراسات وليست بالضرورة كتبًا مستقلة"
  },
  {
    "id": "BK-9578659CFB",
    "title": "مآلات الخطاب المدني",
    "author": "إبراهيم السكران",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي ونقد ثقافي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "بعض الأعمال رسائل أو دراسات وليست بالضرورة كتبًا مستقلة"
  },
  {
    "id": "BK-F9D7CDA158",
    "title": "التأويل الحداثي للتراث",
    "author": "إبراهيم السكران",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي ونقد ثقافي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "بعض الأعمال رسائل أو دراسات وليست بالضرورة كتبًا مستقلة"
  },
  {
    "id": "BK-F820ACB253",
    "title": "احتجاجات المناوئين للخطاب الشرعي",
    "author": "إبراهيم السكران",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي ونقد ثقافي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "بعض الأعمال رسائل أو دراسات وليست بالضرورة كتبًا مستقلة"
  },
  {
    "id": "BK-0F8852B9AB",
    "title": "مفاتيح السياسة الشرعية",
    "author": "إبراهيم السكران",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي ونقد ثقافي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "بعض الأعمال رسائل أو دراسات وليست بالضرورة كتبًا مستقلة"
  },
  {
    "id": "BK-31F3E843C6",
    "title": "معركة النص",
    "author": "فهد العجلان",
    "categoryId": "THK-01",
    "subcategory": "فكر ومنهج",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-F103175AFA",
    "title": "منهجية التعامل مع المخالفين",
    "author": "سليمان الماجد",
    "categoryId": "THK-01",
    "subcategory": "حوار واختلاف",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-43794AB700",
    "title": "تنزيه القرآن الكريم عن دعاوى المبطلين",
    "author": "منقذ السقار",
    "categoryId": "THK-01",
    "subcategory": "حجاج ومناقشات",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-E921ABBA23",
    "title": "الإلحاد: وثوقية التوهم وخواء العدم",
    "author": "حسام الدين حامد",
    "categoryId": "THK-01",
    "subcategory": "فلسفة الدين",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-5E03C24C92",
    "title": "كلمة الحق",
    "author": "أحمد شاكر",
    "categoryId": "THK-01",
    "subcategory": "فكر ونقد",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-338D376EA8",
    "title": "حكم الجاهلية",
    "author": "أحمد شاكر",
    "categoryId": "THK-01",
    "subcategory": "فكر ونقد",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-B9FC607128",
    "title": "الحل الإسلامي فريضة وضرورة",
    "author": "يوسف القرضاوي",
    "categoryId": "THK-01",
    "subcategory": "فكر وسياسة",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-CBF1400D6E",
    "title": "بينات الحل الإسلامي",
    "author": "يوسف القرضاوي",
    "categoryId": "THK-01",
    "subcategory": "فكر وسياسة",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-7F481AF505",
    "title": "الحلول المستوردة",
    "author": "يوسف القرضاوي",
    "categoryId": "THK-01",
    "subcategory": "فكر وسياسة",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-AAB3C29A59",
    "title": "خصائص التصور الإسلامي ومقوماته",
    "author": "سيد قطب",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": "افحص الطبعة والتداخل بين العنوانين قبل الاعتماد النهائي"
  },
  {
    "id": "BK-E05D6C7702",
    "title": "مقومات التصور الإسلامي",
    "author": "سيد قطب",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": "افحص الطبعة والتداخل بين العنوانين قبل الاعتماد النهائي"
  },
  {
    "id": "BK-F268E3A75A",
    "title": "رسائل الإصلاح",
    "author": "محمد الخضر حسين",
    "categoryId": "THK-01",
    "subcategory": "فكر وإصلاح",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-84620096EB",
    "title": "دعوة الرسل",
    "author": "محمد أحمد العدوي",
    "categoryId": "THK-01",
    "subcategory": "دعوة وتاريخ",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-F617AEAE93",
    "title": "تجديد فقه السياسة الشرعية",
    "author": "خالد المزيني",
    "categoryId": "THK-01",
    "subcategory": "فقه سياسي",
    "level": "متقدم",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-972A96DF06",
    "title": "مائة سؤال عن الإسلام",
    "author": "محمد الغزالي",
    "categoryId": "THK-01",
    "subcategory": "فكر إسلامي",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-73F5073B10",
    "title": "حوارات الدكتور عبد الوهاب المسيري",
    "author": "عبد الوهاب المسيري (حوار: سوزان حرفي)",
    "categoryId": "THK-01",
    "subcategory": "فكر وحوارات",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-D8BC5EEDB6",
    "title": "مدخل إلى التراث العربي الإسلامي",
    "author": "أحمد محمود وخالد فهمي",
    "categoryId": "THK-01",
    "subcategory": "تراث وحضارة",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-3651B978C3",
    "title": "تاريخ المجتمعات الإسلامية",
    "author": "أيرا م. لابيدس",
    "categoryId": "THK-01",
    "subcategory": "تاريخ وحضارة",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-29BC9699A2",
    "title": "شمس العرب تسطع على الغرب",
    "author": "زيغريد هونكه",
    "categoryId": "THK-01",
    "subcategory": "تاريخ العلوم والحضارة",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-381DC9A9CD",
    "title": "الإسلام والاتجاهات العلمية",
    "author": "يحيى هاشم حسن",
    "categoryId": "THK-01",
    "subcategory": "العلم والفكر",
    "level": "متقدم",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-CF62EE5445",
    "title": "خمسون كتاباً في كتاب",
    "author": "محمد وقيع الله أحمد",
    "categoryId": "KNOW-01",
    "subcategory": "عروض ومراجعات كتب متعددة التخصصات",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": "مقالات وقراءات في كتب الأدب والاجتماع والسياسة والثقافة؛ ليس محتواه خمسين كتابًا كاملًا؛ مرجع للتوسع في القراءة"
  },
  {
    "id": "BK-03BEF58117",
    "title": "الفيزياء بين البساطة والدهاء",
    "author": "ضحى محمود صالح",
    "categoryId": "SCI-01",
    "subcategory": "تبسيط الفيزياء الحديثة",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": "كتاب تبسيط علمي بالعربية؛ ليس مرجعًا جامعيًا متخصصًا ولا ثبت أنه رسالة ماجستير"
  },
  {
    "id": "BK-6174C667AC",
    "title": "جلسات نفسية",
    "author": "محمد إبراهيم",
    "categoryId": "PSY-01",
    "subcategory": "صحة نفسية",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": "المقصود مؤلف «جلسات نفسية»؛ راجع هوية الكاتب إن كان الترشيح يخص شخصًا آخر"
  },
  {
    "id": "BK-F22F860B17",
    "title": "أبي الذي أكره",
    "author": "عماد رشاد عثمان",
    "categoryId": "PSY-01",
    "subcategory": "علاقات وصحة نفسية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-E44AD322DB",
    "title": "ممتلئ بالفراغ",
    "author": "عماد رشاد عثمان",
    "categoryId": "PSY-01",
    "subcategory": "علاقات وصحة نفسية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-DCA270EB23",
    "title": "أحببت وغدًا",
    "author": "عماد رشاد عثمان",
    "categoryId": "PSY-01",
    "subcategory": "علاقات وصحة نفسية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-E2E4ADE604",
    "title": "الجلاد تحت جلدي",
    "author": "عماد رشاد عثمان",
    "categoryId": "PSY-01",
    "subcategory": "علاقات وصحة نفسية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-F0805BBA49",
    "title": "الهشاشة النفسية",
    "author": "إسماعيل عرفة",
    "categoryId": "PSY-01",
    "subcategory": "ثقافة نفسية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-6B3DCE4035",
    "title": "إنسان بعد التحديث",
    "author": "شريف عرفة",
    "categoryId": "PSY-01",
    "subcategory": "سلوك وفهم النفس",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-E3445C44B0",
    "title": "جسدك يتذكر كل شيء",
    "author": "بيسيل فان دير كولك",
    "categoryId": "PSY-01",
    "subcategory": "الصدمة النفسية",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-B1E1D07B10",
    "title": "فن قراءة العقول",
    "author": "هنريك فكسيوس",
    "categoryId": "PSY-01",
    "subcategory": "تواصل وسلوك",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "اقرأ الادعاءات الخاصة بفهم النوايا قراءة نقدية"
  },
  {
    "id": "BK-FA3FD963A6",
    "title": "لغة الجسد",
    "author": "مؤلف غير محدد",
    "categoryId": "PSY-01",
    "subcategory": "تواصل ولغة جسد",
    "level": "مبتدئ",
    "priority": "منخفضة",
    "note": "ترشيح عام؛ يلزم تحديد الطبعة والمؤلف قبل الشراء"
  },
  {
    "id": "BK-96CFBA3EB3",
    "title": "أسرار العقل البشري",
    "author": "هاشم بحري",
    "categoryId": "PSY-01",
    "subcategory": "علم النفس والدماغ",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": "مقاربة طبية نفسية؛ راجع تطابق الطبعة مع ترشيح القارئ"
  },
  {
    "id": "BK-F96EC90425",
    "title": "العادات الذرية",
    "author": "جيمس كلير",
    "categoryId": "DEV-01",
    "subcategory": "بناء العادات",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-E7D5BD5D55",
    "title": "فن التركيز والإنجاز",
    "author": "ديمون زهاريادس",
    "categoryId": "DEV-01",
    "subcategory": "تركيز",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-892E2F45F9",
    "title": "العادات السبع للناس الأكثر فعالية",
    "author": "ستيفن كوفي",
    "categoryId": "DEV-01",
    "subcategory": "أولويات وقيادة الذات",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-2CF86CCC75",
    "title": "نظرية الفستق 1",
    "author": "فهد عامر الأحمدي",
    "categoryId": "DEV-01",
    "subcategory": "تفكير وقرارات",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-871755D39A",
    "title": "نظرية الفستق 2",
    "author": "فهد عامر الأحمدي",
    "categoryId": "DEV-01",
    "subcategory": "تفكير وقرارات",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-C0F70356AF",
    "title": "لا يمكنك إيذائي",
    "author": "ديفيد غوغينز",
    "categoryId": "DEV-01",
    "subcategory": "انضباط وصمود",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-1A9A1CFC7A",
    "title": "من الذي حرك قطعة الجبن الخاصة بي؟",
    "author": "سبنسر جونسون",
    "categoryId": "DEV-01",
    "subcategory": "التغيير والتكيف",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-54E4786A36",
    "title": "لماذا ننام",
    "author": "ماثيو ووكر",
    "categoryId": "DEV-01",
    "subcategory": "النوم وعلم الأعصاب",
    "level": "متوسط",
    "priority": "عالية",
    "note": "ثقافة علمية عامة؛ ليس مرجعًا تشخيصيًا"
  },
  {
    "id": "BK-90BF1219AD",
    "title": "الأب الغني والأب الفقير",
    "author": "روبرت كيوساكي",
    "categoryId": "BUS-01",
    "subcategory": "ثقافة مالية",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": "قصص وأفكار لا تُعامل كمرجع استثماري محكم"
  },
  {
    "id": "BK-0ABEEC56D0",
    "title": "البيان والتبيين",
    "author": "الجاحظ",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "المختارات والتهذيب نسخ/معالجات للعمل الأصلي؛ تهذيب الحيوان لعبد السلام هارون"
  },
  {
    "id": "BK-0EEA98FD1D",
    "title": "مختارات من البيان والتبيين",
    "author": "الجاحظ",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "المختارات والتهذيب نسخ/معالجات للعمل الأصلي؛ تهذيب الحيوان لعبد السلام هارون"
  },
  {
    "id": "BK-E6FA0D7190",
    "title": "الحيوان",
    "author": "الجاحظ",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "المختارات والتهذيب نسخ/معالجات للعمل الأصلي؛ تهذيب الحيوان لعبد السلام هارون"
  },
  {
    "id": "BK-CF70956DD3",
    "title": "تهذيب الحيوان",
    "author": "الجاحظ",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": "المختارات والتهذيب نسخ/معالجات للعمل الأصلي؛ تهذيب الحيوان لعبد السلام هارون"
  },
  {
    "id": "BK-517C82CC57",
    "title": "عيون الأخبار",
    "author": "ابن قتيبة",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-63F816EA1B",
    "title": "المختار من عيون الأخبار",
    "author": "ابن قتيبة",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-2FA853A5FE",
    "title": "العقد الفريد",
    "author": "ابن عبد ربه",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-58661E86AF",
    "title": "مختار العقد الفريد",
    "author": "ابن عبد ربه",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-8238ABAB4C",
    "title": "الإمتاع والمؤانسة",
    "author": "أبو حيان التوحيدي",
    "categoryId": "LIT-01",
    "subcategory": "النثر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-2A509DAD15",
    "title": "جواهر الألفاظ",
    "author": "قدامة بن جعفر",
    "categoryId": "LIT-01",
    "subcategory": "بلاغة ومفردات",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-17F21AAD75",
    "title": "خطب العرب",
    "author": "أحمد زكي صفوت",
    "categoryId": "LIT-01",
    "subcategory": "الخطب والرسائل",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-3DBE9BEE5D",
    "title": "رسائل العرب",
    "author": "أحمد زكي صفوت",
    "categoryId": "LIT-01",
    "subcategory": "الخطب والرسائل",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-0EE0DACAAE",
    "title": "المنتخب من أدب العرب",
    "author": "مجموعة مؤلفين",
    "categoryId": "LIT-01",
    "subcategory": "مختارات أدبية",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-7211E40AF3",
    "title": "ديوان الحماسة",
    "author": "أبو تمام (جمع واختيار)",
    "categoryId": "LIT-01",
    "subcategory": "الشعر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-BE6DA40B35",
    "title": "المفضليات",
    "author": "المفضل الضبي (جمع واختيار)",
    "categoryId": "LIT-01",
    "subcategory": "الشعر العربي",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-9D5318DB15",
    "title": "المعلقات العشر",
    "author": "شعراء جاهليون متعددون",
    "categoryId": "LIT-01",
    "subcategory": "الشعر الجاهلي",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-C5F6CA6FE6",
    "title": "مختارات البارودي",
    "author": "محمود سامي البارودي",
    "categoryId": "LIT-01",
    "subcategory": "الشعر العربي",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-8B605C2E3E",
    "title": "اقتحام",
    "author": "عماد رشاد عثمان",
    "categoryId": "NOV-01",
    "subcategory": "رواية",
    "level": "متوسط",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-5F832D1B8F",
    "title": "حكايات حارتنا",
    "author": "نجيب محفوظ",
    "categoryId": "NOV-01",
    "subcategory": "رواية عربية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-71DCED8BFC",
    "title": "المرايا",
    "author": "نجيب محفوظ",
    "categoryId": "NOV-01",
    "subcategory": "رواية عربية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-B9D87C88A4",
    "title": "اللص والكلاب",
    "author": "نجيب محفوظ",
    "categoryId": "NOV-01",
    "subcategory": "رواية عربية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-C432B3916B",
    "title": "الحرافيش",
    "author": "نجيب محفوظ",
    "categoryId": "NOV-01",
    "subcategory": "رواية عربية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-58DFC3E0E2",
    "title": "قنديل أم هاشم",
    "author": "يحيى حقي",
    "categoryId": "NOV-01",
    "subcategory": "رواية/قصة عربية",
    "level": "مبتدئ",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-046D2BF69F",
    "title": "قمر على سمرقند",
    "author": "محمد المنسي قنديل",
    "categoryId": "NOV-01",
    "subcategory": "رواية عربية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-0C9F12A48D",
    "title": "ساق البامبو",
    "author": "سعود السنعوسي",
    "categoryId": "NOV-01",
    "subcategory": "رواية عربية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-FD90289CEA",
    "title": "يوتوبيا",
    "author": "أحمد خالد توفيق",
    "categoryId": "NOV-01",
    "subcategory": "خيال اجتماعي",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-3B3287F580",
    "title": "1984",
    "author": "جورج أورويل",
    "categoryId": "NOV-01",
    "subcategory": "ديستوبيا",
    "level": "متوسط",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-E1E30CCBAC",
    "title": "عالم جديد شجاع",
    "author": "ألدوس هكسلي",
    "categoryId": "NOV-01",
    "subcategory": "خيال اجتماعي",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-1BFC8FFB3D",
    "title": "العمى",
    "author": "جوزيه ساراماغو",
    "categoryId": "NOV-01",
    "subcategory": "رواية فلسفية",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-5A65CCB527",
    "title": "موعد مع الجريمة",
    "author": "دين كونتز",
    "categoryId": "NOV-01",
    "subcategory": "تشويق",
    "level": "مبتدئ",
    "priority": "منخفضة",
    "note": "راجع العنوان والطبعة المترجمة"
  },
  {
    "id": "BK-B682944851",
    "title": "شفرة دافنشي",
    "author": "دان براون",
    "categoryId": "NOV-01",
    "subcategory": "تشويق وغموض",
    "level": "مبتدئ",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-DB14F29468",
    "title": "المعلم ومارجريتا",
    "author": "ميخائيل بولغاكوف",
    "categoryId": "NOV-01",
    "subcategory": "فانتازيا وفلسفة",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-AE3C424D88",
    "title": "الدم الحكيم",
    "author": "فلانري أوكونور",
    "categoryId": "NOV-01",
    "subcategory": "رواية فلسفية",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-01CB423067",
    "title": "كائن لا تحتمل خفته",
    "author": "ميلان كونديرا",
    "categoryId": "NOV-01",
    "subcategory": "رواية فلسفية",
    "level": "متقدم",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-717B17D4D9",
    "title": "ابن فرجينيا",
    "author": "أوين وستر",
    "categoryId": "NOV-01",
    "subcategory": "رواية كلاسيكية",
    "level": "متوسط",
    "priority": "منخفضة",
    "note": null
  },
  {
    "id": "BK-2CD97546B3",
    "title": "الجريمة والعقاب",
    "author": "فيودور دوستويفسكي",
    "categoryId": "NOV-01",
    "subcategory": "رواية نفسية",
    "level": "متقدم",
    "priority": "عالية",
    "note": null
  },
  {
    "id": "BK-9B0D118AC8",
    "title": "أوقات عصيبة",
    "author": "تشارلز ديكنز",
    "categoryId": "NOV-01",
    "subcategory": "رواية اجتماعية",
    "level": "متوسط",
    "priority": "متوسطة",
    "note": null
  },
  {
    "id": "BK-76A6239E7F",
    "title": "البؤساء",
    "author": "فيكتور هوغو",
    "categoryId": "NOV-01",
    "subcategory": "رواية تاريخية",
    "level": "متقدم",
    "priority": "عالية",
    "note": null
  }
];
