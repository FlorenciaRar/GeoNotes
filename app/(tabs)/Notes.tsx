// app/(tabs)/Notes.tsx
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";
import NotesCardContainer from "../../components/NotesCardContainer";
import { Container } from "../../styled-components/StyledSafeAreaView";
import { BackgroundDecor } from "../../components/ui/BackgroundDecor";

export default function Notes() {
  const { themes } = useTheme();
  const styles = useMemo(() => getStyles(themes), [themes]);

  return (
    <Container style={styles.container}>
      <BackgroundDecor theme={themes} />

      {/* Contenido sin paneles: solo padding */}
      <View style={styles.content}>
        <NotesCardContainer />
      </View>
    </Container>
  );
}

function getStyles(theme: DefaultTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // color base detrás del gradiente
      position: "relative",
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
  });
}
