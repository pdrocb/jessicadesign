"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems, site } from "@/lib/content";
import { ButtonOutline, ButtonPrimary, Wordmark } from "@/components/ui";

const primaryNavItems = navItems.filter((item) => item.href !== "/");

/**
 * Una sola barra fija, con la composición responsive de Florale y la
 * identidad visual de Jessica. Desde tablet muestra links + CTA; en móvil
 * el menú está disponible desde el primer frame.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const heroCta = document.getElementById("hero-primary-cta");
    if (!heroCta) return;

    const observer = new IntersectionObserver(([entry]) => {
      setShowMobileCta(
        !entry.isIntersecting && entry.boundingClientRect.bottom < 0,
      );
    });
    observer.observe(heroCta);
    return () => observer.disconnect();
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);
  const mobileCtaVisible = pathname === "/" && showMobileCta;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-(--z-nav) h-20 border-b border-line bg-paper md:h-22 lg:h-24">
        <div className="gutter shell flex h-full items-center justify-between gap-5">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="flex min-h-11 shrink-0 items-center"
          >
            <Wordmark priority className="h-11 md:h-12 lg:h-13" />
          </Link>

          <div className="hidden items-center gap-7 md:flex lg:gap-10">
            <nav
              aria-label="Primary"
              className="text-label-sm flex items-center gap-7 font-medium tracking-[0.22em] uppercase lg:gap-10 lg:text-label lg:tracking-[0.24em]"
            >
              {primaryNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`relative whitespace-nowrap py-[15px] transition-colors duration-[180ms] hover:text-ink-subtle ${
                    pathname === item.href
                      ? "after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:bg-ink"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ButtonOutline href="/inquire">Inquire</ButtonOutline>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <div
              className={`transition-[opacity,transform] duration-[260ms] ease-(--ease-geometry) ${
                mobileCtaVisible
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-2 opacity-0"
              }`}
              aria-hidden={!mobileCtaVisible}
              inert={!mobileCtaVisible}
            >
              <ButtonOutline href="/inquire">Inquire</ButtonOutline>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="grid h-11 w-11 shrink-0 place-items-center"
            >
              <span aria-hidden className="relative block h-[11px] w-[22px]">
                <span className="absolute inset-x-0 top-0 h-px bg-ink" />
                <span className="absolute inset-x-0 top-[5px] h-px bg-ink" />
                <span className="absolute inset-x-0 top-[10px] h-px bg-ink" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Mobile navigation"
        onClose={closeMenu}
        onCancel={closeMenu}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-paper md:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="gutter flex h-20 shrink-0 items-center justify-between border-b border-line">
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              onClick={closeMenu}
              className="flex min-h-11 items-center"
            >
              <Wordmark className="h-11" />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              autoFocus
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center"
            >
              <span aria-hidden className="relative block h-[22px] w-[22px]">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-ink" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-ink" />
              </span>
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="gutter flex flex-1 flex-col justify-center"
          >
            {primaryNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                aria-current={pathname === item.href ? "page" : undefined}
                className="text-heading-lg border-b border-line py-4 font-display font-medium transition-colors duration-[180ms] hover:text-ink-subtle"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="gutter flex flex-col gap-4 pb-10">
            <ButtonPrimary
              href="/inquire"
              className="w-full"
              onClick={closeMenu}
            >
              Start With a Conversation
            </ButtonPrimary>
            <a
              href={site.phoneHref}
              className="text-label-sm py-2 text-center font-medium tracking-[0.28em] text-ink-subtle uppercase"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
