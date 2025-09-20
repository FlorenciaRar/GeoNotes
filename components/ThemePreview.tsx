import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContextProvider";

export default function ThemePreview() {
  const { themes } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: themes.surface,
          borderColor: themes.outline,
        },
      ]}
    >
      {/* Botón primario */}
      <Pressable style={[styles.button, { backgroundColor: themes.primary }]}>
        <Text style={[styles.buttonText, { color: themes.onPrimary }]}>
          Botón primario
        </Text>
      </Pressable>

      {/* Texto + enlace */}
      <Text style={[styles.text, { color: themes.onBackground }]}>
        Texto normal
      </Text>
      <Text style={[styles.link, { color: themes.primary }]}>Enlace</Text>

      {/* Input */}
      <View
        style={[
          styles.input,
          { borderColor: themes.outline, backgroundColor: themes.surface },
        ]}
      >
        <TextInput
          placeholder="Placeholder"
          placeholderTextColor={themes.onSurfaceVariant}
          style={{ color: themes.onSurface }}
        />
      </View>

      {/* Error */}
      <Text style={[styles.error, { color: themes.error }]}>
        Mensaje de error
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 10, // más compacto
    marginHorizontal: 16,
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  buttonText: { fontWeight: "600", fontSize: 13 },
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
