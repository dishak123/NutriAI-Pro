import React from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Activity, 
  MessageSquare, 
  Settings, 
  LogOut,
  Camera,
  HeartPulse
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion } from 'motion/react';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Shell({ children, activeTab, setActiveTab }: ShellProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Nutrition & Meal Plan', icon: Utensils },
    { id: 'risk', label: 'Health Risk & Forecast', icon: HeartPulse },
    { id: 'vision', label: 'Food Vision (AI)', icon: Camera },
    { id: 'analytics', label: 'Deep Analytics', icon: Activity },
    { id: 'chat', label: 'AI Health Coach', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0F172A] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1E293B] border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white">N</div>
            <h1 className="text-lg font-bold tracking-tight text-white">NutriAI <span className="text-blue-400">Pro</span></h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left",
                activeTab === item.id 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Member Profile</p>
            <p className="text-sm font-medium text-white truncate">Premium Access</p>
            <button 
              onClick={() => auth.signOut()}
              className="text-[10px] text-blue-400 mt-2 hover:underline flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-400">NutriAI Core: Online</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 uppercase font-bold">App Status</p>
              <p className="text-sm text-white capitalize">{activeTab.replace('-', ' ')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
               <Activity className="h-6 w-6" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden bg-[#0F172A] flex flex-col">
          <div className="flex-1 overflow-y-auto w-full">
            <div className="p-8 max-w-[1600px] mx-auto min-h-full">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
