export type GuestRange = "1_49" | "50_99" | "100_149" | "150_199" | "200_plus";
export type EventType = "wedding" | "celebration" | "luxury_picnic" | "day_of_setup" | "other";

export type AnalyticsEvent =
  | {
      event: "look_book_click";
      link_location: string;
    }
  | {
      event: "inquire_click";
      link_location: string;
    }
  | {
      event: "section_view";
      section_name: string;
    }
  | {
      event: "gallery_open";
      project_slug: string;
      gallery_entry_point: "cover" | "preview" | "full_gallery";
    }
  | {
      event: "faq_open";
      faq_id: string;
    }
  | { event: "form_view" }
  | {
      event: "form_start";
      form_field: string;
    }
  | { event: "form_submit" }
  | {
      event: "form_error";
      error_type: "required" | "format" | "range" | "length" | "server_validation" | "delivery";
      error_field?: string;
    }
  | {
      event: "generate_lead";
      event_type: EventType;
      guest_range: GuestRange;
    }
  | {
      event: "contact_click";
      contact_method: "phone" | "email";
      link_location: string;
    }
  | {
      event: "social_click";
      social_network: "instagram" | "facebook";
      link_location: string;
    };

declare global {
  interface Window {
    dataLayer?: AnalyticsEvent[];
  }
}

/**
 * Único punto de salida hacia GTM. El objeto se conserva plano para que
 * cada parámetro pueda leerse con una Data Layer Variable de versión 2.
 */
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Clear a previous field error when a later delivery error has no field.
  window.dataLayer.push(event.event === "form_error" ? { ...event, error_field: event.error_field } : event);
}

export function guestRange(guestCount: number): GuestRange {
  if (guestCount < 50) return "1_49";
  if (guestCount < 100) return "50_99";
  if (guestCount < 150) return "100_149";
  if (guestCount < 200) return "150_199";
  return "200_plus";
}

export function eventType(value: FormDataEntryValue | null): EventType {
  switch (value) {
    case "Wedding":
      return "wedding";
    case "Celebration (birthday, shower, sweet sixteen, quinceañera, mitzvah)":
      return "celebration";
    case "Luxury Picnic":
      return "luxury_picnic";
    case "Day-Of Set-Up":
      return "day_of_setup";
    default:
      return "other";
  }
}
