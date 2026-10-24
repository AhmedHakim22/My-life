import { db, takePreMigrationSnapshot } from '../db';
import {
  AHMED_BOOKS_181_DATA,
  BOOK_CATEGORIES,
  type RawBookItem,
  type BookCategoryDef
} from '../db/ahmedBooks181Data';
import type { LearningResource, BookDetails } from '../types';

export interface BooksImportReport {
  dryRun: boolean;
  totalRecordsInPlan: number;
  booksAdded: number;
  booksPreservedOrMatched: number;
  booksSkippedByTombstone: number;
  actualTotalBooksInDb: number;
  actualCompletedBooksInDb: number;
  countsByCategory: Record<string, number>;
}

/**
 * Normalizes Arabic text for safe, conservative title & author matching.
 */
export function normalizeArabicText(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove tashkeel / harakat
    .replace(/[\s\-_—–:،,]+/g, ' ')
    .trim();
}

/**
 * Idempotent, safe, non-destructive importer for Ahmed's 181 Books Library.
 * - Imports all 181 books from LifeOS_Library_Codex_Ready.md.
 * - Preserves ALL existing books, user progress, page numbers, shelves, notes, and XP.
 * - Strictly 0 XP baseline: new books start in 'Want to Read' with 0 pages read.
 * - Leaves totalPages as 0 (no fake 250 pages).
 * - Honors deletion tombstones: deleted books are NEVER resurrected.
 * - Running multiple times produces 0 duplicates.
 */
