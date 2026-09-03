import { Head, Html, Preview } from "@react-email/components";
import type React from "react";

export const EMAIL_COLORS = {
  paper: "#fefbf6",
  bone: "#faf8f3",
  cream: "#f4efe3",
  ink: "#141312",
  inkMuted: "#4a463f",
  inkSubtle: "#6b6660",
  line: "#d8d2c5",
  petal: "#f3e7e2",
  roseUmber: "#8a5a52",
  sage: "#4f5a48",
  onDark: "#faf8f3",
} as const;

export const EMAIL_FONTS = {
  display: "'Cormorant Garamond', Garamond, Georgia, 'Times New Roman', serif",
  body: "Karla, 'Helvetica Neue', Arial, sans-serif",
} as const;

export const labelStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: EMAIL_FONTS.body,
  fontSize: "10px",
  fontWeight: 600,
  lineHeight: "1.45",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: EMAIL_COLORS.inkSubtle,
};

export const bodyStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: EMAIL_FONTS.body,
  fontSize: "16px",
  lineHeight: "1.65",
  color: EMAIL_COLORS.inkMuted,
};

const responsiveCss = `
  @media only screen and (max-width: 620px) {
    .email-shell { width: 100% !important; }
    .email-pad { padding-left: 22px !important; padding-right: 22px !important; }
    .email-display { font-size: 40px !important; }
    .email-label-cell { width: 112px !important; }
    .email-brand-detail { display: none !important; }
    .email-summary-cell { display: block !important; width: 100% !important; padding: 0 0 18px !important; }
  }
`;

export function EmailShell({
  preheader,
  assetBase,
  children,
}: {
  preheader: string;
  assetBase: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{responsiveCss}</style>
      </Head>
      <Preview>{preheader}</Preview>
      <body style={{ margin: 0, padding: 0, backgroundColor: EMAIL_COLORS.cream }}>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          border={0}
          style={{ borderCollapse: "collapse", backgroundColor: EMAIL_COLORS.cream }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "28px 12px" }}>
                <table
                  role="presentation"
                  width="640"
                  className="email-shell"
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  style={{
                    width: "640px",
                    maxWidth: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: EMAIL_COLORS.paper,
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        className="email-pad"
                        style={{
                          padding: "24px 38px",
                          borderBottom: `1px solid ${EMAIL_COLORS.line}`,
                        }}
                      >
                        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
                          <tbody>
                            <tr>
                              <td valign="middle" width={48}>
                                {/* Email clients require a plain absolute image URL. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`${assetBase}/favicon.png`}
                                  width={38}
                                  height={38}
                                  alt=""
                                  style={{ display: "block", width: "38px", height: "38px", border: 0 }}
                                />
                              </td>
                              <td valign="middle">
                                <p
                                  style={{
                                    margin: 0,
                                    fontFamily: EMAIL_FONTS.display,
                                    fontSize: "21px",
                                    fontWeight: 600,
                                    lineHeight: "1.05",
                                    letterSpacing: "0.02em",
                                    color: EMAIL_COLORS.ink,
                                  }}
                                >
                                  Jessica S. Designs
                                </p>
                                <p className="email-brand-detail" style={{ ...labelStyle, marginTop: "5px", fontSize: "8px" }}>
                                  Wedding &amp; Event Design &amp; Styling
                                </p>
                              </td>
                              <td className="email-brand-detail" align="right" valign="middle" style={{ ...labelStyle, whiteSpace: "nowrap" }}>
                                Hudson Valley · NY
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    {children}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </Html>
  );
}

export function EmailFooter({ assetBase }: { assetBase: string }) {
  return (
    <tr>
      <td
        className="email-pad"
        style={{ padding: "26px 38px", backgroundColor: EMAIL_COLORS.ink }}
      >
        <p style={{ ...bodyStyle, fontSize: "13px", color: EMAIL_COLORS.onDark }}>
          Jessica S. Designs · Hudson Valley, New York
          <br />
          <a href={assetBase} style={{ color: EMAIL_COLORS.onDark, textDecoration: "underline" }}>
            Visit the website
          </a>
          {" · "}
          <a href="tel:+18453757820" style={{ color: EMAIL_COLORS.onDark, textDecoration: "underline" }}>
            845-375-7820
          </a>
          {" · "}
          <a
            href="https://www.instagram.com/jessicasalomondesigns__/"
            style={{ color: EMAIL_COLORS.onDark, textDecoration: "underline" }}
          >
            Instagram
          </a>
        </p>
      </td>
    </tr>
  );
}

export function formatEventDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
