'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CURRICULUM_DATA, Grade, CurriculumExpectation } from '@/types/curriculum';
import LessonBreadcrumb from './LessonBreadcrumb';

interface GradeLessonsPageProps {
  grade: Grade;
}

// Grade 4 Scenario-Based Activities
const GRADE_4_ACTIVITIES = {
  'F1.1': {
    title: '"Match the Payment Method"',
    objective: 'Familiarize students with various payment methods.',
    scenario: 'Present four items (e.g., apples, toy, bus fare, digital game). Students drag-and-drop between icons (cash, debit card, e-transfer, gift card) to match appropriate payment methods.',
    steps: [
      'Show images of each method with labels (cash, card, etc.)',
      'Let students choose the matching method per item',
      'Provide instant feedback: "Correct—bus fare needs coins!"',
      'Reflect prompt: "Why might a card be better than cash sometimes?"'
    ]
  },
  'F1.2': {
    title: '"Shopping Cart Math"',
    objective: 'Estimate and calculate total cost and change using mental math.',
    scenario: 'Students pick two or three items (e.g., $3 apple + $5 book), and enter how much they\'d pay and how much change they\'d get from $10.',
    steps: [
      'Students pick items; total is hidden',
      'Students guess total, then hit "Reveal"',
      'Enter payment amount (like $10) and calculate change',
      'Provide guidance: "Subtract book from $10 first, then apple"'
    ]
  },
  'F1.3': {
    title: '"Spend vs Save Decision"',
    objective: 'Introduce spending, saving, earning, donating, and decision-making factors.',
    scenario: 'Student has $10. They can choose to spend $6 on candy or save $10 to donate later. They choose and write why.',
    steps: [
      'Show options (Spend, Save, Donate) with simple icons',
      'Student chooses one and writes a brief reason ("I save because I want a bigger toy")',
      'Guided reflection: "Good job! Saving lets you buy more later"',
      'Prompt: "What would you do next time?"'
    ]
  },
  'F1.4': {
    title: '"Budget Builder for a Class Party"',
    objective: 'Design and manage a simple budget for earning and spending.',
    scenario: 'The student earns $20 from chores. They plan to spend it on snacks ($8) and decorations ($6) and save the rest.',
    steps: [
      'Let students distribute $20 across expense categories and savings',
      'Show pie-chart or bar displaying allocations',
      'Show remaining amount',
      'Reflection: "Nice! You saved $6. What else could you budget for?"'
    ]
  }
};

const ExpectationCard: React.FC<{ expectation: CurriculumExpectation }> = ({ expectation }) => {
  const activity = GRADE_4_ACTIVITIES[expectation.code as keyof typeof GRADE_4_ACTIVITIES];
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px'
    }}>
      {/* Activity Section */}
      {activity && (
        <div style={{ 
          backgroundColor: '#f8f9ff', 
          padding: '20px', 
          borderRadius: '10px', 
          marginBottom: '25px',
          border: '2px solid #e0e7ff'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#3730a3', 
            marginBottom: '10px' 
          }}>
            🎮 Activity: {activity.title}
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#4c1d95', 
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            <strong>Objective:</strong> {activity.objective}
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#4c1d95', 
            marginBottom: '12px' 
          }}>
            <strong>Scenario:</strong> {activity.scenario}
          </p>
          <div>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#4c1d95', 
              marginBottom: '8px' 
            }}>
              Scaffolded Steps:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '0' }}>
              {activity.steps.map((step, index) => (
                <li key={index} style={{ 
                  fontSize: '13px', 
                  color: '#4c1d95', 
                  marginBottom: '4px' 
                }}>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Curriculum Expectation */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        {/* Code Badge */}
        <div style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          minWidth: '60px',
          textAlign: 'center',
          flexShrink: 0
        }}>
          {expectation.code}
        </div>
        
        {/* Title and Description */}
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#2d3748', 
            marginBottom: '10px',
            lineHeight: '1.3'
          }}>
            {expectation.title}
          </h3>
          <p style={{ 
            fontSize: '16px', 
            color: '#4a5568', 
            lineHeight: '1.5',
            margin: '0'
          }}>
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
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
            Grade Not Found
          </h1>
          <p style={{ color: '#718096', marginBottom: '24px' }}>
            The requested grade level is not available.
          </p>
          <button
            onClick={() => router.push('/lessons')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Back to Grade Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <LessonBreadcrumb />
        
        {/* Header Section */}
        <div style={{ marginBottom: '40px' }}>
          {/* Back Button */}
          <button
            onClick={() => router.push('/lessons')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#3b82f6',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              marginBottom: '30px',
              padding: '8px 0'
            }}
          >
            <svg 
              style={{ width: '20px', height: '20px', marginRight: '8px' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Grade Selection
          </button>

          {/* Grade Header - Remove circle */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#2d3748', 
              marginBottom: '15px' 
            }}>
              {gradeData.title}
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#718096',
              textAlign: 'center',
              margin: '0'
            }}>
              Ontario Mathematics Curriculum - Financial Literacy Strand
            </p>
          </div>
        </div>

        {/* Expectations Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#2d3748', 
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            Learning Expectations & Activities
          </h2>
          
          <div>
            {gradeData.expectations.map((expectation, index) => (
              <ExpectationCard 
                key={`${expectation.code}-${index}`} 
                expectation={expectation} 
              />
            ))}
          </div>
        </div>

        {/* Combined Activity */}
        <div style={{
          backgroundColor: '#fff7ed',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '40px',
          border: '2px solid #fed7aa'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#c2410c', 
            marginBottom: '15px' 
          }}>
            🌟 Combined Activity: "Shopping Spree Reflection" (F1.1+F1.2+F1.3)
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#9a3412', 
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            <strong>Objective:</strong> Synthesize all strands—payment choice, cost calculation, spending or saving decisions.
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#9a3412', 
            marginBottom: '12px' 
          }}>
            <strong>Scenario:</strong> Students have $15. They choose 2–3 items from a store—decide on payment methods, calculate total cost and change, and choose whether to spend or save remaining money.
          </p>
          <div>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#9a3412', 
              marginBottom: '8px' 
            }}>
              Scaffolded Steps:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '0' }}>
              <li style={{ fontSize: '13px', color: '#9a3412', marginBottom: '4px' }}>
                Pick items with prices
              </li>
              <li style={{ fontSize: '13px', color: '#9a3412', marginBottom: '4px' }}>
                Select payment method for each (icon)
              </li>
              <li style={{ fontSize: '13px', color: '#9a3412', marginBottom: '4px' }}>
                Enter or calculate total and change
              </li>
              <li style={{ fontSize: '13px', color: '#9a3412', marginBottom: '4px' }}>
                Choose what to do with remaining money (spend/saving/donate)
              </li>
              <li style={{ fontSize: '13px', color: '#9a3412', marginBottom: '4px' }}>
                Write a reflection: "I paid with cash, got $2 change, and decided to save—it's a good choice!"
              </li>
            </ul>
          </div>
        </div>

        {/* Action Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#2d3748', 
            marginBottom: '15px' 
          }}>
            Ready to Start Learning?
          </h3>
          <p style={{ 
            fontSize: '16px', 
            color: '#718096', 
            marginBottom: '25px' 
          }}>
            Begin your financial literacy journey with MoneyMates interactive lessons and activities designed specifically for Grade {grade} students.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              📊 Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/add-entry')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              🎓 Start First Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeLessonsPage;