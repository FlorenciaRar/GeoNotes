import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Note } from "../utils/types";

interface NoteFormProps {
  initialValues?: Partial<Note>;
  onSubmit: (note: Omit<Note, "id">) => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .required("El título es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
  content: Yup.string()
    .required("El contenido es obligatorio")
    .min(5, "Debe tener al menos 5 caracteres"),
  adress: Yup.string().when("useCurrentLocation", {
    is: (val: boolean) => val === false,
    then: (schema) => schema.required("La dirección es obligatoria"),
    otherwise: (schema) => schema,
  }),
  useCurrentLocation: Yup.boolean(),
});

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

  return (
    <Formik
      initialValues={{
        title: initialValues?.title ?? "",
        content: initialValues?.content ?? "",
        adress: initialValues?.adress ?? "",
        useCurrentLocation: false,
      }}
      validationSchema={NoteSchema}
      onSubmit={(values) => {
        const finalAddress = values.useCurrentLocation
          ? location
          : values.adress;
        onSubmit({
          title: values.title,
          content: values.content,
          adress: finalAddress,
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

          {/* Radios */}
          <View style={styles.radioContainer}>
            <Pressable
              style={styles.radioOption}
              onPress={() => setFieldValue("useCurrentLocation", false)}>
              <Text>
                {!values.useCurrentLocation ? "🔘" : "⚪️"} Establecer ubicación
              </Text>
            </Pressable>
            <Pressable
              style={styles.radioOption}
              onPress={() => {
                setFieldValue("useCurrentLocation", true);
                getCurrentLocation();
              }}>
              <Text
                style={
                  values.useCurrentLocation
                    ? styles.activeOption
                    : styles.inactiveOption
                }>
                Usar ubicación actual
              </Text>
            </Pressable>
          </View>
          {values.useCurrentLocation && location ? (
            <Text style={{ marginBottom: 8, color: "green" }}>
              Ubicación actual: {location}
            </Text>
          ) : null}

          {/* Input solo si elige manual */}
          {!values.useCurrentLocation && (
            <TextInput
              placeholder="Dirección"
              style={styles.input}
              value={values.adress}
              onChangeText={handleChange("adress")}
              onBlur={handleBlur("adress")}
            />
          )}
          {touched.adress && errors.adress && (
            <Text style={styles.error}>{errors.adress}</Text>
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
  radioOption: { padding: 8 },
  activeOption: { backgroundColor: "red" },
  inactiveOption: {},
});
