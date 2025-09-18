import { StyleSheet, Text } from "react-native";
import Icon from "../utils/icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

interface MenuProps {
  onDelete: () => void;
}

export default function NoteCardOptionsMenu({ onDelete }: MenuProps) {
  return (
    <Menu style={styles.optionsButton}>
      <MenuTrigger>
        <Icon iconName="options" />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 32,
            padding: 8,
            borderRadius: 12,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
          },
        }}>
        <MenuOption
          customStyles={{
            optionWrapper: {
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            },
            optionText: {},
          }}
          onSelect={() => {}}>
          <Icon iconName="share" size={20} />
          <Text>Compartir</Text>
        </MenuOption>
        <MenuOption
          customStyles={{
            optionWrapper: {
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            },
            optionText: {},
          }}
          onSelect={onDelete}>
          <Icon iconName="trash" size={20} />
          <Text>Borrar</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}

const styles = StyleSheet.create({
  noteCardContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    position: "relative",
  },
  optionsButton: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  optionsContainer: {
    marginTop: 32,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
