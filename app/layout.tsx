import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";

export const metadata: Metadata = {
  title: "Kumorebe - Strategy-First AI Campaign Generator",
  description: "Create breakthrough marketing campaigns with AI that thinks like a strategist, not a content mill.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          href="https://api.fontshare.com/v2/css?f[]=chillax@400,500,600,700&display=swap" 
          rel="stylesheet"
        />
        <link 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-satoshi" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}