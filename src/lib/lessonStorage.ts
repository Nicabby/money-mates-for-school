import { LessonResponse } from '@/types/lesson';

const LESSONS_STORAGE_KEY = 'moneymates_lesson_responses';

export const lessonStorage = {
  // Save a lesson response
  saveLessonResponse: (response: LessonResponse): void => {
    try {
      const existing = lessonStorage.getAllLessonResponses();
      const newResponse: LessonResponse = {
        ...response,
        id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        completedAt: new Date()
      };
      
      const updated = [...existing, newResponse];
      localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving lesson response:', error);
    }
  },

  // Get all lesson responses
  getAllLessonResponses: (): LessonResponse[] => {
    try {
      const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
      if (stored) {
        const responses = JSON.parse(stored);
        // Convert completedAt strings back to Date objects
        return responses.map((r: any) => ({
          ...r,
          completedAt: new Date(r.completedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading lesson responses:', error);
      return [];
    }
  },

  // Get lesson responses for a specific student
  getLessonResponsesByStudent: (studentId: string): LessonResponse[] => {
    const all = lessonStorage.getAllLessonResponses();
    return all.filter(response => response.studentId === studentId);
  },

  // Get lesson responses for a specific lesson
  getLessonResponsesByLesson: (lessonId: string): LessonResponse[] => {
    const all = lessonStorage.getAllLessonResponses();
    return all.filter(response => response.lessonId === lessonId);
  },

  // Get completed lesson IDs for a student
  getCompletedLessonIds: (studentId: string): string[] => {
    const responses = lessonStorage.getLessonResponsesByStudent(studentId);
    return [...new Set(responses.map(r => r.lessonId))];
  },

  // Get lesson statistics
  getLessonStats: (studentId: string) => {
    const responses = lessonStorage.getLessonResponsesByStudent(studentId);
    
    if (responses.length === 0) {
      return {
        totalLessons: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        completedStrands: [],
        recentActivity: []
      };
    }

    const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
    const totalTime = responses.reduce((sum, r) => sum + r.timeSpent, 0);
    const strands = [...new Set(responses.map(r => r.strand))];
    const recent = responses
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 5);

    return {
      totalLessons: responses.length,
      averageScore: Math.round(totalScore / responses.length),
      totalTimeSpent: totalTime,
      completedStrands: strands,
      recentActivity: recent
    };
  },

  // Clear all lesson data (for testing/reset)
  clearAllLessonData: (): void => {
    localStorage.removeItem(LESSONS_STORAGE_KEY);
  }
};