import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import NoteCardItem from "./NoteCardItem";
import { Note } from "../utils/types";

export default function NotesCardContainer() {
  const [notes, setNotes] = useState<Note[]>([]);

  const initialNotes = [
    {
      id: "1sdasdad256d+adqawreq4",
      creationDate: "25:05:2026",
      title: "Nota 1",
      adress: "Calle falsa 123",
      content: "Contenido de la nota 1",
    },
    {
      id: "2dasd456ad48aw9d1ad98q",
      creationDate: "25:05:2026",
      title: "Nota 2",
      adress: "Calle falsa 124",
      content: "Contenido de la nota 2",
    },
  ];
  useEffect(() => {
    setNotes(initialNotes);
  }, []);

  return (
    <View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCardItem data={item} />}
      />
    </View>
  );
}
