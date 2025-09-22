import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import QuickAccessItem from "../../components/QuickAccessItem";
import NotesCardContainer from "../../components/NotesCardContainer";
import { useTheme } from "../../context/ThemeContextProvider";
import { StyledText } from "../../styled-components/StyledText";
import { Container } from "../../styled-components/StyledSafeAreaView";
import { DefaultTheme } from "styled-components/native";
import { User } from "../../src/shared/models/user";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function HomeScreen() {
  const { themes } = useTheme();
  const styles = getStyles(themes);

  // Obtener el nombre del usuario desde el contexto de autenticación
  const { state } = useContext(AuthContext);
  const userName = state?.user?.name;

  return (
    <Container style={styles.container}>
      <View>
        <StyledText variant="bold" size="lg">
          {`Hola ${userName || "Usuario"}`}
        </StyledText>
      </View>
      <View style={styles.quickAccessContainer}>
        <QuickAccessItem link="/Notes" iconName="note" name="Todas mis notas" />
        <QuickAccessItem link="/NewNote" iconName="plus" name="Crear nota" />
        <QuickAccessItem link="/Map" iconName="map" name="Ver mapa" />
        <QuickAccessItem
          link="/SharedNotes"
          iconName="profile"
          name="Compartidas conmigo"
        />
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

function getStyles(themes: DefaultTheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: themes.colors.background,
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
  });
}
