import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import Icon from "../../utils/icons";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: "Personalización",
        headerBackButtonDisplayMode: "default",
        headerLeft: () =>
          navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Volver">
              <Icon iconName="back" size={22} color={"black"} />
            </TouchableOpacity>
          ) : undefined,
      })}
    />
  );
}
