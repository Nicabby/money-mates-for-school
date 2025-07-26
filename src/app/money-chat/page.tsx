'use client';

import React from 'react';

export default function MoneyChatPage() {
  const parentTips = [
    {
      title: "Start Age-Appropriate Conversations",
      content: "Begin money discussions early with simple concepts. For 6-8 year olds, talk about needs vs wants. For 9-12 year olds, introduce budgeting basics. Teens can handle more complex topics like saving goals and spending decisions.",
      icon: "💬"
    },
    {
      title: "Make It Hands-On",
      content: "Let your child handle real money transactions when possible. Take them grocery shopping and involve them in comparing prices. Give them a small budget for a specific purchase and let them make decisions.",
      icon: "👥"
    },
    {
      title: "Use the App Together",
      content: "MoneyMates works best when families use it together. Review your child&apos;s entries weekly, celebrate when they stay within budget, and discuss spending patterns you notice in the analytics.",
      icon: "📱"
    },
    {
      title: "Set Clear Expectations",
      content: "Establish rules about tracking expenses immediately after purchases. Create consequences for forgetting to log expenses, but keep them learning-focused rather than punitive.",
      icon: "📋"
    },
    {
      title: "Celebrate Small Wins",
      content: "Acknowledge when your child remembers to track expenses, stays within budget, or reaches a savings goal. Consider small rewards for consistent app usage in the first month.",
      icon: "🎉"
    },
    {
      title: "Connect to Real Goals",
      content: "Help your child identify something they really want to buy, then work backwards to create a savings plan. Use the budget features to show how cutting back in one area can fund their goal faster.",
      icon: "🎯"
    }
  ];

  const faqs = [
    {
      question: "How often should we review the app together?",
      answer: "Weekly check-ins work best for most families. Pick a consistent day like Sunday evening to review the week&apos;s entries, discuss spending patterns, and plan for the upcoming week."
    },
    {
      question: "What if my child forgets to track expenses?",
      answer: "Start with gentle reminders and make it part of the transaction routine. You can also set up phone notifications or use the receipt review method - save receipts and enter them together at the end of each day."
    },
    {
      question: "How much allowance should I give?",
      answer: "A common guideline is $1-2 per week per year of age (so $10-20/week for a 10-year-old), but adjust based on your family&apos;s budget and what expenses your child is responsible for covering."
    },
    {
      question: "Should I let them make mistakes with money?",
      answer: "Yes! Mistakes are valuable learning opportunities when the stakes are low. If they overspend and can&apos;t afford something they want, resist the urge to bail them out. Use it as a teaching moment instead."
    }
  ];

  return (
    <div className="space-y-8" style={{ paddingTop: '12pt' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">💬 MoneyChat</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Tips and guidance for parents to support their child&apos;s financial learning journey
        </p>
      </div>

      {/* Parent Tips Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">📚 Tips for Parents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parentTips.map((tip, index) => (
            <div key={index} className="card border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-3xl">{tip.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{tip.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">❓ Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">🚀 Getting Started Checklist</h2>
          <div className="text-left space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">Set up your child&apos;s first budget together</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">Show them how to record their first expense</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">Explore the Money Terms Guide together</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">Schedule your first weekly review</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">Set a savings goal they&apos;re excited about</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}