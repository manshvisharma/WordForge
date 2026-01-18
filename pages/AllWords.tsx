import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserWords } from '../services/wordService';
import { Word } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, CheckCircle2, Clock, ChevronDown, ChevronUp, BookOpen, Calendar, ArrowUpDown, Filter } from 'lucide-react';

export const AllWords: React.FC = () => {
  const { currentUser } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'alpha'>('date');

  useEffect(() => {
    if (currentUser) {
        setLoading(true);
        getUserWords(currentUser.uid).then((data) => {
            setWords(data);
            setLoading(false);
        });
    }
  }, [currentUser]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter and Sort
  const filteredWords = words
    .filter(w => 
        w.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
        w.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        if (sortBy === 'date') {
            return b.createdAt - a.createdAt; // Newest first
        } else {
            return a.text.localeCompare(b.text); // A-Z
        }
    });

  return (
    <div className="space-y-6 pt-4 pb-24">
        <header>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Your Library</h1>
            <p className="text-slate-500 dark:text-slate-400">Total collection: {words.length} words</p>
        </header>

        {/* Search & Sort Controls */}
        <div className="flex gap-2 items-center sticky top-2 z-20">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-indigo-100/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 dark:text-white placeholder:text-slate-400 transition-colors"
                />
            </div>
            
            <button 
                onClick={() => setSortBy(sortBy === 'date' ? 'alpha' : 'date')}
                className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-indigo-100/20 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                title="Toggle Sort"
            >
                {sortBy === 'date' ? <Calendar size={20} /> : <ArrowUpDown size={20} />}
            </button>
        </div>
        
        <div className="text-xs text-slate-400 text-right px-2">
            Sorted by: {sortBy === 'date' ? 'Newest Added' : 'Alphabetical'}
        </div>

        <div className="space-y-3">
            {loading ? (
                <div className="text-center py-10 text-slate-400">Loading library...</div>
            ) : filteredWords.map(word => (
                <GlassCard 
                    key={word.id} 
                    interactive 
                    onClick={() => toggleExpand(word.id)}
                    className="flex flex-col gap-0 transition-all duration-300"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{word.text}</h3>
                            
                            {!expandedId && (
                                <>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] opacity-80 mb-3">{word.meaning}</p>
                                    
                                    {/* Dates visible in collapsed view */}
                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 w-fit">
                                        <div className="flex flex-col">
                                            <span className="uppercase tracking-wider text-[8px] font-bold opacity-70">Added</span>
                                            <span className="text-slate-600 dark:text-slate-300">{new Date(word.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                                        <div className="flex flex-col">
                                            <span className="uppercase tracking-wider text-[8px] font-bold opacity-70">Review</span>
                                            <span className={`font-medium ${word.status === 'mastered' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                                {word.status === 'mastered' ? 'Done' : new Date(word.nextRevision).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                            <div className="flex items-center gap-2 mb-2">
                                {word.status === 'mastered' ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                                        <CheckCircle2 size={10} /> Mastered
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/30 px-2 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
                                        <Clock size={10} /> Stage {word.stage}
                                    </span>
                                )}
                            </div>
                            {expandedId === word.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedId === word.id ? 'max-h-[800px] opacity-100 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50' : 'max-h-0 opacity-0'}`}>
                        <div className="space-y-4">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Meaning</span>
                                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                                    "{word.meaning}"
                                </p>
                            </div>
                            
                            {/* All Sentences */}
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-2">
                                    <BookOpen size={10} /> Context History
                                </span>
                                <div className="space-y-2">
                                    {word.examples.map((ex, idx) => (
                                        <div key={idx} className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] text-slate-400 block mb-1">
                                                {idx === 0 ? "Original Discovery:" : `Revision ${idx}:`}
                                            </span>
                                            {ex}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Detailed Dates in Expanded view (kept for detail) */}
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2">
                                <span>Full Date: {new Date(word.createdAt).toLocaleDateString()}</span>
                                <span>ID: {word.id.substring(0,6)}</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            ))}
            
            {!loading && filteredWords.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <Search size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-slate-600 dark:text-slate-300 font-medium">No words found</h3>
                    <p className="text-slate-400 text-sm mt-1">Try adding some new vocabulary!</p>
                </div>
            )}
        </div>
    </div>
  );
};