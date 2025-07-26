'use client';

import React, { useState } from 'react';

export default function MoneyLabPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const toggleLesson = (lessonId: number) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const lessons = [
    {
      id: 1,
      title: "What is Money?",
      description: "Learn about different types of money and why we use it",
      duration: "5 min",
      level: "Beginner",
      icon: "💰",
      status: "available"
    },
    {
      id: 2,
      title: "Needs vs Wants",
      description: "Understand the difference between things you need and things you want",
      duration: "7 min",
      level: "Beginner", 
      icon: "🤔",
      status: "available"
    },
    {
      id: 3,
      title: "Making Smart Choices",
      description: "Learn how to compare options and make better spending decisions",
      duration: "10 min",
      level: "Beginner",
      icon: "🧠",
      status: "available"
    },
    {
      id: 4,
      title: "The Power of Saving",
      description: "Discover why saving money is important and how to start",
      duration: "8 min",
      level: "Intermediate",
      icon: "🏦",
      status: "coming_soon"
    },
    {
      id: 5,
      title: "Setting Money Goals",
      description: "Learn how to set realistic savings goals and track your progress",
      duration: "12 min",
      level: "Intermediate",
      icon: "🎯",
      status: "coming_soon"
    },
    {
      id: 6,
      title: "Understanding Interest",
      description: "Explore how your money can grow over time with interest",
      duration: "15 min",
      level: "Advanced",
      icon: "📈",
      status: "coming_soon"
    }
  ];

  const quickTips = [
    {
      icon: "💡",
      tip: "Track every expense, no matter how small - even that $1 candy bar adds up!"
    },
    {
      icon: "🎯",
      tip: "Set a specific savings goal with a deadline to stay motivated"
    },
    {
      icon: "📊",
      tip: "Check your MoneyTracks page weekly to see your spending patterns"
    },
    {
      icon: "🏆",
      tip: "Celebrate small wins - every good money decision counts!"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8" style={{ paddingTop: '12pt' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">🧪 MoneyLab</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Interactive lessons and activities to build your money skills step by step
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">🎓 Your Learning Progress</h2>
        <div className="flex justify-center items-center space-x-8">
          <div>
            <div className="text-3xl font-bold text-blue-600">{completedLessons.length}</div>
            <div className="text-sm text-gray-600">Lessons Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{lessons.filter(l => l.status === 'available').length}</div>
            <div className="text-sm text-gray-600">Available Now</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{Math.round((completedLessons.length / lessons.length) * 100)}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">📚 Learning Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className={`card border transition-all duration-200 ${
                lesson.status === 'coming_soon' 
                  ? 'opacity-60 border-gray-200' 
                  : completedLessons.includes(lesson.id)
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{lesson.icon}</span>
                  {lesson.status === 'coming_soon' && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {completedLessons.includes(lesson.id) && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      ✓ Complete
                    </span>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${getLevelColor(lesson.level)}`}>
                      {lesson.level}
                    </span>
                    <span className="text-gray-500">{lesson.duration}</span>
                  </div>
                </div>
                
                {lesson.status === 'available' && (
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      completedLessons.includes(lesson.id)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {completedLessons.includes(lesson.id) ? 'Review Lesson' : 'Start Lesson'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-900 mb-4 text-center">⚡ Quick Money Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-xl flex-shrink-0">{tip.icon}</span>
              <p className="text-sm text-yellow-800">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-purple-900 mb-3">🚀 More Lessons Coming Soon!</h2>
        <p className="text-purple-700 mb-4">
          We&apos;re working on interactive quizzes, real-world scenarios, and advanced topics like investing and entrepreneurship.
        </p>
        <div className="text-sm text-purple-600">
          💡 Have ideas for lessons you&apos;d like to see? Let us know through MoneyChat!
        </div>
      </div>
    </div>
  );
}