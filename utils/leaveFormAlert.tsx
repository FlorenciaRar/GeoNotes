import { Alert } from "react-native";

export const leaveFormAlert = () => {
  Alert.alert(
    "Confirm Action",
    "Are you sure you want to proceed?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ],
    { cancelable: false }
  );
};
