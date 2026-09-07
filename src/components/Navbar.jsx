"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, MenuIcon, CloseIcon, GridIcon } from "@/components/icons";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/informations", label: "Informations" },
  { href: "/tiles/12x12", label: "12x12" },
  { href: "/tiles/16x16", label: "16x16" },
  { href: "/#contact", label: "Contact" },
];

const COLLECTIONS = [
  { href: "/tiles/12x12", label: "12x12 Tiles", note: "300x300mm standard" },
  { href: "/tiles/16x16", label: "16x16 Tiles", note: "400x400mm monumental" },
];

const easing = [0.2, 0.8, 0.2, 1];

/*
  The URL fragment is the single source of truth for whether Contact is the
  active tab. Reading it through useSyncExternalStore keeps it in sync without
  a setState-in-effect, which React now flags as a cascading render.
  history.pushState fires neither hashchange nor popstate, so the click handler
  dispatches a synthetic hashchange after pushing.
*/
const subscribeToHash = (onChange) => {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
};
const getHashSnapshot = () => window.location.hash;
const getServerHashSnapshot = () => "";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const hash = useSyncExternalStore(
    subscribeToHash,
    getHashSnapshot,
    getServerHashSnapshot
  );

  // Collapse any open menu when the route changes, adjusting state during
  // render rather than in an effect so there is no extra commit.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
  }

  // Condense the bar once the page starts moving.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the Collections menu on outside click or Escape.
  useEffect(() => {
    if (!isShopDropdownOpen) return;
    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsShopDropdownOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsShopDropdownOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isShopDropdownOpen]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileMenuOpen]);

  const isActive = useCallback(
    (href) => {
      if (href === "/#contact") return pathname === "/" && hash === "#contact";
      if (href === "/") return pathname === "/" && hash !== "#contact";
      return pathname === href;
    },
    [pathname, hash]
  );

  const handleNavClick = (href) => (e) => {
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);

    if (href === "/#contact") {
      if (pathname === "/") {
        e.preventDefault();
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "/#contact");
        window.dispatchEvent(new Event("hashchange"));
      }
      return;
    }

    if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      window.dispatchEvent(new Event("hashchange"));
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easing }}
      className={`fixed top-4 md:top-6 left-0 right-0 mx-auto w-[95%] max-w-container-max z-50 rounded-full border backdrop-blur-xl transition-[background-color,box-shadow,border-color,padding] duration-500 ${
        isScrolled
          ? "bg-surface/95 border-outline-variant/50 ambient-shadow"
          : "bg-surface/80 border-outline-variant/25 ambient-shadow-sm"
      }`}
    >
      <div
        className={`flex justify-between items-center px-6 md:px-10 w-full h-full relative transition-[padding] duration-500 ${
          isScrolled ? "py-1.5 md:py-2" : "py-2 md:py-3"
        }`}
      >
        <Link href="/" onClick={handleNavClick("/")} className="flex items-center group">
          <Image
            src="/logo-nav.png"
            alt="Sepione Ceramic"
            width={250}
            height={60}
            className="object-contain h-8 md:h-10 w-auto scale-[2.5] origin-left transition-transform duration-500 group-hover:scale-[2.6]"
            priority
          />
        </Link>

        {/* Desktop links, optically centered in the bar */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-7 lg:gap-gutter items-center font-body-md text-body-md uppercase tracking-[0.2em] whitespace-nowrap">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick(link.href)}
                aria-current={active ? "page" : undefined}
                className={`relative pb-1 transition-colors duration-300 ${
                  active ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-px bg-primary"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Collections menu */}
        <div className="hidden md:flex items-center relative" ref={dropdownRef}>
          <button
            onClick={() => setIsShopDropdownOpen((open) => !open)}
            aria-expanded={isShopDropdownOpen}
            aria-haspopup="true"
            className="text-primary hover:opacity-80 transition-opacity duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span className="font-body-md text-body-md uppercase tracking-[0.2em]">
              Collections
            </span>
            <motion.span
              animate={{ rotate: isShopDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.35, ease: easing }}
              className="flex"
            >
              <ChevronDownIcon size={16} />
            </motion.span>
          </button>

          <AnimatePresence>
            {isShopDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.28, ease: easing }}
                className="absolute top-full right-0 mt-5 w-64 origin-top-right bg-surface-container-high border border-outline-variant/40 ambient-shadow rounded-2xl overflow-hidden flex flex-col p-2"
              >
                {COLLECTIONS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsShopDropdownOpen(false)}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors no-underline"
                  >
                    <span className="icon-chip icon-chip-sm">
                      <GridIcon size={18} />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-body-md uppercase tracking-widest text-sm text-on-surface group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <span className="font-body-md text-xs text-on-surface-variant">
                        {item.note}
                      </span>
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: easing }}
            className="md:hidden absolute top-full left-0 w-full overflow-hidden bg-surface-container-high border border-outline-variant/40 ambient-shadow rounded-[2rem] mt-3"
          >
            <div className="flex flex-col p-6 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.3, ease: easing }}
                >
                  <Link
                    href={link.href}
                    onClick={handleNavClick(link.href)}
                    className={`block py-3 font-body-lg uppercase tracking-[0.2em] transition-colors ${
                      isActive(link.href) ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.3, ease: easing }}
                className="mt-4 pt-4 border-t border-outline-variant/40"
              >
                <Link
                  href="/tiles/12x12"
                  onClick={handleNavClick("/tiles/12x12")}
                  className="flex items-center gap-3 text-primary font-body-lg uppercase tracking-[0.2em] no-underline"
                >
                  <GridIcon size={20} />
                  Collections
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
