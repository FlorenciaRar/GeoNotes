import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Note } from "../utils/types";

interface NoteItemProps {
  data: Note;
}

export default function NoteItem({ data }: NoteItemProps) {
  return (
    <View style={styles.noteCardContainer}>
      <Text style={styles.textSmall}>{data.creationDate}</Text>
      <Text numberOfLines={1} style={styles.textBold}>
        {data.title}
      </Text>
      <Text numberOfLines={1}>{data.content}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  noteCardContainer: {
    borderStyle: "solid",
    borderColor: "#bebebe",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  textBold: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 500,
  },
  textSmall: {
    fontSize: 12,
    lineHeight: 18,
  },
});
