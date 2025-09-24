import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "../../context/ThemeContextProvider";
import ThemePicker from "../../components/ThemePicker";
import ThemePreview from "../../components/ThemePreview";

export default function Personalizacion() {
  const { themes } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themes.colors.background }]}
    >
      <Text style={[styles.title, { color: themes.colors.onBackground }]}>
        Pantalla de Configuración
      </Text>
      <ThemePicker />
      <ThemePreview />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  logoutText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
