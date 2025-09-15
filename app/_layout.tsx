import React from "react";
import { Slot, Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { theme } from "../utils/theme";

export default function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
