import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "AIESEC Talent Hub - Live Opportunities Portal",
  description: "Discover live Global Talent (GTa), Global Teacher (GTe), and Global Volunteer (GV) opportunities from AIESEC. Connect your access token or explore in interactive demo mode.",
  keywords: "AIESEC, Global Talent, Global Teacher, Global Volunteer, Internships, Volunteer, EXPA, GIS API, Opportunities"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
