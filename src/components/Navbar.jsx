"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, MenuIcon, CloseIcon } from "@/components/icons";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/tiles/300x300", label: "300x300 tiles" },
  { href: "/tiles/400x400", label: "400x400 tiles" },
  { href: "/informations", label: "Product information" },
];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1080px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      desktop.removeEventListener("change", closeOnDesktop);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  const close = () => setOpen(false);
  return <>
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.logo} aria-label="Sepione Ceramic home"><Image src="/logo-nav.png" alt="Sepione Parking Tiles" width={290} height={193} priority /></Link>
        <div className={styles.desktopLinks}>{LINKS.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}</div>
        <Link href="/#contact" className={styles.contact}>Get in touch <ArrowRightIcon size={16} /></Link>
        <button type="button" className={styles.toggle} ref={triggerRef} onClick={() => setOpen(true)} aria-label="Open navigation menu" aria-haspopup="dialog" aria-controls="mobile-navigation" aria-expanded={open}><MenuIcon size={26} /></button>
      </nav>
    </header>
    <dialog ref={dialogRef} id="mobile-navigation" className={styles.mobileDialog} aria-labelledby="mobile-navigation-title" onCancel={close} onClose={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className={styles.mobilePanel}>
        <div className={styles.mobileHeading}><span id="mobile-navigation-title">Explore Sepione</span><button type="button" aria-label="Close navigation menu" onClick={close}><CloseIcon size={25} /></button></div>
        <nav aria-label="Mobile navigation">{LINKS.map(link => <Link key={link.href} href={link.href} onClick={close} aria-current={pathname === link.href ? "page" : undefined}>{link.label}<ArrowRightIcon size={18} /></Link>)}<Link href="/#contact" onClick={close}>Contact us <ArrowRightIcon size={18} /></Link></nav>
        <div className={styles.mobileNote}><span>10 years of experience</span><a href="tel:+919099950773">+91 90999 50773</a><a href="mailto:info@sepionetile.com">info@sepionetile.com</a></div>
      </div>
    </dialog>
  </>;
}
