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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <LessonBreadcrumb />
        
        {/* Logo */}
        <div style={{ marginBottom: '40px' }}>
          <img 
            src="/MoneyMateslogo.png" 
            alt="MoneyMates" 
            style={{ height: '120px', margin: '0 auto', display: 'block' }}
          />
        </div>

        {/* Title */}
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#2d3748', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Select Your Grade
        </h1>

        {/* Description */}
        <p style={{ 
          fontSize: '20px', 
          color: '#718096', 
          marginBottom: '60px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 60px auto'
        }}>
          Select your grade level to explore Ontario curriculum expectations designed just for you!
        </p>

        {/* Grade Buttons */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '30px',
          maxWidth: '900px',
          margin: '0 auto 60px auto'
        }}>
          {AVAILABLE_GRADES.map((grade) => (
            <div
              key={grade}
              onClick={() => handleGradeSelect(grade)}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '40px 20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: '20px'
              }}>
                <span style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  Grade<br />{grade}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#2d3748', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Ontario Curriculum Aligned
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#718096', 
            lineHeight: '1.6',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            Each grade level contains specific learning expectations from the Ontario Mathematics 
            curriculum's strand. Select your grade to see what you'll learn 
            about money management, budgeting, and financial decision-making!
          </p>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>💰</div>
              <h4 style={{ fontWeight: '600', color: '#2d3748', marginBottom: '5px' }}>Money Management</h4>
              <p style={{ fontSize: '14px', color: '#718096' }}>Learn practical money skills</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
              <h4 style={{ fontWeight: '600', color: '#2d3748', marginBottom: '5px' }}>Budgeting</h4>
              <p style={{ fontSize: '14px', color: '#718096' }}>Create and maintain budgets</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎯</div>
              <h4 style={{ fontWeight: '600', color: '#2d3748', marginBottom: '5px' }}>Smart Decisions</h4>
              <p style={{ fontSize: '14px', color: '#718096' }}>Make informed financial choices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeSelectionLanding;