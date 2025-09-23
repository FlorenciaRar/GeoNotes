import { Tabs } from "expo-router";
import Icon from "../../utils/icons";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#00000088",
        headerBackButtonDisplayMode: "default",
        tabBarShowLabel: false,
      }}
    >
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
          title: "Crear una nueva nota",
          tabBarIcon: ({ color }) => <Icon iconName="plus" color={"white"} />,
          tabBarIconStyle: {
            backgroundColor: "black",
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
