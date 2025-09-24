"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

// Premium Button Component
interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'purple' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false
}: PremiumButtonProps) {
  const baseClasses = "relative overflow-hidden rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500",
    secondary: "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 focus:ring-gray-500",
    gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-lg hover:shadow-yellow-500/25 focus:ring-yellow-500",
    purple: "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 focus:ring-purple-500",
    blue: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}

// Premium Card Component
interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  gradient?: boolean;
}

export function PremiumCard({ children, className, glow = false, gradient = false }: PremiumCardProps) {
  return (
    <div className={cn(
      "premium-card rounded-2xl p-6 transition-all duration-300 hover:scale-105",
      glow && "hover:shadow-lg hover:shadow-blue-500/20",
      gradient && "premium-gradient",
      className
    )}>
      {children}
    </div>
  );
}

// Premium Stats Component
interface StatItem {
  label: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'purple' | 'gold' | 'green';
}

interface PremiumStatsProps {
  stats: StatItem[];
  className?: string;
}

export function PremiumStats({ stats, className }: PremiumStatsProps) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    gold: "from-yellow-400 to-orange-500",
    green: "from-green-500 to-emerald-500"
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-4", className)}>
      {stats.map((stat, index) => (
        <PremiumCard key={stat.label} glow className="text-center">
          <div className="mb-4">
            {stat.icon && (
              <div className={cn(
                "w-12 h-12 mx-auto rounded-xl bg-gradient-to-r flex items-center justify-center text-white mb-3",
                colorClasses[stat.color || 'blue']
              )}>
                {stat.icon}
              </div>
            )}
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
            {stat.change && (
              <div className="text-xs text-green-400 font-medium">
                {stat.change} this month
              </div>
            )}
          </div>
        </PremiumCard>
      ))}
    </div>
  );
}

// Premium Tab Component
interface PremiumTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface PremiumTabsProps {
  tabs: PremiumTab[];
  defaultTab?: string;
  className?: string;
}

export function PremiumTabs({ tabs, defaultTab, className }: PremiumTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn("w-full", className)}>
      {/* Premium Tab Navigation */}
      <div className="relative mb-8">
        <div className="flex space-x-2 rounded-2xl bg-gray-900/50 p-2 backdrop-blur-sm border border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              )}
            >
              {tab.icon && (
                <span className={cn(
                  "transition-colors duration-300",
                  activeTab === tab.id ? "text-white" : "text-gray-500"
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
      <div className="premium-fade-in">
        {activeTabContent}
      </div>
    </div>
  );
}

// Premium Header Component
interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  coins?: number;
  avatar?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export function PremiumHeader({ 
  title, 
  subtitle, 
  coins, 
  avatar, 
  onBack, 
  rightElement 
}: PremiumHeaderProps) {
  return (
    <div className="premium-glass rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {coins !== undefined && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl px-3 py-2">
              <span className="text-black font-bold">{coins}</span>
              <span className="text-black text-sm">coins</span>
            </div>
          )}
          {avatar && (
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          )}
          {rightElement}
        </div>
      </div>
    </div>
  );
}

// Premium Game Card Component
interface PremiumGameCardProps {
  title: string;
  subtitle: string;
  players: Array<{
    name: string;
    avatar: string;
    score: number;
    symbol: 'X' | 'O';
  }>;
  timer?: string;
  onPlay?: () => void;
}

export function PremiumGameCard({ title, subtitle, players, timer, onPlay }: PremiumGameCardProps) {
  return (
    <PremiumCard glow className="text-center">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      
      {timer && (
        <div className="text-3xl font-bold text-white mb-6">{timer}</div>
      )}
      
      <div className="flex justify-center gap-6 mb-6">
        {players.map((player, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 mx-auto">
              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-sm text-white font-medium">{player.name}</div>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mx-auto mt-1",
              player.symbol === 'X' ? "bg-white text-black" : "bg-purple-500"
            )}>
              {player.symbol}
            </div>
            <div className="text-xs text-gray-400 mt-1">{player.score}</div>
          </div>
        ))}
      </div>
      
      {onPlay && (
        <PremiumButton onClick={onPlay} className="w-full">
          Play Now
        </PremiumButton>
      )}
    </PremiumCard>
  );
}


