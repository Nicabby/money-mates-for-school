'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CURRICULUM_DATA, Grade, CurriculumExpectation } from '@/types/curriculum';
import LessonBreadcrumb from './LessonBreadcrumb';

interface GradeLessonsPageProps {
  grade: Grade;
}

const ExpectationCard: React.FC<{ expectation: CurriculumExpectation }> = ({ expectation }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-blue-500">
      <div className="flex items-start space-x-4">
        {/* Code Badge */}
        <div className="flex-shrink-0">
          <span className="inline-block px-3 py-1 text-sm font-mono font-semibold text-blue-700 bg-blue-100 rounded-full">
            {expectation.code}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {expectation.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {expectation.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const GradeLessonsPage: React.FC<GradeLessonsPageProps> = ({ grade }) => {
  const router = useRouter();
  const gradeData = CURRICULUM_DATA[grade];

  if (!gradeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Grade Not Found</h1>
          <p className="text-gray-600 mb-6">The requested grade level is not available.</p>
          <button
            onClick={() => router.push('/lessons')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Grade Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <LessonBreadcrumb />
        {/* Header Section */}
        <div className="mb-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/lessons')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors group"
          >
            <svg 
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Grade Selection
          </button>

          {/* Grade Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold mb-4">
              {grade}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {gradeData.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ontario Mathematics Curriculum - Financial Literacy Strand
            </p>
          </div>
        </div>

        {/* Expectations Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Learning Expectations
          </h2>
          
          <div className="space-y-6">
            {gradeData.expectations.map((expectation, index) => (
              <ExpectationCard 
                key={`${expectation.code}-${index}`} 
                expectation={expectation} 
              />
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="text-center bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-gray-600 mb-6">
            Begin your financial literacy journey with MoneyMates interactive lessons and activities designed specifically for Grade {grade} students.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📊 Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/add-entry')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              🎓 Start First Lesson
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <span>Progress:</span>
            <div className="flex space-x-1">
              {gradeData.expectations.map((_, index) => (
                <div 
                  key={index}
                  className="w-3 h-3 rounded-full bg-gray-300"
                />
              ))}
            </div>
            <span>0/{gradeData.expectations.length} completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeLessonsPage;