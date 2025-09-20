import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit =
    name.length > 0 &&
    surname.length > 0 &&
    email.length > 0 &&
    password.length > 0;

  const handleRegister = () => {
    //Validaciones de correo y contraseñas
    if (!email.includes("@") || password.length < 4) {
      Alert.alert(
        "Por favor, ingresa un email válido y una contraseña de al menos 4 caracteres."
      );
      return;
    }

    //Simulacion de envio de datos
    const data = { name, surname, email, password };
    console.log(data);

    Alert.alert("¡Cuenta creada!", `Bienvenido ${name} ${surname}`, [
      {
        text: "OK",
        onPress: () => router.replace("/"), //Se ejecuta solo al precionar el OK
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Crear Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (DD/MM/YYYY)"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        keyboardType="numeric"
        onChangeText={setPassword}
      />
      <Pressable
        style={[styles.btn, !canSubmit && styles.btnDisabled]}
        onPress={handleRegister}
        disabled={!canSubmit}
      >
        <Text style={[styles.btnText, !canSubmit && styles.btnTextDisabled]}>
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
    backgroundColor: "#bdbdbd", // gris cuando está deshabilitado
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  btnTextDisabled: { color: "#f0f0f0" },
});
