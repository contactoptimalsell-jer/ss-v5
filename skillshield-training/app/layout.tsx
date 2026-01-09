import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SkillShield Training - Formation et développement professionnel",
  description: "SkillShield Training - Développez vos compétences et formez vos équipes avec nos programmes de formation professionnelle.",
  keywords: ["formation", "développement professionnel", "compétences", "training", "formation entreprise"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
