import { View, FlatList, Alert, ActivityIndicator } from "react-native";
import NoteCardItem from "./NoteCardItem";
import { StyledText } from "../styled-components";
import { useNotes } from "../hooks/useNotes";
import { useTheme } from "../context/ThemeContextProvider";

interface NotesCardContainerProps {
  maxItems?: number;
}

export default function NotesCardContainer({ maxItems }: NotesCardContainerProps) {
  const { themes } = useTheme();
  const { notes, loading, error, deleteNote } = useNotes();

  const handleDelete = (id: string) => {
    Alert.alert("Borrar nota", "¿Estás seguro de que querés borrar esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteNote(id);
          } catch (err) {
            console.error("Error al borrar nota:", err);
            Alert.alert("Error", "No se pudo borrar la nota");
          }
        },
      },
    ]);
  };

  const notesToRender = maxItems ? notes.slice(0, maxItems) : notes;

  const EmptySearch = () => {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={themes.colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={{ padding: 20 }}>
          <StyledText color="error">{error}</StyledText>
        </View>
      );
    }

    if (notesToRender.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <StyledText>No hay notas creadas</StyledText>
        </View>
      );
    }
  };
  return <FlatList data={notesToRender} keyExtractor={(item) => item.id} ListEmptyComponent={EmptySearch} renderItem={({ item }) => <NoteCardItem data={item} onDelete={handleDelete} />} />;
}
