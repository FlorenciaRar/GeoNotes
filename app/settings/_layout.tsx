import { Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "../../utils/icons";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Personalización",
        headerBackButtonDisplayMode: "default",
        // Si por alguna razón el back nativo no aparece, renderizamos
        // un `headerLeft` simple que permite volver atrás.
        headerLeft: () =>
          navigation.canGoBack() ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 12 }}
              accessibilityLabel="Volver"
            >
              <Icon iconName="back" size={22} color={"black"} />
            </TouchableOpacity>
          ) : undefined,
      })}
    />
  );
}
