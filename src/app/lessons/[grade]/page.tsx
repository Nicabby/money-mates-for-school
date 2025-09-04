import React from 'react';
import { notFound } from 'next/navigation';
import GradeLessonsPage from '@/components/lessons/GradeLessonsPage';
import { AVAILABLE_GRADES, CURRICULUM_DATA, Grade } from '@/types/curriculum';

interface PageProps {
  params: {
    grade: string;
  };
}

export default function GradePage({ params }: PageProps) {
  // Extract grade number from params (e.g., "grade-4" -> 4)
  const gradeMatch = params.grade.match(/^grade-(\d+)$/);
  
  if (!gradeMatch) {
    notFound();
  }

  const gradeNumber = parseInt(gradeMatch[1], 10);
  
  // Check if the grade is valid
  if (!AVAILABLE_GRADES.includes(gradeNumber as Grade)) {
    notFound();
  }

  return <GradeLessonsPage grade={gradeNumber as Grade} />;
}

export async function generateStaticParams() {
  return AVAILABLE_GRADES.map((grade) => ({
    grade: `grade-${grade}`,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const gradeMatch = params.grade.match(/^grade-(\d+)$/);
  
  if (!gradeMatch) {
    return {
      title: 'Grade Not Found - MoneyMates',
      description: 'The requested grade level could not be found.',
    };
  }

  const gradeNumber = parseInt(gradeMatch[1], 10);
  const gradeData = CURRICULUM_DATA[gradeNumber as Grade];
  
  if (!gradeData) {
    return {
      title: 'Grade Not Found - MoneyMates',
      description: 'The requested grade level could not be found.',
    };
  }

  return {
    title: `${gradeData.title} - MoneyMates Financial Literacy`,
    description: `Explore Ontario Financial Literacy curriculum expectations for Grade ${gradeNumber}. Learn about money management, budgeting, and financial decision-making.`,
  };
}