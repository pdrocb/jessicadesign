import type { Metadata } from "next";
import "@/cms/styles/tokens.css";
import "@/cms/styles/controls.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Studio CMS | Jessica S. Designs",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
