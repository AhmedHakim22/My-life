import type { JournalEntry, BookDetails, LearningResource } from '../types';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  SectionType
} from 'docx';

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
  htmlContent?: string;
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
 * Parses inline markdown (bold **text**, italics *text*) into TextRuns
 */
function parseInlineDocxRuns(
  text: string, 
  baseProps: { font?: string; size?: number; color?: string; italics?: boolean } = {}
): TextRun[] {
  if (!text) return [];
  const runs: TextRun[] = [];
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const boldPart of boldParts) {
    if (!boldPart) continue;
    if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
      const innerText = boldPart.slice(2, -2);
      runs.push(new TextRun({
        text: innerText,
        bold: true,
        font: baseProps.font || 'Amiri',
        size: baseProps.size || 24,
        color: baseProps.color || '1E293B',
        italics: baseProps.italics,
        rightToLeft: true
      }));
    } else {
      const italicParts = boldPart.split(/(\*[^*]+\*|_[^_]+_)/g);
      for (const italicPart of italicParts) {
        if (!italicPart) continue;
        if ((italicPart.startsWith('*') && italicPart.endsWith('*')) || (italicPart.startsWith('_') && italicPart.endsWith('_'))) {
          runs.push(new TextRun({
            text: italicPart.slice(1, -1),
            italics: true,
            font: baseProps.font || 'Amiri',
            size: baseProps.size || 24,
            color: baseProps.color || '1E293B',
            rightToLeft: true
          }));
        } else {
          runs.push(new TextRun({
            text: italicPart,
            font: baseProps.font || 'Amiri',
            size: baseProps.size || 24,
            color: baseProps.color || '1E293B',
            italics: baseProps.italics,
            rightToLeft: true
          }));
        }
      }
    }
  }
  return runs.length > 0 ? runs : [new TextRun({ text, font: baseProps.font || 'Amiri', size: baseProps.size || 24, rightToLeft: true })];
}

/**
 * Parses markdown-like journal content into native docx Paragraph elements
 */
function parseJournalContentToDocx(content: string, mode: string): Paragraph[] {
  if (!content) return [];
  const paragraphs: Paragraph[] = [];

  // 1. Guided 5 Prompts
  if (mode === 'GUIDED_5_PROMPTS' || content.includes('**ماذا حدث') || content.includes('**ما الذي نجح')) {
    const lines = content.split('\n');
    let currentQuestion = '';
    let currentAnswer = '';

    const flushQA = () => {
      if (currentQuestion) {
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          spacing: { before: 180, after: 60 },
          children: [
            new TextRun({
              text: currentQuestion,
              bold: true,
              color: '047857',
              size: 24,
              font: 'Amiri',
              rightToLeft: true
            })
          ]
        }));
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          spacing: { before: 0, after: 140 },
          children: parseInlineDocxRuns(currentAnswer.trim() || '—', {
            color: '334155',
            size: 24,
            font: 'Amiri'
          })
        }));
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
    return paragraphs;
  }

  // 2. Free writing mode
  const rawParagraphs = content.split(/\n\s*\n/);
  for (const p of rawParagraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith('>') || (line.startsWith('«') && line.endsWith('»')) || (line.startsWith('"') && line.endsWith('"'))) {
        const quoteText = line.replace(/^>\s*/, '').replace(/^[«"]|[»"]$/g, '').trim();
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          border: {
            right: { style: BorderStyle.SINGLE, size: 24, color: '059669', space: 12 }
          },
          shading: { fill: 'F8FAFC' },
          indent: { right: 360, left: 180 },
          spacing: { before: 140, after: 140 },
          children: [
            new TextRun({
              text: `« ${quoteText} »`,
              italics: true,
              bold: true,
              color: '0F172A',
              size: 24,
              font: 'Amiri',
              rightToLeft: true
            })
          ]
        }));
      } else if (line.startsWith('### ')) {
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 100 },
          children: [
            new TextRun({
              text: line.replace(/^###\s*/, ''),
              bold: true,
              color: '0F766E',
              size: 26,
              font: 'Amiri',
              rightToLeft: true
            })
          ]
        }));
      } else if (line.startsWith('## ')) {
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: line.replace(/^##\s*/, ''),
              bold: true,
              color: '047857',
              size: 28,
              font: 'Amiri',
              rightToLeft: true
            })
          ]
        }));
      } else {
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          spacing: { before: 60, after: 120, line: 360 },
          children: parseInlineDocxRuns(line, {
            color: '1E293B',
            size: 24,
            font: 'Amiri'
          })
        }));
      }
    }
  }

  return paragraphs;
}

/**
 * Generates an authentic Microsoft Word (.docx) OpenXML document
 * Fully compliant with Word desktop, mobile, web, and standard document viewers.
 * Built-in native RTL, headers, footers, cover page, and appendix.
 */
