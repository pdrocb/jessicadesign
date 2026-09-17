import { AnalyticsRuntime } from "@/components/AnalyticsRuntime";
import { GoogleTagManager } from "@/components/GoogleTagManager";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleTagManager />
      <AnalyticsRuntime />
      {children}
    </>
  );
}
