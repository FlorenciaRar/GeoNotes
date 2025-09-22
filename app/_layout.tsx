import { useContext, useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { MenuProvider } from "react-native-popup-menu";
import {
  ThemeContextProvider,
  useTheme,
} from "../context/ThemeContextProvider";
import {
  AUTH_ACTIONS,
  AuthContext,
  AuthProvider,
} from "../context/AuthContext";
import { getUser } from "../utils/secure-store";

function InnerLayout() {
  const { themes } = useTheme();
  const { dispatch, state } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();

      if (user) {
        dispatch({ type: AUTH_ACTIONS.LOGIN, payload: { user } });
      }

      setIsLoading(false);

      // Forzamos navegación luego de cargar el usuario persistido.
      // Esto evita la condición de carrera donde Expo Router decide la
      // ruta inicial antes de que el estado de auth se actualice.
      try {
        // Evitar reemplazos redundantes que generan un loop:
        // comprobamos el primer segmento actual antes de hacer replace.
        const currentRoot =
          segments && segments.length > 0 ? segments[0] : null;
        if (user) {
          if (currentRoot !== "(tabs)") {
            router.replace("/(tabs)");
          } else {
          }
        } else {
          if (currentRoot !== "(auth)") {
            router.replace("/(auth)");
          } else {
          }
        }
      } catch (err) {}
    };

    loadUser();
  }, []);

  if (isLoading) return null; // opcional: splash screen o loader

  return (
    <ThemeProvider theme={themes}>
      <MenuProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {state.user ? (
            // Si hay usuario logueado, renderizamos las tabs
            <Stack.Screen name="(tabs)" />
          ) : (
            // Si no hay usuario, renderizamos auth
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
      </MenuProvider>
    </ThemeProvider>
  );
}

export default function Layout() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </ThemeContextProvider>
  );
}
