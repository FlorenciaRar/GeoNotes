import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import QuickAccessItem from "../../components/QuickAccessItem";
import NotesCardContainer from "../../components/NotesCardContainer";
import { Container } from "../../styled-components/StyledSafeAreaView";
import { StyledText } from "../../styled-components/StyledText";

export default function HomeScreen() {
  return (
    <Container>
      <View>
        <StyledText variant="bold" size="lg">
          Hola, Tony
        </StyledText>
      </View>
      <View style={styles.quickAccessContainer}>
        <QuickAccessItem link="/Notes" iconName="note" name="Todas mis notas" />
        <QuickAccessItem link="/NewNote" iconName="plus" name="Crear nota" />
        <QuickAccessItem link="/Map" iconName="map" name="Ver mapa" />
        <QuickAccessItem link="/SharedNotes" iconName="profile" name="Compartidas conmigo" />
      </View>
      <View style={styles.lastNotesTextContainer}>
        <StyledText variant="bold" size="md">
          Últimas notas
        </StyledText>
        <Link href="/Notes">
          <Text>Ver todo</Text>
        </Link>
      </View>

      <NotesCardContainer maxItems={3} />
    </Container>
  );
}

const styles = StyleSheet.create({
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
});
