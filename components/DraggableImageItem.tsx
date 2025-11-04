import { View, Image, Pressable, Alert } from "react-native";
import { Icon } from "../utils";

type DraggableImageItemProps = {
  item: string;
  onDelete: (uri: string) => void;
  drag: () => void;
  isActive: boolean;
};

export default function DraggableImageItem({ item, onDelete, drag, isActive }: DraggableImageItemProps) {
  const handleDelete = () => {
    Alert.alert(
      "Eliminar imagen",
      "¿Querés eliminar esta imagen?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onDelete(item),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ position: "relative", marginRight: 8 }}>
      {/* Imagen */}
      <Pressable onLongPress={drag} disabled={isActive}>
        <Image
          source={{ uri: item }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            opacity: isActive ? 0.8 : 1,
          }}
        />
      </Pressable>

      {/* Botón de eliminar */}
      <Pressable
        onPress={handleDelete}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: 12,
          padding: 4,
        }}>
        <Icon iconName="trash" color="#fff" size={14} />
      </Pressable>
    </View>
  );
}
