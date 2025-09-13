import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import QuickAccessItem from "./QuickAccessItem";
import NotesCardContainer from "./NotesCardContainer";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 16 }}>
        <Text style={styles.title}>Hola, Tony</Text>
      </View>
      <View style={styles.quickAccessContainer}>
        <QuickAccessItem link="/Notes" iconName="note" name="Todas mis notas" />
        <QuickAccessItem link="/CreateNote" iconName="plus" name="Crear nota" />
        <QuickAccessItem link="/Map" iconName="map" name="Ver mapa" />
        <QuickAccessItem link="/SharedNotes" iconName="profile" name="Compartidas conmigo" />
      </View>
      <View style={styles.lastNotesTextContainer}>
        <Text style={styles.subtitle}>Últimas notas</Text>
        <Link href="/Notes">
          <Text>Ver todo</Text>
        </Link>
      </View>

      <NotesCardContainer></NotesCardContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
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
    marginTop: 16,
  },
  lastNotesContainer: {},

  title: {
    fontSize: 24,
    lineHeight: 28,
    marginBottom: 16,
    fontWeight: 500,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 500,
  },
});
