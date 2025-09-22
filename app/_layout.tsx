//Segun se puede ver con los log en consola, el usuario si persiste al cerrar la app y abrirla
//El problema esta en no esta reconociendo que el usuario ya esta logueado hacia (tabs) y lo redirige a (auth)
//Probablemente el problema este en el useEffect que carga el usuario desde SecureStore, no se si es un tema de asincronismo o que
//El useEffect se ejecuta despues de que se decide la ruta inicial y por eso siempre va a (auth) y nunca a (tabs)
//Tambien puede ser que el getUser no este funcionando bien, pero los log indican que si encuentra el usuario guardado
import React, { useContext, useEffect, useState } from "react";
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
      console.log("🚀 Checking user in SecureStore...");
      const user = await getUser();
      console.log("🔹 getUser returned:", user);

      if (user) {
        dispatch({ type: AUTH_ACTIONS.LOGIN, payload: { user } });
        console.log("✅ Dispatch LOGIN with user:", user);
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
            console.log("Already in (tabs), no replace needed");
          }
        } else {
          if (currentRoot !== "(auth)") {
            router.replace("/(auth)");
          } else {
            console.log("Already in (auth), no replace needed");
          }
        }
      } catch (err) {
        console.log("Router replace error:", err);
      }
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
