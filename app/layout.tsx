import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const ppmori = localFont({
  src: [
    {
      path: "./fonts/PPMori-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/PPMori-ExtralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./fonts/PPMori-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/PPMori-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/PPMori-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/PPMori-SemiBoldItalic.otf",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-ppmori", // Optional CSS variable
  display: "swap", // Optional, controls font display behavior
});

export const metadata: Metadata = {
  title: "Strawberry AI - 0xLuigi",
  description: "Crypto never sleeps, Neither does AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ppmori.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
