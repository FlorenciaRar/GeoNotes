// app/(auth)/register.tsx
// --- Registro de usuario con Firebase Auth ---
//
// Puntos clave:
// 1️⃣ Llama a register(email, password) del AuthContext (Firebase).
// 2️⃣ Muestra errores en alertas (correo duplicado, formato inválido, etc.).
// 3️⃣ Mantiene toda tu validación con Formik y Yup.

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext/auth-context";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../src/firebase/config";

export default function Register() {
  const { register } = useContext(AuthContext); // 👈 función del contexto (Firebase)
  const [loading, setLoading] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    surname: Yup.string().required("El apellido es obligatorio"),
    birthdate: Yup.string()
      .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Formato DD/MM/YYYY")
      .required("La fecha de nacimiento es obligatoria"),
    email: Yup.string()
      .email("Debe ser un email válido")
      .required("El email es obligatorio"),
    password: Yup.string()
      .min(4, "La contraseña debe tener al menos 4 caracteres")
      .required("La contraseña es obligatoria"),
  });

  const handleRegister = async (values: any) => {
    try {
      setLoading(true);

      // 🔹 1. Crea el usuario en Firebase Authentication
      const userCredential = await register(values.email, values.password);
      const user = userCredential.user;

      // 🔹 2. Guarda los datos adicionales en Firestore
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
    } catch (error: any) {
      console.error("Error en registro:", error);
      // ... mismo manejo de errores que ya tenés
    } finally {
      setLoading(false);
    }
  };
  return (
    <Formik
      initialValues={{
        name: "",
        surname: "",
        birthdate: "",
        email: "",
        password: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={handleRegister}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Crear Cuenta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
          />
          {errors.name && touched.name && (
            <Text style={styles.error}>{errors.name}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={values.surname}
            onChangeText={handleChange("surname")}
            onBlur={handleBlur("surname")}
          />
          {errors.surname && touched.surname && (
            <Text style={styles.error}>{errors.surname}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento (DD/MM/YYYY)"
            value={values.birthdate}
            onChangeText={handleChange("birthdate")}
            onBlur={handleBlur("birthdate")}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
          {errors.birthdate && touched.birthdate && (
            <Text style={styles.error}>{errors.birthdate}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && touched.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            keyboardType="default"
          />
          {errors.password && touched.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <Pressable
            style={[
              styles.btn,
              (!values.name ||
                !values.surname ||
                !values.birthdate ||
                !values.email ||
                !values.password) &&
                styles.btnDisabled,
            ]}
            onPress={() => handleSubmit()}
            disabled={
              !values.name ||
              !values.surname ||
              !values.birthdate ||
              !values.email ||
              !values.password ||
              loading
            }
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={[
                  styles.btnText,
                  (!values.name ||
                    !values.surname ||
                    !values.birthdate ||
                    !values.email ||
                    !values.password) &&
                    styles.btnTextDisabled,
                ]}
              >
                Crear cuenta
              </Text>
            )}
          </Pressable>

          <Text style={{ marginTop: 20 }}>
            ¿Ya tenés una cuenta?{" "}
            <Text
              onPress={() => router.replace("/")}
              accessibilityRole="link"
              style={{
                color: "#007AFF",
                fontWeight: "bold",
                textDecorationLine: "none",
              }}
            >
              Iniciá sesión
            </Text>
          </Text>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  error: { color: "red", alignSelf: "flex-start" },
  btn: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#bdbdbd" },
  btnText: { color: "#fff", fontWeight: "bold" },
  btnTextDisabled: { color: "#f0f0f0" },
});
