import React, { useEffect, useRef } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContextProvider";
import { Feather } from "@expo/vector-icons";

type AnimatedGradientButtonProps = {
  title: string;
  onPress?: () => void;
  active?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

export const AnimatedGradientButton: React.FC<AnimatedGradientButtonProps> = ({
  title,
  onPress,
  active = false,
  loading = false,
  disabled = false,
}) => {
  const { themes } = useTheme();
  const activeAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: active && !disabled ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [active, disabled]);

  return (
    <Pressable
      onPress={onPress}
      disabled={!active || disabled || loading}
      style={({ pressed }) => [
        styles.btnWrapper,
        pressed && active && styles.btnWrapperPressed,
      ]}
    >
      <View style={styles.btn}>
        {/* Fondo gris inactivo */}
        <LinearGradient
          colors={[themes.colors.outline, themes.colors.surfaceVariant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Fondo de gradiente activo animado */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: activeAnim }]}
        >
          <LinearGradient
            colors={[themes.colors.primary, themes.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Contenido */}
        {loading ? (
          <ActivityIndicator color={themes.colors.onPrimary} />
        ) : (
          <View style={styles.btnContent}>
            <Text
              style={[
                styles.btnText,
                {
                  color: active
                    ? themes.colors.onPrimary
                    : themes.colors.onSurfaceVariant,
                },
              ]}
            >
              {title}
            </Text>
            {active && (
              <View style={styles.iconPill}>
                <Feather
                  name="arrow-right"
                  size={16}
                  color={themes.colors.onPrimary}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },
  btnWrapperPressed: { opacity: 0.95 },
  btn: {
    position: "relative",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    overflow: "hidden",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnText: {
    fontWeight: "700",
    fontSize: 15,
  },
  iconPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#ffffff44",
    alignItems: "center",
    justifyContent: "center",
  },
});
