import type { ButtonHTMLAttributes } from "react";

export function CmsButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = ["cms-primary-button", className].filter(Boolean).join(" ");
  return <button className={classes} {...props} />;
}
