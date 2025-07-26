'use client';

import React from 'react';

interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  title: string;
  centerText?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title, centerText }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0 || data.length === 0) {
    return (
      <div className="card text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="py-8">
          <p className="text-gray-500">No data to display</p>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const segments = data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100
  }));

  // Calculate stroke-dasharray for each segment
  const circumference = 2 * Math.PI * 45; // radius of 45
  let accumulatedPercentage = 0;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg 
            className="w-48 h-48 transform -rotate-90 drop-shadow-lg" 
            viewBox="0 0 100 100"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="30"
            />
            
            {/* Segments */}
            {segments.map((segment, index) => {
              const segmentLength = (segment.percentage / 100) * circumference;
              const remainingLength = circumference - segmentLength;
              const strokeDasharray = `${segmentLength} ${remainingLength}`;
              const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
              accumulatedPercentage += segment.percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="30"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="hover:opacity-80 transition-all duration-200"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                >
                  <title>{`${segment.label}: ${segment.percentage.toFixed(1)}%`}</title>
                </circle>
              );
            })}
          </svg>
          
          {centerText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{centerText}</div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2 w-full">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-gray-700">{segment.label}</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-gray-900">
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;