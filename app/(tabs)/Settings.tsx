import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, Pressable, View, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContextProvider";
import { useContext, useMemo } from "react";
import { router } from "expo-router";
import { AUTH_ACTIONS, AuthContext } from "../../context/AuthContext";
import { DefaultTheme } from "styled-components/native";
import { BackgroundDecor } from "../../components/ui/BackgroundDecor";
import {GradientButton} from "../../components/ui/GradientButton"

export default function Settings() {
  const { themes, clearTheme } = useTheme();
  const { dispatch, logout } = useContext(AuthContext);
  const styles = useMemo(() => getStyles(themes), [themes]);

  const handleLogout = async () => {
    try {
      await logout();
      await clearTheme();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      router.replace("/(auth)");
    } catch (e) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themes.colors.background }]}
    >
      {/* Fondo decorativo */}
      <BackgroundDecor theme={themes} />

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Personalizá tu experiencia o cerrá sesión
        </Text>

        {/* implemento boton reutilizable: fullwidth para el ancho de pantalla */}
        <GradientButton
          title="Personalización"
          onPress={() => router.push("/settings/select-theme")}
          fullWidth
        />

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.9, transform: [{ scale: 0.996 }] },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* ───────── estilos ───────── */
function getStyles(theme: DefaultTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.lg,
      position: "relative", // importante para que el fondo absoluto funcione
    },
    content: {
      gap: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "700",
      color: theme.colors.onBackground,
      textAlign: "center",
      letterSpacing: -0.3,
      lineHeight: theme.fontSizes.lg + 6,
      marginTop: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
      letterSpacing: 0.2,
      lineHeight: theme.fontSizes.sm + 6,
      marginBottom: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
    },

    btnWrapper: {
      borderRadius: 999,
      overflow: "hidden",
    },
    btnWrapperPressed: {
      opacity: 0.96,
      transform: [{ scale: 0.995 }],
    },
    btn: {
      paddingVertical: 14,
      alignItems: "center",
    },
    btnText: {
      color: theme.colors.onPrimary,
      fontWeight: "700",
      letterSpacing: 0.3,
      fontSize: theme.fontSizes.sm,
    },

    logoutButton: {
      borderRadius: 999,
      paddingVertical: 14,
      alignItems: "center",
      backgroundColor: theme.colors.error,
      marginTop: theme.spacing.md,
    },
    logoutText: {
      color: theme.colors.onPrimary,
      fontWeight: "700",
      letterSpacing: 0.3,
      fontSize: theme.fontSizes.sm,
    },
  });
}
