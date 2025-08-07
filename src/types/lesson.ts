export interface LessonResponse {
  id: string;
  studentId: string;
  lessonId: string;
  lessonTitle: string;
  strand: string;
  answers: Record<string, any>;
  score: number;
  completedAt: Date;
  timeSpent: number; // in seconds
}

export interface LessonModule {
  id: string;
  title: string;
  strand: string; // e.g., "F1.1", "F1.2", "F1.3"
  description: string;
  scenario: string;
  objectives: string[];
  activities: LessonActivity[];
  discussionPrompt: string;
  timeEstimate: number; // in minutes
}

export interface LessonActivity {
  id: string;
  type: 'multiple-choice' | 'calculation' | 'drag-drop' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: any;
  explanation: string;
  points: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  category: 'fruits' | 'vegetables' | 'dairy' | 'snacks' | 'beverages';
  emoji: string;
}