import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AppTheme } from "../../utils";
import { useTheme } from "../../context/ThemeContextProvider";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const { themes } = useTheme();
  const styles = getStyles(themes);

  //Habilita el boton solo si ambos campos tienen contenido
  const canSubmit = email.length > 0 && pass.length > 0;

  const handleLogin = (): void => {
    if (!canSubmit) return;

    if (email === "test@gmail.com" && pass === "1234") {
      Alert.alert("Bienvenido " + email);
      router.replace("/(tabs)");
    } else {
      Alert.alert("Credenciales incorrectas");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Iniciar Sesion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={themes.onSurfaceVariant}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={themes.onSurfaceVariant}
        value={pass}
        keyboardType="numeric"
        secureTextEntry
        onChangeText={setPass}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <Pressable
        style={({ pressed }) => [
          styles.btn,
          !canSubmit && styles.btnDisabled,
          pressed && canSubmit && styles.btnPressed,
        ]}
        onPress={handleLogin}
        disabled={!canSubmit}
      >
        <Text style={styles.btnText}>Ingresar</Text>
      </Pressable>
      <Text style={{ marginTop: 20, color: themes.onBackground }}>
        ¿No tenes cuenta?{" "}
        <Text
          onPress={() => router.push("/register")}
          accessibilityRole="link"
          style={{
            color: themes.primary,
            fontWeight: "bold",
            textDecorationLine: "none",
          }}
        >
          Registrate
        </Text>
      </Text>
    </View>
  );
}

function getStyles(themes: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: themes.background,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 30,
      color: themes.onBackground,
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: themes.outline,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: themes.surface,
      color: themes.onSurface,
    },
    btn: {
      backgroundColor: themes.primary,
      paddingVertical: 15,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
    },
    btnPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }],
    },
    btnDisabled: {
      backgroundColor: themes.surfaceVariant,
    },
    btnText: { color: themes.onPrimary, fontWeight: "bold" },
    btnTextDisabled: { color: themes.onSurfaceVariant },
  });
}
