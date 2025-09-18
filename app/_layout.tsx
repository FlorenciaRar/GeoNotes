import React from "react";
import { Slot, Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { theme } from "../utils/theme";
import { MenuProvider } from "react-native-popup-menu";

export default function Layout() {
  return (
    <MenuProvider>
      <ThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </MenuProvider>
  );
}
