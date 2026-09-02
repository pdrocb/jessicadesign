"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/cms/auth/actions";
import { CmsBrand } from "@/cms/components/CmsBrand";
import { CmsIcon, type CmsIconName } from "@/cms/components/CmsIcon";

const groups = [
  { label: "Site", items: [{ label: "Site settings", href: "/admin/settings", icon: "settings" }] },
  { label: "Pages", items: [{ label: "Home", href: "/admin", icon: "home" }] },
  {
    label: "Content",
    items: [
      { label: "Look Book", href: "/admin/projects", icon: "projects" },
      { label: "Inquiries", href: "/admin/inquiries", icon: "inquiries" },
    ],
  },
] as const;

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="cms-navigation" aria-label="CMS navigation">
      {groups.map((group) => (
        <div className="cms-nav-group" key={group.label}>
          <p>{group.label}</p>
          {group.items.map((item) => {
            const active = pathname === item.href || (item.href === "/admin/projects" && pathname.startsWith("/admin/projects/"));
            return (
              <Link
                aria-current={active ? "page" : undefined}
                href={item.href}
                key={item.href}
                data-active={active || undefined}
                onClick={onNavigate}
              >
                <span className="cms-nav-icon"><CmsIcon name={item.icon as CmsIconName} /></span>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (menuOpen && !menu.open) menu.showModal();
    if (!menuOpen && menu.open) menu.close();

    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <div className="cms-app">
      <header className="cms-mobile-bar">
        <button ref={menuButtonRef} className="cms-icon-button" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-label="Open menu">
          <CmsIcon name="menu" />
        </button>
        <CmsBrand compact priority />
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </header>

      <aside className="cms-sidebar">
        <CmsBrand priority />
        <Navigation />
        <div className="cms-sidebar-account">
          <span>Signed in as</span>
          <strong>{userName}</strong>
          <form action={logout}>
            <button type="submit">Log out</button>
          </form>
        </div>
      </aside>

      <dialog
        ref={menuRef}
        className="cms-mobile-menu"
        aria-label="CMS menu"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => setMenuOpen(false)}
      >
        <div className="cms-mobile-menu-panel">
          <div className="cms-mobile-menu-head">
            <CmsBrand compact />
            <button className="cms-icon-button" type="button" onClick={closeMenu} aria-label="Close menu"><CmsIcon name="close" /></button>
          </div>
          <Navigation onNavigate={closeMenu} />
          <p className="cms-mobile-user">{userName}</p>
        </div>
      </dialog>

      <main className="cms-main">{children}</main>
    </div>
  );
}
