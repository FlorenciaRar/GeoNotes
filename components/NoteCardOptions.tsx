import { StyleSheet } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { useTheme } from "../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import { StyledText } from "../styled-components";
import { Icon } from "../utils";

interface MenuProps {
  onDelete: () => void;
}

export default function NoteCardOptionsMenu({ onDelete }: MenuProps) {
  const { themes } = useTheme();
  const styles = getStyles(themes);
  return (
    <Menu style={styles.optionsButton}>
      <MenuTrigger>
        <Icon iconName="options" color={themes.colors.onSurface} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 32,
            padding: themes.spacing.sm,
            borderRadius: themes.spacing.md,
            backgroundColor: `${themes.colors.surface}`,
            shadowColor: `${themes.colors.onSurface}`,
          },
        }}>
        <MenuOption
          customStyles={{
            optionWrapper: {
              flexDirection: "row",
              alignItems: "center",
              gap: themes.spacing.xm,
            },
          }}
          onSelect={() => {}}>
          <Icon iconName="share" size={20} color={themes.colors.onSurface} />
          <StyledText size="xm" color="onSurface">
            {"Compartir"}
          </StyledText>
        </MenuOption>
        <MenuOption
          customStyles={{
            optionWrapper: {
              flexDirection: "row",
              alignItems: "center",
              gap: themes.spacing.xm,
            },
          }}
          onSelect={onDelete}>
          <Icon iconName="trash" size={20} color={themes.colors.onSurface} />
          <StyledText size="xm" color="onSurface">
            {"Borrar"}
          </StyledText>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}

function getStyles(themes: DefaultTheme) {
  return StyleSheet.create({
    noteCardContainer: {
      backgroundColor: themes.colors.surface,
      padding: themes.spacing.md,
      borderRadius: themes.spacing.md,
      marginBottom: themes.spacing.md,
      position: "relative",
    },
    optionsButton: {
      position: "absolute",
      right: themes.spacing.md,
      top: themes.spacing.md,
    },
  });
}
