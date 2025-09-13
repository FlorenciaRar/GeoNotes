import { Tabs } from "expo-router";
import Icon from "../../utils/icons";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#00000088",
      }}>
      <Tabs.Screen name="index" options={{ title: "", tabBarIcon: ({ color }) => <Icon iconName="home" color={color} /> }} />
      <Tabs.Screen name="Notes" options={{ title: "", tabBarIcon: ({ color }) => <Icon iconName="note" color={color} /> }} />
      <Tabs.Screen
        name="CreateNote"
        options={{
          title: "",
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
      <Tabs.Screen name="Map" options={{ title: "", tabBarIcon: ({ color }) => <Icon iconName="map" color={color} /> }} />
      <Tabs.Screen name="Settings" options={{ title: "", tabBarIcon: ({ color }) => <Icon iconName="settings" color={color} /> }} />
    </Tabs>
  );
}
