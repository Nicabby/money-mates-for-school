'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_GRADES } from '@/types/curriculum';
import LessonBreadcrumb from './LessonBreadcrumb';

const GradeSelectionLanding: React.FC = () => {
  const router = useRouter();

  const handleGradeSelect = (grade: number) => {
    router.push(`/lessons/grade-${grade}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <LessonBreadcrumb />
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/MoneyMateslogo.png" 
              alt="MoneyMates" 
              className="h-32 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Grade
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your grade level to explore Ontario Financial Literacy curriculum expectations designed just for you!
          </p>
        </div>

        {/* Grade Selection Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {AVAILABLE_GRADES.map((grade) => (
            <button
              key={grade}
              onClick={() => handleGradeSelect(grade)}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-8 border-2 border-transparent hover:border-blue-200"
            >
              {/* Grade Number Circle */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                  <span className="text-2xl font-bold text-white">
                    {grade}
                  </span>
                </div>
                
                {/* Grade Label */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Grade {grade}
                </h3>
                
                {/* Subtitle */}
                <p className="text-sm text-gray-600 text-center">
                  Financial Literacy
                </p>
                
                {/* Hover indicator */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-blue-600 text-sm font-medium">
                    Explore Lessons →
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Information Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ontario Curriculum Aligned
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Each grade level contains specific learning expectations from the Ontario Mathematics 
              curriculum's Financial Literacy strand. Choose your grade to see what you'll learn 
              about money management, budgeting, and financial decision-making!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-semibold text-gray-800">Money Management</h4>
                <p className="text-sm text-gray-600">Learn practical money skills</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-800">Budgeting</h4>
                <p className="text-sm text-gray-600">Create and maintain budgets</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-800">Smart Decisions</h4>
                <p className="text-sm text-gray-600">Make informed financial choices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeSelectionLanding;