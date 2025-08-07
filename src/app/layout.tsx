import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ExpenseProvider } from "@/components/ExpenseProvider";
import { IncomeProvider } from "@/components/IncomeProvider";
import { BudgetProvider } from "@/components/BudgetProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthWrapper from "@/components/AuthWrapper";
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
          <AuthProvider>
            <AuthWrapper>
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
            </AuthWrapper>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
