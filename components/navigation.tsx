"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, PartyPopper, X } from "lucide-react";

const links = [
  { label: "О вечеринке", href: "#about" },
  { label: "Где и когда", href: "#details" },
  { label: "Программа", href: "#program" },
];

export function Navigation({ title }: { title: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Основная навигация">
        <a className="brand" href="#about" onClick={() => setOpen(false)}>
          <span className="brand-icon"><PartyPopper size={24} strokeWidth={1.8} aria-hidden="true" /></span>
          <span>{title}</span>
        </a>
        <div className="desktop-links">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          <a className="nav-rsvp" href="#rsvp">RSVP <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <button className="menu-toggle" type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>
      <div className="mobile-links" id="mobile-navigation" hidden={!open}>
        {[...links, { label: "RSVP", href: "#rsvp" }].map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={17} aria-hidden="true" /></a>
        ))}
      </div>
    </header>
  );
}
