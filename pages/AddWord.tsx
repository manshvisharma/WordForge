import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addWord } from '../services/wordService';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { PlusCircle, Sparkles, BookOpen } from 'lucide-react';

export const AddWord: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    example: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!formData.word || !formData.example) {
        alert("Please fill in the word and an example sentence.");
        return;
    }

    setLoading(true);
    try {
      await addWord(currentUser.uid, formData.word, formData.meaning, formData.example);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Failed to add word. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-4">
       <header>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">New Discovery</h1>
          <p className="text-slate-500 dark:text-slate-400">Add a word you found while reading.</p>
        </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard className="space-y-6">
          
          {/* Word Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500"/> Word
            </label>
            <input
              type="text"
              name="word"
              required
              placeholder="e.g. Ephemeral"
              value={formData.word}
              onChange={handleChange}
              className="w-full text-3xl font-bold text-slate-800 dark:text-white bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 py-2 transition-colors"
            />
          </div>

          {/* Meaning Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Meaning (Optional)</label>
            <textarea
              name="meaning"
              rows={2}
              placeholder="Lasting for a very short time..."
              value={formData.meaning}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all resize-none placeholder:text-slate-400 shadow-sm"
            />
          </div>

          {/* Example Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
               <BookOpen size={14} className="text-indigo-500"/> Context Sentence
            </label>
            <p className="text-xs text-slate-400">Where did you see this word? Write the full sentence.</p>
            <textarea
              name="example"
              required
              rows={3}
              placeholder="e.g. Fashions are ephemeral, changing with every season."
              value={formData.example}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all resize-none placeholder:text-slate-400 shadow-sm"
            />
          </div>

        </GlassCard>

        <Button type="submit" fullWidth disabled={loading} className="py-4 text-lg">
           {loading ? 'Adding...' : 'Add to Collection'}
        </Button>
      </form>
    </div>
  );
};