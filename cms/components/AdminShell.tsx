"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

  return (
    <div className="cms-app">
      <header className="cms-mobile-bar">
        <button className="cms-icon-button" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-label="Open menu">
          <CmsIcon name="menu" />
        </button>
        <CmsBrand compact priority />
        <form action={logout}>
          <button type="submit">Exit</button>
        </form>
      </header>

      <aside className="cms-sidebar">
        <CmsBrand priority />
        <Navigation />
        <div className="cms-sidebar-account">
          <span>Signed in as</span>
          <strong>{userName}</strong>
          <form action={logout}>
            <button type="submit">Exit CMS</button>
          </form>
        </div>
      </aside>

      {menuOpen && (
        <div className="cms-mobile-menu" role="dialog" aria-modal="true" aria-label="CMS menu">
          <div className="cms-mobile-menu-head">
            <CmsBrand compact />
            <button className="cms-icon-button" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><CmsIcon name="close" /></button>
          </div>
          <Navigation onNavigate={() => setMenuOpen(false)} />
          <p className="cms-mobile-user">{userName}</p>
        </div>
      )}

      <main className="cms-main">{children}</main>
    </div>
  );
}
