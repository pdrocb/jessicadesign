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
  const [pending, startTransition] = useTransition();

  function changePublished(nextPublished: boolean) {
    const previous = checked;
    setChecked(nextPublished);
    startTransition(async () => {
      try {
        await setProjectPublished(projectId, nextPublished);
      } catch {
        setChecked(previous);
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
      <span>Published</span>
    </label>
  );
}
