'use client';

import React from 'react';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to My Money Tracker!",
      content: "This app helps you learn how to manage your money by tracking what you earn and spend. Think of it as your personal money diary that helps you make smart decisions with your cash.",
      why: "Learning to track money early builds habits that will help you save for big goals and avoid overspending throughout your life.",
      icon: "👋"
    },
    {
      title: "Record Your Earnings",
      content: "On the home page, find the 'Money I Earned' form on the left side. Fill in when you got money, how much, what type (allowance, chores, gift, etc.), and where it came from. Be specific - instead of just 'allowance', write 'weekly allowance for doing dishes and taking out trash'.",
      why: "Tracking income helps you see all your money sources and plan better. You might discover you earn more from chores than you thought!",
      icon: "💰"
    },
    {
      title: "Track Your Spending", 
      content: "Use the 'Money I Spent' form on the right side of the home page. Enter the date, amount, pick a category (Food, Entertainment, Shopping, etc.), and describe what you bought. Be honest and detailed - write 'pizza with friends' instead of just 'food'.",
      why: "This shows you exactly where your money goes. Many people are surprised to learn they spend more on snacks or games than they realized!",
      icon: "💸"
    },
    {
      title: "Check Your Dashboard",
      content: "Click 'Dashboard' in the navigation menu to see your money overview. You'll see how much you've earned total, spent total, and have left over. Look at the 'Where I Spend Most' and 'Where My Money Comes From' sections to understand your patterns.",
      why: "The dashboard gives you the big picture of your finances. It's like a report card for your money habits.",
      icon: "📊"
    },
    {
      title: "Create Smart Budgets",
      content: "Go to the 'Budgets' page and click 'Create New Budget'. Set realistic spending limits for categories like Food ($30/month) or Entertainment ($15/month). The app will warn you with colors when you're getting close to your limit - yellow means careful, red means stop!",
      why: "Budgets prevent overspending and help you save for things you really want. It's like giving yourself a spending allowance for each category.",
      icon: "🎯"
    },
    {
      title: "Explore Your Money Story",
      content: "Visit the 'Analytics' page to see colorful charts and graphs. The donut charts show your income vs expenses and spending by category. Look for patterns - do you spend more on weekends? Which category takes most of your money?",
      why: "Visual charts make it easy to spot trends and problem areas. You might see you're spending too much on one thing and can adjust.",
      icon: "📈"
    },
    {
      title: "Learn Money Vocabulary",
      content: "Click the 'Terms' link in the navigation (looks like a book icon) or scroll to the bottom of the home page. Read definitions of important money words like 'budget', 'income', 'expenses', and 'savings'. Use the search box to find specific terms quickly.",
      why: "Understanding money terms helps you talk about finances with parents and teachers, and prepares you for more advanced money topics later.",
      icon: "📚"
    },
    {
      title: "Share Your Progress",
      content: "On the 'Export' page, you can download reports of your money activity. Choose a specific month or all data, then download as CSV (for spreadsheets) or as a text report. Show these to parents or use them for school projects about personal finance.",
      why: "Sharing your progress keeps you accountable and shows parents you're being responsible with money. It can help you earn more trust and privileges.",
      icon: "📤"
    },
    {
      title: "Build Lasting Money Habits",
      content: "Try to log your earnings and spending every few days - don't wait weeks or you'll forget details. Set a phone reminder if needed. Review your dashboard weekly to see how you're doing. Celebrate when you stick to budgets or reach savings goals!",
      why: "Good money habits formed now will help you your whole life. People who track their money make better financial decisions and reach their goals faster.",
      icon: "💪"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold gradient-text">📋 How to Use My Money Tracker</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 leading-relaxed">{step.content}</p>
                      {step.why && (
                        <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded-r-lg">
                          <p className="text-blue-800 text-sm"><strong>Why this matters:</strong> {step.why}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">💡</span>
              <h4 className="font-semibold text-green-800">Pro Tips for Success!</h4>
            </div>
            <ul className="text-green-700 text-sm space-y-1 ml-6">
              <li>• Record transactions right after they happen so you don't forget</li>
              <li>• Start with small, realistic budgets and adjust as you learn</li>
              <li>• Check your dashboard weekly to stay on track</li>
              <li>• Ask parents or teachers if you need help understanding any terms</li>
              <li>• Celebrate when you stick to your budget or reach a savings goal!</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="btn btn-primary"
            >
              🚀 Got It! Let's Start Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;