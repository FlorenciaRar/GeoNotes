import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContextProvider";
import { useContext } from "react";
import { router } from "expo-router";
import { AUTH_ACTIONS, AuthContext } from "../../context/AuthContext";

export default function Settings() {
  const { themes, clearTheme } = useTheme();
  const { dispatch, logout } = useContext(AuthContext);

  const handleLogout = async() => {
    console.log("👋 Cerrando sesión...");
    await logout()
    await clearTheme()
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themes.colors.background }]}
    >
      <Pressable
        style={[styles.btn, { backgroundColor: themes.colors.primary }]}
        onPress={() => router.push("/settings/select-theme")}
      >
        <Text style={[styles.btnText, { color: themes.colors.onPrimary }]}>
          Personalización
        </Text>
      </Pressable>
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
  btn: {
    marginTop: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
