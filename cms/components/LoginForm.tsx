"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/cms/auth/actions";
import { CmsButton } from "@/cms/components/ui/CmsButton";
import { CmsField } from "@/cms/components/ui/CmsField";

const initialState: LoginState = { message: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="cms-login-form">
      <CmsField id="cms-email" name="email" label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@studio.com" required autoFocus />
      <CmsField id="cms-password" name="password" label="Password" type="password" autoComplete="current-password" placeholder="••••••••••••" required />
      <p className="cms-form-message" aria-live="polite">
        {state.message}
      </p>
      <CmsButton disabled={pending} type="submit">
        {pending ? "Signing in…" : "Sign in"}
      </CmsButton>
    </form>
  );
}
