"use client";

import { useState, useTransition } from "react";
import { setProjectFeatured } from "@/cms/projects/actions";

export function ProjectHomeToggle({
  projectId,
  featured,
  published,
  disabled,
  limitReached,
}: {
  projectId: string;
  featured: boolean;
  published: boolean;
  disabled: boolean;
  limitReached: boolean;
}) {
  const [checked, setChecked] = useState(featured);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function changeFeatured(nextFeatured: boolean) {
    const previous = checked;
    setError("");
    setChecked(nextFeatured);
    startTransition(async () => {
      const result = await setProjectFeatured(projectId, nextFeatured);
      if (!result.ok) {
        setChecked(previous);
        setError(result.message ?? "Couldn’t update Home visibility.");
      }
    });
  }

  const unavailable = !published || (!checked && limitReached);
  const label = pending
    ? "Updating…"
    : checked
      ? "Shown on Home"
      : !published
        ? "Publish to show on Home"
        : limitReached
          ? "Home full (7 of 7)"
          : "Show on Home";

  return (
    <label className="cms-project-index-published">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled || pending || unavailable}
        onChange={(event) => changeFeatured(event.currentTarget.checked)}
      />
      <span aria-live="polite">{label}</span>
      {error ? <small role="alert">{error}</small> : null}
    </label>
  );
}
