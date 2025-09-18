import React from "react";
import { StyleSheet, Dimensions, Pressable } from "react-native";
import Icon, { IconName } from "../utils/icons";
import { Link } from "expo-router";
import { StyledText } from "../styled-components/StyledText";

const anchoPantalla = Dimensions.get("window").width;
const itemWidth = anchoPantalla / 2 - 22;

interface QuickAccessItemProps {
  link: string;
  iconName: IconName;
  name: string;
}

export default function QuickAccessItem({ link, iconName, name }: QuickAccessItemProps) {
  return (
    <Link href={link} asChild>
      <Pressable style={styles.quickAccessItem}>
        <Icon iconName={iconName} />
        <StyledText variant="bold" size="xm">
          {name}
        </StyledText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  quickAccessItem: {
    width: itemWidth,
    height: 90,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    justifyContent: "center",
    rowGap: 16,
  },
});
