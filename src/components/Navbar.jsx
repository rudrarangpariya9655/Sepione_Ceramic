"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    setHash(window.location.hash);
  }, [pathname]);

  const handleHomeClick = (e) => {
    setHash('');
    setIsMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  const handleContactClick = (e) => {
    setHash('#contact');
    setIsMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '/#contact');
    }
  };

  const handleStandardLinkClick = () => {
    setHash('');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-6 left-0 right-0 mx-auto w-[95%] max-w-container-max z-50 bg-surface/90 backdrop-blur-xl border border-outline-variant/30 shadow-2xl rounded-full transition-all duration-700 animate-nav">
      <div className="flex justify-between items-center px-6 md:px-10 py-2 md:py-3 w-full h-full relative">
        <Link href="/" className="flex items-center">
          <Image src="/logo-nav.png" alt="Sepione Ceramic Logo" width={250} height={60} className="object-contain h-8 md:h-10 w-auto scale-[2.5] origin-left" priority />
        </Link>

        {/* Desktop Links (Perfectly Centered) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-gutter items-center font-body-md text-body-md uppercase tracking-[0.2em] whitespace-nowrap">
          <Link href="/" onClick={handleHomeClick} className={`pb-1 hover:opacity-80 transition-all duration-300 ${pathname === '/' && hash !== '#contact' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary'}`}>Home</Link>
          <Link href="/about" onClick={handleStandardLinkClick} className={`pb-1 hover:opacity-80 transition-all duration-300 ${pathname === '/about' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary'}`}>About</Link>
          <Link href="/informations" onClick={handleStandardLinkClick} className={`pb-1 hover:opacity-80 transition-all duration-300 ${pathname === '/informations' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary'}`}>Informations</Link>
          <Link href="/tiles/12x12" onClick={handleStandardLinkClick} className={`pb-1 hover:opacity-80 transition-all duration-300 ${pathname === '/tiles/12x12' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary'}`}>12x12</Link>
          <Link href="/tiles/16x16" onClick={handleStandardLinkClick} className={`pb-1 hover:opacity-80 transition-all duration-300 ${pathname === '/tiles/16x16' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary'}`}>16x16</Link>
          <Link href="/#contact" onClick={handleContactClick} className={`pb-1 hover:opacity-80 transition-all duration-300 ${hash === '#contact' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-primary'}`}>Contact</Link>
        </div>
        <div className="hidden md:flex items-center space-x-6 relative">
          <button
            onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
            className="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span className="font-body-md text-body-md uppercase tracking-[0.2em]">Collections</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isShopDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className={`absolute top-full right-0 mt-6 w-48 bg-surface-container-high border border-white/10 shadow-2xl rounded-xl overflow-hidden transition-all duration-300 flex flex-col origin-top-right ${isShopDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
            <Link
              href="/tiles/12x12"
              className="px-6 py-4 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-body-md uppercase tracking-widest text-sm border-b border-white/5"
              onClick={() => setIsShopDropdownOpen(false)}
            >
              12x12 Tiles
            </Link>
            <Link
              href="/tiles/16x16"
              className="px-6 py-4 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-body-md uppercase tracking-widest text-sm"
              onClick={() => setIsShopDropdownOpen(false)}
            >
              16x16 Tiles
            </Link>
          </div>
        </div>
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface-container-high border-b border-white/10 shadow-2xl flex flex-col p-6 gap-6 rounded-b-[2rem] animate-dropdown">
          <Link href="/" className={`font-body-lg uppercase tracking-[0.2em] ${pathname === '/' && hash !== '#contact' ? 'text-primary' : 'text-on-surface-variant'}`} onClick={handleHomeClick}>Home</Link>
          <Link href="/about" className={`font-body-lg uppercase tracking-[0.2em] ${pathname === '/about' ? 'text-primary' : 'text-on-surface-variant'}`} onClick={handleStandardLinkClick}>About</Link>
          <Link href="/informations" className={`font-body-lg uppercase tracking-[0.2em] ${pathname === '/informations' ? 'text-primary' : 'text-on-surface-variant'}`} onClick={handleStandardLinkClick}>Informations</Link>
          <Link href="/tiles/12x12" className={`font-body-lg uppercase tracking-[0.2em] ${pathname === '/tiles/12x12' ? 'text-primary' : 'text-on-surface-variant'}`} onClick={handleStandardLinkClick}>12x12</Link>
          <Link href="/tiles/16x16" className={`font-body-lg uppercase tracking-[0.2em] ${pathname === '/tiles/16x16' ? 'text-primary' : 'text-on-surface-variant'}`} onClick={handleStandardLinkClick}>16x16</Link>
          <Link href="/#contact" className={`font-body-lg uppercase tracking-[0.2em] ${hash === '#contact' ? 'text-primary' : 'text-on-surface-variant'}`} onClick={handleContactClick}>Contact</Link>
          <Link href="/tiles/12x12" className="font-body-lg text-primary uppercase tracking-[0.2em] mt-4" onClick={handleStandardLinkClick}>Collections</Link>
        </div>
      )}
    </nav>
  );
}
