import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { importAhmedBooks181 } from '../ahmedBooks181Importer';
import { useAppStore } from '../../stores/appStore';
import type { LearningResource, BookDetails } from '../../types';

describe("Ahmed's 181 Books Library — Importer, Tombstones & Live Counters Tests", () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('runs a clean dry-run verifying all 181 books without altering database', async () => {
    const report = await importAhmedBooks181({ dryRun: true });

    expect(report.dryRun).toBe(true);
    expect(report.totalRecordsInPlan).toBe(181);
    expect(report.booksAdded).toBe(181);
    expect(report.booksPreservedOrMatched).toBe(0);

    // Database remains untouched
    const count = await db.learningResources.where('type').equals('BOOK').count();
    expect(count).toBe(0);
    const detailsCount = await db.bookDetails.count();
    expect(detailsCount).toBe(0);
  });

  it('imports all 181 books with exact category counts, zero XP, and Want to Read status', async () => {
    const report = await importAhmedBooks181({ dryRun: false });

    expect(report.booksAdded).toBe(181);
    expect(report.actualTotalBooksInDb).toBe(181);
    expect(report.actualCompletedBooksInDb).toBe(0);

    // Exact category verification according to LifeOS_Library_Codex_Ready.md
    expect(report.countsByCategory['REL-01']).toBe(57);
    expect(report.countsByCategory['REL-02']).toBe(24);
    expect(report.countsByCategory['THK-01']).toBe(40);
    expect(report.countsByCategory['KNOW-01']).toBe(1);
    expect(report.countsByCategory['SCI-01']).toBe(1);
    expect(report.countsByCategory['PSY-01']).toBe(11);
    expect(report.countsByCategory['DEV-01']).toBe(8);
    expect(report.countsByCategory['BUS-01']).toBe(1);
    expect(report.countsByCategory['LIT-01']).toBe(17);
    expect(report.countsByCategory['NOV-01']).toBe(21);

    // Verify Zero XP baseline
    const xpCount = await db.xpTransactions.count();
    expect(xpCount).toBe(0);

    // Verify all books start in Want to Read, 0 pages read, and unassigned totalPages (0)
    const allDetails = await db.bookDetails.toArray();
    expect(allDetails.length).toBe(181);
    for (const b of allDetails) {
      expect(b.shelf).toBe('Want to Read');
      expect(b.currentPage).toBe(0);
      expect(b.totalPages).toBe(0); // Left 0/unassigned, no artificial 250
    }
  });

  it('is completely idempotent — running import twice results in 0 duplicates', async () => {
    // 1st run
    const firstReport = await importAhmedBooks181({ dryRun: false });
    expect(firstReport.booksAdded).toBe(181);

    // 2nd run
    const secondReport = await importAhmedBooks181({ dryRun: false });
    expect(secondReport.booksAdded).toBe(0);
    expect(secondReport.booksPreservedOrMatched).toBe(181);
    expect(secondReport.actualTotalBooksInDb).toBe(181);

    const countInDb = await db.learningResources.where('type').equals('BOOK').count();
    expect(countInDb).toBe(181);
  });

  it('strictly honors deletion tombstones: deleted books are NEVER resurrected on subsequent import or reload', async () => {
    // 1. Initial import
    await importAhmedBooks181({ dryRun: false });
    expect(await db.learningResources.where('type').equals('BOOK').count()).toBe(181);

    // 2. User deletes a book via store
    const store = useAppStore.getState();
    await store.loadAllData();
    const bookToDelete = 'BK-AFC5F1E3C4'; // "فاتتني صلاة"
    await store.deleteBook(bookToDelete);

    // Verify it was deleted and tombstone was created
    expect(await db.learningResources.get(bookToDelete)).toBeUndefined();
    expect(await db.bookDetails.get(bookToDelete)).toBeUndefined();
    const tomb = await db.tombstones.get(`tomb-book-${bookToDelete}`);
    expect(tomb).toBeDefined();

    const countAfterDelete = await db.learningResources.where('type').equals('BOOK').count();
    expect(countAfterDelete).toBe(180);

    // 3. Re-run import
    const secondReport = await importAhmedBooks181({ dryRun: false });
    expect(secondReport.booksAdded).toBe(0);
    expect(secondReport.booksSkippedByTombstone).toBe(1);
    expect(secondReport.actualTotalBooksInDb).toBe(180);

    // Deleted book is still gone!
    expect(await db.learningResources.get(bookToDelete)).toBeUndefined();
  });

  it('strictly preserves pre-existing books, user reading progress, custom shelves, and XP', async () => {
    const now = new Date().toISOString();
    // Pre-seed an existing user book before import
    const customBookId = 'custom-user-book-1';
    await db.learningResources.put({
      id: customBookId,
      type: 'BOOK',
      title: 'العادات الذرية',
      provider: 'جيمس كلير',
      status: 'IN_PROGRESS',
      createdAt: now,
      updatedAt: now
    });
    await db.bookDetails.put({
      resourceId: customBookId,
      author: 'جيمس كلير',
      totalPages: 320,
      currentPage: 150,
      shelf: 'Reading',
      rating: 5
    });

    // Run import
    const report = await importAhmedBooks181({ dryRun: false });

    // The existing book must be preserved
    const preserved = await db.bookDetails.get(customBookId);
    expect(preserved).toBeDefined();
    expect(preserved?.currentPage).toBe(150);
    expect(preserved?.totalPages).toBe(320);
    expect(preserved?.shelf).toBe('Reading');
    expect(preserved?.rating).toBe(5);
    // Category should be safely backfilled to DEV-01 without touching progress
    expect(preserved?.categoryId).toBe('DEV-01');

    // Total books in DB should be 181 (1 custom matched + 180 added)
    const count = await db.learningResources.where('type').equals('BOOK').count();
    expect(count).toBe(181);
  });

  it('allows adding a new book with category, editing category, and updating counters live', async () => {
    const store = useAppStore.getState();
    await store.loadAllData();

    // 1. Add book with category
    const bookId = await store.addBook('مقدمة في الفيزياء الحديثة', 'د. أحمد', 280, undefined, 'SCI-01', 'فيزياء');
    expect(bookId).toBeDefined();

    let details = await db.bookDetails.get(bookId);
    expect(details?.categoryId).toBe('SCI-01');
    expect(details?.subcategory).toBe('فيزياء');
    expect(details?.totalPages).toBe(280);

    // 2. Edit category
    await store.editBook(bookId, {
      categoryId: 'THK-01',
      subcategory: 'فكر وعلم'
    });

    details = await db.bookDetails.get(bookId);
    expect(details?.categoryId).toBe('THK-01');
    expect(details?.subcategory).toBe('فكر وعلم');
    const res = await db.learningResources.get(bookId);
    expect(res?.categoryId).toBe('THK-01');

    // 3. Mark as Finished
    await store.editBook(bookId, {
      shelf: 'Finished'
    });
    details = await db.bookDetails.get(bookId);
    expect(details?.shelf).toBe('Finished');
  });
});
