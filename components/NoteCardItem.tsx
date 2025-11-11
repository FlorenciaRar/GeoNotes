import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Note } from "../models/";
import { Link } from "expo-router";
import { StyledText } from "../styled-components/StyledText";
import NoteCardOptionsMenu from "./NoteCardOptions";
import { useTheme } from "../context/ThemeContextProvider";
import { DefaultTheme } from "styled-components/native";

interface NoteItemProps {
  data: Note;
  onDelete: (id: string) => void;
}

export default function NoteCardItem({ data, onDelete }: NoteItemProps) {
  const { themes } = useTheme();
  const styles = getStyles(themes);
  return (
    <View style={styles.noteCardContainer}>
      <Link href={`/notes/${data.id}`} asChild>
        <TouchableOpacity>
          <StyledText size="xm">{data.creationDate}</StyledText>
          <StyledText variant="bold" size="sm" numberOfLines={1}>
            {data.title}
          </StyledText>
          <StyledText size="xm" numberOfLines={1}>
            {data.content}
          </StyledText>
        </TouchableOpacity>
      </Link>
      <NoteCardOptionsMenu
        onDelete={() => {
          onDelete(data.id);
        } } noteId={data.id}      />
    </View>
  );
}
function getStyles(themes: DefaultTheme) {
  return StyleSheet.create({
    noteCardContainer: {
      backgroundColor: themes.colors.surface,
      padding: themes.spacing.md,
      borderRadius: 16,
      marginBottom: 16,
      position: "relative",
    },
  });
}
