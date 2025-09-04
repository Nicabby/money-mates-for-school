'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CURRICULUM_DATA } from '@/types/curriculum';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const LessonBreadcrumb: React.FC = () => {
  const pathname = usePathname();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 1 && segments[0] === 'lessons') {
      return [
        { label: 'Home', href: '/' },
        { label: 'Grade Lessons' }
      ];
    }
    
    if (segments.length === 2 && segments[0] === 'lessons' && segments[1].startsWith('grade-')) {
      const gradeMatch = segments[1].match(/^grade-(\d+)$/);
      if (gradeMatch) {
        const gradeNumber = parseInt(gradeMatch[1], 10);
        const gradeData = CURRICULUM_DATA[gradeNumber];
        
        return [
          { label: 'Home', href: '/' },
          { label: 'Grade Lessons', href: '/lessons' },
          { label: gradeData?.title || `Grade ${gradeNumber}` }
        ];
      }
    }
    
    return [
      { label: 'Home', href: '/' },
      { label: 'Grade Lessons', href: '/lessons' }
    ];
  };

  const breadcrumbs = getBreadcrumbs();
  
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && (
            <svg 
              className="w-4 h-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default LessonBreadcrumb;