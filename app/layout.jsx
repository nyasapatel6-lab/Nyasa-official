import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display face — expressive serif with optical sizing, carries the
// cinematic / editorial weight of the huge stacked name.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

// Body / UI face — quiet, geometric, gets out of the way.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

// Utility face — for the tagline, timecode HUD, and control labels.
// Gives a technical, film-slate / terminal feel.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "Nyasa Patel — CS & AI Student",
  description:
    "Portfolio of Nyasa Patel — Computer Science & AI student building intelligent, human-centered software.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
