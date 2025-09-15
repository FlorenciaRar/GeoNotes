import React from "react";
import { Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Icon, { IconName } from "../utils/icons";
import { Link } from "expo-router";
import { Title } from "../utils/fonts";

const anchoPantalla = Dimensions.get("window").width;
const itemWidth = anchoPantalla / 2 - 22;

interface QuickAccessItemProps {
  link: string;
  iconName: IconName;
  name: string;
}

export default function QuickAccessItem({
  link,
  iconName,
  name,
}: QuickAccessItemProps) {
  return (
    <Link href={link} asChild>
      <Pressable style={styles.quickAccessItem}>
        <Icon iconName={iconName} />
        <Title size="xm">{name}</Title>
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
