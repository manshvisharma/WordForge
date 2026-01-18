import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWordsDueForRevision } from '../services/wordService';
import { Word, REVISION_SCHEDULE } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [dueWords, setDueWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWords = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const words = await getWordsDueForRevision(currentUser.uid);
      setDueWords(words);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [currentUser]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const isOverdue = (timestamp: number) => {
    const due = new Date(timestamp);
    const today = new Date();
    today.setHours(0,0,0,0);
    return due < today;
  };

  return (
    <div className="space-y-8 pt-4">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{getGreeting()}</p>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Let's activate your <br />
            <span className="text-indigo-600 dark:text-indigo-400">vocabulary.</span>
          </h1>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin text-indigo-500"><RefreshCw size={32} /></div>
        </div>
      ) : (
        <>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <RefreshCw size={20} className="text-indigo-500" />
                Due for Revision
              </h2>
              <span className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full">
                {dueWords.length} pending
              </span>
            </div>
            
            {dueWords.length === 0 ? (
              <GlassCard className="text-center py-10">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">All caught up!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">You have no words to revise today. <br/>Why not read a book and find new ones?</p>
                <Button onClick={() => navigate('/add')}>Add New Word</Button>
              </GlassCard>
            ) : (
              <div className="grid gap-4">
                {dueWords.map((word) => {
                  const overdue = isOverdue(word.nextRevision);
                  const totalStages = REVISION_SCHEDULE.length;
                  const currentStage = word.stage;
                  
                  return (
                    <GlassCard 
                      key={word.id} 
                      interactive 
                      onClick={() => navigate(`/revise/${word.id}`)}
                      className="flex flex-col gap-3 group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{word.text}</h3>
                          {overdue ? (
                            <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
                                <AlertCircle size={12} />
                                <span>Overdue - Do it now!</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                                <Calendar size={12} />
                                <span>Due today</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <ArrowRight size={20} />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full">
                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                            <span>Progress</span>
                            <span>{currentStage}/{totalStages}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${(currentStage / totalStages) * 100}%` }}
                            ></div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};