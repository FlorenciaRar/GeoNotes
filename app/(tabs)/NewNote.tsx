import Loader from "../../components/Loader";
import NoteForm from "../../components/NoteForm";
import { useNotes } from "../../hooks/useNotes";
import { Note } from "../../models/noteModel";
import { Container } from "../../styled-components/StyledSafeAreaView";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export default function NewNoteScreen() {
  const navigation = useNavigation();
  const { addNote, loading, error } = useNotes();

  const handleSubmit = async (note: Omit<Note, "id" | "creationDate" | "modificationDate" | "userId">) => {
    await addNote(note);
  };

  return (
    <Container>
      <NoteForm onSubmit={handleSubmit} />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </Container>
  );
}
