import type { Product, SiteSettings } from "./types";

export function buildWhatsAppLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function productInquiryMessage(product: Product, businessName: string): string {
  return `Olá, ${businessName}! Tenho interesse em: ${product.name} (R$ ${product.price.toFixed(2).replace(".", ",")}). Está disponível?`;
}

export function generalInquiryLink(settings: SiteSettings, message?: string): string {
  return buildWhatsAppLink(
    settings.whatsappNumber,
    message ?? `Olá, ${settings.businessName}! Gostaria de mais informações.`,
  );
}
