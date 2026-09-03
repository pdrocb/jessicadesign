import type { InquiryEmailLead } from "@/emails/types";
import {
  bodyStyle,
  EMAIL_COLORS,
  EMAIL_FONTS,
  EmailFooter,
  EmailShell,
  formatEventDate,
  labelStyle,
} from "@/emails/shared";

const nextSteps = [
  {
    title: "Jessica reviews every detail",
    body: "Your venue, guest count, visual references, and the feeling you want to create all shape the first conversation.",
  },
  {
    title: "We arrange a complimentary conversation",
    body: "Jessica will reach out personally within a few days to coordinate a complimentary one-hour consultation.",
  },
  {
    title: "The design process begins with your vision",
    body: "If it feels like the right fit, the next stage is developing the look and feel of the celebration with intention and cohesion.",
  },
] as const;

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        className="email-label-cell"
        width={138}
        valign="top"
        style={{ width: "138px", padding: "13px 16px 13px 0", borderBottom: `1px solid ${EMAIL_COLORS.line}` }}
      >
        <span style={labelStyle}>{label}</span>
      </td>
      <td valign="top" style={{ padding: "13px 0", borderBottom: `1px solid ${EMAIL_COLORS.line}` }}>
        <span style={{ fontFamily: EMAIL_FONTS.body, fontSize: "15px", lineHeight: "1.5", color: EMAIL_COLORS.ink }}>{value}</span>
      </td>
    </tr>
  );
}

export function InquiryConfirmation({ lead, assetBase }: { lead: InquiryEmailLead; assetBase: string }) {
  const firstName = lead.name.split(/\s+/)[0] || lead.name;

  return (
    <EmailShell
      assetBase={assetBase}
      preheader="Jessica reads every inquiry personally and will reply within a few days."
    >
      <tr>
        <td className="email-pad" style={{ padding: "43px 38px 40px", backgroundColor: EMAIL_COLORS.petal }}>
          <p style={{ ...labelStyle, color: EMAIL_COLORS.roseUmber }}>Inquiry received</p>
          <h1
            className="email-display"
            style={{
              margin: "17px 0 0",
              fontFamily: EMAIL_FONTS.display,
              fontSize: "52px",
              fontWeight: 500,
              lineHeight: "1.02",
              letterSpacing: "-0.02em",
              color: EMAIL_COLORS.ink,
            }}
          >
            Thank you,
            <br />
            {firstName}.
          </h1>
        </td>
      </tr>

      <tr>
        <td className="email-pad" style={{ padding: "36px 38px 39px", backgroundColor: EMAIL_COLORS.paper }}>
          <p style={bodyStyle}>
            Your inquiry has been received. Jessica reads every one personally and will be in touch within a few days to arrange your complimentary consultation.
          </p>
          <p style={{ ...bodyStyle, marginTop: "17px", color: EMAIL_COLORS.ink }}>
            Here is what happens next.
          </p>
        </td>
      </tr>

      <tr>
        <td className="email-pad" style={{ padding: "34px 38px 20px", backgroundColor: EMAIL_COLORS.sage }}>
          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ borderCollapse: "collapse" }}>
            <tbody>
              {nextSteps.map((step, index) => (
                <tr key={step.title}>
                  <td valign="top" style={{ padding: "17px 0 20px", borderTop: "1px solid rgba(250,248,243,0.28)" }}>
                    <p style={{ ...labelStyle, color: EMAIL_COLORS.onDark }}>Step {index + 1}</p>
                    <p style={{ margin: "8px 0 0", fontFamily: EMAIL_FONTS.display, fontSize: "24px", fontWeight: 500, lineHeight: "1.2", color: EMAIL_COLORS.onDark }}>
                      {step.title}
                    </p>
                    <p style={{ ...bodyStyle, marginTop: "8px", fontSize: "15px", color: EMAIL_COLORS.onDark }}>{step.body}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>

      <tr>
        <td className="email-pad" style={{ padding: "38px", backgroundColor: EMAIL_COLORS.paper }}>
          <p style={labelStyle}>A quick look at what you sent</p>
          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ borderCollapse: "collapse", marginTop: "14px" }}>
            <tbody>
              <SummaryRow label="Celebration" value={lead.celebration} />
              <SummaryRow label="Event date" value={formatEventDate(lead.eventDate)} />
              <SummaryRow label="Venue" value={lead.venue} />
              <SummaryRow label="Guest count" value={lead.guestCount.toLocaleString("en-US")} />
            </tbody>
          </table>

          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} bgcolor={EMAIL_COLORS.cream} style={{ borderCollapse: "collapse", marginTop: "26px", backgroundColor: EMAIL_COLORS.cream }}>
            <tbody>
              <tr>
                <td style={{ padding: "22px 24px" }}>
                  <p style={{ ...labelStyle, color: EMAIL_COLORS.ink }}>Your vision</p>
                  <p style={{ ...bodyStyle, marginTop: "10px", fontSize: "15px", color: EMAIL_COLORS.ink, whiteSpace: "pre-wrap" }}>{lead.notes}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <tr>
        <td className="email-pad" style={{ padding: "29px 38px", backgroundColor: EMAIL_COLORS.petal }}>
          <p style={{ ...bodyStyle, color: EMAIL_COLORS.ink }}>Warmly,</p>
          <p style={{ margin: "5px 0 0", fontFamily: EMAIL_FONTS.display, fontSize: "30px", fontWeight: 500, lineHeight: "1.15", color: EMAIL_COLORS.ink }}>
            Jessica Salomon
          </p>
          <p style={{ ...labelStyle, marginTop: "8px", color: EMAIL_COLORS.ink }}>Founder &amp; Creative Director</p>
        </td>
      </tr>
      <EmailFooter assetBase={assetBase} />
    </EmailShell>
  );
}

export default InquiryConfirmation;
