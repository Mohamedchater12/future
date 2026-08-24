// TODO: replace with the real business WhatsApp number (digits only,
// country code first, no leading + or spaces) once available.
export const WHATSAPP_NUMBER = "201000000000";

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