export async function importAhmedBooks181(options: { dryRun?: boolean } = {}): Promise<BooksImportReport> {
  const dryRun = options.dryRun ?? false;
  const now = new Date().toISOString();

  // 1. Fetch current database state
  const existingResources = await db.learningResources.where('type').equals('BOOK').toArray();
  const existingBookDetails = await db.bookDetails.toArray();
  const tombstones = await db.tombstones.toArray();

  // Set of deleted book IDs that must NEVER be resurrected
  const deletedIds = new Set(
    tombstones
      .filter(t => t.entityType === 'BOOK' || t.entityType === 'RESOURCE')
      .map(t => t.entityId)
  );

  // Maps for existing books matching
  const resourceById = new Map<string, LearningResource>();
  const detailsById = new Map<string, BookDetails>();
  const resourceByNormalizedKey = new Map<string, LearningResource>();

  for (const r of existingResources) {
    resourceById.set(r.id, r);
    const normKey = `${normalizeArabicText(r.title)}:::${normalizeArabicText(r.provider)}`;
    resourceByNormalizedKey.set(normKey, r);
  }

  for (const b of existingBookDetails) {
    detailsById.set(b.resourceId, b);
  }

  let booksAdded = 0;
  let booksPreservedOrMatched = 0;
  let booksSkippedByTombstone = 0;

  const resourcesToPut: LearningResource[] = [];
  const detailsToPut: BookDetails[] = [];

  // 2. Process all 181 books
  for (const item of AHMED_BOOKS_181_DATA) {
    // A. Check if user intentionally deleted this book in the past
    if (deletedIds.has(item.id)) {
      booksSkippedByTombstone++;
      continue;
    }

    // B. Check if book already exists by ID
    const existingById = resourceById.get(item.id);
    // C. Check if book already exists by Normalized Title + Author
    const normKey = `${normalizeArabicText(item.title)}:::${normalizeArabicText(item.author)}`;
    const existingByNorm = resourceByNormalizedKey.get(normKey);

    const existingMatch = existingById || existingByNorm;

    if (existingMatch) {
      booksPreservedOrMatched++;
      // Only backfill categoryId if missing or UNCATEGORIZED
      const currentDetails = detailsById.get(existingMatch.id);
      const needsCategoryUpdate = !existingMatch.categoryId || 
                                  existingMatch.categoryId === 'UNCATEGORIZED' ||
                                  !currentDetails?.categoryId ||
                                  currentDetails.categoryId === 'UNCATEGORIZED';

      if (needsCategoryUpdate && !dryRun) {
        // Safe category backfill without touching user's progress or shelf
        resourcesToPut.push({
          ...existingMatch,
          categoryId: item.categoryId,
          updatedAt: now
        });
        if (currentDetails) {
          detailsToPut.push({
            ...currentDetails,
            categoryId: item.categoryId,
            subcategory: currentDetails.subcategory || item.subcategory,
            level: currentDetails.level || item.level,
            priority: currentDetails.priority || item.priority
          });
        }
      }
      continue;
    }

    // D. New book to add
    booksAdded++;

    const newResource: LearningResource = {
      id: item.id,
      type: 'BOOK',
      title: item.title,
      description: item.note || undefined,
      sourceUrl: '',
      provider: item.author || 'مؤلف غير محدد',
      categoryId: item.categoryId,
      status: 'IN_PROGRESS',
      createdAt: now,
      updatedAt: now
    };

    const newDetails: BookDetails = {
      resourceId: item.id,
      author: item.author || 'مؤلف غير محدد',
      totalPages: 0, // No artificial 250 pages; left unassigned for user's real edition
      currentPage: 0,
      shelf: 'Want to Read',
      categoryId: item.categoryId,
      subcategory: item.subcategory,
      level: item.level,
      priority: item.priority,
      note: item.note || undefined
    };

    resourcesToPut.push(newResource);
    detailsToPut.push(newDetails);

    // Keep local lookup updated to prevent duplicate additions within the same loop
    resourceById.set(item.id, newResource);
    resourceByNormalizedKey.set(normKey, newResource);
  }

  // 3. Persist atomically if not dryRun
  if (!dryRun && (resourcesToPut.length > 0 || detailsToPut.length > 0)) {
    await takePreMigrationSnapshot();

    await db.transaction('rw', [
      db.learningResources,
      db.bookDetails,
      db.appMeta
    ], async () => {
      if (resourcesToPut.length > 0) {
        await db.learningResources.bulkPut(resourcesToPut);
      }
      if (detailsToPut.length > 0) {
        await db.bookDetails.bulkPut(detailsToPut);
      }

      // Record migration marker in appMeta
      await db.appMeta.put({
        id: 'ahmed-books-181-seed-v1',
        appliedAt: now,
        booksAdded,
        totalInPlan: AHMED_BOOKS_181_DATA.length
      });
    });
  }

  // 4. Calculate actual live database metrics
  const finalResources = await db.learningResources.where('type').equals('BOOK').toArray();
  const finalDetails = await db.bookDetails.toArray();

  const detailsMap = new Map(finalDetails.map(d => [d.resourceId, d]));
  const countsByCategory: Record<string, number> = {};
  for (const catKey of Object.keys(BOOK_CATEGORIES)) {
    countsByCategory[catKey] = 0;
  }

  let actualCompletedCount = 0;
  for (const r of finalResources) {
    const d = detailsMap.get(r.id);
    const cat = r.categoryId || d?.categoryId || 'UNCATEGORIZED';
    countsByCategory[cat] = (countsByCategory[cat] || 0) + 1;

    if (d?.shelf === 'Finished' || r.status === 'COMPLETED') {
      actualCompletedCount++;
    }
  }

  return {
    dryRun,
    totalRecordsInPlan: AHMED_BOOKS_181_DATA.length,
    booksAdded,
    booksPreservedOrMatched,
    booksSkippedByTombstone,
    actualTotalBooksInDb: finalResources.length,
    actualCompletedBooksInDb: actualCompletedCount,
    countsByCategory
  };
}

/**
 * Automatically seeds Ahmed's 181 Books once per device/profile.
 * Respects previous runs, existing books, and deletion tombstones.
 */
export async function seedAhmedBooks181IfNeeded(): Promise<void> {
  const marker = await db.appMeta.get('ahmed-books-181-seed-v1');
  if (marker) return;

  await importAhmedBooks181({ dryRun: false });
}
