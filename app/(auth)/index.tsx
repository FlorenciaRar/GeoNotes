import { useContext, useMemo, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import { LoginSchema } from "../../models/loginSchema";
import { useTheme } from "../../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import AuthContext from "../../context/AuthContext/auth-context";
import Loader from "../../components/Loader";
import { BackgroundDecor } from "../../components/ui/BackgroundDecor";
import { AnimatedGradientButton } from "../../components/ui/AnimatedGradientButton";

export default function Login() {
  const router = useRouter();
  const { themes } = useTheme();
  const styles = useMemo(() => getStyles(themes), [themes]);
  const { state, login } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (values: any, setSubmitting: (b: boolean) => void) => {
    try {
      await login(values.email.trim(), values.pass);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Credenciales inválidas o error al iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themes.colors.background }}>
      <BackgroundDecor theme={themes} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.screen}>
          <View style={styles.header}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <Text style={styles.subtitle}>
              Accedé con tu cuenta para continuar
            </Text>
          </View>

          <Formik
            initialValues={{ email: "", pass: "" }}
            validationSchema={LoginSchema}
            onSubmit={(vals, { setSubmitting }) =>
              handleLogin(vals, setSubmitting)
            }
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => {
              const canSubmit =
                values.email.trim().length > 0 &&
                values.pass.trim().length > 0 &&
                !isSubmitting;

              // Animación del botón
              const activeAnim = useRef(
                new Animated.Value(canSubmit ? 1 : 0)
              ).current;
              useEffect(() => {
                Animated.timing(activeAnim, {
                  toValue: canSubmit ? 1 : 0,
                  duration: 220,
                  useNativeDriver: true,
                }).start();
              }, [canSubmit]);

              return (
                <View style={styles.card}>
                  {/* Email */}
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.email && errors.email && {
                        borderColor: themes.colors.error,
                      },
                    ]}
                  >
                    <Feather
                      name="mail"
                      size={18}
                      color={
                        touched.email && errors.email
                          ? themes.colors.error
                          : themes.colors.onSurfaceVariant
                      }
                      style={{ marginHorizontal: themes.spacing.sm }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor={themes.colors.onSurfaceVariant}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      textContentType="emailAddress"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.helperError}>{errors.email}</Text>
                  )}

                  {/* Contraseña */}
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.pass && errors.pass && {
                        borderColor: themes.colors.error,
                      },
                    ]}
                  >
                    <Feather
                      name="lock"
                      size={18}
                      color={
                        touched.pass && errors.pass
                          ? themes.colors.error
                          : themes.colors.onSurfaceVariant
                      }
                      style={{ marginHorizontal: themes.spacing.sm }}
                    />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Contraseña"
                      placeholderTextColor={themes.colors.onSurfaceVariant}
                      value={values.pass}
                      onChangeText={handleChange("pass")}
                      onBlur={handleBlur("pass")}
                      secureTextEntry={!showPass}
                      textContentType="password"
                      autoComplete="password"
                    />
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
                  {touched.pass && errors.pass && (
                    <Text style={styles.helperError}>{errors.pass}</Text>
                  )}

                  <AnimatedGradientButton
                    title="Ingresar"
                    onPress={() => handleSubmit()}
                    active={canSubmit}
                    loading={isSubmitting}
                  />

                  <Pressable
                    onPress={() =>
                      Alert.alert("Recuperar contraseña", "Próximamente.")
                    }
                    hitSlop={6}
                  >
                    <Text style={styles.helperLink}>
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </Pressable>
                </View>
              );
            }}
          </Formik>

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

          <Loader visible={state.isLoading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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

