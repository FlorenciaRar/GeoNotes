// app/(auth)/register.tsx
import { useContext, useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import * as Yup from "yup";

import AuthContext from "../../context/AuthContext/auth-context";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../src/firebase/config";
import { useTheme } from "../../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import { BackgroundDecor } from "../../components/ui/BackgroundDecor";
import { AnimatedGradientButton } from "../../components/ui/AnimatedGradientButton";

/* ────────── Schema de validación ────────── */
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  surname: Yup.string().required("El apellido es obligatorio"),
  birthdate: Yup.string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Formato DD/MM/YYYY")
    .required("La fecha de nacimiento es obligatoria"),
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es obligatoria"),
});

/* ────────── Helper para máscara de fecha ────────── */
function maskDate(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 8);
  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 4);
  const p3 = digits.slice(4, 8);
  let out = p1;
  if (p2) out += "/" + p2;
  if (p3) out += "/" + p3;
  return out;
}

export default function Register() {
  const { register } = useContext(AuthContext);
  const { themes } = useTheme();
  const styles = useMemo(() => getStyles(themes), [themes]);
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async (
    values: any,
    setSubmitting: (b: boolean) => void
  ) => {
    try {
      const userCredential = await register(values.email, values.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        surname: values.surname,
        birthdate: values.birthdate,
        email: values.email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        "¡Cuenta creada!",
        `Bienvenido ${values.name} ${values.surname}`,
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
      );
    } catch (e) {
      console.error("Error en registro:", e);
      Alert.alert("Registro fallido", "Revisá los datos o intenta más tarde.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themes.colors.background }}
    >
      <BackgroundDecor theme={themes} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.screen}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Completá tus datos para registrarte
            </Text>
          </View>

          <Formik
            initialValues={{
              name: "",
              surname: "",
              birthdate: "",
              email: "",
              password: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={(vals, { setSubmitting }) =>
              handleRegister(vals, setSubmitting)
            }
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              isSubmitting,
            }) => {
              const allFilled =
                values.name &&
                values.surname &&
                values.birthdate &&
                values.email &&
                values.password;
              const canSubmit = !!allFilled && !isSubmitting;

              /* ───── Botón animado: crossfade de colores según canSubmit ───── */
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
                  {/* Nombre */}
                  <InputField
                    theme={themes}
                    icon="user"
                    placeholder="Nombre"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    error={touched.name ? (errors.name as string) : undefined}
                    returnKeyType="next"
                  />

                  {/* Apellido */}
                  <InputField
                    theme={themes}
                    icon="user-check"
                    placeholder="Apellido"
                    value={values.surname}
                    onChangeText={handleChange("surname")}
                    onBlur={handleBlur("surname")}
                    error={
                      touched.surname ? (errors.surname as string) : undefined
                    }
                    returnKeyType="next"
                  />

                  {/* Fecha nacimiento */}
                  <InputField
                    theme={themes}
                    icon="calendar"
                    placeholder="(DD/MM/YYYY)"
                    value={values.birthdate}
                    onChangeText={(t) =>
                      setFieldValue("birthdate", maskDate(t))
                    }
                    onBlur={handleBlur("birthdate")}
                    error={
                      touched.birthdate
                        ? (errors.birthdate as string)
                        : undefined
                    }
                    keyboardType="number-pad"
                    maxLength={10}
                    returnKeyType="next"
                  />

                  {/* Email */}
                  <InputField
                    theme={themes}
                    icon="mail"
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email ? (errors.email as string) : undefined}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    autoComplete="email"
                    returnKeyType="next"
                  />

                  {/* Contraseña */}
                  <InputField
                    theme={themes}
                    icon="lock"
                    placeholder="Contraseña"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={
                      touched.password ? (errors.password as string) : undefined
                    }
                    secureTextEntry={!showPass}
                    rightSlot={
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
                    }
                  />

                  <AnimatedGradientButton
                    title="Crear cuenta"
                    onPress={() => handleSubmit()}
                    active={canSubmit}
                    loading={isSubmitting}
/>


                  <Text style={styles.helperBelow}>
                    Al continuar aceptás nuestros términos y políticas.
                  </Text>
                </View>
              );
            }}
          </Formik>

          <Text style={styles.footerText}>
            ¿Ya tenés una cuenta?{" "}
            <Text
              onPress={() => router.replace("/")}
              accessibilityRole="link"
              style={styles.footerLink}
            >
              Iniciá sesión
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ────────── Input simple ────────── */
function InputField({
  theme,
  icon,
  rightSlot,
  error,
  style,
  ...props
}: {
  theme: DefaultTheme;
  icon: React.ComponentProps<typeof Feather>["name"];
  rightSlot?: React.ReactNode;
  error?: string;
} & React.ComponentProps<typeof TextInput>) {
  const styles = useMemo(() => getStyles(theme), [theme]);
  return (
    <View>
      <View
        style={[
          styles.inputWrapper,
          error && { borderColor: theme.colors.error },
        ]}
      >
        <Feather
          name={icon}
          size={18}
          color={error ? theme.colors.error : theme.colors.onSurfaceVariant}
          style={{ marginHorizontal: theme.spacing.sm }}
        />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          {...props}
        />
        {rightSlot ? <View style={styles.trailing}>{rightSlot}</View> : null}
      </View>
      {!!error && <Text style={styles.helperError}>{error}</Text>}
    </View>
  );
}

/* ────────── Estilos ────────── */
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
      color: theme.colors.onSurface,
      fontSize: theme.fontSizes.sm,
      letterSpacing: 0.15,
      paddingHorizontal: 8,
      height: "100%",
    },
    trailing: {
      paddingHorizontal: theme.spacing.sm,
      justifyContent: "center",
    },
    trailingBtn: { padding: 6, borderRadius: 999 },

    helperError: {
      color: theme.colors.error,
      fontSize: theme.fontSizes.xm,
      marginBottom: -theme.spacing.xm,
      marginLeft: theme.spacing.sm,
    },
    helperBelow: {
      color: theme.colors.onSurfaceVariant,
      fontSize: theme.fontSizes.xm,
      textAlign: "center",
      marginTop: theme.spacing.xm,
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
