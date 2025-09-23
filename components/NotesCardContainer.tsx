import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import NoteCardItem from "./NoteCardItem";
import { Note } from "../models/noteModel";
import { StyledText } from "../styled-components";
import { initialNotes } from "../mocks/notes";

interface NotesCardContainerProps {
  maxItems?: number;
}

export default function NotesCardContainer({ maxItems }: NotesCardContainerProps) {
  const [loading, setLoading] = useState<Boolean>(true);
  const [notes, setNotes] = useState<Note[]>([]);

  const maxNotes = maxItems ? notes.slice(0, maxItems) : notes;

  const handleDelete = (id: string) => {
    console.log("Borrar nota:", id);
  };

  useEffect(() => {
    setNotes(initialNotes);
    setLoading(false);
  }, []);

  return (
    <View>
      {loading && <StyledText>Cargando</StyledText>}
      {!loading && notes.length > 0 ? (
        <FlatList data={maxNotes} keyExtractor={(item) => item.id} renderItem={({ item }) => <NoteCardItem data={item} onDelete={handleDelete} />} />
      ) : (
        <StyledText>No hay notas creadas</StyledText>
      )}
    </View>
  );
}
