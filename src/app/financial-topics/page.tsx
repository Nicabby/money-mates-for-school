'use client';

import React, { useState, useEffect } from 'react';
import GroceryShoppingLesson from '@/components/lessons/GroceryShoppingLesson';
import { LessonResponse } from '@/types/lesson';
import { lessonStorage } from '@/lib/lessonStorage';

interface LessonModule {
  id: string;
  title: string;
  strand: string;
  description: string;
  grade: string;
  timeEstimate: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  component: React.ComponentType<any>;
}

const availableLessons: LessonModule[] = [
  {
    id: 'grocery-shopping-f1-2',
    title: 'Grocery Shopping Adventure',
    strand: 'F1.2',
    description: 'Learn to calculate costs and change while shopping for groceries using mental math with whole-dollar amounts.',
    grade: 'Grade 4',
    timeEstimate: 15,
    difficulty: 'Beginner',
    topics: ['Addition', 'Subtraction', 'Money Management', 'Mental Math'],
    component: GroceryShoppingLesson
  }
  // Add more lessons here for F1.1 and F1.3
];

export default function FinancialTopicsPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const studentId = 'demo-student'; // In real app, get from auth context

  useEffect(() => {
    // Load completed lessons on mount
    const completed = lessonStorage.getCompletedLessonIds(studentId);
    setCompletedLessons(completed);
  }, [studentId]);

  const handleLessonComplete = (response: Omit<LessonResponse, 'id' | 'studentId' | 'completedAt'>) => {
    // Store lesson response
    const fullResponse: LessonResponse = {
      ...response,
      id: '', // Will be set by storage
      studentId,
      completedAt: new Date()
    };
    
    lessonStorage.saveLessonResponse(fullResponse);
    console.log('Lesson completed and saved:', response);
    
    // Mark lesson as completed
    if (!completedLessons.includes(response.lessonId)) {
      setCompletedLessons(prev => [...prev, response.lessonId]);
    }
    
    // Return to lesson selection
    setSelectedLesson(null);
    
    // You could show a success toast here
  };

  const selectedLessonData = availableLessons.find(lesson => lesson.id === selectedLesson);

  if (selectedLesson && selectedLessonData) {
    const LessonComponent = selectedLessonData.component;
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Financial Topics
            </button>
          </div>
          
          <LessonComponent 
            onComplete={handleLessonComplete}
            studentId="demo-student" // In real app, get from auth context
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">📚 Ontario Financial Topics</h1>
          <p className="text-xl text-blue-100 mb-2">
            Interactive lessons aligned with Ontario Curriculum expectations
          </p>
          <p className="text-lg text-blue-200">
            Grade 4 Financial Literacy • Strands F1.1, F1.2, F1.3
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Curriculum Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Learning Expectations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-green-700">F1.1 - Payment Methods</h3>
              <p className="text-gray-600 text-sm mt-1">
                Identify various methods of payment that can be used to purchase goods and services
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-700">F1.2 - Cost Calculations</h3>
              <p className="text-gray-600 text-sm mt-1">
                Estimate and calculate costs of transactions and change needed, using mental math
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-purple-700">F1.3 - Financial Concepts</h3>
              <p className="text-gray-600 text-sm mt-1">
                Explain spending, saving, earning, investing, and donating concepts
              </p>
            </div>
          </div>
        </div>

        {/* Lesson Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableLessons.map(lesson => {
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <div key={lesson.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lesson.strand === 'F1.1' ? 'bg-green-100 text-green-800' :
                      lesson.strand === 'F1.2' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {lesson.strand}
                    </span>
                    {isCompleted && (
                      <span className="text-green-500 text-xl">✅</span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">{lesson.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">📖 {lesson.grade}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">⏰ {lesson.timeEstimate} minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs ${
                        lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {lesson.topics.slice(0, 3).map(topic => (
                        <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                      {lesson.topics.length > 3 && (
                        <span className="text-xs text-gray-400">+{lesson.topics.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedLesson(lesson.id)}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* Coming Soon Cards */}
          <div className="bg-gray-50 rounded-lg shadow border-2 border-dashed border-gray-300 overflow-hidden">
            <div className="p-6">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3 inline-block">
                F1.1
              </span>
              <h3 className="text-xl font-bold text-gray-500 mb-2">Payment Methods Explorer</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Learn about different ways to pay for goods and services, from cash to digital payments.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <span>📖 Grade 4</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>⏰ 12 minutes</span>
                </div>
              </div>
              <button
                disabled
                className="w-full py-2 px-4 bg-gray-200 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow border-2 border-dashed border-gray-300 overflow-hidden">
            <div className="p-6">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-3 inline-block">
                F1.3
              </span>
              <h3 className="text-xl font-bold text-gray-500 mb-2">Money Decisions Game</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Explore spending, saving, earning, investing, and donating through interactive scenarios.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <span>📖 Grade 4</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>⏰ 18 minutes</span>
                </div>
              </div>
              <button
                disabled
                className="w-full py-2 px-4 bg-gray-200 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Teacher/Family Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">👨‍🏫 For Teachers & Families</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Discussion Starters</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• How does your family decide what to buy at the store?</li>
                <li>• What different ways can people pay for things?</li>
                <li>• When might someone choose to save money instead of spending it?</li>
                <li>• How do you count change when buying something?</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Extension Activities</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Practice with real grocery store flyers</li>
                <li>• Set up a classroom store for role-playing</li>
                <li>• Create a family savings goal together</li>
                <li>• Compare prices at different stores</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}