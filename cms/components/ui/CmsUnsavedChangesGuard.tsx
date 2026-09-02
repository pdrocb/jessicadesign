"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CmsConfirmDialog } from "@/cms/components/ui/CmsConfirmDialog";

export function CmsUnsavedChangesGuard({ when }: { when: boolean }) {
  const router = useRouter();
  const [nextHref, setNextHref] = useState("");
  const allowNavigation = useRef(false);

  useEffect(() => {
    if (!when) return;

    function interceptLink(event: MouseEvent) {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.href === window.location.href) return;

      event.preventDefault();
      setNextHref(`${destination.pathname}${destination.search}${destination.hash}`);
    }

    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (allowNavigation.current) return;
      event.preventDefault();
    }

    document.addEventListener("click", interceptLink, true);
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => {
      document.removeEventListener("click", interceptLink, true);
      window.removeEventListener("beforeunload", warnBeforeUnload);
    };
  }, [when]);

  return (
    <CmsConfirmDialog
      open={Boolean(nextHref)}
      title="Leave without saving?"
      description="Your unsaved changes will be lost. Stay here to finish saving, or leave this page."
      confirmLabel="Leave page"
      tone="neutral"
      icon="warning"
      onCancel={() => setNextHref("")}
      onConfirm={() => {
        const destination = nextHref;
        allowNavigation.current = true;
        setNextHref("");
        router.push(destination);
      }}
    />
  );
}
