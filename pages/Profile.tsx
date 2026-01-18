import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { User, Mail, Shield, Moon, Sun, Monitor } from 'lucide-react';
import { auth } from '../firebase';

export const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handlePasswordReset = async () => {
    if (currentUser?.email) {
        try {
            await auth.sendPasswordResetEmail(currentUser.email);
            alert("Password reset email sent!");
        } catch (e) {
            console.error(e);
            alert("Error sending email.");
        }
    }
  };

  return (
    <div className="space-y-6 pt-4">
        <header>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your account.</p>
        </header>

        <GlassCard className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-2xl font-bold shadow-inner">
                    {currentUser?.email?.charAt(0).toUpperCase() || <User />}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        {currentUser?.displayName || 'Learning User'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                        <Mail size={12} /> {currentUser?.email}
                    </p>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Monitor size={16} /> Appearance
                </h3>
                <div 
                  onClick={toggleTheme}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-orange-100 text-orange-500'}`}>
                            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                        </div>
                        <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                            </p>
                            <p className="text-xs text-slate-500">
                                Tap to switch theme
                            </p>
                        </div>
                    </div>
                    {/* Switch visual */}
                    <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Shield size={16} /> Security
                </h3>
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Need to change your password?
                    </p>
                    <Button variant="secondary" onClick={handlePasswordReset}>
                        Reset Password
                    </Button>
                </div>
            </div>
        </GlassCard>

        <div className="text-center text-xs text-slate-400 opacity-60">
            VocabFlow v1.3.0
        </div>
    </div>
  );
};