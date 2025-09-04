import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Grade Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The grade level you're looking for doesn't exist or isn't available yet. 
            We currently support Grades 4 through 8.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/lessons"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Choose Your Grade
          </Link>
          
          <div>
            <Link
              href="/"
              className="inline-block text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        
        {/* Available Grades */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Available Grades:
          </h3>
          <div className="flex justify-center space-x-2">
            {[4, 5, 6, 7, 8].map((grade) => (
              <Link
                key={grade}
                href={`/lessons/grade-${grade}`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                {grade}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}