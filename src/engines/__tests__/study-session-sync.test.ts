import { describe, it, expect } from 'vitest';
import { mergeStudySessionRecord } from '../../lib/sync';
import type { StudySession } from '../../types';

describe('StudySession Non-Destructive Reconciliation', () => {
  it('preserves local materialReady: true when remote returns false or null without newer timestamp', () => {
    const localSession: StudySession = {
      id: 'sess-1',
      subjectId: 'subj-cs',
      type: 'LECTURE',
      title: 'البينري والهيكسا ديسيميل',
      lectureNumber: 1,
      status: 'STUDIED',
      materialReady: true,
      studyDone: false,
      reviseDone: false,
      solveDone: false,
      fsrsStability: 0,
      fsrsDifficulty: 0,
      updatedAt: '2026-10-22T21:00:00.000Z'
    };

    // Simulated stale pull from remote PostgreSQL table (missing column or default false)
    const remotePulled: Partial<StudySession> = {
      id: 'sess-1',
      subjectId: 'subj-cs',
      title: 'البينري والهيكسا ديسيميل',
      materialReady: false, // stale false from remote!
      studyDone: false,
      reviseDone: false,
      solveDone: false,
      lectureNumber: null as any
    };

    const merged = mergeStudySessionRecord(localSession, remotePulled);

    // The checkmark MUST NOT BE WIPED!
    expect(merged.materialReady).toBe(true);
    // The lectureNumber MUST NOT BE WIPED TO NULL!
    expect(merged.lectureNumber).toBe(1);
  });

  it('preserves local lectureNumber when remote pull returns null or undefined', () => {
    const localSession: StudySession = {
      id: 'sess-2',
      subjectId: 'subj-cs',
      type: 'LECTURE',
      title: 'Intro to C++',
      lectureNumber: 2,
      status: 'STUDIED',
      materialReady: true,
      studyDone: true,
      reviseDone: false,
      solveDone: false,
      fsrsStability: 0,
      fsrsDifficulty: 0,
      updatedAt: '2026-10-22T21:00:00.000Z'
    };

    const remotePulled: Partial<StudySession> = {
      id: 'sess-2',
      lectureNumber: undefined,
      materialReady: undefined
    };

    const merged = mergeStudySessionRecord(localSession, remotePulled);
    expect(merged.lectureNumber).toBe(2);
    expect(merged.materialReady).toBe(true);
    expect(merged.studyDone).toBe(true);
  });

  it('respects remote state if remote timestamp is strictly newer', () => {
    const localSession: StudySession = {
      id: 'sess-3',
      subjectId: 'subj-cs',
      type: 'LECTURE',
      title: 'Functions in C++',
      lectureNumber: 3,
      status: 'STUDIED',
      materialReady: true,
      studyDone: false,
      reviseDone: false,
      solveDone: false,
      fsrsStability: 0,
      fsrsDifficulty: 0,
      updatedAt: '2026-10-22T20:00:00.000Z'
    };

    // Remote update made on another device with newer timestamp unchecking it
    const remotePulled: Partial<StudySession> = {
      id: 'sess-3',
      materialReady: false,
      updatedAt: '2026-10-22T21:05:00.000Z'
    };

    const merged = mergeStudySessionRecord(localSession, remotePulled);
    expect(merged.materialReady).toBe(false);
    expect(merged.lectureNumber).toBe(3);
  });
});
