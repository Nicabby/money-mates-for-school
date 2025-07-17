'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/expenses', label: 'Expenses', icon: '💰' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/add', label: 'Add Expense', icon: '➕' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">💸</span>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Business Expenses</span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">Business</span>
          </Link>
          
          <div className="flex space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <span>{link.icon}</span>
                <span className="hidden sm:block">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;