import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icon, { IconName } from "../utils/icons";
import { Link } from "expo-router";
import { StyledText } from "../styled-components/StyledText";
import { useTheme } from "../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";

const anchoPantalla = Dimensions.get("window").width;
const itemWidth = anchoPantalla / 2 - 22;

interface QuickAccessItemProps {
  link: string;
  iconName: IconName;
  name: string;
}

export default function QuickAccessItem({
  link,
  iconName,
  name,
}: QuickAccessItemProps) {
  const { themes } = useTheme();
  const styles = getStyles(themes);
  return (
    <Link href={link} asChild>
      <TouchableOpacity style={styles.quickAccessItem}>
        <Icon color={themes.colors.onSurface} iconName={iconName} />
        <StyledText variant="bold" size="xm">
          {name}
        </StyledText>
      </TouchableOpacity>
    </Link>
  );
}
function getStyles(themes: DefaultTheme) {
  return StyleSheet.create({
    quickAccessItem: {
      width: itemWidth,
      height: 90,
      backgroundColor: themes.colors.surface,
      borderRadius: 16,
      marginBottom: 12,
      padding: 16,
      justifyContent: "center",
      rowGap: 16,
      gap: themes.spacing.sm,
      borderWidth: 1,
      borderColor: themes.colors.outline,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
  });
}
