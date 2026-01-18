import React, { useState, useEffect } from 'react';
import { Flame, X, Check, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserStreak, StreakData } from '../../services/wordService';

export const StreakWidget: React.FC = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<StreakData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      getUserStreak(currentUser.uid).then(setData);
    }
  }, [currentUser]);

  if (!data) return null;

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-300 group ${
          isOpen ? 'bg-orange-100 dark:bg-orange-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <div className={`p-2 rounded-full transition-transform duration-300 group-hover:scale-110 ${data.currentStreak > 0 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
          <Flame size={20} fill={data.currentStreak > 0 ? "currentColor" : "none"} />
        </div>
        <span className={`text-xl font-bold ${data.currentStreak > 0 ? 'text-slate-800 dark:text-white' : 'text-slate-500'}`}>
            {data.currentStreak}
        </span>
      </button>

      {/* Popup Card */}
      {isOpen && (
        <>
          {/* Backdrop for mobile closing */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute top-full right-0 md:left-0 mt-4 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl rounded-3xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
             <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Weekly Activity</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your learning consistency</p>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={18}/></button>
             </div>
             
             <div className="flex justify-between items-center gap-2">
                {data.last7Days.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 flex-1">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                             day.active 
                             ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' 
                             : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-400 dark:text-red-500/50'
                         }`}>
                             {day.active ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                         </div>
                         <span className={`text-[10px] font-bold uppercase ${day.date === new Date().toDateString() ? 'text-indigo-500' : 'text-slate-400'}`}>
                            {day.label.charAt(0)}
                         </span>
                    </div>
                ))}
             </div>

             <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                 <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                     {data.currentStreak > 0 ? "You're on fire! 🔥" : "Start a streak today!"}
                 </p>
             </div>
          </div>
        </>
      )}
    </div>
  );
};