import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { theme } from "../utils/theme"; // ← tu theme fijo
import {
  ThemeContextProvider,
  useTheme,
} from "../context/ThemeContextProvider";

function InnerLayout() {
  const { themes } = useTheme(); // ← viene del contexto

  return (
    <ThemeProvider theme={theme}>
      <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function Layout() {
  return (
    <ThemeContextProvider>
      <InnerLayout />
    </ThemeContextProvider>
  );
}
