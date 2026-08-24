import {
  IconLayoutDashboard,
  IconInbox,
  IconUsers,
  IconBriefcase,
  IconBuildingSkyscraper,
  IconTool,
  IconStarFilled,
  IconClipboardList,
  IconMessageCircle,
  IconStack2,
  IconChartBar,
  type Icon,
} from "@tabler/icons-react";
import type { ShellDictionary } from "@/lib/i18n/admin/shell";

export type AdminNavLink = {
  href: string;
  label: string;
  icon: Icon;
};

export function getAdminNavLinks(dict: ShellDictionary): AdminNavLink[] {
  return [
    { href: "/admin/dashboard", label: dict.nav.dashboard, icon: IconLayoutDashboard },
    { href: "/admin/demandes", label: dict.nav.requests, icon: IconInbox },
    { href: "/admin/clients", label: dict.nav.clients, icon: IconUsers },
    { href: "/admin/missions", label: dict.nav.clientWork, icon: IconClipboardList },
    { href: "/admin/messages", label: dict.nav.messages, icon: IconMessageCircle },
    { href: "/admin/services", label: dict.nav.services, icon: IconBriefcase },
    { href: "/admin/stats", label: dict.nav.stats, icon: IconChartBar },
    { href: "/admin/projects", label: dict.nav.projects, icon: IconStack2 },
    { href: "/admin/trusted-by", label: dict.nav.trustedBy, icon: IconBuildingSkyscraper },
    { href: "/admin/tools", label: dict.nav.tools, icon: IconTool },
    { href: "/admin/avis", label: dict.nav.reviews, icon: IconStarFilled },
  ];
}
