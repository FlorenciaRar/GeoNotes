import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContextProvider";
import { BackgroundDecor } from "./ui/BackgroundDecor";
import { GradientButton } from "./ui/GradientButton";

export default function ThemePreview() {
  const { themes } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor: themes.colors.outline,
        },
      ]}
    >
      {/* Fondo decorativo dentro del contenedor */}
      <View style={styles.decorContainer}>
        <BackgroundDecor theme={themes} />
      </View>

      {/* Contenido de la preview */}
      <View style={{ padding: 10 }}>
        {/* Botón primario */}
        {/* Botón primario con degradado */}
        
        {/* implemento boton reutilizable: small para que no sea grande por defecto */}
        <GradientButton title="Botón primario"  size="small"/>

        {/* Texto + enlace */}
        <Text style={[styles.text, { color: themes.colors.onBackground }]}>
          Texto normal
        </Text>
        <Text style={[styles.link, { color: themes.colors.primary }]}>
          Enlace
        </Text>

        {/* Input */}
        <View
          style={[
            styles.input,
            {
              borderColor: themes.colors.outline,
              backgroundColor: themes.colors.surface,
            },
          ]}
        >
          <TextInput
            placeholder="Placeholder"
            placeholderTextColor={themes.colors.onSurfaceVariant}
            style={{ color: themes.colors.onSurface }}
          />
        </View>

        {/* Error */}
        <Text style={[styles.error, { color: themes.colors.error }]}>
          Mensaje de error
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  decorContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    overflow: "hidden",
  },
  wrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 10, // más compacto
    marginHorizontal: 16,
    marginTop: 10,
  },
  
  text: { marginTop: 8, fontSize: 13 },
  link: { marginTop: 2, fontWeight: "600", fontSize: 13 },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  error: { marginTop: 8, fontSize: 12, fontWeight: "500" },
});
