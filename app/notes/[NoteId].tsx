import { Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import NoteForm from "../../components/NoteForm";
import { Note } from "../../models/noteModel";
import { Container } from "../../styled-components";
import { useTheme } from "../../context/ThemeContextProvider";
import { initialNotes } from "../../mocks/notes";

export default function EditNote() {
  const { NoteId } = useLocalSearchParams<{ NoteId: string }>();

  const { themes } = useTheme();

  const selectedNote = initialNotes.find((note) => note.id === NoteId);

  const handleSubmit = (updatedNote: Partial<Note>) => {
    console.log("Actualizar nota:", NoteId, updatedNote);
  };

  return (
    <Container>
      {!selectedNote ? (
        <Text>No se encontró la nota</Text>
      ) : (
        <>
          <Stack.Screen
            options={{
              title: `${selectedNote.title}`,
              headerShown: true,
              headerStyle: {
                backgroundColor: `${themes.colors.surface}`,
              },
              headerTintColor: `${themes.colors.onSurface}`,
              headerBackButtonDisplayMode: "default",
            }}
          />
          <NoteForm initialValues={selectedNote} onSubmit={handleSubmit} />
        </>
      )}
    </Container>
  );
}
