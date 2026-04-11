// Utility untuk Google Analytics 4 Event Tracking

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = 'G-H8TJZM1ZNM';

// Track klik WhatsApp — muncul di GA4 > Peristiwa > whatsapp_click
export function trackWhatsAppClick(location: string, page: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'Contact',
      event_label: `WA - ${location}`,
      page_location: page,
      send_to: GA_ID,
    });
  }
}

// Track klik nomor telepon — muncul di GA4 > Peristiwa > phone_click
export function trackPhoneClick(location: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'phone_click', {
      event_category: 'Contact',
      event_label: `Phone - ${location}`,
      send_to: GA_ID,
    });
  }
}

// Track scroll ke section layanan (engagement)
export function trackSectionView(section: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'section_view', {
      event_category: 'Engagement',
      event_label: section,
      send_to: GA_ID,
    });
  }
}
