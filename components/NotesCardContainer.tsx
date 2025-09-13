import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NoteCardItem from "./NoteCardItem";
import { Note } from "../utils/types";

export default function NotesCardContainer() {
  const [notes, setNotes] = useState<Note[]>([]);

  const initialNotes = [
    { id: "1sdasdad256d+adqawreq4", creationDate: "25:05:2026", title: "Nota 1", content: "Contenido de la nota 1" },
    { id: "2dasd456ad48aw9d1ad98q", creationDate: "25:05:2026", title: "Nota 2", content: "Contenido de la nota 2" },
  ];
  useEffect(() => {
    setNotes(initialNotes);
  }, []);

  return (
    <View>
      {notes.map((note) => (
        <NoteCardItem key={note.id} data={note}></NoteCardItem>
      ))}
    </View>
  );
}
