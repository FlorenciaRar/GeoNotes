// Layout.tsx
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
  const { dispatch, state } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true); // carga inicial
  const [isSignedIn, setIsSignedIn] = useState(false); // usuario logueado

  useEffect(() => {
    const loadUser = async () => {
      console.log("🚀 Checking user in SecureStore...");
      const user = await getUser();
      console.log("🔹 getUser returned:", user);

      if (user) {
        dispatch({ type: AUTH_ACTIONS.LOGIN, payload: { user } });
        console.log("✅ Dispatch LOGIN with user:", user);
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }

      setIsLoading(false); // ya terminamos de cargar
    };

    loadUser();
  }, []);

  if (isLoading) {
    // opcional: splash screen o loading
    return null;
  }

  return (
    <ThemeProvider theme={themes}>
      <MenuProvider>
        <Stack
          initialRouteName={isSignedIn ? "(tabs)" : "(auth)"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
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
