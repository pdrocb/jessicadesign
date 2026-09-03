import type React from "react";
import type { InternalInquiryEmailLead } from "@/emails/types";
import {
  bodyStyle,
  EMAIL_COLORS,
  EMAIL_FONTS,
  EmailFooter,
  EmailShell,
  formatEventDate,
  labelStyle,
} from "@/emails/shared";

function DetailRow({ label, value, href }: { label: string; value: React.ReactNode; href?: string }) {
  const valueStyle: React.CSSProperties = {
    fontFamily: EMAIL_FONTS.body,
    fontSize: "15px",
    lineHeight: "1.55",
    color: EMAIL_COLORS.ink,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  return (
    <tr>
      <td
        className="email-label-cell"
        width={146}
        valign="top"
        style={{ width: "146px", padding: "14px 18px 14px 0", borderBottom: `1px solid ${EMAIL_COLORS.line}` }}
      >
        <span style={labelStyle}>{label}</span>
      </td>
      <td valign="top" style={{ padding: "14px 0", borderBottom: `1px solid ${EMAIL_COLORS.line}` }}>
        {href ? (
          <a href={href} style={{ ...valueStyle, color: EMAIL_COLORS.roseUmber }}>{value}</a>
        ) : (
          <span style={valueStyle}>{value}</span>
        )}
      </td>
    </tr>
  );
}

export function NewInquiry({ lead, assetBase }: { lead: InternalInquiryEmailLead; assetBase: string }) {
  const phoneHref = `tel:${lead.phone.replace(/[^\d+]/g, "")}`;

  return (
    <EmailShell
      assetBase={assetBase}
      preheader={`${lead.name} · ${lead.celebration} · ${lead.venue}`}
    >
      <tr>
        <td className="email-pad" style={{ padding: "40px 38px", backgroundColor: EMAIL_COLORS.sage }}>
          <p style={{ ...labelStyle, color: EMAIL_COLORS.onDark }}>New inquiry</p>
          <h1
            className="email-display"
            style={{
              margin: "15px 0 0",
              fontFamily: EMAIL_FONTS.display,
              fontSize: "48px",
              fontWeight: 500,
              lineHeight: "1.05",
              letterSpacing: "-0.02em",
              color: EMAIL_COLORS.onDark,
            }}
          >
            {lead.name}
          </h1>
          <p style={{ ...labelStyle, marginTop: "16px", color: EMAIL_COLORS.onDark, opacity: 0.82 }}>
            Received {lead.submittedAt}
          </p>
        </td>
      </tr>

      <tr>
        <td className="email-pad" style={{ padding: "24px 38px", backgroundColor: EMAIL_COLORS.cream }}>
          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
            <tbody>
              <tr>
                <td className="email-summary-cell" width="50%" valign="top" style={{ paddingRight: "18px" }}>
                  <p style={labelStyle}>Celebration</p>
                  <p style={{ ...bodyStyle, marginTop: "6px", color: EMAIL_COLORS.ink }}>{lead.celebration}</p>
                </td>
                <td className="email-summary-cell" width="50%" valign="top" style={{ paddingLeft: "18px" }}>
                  <p style={labelStyle}>Event date</p>
                  <p style={{ ...bodyStyle, marginTop: "6px", color: EMAIL_COLORS.ink }}>{formatEventDate(lead.eventDate)}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <tr>
        <td className="email-pad" style={{ padding: "30px 38px 38px", backgroundColor: EMAIL_COLORS.paper }}>
          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ borderCollapse: "collapse" }}>
            <tbody>
              <DetailRow label="Name" value={lead.name} />
              <DetailRow label="Email" value={lead.email} href={`mailto:${lead.email}`} />
              <DetailRow label="Phone" value={lead.phone} href={phoneHref} />
              <DetailRow label="Celebration" value={lead.celebration} />
              <DetailRow label="Event date" value={formatEventDate(lead.eventDate)} />
              <DetailRow label="Venue" value={lead.venue} />
              <DetailRow label="Guest count" value={lead.guestCount.toLocaleString("en-US")} />
              <DetailRow label="Pinterest" value="Open moodboard" href={lead.moodboardUrl} />
            </tbody>
          </table>

          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            border={0}
            bgcolor={EMAIL_COLORS.petal}
            style={{ borderCollapse: "collapse", marginTop: "28px", backgroundColor: EMAIL_COLORS.petal }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "24px" }}>
                  <p style={{ ...labelStyle, color: EMAIL_COLORS.ink }}>Their vision</p>
                  <p style={{ ...bodyStyle, marginTop: "11px", color: EMAIL_COLORS.ink, whiteSpace: "pre-wrap" }}>{lead.notes}</p>
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ ...bodyStyle, marginTop: "27px", fontSize: "14px", color: EMAIL_COLORS.ink }}>
            Reply to this message to answer {lead.name.split(/\s+/)[0]} directly.
          </p>
        </td>
      </tr>
      <EmailFooter assetBase={assetBase} />
    </EmailShell>
  );
}

export default NewInquiry;
