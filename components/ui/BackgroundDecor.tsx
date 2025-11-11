import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DefaultTheme } from "styled-components/native";

/* ────────── Utilidad: agrega transparencia a un color HEX ────────── */
function hexWithAlpha(hex: string, alpha: number) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return hex.length === 7 ? `${hex}${a}` : hex;
}

/* ────────── Fondo decorativo con gradientes ────────── */
export const BackgroundDecor = ({ theme }: { theme: DefaultTheme }) => {
  const bg = theme.colors.background;
  const surf = theme.colors.surface;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Fondo base: gradiente entre background y surface */}
      <LinearGradient
        colors={[bg, surf]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Círculo decorativo superior derecho */}
      <LinearGradient
        colors={[
          hexWithAlpha(theme.colors.primary, 0.18),
          hexWithAlpha(theme.colors.primary, 0.0),
        ]}
        start={{ x: 0.3, y: 0.3 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: 280,
          right: -80,
          top: -40,
        }}
      />

      {/* Círculo decorativo inferior izquierdo */}
      <LinearGradient
        colors={[
          hexWithAlpha(theme.colors.secondary, 0.14),
          hexWithAlpha(theme.colors.secondary, 0.0),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: 320,
          left: -90,
          bottom: -60,
        }}
      />
    </View>
  );
};
