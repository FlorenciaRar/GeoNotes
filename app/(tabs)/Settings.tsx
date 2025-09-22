import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContextProvider";
import ThemePicker from "../../components/ThemePicker";
import ThemePreview from "../../components/ThemePreview";
import { useContext } from "react";
import { router } from "expo-router";
import { AUTH_ACTIONS, AuthContext } from "../../context/AuthContext";

export default function Configuracion() {
  const { themes } = useTheme();
  const { dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    console.log("👋 Cerrando sesión...");
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themes.colors.background }]}
    >
      <Text style={[styles.title, { color: themes.colors.onBackground }]}>
        Pantalla de Configuración
      </Text>
      <ThemePicker />
      <ThemePreview />

      {/* Botón de logout */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
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
  logoutButton: {
    marginTop: 32,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#E53935",
  },
  logoutText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
