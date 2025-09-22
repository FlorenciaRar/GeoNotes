//Segun se puede ver con los log en consola, el usuario si persiste al cerrar la app y abrirla
//El problema esta en no esta reconociendo que el usuario ya esta logueado hacia (tabs) y lo redirige a (auth)
//Probablemente el problema este en el useEffect que carga el usuario desde SecureStore, no se si es un tema de asincronismo o que
//El useEffect se ejecuta despues de que se decide la ruta inicial y por eso siempre va a (auth) y nunca a (tabs)
//Tambien puede ser que el getUser no este funcionando bien, pero los log indican que si encuentra el usuario guardado
import React, { useContext, useEffect, useState } from "react";
import { Stack } from "expo-router";
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
  const { state, dispatch } = useContext(AuthContext);

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

      setIsLoading(false); // Ya sabemos si hay usuario o no
    };

    loadUser();
  }, []);

  // Mientras cargamos el usuario, renderizamos null o un splash
  if (isLoading) return null;

  // Ahora renderizamos el Stack según si hay usuario
  return (
    <ThemeProvider theme={themes}>
      <MenuProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {state.user ? (
            <Stack.Screen name="(tabs)" />
          ) : (
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
