import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Word, REVISION_SCHEDULE } from '../types';

const WORDS_COLLECTION = 'words';

export const addWord = async (userId: string, text: string, meaning: string, example: string) => {
  try {
    // Initial next revision is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const wordData: Omit<Word, 'id'> = {
      userId,
      text,
      meaning,
      examples: [example],
      createdAt: Date.now(),
      nextRevision: tomorrow.getTime(),
      stage: 0,
      status: 'active',
    };

    const docRef = await addDoc(collection(db, WORDS_COLLECTION), wordData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding word:", error);
    throw error;
  }
};

export const getUserWords = async (userId: string): Promise<Word[]> => {
  try {
    const q = query(
      collection(db, WORDS_COLLECTION), 
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const words = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Word));
    
    // Client-side sort: Newest first
    return words.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching words:", error);
    return [];
  }
};

export const getWordsDueForRevision = async (userId: string): Promise<Word[]> => {
  try {
    const q = query(
      collection(db, WORDS_COLLECTION), 
      where('userId', '==', userId),
      where('status', '==', 'active')
    );

    const snapshot = await getDocs(q);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const words = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Word));

    return words.filter(word => word.nextRevision <= endOfToday.getTime());
  } catch (error) {
    console.error("Error fetching due words:", error);
    return [];
  }
};

export const submitRevision = async (word: Word, newSentence: string) => {
  const wordRef = doc(db, WORDS_COLLECTION, word.id);
  
  const newStage = word.stage + 1;
  const isMastered = newStage >= REVISION_SCHEDULE.length;
  
  let nextRevTime = 0;
  
  if (!isMastered) {
    const daysToAdd = REVISION_SCHEDULE[newStage]; 
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    nextDate.setHours(0,0,0,0);
    nextRevTime = nextDate.getTime();
  }

  await updateDoc(wordRef, {
    examples: [...word.examples, newSentence],
    stage: newStage,
    status: isMastered ? 'mastered' : 'active',
    nextRevision: isMastered ? 0 : nextRevTime,
    lastRevised: Date.now()
  });
};

export interface UserStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  mastered: number;
}

export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const words = await getUserWords(userId); 
    const now = new Date();
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: words.length,
      thisWeek: words.filter(w => w.createdAt >= oneWeekAgo.getTime()).length,
      thisMonth: words.filter(w => w.createdAt >= startOfMonth.getTime()).length,
      mastered: words.filter(w => w.status === 'mastered').length
    };
  } catch (error) {
    console.error("Stats error", error);
    return { total: 0, thisWeek: 0, thisMonth: 0, mastered: 0 };
  }
};

export interface StreakData {
  currentStreak: number;
  last7Days: { date: string; active: boolean; label: string }[];
}

export const getUserStreak = async (userId: string): Promise<StreakData> => {
  try {
    const words = await getUserWords(userId);
    const activityDates = new Set<string>();

    // Collect all active dates (Added OR Revised)
    words.forEach(w => {
      activityDates.add(new Date(w.createdAt).toDateString());
      if (w.lastRevised) {
        activityDates.add(new Date(w.lastRevised).toDateString());
      }
    });

    // Calculate Streak
    let streak = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if active today
    if (activityDates.has(today.toDateString())) {
      streak++;
      // Check backwards from yesterday
      let checkDate = yesterday;
      while (activityDates.has(checkDate.toDateString())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else if (activityDates.has(yesterday.toDateString())) {
       // Allow streak to persist if they missed today but did yesterday (optional, but standard logic usually checks immediate continuity. 
       // Strict logic: If not today, streak is 0? Or if not yesterday, streak is 0. 
       // Standard: If active yesterday, streak is at least 1.
       streak++;
       let checkDate = new Date(yesterday);
       checkDate.setDate(checkDate.getDate() - 1);
       while (activityDates.has(checkDate.toDateString())) {
         streak++;
         checkDate.setDate(checkDate.getDate() - 1);
       }
    }

    // Generate last 7 days data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({
        date: d.toDateString(),
        active: activityDates.has(d.toDateString()),
        label: dayName
      });
    }

    return { currentStreak: streak, last7Days };

  } catch (error) {
    console.error("Streak error", error);
    return { currentStreak: 0, last7Days: [] };
  }
};