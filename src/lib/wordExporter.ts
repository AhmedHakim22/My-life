import type { JournalEntry, BookDetails, LearningResource } from '../types';

export interface WordExportOptions {
  bookTitle?: string;
  subtitle?: string;
  authorName?: string;
  filterTag?: string; // 'ALL' or a specific tag
  sortOrder?: 'CHRONOLOGICAL_ASC' | 'CHRONOLOGICAL_DESC';
  includeCoverPage?: boolean;
  includeStatsSummary?: boolean;
  includeTableOfContents?: boolean;
  includeBookAppendix?: boolean;
  books?: Array<{
    title: string;
    author?: string;
    currentPage: number;
    totalPages: number;
    shelf: string;
  }>;
}

export interface WordExportResult {
  blob: Blob;
  filename: string;
  htmlContent: string;
  totalEntries: number;
  totalWords: number;
}

/**
 * Escapes raw strings for safe HTML inclusion
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats a YYYY-MM-DD date into a friendly Arabic string
 * e.g., 'الأربعاء، 22 أكتوبر 2026'
 */
export function formatArabicDateFriendly(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);

      const arabicDayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const arabicMonthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];

      const dayName = arabicDayNames[date.getDay()] || '';
      const monthName = arabicMonthNames[month] || '';

      return `${dayName}، ${day} ${monthName} ${year}`;
    }
  } catch {
    // Fallback if parsing fails
  }
  return dateStr;
}

/**
 * Calculates estimated word count from text (handles Arabic and Latin characters)
 */
export function calculateWordCount(text: string): number {
  if (!text) return 0;
  // Strip HTML tags and markdown markers
  const clean = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/[*#_`~]/g, ' ')
    .trim();
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

/**
 * Parses markdown-like content into structured HTML for Word
 */
function formatJournalContentToHtml(content: string, mode: string): string {
  if (!content) return '';

  // 1. If it's guided 5 prompts, parse prompt sections
  if (mode === 'GUIDED_5_PROMPTS' || content.includes('**ماذا حدث') || content.includes('**ما الذي نجح')) {
    const lines = content.split('\n');
    let formattedHtml = '<div class="guided-container">';
    
    let currentQuestion = '';
    let currentAnswer = '';

    const flushQA = () => {
      if (currentQuestion) {
        formattedHtml += `
          <div class="guided-item">
            <div class="guided-question">${escapeHtml(currentQuestion)}</div>
            <div class="guided-answer">${escapeHtml(currentAnswer.trim() || '—')}</div>
          </div>
        `;
      }
      currentQuestion = '';
      currentAnswer = '';
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const match = line.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
      if (match) {
        flushQA();
        currentQuestion = match[1];
        currentAnswer = match[2];
      } else if (currentQuestion) {
        currentAnswer += (currentAnswer ? '\n' : '') + line;
      } else if (line) {
        currentQuestion = 'ملاحظة:';
        currentAnswer = line;
      }
    }
    flushQA();
    formattedHtml += '</div>';
    return formattedHtml;
  }

  // 2. Free writing mode: paragraphs, blockquotes, bold, and list formatting
  const paragraphs = content.split(/\n\s*\n/);
  return paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';

    // Check if whole paragraph is a quote block
    if (trimmed.startsWith('>') || (trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith('«') && trimmed.endsWith('»'))) {
      const quoteText = trimmed.replace(/^>\s*/, '').replace(/^["«]|["»]$/g, '');
      return `
        <div class="quote-callout">
          <p class="quote-text">« ${escapeHtml(quoteText)} »</p>
        </div>
      `;
    }

    // Check if paragraph contains sub-lines with quotes (e.g., lines starting with >)
    if (trimmed.includes('\n>') || trimmed.startsWith('>')) {
      const subLines = trimmed.split('\n');
      return subLines.map(subLine => {
        const subTrim = subLine.trim();
        if (!subTrim) return '';
        if (subTrim.startsWith('>')) {
          const qText = subTrim.replace(/^>\s*/, '').replace(/^["«]|["»]$/g, '');
          return `
            <div class="quote-callout">
              <p class="quote-text">« ${escapeHtml(qText)} »</p>
            </div>
          `;
        }
        let formattedSub = escapeHtml(subTrim);
        formattedSub = formattedSub.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        formattedSub = formattedSub.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        return `<p class="entry-paragraph">${formattedSub}</p>`;
      }).filter(Boolean).join('\n');
    }

    // Process basic inline markdown: **bold** and *italic*
    let formatted = escapeHtml(trimmed);
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/\n/g, '<br/>');

    return `<p class="entry-paragraph">${formatted}</p>`;
  }).join('\n');
}

