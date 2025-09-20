import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import NoteCardItem from "./NoteCardItem";
import { Note } from "../models/noteModel";

interface NotesCardContainerProps {
  maxItems?: number;
}

export default function NotesCardContainer({ maxItems }: NotesCardContainerProps) {
  const [notes, setNotes] = useState<Note[]>([]);

  const maxNotes = maxItems ? notes.slice(0, maxItems) : notes;

  const handleDelete = (id: string) => {
    console.log("Borrar nota:", id);
  };

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
    {
      id: "2dasd456ad48awMODASIODFOAPIO9d1ad98q",
      creationDate: "25:05:2026",
      title: "Nota 2",
      adress: "Calle falsa 124",
      content: "Contenido de la nota 2",
    },
    {
      id: "2dasd456adDA<EW90RFW9F48aw9d1ad98q",
      creationDate: "25:05:2026",
      title: "Nota 2",
      adress: "Calle falsa 124",
      content: "Contenido de la nota 2",
    },
    {
      id: "2dasd456ad4BSCV<NIOWE8R928aw9d1ad98q",
      creationDate: "25:05:2026",
      title: "Nota 2",
      adress: "Calle falsa 124",
      content: "Contenido de la nota 2",
    },
    {
      id: "dadeqwadqWDqeDW",
      creationDate: "25:05:2026",
      title: "Nota 2",
      adress: "Calle falsa 124",
      content: "Contenido de la nota 2",
    },
    {
      id: "dadeqwadqWDqeDWfsdfsdf",
      creationDate: "25:05:2026",
      title: "Nota 2",
      adress: "Calle falsa 124",
      content: "Contenido de la nota 2",
    },
    {
      id: "dadeqwadqWDqeDWfsdffsdfsdfsdf",
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
      <FlatList data={maxNotes} keyExtractor={(item) => item.id} renderItem={({ item }) => <NoteCardItem data={item} onDelete={handleDelete} />} />
    </View>
  );
}
