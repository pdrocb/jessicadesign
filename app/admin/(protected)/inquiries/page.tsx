import { getInquiries } from "@/cms/inquiries/repository";

export default async function InquiriesPage() {
  const { inquiries, connected } = await getInquiries();
  return (
    <div>
      <div className="cms-page-heading"><div><h1>Inquiries</h1><p>Review requests submitted through the website.</p></div></div>
      {!connected ? <p className="cms-connection-note">Inquiries will appear here after Neon and Resend are connected.</p> : null}
      <div className="cms-empty-card">
        {inquiries.length === 0 ? (
          <><strong>No inquiries yet</strong><p>New website inquiries will appear here as read-only records.</p></>
        ) : (
          <div className="cms-inquiry-list">
            {inquiries.map((inquiry) => (
              <article key={inquiry.id}>
                <div><strong>{inquiry.name}</strong>{!inquiry.is_read ? <span>New</span> : null}</div>
                <p>{inquiry.email} · {inquiry.phone}</p>
                <p>{inquiry.celebration ?? "Celebration"}{inquiry.event_date ? ` · ${inquiry.event_date}` : ""}{inquiry.venue ? ` · ${inquiry.venue}` : ""}</p>
                {inquiry.notes ? <p>{inquiry.notes}</p> : null}
                <time>{new Date(inquiry.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}</time>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
