'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/lessons" className="flex items-center">
            <img src="/MoneyMateslogo.png" alt="MoneyMates" className="h-12 w-auto" />
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Educational links */}
            <Link href="/lessons" className={cn(
              "text-sm font-medium transition-colors",
              pathname.startsWith('/lessons') ? 'text-purple-700' : 'text-purple-600 hover:text-purple-700'
            )}>
              🎓 Grade Lessons
            </Link>
            <Link href="/financial-topics" className={cn(
              "text-sm font-medium transition-colors",
              pathname === '/financial-topics' ? 'text-green-700' : 'text-green-600 hover:text-green-700'
            )}>
              📚 Financial Topics
            </Link>
            <Link href="/money-chat" className={cn(
              "text-sm transition-colors",
              pathname === '/money-chat' ? 'text-blue-700' : 'text-blue-600 hover:text-blue-700'
            )}>
              MoneyChat
            </Link>
            <Link href="/money-lab" className={cn(
              "text-sm transition-colors",
              pathname === '/money-lab' ? 'text-blue-700' : 'text-blue-600 hover:text-blue-700'
            )}>
              MoneyLab
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;