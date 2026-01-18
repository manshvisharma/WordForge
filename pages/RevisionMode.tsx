import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserWords, submitRevision } from '../services/wordService';
import { Word } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff, Mic, PenLine, ChevronLeft } from 'lucide-react';

export const RevisionMode: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [word, setWord] = useState<Word | null>(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [newSentence, setNewSentence] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Ideally we fetch a single doc, but filtering getUserWords ensures we stay consistent 
    // with the quick service implementation.
    const loadWord = async () => {
      if (!currentUser || !id) return;
      try {
        const words = await getUserWords(currentUser.uid);
        const found = words.find(w => w.id === id);
        if (found) setWord(found);
        else navigate('/');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWord();
  }, [currentUser, id, navigate]);

  const handleSubmit = async () => {
    if (!word || !newSentence.trim()) return;
    setSubmitting(true);
    try {
      await submitRevision(word, newSentence);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !word) return <div className="p-8 text-center text-slate-400">Loading revision...</div>;

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-4">
      <button onClick={() => navigate('/')} className="flex items-center text-slate-400 hover:text-indigo-600 transition-colors mb-4">
        <ChevronLeft size={20} /> <span className="ml-1 font-medium">Back to Dashboard</span>
      </button>

      {/* The Flashcard */}
      <GlassCard className="min-h-[200px] flex flex-col items-center justify-center text-center relative py-12">
        <span className="absolute top-4 right-4 text-xs font-bold text-indigo-300 tracking-widest uppercase">
            Stage {word.stage}/4
        </span>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">{word.text}</h1>
        
        <div className="relative w-full px-8">
            <div className={`transition-all duration-500 overflow-hidden ${showMeaning ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-lg text-slate-600 dark:text-slate-300 italic">"{word.meaning}"</p>
                {/* Show a previous example */}
                <p className="text-sm text-slate-400 mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                    Context: {word.examples[0]}
                </p>
            </div>

            <button 
                onClick={() => setShowMeaning(!showMeaning)}
                className="mt-6 flex items-center justify-center gap-2 text-indigo-500 font-medium hover:text-indigo-600 transition-colors mx-auto text-sm bg-indigo-50 dark:bg-slate-800 px-4 py-2 rounded-full"
            >
                {showMeaning ? <><EyeOff size={16}/> Hide Meaning</> : <><Eye size={16}/> Show Meaning</>}
            </button>
        </div>
      </GlassCard>

      {/* Action Area */}
      <GlassCard>
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold mb-2">
                <PenLine size={18} className="text-indigo-500" />
                <h3>Use it in a new sentence</h3>
            </div>
            
            <textarea
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                placeholder="Make it personal. Write a sentence relating to your life..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-lg text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all h-32"
            />

            <div className="flex gap-3 pt-2">
                <Button 
                    variant="secondary" 
                    className="flex-1"
                    title="Speech to text would go here"
                    onClick={() => alert("Speech to text feature would integrate browser SpeechRecognition API here.")}
                >
                    <Mic size={20} />
                </Button>
                <Button 
                    variant="primary" 
                    className="flex-[4]" 
                    onClick={handleSubmit}
                    disabled={newSentence.length < 5 || submitting}
                >
                    {submitting ? 'Saving...' : 'Complete Revision'}
                </Button>
            </div>
        </div>
      </GlassCard>
    </div>
  );
};