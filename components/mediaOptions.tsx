import { StyleSheet } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { useTheme } from "../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import { StyledText } from "../styled-components";
import { Icon } from "../utils";

interface MediaMenuProps {
  pickImage: () => void;
  takePhoto: () => void;
}

export default function MediaOptionsMenu({ pickImage, takePhoto }: MediaMenuProps) {
  const { themes } = useTheme();
  const styles = getStyles(themes);

  return (
    <Menu style={styles.optionsButton}>
      <MenuTrigger>
        <Icon iconName="attachment" color={themes.colors.onSurface} />
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
              gap: themes.spacing.sm,
            },
          }}
          onSelect={takePhoto}>
          <Icon iconName="camera" size={20} color={themes.colors.onSurface} />
          <StyledText size="xm" color="onSurface">
            Tomar una foto
          </StyledText>
        </MenuOption>
        <MenuOption
          customStyles={{
            optionWrapper: {
              flexDirection: "row",
              alignItems: "center",
              gap: themes.spacing.sm,
            },
          }}
          onSelect={pickImage}>
          <Icon iconName="galery" size={20} color={themes.colors.onSurface} />
          <StyledText size="xm" color="onSurface">
            Agregar una imagen
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
      margin: themes.spacing.md,
      position: "relative",
    },
    optionsButton: {},
  });
}
