import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Container } from "../../styled-components/StyledSafeAreaView";
import { Note } from "../../models/noteModel";

export default function Map() {
  const initialNotes: Note[] = [
    {
      id: "1sdasdad256d+adqawreq4",
      creationDate: "25:05:2026",
      title: "Nota 1",
      adress: "Calle falsa 123",
      latitude: -34.6037,
      longitude: -58.3816,
      content: "Contenido de la nota 1",
    },
    {
      id: "2dasd456ad48aw9d1ad98q",
      creationDate: "25:05:2026",
      title: "Nota 2",
      adress: "Calle falsa 124",
      latitude: -34.6090,
      longitude: -58.3840,
      content: "Contenido de la nota 2",
    },
  ];

  return (
    <Container>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (-34.6037 + -34.6090) / 2,
          longitude: (-58.3816 + -58.3840) / 2,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        provider="google"
      >
        {initialNotes.map((note) => (
          <Marker
            key={note.id}
            coordinate={{
              latitude: note.latitude,
              longitude: note.longitude,
            }}
            title={note.title}
            description={note.adress}
          />
        ))}
      </MapView>
    </Container>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});


/*

*/

/*
<Container>
          <MapView
          style={styles.map}
          initialRegion={{
            latitude: -34.6037,
            longitude: -58.3816,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
      <Marker coordinate={{ latitude: -34.6037, longitude: -58.3816 }} />
    </MapView>
    </Container>
*/