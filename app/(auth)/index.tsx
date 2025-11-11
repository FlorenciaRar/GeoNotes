import { useContext, useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import AuthContext from "../../context/AuthContext/auth-context";
import Loader from "../../components/Loader";
import { BackgroundDecor } from "../../components/ui/BackgroundDecor";
import { AnimatedGradientButton } from "../../components/ui/AnimatedGradientButton";

/* ────────── Pantalla principal de Login ────────── */
export default function Login() {
  const router = useRouter();
  const { themes } = useTheme();
  const styles = useMemo(() => getStyles(themes), [themes]);
  const { state, login } = useContext(AuthContext);

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; pass?: string }>({});

  // Controla si los campos están completos
  const canSubmit = email.trim().length > 0 && pass.trim().length > 0;

  /* ───────── Animación del botón (transición de color) ───────── */
  const activeAnim = useRef(new Animated.Value(canSubmit ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: canSubmit && !loading ? 1 : 0,
      duration: 220,
      useNativeDriver: true, // Usa la GPU para suavidad
    }).start();
  }, [canSubmit, loading]);

  /* ───────── Función para iniciar sesión ───────── */
  const handleLogin = async () => {
    setErrors({});
    if (!email.includes("@"))
      setErrors((e) => ({ ...e, email: "Email inválido" }));
    if (pass.length < 6)
      setErrors((e) => ({ ...e, pass: "Mínimo 6 caracteres" }));
    if (!canSubmit) return;

    try {
      setLoading(true);
      await login(email.trim(), pass);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Credenciales inválidas o error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  /* ───────── Render principal ───────── */
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themes.colors.background }}
    >
      {/* Fondo visual decorativo */}
      <BackgroundDecor theme={themes} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.screen}>
          {/* Encabezado */}
          <View style={styles.header}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <Text style={styles.subtitle}>
              Accedé con tu cuenta para continuar
            </Text>
          </View>

          {/* Card contenedora del formulario */}
          <View style={styles.card}>
            {/* Input de Email */}
            <View
              style={[
                styles.inputWrapper,
                errors.email && { borderColor: themes.colors.error },
              ]}
            >
              <Feather
                name="mail"
                size={18}
                color={
                  errors.email
                    ? themes.colors.error
                    : themes.colors.onSurfaceVariant
                }
                style={{ marginHorizontal: themes.spacing.sm }}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={themes.colors.onSurfaceVariant}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>
            {errors.email && (
              <Text style={styles.helperError}>{errors.email}</Text>
            )}

            {/* Input de Contraseña */}
            <View
              style={[
                styles.inputWrapper,
                errors.pass && { borderColor: themes.colors.error },
              ]}
            >
              <Feather
                name="lock"
                size={18}
                color={
                  errors.pass
                    ? themes.colors.error
                    : themes.colors.onSurfaceVariant
                }
                style={{ marginHorizontal: themes.spacing.sm }}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Contraseña"
                placeholderTextColor={themes.colors.onSurfaceVariant}
                value={pass}
                onChangeText={setPass}
                secureTextEntry={!showPass}
                textContentType="password"
                autoComplete="password"
              />
              {/* Botón para mostrar/ocultar contraseña */}
              <Pressable
                onPress={() => setShowPass((s) => !s)}
                hitSlop={8}
                style={styles.trailingBtn}
              >
                <Feather
                  name={showPass ? "eye-off" : "eye"}
                  size={20}
                  color={themes.colors.onSurfaceVariant}
                />
              </Pressable>
            </View>
            {errors.pass && (
              <Text style={styles.helperError}>{errors.pass}</Text>
            )}

           <AnimatedGradientButton
              title="Ingresar"
              onPress={handleLogin}
              active={canSubmit}
              loading={loading}
            />


            {/* Enlace de ayuda */}
            <Pressable
              onPress={() =>
                Alert.alert("Recuperar contraseña", "Próximamente.")
              }
              hitSlop={6}
            >
              <Text style={styles.helperLink}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </View>

          {/* Footer con enlace a registro */}
          <Text style={styles.footerText}>
            ¿No tenés cuenta?{" "}
            <Text
              onPress={() => router.push("/register")}
              accessibilityRole="link"
              style={styles.footerLink}
            >
              Registrate
            </Text>
          </Text>

          <Loader visible={loading || state.isLoading} transparent />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ───────── Estilos ───────── */
function getStyles(theme: DefaultTheme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      justifyContent: "center",
      gap: theme.spacing.md,
    },
    header: {
      alignItems: "center",
      gap: theme.spacing.xm,
      marginBottom: theme.spacing.xm,
    },
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "700",
      color: theme.colors.onBackground,
      textAlign: "center",
    },
    subtitle: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
      marginHorizontal: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      height: 54,
      marginBottom: theme.spacing.xm,
    },
    input: {
      flex: 1,
      height: "100%",
      color: theme.colors.onSurface,
      fontSize: theme.fontSizes.sm,
      letterSpacing: 0.15,
      paddingHorizontal: 8,
    },
    trailingBtn: { padding: 6, borderRadius: 999, marginRight: 8 },

    /* Textos auxiliares */
    helperLink: {
      color: theme.colors.onSurfaceVariant,
      fontSize: theme.fontSizes.xm,
      textAlign: "center",
      marginTop: theme.spacing.sm,
    },
    helperError: {
      color: theme.colors.error,
      fontSize: theme.fontSizes.xm,
      marginBottom: -theme.spacing.xm,
      marginLeft: theme.spacing.sm,
    },
    footerText: {
      textAlign: "center",
      color: theme.colors.onBackground,
      marginTop: theme.spacing.sm,
      fontSize: theme.fontSizes.xm,
    },
    footerLink: { color: theme.colors.primary, fontWeight: "700" },
  });
}
