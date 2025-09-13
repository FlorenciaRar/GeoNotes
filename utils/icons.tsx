import { MaterialCommunityIcons } from "@expo/vector-icons";

// Sitio para ver los iconos: https://icons.expo.fyi/Index

const icons = {
  home: "home-variant-outline",
  note: "file-document-outline",
  notifications: "bell-outline",
  map: "map-outline",
  plus: "plus",
  profile: "account-circle-outline",
  settings: "cog-outline",
} as const;

export type IconName = keyof typeof icons;

interface IconProps {
  iconName: IconName;
  size?: number;
  color?: string;
}

export default function Icon({ iconName, size = 24, color = "black" }: IconProps) {
  const icon = icons[iconName];
  return <MaterialCommunityIcons name={icon} size={size} color={color} />;
}
