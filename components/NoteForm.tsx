import { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet, Pressable, TouchableOpacity, FlatList } from "react-native";
import { Formik } from "formik";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Note, NoteSchema } from "../models/";
import { useTheme } from "../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import { StyledText } from "../styled-components";

interface NoteFormProps {
  initialValues?: Partial<Note>;
  onSubmit: (note: Omit<Note, "id">) => void;
}

export default function NoteForm({ initialValues, onSubmit }: NoteFormProps) {
  const { themes } = useTheme();
  const styles = getStyles(themes);
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
    const readableAddress = `${address.street ?? ""} ${address.name ?? ""}, ${address.city ?? ""}, ${address.region ?? ""}, ${address.country ?? ""}`;

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
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <View>
          <View>
            <TextInput
              placeholder="Buscar una dirección..."
              placeholderTextColor={themes.colors.onSurfaceVariant}
              value={values.adress}
              onChangeText={(text) => {
                setFieldValue("adress", text);
                setQuery(text);
              }}
              onPress={() => setMenuShown(true)}
              style={styles.locationInput}
            />
            {touched.adress && errors.adress && <Text style={styles.error}>{errors.adress}</Text>}
            {menuShown && (
              <View style={styles.menuContainer}>
                <Pressable
                  onPress={async () => {
                    await getCurrentLocation();
                    setFieldValue("adress", location);
                    setMenuShown(false);
                  }}>
                  <StyledText size="xm" color="onSurface">
                    Usar ubicación actual
                  </StyledText>
                </Pressable>
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.menuAddressOption}
                      onPress={() => {
                        setFieldValue("adress", item.display_name);
                        setMenuShown(false);
                      }}>
                      <StyledText size="xm" color="onSurface" numberOfLines={2}>
                        {item.display_name}
                      </StyledText>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>
          <TextInput
            placeholder="Título"
            placeholderTextColor={themes.colors.onSurfaceVariant}
            style={[styles.input, { fontSize: 20 }]}
            value={values.title}
            onChangeText={handleChange("title")}
            onBlur={handleBlur("title")}
          />
          {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

          <TextInput
            placeholder="Contenido"
            placeholderTextColor={themes.colors.onSurfaceVariant}
            style={styles.input}
            value={values.content}
            onChangeText={handleChange("content")}
            onBlur={handleBlur("content")}
            multiline
          />
          {touched.content && errors.content && <Text style={styles.error}>{errors.content}</Text>}

          <Button title="Guardar" onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
}

function getStyles(themes: DefaultTheme) {
  return StyleSheet.create({
    input: {
      color: themes.colors.onBackground,
      borderWidth: 0,
      paddingVertical: 8,
      paddingHorizontal: 0,
      fontSize: themes.fontSizes.sm,
    },
    locationInput: {
      backgroundColor: themes.colors.surface,
      borderRadius: 60,
      paddingHorizontal: themes.spacing.lg,
      color: themes.colors.onSurface,
    },
    error: {
      color: themes.colors.error,
      fontSize: themes.fontSizes.xm,
      marginTop: 0,
      marginBottom: 8,
    },
    menuContainer: {
      position: "absolute",
      maxHeight: 200,
      width: "100%",
      top: 52,
      zIndex: 1,
      backgroundColor: themes.colors.surface,
      padding: themes.spacing.md,
      borderRadius: 16,
    },
    menuAddressOption: {
      marginTop: themes.spacing.md,
      paddingTop: themes.spacing.md,
      borderTopWidth: 1,
      borderTopColor: themes.colors.outline,
    },
  });
}
