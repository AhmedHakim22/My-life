import { describe, it, expect } from 'vitest';
import { 
  generateJournalWordHtml, 
  generateJournalDocx,
  calculateWordCount, 
  formatArabicDateFriendly,
  exportJournalToWord
} from '../../lib/wordExporter';
import type { JournalEntry } from '../../types';

describe('Word Exporter for Journal & Autobiography', () => {
  const sampleEntries: JournalEntry[] = [
    {
      id: 'entry-1',
      date: '2026-10-15',
      mode: 'FREE_WRITING',
      content: 'اليوم بدأت رحلة تصميم كفرات السيليكون لمشروع فالكون. > "النجاح يبدأ بخطوة صغيرة والتزام يومي مستمر". كان يوماً رائعاً وملهماً.',
      tags: ['#فالكون', '#اقتباسات'],
      createdAt: '2026-10-15T10:00:00Z',
      updatedAt: '2026-10-15T10:00:00Z'
    },
    {
      id: 'entry-2',
      date: '2026-10-20',
      mode: 'GUIDED_5_PROMPTS',
      content: `**ماذا حدث اليوم:** حضرت محاضرة أشباه الموصلات وفهمت Band Gap Engineering
**ما الذي نجح بشكل رائع:** التركيز العالي بدون تشتت
**ما التحدي أو الشيء الصعب:** المسألة الرياضية في الشيت
**ماذا تعلمت واستفدت:** أهمية التكرار والممارسة
**تعديل الغد المقترح:** الاستيقاظ قبل الفجر والمذاكرة مبكراً`,
      tags: ['#يوميات_موجهة', '#جامعة'],
      createdAt: '2026-10-20T20:00:00Z',
      updatedAt: '2026-10-20T20:00:00Z'
    },
    {
      id: 'entry-3',
      date: '2026-10-22',
      mode: 'FREE_WRITING',
      content: '«الحياة ليست ما حدث لك، بل ما تتذكره منها وكيف ترويه لنفسك وللآخرين». تأمل عميق في مسار حياتي وأهدافي الخمسية.',
      tags: ['#تأمل', '#اقتباسات', '#قصة_حياتي'],
      createdAt: '2026-10-22T21:00:00Z',
      updatedAt: '2026-10-22T21:00:00Z'
    }
  ];

  it('formats dates into friendly Arabic with correct day and month names', () => {
    const formatted = formatArabicDateFriendly('2026-10-22');
    expect(formatted).toContain('أكتوبر');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('الخميس');
  });

  it('accurately calculates word counts for Arabic and mixed text', () => {
    const text = 'اليوم كان يوماً مباركاً بحمد الله، أنجزت 3 مهام أساسية.';
    const count = calculateWordCount(text);
    expect(count).toBeGreaterThan(5);
    expect(calculateWordCount('')).toBe(0);
  });

  it('generates a full Microsoft Word document with Office XML, RTL, and styling', () => {
    const result = generateJournalWordHtml(sampleEntries, {
      bookTitle: 'كتاب مذكراتي وتأملاتي',
      authorName: 'أحمد حكيم',
      subtitle: 'مسيرة التعلم والإنجاز',
      sortOrder: 'CHRONOLOGICAL_ASC',
      includeCoverPage: true,
      includeTableOfContents: true,
      books: [
        {
          title: 'العادات الذرية',
          author: 'جيمس كلير',
          currentPage: 150,
          totalPages: 320,
          shelf: 'Reading'
        }
      ]
    });

    expect(result.htmlContent).toContain('xmlns:w="urn:schemas-microsoft-com:office:word"');
    expect(result.htmlContent).toContain('dir="rtl"');
    expect(result.htmlContent).toContain('كتاب مذكراتي وتأملاتي');
    expect(result.htmlContent).toContain('أحمد حكيم');
    expect(result.htmlContent).toContain('العادات الذرية');
    expect(result.htmlContent).toContain('فهرس المحطات واليوميات (3)');
    expect(result.totalEntries).toBe(3);
    expect(result.totalWords).toBeGreaterThan(30);
    expect(result.filename).toContain('.doc');
    expect(result.blob.type).toBe('application/msword;charset=utf-8');
  });

  it('correctly filters entries by tag (e.g. quotes only book)', () => {
    const result = generateJournalWordHtml(sampleEntries, {
      bookTitle: 'كتاب الاقتباسات والأفكار الملهمة',
      authorName: 'أحمد حكيم',
      filterTag: '#اقتباسات'
    });

    expect(result.totalEntries).toBe(2);
    expect(result.htmlContent).toContain('تصميم كفرات السيليكون'); // matches tag #اقتباسات
    expect(result.htmlContent).not.toContain('حضرت محاضرة أشباه الموصلات'); // entry-2 has no #اقتباسات
  });

  it('formats guided prompts with illuminated question and answer sections', () => {
    const result = generateJournalWordHtml([sampleEntries[1]], {
      includeCoverPage: false
    });

    expect(result.htmlContent).toContain('guided-container');
    expect(result.htmlContent).toContain('ماذا حدث اليوم');
    expect(result.htmlContent).toContain('Band Gap Engineering');
    expect(result.htmlContent).toContain('ما الذي نجح بشكل رائع');
    expect(result.htmlContent).toContain('تعديل الغد المقترح');
  });

  it('formats quotes and blockquotes cleanly for print in free writing', () => {
    const result = generateJournalWordHtml([sampleEntries[0], sampleEntries[2]], {
      includeCoverPage: false
    });

    expect(result.htmlContent).toContain('quote-callout');
    expect(result.htmlContent).toContain('النجاح يبدأ بخطوة صغيرة');
    expect(result.htmlContent).toContain('الحياة ليست ما حدث لك');
  });

  it('safely escapes HTML tags in user input to prevent layout corruption', () => {
    const maliciousEntry: JournalEntry = {
      id: 'entry-malicious',
      date: '2026-10-23',
      mode: 'FREE_WRITING',
      content: '<script>alert("hacked")</script> & <b>test</b>',
      tags: ['#test'],
      createdAt: '2026-10-23T12:00:00Z',
      updatedAt: '2026-10-23T12:00:00Z'
    };

    const result = generateJournalWordHtml([maliciousEntry]);
    expect(result.htmlContent).not.toContain('<script>');
    expect(result.htmlContent).toContain('&lt;script&gt;');
  });

  it('generates a native OpenXML .docx document with docx MIME type and headers/footers', async () => {
    const res = await generateJournalDocx(sampleEntries, {
      bookTitle: 'مذكرات ومحطات مَسار',
      authorName: 'أحمد حكيم',
      subtitle: 'مسيرة التعلم والإنجاز',
      includeCoverPage: true,
      includeStatsSummary: true,
      includeTableOfContents: true,
      includeBookAppendix: true,
      books: [
        {
          title: 'العادات الذرية',
          author: 'جيمس كلير',
          currentPage: 150,
          totalPages: 320,
          shelf: 'Reading'
        }
      ]
    });

    expect(res.filename.endsWith('.docx')).toBe(true);
    expect(res.blob.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(res.totalEntries).toBe(3);
    expect(res.totalWords).toBeGreaterThan(30);
    expect(res.blob.size).toBeGreaterThan(5000);
  });

  it('runs exportJournalToWord in non-browser environment safely without crashing', async () => {
    // In Node / Vitest, window is undefined or mock
    const res = await exportJournalToWord(sampleEntries);
    expect(res).toBeDefined();
    expect(res.totalEntries).toBe(3);
    expect(res.blob).toBeInstanceOf(Blob);
    expect(res.filename.endsWith('.docx')).toBe(true);
    expect(res.blob.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  });
});
