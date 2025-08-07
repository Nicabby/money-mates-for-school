'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { lessonStorage } from '@/lib/lessonStorage';
import { LessonResponse } from '@/types/lesson';

interface LessonProgressProps {
  studentId?: string;
}

export default function LessonProgress({ studentId = 'demo-student' }: LessonProgressProps) {
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<LessonResponse[]>([]);

  useEffect(() => {
    const lessonStats = lessonStorage.getLessonStats(studentId);
    setStats(lessonStats);
    setRecentActivity(lessonStats.recentActivity || []);
  }, [studentId]);

  if (!stats) {
    return null;
  }

  if (stats.totalLessons === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">📚 Learning Progress</h2>
            <p className="text-gray-600 mb-4">Start your financial literacy journey!</p>
            <Link 
              href="/financial-topics"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Start First Lesson →
            </Link>
          </div>
          <div className="text-4xl">🎓</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">📚 Learning Progress</h2>
          <p className="text-gray-600">Your Ontario Curriculum journey</p>
        </div>
        <div className="text-4xl">🎓</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalLessons}</div>
          <div className="text-xs text-gray-600">Lessons</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.averageScore}%</div>
          <div className="text-xs text-gray-600">Avg Score</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.floor(stats.totalTimeSpent / 60)}</div>
          <div className="text-xs text-gray-600">Minutes</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.completedStrands.length}</div>
          <div className="text-xs text-gray-600">Strands</div>
        </div>
      </div>

      {/* Completed Strands */}
      {stats.completedStrands.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Completed Strands:</h3>
          <div className="flex flex-wrap gap-2">
            {stats.completedStrands.map((strand: string) => (
              <span 
                key={strand}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  strand === 'F1.1' ? 'bg-green-100 text-green-800' :
                  strand === 'F1.2' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}
              >
                {strand}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity:</h3>
          <div className="space-y-2">
            {recentActivity.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.strand === 'F1.1' ? 'bg-green-100 text-green-800' :
                    activity.strand === 'F1.2' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {activity.strand}
                  </span>
                  <span className="text-sm text-gray-800 truncate">{activity.lessonTitle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    activity.score >= 80 ? 'text-green-600' : 
                    activity.score >= 60 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {activity.score}%
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link 
          href="/financial-topics"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
        >
          Continue Learning →
        </Link>
        {recentActivity.length > 3 && (
          <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
            View All Progress
          </button>
        )}
      </div>
    </div>
  );
}