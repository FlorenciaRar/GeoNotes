import React from "react";
import { Pressable, Text, View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContextProvider";

type GradientButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean; // 🔹 ocupa todo el ancho si true
  size?: "small" | "large"; // 🔹 controla padding y font-size
  style?: ViewStyle; // 🔹 estilos opcionales extra
};

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  disabled = false,
  fullWidth = false,
  size = "large",
  style,
}) => {
  const { themes } = useTheme();

  // 🎨 Ajustes según el tamaño
  const paddingVertical = size === "small" ? 8 : 14;
  const fontSize = size === "small" ? 13 : 15;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btnWrapper,
        fullWidth && { width: "100%" },
        pressed && !disabled && { opacity: 0.9 },
        style,
      ]}
    >
      <View style={[styles.btn, { paddingVertical }]}>
        <LinearGradient
          colors={[themes.colors.primary, themes.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.text, { color: themes.colors.onPrimary, fontSize }]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    borderRadius: 999,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  btn: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  text: {
    fontWeight: "700",
  },
});
