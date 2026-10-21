import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';

describe('Sprint 1 — Universal Content Management & Deletion Tombstones', () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('deleting a book removes its resource and details, preserves linked skills, and records a tombstone', async () => {
    const store = useAppStore.getState();

    // 1. Add a skill
    await store.addSkill('Solid State Physics', 'HARD_TECH', 5);
    const skills = await db.skills.toArray();
    const skillId = skills[0].id;

    // 2. Add a book
    await store.addBook('Introduction to Solid State Physics', 'Charles Kittel', 600);
    const books = await db.learningResources.where('type').equals('BOOK').toArray();
    const bookId = books[0].id;

    // 3. Link book to skill
    await store.linkSkillResource(skillId, bookId);
    let links = await db.skillResources.where('skillId').equals(skillId).toArray();
    expect(links.length).toBe(1);

    // 4. Delete the book
    await store.deleteBook(bookId);

    // Verify book is gone from learningResources and bookDetails
    const bookResource = await db.learningResources.get(bookId);
    expect(bookResource).toBeUndefined();

    const bookDetail = await db.bookDetails.get(bookId);
    expect(bookDetail).toBeUndefined();

    // Verify linked skill is STILL INTACT!
    const skill = await db.skills.get(skillId);
    expect(skill).toBeDefined();

    // Verify junction link was cleanly cleaned up
    links = await db.skillResources.where('skillId').equals(skillId).toArray();
    expect(links.length).toBe(0);

    // Verify tombstone was recorded
    const tombstones = await db.tombstones.where('entityId').equals(bookId).toArray();
    expect(tombstones.length).toBe(1);
    expect(tombstones[0].entityType).toBe('BOOK');
  });

  it('deleting a category with UNCATEGORIZE option preserves child resources while removing the category', async () => {
    const store = useAppStore.getState();

    // 1. Add category
    const catId = await store.addCategory({
      name: 'Nanotech Papers',
      type: 'RESOURCE',
      color: '#38bdf8',
      sortOrder: 1
    });

    // 2. Add resource attached to category
    const resId = `res-test-${Date.now()}`;
    await db.learningResources.add({
      id: resId,
      title: 'Carbon Nanotubes Water Filter Review',
      type: 'PAPER',
      categoryId: catId,
      status: 'PLANNED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 3. Delete category with UNCATEGORIZE
    await store.deleteCategoryWithOption(catId, 'UNCATEGORIZE');

    // Category should be deleted
    const cat = await db.categories.get(catId);
    expect(cat).toBeUndefined();

    // Resource should still exist, but with categoryId undefined
    const res = await db.learningResources.get(resId);
    expect(res).toBeDefined();
    expect(res?.categoryId).toBeUndefined();

    // Tombstone recorded
    const tombstones = await db.tombstones.where('entityId').equals(catId).toArray();
    expect(tombstones.length).toBe(1);
  });

  it('editing a book updates title, author, totalPages, and shelf reactively', async () => {
    const store = useAppStore.getState();

    await store.addBook('Original Title', 'Original Author', 200);
    const books = await db.learningResources.where('type').equals('BOOK').toArray();
    const bookId = books[0].id;

    await store.editBook(bookId, {
      title: 'Updated Title 2026',
      author: 'Dr. Expert',
      totalPages: 350,
      shelf: 'Finished'
    });

    const updatedRes = await db.learningResources.get(bookId);
    expect(updatedRes?.title).toBe('Updated Title 2026');

    const updatedDetails = await db.bookDetails.get(bookId);
    expect(updatedDetails?.author).toBe('Dr. Expert');
    expect(updatedDetails?.totalPages).toBe(350);
    expect(updatedDetails?.shelf).toBe('Finished');
  });
});
