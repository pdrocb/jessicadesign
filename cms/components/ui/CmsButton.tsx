import type { ButtonHTMLAttributes } from "react";

type CmsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function CmsButton({ className, variant = "primary", ...props }: CmsButtonProps) {
  const classes = ["cms-button", `cms-button-${variant}`, className].filter(Boolean).join(" ");
  return <button className={classes} {...props} />;
}
