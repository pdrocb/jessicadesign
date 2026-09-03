"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CmsConfirmDialog } from "@/cms/components/ui/CmsConfirmDialog";

export function CmsUnsavedChangesGuard({ when }: { when: boolean }) {
  const router = useRouter();
  const [nextHref, setNextHref] = useState("");
  const allowNavigation = useRef(false);
  const restoringHistory = useRef(false);
  const historyDelta = useRef(0);
  const currentHistoryIndex = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!when) return;

    const state = window.history.state as { __cmsHistoryIndex?: number } | null;
    currentHistoryIndex.current = state?.__cmsHistoryIndex;

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

    function interceptHistory(event: PopStateEvent) {
      if (allowNavigation.current) return;
      if (restoringHistory.current) {
        restoringHistory.current = false;
        return;
      }

      const destinationIndex = (event.state as { __cmsHistoryIndex?: number } | null)?.__cmsHistoryIndex;
      const originIndex = currentHistoryIndex.current;
      const delta = typeof destinationIndex === "number" && typeof originIndex === "number"
        ? destinationIndex - originIndex
        : -1;
      if (delta === 0) return;

      historyDelta.current = delta;
      restoringHistory.current = true;
      window.history.go(-delta);
      setNextHref("__cms_history_navigation__");
    }

    document.addEventListener("click", interceptLink, true);
    window.addEventListener("beforeunload", warnBeforeUnload);
    window.addEventListener("popstate", interceptHistory);
    return () => {
      document.removeEventListener("click", interceptLink, true);
      window.removeEventListener("beforeunload", warnBeforeUnload);
      window.removeEventListener("popstate", interceptHistory);
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
      onCancel={() => {
        historyDelta.current = 0;
        setNextHref("");
      }}
      onConfirm={() => {
        const destination = nextHref;
        allowNavigation.current = true;
        setNextHref("");
        if (destination === "__cms_history_navigation__") {
          window.history.go(historyDelta.current);
          return;
        }
        router.push(destination);
      }}
    />
  );
}
