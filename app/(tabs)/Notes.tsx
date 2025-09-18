import React from "react";
import { View, Text } from "react-native";
import NotesCardContainer from "../../components/NotesCardContainer";
import { Container } from "../../styled-components/StyledSafeAreaView";

export default function Notes() {
  return (
    <Container>
      <NotesCardContainer></NotesCardContainer>
    </Container>
  );
}
