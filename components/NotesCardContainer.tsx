import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import NoteCardItem from "./NoteCardItem";
import { Note } from "../models/noteModel";
import { StyledText } from "../styled-components";
// import { initialNotes } from "../mocks/notes";
import { db } from "../src/firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

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

  function mapearDocANota(doc: any): Note {
    const data = doc.data();
    const creation = data.creationDate?.toDate
      ? data.creationDate.toDate()
      : new Date(data.creationDate);
    const modification = data.modificationDate?.toDate
      ? data.modificationDate.toDate()
      : new Date(data.modificationDate);

    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      adress: data.adress, // aca tendriamos que modificar a address
      latitude: data.latitude,
      longitude: data.longitude,
      creationDate: creation.toISOString(),
      modificationDate: modification.toISOString(),
    };
  }

  useEffect(() => {
    async function cargarNotas() {
      try {
        const q = query(
          collection(db, "notas"),
          orderBy("modificationDate", "desc")
        );
        const snap = await getDocs(q);
        const resultado = snap.docs.map((d) => mapearDocANota(d));
        setNotes(resultado);
      } catch (e) {
        console.error("Error al obtener notas:", e);
      } finally {
        setLoading(false);
      }
    }

    cargarNotas();
  }, []);

  return (
    <View>
      {loading && <StyledText>Cargando</StyledText>}
      {!loading && notes.length > 0 ? (
        <FlatList
          data={maxNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCardItem data={item} onDelete={handleDelete} />
          )}
        />
      ) : (
        <StyledText>No hay notas creadas</StyledText>
      )}
    </View>
  );
}
