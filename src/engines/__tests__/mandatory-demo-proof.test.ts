import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';
import { recommendBestNextAction } from '../recommender';
import { getCairoPrayerTimes } from '../prayer';

describe('Mandatory Life OS Proof Demo (Fresh Test Profile)', () => {
  beforeEach(async () => {
    // Isolated clean test profile
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear();
      }
    });
  });

  it('demonstrates the complete connected lifecycle: Vision -> Goal -> Milestone -> Skills -> Shared Resources -> Task Execution -> Explained Recommender -> 3-Miss Postponement -> Full Backup Roundtrip', async () => {
    const store = useAppStore.getState();

    // ----------------------------------------------------
    // STEP 1: Create Annual Goal
    // ----------------------------------------------------
    const goalId = await store.createGoal({
      title: 'Qualify for a Semiconductor Internship',
      whyItMatters: 'Build real experimental & computational physics competence for chip fabrication',
      horizon: 'ANNUAL',
      targetDate: '2027-06-30',
      status: 'IN_PROGRESS',
      isArchived: false
    });
    expect(goalId).toBeDefined();

    let goal = await db.goals.get(goalId);
    expect(goal?.title).toBe('Qualify for a Semiconductor Internship');
    expect(goal?.progressPercentage).toBe(0);

    // ----------------------------------------------------
    // STEP 2: Create Q1 Milestone & Steps
    // ----------------------------------------------------
    const milestoneId = await store.addGoalMilestone({
      goalId,
      title: 'Q1: Complete Device Physics & Lab Simulation',
      targetDate: '2027-03-31',
      status: 'PENDING',
      weight: 60,
      sortOrder: 1
    });
    expect(milestoneId).toBeDefined();

    // ----------------------------------------------------
    // STEP 3: Add Skills
    // ----------------------------------------------------
    await store.addSkill('Semiconductor Physics', 'علمي', 5);
    await store.addSkill('Python', 'تقني', 5);

    const skills = await db.skills.toArray();
    const semiSkill = skills.find(s => s.name === 'Semiconductor Physics');
    const pythonSkill = skills.find(s => s.name === 'Python');
    expect(semiSkill).toBeDefined();
    expect(pythonSkill).toBeDefined();

    // ----------------------------------------------------
    // STEP 4: Add Canonical Resources (Book, Course, Video)
    // ----------------------------------------------------
    // Add Book
    await store.addBook('Physics of Semiconductor Devices', 'Sze & Ng', 800);
    // Add Course
    const courseResId = await store.addCourseResource(
      'MIT 6.012 Microelectronic Devices and Circuits',
      'https://ocw.mit.edu',
      'Prof. Jesus del Alamo',
      180,
      14
    );
    // Add Video
    const videoResId = `res-video-${Date.now()}`;
    await db.learningResources.add({
      id: videoResId,
      type: 'VIDEO',
      title: 'Quantum Tunneling in MOSFETs',
      sourceUrl: 'https://youtube.com/watch?v=demo',
      provider: 'YouTube',
      status: 'PLANNED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Link Course to BOTH Semiconductor Physics AND Python without duplicating the course!
    await store.linkSkillResource(semiSkill!.id, courseResId);
    await store.linkSkillResource(pythonSkill!.id, courseResId);

    // Verify canonical deduplication: exactly 1 course record, but 2 junction links!
    const allCourses = await db.learningResources.where('id').equals(courseResId).toArray();
    expect(allCourses.length).toBe(1);

    const courseLinks = await db.skillResources.where('resourceId').equals(courseResId).toArray();
    expect(courseLinks.length).toBe(2);

    // ----------------------------------------------------
    // STEP 5: Create a Task linked to the Goal & University
    // ----------------------------------------------------
    await store.addTask(
      'Study Molecular Spectroscopy & Band Gap Calculations',
      'P1_URGENT_IMPORTANT',
      45,
      '2026-10-22',
      goalId,
      semiSkill!.id
    );

    const allTasks = await db.tasks.toArray();
    const studyTask = allTasks.find(t => t.goalId === goalId);
    expect(studyTask).toBeDefined();

    // ----------------------------------------------------
    // STEP 6: Recommender Explains Goal Contribution
    // ----------------------------------------------------
    const prayers = getCairoPrayerTimes();
    const recommendation = recommendBestNextAction(
      allTasks,
      prayers,
      [],
      [],
      new Date(),
      [goal!]
    );

    expect(recommendation).toBeDefined();
    expect(recommendation?.task.id).toBe(studyTask!.id);
    expect(recommendation?.rationaleArabic).toContain('Qualify for a Semiconductor Internship');

    // Complete the task and check explained progress
    await store.completeTask(studyTask!.id);

    goal = await db.goals.get(goalId);
    // 1 task done = 100% of task contribution
    expect(goal?.progressPercentage).toBeGreaterThan(0);

    // Complete the Q1 Milestone
    await store.toggleMilestone(milestoneId);
    goal = await db.goals.get(goalId);
    expect(goal?.progressPercentage).toBe(100);
    expect(goal?.status).toBe('ACHIEVED');

    // ----------------------------------------------------
    // STEP 7: 3-Miss Postponement Adaptive Intervention
    // ----------------------------------------------------
    await store.addTask('Follow up with Falcon Packaging Supplier', 'P2_IMPORTANT', 30);
    const falconTasks = await db.tasks.filter(t => t.title === 'Follow up with Falcon Packaging Supplier').toArray();
    const fTask = falconTasks[0];

    // Postpone 1st time
    await store.postponeTask(fTask.id, 'Busy with university labs');
    let updatedFTask = await db.tasks.get(fTask.id);
    expect(updatedFTask?.postponementCount).toBe(1);

    // Postpone 2nd time
    await store.postponeTask(fTask.id, 'Shifted to evening');
    updatedFTask = await db.tasks.get(fTask.id);
    expect(updatedFTask?.postponementCount).toBe(2);

    // Postpone 3rd time (Threshold Intervention Trigger)
    await store.postponeTask(fTask.id, 'Need to break into smaller steps');
    updatedFTask = await db.tasks.get(fTask.id);
    expect(updatedFTask?.postponementCount).toBe(3);

    const checkRec = recommendBestNextAction(
      [updatedFTask!],
      prayers,
      [],
      [],
      new Date(),
      []
    );
    expect(checkRec?.isPostponementIntervention).toBe(true);
    expect(checkRec?.interventionProposal).toContain('المهمة دي اتأجلت 3 مرات');

    // ----------------------------------------------------
    // STEP 8: Export All Data & Restore on Clean Profile
    // ----------------------------------------------------
    const exportedBackup = await store.exportBackupJSON();
    expect(exportedBackup).toBeDefined();

    const parsed = JSON.parse(exportedBackup);
    expect(parsed.version).toBe(2);
    expect(parsed.goals.length).toBe(1);
    expect(parsed.goalMilestones.length).toBe(1);
    expect(parsed.skills.length).toBe(2);
    expect(parsed.skillResources.length).toBe(2);
    expect(parsed.taskPostponements.length).toBe(3);

    // Wipe test profile
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear();
      }
    });

    expect(await db.goals.count()).toBe(0);
    expect(await db.skills.count()).toBe(0);
    expect(await db.skillResources.count()).toBe(0);

    // Restore to clean profile
    const restored = await store.importBackupJSON(exportedBackup);
    expect(restored).toBe(true);

    // Verify 100% identical relationships
    const restoredGoal = await db.goals.get(goalId);
    expect(restoredGoal?.title).toBe('Qualify for a Semiconductor Internship');
    expect(restoredGoal?.progressPercentage).toBe(100);

    const restoredCourseLinks = await db.skillResources.where('resourceId').equals(courseResId).toArray();
    expect(restoredCourseLinks.length).toBe(2);

    const restoredPostponements = await db.taskPostponements.where('taskId').equals(fTask.id).toArray();
    expect(restoredPostponements.length).toBe(3);
  });
});
