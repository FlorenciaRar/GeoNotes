import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DefaultTheme } from "styled-components/native";

// Sitio para ver los iconos: https://icons.expo.fyi/Index

const icons = {
  home: "home-variant-outline",
  note: "file-document-outline",
  notifications: "bell-outline",
  map: "map-outline",
  plus: "plus",
  profile: "account-circle-outline",
  settings: "cog-outline",
  options: "dots-vertical",
  trash: "trash-can-outline",
  share: "share-variant-outline",
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
