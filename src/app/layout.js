import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Navbar from "@/components/Navbar";

const syne = localFont({
  src: "./fonts/syne-latin.woff2",
  weight: "400 800",
  variable: "--font-syne",
  display: 'swap',
});

const hanken = localFont({
  src: "./fonts/hanken-grotesk-latin.woff2",
  weight: "100 900",
  variable: "--font-hanken",
  display: 'swap',
});

export const metadata = {
  title: { default: "Sepione Ceramic | Parking & Outdoor Tiles", template: "%s | Sepione Ceramic" },
  description: "Discover parking and outdoor tiles from Sepione Ceramic. 10 years of experience, crafted in Morbi, India, in 300 × 300 mm and 400 × 400 mm formats.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${syne.variable} ${hanken.variable}`}>
      <body className="antialiased selection:bg-primary-container selection:text-on-primary-container bg-background text-on-background">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
