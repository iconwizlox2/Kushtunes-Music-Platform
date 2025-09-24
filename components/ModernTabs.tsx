"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface ModernTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function ModernTabs({ tabs, defaultTab, className }: ModernTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Navigation */}
      <div className="relative">
        <div className="flex space-x-1 rounded-xl bg-slate-100/50 p-1 backdrop-blur-sm dark:bg-slate-800/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-sky-500/20",
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-soft dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-100"
              )}
            >
              {tab.icon && (
                <span className={cn(
                  "transition-colors duration-300",
                  activeTab === tab.id ? "text-sky-600 dark:text-sky-400" : "text-slate-500 dark:text-slate-400"
                )}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <div className="mobile-fade-in">
          {activeTabContent}
        </div>
      </div>
    </div>
  );
}

interface MobileTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function MobileTabs({ tabs, defaultTab, className }: MobileTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile Tab Navigation */}
      <div className="relative mb-6">
        <div className="flex overflow-x-auto scrollbar-hide pb-2">
          <div className="flex space-x-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                  "focus:outline-none focus:ring-2 focus:ring-sky-500/20",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-soft"
                    : "bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                )}
              >
                {tab.icon && (
                  <span className={cn(
                    "transition-colors duration-300",
                    activeTab === tab.id ? "text-white" : "text-slate-500 dark:text-slate-400"
                  )}>
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mobile-fade-in">
        {activeTabContent}
      </div>
    </div>
  );
}