/**
 * Generates an elegant Microsoft Word document (HTML format with Word XML markup)
 */
export function generateJournalWordHtml(
  entries: JournalEntry[],
  options: WordExportOptions = {}
): WordExportResult {
  const {
    bookTitle = 'مذكرات ومحطات مَسار',
    subtitle = 'توثيق الرحلة، خلاصة التجارب، والأفكار الملهمة',
    authorName = 'أحمد حكيم',
    filterTag = 'ALL',
    sortOrder = 'CHRONOLOGICAL_ASC',
    includeCoverPage = true,
    includeStatsSummary = true,
    includeTableOfContents = true,
    includeBookAppendix = true,
    books = []
  } = options;

  // Filter entries
  let filtered = entries.filter(e => {
    if (filterTag === 'ALL') return true;
    return e.tags && e.tags.includes(filterTag);
  });

  // Sort entries
  filtered = filtered.slice().sort((a, b) => {
    const comp = a.date.localeCompare(b.date);
    return sortOrder === 'CHRONOLOGICAL_ASC' ? comp : -comp;
  });

  // Calculate statistics
  let totalWords = 0;
  for (const entry of filtered) {
    totalWords += calculateWordCount(entry.content);
  }

  const startDate = filtered.length > 0
    ? (sortOrder === 'CHRONOLOGICAL_ASC' ? filtered[0].date : filtered[filtered.length - 1].date)
    : '';
  const endDate = filtered.length > 0
    ? (sortOrder === 'CHRONOLOGICAL_ASC' ? filtered[filtered.length - 1].date : filtered[0].date)
    : '';

  const exportDate = new Date().toISOString().split('T')[0];

  // Document HTML with Office XML headers
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40"
      dir="rtl" lang="ar">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="ProgId" content="Word.Document" />
  <meta name="Generator" content="MASAAR Life OS" />
  <meta name="Originator" content="Microsoft Word 15" />
  <title>${escapeHtml(bookTitle)} — ${escapeHtml(authorName)}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 21.0cm 29.7cm; /* A4 */
      margin: 2.5cm 2.0cm 2.5cm 2.0cm;
      mso-page-orientation: portrait;
    }
    @page Section1 {
      size: 595.3pt 841.9pt;
      margin: 70.85pt 56.7pt 70.85pt 56.7pt;
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
      direction: rtl;
      text-align: right;
    }
    body {
      font-family: 'Amiri', 'Traditional Arabic', 'Segoe UI', Calibri, Arial, sans-serif;
      font-size: 13pt;
      line-height: 1.85;
      color: #1e293b;
      direction: rtl;
      text-align: right;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4 {
      font-family: 'Traditional Arabic', 'Amiri', 'Segoe UI', Arial, sans-serif;
      font-weight: bold;
      color: #0f172a;
      margin-top: 18pt;
      margin-bottom: 8pt;
    }
    p {
      margin-top: 0;
      margin-bottom: 10pt;
      text-align: justify;
      text-justify: inter-word;
    }
    .page-break {
      page-break-before: always;
      mso-special-character: line-break;
      clear: both;
    }

    /* Cover Page Styling */
    .cover-container {
      border: 3pt double #0d9488;
      padding: 40pt 25pt;
      text-align: center;
      background: #fcfdfd;
      margin-bottom: 30pt;
    }
    .cover-bismillah {
      font-family: 'Traditional Arabic', 'Amiri', serif;
      font-size: 20pt;
      font-weight: bold;
      color: #0f766e;
      margin-bottom: 25pt;
    }
    .cover-supertitle {
      font-size: 11pt;
      letter-spacing: 2px;
      color: #64748b;
      font-weight: bold;
      margin-bottom: 12pt;
    }
    .cover-title {
      font-size: 30pt;
      font-weight: 900;
      color: #042f2e;
      line-height: 1.35;
      margin-bottom: 12pt;
      padding-bottom: 16pt;
      border-bottom: 2pt solid #0d9488;
    }
    .cover-subtitle {
      font-size: 15pt;
      color: #475569;
      font-style: italic;
      margin-bottom: 35pt;
      line-height: 1.6;
    }
    .cover-author-box {
      margin: 30pt auto;
      padding: 16pt 24pt;
      border-top: 1pt solid #cbd5e1;
      border-bottom: 1pt solid #cbd5e1;
      display: inline-block;
      width: 70%;
    }
    .cover-author-label {
      font-size: 11pt;
      color: #64748b;
      margin-bottom: 4pt;
    }
    .cover-author-name {
      font-size: 22pt;
      font-weight: bold;
      color: #0f172a;
    }
    .stats-table {
      width: 85%;
      margin: 30pt auto;
      border-collapse: collapse;
      font-size: 10.5pt;
      color: #334155;
    }
    .stats-table th, .stats-table td {
      border: 1pt solid #cbd5e1;
      padding: 7pt 12pt;
      text-align: center;
    }
    .stats-table th {
      background-color: #f0fdfa;
      color: #0f766e;
      font-weight: bold;
    }
    .cover-footer {
      margin-top: 40pt;
      font-size: 10pt;
      color: #94a3b8;
    }

    /* Preface Section */
    .preface-box {
      background-color: #f8fafc;
      border-right: 4pt solid #0ea5e9;
      padding: 16pt 20pt;
      margin: 20pt 0 30pt 0;
      border-radius: 4pt;
    }
    .preface-title {
      font-size: 16pt;
      font-weight: bold;
      color: #0369a1;
      margin-bottom: 8pt;
    }
    .preface-text {
      font-size: 12.5pt;
      color: #334155;
      line-height: 1.8;
      font-style: italic;
    }

    /* Table of Contents */
    .toc-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15pt 0 30pt 0;
      font-size: 11pt;
    }
    .toc-table th, .toc-table td {
      border: 1pt solid #e2e8f0;
      padding: 6pt 10pt;
      text-align: right;
    }
    .toc-table th {
      background-color: #f1f5f9;
      color: #1e293b;
      font-weight: bold;
    }
    .toc-table tr:nth-child(even) {
      background-color: #fafafa;
    }

    /* Entry / Chapter Cards */
    .entry-card {
      margin-bottom: 30pt;
      padding: 18pt 20pt;
      border: 1pt solid #e2e8f0;
      border-right: 4pt solid #0d9488;
      background: #ffffff;
      border-radius: 6pt;
    }
    .entry-header {
      border-bottom: 1.5pt solid #f1f5f9;
      padding-bottom: 8pt;
      margin-bottom: 14pt;
    }
    .entry-title {
      font-size: 15pt;
      font-weight: bold;
      color: #042f2e;
      display: inline-block;
    }
    .entry-mode-badge {
      display: inline-block;
      padding: 2pt 8pt;
      font-size: 9.5pt;
      font-weight: bold;
      border-radius: 4pt;
      background-color: #ccfbf1;
      color: #0f766e;
      margin-right: 10pt;
    }
    .tags-container {
      margin-top: 6pt;
    }
    .tag-badge {
      display: inline-block;
      padding: 2pt 6pt;
      font-size: 9pt;
      color: #0369a1;
      background-color: #e0f2fe;
      border-radius: 3pt;
      margin-left: 5pt;
      font-family: monospace;
    }
    .entry-paragraph {
      font-size: 12.5pt;
      line-height: 1.85;
      color: #1e293b;
      margin-bottom: 10pt;
    }

    /* Guided Prompts Box */
    .guided-container {
      margin: 10pt 0;
    }
    .guided-item {
      margin-bottom: 12pt;
      padding: 10pt 14pt;
      background-color: #f8fafc;
      border-right: 3pt solid #10b981;
      border-radius: 4pt;
    }
    .guided-question {
      font-size: 11.5pt;
      font-weight: bold;
      color: #047857;
      margin-bottom: 4pt;
    }
    .guided-answer {
      font-size: 12pt;
      color: #334155;
      line-height: 1.75;
      white-space: pre-wrap;
    }

    /* Quotes Callouts */
    .quote-callout {
      margin: 14pt 0;
      padding: 12pt 18pt;
      background-color: #fffbeb;
      border-right: 4pt solid #f59e0b;
      border-radius: 4pt;
    }
    .quote-text {
      font-size: 13.5pt;
      font-weight: bold;
      color: #92400e;
      line-height: 1.8;
      font-style: italic;
      margin: 0;
    }

    /* Appendix */
    .appendix-box {
      margin-top: 25pt;
      padding: 16pt 20pt;
      border: 1pt solid #cbd5e1;
      border-right: 4pt solid #8b5cf6;
      background: #faf5ff;
      border-radius: 6pt;
    }
    .appendix-title {
      font-size: 16pt;
      font-weight: bold;
      color: #6b21a8;
      margin-bottom: 12pt;
    }
  </style>
