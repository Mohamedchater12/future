import {
  IconLayoutDashboard,
  IconClipboardList,
  IconMessageCircle,
  IconStarFilled,
  IconUserCircle,
  type Icon,
} from "@tabler/icons-react";
import type { ClientSpaceDictionary } from "@/lib/i18n/clientSpace/translations";

export type ClientNavLink = {
  href: string;
  label: string;
  icon: Icon;
};

export function getClientNavLinks(dict: ClientSpaceDictionary): ClientNavLink[] {
  return [
    { href: "/espace-client/dashboard", label: dict.nav.dashboard, icon: IconLayoutDashboard },
    { href: "/espace-client/demandes", label: dict.nav.requests, icon: IconClipboardList },
    { href: "/espace-client/messagerie", label: dict.nav.messaging, icon: IconMessageCircle },
    { href: "/espace-client/avis", label: dict.nav.reviews, icon: IconStarFilled },
    { href: "/espace-client/profil", label: dict.nav.profile, icon: IconUserCircle },
  ];
}
