import { FSRS, Rating, createEmptyCard, type Card } from 'ts-fsrs';
import type { StudySession } from '../types';

const scheduler = new FSRS({});

export type StudyGrade = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface RevisionScheduleResult {
  nextReviewDate: Date;
  stability: number;
  difficulty: number;
  daysUntilNext: number;
}

export function calculateNextRevision(
  session: StudySession,
  grade: StudyGrade,
  reviewDate: Date = new Date()
): RevisionScheduleResult {
  // Reconstruct card state from session metadata or create empty card
  const card: Card = {
    ...createEmptyCard(),
    stability: session.fsrsStability || 0,
    difficulty: session.fsrsDifficulty || 0,
    last_review: session.fsrsLastReview ? new Date(session.fsrsLastReview) : undefined
  };

  const ratingMap: Record<StudyGrade, Rating> = {
    AGAIN: Rating.Again,
    HARD: Rating.Hard,
    GOOD: Rating.Good,
    EASY: Rating.Easy
  };

  const fsrsRating = ratingMap[grade];
  const schedulingCards = scheduler.repeat(card, reviewDate);
  const updatedCard = (schedulingCards as any)[fsrsRating].card;

  const diffMs = updatedCard.due.getTime() - reviewDate.getTime();
  const daysUntilNext = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  return {
    nextReviewDate: updatedCard.due,
    stability: updatedCard.stability,
    difficulty: updatedCard.difficulty,
    daysUntilNext
  };
}
