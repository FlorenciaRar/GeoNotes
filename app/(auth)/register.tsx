import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";

export default function Register() {
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
      onSubmit={(values) => {
        Alert.alert(
          "¡Cuenta creada!",
          `Bienvenido ${values.name} ${values.surname}`,
          [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
        );
      }}
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
          <Text style={styles.title}> Crear Cuenta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
          />
          {errors.name && touched.name && (
            <Text style={{ color: "red" }}>{errors.name}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={values.surname}
            onChangeText={handleChange("surname")}
            onBlur={handleBlur("surname")}
          />
          {errors.surname && touched.surname && (
            <Text style={{ color: "red" }}>{errors.surname}</Text>
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
            <Text style={{ color: "red" }}>{errors.birthdate}</Text>
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
            <Text style={{ color: "red" }}>{errors.email}</Text>
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
            <Text style={{ color: "red" }}>{errors.password}</Text>
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
              !values.password
            }
          >
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
          </Pressable>

          <Text style={{ marginTop: 20 }}>
            ¿Ya tenes una cuenta?{" "}
            <Text
              onPress={() => router.replace("/")}
              accessibilityRole="link"
              style={{
                color: "#007AFF",
                fontWeight: "bold",
                textDecorationLine: "none",
              }}
            >
              Inicia sesion
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
  btn: {
    backgroundColor: "#007AFF",
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
    backgroundColor: "#bdbdbd",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  btnTextDisabled: { color: "#f0f0f0" },
});
