import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import NoteForm from "../../components/NoteForm";
import { Note } from "../../models/noteModel";
import { Container } from "../../styled-components";

export default function EditNote() {
  const { NoteId } = useLocalSearchParams<{ NoteId: string }>();

  const mockNote = {
    id: "2dasd456ad48aw9d1ad98q",
    creationDate: "25:05:2026",
    title: "Nota 2",
    adress: "Calle falsa 124",
    content: "Contenido de la nota 2",
  };

  const handleSubmit = (updatedNote: Partial<Note>) => {
    console.log("Actualizar nota:", NoteId, updatedNote);
  };

  return (
    <Container>
      <Text>Editando: {NoteId}</Text>
      <NoteForm initialValues={mockNote} onSubmit={handleSubmit} />
    </Container>
  );
}
