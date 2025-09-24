import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { AppTheme } from "../../utils";
import { useTheme } from "../../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import { AUTH_ACTIONS, AuthContext } from "../../context/AuthContext";
import { setUser } from "../../utils/secure-store";

export default function Login() {
  const { state, dispatch } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const { themes } = useTheme();
  const styles = getStyles(themes);

  //Habilita el boton solo si ambos campos tienen contenido
  const canSubmit = email.length > 0 && pass.length > 0;

  const handleLogin = async (): Promise<void> => {
    if (!canSubmit) return;

    if (email === "test@gmail.com" && pass === "1234") {
      Alert.alert("Bienvenido " + email);

      //Guardar usuario en SecureStore
      const user = {
        id: "1",
        email: "test@gmail.com",
        name: "Gastón",
        surname: "Bordet",
        birthdate: "19-04-1990",
      };
      await setUser(user);

      dispatch({
        type: AUTH_ACTIONS.LOGIN,
        payload: {
          token: "TOKEN",
          refreshToken: "REFRESH_TOKEN",
          user: {
            id: "1",
            email: "test@gmail.com",
            name: "Gastón",
            surname: "Bordet",
            birthdate: "19-04-1990",
          },
        },
      });

      router.replace("/(tabs)");
    } else {
      Alert.alert("Credenciales incorrectas");
    }
  };

  return (
    // REVISAR KeyboardAvoidingView
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <Text style={styles.title}> Iniciar Sesion</Text>

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
        <Text style={{ marginTop: 20, color: themes.colors.onBackground }}>
          ¿No tenes cuenta?{" "}
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
    btnTextDisabled: { color: themes.colors.onSurfaceVariant },
  });
}
