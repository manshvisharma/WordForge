import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Book, User, LogOut, BarChart3, Sun, Moon } from 'lucide-react';
import { auth } from '../firebase';
import { useTheme } from '../contexts/ThemeContext';
import { StreakWidget } from './ui/StreakWidget';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 p-6 z-50">
        <div className="flex justify-between items-center mb-10 pl-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            VocabFlow
            </h1>
        </div>
        
        {/* Streak Widget in Sidebar */}
        <div className="mb-6">
            <StreakWidget />
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<Home size={20} />} label="Dashboard" active={isActive('/')} onClick={() => navigate('/')} />
          <NavItem icon={<PlusCircle size={20} />} label="Add Word" active={isActive('/add')} onClick={() => navigate('/add')} />
          <NavItem icon={<Book size={20} />} label="Library" active={isActive('/library')} onClick={() => navigate('/library')} />
          <NavItem icon={<BarChart3 size={20} />} label="Reports" active={isActive('/reports')} onClick={() => navigate('/reports')} />
          <NavItem icon={<User size={20} />} label="Profile" active={isActive('/profile')} onClick={() => navigate('/profile')} />
        </nav>
        
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
          >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen pb-24 md:pb-10">
        {/* Mobile Header for Streak Widget */}
        <div className="md:hidden flex justify-between items-center p-4 sticky top-0 z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
             <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                VocabFlow
            </h1>
            <StreakWidget />
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/50 dark:border-slate-800 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center p-2">
          <MobileNavItem icon={<Home size={24} />} label="Home" active={isActive('/')} onClick={() => navigate('/')} />
          <MobileNavItem icon={<PlusCircle size={24} />} label="Add" active={isActive('/add')} onClick={() => navigate('/add')} />
          <MobileNavItem icon={<Book size={24} />} label="Library" active={isActive('/library')} onClick={() => navigate('/library')} />
          <MobileNavItem icon={<BarChart3 size={24} />} label="Stats" active={isActive('/reports')} onClick={() => navigate('/reports')} />
          <MobileNavItem icon={<User size={24} />} label="Profile" active={isActive('/profile')} onClick={() => navigate('/profile')} />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 ${
      active 
      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 w-16 h-16 rounded-2xl transition-all duration-200 ${
      active 
      ? 'text-indigo-600 dark:text-indigo-400' 
      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
    }`}
  >
    <div className={`mb-1 transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);