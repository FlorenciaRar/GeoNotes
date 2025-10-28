// src/types/firebase-react-native.d.ts
import "firebase/auth";

// Firebase 12 no exporta correctamente los tipos de getReactNativePersistence
declare module "firebase/auth" {
  export function getReactNativePersistence(storage: any): any;
}