</head>
<body>
<div class="Section1">

  ${includeCoverPage ? `
  <!-- COVER PAGE -->
  <div class="cover-container">
    <div class="cover-bismillah">❖ بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ ❖</div>
    <div class="cover-supertitle">نِـظَـامُ مَـسَـار • مَكْتَبَةُ الذِّكْرَيَاتِ وَالأَفْكَار</div>
    <div class="cover-title">${escapeHtml(bookTitle)}</div>
    <div class="cover-subtitle">${escapeHtml(subtitle)}</div>

    <div class="cover-author-box">
      <div class="cover-author-label">تأليف وتدوين</div>
      <div class="cover-author-name">${escapeHtml(authorName)}</div>
    </div>

    ${includeStatsSummary ? `
    <table class="stats-table">
      <thead>
        <tr>
          <th>فترة التدوين</th>
          <th>عدد المذكرات</th>
          <th>الكلمات التقديرية</th>
          <th>تاريخ الاستخراج</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${startDate && endDate ? `${startDate} إلى ${endDate}` : 'مسار متواصل'}</td>
          <td>${filtered.length} تدوينة</td>
          <td>حوالي ${totalWords.toLocaleString('ar-EG')} كلمة</td>
          <td>${exportDate}</td>
        </tr>
      </tbody>
    </table>
    ` : ''}

    <div class="cover-footer">
      تم التصدير والتوثيق عبر نظام مَسار (MASAAR Life OS) • كتاب خاص وسيرة شخصية
    </div>
  </div>

  <div class="page-break"></div>
  ` : ''}

  <!-- PREFACE -->
  <div class="preface-box">
    <div class="preface-title">مقدمة المذكرات ✒️</div>
    <div class="preface-text">
      «هذا العمل يضم خلاصة التدوينات اليومية، التأملات الصادقة، محطات التعلم، والأفكار التي سُجلت خلال المسيرة. 
      كل سطر كُتب هنا هو شاهد على خطوة نحو الهدف، وتجربة أضافت بصيرة، ولحظة تستحق ألا تُنسى.»
    </div>
  </div>

  ${includeTableOfContents && filtered.length > 0 ? `
  <!-- TABLE OF CONTENTS -->
  <h2>فهرس المحطات واليوميات (${filtered.length}) 📑</h2>
  <table class="toc-table">
    <thead>
      <tr>
        <th style="width: 8%;">#</th>
        <th style="width: 32%;">التاريخ</th>
        <th style="width: 25%;">نوع التدوينة</th>
        <th style="width: 35%;">الوسوم والموضوعات</th>
      </tr>
    </thead>
    <tbody>
      ${filtered.map((e, idx) => `
        <tr>
          <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
          <td><strong>${formatArabicDateFriendly(e.date)}</strong></td>
          <td>${e.mode === 'GUIDED_5_PROMPTS' ? 'تأمل موجه 🔮' : 'تدوين حر وخاطرة ✍️'}</td>
          <td>${e.tags && e.tags.length > 0 ? escapeHtml(e.tags.join(' ')) : '—'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="page-break"></div>
  ` : ''}

  <!-- CHAPTERS / ENTRIES -->
  <h2>سجل اليوميات والخواطر 📖</h2>

  ${filtered.map((entry, idx) => `
    <div class="entry-card">
      <div class="entry-header">
        <div class="entry-title">
          المحطة ${idx + 1}: ${formatArabicDateFriendly(entry.date)}
        </div>
        <span class="entry-mode-badge">
          ${entry.mode === 'GUIDED_5_PROMPTS' ? 'تأمل موجه (5 أسئلة)' : 'تدوين حر'}
        </span>
        ${entry.tags && entry.tags.length > 0 ? `
          <div class="tags-container">
            ${entry.tags.map(t => `<span class="tag-badge">${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}
      </div>

      <div class="entry-body">
        ${formatJournalContentToHtml(entry.content, entry.mode)}
      </div>
    </div>
  `).join('\n')}

  ${includeBookAppendix && books && books.length > 0 ? `
  <!-- BOOK READING APPENDIX -->
  <div class="page-break"></div>
  <div class="appendix-box">
    <div class="appendix-title">ملحق: سجل قراءات الكتب والمراجع 📚</div>
    <p>قائمة بالكتب والمراجع التي شكّلت الفكر ورافقت مسار التعلم خلال هذه الفترة:</p>
    <table class="toc-table">
      <thead>
        <tr>
          <th>اسم الكتاب</th>
          <th>المؤلف</th>
          <th>الصفحات المنجزة</th>
          <th>الحالة</th>
        </tr>
      </thead>
      <tbody>
        ${books.map(b => `
          <tr>
            <td><strong>${escapeHtml(b.title)}</strong></td>
            <td>${escapeHtml(b.author || '—')}</td>
            <td>${b.currentPage} من ${b.totalPages} صفحة</td>
            <td>${b.shelf === 'Finished' ? 'تمت قراءته بنجاح ✅' : b.shelf === 'Reading' ? 'قيد القراءة الحالية 📖' : 'في قائمة القراءة'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

</div>
</body>
</html>`;

  // Encode with UTF-8 BOM so Word recognizes Arabic without encoding errors
  const blob = new Blob(['\uFEFF' + html], {
    type: 'application/msword;charset=utf-8'
  });

  const sanitizedTitle = bookTitle.replace(/[/\\?%*:|"<>]/g, '_');
  const filename = `${sanitizedTitle}_${exportDate}.doc`;

  return {
    blob,
    filename,
    htmlContent: html,
    totalEntries: filtered.length,
    totalWords
  };
}

/**
 * Initiates direct browser download of the Word document
 */
export function exportJournalToWord(
  entries: JournalEntry[],
  options: WordExportOptions = {}
): WordExportResult {
  const result = generateJournalWordHtml(entries, options);

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return result;
}
