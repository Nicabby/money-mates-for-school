'use client';

import React from 'react';

interface BudgetStreakBadgeProps {
  streakDays: number;
  isVisible: boolean;
  onToggle: (visible: boolean) => void;
}

const BudgetStreakBadge: React.FC<BudgetStreakBadgeProps> = ({ 
  streakDays, 
  isVisible, 
  onToggle 
}) => {
  if (!isVisible) return null;

  const getBadgeColor = (days: number) => {
    if (days >= 30) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (days >= 14) return 'bg-green-100 text-green-800 border-green-200';
    if (days >= 7) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (days >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getBadgeIcon = (days: number) => {
    if (days >= 30) return '👑';
    if (days >= 14) return '🏆';
    if (days >= 7) return '🎖️';
    if (days >= 3) return '⭐';
    return '🌱';
  };

  const getBadgeTitle = (days: number) => {
    if (days >= 30) return 'Budget Master';
    if (days >= 14) return 'Budget Champion';
    if (days >= 7) return 'Budget Hero';
    if (days >= 3) return 'Budget Star';
    return 'Getting Started';
  };

  return (
    <div className="relative">
      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${getBadgeColor(streakDays)} transition-all duration-300 hover:scale-105`}>
        <span className="text-xl">{getBadgeIcon(streakDays)}</span>
        <div className="text-center">
          <div className="font-bold text-sm">{getBadgeTitle(streakDays)}</div>
          <div className="text-xs">
            {streakDays === 0 ? 'Start your streak!' : `${streakDays} day${streakDays === 1 ? '' : 's'} on budget!`}
          </div>
        </div>
      </div>
      
      {/* Toggle button */}
      <button
        onClick={() => onToggle(!isVisible)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-600 transition-colors"
        title="Hide streak badge"
      >
        ×
      </button>
    </div>
  );
};

export default BudgetStreakBadge;