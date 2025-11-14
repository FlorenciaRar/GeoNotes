import React from "react";
import { StyleSheet, View } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
import { useTheme } from "../context/ThemeContextProvider";

interface LoaderProps {
  visible: boolean;
  transparent?: boolean; // 👈 nuevo prop opcional
}

const Loader: React.FC<LoaderProps> = ({ visible }) => {
  const { themes } = useTheme();
  if (!visible) return null; // Evita render innecesario

  return (
    <View style={styles.container}>
      <AnimatedLoader
        visible={visible}
        overlayColor={themes.colors.background}
        source={require("../assets/animations/loading.json")}
        animationStyle={styles.animation}
        speed={1}
      />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // 👈 hace que el loader se superponga a la pantalla actual
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // asegura que quede por encima de otros elementos
  },
  animation: {
    width: 150,
    height: 150,
  },
});
