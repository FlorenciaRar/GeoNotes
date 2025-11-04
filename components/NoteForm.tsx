import { View, TextInput, Text, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from "react-native";
import { Formik } from "formik";
import { Stack, useNavigation, useRouter } from "expo-router";
import { NoteSchema, NoteFormProps } from "../models/";
import { useTheme } from "../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import { StyledText } from "../styled-components";
import { Icon } from "../utils";
import MediaOptionsMenu from "./mediaOptions";
import LocationSearchBar from "./LocationSearchBar";
import useMedia from "../hooks/useMedia";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableImageItem from "./DraggableImageItem";
import { useEffect } from "react";

export default function NoteForm({ initialValues, onSubmit }: NoteFormProps) {
  const { themes } = useTheme();
  const styles = getStyles(themes);

  const navigation = useNavigation();

  const { images, setImages, pickFromGallery, takePhoto } = useMedia();

  useEffect(() => {
    if (initialValues?.images && initialValues.images.length > 0) {
      setImages(initialValues.images);
    }
  }, [initialValues?.images]);

  return (
    <GestureHandlerRootView>
      <Formik
        initialValues={{
          title: initialValues?.title ?? "",
          content: initialValues?.content ?? "",
          address: initialValues?.address ?? "",
          latitude: initialValues?.latitude ?? null,
          longitude: initialValues?.longitude ?? null,
          images: initialValues?.images ?? [],
        }}
        validationSchema={NoteSchema}
        validateOnMount={false}
        onSubmit={(values, { resetForm }) => {
          onSubmit({
            title: values.title,
            content: values.content,
            address: values.address,
            latitude: values.latitude ?? 0,
            longitude: values.longitude ?? 0,
            images: images,
          });
          console.log({
            title: values.title,
            content: values.content,
            address: values.address,
            latitude: values.latitude ?? 0,
            longitude: values.longitude ?? 0,
            images: images,
          });
          navigation.goBack();
          resetForm({ touched: {} });
        }}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss;
              }}
              accessible={false}>
              <ScrollView contentContainerStyle={{ paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
                <View style={{ gap: 8 }}>
                  <Stack.Screen
                    options={{
                      headerRight: () => (
                        <View style={{ flexDirection: "row", gap: 8, marginRight: 8 }}>
                          <MediaOptionsMenu pickImage={pickFromGallery} takePhoto={takePhoto} />
                          <Pressable onPress={() => handleSubmit()} disabled={isSubmitting}>
                            {isSubmitting ? <ActivityIndicator size="small" color={themes.colors.primary} /> : <Icon iconName="save" color={themes.colors.onSurface} />}
                          </Pressable>
                        </View>
                      ),
                    }}
                  />

                  <LocationSearchBar
                    value={values.address || ""}
                    onChangeValue={(text) => setFieldValue("address", text)}
                    onSelectLocation={({ address, latitude, longitude }) => {
                      setFieldValue("address", address);
                      setFieldValue("latitude", latitude);
                      setFieldValue("longitude", longitude);
                    }}
                  />

                  <TextInput
                    placeholder="Título"
                    placeholderTextColor={themes.colors.onSurfaceVariant}
                    style={[styles.input, { fontSize: 20 }]}
                    value={values.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    editable={!isSubmitting}
                  />
                  {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

                  <TextInput
                    placeholder="Contenido"
                    placeholderTextColor={themes.colors.onSurfaceVariant}
                    style={styles.input}
                    value={values.content}
                    onChangeText={handleChange("content")}
                    onBlur={handleBlur("content")}
                    editable={!isSubmitting}
                    multiline
                  />
                  {touched.content && errors.content && <Text style={styles.error}>{errors.content}</Text>}

                  {images.length > 0 && (
                    <DraggableFlatList
                      ListHeaderComponent={<StyledText>Imágenes</StyledText>}
                      data={images}
                      horizontal
                      scrollEnabled={false}
                      keyExtractor={(item, index) => `${item}-${index}`}
                      onDragEnd={({ data }) => setImages(data)}
                      renderItem={({ item, drag, isActive }) => (
                        <DraggableImageItem
                          item={typeof item === "string" ? item : item.url}
                          drag={drag}
                          isActive={isActive}
                          onDelete={(uri) => setImages((prev) => prev.filter((img) => (typeof img === "string" ? img !== uri : img.url !== uri)))}
                        />
                      )}
                    />
                  )}
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </GestureHandlerRootView>
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
