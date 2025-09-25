import { Tabs } from "expo-router";
import Icon from "../../utils/icons";
import { useTheme } from "../../context/ThemeContextProvider";

export default function TabsLayout() {
  const { themes } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: `${themes.colors.surface}`,
        },
        headerTintColor: `${themes.colors.onSurface}`,
        tabBarActiveTintColor: `${themes.colors.onSurface}`,
        tabBarInactiveTintColor: `${themes.colors.onSurface}88`,
        headerBackButtonDisplayMode: "default",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: `${themes.colors.surface}`,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Icon iconName="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Notes"
        options={{
          title: "Todas las notas",
          tabBarIcon: ({ color }) => <Icon iconName="note" color={color} />,
        }}
      />
      <Tabs.Screen
        name="NewNote"
        options={{
          title: "Nueva nota",
          tabBarIcon: () => <Icon iconName="plus" color={`${themes.colors.onPrimary}`} />,
          tabBarIconStyle: {
            backgroundColor: `${themes.colors.primary}`,
            borderRadius: 60,
            position: "absolute",
            width: 60,
            height: 60,
            bottom: 16,
          },
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color }) => <Icon iconName="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Configuración",
          tabBarIcon: ({ color }) => <Icon iconName="settings" color={color} />,
        }}
      />
      <Tabs.Screen
        name="select-theme"
        options={{
          title: "Seleccionar Tema",
        }}
      />
    </Tabs>
  );
}
