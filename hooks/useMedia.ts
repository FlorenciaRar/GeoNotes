import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ImageModel } from "../models";

export default function useMedia() {
  const [images, setImages] = useState<ImageModel[]>([]);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se necesitan permisos para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 0,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => [
        ...prev,
        ...result.assets.map((a) => ({
          url: a.uri,
          deleteUrl: "",
        })),
      ]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Se necesitan permisos para usar la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

    if (!result.canceled) {
      setImages((prev) => [...prev, { url: result.assets[0].uri, deleteUrl: "" }]);
    }
  };

  return { images, setImages, pickFromGallery, takePhoto };
}
