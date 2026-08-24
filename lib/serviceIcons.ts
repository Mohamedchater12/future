import {
  IconPalette,
  IconTrendingUp,
  IconMessageCircle2,
  IconUsers,
  IconSearch,
  IconTargetArrow,
  IconDeviceDesktop,
  IconCode,
  IconVideo,
  IconBriefcase,
  IconRocket,
  IconBulb,
  IconShare2,
  IconSpeakerphone,
  IconPencil,
  IconMovie,
  type Icon,
} from "@tabler/icons-react";

export const SERVICE_ICON_OPTIONS: { value: string; label: string; icon: Icon }[] = [
  { value: "IconPalette", label: "Palette", icon: IconPalette },
  { value: "IconTrendingUp", label: "Growth", icon: IconTrendingUp },
  { value: "IconMessageCircle2", label: "Communication", icon: IconMessageCircle2 },
  { value: "IconUsers", label: "Users", icon: IconUsers },
  { value: "IconSearch", label: "Search", icon: IconSearch },
  { value: "IconTargetArrow", label: "Targeting", icon: IconTargetArrow },
  { value: "IconDeviceDesktop", label: "Web", icon: IconDeviceDesktop },
  { value: "IconCode", label: "Development", icon: IconCode },
  { value: "IconVideo", label: "Video", icon: IconVideo },
  { value: "IconBriefcase", label: "Business", icon: IconBriefcase },
  { value: "IconRocket", label: "Launch", icon: IconRocket },
  { value: "IconBulb", label: "Idea", icon: IconBulb },
  { value: "IconShare2", label: "Share", icon: IconShare2 },
  { value: "IconSpeakerphone", label: "Advertising", icon: IconSpeakerphone },
  { value: "IconPencil", label: "Creative", icon: IconPencil },
  { value: "IconMovie", label: "Cinema", icon: IconMovie },
];

export const SERVICE_ICON_MAP: Record<string, Icon> = Object.fromEntries(
  SERVICE_ICON_OPTIONS.map((opt) => [opt.value, opt.icon])
);
