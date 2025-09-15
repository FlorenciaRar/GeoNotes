import React from "react";
import NoteForm from "../../components/NoteForm";
import { Note } from "../../utils/types";
import { Container } from "../../components/styled-components/StyledSafeAreaView";

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
