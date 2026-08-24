import {
  IconInbox,
  IconUserPlus,
  IconUserCheck,
  IconStar,
  IconMessageCircle,
  IconFileText,
  IconBell,
  type Icon,
} from "@tabler/icons-react";
import type { NotificationType } from "@prisma/client";

export const NOTIFICATION_ICONS: Record<NotificationType, Icon> = {
  NOUVELLE_DEMANDE: IconInbox,
  NOUVEAU_CLIENT: IconUserPlus,
  CLIENT_CONVERTI: IconUserCheck,
  NOUVEL_AVIS: IconStar,
  NOUVEAU_MESSAGE_CLIENT: IconMessageCircle,
  NOUVEAU_FICHIER_CLIENT: IconFileText,
  AUTRE: IconBell,
};
