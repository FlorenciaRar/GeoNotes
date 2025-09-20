import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { MenuProvider } from "react-native-popup-menu";
import { ThemeContextProvider, useTheme } from "../context/ThemeContextProvider";

function InnerLayout() {
  const { themes } = useTheme();

  return (
    <ThemeProvider theme={themes}>
      <MenuProvider>
        <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </MenuProvider>
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
