import { useContext, useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { MenuProvider } from "react-native-popup-menu";
import {
  ThemeContextProvider,
  useTheme,
} from "../context/ThemeContextProvider";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import Loader from "../components/Loader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
import { NotificationManager } from "../utils/NotificationManager";
// import { useNotificationInit } from '../hooks/useNotificationInit'

// Ignorar warnings específicos
LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications (remote notifications)",
]);

function InnerLayout() {
  const { themes } = useTheme();
  const { state } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const currentRoot = segments && segments.length > 0 ? segments[0] : null;

    if (!state.isLoading) {
      if (state.user) {
        // Usuario logueado
        if (currentRoot !== "(tabs)") router.replace("/(tabs)");
      } else {
        // Usuario no logueado
        if (currentRoot !== "(auth)") router.replace("/(auth)");
      }
    }
  }, [state.user, state.isLoading]);

  if (state.isLoading && !state.user) return <Loader visible />;

  return (
    <NotificationManager>
      <ThemeProvider theme={themes}>
        <MenuProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              {state.user ? (
                <Stack.Screen name="(tabs)" />
              ) : (
                <Stack.Screen name="(auth)" />
              )}
              <Stack.Screen name="settings" />
            </Stack>
          </GestureHandlerRootView>
        </MenuProvider>
      </ThemeProvider>
    </NotificationManager>
  );
}

export default function Layout() {
  // useNotificationInit();
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </ThemeContextProvider>
  );
}
