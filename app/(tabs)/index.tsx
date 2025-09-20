import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import QuickAccessItem from "../../components/QuickAccessItem";
import NotesCardContainer from "../../components/NotesCardContainer";
import { Container } from "../../components/styled-components/StyledSafeAreaView";
import { Title } from "../../utils/fonts";
import { useTheme } from "../../context/ThemeContextProvider";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { AppTheme } from "../../utils";

export default function HomeScreen() {
  const { themes } = useTheme();
  const styles = getStyles(themes);

  return (
    <Container style={styles.container}>
      <View>
        <Title size="lg">Hola, Tony</Title>
      </View>
      <View style={styles.quickAccessContainer}>
        <QuickAccessItem link="/Notes" iconName="note" name="Todas mis notas" />
        <QuickAccessItem link="/CreateNote" iconName="plus" name="Crear nota" />
        <QuickAccessItem link="/Map" iconName="map" name="Ver mapa" />
        <QuickAccessItem
          link="/SharedNotes"
          iconName="profile"
          name="Compartidas conmigo"
        />
      </View>
      <View style={styles.lastNotesTextContainer}>
        <Title size="md">Últimas notas</Title>
        <Link href="/Notes">
          <Text>Ver todo</Text>
        </Link>
      </View>

      <NotesCardContainer></NotesCardContainer>
    </Container>
  );
}

function getStyles(themes: AppTheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: themes.background,
    },
    quickAccessContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    lastNotesTextContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {},
  });
}
