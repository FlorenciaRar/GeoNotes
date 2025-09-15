import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Note } from "../utils/types";
import { Link } from "expo-router";
import { BodyText, Title } from "../utils/fonts";

interface NoteItemProps {
  data: Note;
}

export default function NoteCardItem({ data }: NoteItemProps) {
  return (
    <Link href={`/notes/${data.id}`} asChild>
      <Pressable>
        <View style={styles.noteCardContainer}>
          <BodyText size="xm">{data.creationDate}</BodyText>
          <Title size="sm" numberOfLines={1}>
            {data.title}
          </Title>
          <BodyText size="xm" numberOfLines={1}>
            {data.content}
          </BodyText>
        </View>
      </Pressable>
    </Link>
  );
}
const styles = StyleSheet.create({
  noteCardContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
});
