import { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet, Pressable, TouchableOpacity, FlatList } from "react-native";
import { Formik } from "formik";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { Note, NoteSchema } from "../models/";
import { useTheme } from "../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import { StyledText } from "../styled-components";
import { Icon } from "../utils";

interface NoteFormProps {
  initialValues?: Partial<Note>;
  onSubmit: (note: Omit<Note, "id">) => void;
}

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export default function NoteForm({ initialValues, onSubmit }: NoteFormProps) {
  const { themes } = useTheme();
  const styles = getStyles(themes);
  const router = useRouter();

  const [location, setLocation] = useState<LocationData | null>(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso de ubicación denegado");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const { latitude, longitude } = location.coords;

    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    const finalAddress = `${address.street ?? ""} ${address.name ?? ""}, ${address.city ?? ""}, ${address.region ?? ""}, ${address.country ?? ""}`;

    setLocation({
      address: finalAddress,
      latitude,
      longitude,
    });
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

  const [searchText, setSearchText] = useState("");

  const fetchAddress = async () => {
    if (!searchText.trim().length) {
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?q=${searchText}&format=json&addressdetails=1&limit=5&countrycodes=ar`;

    try {
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "tu-app/1.0 (tuemail@dominio.com)", // requerido por OSM
        },
      });
      const json = await resp.json();
      // setResults(json);
      console.log("resultados" + json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   if (debouncedQuery.length > 2) {
    //     try {
    //       const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    //         debouncedQuery
    //       )}&format=json&addressdetails=1&limit=5&countrycodes=ar`;

    //       const response = await fetch(url, {
    //         headers: {
    //           "User-Agent": "tu-app/1.0 (tuemail@dominio.com)", // requerido por OSM
    //         },
    //       });
    //       const json = await response.json();
    //       setResults(json);
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   } else {
    //     setResults([]);
    //   }
    // };
    // debouncedQuery
    // fetchData();
    fetchAddress();
  }, [searchText]);

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
          latitude: location?.latitude ?? 0,
          longitude: location?.longitude ?? 0,
          creationDate: initialValues?.creationDate ?? new Date().toISOString(),
          modificationDate: new Date().toISOString(),
        });
        router.push("/");
      }}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <View>
          <Stack.Screen
            options={{
              headerRight: () => (
                <View style={{ flexDirection: "row", gap: 8, marginRight: 8 }}>
                  <Pressable onPress={() => alert("Segundo botón!")}>
                    <Icon iconName="attachment" color={themes.colors.onSurface} />
                  </Pressable>
                  <Pressable onPress={() => handleSubmit()}>
                    <Icon iconName="save" color={themes.colors.onSurface} />
                  </Pressable>
                </View>
              ),
            }}
          />
          <View>
            <TextInput
              placeholder="Buscar una dirección..."
              placeholderTextColor={themes.colors.onSurfaceVariant}
              value={values.adress}
              onChangeText={(text) => {
                setFieldValue("adress", text);
                setSearchText(text);
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
                        setLocation({
                          address: item.display_name,
                          latitude: parseFloat(item.lat),
                          longitude: parseFloat(item.lon),
                        });
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
