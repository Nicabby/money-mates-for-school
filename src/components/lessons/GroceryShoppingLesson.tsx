'use client';

import React, { useState, useEffect } from 'react';
import { LessonModule, LessonResponse, GroceryItem } from '@/types/lesson';

interface GroceryShoppingLessonProps {
  onComplete: (response: Omit<LessonResponse, 'id' | 'studentId' | 'completedAt'>) => void;
  studentId?: string;
}

const groceryItems: GroceryItem[] = [
  { id: '1', name: 'Apples', price: 3, category: 'fruits', emoji: '🍎' },
  { id: '2', name: 'Bananas', price: 2, category: 'fruits', emoji: '🍌' },
  { id: '3', name: 'Milk', price: 4, category: 'dairy', emoji: '🥛' },
  { id: '4', name: 'Bread', price: 3, category: 'snacks', emoji: '🍞' },
  { id: '5', name: 'Cheese', price: 5, category: 'dairy', emoji: '🧀' },
  { id: '6', name: 'Carrots', price: 2, category: 'vegetables', emoji: '🥕' },
  { id: '7', name: 'Juice', price: 3, category: 'beverages', emoji: '🧃' },
  { id: '8', name: 'Cookies', price: 4, category: 'snacks', emoji: '🍪' }
];

const lessonData: LessonModule = {
  id: 'grocery-shopping-f1-2',
  title: 'Grocery Shopping Adventure',
  strand: 'F1.2',
  description: 'Learn to calculate costs and change while shopping for groceries',
  scenario: `You have $20 to spend at the grocery store. Help Maya choose items for her family's weekly groceries and calculate the total cost and change.`,
  objectives: [
    'Calculate the total cost of multiple grocery items',
    'Determine the correct change from a $20 bill',
    'Practice mental math with whole dollar amounts',
    'Learn about making smart spending decisions'
  ],
  activities: [],
  discussionPrompt: 'How do you and your family decide what to buy when grocery shopping? What factors help you make good spending choices?',
  timeEstimate: 15
};

