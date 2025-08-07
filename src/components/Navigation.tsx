'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const pathname = usePathname();

  // Base navigation links
  const baseLinks = [
    { href: '/dashboard', label: 'MoneyHub' },
    { href: '/budgets', label: 'MoneyPlan' },
    { href: '/analytics', label: 'MoneyTracks' },
    { href: '/export', label: 'MoneyMoves' },
  ];

  // Add "Add New" link first if not on home page
  const links = pathname === '/' ? baseLinks : [
    { href: '/', label: 'Add New' },
    ...baseLinks
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <img src="/MoneyMateslogo.png" alt="MoneyMates" className="h-12 w-auto" />
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'nav-link',
                    pathname === link.href ? 'active' : ''
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Educational links */}
            <div className="flex items-center space-x-4 border-l border-gray-300 pl-4">
              <Link href="/financial-topics" className="text-sm text-green-600 hover:text-green-700 transition-colors font-medium">
                📚 Financial Topics
              </Link>
              <Link href="/money-chat" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                MoneyChat
              </Link>
              <Link href="/money-lab" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                MoneyLab
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;