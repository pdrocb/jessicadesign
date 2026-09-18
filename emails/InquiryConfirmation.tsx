import type { InquiryEmailLead } from "@/emails/types";
import {
  bodyStyle,
  EMAIL_COLORS,
  EMAIL_FONTS,
  EmailFooter,
  EmailShell,
} from "@/emails/shared";

export function InquiryConfirmation({ lead, assetBase }: { lead: InquiryEmailLead; assetBase: string }) {
  const firstName = lead.name.split(/\s+/)[0] || lead.name;

  return (
    <EmailShell
      assetBase={assetBase}
      masthead="mark"
      preheader="Your inquiry is safely in. You’ll hear back within the next few days."
    >
      <tr>
        <td className="email-pad" style={{ padding: "48px 46px 50px", backgroundColor: EMAIL_COLORS.paper }}>
          <h1
            className="email-display"
            style={{
              margin: 0,
              fontFamily: EMAIL_FONTS.display,
              fontSize: "44px",
              fontWeight: 500,
              lineHeight: "1.06",
              letterSpacing: "-0.015em",
              color: EMAIL_COLORS.ink,
            }}
          >
            {firstName},
          </h1>
          <p style={{ ...bodyStyle, marginTop: "24px", fontSize: "17px", lineHeight: "1.7" }}>
            Thank you so much for reaching out. I personally review every inquiry and will be in touch within the next few days to schedule your complimentary consultation. I’m looking forward to learning more about your celebration, hearing your ideas, and getting to know the vision you have in mind.
          </p>
          <p style={{ ...bodyStyle, marginTop: "32px", color: EMAIL_COLORS.ink }}>Warmly,</p>
          <p style={{ margin: "4px 0 0", fontFamily: EMAIL_FONTS.display, fontSize: "24px", fontWeight: 500, lineHeight: "1.15", color: EMAIL_COLORS.ink }}>
            Jessica
          </p>
        </td>
      </tr>
      <EmailFooter assetBase={assetBase} variant="minimal" />
    </EmailShell>
  );
}

export default InquiryConfirmation;
