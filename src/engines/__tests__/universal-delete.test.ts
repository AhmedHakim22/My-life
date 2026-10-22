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

  it('uncompleting a task reverts status to TODO and rolls back awarded XP', async () => {
    const store = useAppStore.getState();

    await store.addTask('Quantum Mechanics Problem Set', 'P1_URGENT_IMPORTANT', 45);
    const tasks = await db.tasks.toArray();
    const taskId = tasks[0].id;

    // 1. Complete task -> awards 50 XP
    await store.completeTask(taskId);
    let task = await db.tasks.get(taskId);
    expect(task?.status).toBe('DONE');

    let xpList = await db.xpTransactions.toArray();
    expect(xpList.some(tx => tx.reason.includes('Quantum Mechanics Problem Set'))).toBe(true);

    // 2. Undo/Uncomplete task
    await store.uncompleteTask(taskId);
    task = await db.tasks.get(taskId);
    expect(task?.status).toBe('TODO');

    // XP transaction must be rolled back!
    xpList = await db.xpTransactions.toArray();
    expect(xpList.some(tx => tx.reason.includes('Quantum Mechanics Problem Set'))).toBe(false);
  });

  it('toggleTaskStatus switches task between DONE and TODO seamlessly', async () => {
    const store = useAppStore.getState();

    await store.addTask('Prepare Falcon Marketing Reel', 'P2_IMPORTANT', 30);
    const tasks = await db.tasks.toArray();
    const taskId = tasks[0].id;

    // Toggle 1: TODO -> DONE
    await store.toggleTaskStatus(taskId);
    let task = await db.tasks.get(taskId);
    expect(task?.status).toBe('DONE');

    // Toggle 2: DONE -> TODO
    await store.toggleTaskStatus(taskId);
    task = await db.tasks.get(taskId);
    expect(task?.status).toBe('TODO');
  });

  it('deleting a journal entry removes it from IndexedDB and records a tombstone', async () => {
    const store = useAppStore.getState();

    await store.addJournalEntry('خاطرة تجريبية يراد حذفها', 'FREE_WRITING', ['#تجربة']);
    const entries = await db.journalEntries.toArray();
    expect(entries.length).toBe(1);
    const entryId = entries[0].id;

    await store.deleteJournalEntry(entryId);

    const remaining = await db.journalEntries.toArray();
    expect(remaining.length).toBe(0);

    const tombstone = await db.tombstones.get(`tomb-journal-${entryId}`);
    expect(tombstone).toBeDefined();
    expect(tombstone?.entityType).toBe('JOURNAL');
    expect(tombstone?.entityId).toBe(entryId);
  });

  it('toggleHabitToday toggles habit ON and reliably OFF (undo), reverting streak, date and XP', async () => {
    const store = useAppStore.getState();

    // Seed habit
    await db.habits.add({
      id: 'habit-test-undo',
      title: 'رياضة الصباح',
      targetType: 'BOOLEAN',
      targetValue: 1,
      streakCount: 3,
      consecutiveMisses: 0,
      restDays: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    await store.loadAllData();

    // Step 1: Toggle ON
    await store.toggleHabitToday('habit-test-undo');
    let habit = await db.habits.get('habit-test-undo');
    expect(habit?.streakCount).toBe(4);
    expect(habit?.lastCompletedDate).toBeDefined();
    let logs = await db.habitLogs.where('habitId').equals('habit-test-undo').toArray();
    expect(logs.length).toBe(1);
    let xps = await db.xpTransactions.where('category').equals('HABIT').toArray();
    expect(xps.length).toBe(1);

    // Step 2: Toggle OFF (Undo)
    await store.toggleHabitToday('habit-test-undo');
    habit = await db.habits.get('habit-test-undo');
    expect(habit?.streakCount).toBe(3);
    expect(habit?.lastCompletedDate).toBeUndefined();
    logs = await db.habitLogs.where('habitId').equals('habit-test-undo').toArray();
    expect(logs.length).toBe(0);
    xps = await db.xpTransactions.where('category').equals('HABIT').toArray();
    expect(xps.length).toBe(0);
  });

  it('prayer worship toggle and delete removes record from worshipLogs', async () => {
    const store = useAppStore.getState();

    // Step 1: Log prayer
    await store.logPrayerWorship('Fajr', 'COMPLETED', true);
    let logs = await db.worshipLogs.toArray();
    expect(logs.length).toBe(1);
    expect(logs[0].prayerName).toBe('Fajr');
    expect(logs[0].inMosque).toBe(true);

    // Step 2: Clicking the SAME active button toggles it off
    await store.logPrayerWorship('Fajr', 'COMPLETED', true);
    logs = await db.worshipLogs.toArray();
    expect(logs.length).toBe(0);

    // Step 3: Log again and use explicit deletePrayerWorship
    await store.logPrayerWorship('Dhuhr', 'COMPLETED', false);
    logs = await db.worshipLogs.toArray();
    expect(logs.length).toBe(1);
    expect(logs[0].prayerName).toBe('Dhuhr');

    await store.deletePrayerWorship('Dhuhr');
    logs = await db.worshipLogs.toArray();
    expect(logs.length).toBe(0);
  });

  it('deleteQuranLog removes reading session and reverts habit if today threshold is not met', async () => {
    const store = useAppStore.getState();

    // Seed habit-quran
    await db.habits.add({
      id: 'habit-quran',
      title: 'الورد القرآني (3 صفحات يومياً)',
      targetType: 'PAGES',
      targetValue: 3,
      streakCount: 5,
      consecutiveMisses: 0,
      restDays: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    await store.loadAllData();

    // Step 1: Log 5 pages of Quran (meets 3 pages)
    await store.logQuranReading(5, 'سورة الكهف');
    let qLogs = await db.quranLogs.toArray();
    expect(qLogs.length).toBe(1);
    let qHabit = await db.habits.get('habit-quran');
    expect(qHabit?.streakCount).toBe(6);

    // Step 2: Delete Quran reading log
    await store.deleteQuranLog(qLogs[0].id);
    qLogs = await db.quranLogs.toArray();
    expect(qLogs.length).toBe(0);

    // Quran habit must be reverted!
    qHabit = await db.habits.get('habit-quran');
    expect(qHabit?.streakCount).toBe(5);
    expect(qHabit?.lastCompletedDate).toBeUndefined();
  });

  it('undoReadTwoPagesAction rolls back book current page, reading session, habit, and XP', async () => {
    const store = useAppStore.getState();

    // 1. Seed book
    await store.addBook('Quantum Nanotechnology', 'Prof. Smith', 100);
    const books = await db.learningResources.where('type').equals('BOOK').toArray();
    const bookId = books[0].id;

    // 2. Read 2 pages
    await store.readTwoPagesAction(bookId);
    let details = await db.bookDetails.get(bookId);
    expect(details?.currentPage).toBe(2);
    let sessions = await db.readingSessions.where('bookResourceId').equals(bookId).toArray();
    expect(sessions.length).toBe(1);
    let xps = await db.xpTransactions.where('category').equals('READING').toArray();
    expect(xps.length).toBe(1);

    // 3. Undo read 2 pages
    await store.undoReadTwoPagesAction(bookId);
    details = await db.bookDetails.get(bookId);
    expect(details?.currentPage).toBe(0);
    sessions = await db.readingSessions.where('bookResourceId').equals(bookId).toArray();
    expect(sessions.length).toBe(0);
    xps = await db.xpTransactions.where('category').equals('READING').toArray();
    expect(xps.length).toBe(0);
  });
});
