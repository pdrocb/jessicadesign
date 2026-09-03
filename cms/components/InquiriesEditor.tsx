"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CmsButton } from "@/cms/components/ui/CmsButton";
import { CmsPageHeader } from "@/cms/components/ui/CmsPageHeader";
import { setInquiryRead } from "@/cms/inquiries/actions";
import type { CmsInquiry } from "@/cms/inquiries/repository";

type InquiryFilter = "all" | "new" | "read";
type InquiryMobileView = "list" | "detail";

const mobileInquiryQuery = "(max-width: 759px)";

function eventSummary(inquiry: CmsInquiry) {
  return [inquiry.celebration || "Celebration", inquiry.event_date, inquiry.venue]
    .filter(Boolean)
    .join(" · ");
}

export function InquiriesEditor({
  initialInquiries,
  connected,
}: {
  initialInquiries: CmsInquiry[];
  connected: boolean;
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InquiryFilter>("all");
  const [selectedId, setSelectedId] = useState<number | null>(initialInquiries[0]?.id ?? null);
  const [mobileView, setMobileView] = useState<InquiryMobileView>("list");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const detailHeadingRef = useRef<HTMLHeadingElement>(null);
  const inquiryButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const listScrollPositionRef = useRef(0);
  const returnFocusIdRef = useRef<number | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      if (filter === "new" && inquiry.is_read) return false;
      if (filter === "read" && !inquiry.is_read) return false;
      if (!needle) return true;
      return [inquiry.name, inquiry.email, inquiry.phone, inquiry.celebration, inquiry.venue]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [filter, inquiries, query]);

  const selected = filtered.find((inquiry) => inquiry.id === selectedId) ?? filtered[0] ?? null;
  const newCount = inquiries.filter((inquiry) => !inquiry.is_read).length;

  useEffect(() => {
    if (!window.matchMedia(mobileInquiryQuery).matches) return;

    const frame = window.requestAnimationFrame(() => {
      if (mobileView === "detail") {
        detailHeadingRef.current?.focus();
        return;
      }

      const returnFocusId = returnFocusIdRef.current;
      if (returnFocusId === null) return;

      window.scrollTo({ top: listScrollPositionRef.current, behavior: "auto" });
      inquiryButtonRefs.current.get(returnFocusId)?.focus({ preventScroll: true });
      returnFocusIdRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mobileView, selected?.id]);

  function openInquiry(inquiryId: number) {
    if (window.matchMedia(mobileInquiryQuery).matches) {
      listScrollPositionRef.current = window.scrollY;
    }
    setSelectedId(inquiryId);
    setMobileView("detail");
    setMessage("");
  }

  function returnToInquiryList() {
    returnFocusIdRef.current = selected?.id ?? null;
    setMobileView("list");
    setMessage("");
  }

  function changeRead(inquiry: CmsInquiry) {
    const nextRead = !inquiry.is_read;
    const previous = inquiries;
    setMessage("");
    setInquiries((current) => current.map((item) => item.id === inquiry.id ? { ...item, is_read: nextRead } : item));
    startTransition(async () => {
      try {
        await setInquiryRead(inquiry.id, nextRead);
        setMessage(nextRead ? "Marked as read." : "Marked as new.");
      } catch {
        setInquiries(previous);
        setMessage("Couldn’t update this inquiry. Try again.");
      }
    });
  }

  return (
    <div>
      <CmsPageHeader
        title="Inquiries"
        description={`${newCount} new · ${inquiries.length} total`}
      />

      {!connected ? <p className="cms-connection-note">Connect Neon to review website inquiries.</p> : null}

      {inquiries.length === 0 ? (
        <div className="cms-empty-card">
          <strong>No inquiries yet</strong>
          <p>New requests submitted through the website will appear here.</p>
        </div>
      ) : (
        <div className="cms-inquiries-shell" data-mobile-view={mobileView}>
          <div className="cms-inquiry-toolbar">
            <label className="cms-inquiry-search">
              <span className="sr-only">Search inquiries</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search name, email, venue or event"
              />
            </label>
            <div className="cms-inquiry-filters" aria-label="Filter inquiries">
              {(["all", "new", "read"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  data-active={filter === value || undefined}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value === "all" ? "All" : value === "new" ? "New" : "Read"}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="cms-inquiry-no-results">
              <strong>No matching inquiries</strong>
              <p>Change the search or status filter.</p>
            </div>
          ) : (
            <div className="cms-inquiry-workspace">
              <div className="cms-inquiry-list" aria-label="Inquiry list">
                {filtered.map((inquiry) => (
                  <button
                    key={inquiry.id}
                    type="button"
                    ref={(node) => {
                      if (node) inquiryButtonRefs.current.set(inquiry.id, node);
                      else inquiryButtonRefs.current.delete(inquiry.id);
                    }}
                    data-active={selected?.id === inquiry.id || undefined}
                    aria-current={selected?.id === inquiry.id ? "true" : undefined}
                    onClick={() => openInquiry(inquiry.id)}
                  >
                    <span className="cms-inquiry-list-heading">
                      <strong>{inquiry.name}</strong>
                      {!inquiry.is_read ? <b>New</b> : null}
                    </span>
                    <span>{eventSummary(inquiry)}</span>
                    <time>{new Date(inquiry.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}</time>
                  </button>
                ))}
              </div>

              {selected ? (
                <article
                  id={`cms-inquiry-detail-${selected.id}`}
                  className="cms-inquiry-detail"
                  aria-labelledby={`cms-inquiry-${selected.id}`}
                >
                  <CmsButton
                    className="cms-inquiry-back"
                    variant="secondary"
                    type="button"
                    onClick={returnToInquiryList}
                  >
                    Back to inquiries
                  </CmsButton>
                  <header>
                    <div>
                      <h2 ref={detailHeadingRef} id={`cms-inquiry-${selected.id}`} tabIndex={-1}>{selected.name}</h2>
                      <p>Received {new Date(selected.created_at).toLocaleDateString("en-US", { dateStyle: "long" })}</p>
                    </div>
                    <CmsButton variant="secondary" disabled={pending} type="button" onClick={() => changeRead(selected)}>
                      {selected.is_read ? "Mark as new" : "Mark as read"}
                    </CmsButton>
                  </header>

                  <div className="cms-inquiry-contact-actions">
                    <a className="cms-primary-link" href={`mailto:${selected.email}`}>Email</a>
                    <a className="cms-secondary-link" href={`tel:${selected.phone}`}>Call</a>
                  </div>

                  <dl className="cms-inquiry-facts">
                    <div><dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
                    <div><dt>Phone</dt><dd><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd></div>
                    <div><dt>Celebration</dt><dd>{selected.celebration || "Not provided"}</dd></div>
                    <div><dt>Event date</dt><dd>{selected.event_date || "Not provided"}</dd></div>
                    <div><dt>Venue</dt><dd>{selected.venue || "Not provided"}</dd></div>
                    <div><dt>Guest count</dt><dd>{selected.guest_count ?? "Not provided"}</dd></div>
                    {selected.moodboard_url ? <div><dt>Moodboard</dt><dd><a href={selected.moodboard_url} target="_blank" rel="noreferrer">Open link</a></dd></div> : null}
                  </dl>

                  <section className="cms-inquiry-notes">
                    <h3>Notes</h3>
                    <p>{selected.notes || "No additional notes."}</p>
                  </section>
                  {message ? <p className="cms-inquiry-status" role="status">{message}</p> : null}
                </article>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
