// app/(auth)/index.tsx
// --- Login adaptado a Firebase Auth ---
//
// Puntos clave:
// 1️⃣ Usa el contexto para llamar a login(email, password).
// 2️⃣ Muestra errores y estado de carga (Firebase se encarga de la sesión).
// 3️⃣ Redirige automáticamente al iniciar sesión exitosa (usa router.replace).

import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import AuthContext from "../../context/AuthContext/auth-context";

export default function Login() {
  const { state, login } = useContext(AuthContext); // 👈 usamos la función login del contexto
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { themes } = useTheme();
  const styles = getStyles(themes);

  const canSubmit = email.length > 0 && pass.length > 0;

  const handleLogin = async (): Promise<void> => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      await login(email, pass); // 🔥 Firebase Auth maneja login + persistencia

      Alert.alert("Bienvenido", email);
      router.replace("/(tabs)"); // ✅ Redirige al home/tab principal
    } catch (error: any) {
      console.error("Error en login:", error);
      Alert.alert("Error", "Credenciales inválidas o error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={themes.colors.onSurfaceVariant}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={themes.colors.onSurfaceVariant}
          value={pass}
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
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <ActivityIndicator color={themes.colors.onPrimary} />
          ) : (
            <Text style={styles.btnText}>Ingresar</Text>
          )}
        </Pressable>

        <Text style={{ marginTop: 20, color: themes.colors.onBackground }}>
          ¿No tenés cuenta?{" "}
          <Text
            onPress={() => router.push("/register")}
            accessibilityRole="link"
            style={{
              color: themes.colors.primary,
              fontWeight: "bold",
              textDecorationLine: "none",
            }}
          >
            Registrate
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

function getStyles(themes: DefaultTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: themes.colors.background,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 30,
      color: themes.colors.onBackground,
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: themes.colors.outline,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: themes.colors.surface,
      color: themes.colors.onSurface,
    },
    btn: {
      backgroundColor: themes.colors.primary,
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
      backgroundColor: themes.colors.surfaceVariant,
    },
    btnText: { color: themes.colors.onPrimary, fontWeight: "bold" },
  });
}
