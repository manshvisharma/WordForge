import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, UserStats } from '../services/wordService';
import { GlassCard } from '../components/ui/GlassCard';
import { BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';

export const Reports: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<UserStats>({ total: 0, thisWeek: 0, thisMonth: 0, mastered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
        getUserStats(currentUser.uid).then(data => {
            setStats(data);
            setLoading(false);
        });
    }
  }, [currentUser]);

  return (
    <div className="space-y-6 pt-4">
        <header>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Your Progress</h1>
            <p className="text-slate-500 dark:text-slate-400">Track your learning journey.</p>
        </header>

        {loading ? (
             <div className="text-center py-10 text-slate-400">Loading stats...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard 
                    icon={<BarChart3 className="text-indigo-500" />}
                    title="Total Words"
                    value={stats.total}
                    subtitle="Lifetime words added"
                />
                <StatCard 
                    icon={<Award className="text-emerald-500" />}
                    title="Mastered"
                    value={stats.mastered}
                    subtitle="Words fully activated"
                />
                <StatCard 
                    icon={<TrendingUp className="text-blue-500" />}
                    title="This Week"
                    value={stats.thisWeek}
                    subtitle="New words this week"
                />
                <StatCard 
                    icon={<Calendar className="text-purple-500" />}
                    title="This Month"
                    value={stats.thisMonth}
                    subtitle="New words this month"
                />
            </div>
        )}
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle }: any) => (
    <GlassCard className="flex items-center gap-4 p-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        </div>
    </GlassCard>
);