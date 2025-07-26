'use client';

import React, { useState } from 'react';

interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  emoji: string;
}

const MoneyGlossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const glossaryTerms: GlossaryTerm[] = [
    {
      term: "Budget",
      definition: "A plan for how you want to spend your money. It helps you decide how much to spend on different things like snacks, games, or saving for something special.",
      example: "If you get $20 allowance, you might budget $10 for fun stuff, $5 for snacks, and $5 to save.",
      emoji: "📊"
    },
    {
      term: "Income",
      definition: "Money that comes to you. This could be your allowance, money from chores, birthday gifts, or money from a part-time job.",
      example: "Your weekly $10 allowance and $5 from walking the neighbor's dog are both income.",
      emoji: "💰"
    },
    {
      term: "Expense",
      definition: "Money you spend on things you buy. Every time you pay for something, that's an expense.",
      example: "Buying a $3 snack or a $15 video game are both expenses.",
      emoji: "💸"
    },
    {
      term: "Savings",
      definition: "Money you don't spend right away. You keep it safe to buy something bigger later or for emergencies.",
      example: "Saving $5 each week to buy a $50 skateboard in 10 weeks.",
      emoji: "🏦"
    },
    {
      term: "Goal",
      definition: "Something you want to buy or achieve with your money. Having a goal helps you save and spend wisely.",
      example: "Your goal might be to save $100 for new headphones or $500 for a bike.",
      emoji: "🎯"
    },
    {
      term: "Tracking",
      definition: "Writing down or recording where your money comes from and where it goes. This helps you see your spending patterns.",
      example: "Using this app to record that you spent $4 on lunch and earned $10 from chores.",
      emoji: "📝"
    },
    {
      term: "Category",
      definition: "A group or type of spending. Categories help you organize where your money goes.",
      example: "Food, Entertainment, Clothes, and Transportation are all categories.",
      emoji: "📂"
    },
    {
      term: "Allowance",
      definition: "Regular money your parents give you, usually weekly or monthly, for personal spending or to learn money management.",
      example: "Getting $15 every Sunday to spend however you want.",
      emoji: "👨‍👩‍👧‍👦"
    },
    {
      term: "Emergency Fund",
      definition: "Money you save for unexpected things that might happen, like losing something important or needing to replace something broken.",
      example: "Saving $20 in case you lose your phone charger or your bike tire goes flat.",
      emoji: "🆘"
    },
    {
      term: "Want vs Need",
      definition: "A need is something you must have (like food or school supplies). A want is something nice to have but you can live without it (like candy or new games).",
      example: "School lunch is a need. Extra dessert is a want.",
      emoji: "🤔"
    },
    {
      term: "Impulse Buy",
      definition: "Buying something without thinking about it first, usually because you see it and want it right away.",
      example: "Seeing a cool toy at the store and buying it without checking if you have enough money for other things.",
      emoji: "⚡"
    },
    {
      term: "Balance",
      definition: "How much money you have left after subtracting what you spent from what you earned.",
      example: "If you earned $20 and spent $12, your balance is $8.",
      emoji: "⚖️"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Terms' },
    { value: 'basic', label: 'Basic Concepts' },
    { value: 'planning', label: 'Planning & Goals' },
    { value: 'spending', label: 'Spending & Saving' }
  ];

  const getCategoryForTerm = (term: string): string => {
    const basicTerms = ['Income', 'Expense', 'Balance', 'Tracking', 'Category'];
    const planningTerms = ['Budget', 'Goal', 'Want vs Need', 'Emergency Fund'];
    const spendingTerms = ['Savings', 'Allowance', 'Impulse Buy'];
    
    if (basicTerms.includes(term)) return 'basic';
    if (planningTerms.includes(term)) return 'planning';
    if (spendingTerms.includes(term)) return 'spending';
    return 'basic';
  };

  const filteredTerms = glossaryTerms.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || getCategoryForTerm(item.term) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="glossary" className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">📚 Money Terms Guide</h2>
        <p className="text-gray-600">
          Learn the important words that will help you become awesome with money!
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Search for a term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{item.emoji}</span>
              <h3 className="text-lg font-semibold text-gray-900">{item.term}</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
              {item.definition}
            </p>
            {item.example && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                <p className="text-blue-800 text-sm">
                  <strong>Example:</strong> {item.example}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No terms found matching your search.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="btn btn-secondary mt-2"
          >
            Show All Terms
          </button>
        </div>
      )}

      {/* Fun Tip */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💡</span>
          <h4 className="font-semibold text-green-800">Pro Tip!</h4>
        </div>
        <p className="text-green-700 text-sm">
          The best way to learn these terms is to use them! Try using one new money word each week when talking about your spending and earning.
        </p>
      </div>
    </div>
  );
};

export default MoneyGlossary;