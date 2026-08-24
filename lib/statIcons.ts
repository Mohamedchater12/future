import {
  IconRocket,
  IconUsers,
  IconCalendarStats,
  IconHeadset,
  IconTrendingUp,
  IconStarFilled,
  IconWorld,
  IconClock,
  IconChartBar,
  IconBriefcase,
  type Icon,
} from "@tabler/icons-react";

export const STAT_ICON_OPTIONS: { value: string; label: string; icon: Icon }[] = [
  { value: "IconRocket", label: "Rocket", icon: IconRocket },
  { value: "IconUsers", label: "Users", icon: IconUsers },
  { value: "IconCalendarStats", label: "Experience", icon: IconCalendarStats },
  { value: "IconHeadset", label: "Support", icon: IconHeadset },
  { value: "IconTrendingUp", label: "Growth", icon: IconTrendingUp },
  { value: "IconStarFilled", label: "Rating", icon: IconStarFilled },
  { value: "IconWorld", label: "Global", icon: IconWorld },
  { value: "IconClock", label: "Time", icon: IconClock },
  { value: "IconChartBar", label: "Stats", icon: IconChartBar },
  { value: "IconBriefcase", label: "Business", icon: IconBriefcase },
];

export const STAT_ICON_MAP: Record<string, Icon> = Object.fromEntries(
  STAT_ICON_OPTIONS.map((opt) => [opt.value, opt.icon])
);
