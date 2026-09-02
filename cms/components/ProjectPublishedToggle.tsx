"use client";

import { useState, useTransition } from "react";
import { setProjectPublished } from "@/cms/projects/actions";

export function ProjectPublishedToggle({
  projectId,
  published,
  disabled,
}: {
  projectId: string;
  published: boolean;
  disabled: boolean;
}) {
  const [checked, setChecked] = useState(published);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function changePublished(nextPublished: boolean) {
    const previous = checked;
    setError("");
    setChecked(nextPublished);
    startTransition(async () => {
      try {
        await setProjectPublished(projectId, nextPublished);
      } catch {
        setChecked(previous);
        setError("Couldn’t update visibility. Try again.");
      }
    });
  }

  return (
    <label className="cms-project-index-published">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled || pending}
        onChange={(event) => changePublished(event.currentTarget.checked)}
      />
      <span aria-live="polite">{pending ? "Updating…" : checked ? "Published" : "Draft"}</span>
      {error ? <small role="alert">{error}</small> : null}
    </label>
  );
}