export async function generateJournalDocx(
  entries: JournalEntry[],
  options: WordExportOptions = {}
): Promise<WordExportResult> {
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
    return (e.tags || []).includes(filterTag);
  });

  // Sort entries
  if (sortOrder === 'CHRONOLOGICAL_DESC') {
    filtered.sort((a, b) => b.date.localeCompare(a.date));
  } else {
    filtered.sort((a, b) => a.date.localeCompare(b.date));
  }

  // Calculate words and date bounds
  let totalWords = 0;
  filtered.forEach(entry => {
    totalWords += calculateWordCount(entry.content);
  });

  const fromDate = filtered.length > 0 ? filtered[0].date : '';
  const toDate = filtered.length > 0 ? filtered[filtered.length - 1].date : '';
  const exportDate = new Date().toISOString().split('T')[0];

  const sections = [];

  // 1. Cover Page Section (if requested)
  if (includeCoverPage) {
    const coverChildren: (Paragraph | Table)[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 200 },
        children: [
          new TextRun({
            text: 'مَسار • نظام إدارة الحياة والإنتاجية',
            color: '059669',
            size: 22,
            bold: true,
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: bookTitle,
            size: 56,
            bold: true,
            color: '047857',
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { before: 100, after: 600 },
        children: [
          new TextRun({
            text: subtitle,
            size: 26,
            color: '64748B',
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { before: 300, after: 200 },
        children: [
          new TextRun({
            text: `المؤلف: ${authorName}`,
            size: 28,
            bold: true,
            color: '0F172A',
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { before: 100, after: 800 },
        children: [
          new TextRun({
            text: formatArabicDateFriendly(exportDate),
            size: 22,
            color: '94A3B8',
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      })
    ];

    if (includeStatsSummary) {
      coverChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          bidirectional: true,
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({
              text: 'ملخص بيانات الكتاب',
              bold: true,
              color: '475569',
              size: 22,
              font: 'Amiri',
              rightToLeft: true
            })
          ]
        }),
        new Table({
          visuallyRightToLeft: true,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'F1F5F9' },
            insideVertical: { style: BorderStyle.NONE }
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'إجمالي التدوينات', bold: true, color: '475569', font: 'Amiri', rightToLeft: true })] })]
                }),
                new TableCell({
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: `${filtered.length} تدوينة`, bold: true, color: '047857', font: 'Amiri', rightToLeft: true })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'إجمالي الكلمات المقدرة', bold: true, color: '475569', font: 'Amiri', rightToLeft: true })] })]
                }),
                new TableCell({
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: `حوالي ${totalWords.toLocaleString('ar-EG')} كلمة`, bold: true, color: '047857', font: 'Amiri', rightToLeft: true })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'الفترة الزمنية', bold: true, color: '475569', font: 'Amiri', rightToLeft: true })] })]
                }),
                new TableCell({
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: fromDate && toDate ? `من ${formatArabicDateFriendly(fromDate)} إلى ${formatArabicDateFriendly(toDate)}` : '—', bold: true, color: '047857', font: 'Amiri', rightToLeft: true })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'تصنيف التدوينات', bold: true, color: '475569', font: 'Amiri', rightToLeft: true })] })]
                }),
                new TableCell({
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: filterTag === 'ALL' ? 'كافة اليوميات والخواطر' : filterTag, bold: true, color: '047857', font: 'Amiri', rightToLeft: true })] })]
                })
              ]
            })
          ]
        })
      );
    }

    sections.push({
      properties: { type: SectionType.NEXT_PAGE },
      children: coverChildren
    });
  }

  // 2. Main Content Section (Table of Contents + Entries + Appendix)
  const mainChildren: (Paragraph | Table)[] = [];

  // Table of Contents
  if (includeTableOfContents && filtered.length > 0) {
    mainChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 200, after: 300 },
        children: [
          new TextRun({
            text: `فهرس المحطات واليوميات (${filtered.length})`,
            size: 32,
            bold: true,
            color: '047857',
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      })
    );

    const tocRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, children: [new TextRun({ text: '#', bold: true, color: 'FFFFFF', font: 'Amiri', rightToLeft: true })] })]
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'تاريخ المحطة', bold: true, color: 'FFFFFF', font: 'Amiri', rightToLeft: true })] })]
          }),
          new TableCell({
            width: { size: 42, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'مقتطف من اليوميات', bold: true, color: 'FFFFFF', font: 'Amiri', rightToLeft: true })] })]
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'الوسوم', bold: true, color: 'FFFFFF', font: 'Amiri', rightToLeft: true })] })]
          })
        ]
      })
    ];

    filtered.forEach((entry, idx) => {
      const cleanSnippet = entry.content
        .replace(/[*#_`>]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 65) + (entry.content.length > 65 ? '...' : '');

      tocRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, children: [new TextRun({ text: String(idx + 1), color: '64748B', font: 'Amiri', rightToLeft: true })] })]
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: formatArabicDateFriendly(entry.date), bold: true, color: '0F172A', font: 'Amiri', rightToLeft: true })] })]
            }),
            new TableCell({
              width: { size: 42, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: cleanSnippet, color: '334155', font: 'Amiri', rightToLeft: true })] })]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: (entry.tags || []).join(' ') || '—', color: '0D9488', font: 'Amiri', rightToLeft: true })] })]
            })
          ]
        })
      );
    });

    mainChildren.push(
      new Table({
        visuallyRightToLeft: true,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'F1F5F9' },
          insideVertical: { style: BorderStyle.NONE }
        },
        rows: tocRows
      }),
      new Paragraph({ children: [new PageBreak()] })
    );
  }

  // Journal Entries
  if (filtered.length === 0) {
    mainChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { before: 400, after: 400 },
        children: [
          new TextRun({
            text: 'لا توجد تدوينات مسجلة تطابق التصنيف المختار حالياً.',
            color: '94A3B8',
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      })
    );
  } else {
    filtered.forEach((entry, index) => {
      mainChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          spacing: { before: index === 0 ? 100 : 360, after: 80 },
          children: [
            new TextRun({
              text: `📌 ${formatArabicDateFriendly(entry.date)}`,
              bold: true,
              color: '065F46',
              size: 28,
              font: 'Amiri',
              rightToLeft: true
            })
          ]
        })
      );

      if (entry.tags && entry.tags.length > 0) {
        mainChildren.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: entry.tags.join('   '),
                bold: true,
                color: '0D9488',
                size: 20,
                font: 'Amiri',
                rightToLeft: true
              })
            ]
          })
        );
      }

      const contentParagraphs = parseJournalContentToDocx(entry.content, entry.mode);
      mainChildren.push(...contentParagraphs);

      if (index < filtered.length - 1) {
        mainChildren.push(
          new Paragraph({
            spacing: { before: 200, after: 200 },
            border: {
              bottom: { style: BorderStyle.DASHED, size: 1, color: 'E2E8F0' }
            }
          })
        );
      }
    });
  }

  // Books Appendix
  if (includeBookAppendix && books.length > 0) {
    mainChildren.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 200, after: 300 },
        children: [
          new TextRun({
            text: `سجل قراءات الكتب والمراجع (${books.length})`,
            size: 32,
            bold: true,
            color: '047857',
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      })
    );

    const bookRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'عنوان الكتاب', bold: true, color: 'FFFFFF', font: 'Amiri', rightToLeft: true })] })]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'المؤلف', bold: true, color: 'FFFFFF', font: 'Amiri', rightToLeft: true })] })]
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'الصفحات المنجزة', bold: true, color: 'FFFFFF', font: 'Amiri', rightToLeft: true })] })]
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: 'الحالة', bold: true, color: 'FFFFFF', font: 'Amiri', rightToLeft: true })] })]
          })
        ]
      })
    ];

    books.forEach(b => {
      const shelfStatus = b.shelf === 'Finished' ? 'تمت قراءته بنجاح ✅' : b.shelf === 'Reading' ? 'قيد القراءة 📖' : 'في قائمة القراءة ⏳';
      bookRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: b.title, bold: true, color: '0F172A', font: 'Amiri', rightToLeft: true })] })]
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: b.author || '—', color: '475569', font: 'Amiri', rightToLeft: true })] })]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: `${b.currentPage} من ${b.totalPages} صفحة`, color: '334155', font: 'Amiri', rightToLeft: true })] })]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [new TextRun({ text: shelfStatus, color: '047857', font: 'Amiri', rightToLeft: true })] })]
            })
          ]
        })
      );
    });

    mainChildren.push(
      new Table({
        visuallyRightToLeft: true,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'F1F5F9' },
          insideVertical: { style: BorderStyle.NONE }
        },
        rows: bookRows
      })
    );
  }

  // Header & Footer
  const header = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        children: [
          new TextRun({
            text: `${bookTitle} • ${authorName}`,
            size: 18,
            color: '94A3B8',
            font: 'Amiri',
            rightToLeft: true
          })
        ]
      })
    ]
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        children: [
          new TextRun({ text: 'صفحة ', size: 18, color: '94A3B8', font: 'Amiri', rightToLeft: true }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '94A3B8' }),
          new TextRun({ text: ' من ', size: 18, color: '94A3B8', font: 'Amiri', rightToLeft: true }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '94A3B8' })
        ]
      })
    ]
  });

  sections.push({
    properties: includeCoverPage ? { type: SectionType.CONTINUOUS } : {},
    headers: { default: header },
    footers: { default: footer },
    children: mainChildren
  });

  const doc = new Document({
    title: bookTitle,
    description: subtitle,
    creator: authorName,
    styles: {
      default: {
        document: {
          run: {
            font: 'Amiri',
            size: 24,
            color: '1E293B',
            rightToLeft: true
          },
          paragraph: {
            alignment: AlignmentType.RIGHT
          }
        }
      }
    },
    sections
  });

  const blob = await Packer.toBlob(doc);
  const sanitizedTitle = bookTitle.replace(/[/\\?%*:|"<>]/g, '_');
  const filename = `${sanitizedTitle}_${exportDate}.docx`;

  return {
    blob,
    filename,
    totalEntries: filtered.length,
    totalWords
  };
}

/**
 * Initiates direct browser download of the Word document (.docx)
 */
export async function exportJournalToWord(
  entries: JournalEntry[],
  options: WordExportOptions = {}
): Promise<WordExportResult> {
  const result = await generateJournalDocx(entries, options);

  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    const url = URL.createObjectURL(result.blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = result.filename;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return result;
}
