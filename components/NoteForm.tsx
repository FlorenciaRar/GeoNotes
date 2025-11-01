import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { NoteSchema, NoteFormProps } from "../models/";
import { useTheme } from "../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import { StyledText } from "../styled-components";
import { Icon } from "../utils";
import MediaOptionsMenu from "./mediaOptions";
import useLocationSearch from "../hooks/useLocationSearch";

export default function NoteForm({ initialValues, onSubmit }: NoteFormProps) {
  const { themes } = useTheme();
  const styles = getStyles(themes);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { adress, latitude, longitude } = params;
  const { getCurrentLocation, setSearchText, searchResults, menuShown, setMenuShown, setLocation } = useLocationSearch();
  const [images, setImages] = useState<string[]>([]);
  const [prefilled, setPrefilled] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) setImages([...images, result.assets[0].uri]);
  };

  return (
    <Formik
      initialValues={{
        title: initialValues?.title ?? "",
        content: initialValues?.content ?? "",
        adress: adress ? (adress as string) : initialValues?.adress ?? "",
        latitude: latitude ? parseFloat(latitude as string) : initialValues?.latitude ?? null,
        longitude: longitude ? parseFloat(longitude as string) : initialValues?.longitude ?? null,
      }}
      enableReinitialize
      validationSchema={NoteSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit({
          title: values.title,
          content: values.content,
          adress: values.adress,
          latitude: values.latitude ?? 0,
          longitude: values.longitude ?? 0,
          creationDate: initialValues?.creationDate ?? new Date().toISOString(),
          modificationDate: new Date().toISOString(),
        });
        resetForm();
        router.push("/");
      }}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
        useEffect(() => {
          if (!prefilled && adress && latitude && longitude) {
            setFieldValue("adress", adress);
            setFieldValue("latitude", parseFloat(latitude as string));
            setFieldValue("longitude", parseFloat(longitude as string));
            setSearchText(adress as string);
            setLocation({
              address: adress as string,
              latitude: parseFloat(latitude as string),
              longitude: parseFloat(longitude as string),
            });
            setMenuShown(false);
            setPrefilled(true);
          }
        }, [adress, latitude, longitude]);

        return (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <ScrollView contentContainerStyle={{ paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
                <View style={{ gap: 8 }}>
                  <Stack.Screen
                    options={{
                      headerRight: () => (
                        <View style={{ flexDirection: "row", gap: 8, marginRight: 8 }}>
                          <MediaOptionsMenu pickImage={pickImage} />
                          <Pressable onPress={() => handleSubmit()}>
                            <Icon iconName="save" color={themes.colors.onSurface} />
                          </Pressable>
                        </View>
                      ),
                    }}
                  />
                  <View>
                    <View style={styles.locationInputContainer}>
                      <Icon iconName="search" size={20} color={themes.colors.onSurface} />
                      <TextInput
                        style={styles.locationInput}
                        placeholder="Buscar una dirección..."
                        placeholderTextColor={themes.colors.onSurfaceVariant}
                        value={values.adress}
                        onChangeText={(text) => {
                          setFieldValue("adress", text);
                          setSearchText(text);
                          setMenuShown(true);
                        }}
                        onPressIn={() => setMenuShown(true)}
                      />
                      {values.adress.trim().length > 0 && (
                        <Pressable
                          onPress={() => {
                            setFieldValue("adress", "");
                            setSearchText("");
                            setLocation(null);
                            setMenuShown(false);
                          }}>
                          <Icon iconName="close" size={20} color={themes.colors.onSurface} />
                        </Pressable>
                      )}
                    </View>

                    {touched.adress && errors.adress && <Text style={styles.error}>{errors.adress}</Text>}

                    {menuShown && (
                      <View style={styles.menuContainer}>
                        <Pressable
                          onPress={async () => {
                            const currentLocation = await getCurrentLocation();
                            if (currentLocation) {
                              setFieldValue("adress", currentLocation.address);
                              setFieldValue("latitude", currentLocation.latitude);
                              setFieldValue("longitude", currentLocation.longitude);
                            }
                            setMenuShown(false);
                          }}>
                          <StyledText size="xm" color="onSurface">
                            Usar ubicación actual
                          </StyledText>
                        </Pressable>
                        <FlatList
                          data={searchResults}
                          scrollEnabled={false}
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
                                setFieldValue("latitude", item.lat);
                                setFieldValue("longitude", item.lon);
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

                  {images.length > 0 && (
                    <View>
                      <StyledText>Imágenes</StyledText>
                      <FlatList
                        data={images}
                        horizontal
                        keyExtractor={(uri) => uri}
                        renderItem={({ item }) => (
                          <Image source={{ uri: item }} style={{ width: 100, height: 100, borderRadius: 8, marginRight: 8 }} />
                        )}
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        );
      }}
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
    locationInputContainer: {
      backgroundColor: themes.colors.surface,
      borderRadius: 60,
      paddingHorizontal: themes.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
    },
    locationInput: {
      marginLeft: themes.spacing.sm,
      color: themes.colors.onSurface,
      flex: 1,
    },
    error: {
      color: themes.colors.error,
      fontSize: themes.fontSizes.xm,
      marginTop: 0,
      marginBottom: 8,
    },
    menuContainer: {
      position: "absolute",
      maxHeight: 400,
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
