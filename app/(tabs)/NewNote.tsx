import NoteForm from "../../components/NoteForm";
import { Note } from "../../models/noteModel";
import { Container } from "../../styled-components/StyledSafeAreaView";

export default function NewNoteScreen() {
  const handleSubmit = (note: Omit<Note, "id">) => {
    console.log("Nueva nota:", note);
  };

  return (
    <Container>
      <NoteForm onSubmit={handleSubmit} />
    </Container>
  );
}
