import { redirect } from "next/navigation";
import { CmsBrand } from "@/cms/components/CmsBrand";
import { LoginForm } from "@/cms/components/LoginForm";
import { getOptionalSession } from "@/cms/auth/session";
import { cmsSite } from "@/cms/config/site";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getOptionalSession()) redirect("/admin");

  return (
    <main className="cms-login-page">
      <div className="cms-login-shell">
        <CmsBrand priority />
        <section className="cms-login-card">
          <h1>Login</h1>
          <p>Sign in to manage {cmsSite.name}.</p>
          <LoginForm />
          <small>No password reset yet — contact your developer to regain access.</small>
        </section>
      </div>
    </main>
  );
}
