/* import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Formik } from "formik";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Note } from "../models/noteModel";
import { NoteSchema } from "../models/YupNoteSchema";

interface NoteFormProps {
  initialValues?: Partial<Note>;
  onSubmit: (note: Omit<Note, "id">) => void;
}

export default function NoteForm({ initialValues, onSubmit }: NoteFormProps) {
  const router = useRouter();

  const [location, setLocation] = useState<string>("");

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso de ubicación denegado");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});

    const { latitude, longitude } = loc.coords;

    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    const readableAddress = `${address.street ?? ""} ${address.name ?? ""}, ${
      address.city ?? ""
    }, ${address.region ?? ""}, ${address.country ?? ""}`;

    setLocation(readableAddress);
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]); //cambiar el tipado de esto
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [menuShown, setMenuShown] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedQuery.length > 2) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedQuery
          )}&format=json&addressdetails=1&limit=5&countrycodes=ar`;

          const response = await fetch(url, {
            headers: {
              "User-Agent": "tu-app/1.0 (tuemail@dominio.com)", // requerido por OSM
            },
          });
          const json = await response.json();
          setResults(json);
        } catch (err) {
          console.error(err);
        }
      } else {
        setResults([]);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  return (
    <Formik
      initialValues={{
        title: initialValues?.title ?? "",
        content: initialValues?.content ?? "",
        adress: initialValues?.adress ?? "",
      }}
      validationSchema={NoteSchema}
      onSubmit={(values) => {
        onSubmit({
          title: values.title,
          content: values.content,
          adress: values.adress,
          creationDate: initialValues?.creationDate ?? new Date().toISOString(),
        });
        router.push("/");
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View>
          <TextInput
            placeholder="Título"
            style={[styles.input, { fontSize: 20 }]}
            value={values.title}
            onChangeText={handleChange("title")}
            onBlur={handleBlur("title")}
          />
          {touched.title && errors.title && (
            <Text style={styles.error}>{errors.title}</Text>
          )}

          <TextInput
            placeholder="Contenido"
            style={[styles.input]}
            value={values.content}
            onChangeText={handleChange("content")}
            onBlur={handleBlur("content")}
            multiline
          />
          {touched.content && errors.content && (
            <Text style={styles.error}>{errors.content}</Text>
          )}

          <View>
            <TextInput
              placeholder="Buscar dirección..."
              value={values.adress}
              onChangeText={(text) => {
                setFieldValue("adress", text);
                setQuery(text);
              }}
              onPress={() => setMenuShown(true)}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
            />
            {touched.adress && errors.adress && (
              <Text style={styles.error}>{errors.adress}</Text>
            )}
            {menuShown && (
              <View>
                <Pressable
                  onPress={async () => {
                    await getCurrentLocation();
                    setFieldValue("adress", location);
                    setMenuShown(false);
                  }}>
                  <Text>Usar ubicación actual</Text>
                </Pressable>
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setFieldValue("adress", item.display_name);
                        console.log("Seleccionado:", item.display_name);
                        console.log("Coords:", item.lat, item.lon);
                        setMenuShown(false);
                      }}>
                      <Text style={{ padding: 10 }}>{item.display_name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
          <Button title="Guardar" onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontSize: 16,
  },
  error: { color: "red", fontSize: 12, marginTop: 0, marginBottom: 8 },
  radioContainer: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 8,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "red",
  },
});
 */