export default function GroceryShoppingLesson({ onComplete, studentId }: GroceryShoppingLessonProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'context' | 'shopping' | 'calculation' | 'payment' | 'reflection' | 'complete'>('context');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number>(0);

  const selectedGroceryItems = selectedItems.map(id => groceryItems.find(item => item.id === id)!).filter(Boolean);
  const totalCost = selectedGroceryItems.reduce((sum, item) => sum + item.price, 0);
  const change = 20 - totalCost;

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCalculationSubmit = (calculatedTotal: number, calculatedChange: number) => {
    let currentScore = 0;
    let feedbackText = '';

    if (calculatedTotal === totalCost) {
      currentScore += 50;
      feedbackText += '✅ Correct total! ';
    } else {
      feedbackText += `❌ Total should be $${totalCost}, not $${calculatedTotal}. `;
    }

    if (calculatedChange === change) {
      currentScore += 50;
      feedbackText += '✅ Correct change! ';
    } else {
      feedbackText += `❌ Change should be $${change}, not $${calculatedChange}. `;
    }

    setAnswers(prev => ({
      ...prev,
      selectedItems: selectedItems,
      calculatedTotal,
      calculatedChange,
      correctTotal: totalCost,
      correctChange: change
    }));

    setScore(currentScore);
    setFeedback(feedbackText);
    setCurrentStep('payment');
  };

  const handlePaymentMethod = (method: string) => {
    setAnswers(prev => ({ ...prev, paymentMethod: method }));
    setCurrentStep('reflection');
  };

  const handleReflectionSubmit = (reflection: string) => {
    setAnswers(prev => ({ ...prev, reflection }));
    setCurrentStep('complete');
    
    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    onComplete({
      lessonId: lessonData.id,
      lessonTitle: lessonData.title,
      strand: lessonData.strand,
      answers: { ...answers, reflection },
      score,
      timeSpent
    });
  };

  if (currentStep === 'context') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-800">Ontario Curriculum Strand: {lessonData.strand}</h3>
          <p className="text-sm text-blue-600 mt-1">
            F1.2: Estimate and calculate the cost of transactions involving multiple items priced in whole-dollar amounts, 
            not including sales tax, and the amount of change needed when payment is made in cash, using mental math
          </p>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">🛒 {lessonData.title}</h1>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-3">📖 The Scenario</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{lessonData.scenario}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Learning Objectives</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {lessonData.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">⏰ Estimated time: {lessonData.timeEstimate} minutes</p>
          <button 
            onClick={() => setCurrentStep('shopping')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Start Shopping! 🛍️
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'shopping') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛒 Choose Your Groceries</h2>
        
        <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
          <p className="text-green-800 font-semibold">💰 Budget: $20</p>
          <p className="text-sm text-green-600 mt-1">Click on items to add them to your cart!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {groceryItems.map(item => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleItemToggle(item.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-green-500 bg-green-50 scale-105' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                }`}
              >
                <div className="text-4xl text-center mb-2">{item.emoji}</div>
                <h3 className="font-semibold text-gray-800 text-center">{item.name}</h3>
                <p className="text-green-600 font-bold text-center">${item.price}</p>
                {isSelected && <div className="text-center text-green-600 mt-2">✅ Added</div>}
              </div>
            );
          })}
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">🛍️ Your Cart:</h3>
            <div className="space-y-1">
              {selectedGroceryItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-blue-700">
                  <span>{item.emoji} {item.name}</span>
                  <span className="font-semibold">${item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button 
            onClick={() => setCurrentStep('context')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            ← Back
          </button>
          <button 
            onClick={() => setCurrentStep('calculation')}
            disabled={selectedItems.length === 0}
            className={`px-6 py-2 rounded-lg font-semibold ${
              selectedItems.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Calculate Total 🧮
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'calculation') {
    return (
      <CalculationStep 
        selectedItems={selectedGroceryItems}
        totalCost={totalCost}
        onSubmit={handleCalculationSubmit}
        onBack={() => setCurrentStep('shopping')}
      />
    );
  }

  if (currentStep === 'payment') {
    return (
      <PaymentStep 
        feedback={feedback}
        score={score}
        totalCost={totalCost}
        change={change}
        onPaymentMethod={handlePaymentMethod}
      />
    );
  }

  if (currentStep === 'reflection') {
    return (
      <ReflectionStep 
        discussionPrompt={lessonData.discussionPrompt}
        onSubmit={handleReflectionSubmit}
        onBack={() => setCurrentStep('payment')}
      />
    );
  }

  if (currentStep === 'complete') {
    return (
      <CompletionStep 
        score={score}
        selectedItems={selectedGroceryItems}
        totalCost={totalCost}
        change={change}
        lessonData={lessonData}
      />
    );
  }

  return null;
}

// Sub-components
function CalculationStep({ selectedItems, totalCost, onSubmit, onBack }: any) {
  const [calculatedTotal, setCalculatedTotal] = useState<string>('');
  const [calculatedChange, setCalculatedChange] = useState<string>('');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🧮 Calculate Your Total</h2>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">Your Selected Items:</h3>
        <div className="space-y-2">
          {selectedItems.map((item: GroceryItem, index: number) => (
            <div key={item.id} className="flex justify-between items-center text-yellow-700">
              <span>{item.emoji} {item.name}</span>
              <span className="font-semibold">${item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is the total cost of all items?
          </label>
          <input
            type="number"
            value={calculatedTotal}
            onChange={(e) => setCalculatedTotal(e.target.value)}
            placeholder="Enter total cost"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            If you pay with a $20 bill, how much change will you receive?
          </label>
          <input
            type="number"
            value={calculatedChange}
            onChange={(e) => setCalculatedChange(e.target.value)}
            placeholder="Enter change amount"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          ← Back to Shopping
        </button>
        <button 
          onClick={() => onSubmit(Number(calculatedTotal), Number(calculatedChange))}
          disabled={!calculatedTotal || !calculatedChange}
          className={`px-6 py-2 rounded-lg font-semibold ${
            !calculatedTotal || !calculatedChange
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          Check My Answer ✓
        </button>
      </div>
    </div>
  );
}

function PaymentStep({ feedback, score, totalCost, change, onPaymentMethod }: any) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💳 Payment Methods</h2>
      
      <div className={`p-4 rounded-lg mb-6 border ${
        score > 75 ? 'bg-green-50 border-green-200' : 
        score > 50 ? 'bg-yellow-50 border-yellow-200' : 
        'bg-red-50 border-red-200'
      }`}>
        <h3 className="font-semibold mb-2">📊 Your Results:</h3>
        <p className="mb-2">{feedback}</p>
        <p className="font-semibold">Score: {score}/100</p>
        <div className="mt-2 text-sm text-gray-600">
          <p>✅ Correct: Total = ${totalCost}, Change = ${change}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">🏷️ Ontario Curriculum Connection: F1.1</h3>
        <p className="text-gray-600 mb-4">
          F1.1: Identify various methods of payment that can be used to purchase goods and services
        </p>
        <p className="text-gray-700 mb-4">Choose how Maya could pay for her groceries:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { method: 'Cash', emoji: '💵', description: 'Paper money and coins' },
            { method: 'Debit Card', emoji: '💳', description: 'Money from bank account' },
            { method: 'Credit Card', emoji: '💴', description: 'Borrowed money to pay back later' }
          ].map(payment => (
            <button
              key={payment.method}
              onClick={() => onPaymentMethod(payment.method)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="text-3xl text-center mb-2">{payment.emoji}</div>
              <h4 className="font-semibold text-gray-800">{payment.method}</h4>
              <p className="text-sm text-gray-600">{payment.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReflectionStep({ discussionPrompt, onSubmit, onBack }: any) {
  const [reflection, setReflection] = useState<string>('');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💭 Reflection & Discussion</h2>
      
      <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-2">🏷️ Ontario Curriculum Connection: F1.3</h3>
        <p className="text-sm text-purple-600">
          F1.3: Explain the concepts of spending, saving, earning, investing, and donating, 
          and identify key factors to consider when making basic decisions related to each
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Discussion Question:</h3>
        <p className="text-gray-700 mb-4 p-4 bg-gray-50 rounded-lg border">{discussionPrompt}</p>
        
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your thoughts and ideas:
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Share your thoughts about grocery shopping and spending decisions..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
        <button 
          onClick={() => onSubmit(reflection)}
          disabled={reflection.trim().length < 10}
          className={`px-6 py-2 rounded-lg font-semibold ${
            reflection.trim().length < 10
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          Complete Lesson ✨
        </button>
      </div>
    </div>
  );
}

function CompletionStep({ score, selectedItems, totalCost, change, lessonData }: any) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Congratulations!</h2>
        <p className="text-xl text-gray-600">You completed the {lessonData.title} lesson!</p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">📊 Lesson Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-green-700">
          <div>
            <p><strong>Your Score:</strong> {score}/100</p>
            <p><strong>Items Selected:</strong> {selectedItems.length}</p>
          </div>
          <div>
            <p><strong>Total Cost:</strong> ${totalCost}</p>
            <p><strong>Change:</strong> ${change}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">🎯 What You Learned</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          {lessonData.objectives.map((objective: string, index: number) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Great job practicing your math skills and learning about money management!
        </p>
        <p className="text-sm text-gray-500">
          💡 Share your learning with your family or teacher using the discussion prompt from this lesson.
        </p>
      </div>
    </div>
  );
}