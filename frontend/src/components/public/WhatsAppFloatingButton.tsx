import { MessageCircle } from "lucide-react";
import { useChopeStore } from "@/lib/store/chope-store";
import { generalInquiryLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

export function WhatsAppFloatingButton({ message }: { message?: string }) {
  const settings = useChopeStore((s) => s.settings);
  return (
    <a
      href={generalInquiryLink(settings, message)}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("ClickWhatsApp", { source: "floating" })}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)] transition hover:brightness-95 md:bottom-8 md:right-8"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Pedir pelo WhatsApp</span>
    </a>
  );
}
