import { AdminShell } from "@/cms/components/AdminShell";
import { requireSession } from "@/cms/auth/session";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();
  return <AdminShell userName={user.name}>{children}</AdminShell>;
}
