export type CmsIconName =
  | "close"
  | "down"
  | "home"
  | "inquiries"
  | "menu"
  | "more"
  | "page"
  | "plus"
  | "projects"
  | "settings"
  | "trash"
  | "warning"
  | "up"
  | "toggle";

export function CmsIcon({ name }: { name: CmsIconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" focusable="false">
      {name === "home" ? (
        <><path {...common} d="m3 8 7-5 7 5" /><path {...common} d="M5 7v10h10V7M8 17v-5h4v5" /></>
      ) : name === "settings" ? (
        <><circle {...common} cx="10" cy="10" r="2.5" /><path {...common} d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7" /></>
      ) : name === "projects" ? (
        <><rect {...common} x="2.5" y="3" width="15" height="14" rx="1" /><path {...common} d="m5 13 3.2-3.2 2.2 2.2 1.8-1.8L15 13M13.5 6.5h.01" /></>
      ) : name === "inquiries" ? (
        <><path {...common} d="M3 4.5h14v11H3z" /><path {...common} d="m3.5 5 6.5 5 6.5-5" /></>
      ) : name === "page" ? (
        <><path {...common} d="M5 2.5h7l3 3v12H5z" /><path {...common} d="M12 2.5v3h3M7.5 9h5M7.5 12h5" /></>
      ) : name === "menu" ? (
        <path {...common} d="M3 5.5h14M3 10h14M3 14.5h14" />
      ) : name === "more" ? (
        <><circle fill="currentColor" cx="4" cy="10" r="1.2" /><circle fill="currentColor" cx="10" cy="10" r="1.2" /><circle fill="currentColor" cx="16" cy="10" r="1.2" /></>
      ) : name === "close" ? (
        <path {...common} d="m4.5 4.5 11 11m0-11-11 11" />
      ) : name === "plus" ? (
        <path {...common} d="M10 4v12M4 10h12" />
      ) : name === "trash" ? (
        <><path {...common} d="M4.5 6h11M8 3.5h4M6 6l.7 10.5h6.6L14 6M8.5 9v4.5M11.5 9v4.5" /></>
      ) : name === "warning" ? (
        <><path {...common} d="M10 2.8 18 17H2z" /><path {...common} d="M10 7v4.5M10 14.5h.01" /></>
      ) : name === "up" ? (
        <path {...common} d="m5 12 5-5 5 5" />
      ) : name === "down" ? (
        <path {...common} d="m5 8 5 5 5-5" />
      ) : (
        <path {...common} d="m6 8 4 4 4-4" />
      )}
    </svg>
  );
}
