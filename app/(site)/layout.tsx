import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CustomCursor from "@/components/providers/CustomCursor";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <div className="site-shell">
          <CustomCursor />
          <div className="noise-overlay" />
          {children}
          <Footer />
          <WhatsAppFloatButton />
        </div>
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}
