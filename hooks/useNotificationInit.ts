import { useEffect } from "react";
import { AppState } from "react-native";
import { initializeNotifications } from "../utils/NotificationManager"; // o donde esté

export function useNotificationInit() {
  useEffect(() => {
    let currentState = AppState.currentState;

    const sub = AppState.addEventListener("change", async nextState => {
      if (currentState.match(/inactive|background/) && nextState === "active") {
        await initializeNotifications();
      }
      currentState = nextState;
    });

    initializeNotifications();

    return () => sub.remove();
  }, []);
}
