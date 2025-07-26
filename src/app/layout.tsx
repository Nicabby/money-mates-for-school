import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ExpenseProvider } from "@/components/ExpenseProvider";
import { IncomeProvider } from "@/components/IncomeProvider";
import { BudgetProvider } from "@/components/BudgetProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "MoneyMates - Learn Budgeting for Kids & Teens",
  description: "A fun and easy way for kids and teens to learn money management, track allowance, and build smart spending habits",
  icons: {
    icon: "/moneymatespig.png",
    shortcut: "/moneymatespig.png",
    apple: "/moneymatespig.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <ErrorBoundary>
          <ExpenseProvider>
            <IncomeProvider>
              <BudgetProvider>
                <Navigation />
                <main className="container py-8">
                  {children}
                </main>
              </BudgetProvider>
            </IncomeProvider>
          </ExpenseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
