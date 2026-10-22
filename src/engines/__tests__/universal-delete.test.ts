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

  it('deleting a skill removes the skill, cleans up skillResources junction links and evidence, and records a tombstone', async () => {
    const store = useAppStore.getState();

    // 1. Add skill
    await store.addSkill('Quantum Computing', 'علمي', 5);
    const skills = await db.skills.toArray();
    const skillId = skills[0].id;

    // 2. Add book & link to skill
    await store.addBook('Quantum Mechanics in Action', 'Physicist', 400);
    const books = await db.learningResources.where('type').equals('BOOK').toArray();
    const bookId = books[0].id;
    await store.linkSkillResource(skillId, bookId);

    // 3. Add task linked to skill
    await store.addTask('Review Quantum Circuit Exercises', 'P1_URGENT_IMPORTANT', 45, undefined, undefined, skillId);
    const tasks = await db.tasks.where('skillId').equals(skillId).toArray();
    expect(tasks.length).toBe(1);

    // 4. Delete the skill
    await store.deleteSkill(skillId);

    // Verify skill is gone from db.skills
    const deletedSkill = await db.skills.get(skillId);
    expect(deletedSkill).toBeUndefined();

    // Verify junction links are cleaned up
    const links = await db.skillResources.where('skillId').equals(skillId).toArray();
    expect(links.length).toBe(0);

    // Verify the book is STILL intact!
    const book = await db.learningResources.get(bookId);
    expect(book).toBeDefined();

    // Verify task is still intact, but with skillId detached
    const task = await db.tasks.get(tasks[0].id);
    expect(task).toBeDefined();
    expect(task?.skillId).toBeUndefined();

    // Verify tombstone is recorded
    const tombstones = await db.tombstones.where('entityId').equals(skillId).toArray();
    expect(tombstones.length).toBe(1);
    expect(tombstones[0].entityType).toBe('SKILL');
  });

  it('updating a skill updates its name, category, and targetLevel', async () => {
    const store = useAppStore.getState();

    await store.addSkill('Python 101', 'تقني', 3);
    const skills = await db.skills.toArray();
    const skillId = skills[0].id;

    await store.updateSkill(skillId, {
      name: 'Advanced Python Architecture',
      category: 'بزنس',
      targetLevel: 8
    });

    const updated = await db.skills.get(skillId);
    expect(updated?.name).toBe('Advanced Python Architecture');
    expect(updated?.category).toBe('بزنس');
    expect(updated?.targetLevel).toBe(8);
  });

  it('deleteTask removes the task, its schedule blocks, and records a tombstone', async () => {
    const store = useAppStore.getState();

    await store.addTask('Study Lecture 1 Summary', 'P1_URGENT_IMPORTANT', 45);
    const tasks = await db.tasks.toArray();
    const taskId = tasks[0].id;

    // Add a schedule block for this task
    await db.scheduleBlocks.put({
      id: `sched-${taskId}`,
      taskId,
      title: 'Study Lecture 1 Summary',
      day: 'السبت',
      startTime: '10:00',
      endTime: '10:45',
      durationMinutes: 45,
      type: 'TASK',
      isLocked: false
    });

    // Delete the task
    await store.deleteTask(taskId);

    // Verify task is gone
    const deleted = await db.tasks.get(taskId);
    expect(deleted).toBeUndefined();

    // Verify schedule block is gone
    const block = await db.scheduleBlocks.get(`sched-${taskId}`);
    expect(block).toBeUndefined();

    // Verify tombstone is recorded
    const tombstones = await db.tombstones.where('entityId').equals(taskId).toArray();
    expect(tombstones.length).toBe(1);
    expect(tombstones[0].entityType).toBe('TASK');
  });

  it('cleanupLegacyDemoArtifacts purges legacy Band Gap task and records tombstone', async () => {
    const { cleanupLegacyDemoArtifacts } = await import('../../db');

    // Simulate legacy task present in db
    await db.tasks.put({
      id: 'task-semi-review',
      title: 'مراجعة محاضرة Band Gap Engineering وحل مسألة عليها',
      priority: 'P1_URGENT_IMPORTANT',
      status: 'TODO',
      estimatedMinutes: 35,
      isLocked: false,
      postponementCount: 0,
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await cleanupLegacyDemoArtifacts();

    // Verify task was deleted
    const task = await db.tasks.get('task-semi-review');
    expect(task).toBeUndefined();

    // Verify tombstone was created
    const tombstone = await db.tombstones.get('tomb-task-task-semi-review');
    expect(tombstone).toBeDefined();
    expect(tombstone?.entityType).toBe('TASK');
  });
});
