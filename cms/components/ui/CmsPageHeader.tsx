import type { ReactNode } from "react";

export function CmsPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="cms-page-heading">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="cms-page-actions">{actions}</div> : null}
    </header>
  );
}
