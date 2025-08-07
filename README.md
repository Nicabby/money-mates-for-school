# MoneyMates for School

A curriculum-aligned financial literacy application for Ontario Grade 4 students, built with Next.js 14, TypeScript, and Tailwind CSS. Features interactive lessons covering Ontario curriculum expectations F1.1, F1.2, and F1.3, with family expense tracking and educational components.

## Features

### Core Functionality
- ✅ **Add Expenses**: Create new expenses with date, amount, category, and description
- ✅ **Edit Expenses**: Update existing expenses with full form validation
- ✅ **Delete Expenses**: Remove expenses with confirmation prompts
- ✅ **View Expenses**: Clean, organized list of all expenses
- ✅ **Search & Filter**: Filter by category, date range, and search descriptions
- ✅ **Data Persistence**: All data stored in localStorage for demo purposes

### Dashboard & Analytics
- ✅ **Dashboard Overview**: Quick summary of total expenses, monthly spending, and top categories
- ✅ **Analytics Page**: Detailed spending insights with visual charts
- ✅ **Category Breakdown**: Visual representation of spending by category
- ✅ **Monthly Trends**: Track spending patterns over time
- ✅ **Recent Expenses**: Quick access to your latest transactions

### Categories
- 🍽️ **Food**: Restaurants, groceries, takeout
- 🚗 **Transportation**: Gas, public transit, ride-sharing
- 🎬 **Entertainment**: Movies, games, subscriptions
- 🛍️ **Shopping**: Clothing, electronics, general purchases
- 💳 **Bills**: Utilities, rent, insurance
- 💻 **Tech**: Software, hardware, digital services
- 📝 **Other**: Miscellaneous expenses

### Export & Data
- ✅ **CSV Export**: Export your expenses to CSV format
- ✅ **Responsive Design**: Works perfectly on desktop and mobile
- ✅ **Form Validation**: Comprehensive validation with helpful error messages
- ✅ **Loading States**: Visual feedback during operations
- ✅ **Error Handling**: Graceful error handling with user-friendly messages

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Emoji-based icons for simplicity
- **Data Storage**: localStorage (for demo purposes)
- **State Management**: React Context API
- **Form Handling**: Custom validation with TypeScript

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
expense-tracker-ai/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── add/               # Add expense page
│   │   ├── analytics/         # Analytics page
│   │   ├── expenses/          # Expenses list and edit pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page (dashboard)
│   ├── components/            # Reusable components
│   │   ├── Dashboard.tsx      # Main dashboard component
│   │   ├── ExpenseForm.tsx    # Add/edit expense form
│   │   ├── ExpenseList.tsx    # Expenses list with filters
│   │   ├── ExpenseProvider.tsx # Context provider
│   │   ├── Navigation.tsx     # Navigation component
│   │   ├── SpendingChart.tsx  # Category spending chart
│   │   ├── MonthlyChart.tsx   # Monthly spending chart
│   │   ├── LoadingSpinner.tsx # Loading state component
│   │   └── ErrorBoundary.tsx  # Error handling
│   ├── lib/                   # Utility functions
│   │   ├── storage.ts         # localStorage service
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript interfaces
│       └── expense.ts         # Expense-related types
├── public/                    # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

## Usage Guide

### Adding a New Expense

1. Navigate to the **Add Expense** page using the navigation or the "+" button
2. Fill in the required fields:
   - **Date**: Select the date of the expense (cannot be in the future)
   - **Amount**: Enter the amount spent (positive number)
   - **Category**: Choose from the available categories
   - **Description**: Provide a brief description (minimum 3 characters)
3. Click **Add Expense** to save

### Viewing and Managing Expenses

1. Go to the **Expenses** page to see all your expenses
2. Use the filters to narrow down your view:
   - **Category**: Filter by expense category
   - **Date Range**: Set from and to dates
   - **Search**: Search expense descriptions
3. Click the edit icon (✏️) to modify an expense
4. Click the delete icon (🗑️) to remove an expense

### Analytics and Insights

1. Visit the **Analytics** page for detailed insights
2. View your spending by category with visual charts
3. Track monthly spending trends
4. See quick stats like total transactions and highest expense

### Exporting Data

1. From the **Expenses** page, click **Export CSV**
2. Your expenses will be downloaded as a CSV file
3. The export includes all filtered expenses if filters are applied

## Testing the Application

### Manual Testing Checklist

**Navigation & Layout:**
- ✅ Navigation works on desktop and mobile
- ✅ All pages load correctly
- ✅ Responsive design adapts to different screen sizes

**Add Expense:**
- ✅ Form validation works (try empty fields, invalid amounts, future dates)
- ✅ All categories are selectable
- ✅ Success message appears after adding
- ✅ Redirects to expenses list after adding

**Expenses List:**
- ✅ Displays all expenses correctly
- ✅ Filtering by category works
- ✅ Date range filtering works
- ✅ Search functionality works
- ✅ Edit and delete buttons work
- ✅ CSV export downloads correctly

**Dashboard:**
- ✅ Summary cards show correct totals
- ✅ Recent expenses are displayed
- ✅ Top categories are shown
- ✅ Monthly spending is calculated correctly

**Analytics:**
- ✅ Charts render correctly
- ✅ Category breakdown is accurate
- ✅ Monthly trends are displayed
- ✅ Quick stats are correct

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Static Generation**: Pages are pre-rendered for fast loading
- **Code Splitting**: Automatic code splitting for optimal bundle sizes
- **Lazy Loading**: Components load only when needed
- **Optimized Build**: Production build is optimized for performance
- **Caching**: LocalStorage for instant data access

## Security Considerations

- **Input Validation**: All user inputs are validated
- **XSS Protection**: Proper escaping of user content
- **Type Safety**: TypeScript prevents many runtime errors
- **Error Boundaries**: Graceful error handling

---

**Happy expense tracking!** 💰📊
