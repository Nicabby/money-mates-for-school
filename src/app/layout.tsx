import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ExpenseProvider } from "@/components/ExpenseProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Business Expenses",
  description: "Track your business expenses with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <ErrorBoundary>
          <ExpenseProvider>
            <Navigation />
            <main className="container py-8">
              {children}
            </main>
          </ExpenseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
