// layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ServiceConfigProvider } from "./ServiceConfigContext";
import "./globals.css";

import Header from "./html_components/header/Header";
import Footer from "./html_components/footer/Footer";
import NavBar from "./html_components/navbar/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header title="Lear .maestro client" subtitle="1.0.0" />
        <NavBar />
        <main className="flex-grow px-4 py-2 pb-16 flex">
          <ServiceConfigProvider>{children}</ServiceConfigProvider>
        </main>
        <Footer title="© 2025 Maestro" subtitle="All rights reserved" />
      </body>
    </html>
  );
}
