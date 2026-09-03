import { Syne, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Navbar from "@/components/Navbar";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: 'swap',
});

export const metadata = {
  title: "Sepione Ceramic",
  description: "Avant-garde ceramics crafted for spaces that demand presence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${hanken.variable}`}>
      <body className="antialiased selection:bg-primary-container selection:text-on-primary-container bg-background text-on-background">
        {/* Ambient Background Shapes */}
        <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] organic-shape-1 -z-10 animate-[spin_60s_linear_infinite]"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] organic-shape-1 -z-10 animate-[spin_40s_linear_infinite_reverse]"></div>

        <SplashScreen />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
