import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Note } from "../models/noteModel";
import { Link } from "expo-router";
import { StyledText } from "../styled-components/StyledText";
import NoteCardOptionsMenu from "./NoteCardOptions";

interface NoteItemProps {
  data: Note;
  onDelete: (id: string) => void;
}

export default function NoteCardItem({ data, onDelete }: NoteItemProps) {
  return (
    <View style={styles.noteCardContainer}>
      <Link href={`/notes/${data.id}`} asChild>
        <Pressable>
          <StyledText size="xm">{data.creationDate}</StyledText>
          <StyledText variant="bold" size="sm" numberOfLines={1}>
            {data.title}
          </StyledText>
          <StyledText size="xm" numberOfLines={1}>
            {data.content}
          </StyledText>
        </Pressable>
      </Link>
      <NoteCardOptionsMenu
        onDelete={() => {
          onDelete(data.id);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  noteCardContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    position: "relative",
  },
});
