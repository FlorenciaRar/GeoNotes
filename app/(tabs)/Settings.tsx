import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, Pressable, View, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContextProvider";
import { useContext, useMemo } from "react";
import { router } from "expo-router";
import { AUTH_ACTIONS, AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { DefaultTheme } from "styled-components/native";

/* ───────── util transparencia ───────── */
function hexWithAlpha(hex: string, alpha: number) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return hex.length === 7 ? `${hex}${a}` : hex;
}

/* ───────── fondo decorativo ───────── */
function BackgroundDecor({ theme }: { theme: DefaultTheme }) {
  const bg = theme.colors.background;
  const surf = theme.colors.surface;
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[bg, surf]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          hexWithAlpha(theme.colors.primary, 0.16),
          hexWithAlpha(theme.colors.primary, 0),
        ]}
        start={{ x: 0.4, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: 260,
          right: -70,
          top: -30,
        }}
      />
      <LinearGradient
        colors={[
          hexWithAlpha(theme.colors.secondary, 0.12),
          hexWithAlpha(theme.colors.secondary, 0),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: 300,
          left: -80,
          bottom: -60,
        }}
      />
    </View>
  );
}

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

        <Pressable
          style={({ pressed }) => [
            styles.btnWrapper,
            pressed && styles.btnWrapperPressed,
          ]}
          onPress={() => router.push("/settings/select-theme")}
        >
          <LinearGradient
            colors={[themes.colors.primary, themes.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Personalización</Text>
          </LinearGradient>
        </Pressable>

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
