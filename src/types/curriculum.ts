export interface CurriculumExpectation {
  code: string;
  title: string;
  description: string;
}

export interface GradeData {
  grade: number;
  title: string;
  expectations: CurriculumExpectation[];
}

export const CURRICULUM_DATA: Record<number, GradeData> = {
  4: {
    grade: 4,
    title: "Grade 4 Financial Literacy",
    expectations: [
      {
        code: "F1.1",
        title: "Identify various methods of payment",
        description: "Learn about cash, debit cards, credit cards, and digital payment methods used in everyday transactions."
      },
      {
        code: "F1.2", 
        title: "Estimate & calculate cost of transactions",
        description: "Practice estimating costs and calculating exact amounts for purchases, including making change."
      },
      {
        code: "F1.3",
        title: "Explain spending, saving, earning, investing, donating",
        description: "Understand the five key financial actions and how they work together in personal money management."
      },
      {
        code: "F1.4",
        title: "Explain relationship between spending and saving",
        description: "Discover how spending choices affect your ability to save money for future goals and needs."
      }
    ]
  },
  5: {
    grade: 5,
    title: "Grade 5 Financial Literacy", 
    expectations: [
      {
        code: "F1.1",
        title: "Describe ways money can be transferred",
        description: "Explore different methods of moving money between people and accounts, including electronic transfers."
      },
      {
        code: "F1.2",
        title: "Estimate & calculate cost including sales tax",
        description: "Learn to calculate the total cost of purchases when sales tax is added to the base price."
      },
      {
        code: "F1.3", 
        title: "Design basic budgets for earning/spending scenarios",
        description: "Create simple budgets that balance income from various sources with planned expenses."
      }
    ]
  },
  6: {
    grade: 6,
    title: "Grade 6 Financial Literacy",
    expectations: [
      {
        code: "F1.1",
        title: "Describe advantages/disadvantages of payment methods",
        description: "Compare the benefits and drawbacks of cash, cards, and digital payments in different situations."
      },
      {
        code: "F1.2",
        title: "Identify reliable information sources for planning",
        description: "Learn to find trustworthy sources of financial information to make informed money decisions."
      },
      {
        code: "F1.4",
        title: "Explain how spending vs saving behaviors differ",
        description: "Understand the characteristics and consequences of different spending and saving habits."
      }
    ]
  },
  7: {
    grade: 7,
    title: "Grade 7 Financial Literacy",
    expectations: [
      {
        code: "F1.1",
        title: "Identify and compare exchange rates and currency conversion",
        description: "Learn how currencies work internationally and practice converting between different currencies."
      },
      {
        code: "F1.3",
        title: "Use tools to maintain a balanced budget",
        description: "Apply budgeting tools and techniques to keep income and expenses in balance over time."
      },
      {
        code: "F1.4",
        title: "Describe factors influencing financial decisions",
        description: "Identify internal and external factors that affect how people make choices about money."
      }
    ]
  },
  8: {
    grade: 8,
    title: "Grade 8 Financial Literacy",
    expectations: [
      {
        code: "F1.1",
        title: "Describe pros/cons of payment methods in multi-currency context",
        description: "Analyze payment options when dealing with multiple currencies and international transactions."
      },
      {
        code: "F1.2",
        title: "Create a financial plan toward a long-term goal",
        description: "Develop comprehensive plans for achieving significant financial objectives over extended periods."
      },
      {
        code: "F1.3",
        title: "Track and adjust long-term budgets",
        description: "Monitor budget performance over time and make necessary adjustments to stay on track."
      },
      {
        code: "F1.4",
        title: "Calculate simple and compound interest using digital tools",
        description: "Use technology to compute interest earnings and understand how money grows over time."
      }
    ]
  }
};

export const AVAILABLE_GRADES = [4, 5, 6, 7, 8] as const;
export type Grade = typeof AVAILABLE_GRADES[number];