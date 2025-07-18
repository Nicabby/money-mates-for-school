import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ExpenseProvider } from "@/components/ExpenseProvider";
import { IncomeProvider } from "@/components/IncomeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Financial Tracker",
  description: "Track your income and expenses with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ExpenseProvider>
            <IncomeProvider>
              <Navigation />
              <main className="container py-8">
                {children}
              </main>
            </IncomeProvider>
          </ExpenseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
