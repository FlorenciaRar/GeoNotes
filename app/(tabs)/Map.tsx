import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Note } from "../../models/noteModel";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../src/firebase/config";
import * as Location from "expo-location";
import { Link, router } from "expo-router";

export default function Map() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      adress: data.adress,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
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
        console.log("Notas cargadas:", resultado);
        setNotes(resultado);
      } catch (e) {
        console.error("Error al obtener notas:", e);
      } finally {
        setLoading(false);
      }
    }

    cargarNotas();
  }, []);

  // Notificación simulada por proximidad (log temporal)
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      notes.forEach((note) => {
        const dist = Math.sqrt(
          Math.pow(note.latitude - loc.coords.latitude, 2) +
            Math.pow(note.longitude - loc.coords.longitude, 2)
        );
        if (dist < 0.0005) {
          console.log("Cerca de la nota:", note.title);
        }
      });
    })();
  }, [notes]);

  if (loading || notes.length === 0) return null;

  const first = notes[0];

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: first.latitude,
        longitude: first.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {notes.map((note) =>
        note.latitude && note.longitude ? (
          <Marker
            key={note.id}
            coordinate={{
              latitude: note.latitude,
              longitude: note.longitude,
            }}
          >
           <Callout>
            <TouchableOpacity onPress={() => router.push(`/notes/${note.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.link}>→ Ver nota</Text>
              </View>
            </TouchableOpacity>
          </Callout>
          </Marker>
        ) : null
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1, width: "100%", height: "100%" },
  callout: { width: 150, alignItems: "center" },
  title: { fontWeight: "bold", marginBottom: 4 },
  link: { color: "blue" },
});
