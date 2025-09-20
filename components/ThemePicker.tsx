import { FlatList, Pressable, View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { appThemes } from "../utils";
import { useTheme } from "../context/ThemeContextProvider";

export default function ThemePicker() {
  const { themeIndex, setThemeIndex, themes } = useTheme();
  const { width } = useWindowDimensions();

  // padding horizontal: 16*2; gap entre columnas: 12
  const GAP = 12;
  const H_PADDING = 16;
  const CARD_WIDTH = Math.floor((width - H_PADDING * 2 - GAP) / 2);

  return (
    <FlatList
      data={appThemes}
      keyExtractor={(item) => item.name}
      numColumns={2}
      columnWrapperStyle={{ gap: GAP, justifyContent: "center" }}
      contentContainerStyle={{
        paddingHorizontal: H_PADDING,
        paddingTop: 12,
        paddingBottom: 4,
        alignItems: "center",
        rowGap: GAP,
      }}
      renderItem={({ item, index }) => {
        const active = index === themeIndex;
        return (
          <Pressable
            onPress={() => setThemeIndex(index)}
            style={[
              styles.card,
              {
                width: CARD_WIDTH,
                backgroundColor: themes.colors.surface, // todas iguales
                borderColor: active ? themes.colors.primary : themes.colors.outline,
              },
            ]}>
            <Text style={[styles.name, { color: themes.colors.onSurface, fontWeight: active ? "700" : "500" }]}>{item.name}</Text>
            <View style={styles.swatches}>
              <View
                style={[
                  styles.swatch,
                  {
                    backgroundColor: item.background,
                    borderColor: themes.colors.outline,
                  },
                ]}
              />
              <View
                style={[
                  styles.swatch,
                  {
                    backgroundColor: item.surface,
                    borderColor: themes.colors.outline,
                  },
                ]}
              />
              <View
                style={[
                  styles.swatch,
                  {
                    backgroundColor: item.primary,
                    borderColor: themes.colors.outline,
                  },
                ]}
              />
              <View
                style={[
                  styles.swatch,
                  {
                    backgroundColor: item.secondary,
                    borderColor: themes.colors.outline,
                  },
                ]}
              />
              <View
                style={[
                  styles.swatch,
                  {
                    backgroundColor: item.tertiary,
                    borderColor: themes.colors.outline,
                  },
                ]}
              />
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
  },
  name: {
    marginBottom: 10,
    fontSize: 13,
    textAlign: "center",
  },
  swatches: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth, // borde para distinguir
  },
});
