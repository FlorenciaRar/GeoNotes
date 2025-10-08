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

      try {
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

  if (isLoading) return null;

  return (
    <ThemeProvider theme={themes}>
      <MenuProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {state.user ? (
            <Stack.Screen name="(tabs)" />
          ) : (
            <Stack.Screen name="(auth)" />
          )}
          <Stack.Screen name="notes/[NoteId]" options={{ headerShown: true }} />

          {/* Se agrega para evitar el WARN de "Route 'select-theme' is extraneous"*/}
          {/* Como estamos usando Stack con childrens (modo explicito) deberiamos definir las rutas aca y settings no estaba */}
          <Stack.Screen name="settings" />
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
