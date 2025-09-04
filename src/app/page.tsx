'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to lessons page immediately
    router.replace('/lessons');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading MoneyMates...</p>
      </div>
    </div>
  );
}