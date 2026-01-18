export interface Word {
  id: string;
  userId: string;
  text: string;
  meaning: string;
  examples: string[]; // Array of sentences written by the user
  createdAt: number; // Timestamp
  lastRevised?: number; // Timestamp of last revision
  nextRevision: number; // Timestamp
  stage: number; // 0: New, 1: Day 1, 2: Day 2, 3: Day 4, 4: Day 7 (Mastered)
  status: 'active' | 'mastered';
}

export type RevisionType = 'speak' | 'write';

export const REVISION_SCHEDULE = [
  1, // 1 day after creation
  2, // 2 days after first revision
  4, // 4 days after second revision
  7, // 7 days after third revision
];