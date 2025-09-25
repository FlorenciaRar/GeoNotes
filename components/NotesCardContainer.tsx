/* import { useEffect, useState } from "react";
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
 */

import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import NoteCardItem from "./NoteCardItem";
import { Note } from "../models/noteModel";
import Map from "../app/(tabs)/Map"; // importa tu Map
import { Container } from "../styled-components/StyledSafeAreaView";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";

interface NotesCardContainerProps {
  maxItems?: number;
}

export default function NotesCardContainer({ maxItems }: NotesCardContainerProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  
  const maxNotes = maxItems ? notes.slice(0, maxItems) : notes;


  const handleDelete = (id: string) => {
    console.log("Borrar nota:", id);
  };

  const initialNotes: Note[] = [
    {
      id: "1sdasdad256d+adqawreq4",
      creationDate: "25:05:2026",
      title: "Nota 1",
      adress: "Calle falsa 123",
      latitude: -34.6037,
      longitude: -58.3816,
      content: "Contenido de la nota 1",
    },
    {
      id: "2dasd456ad48aw9d1ad98q",
      creationDate: "25:05:2026",
      title: "Nota 2",
      adress: "Calle falsa 124",
      latitude: -34.6090,
      longitude: -58.3840,
      content: "Contenido de la nota 2",
    },
    // ... agrega las demás con coords
  ];

  useEffect(() => {
    setNotes(initialNotes);
  }, []);

  return (
    <View>
      {/* Lista de notas */}
      <FlatList
        data={maxNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCardItem data={item} onDelete={handleDelete} />
        )}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});