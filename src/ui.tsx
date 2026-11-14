import Feather from "@expo/vector-icons/Feather";
import {
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  type ViewStyle,
  type StyleProp,
  type ColorValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useStore } from "./store";
// Vitrine v2: ceramic-studio palette (clay + sand) for the Casa Lume demo store.
export const colors = {
  ink: "#2A1E17",
  plum: "#B4532F",
  muted: "#7A6A5E",
  lavender: "#F4E9DD",
  paper: "#FBF7F1",
  border: "#EADFD2",
  white: "#FFFFFF",
  green: "#2F6B47",
  red: "#A12B38",
};
export const images = {
  cup: require("../assets/products/cup.jpg"),
  vase: require("../assets/products/vase.jpg"),
  bowl: require("../assets/products/bowl.jpg"),
  plant: require("../assets/products/plant.jpg"),
};
export function Icon({
  name,
  color = colors.ink,
  size = 22,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  color?: ColorValue;
  size?: number;
}) {
  return <Feather name={name} color={color} size={size} accessible={false} />;
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      onPressIn={() => { scale.set(withSpring(0.95, { damping: 14, stiffness: 320 })); }}
      onPressOut={() => { scale.set(withSpring(1, { damping: 10, stiffness: 260 })); }}
      style={[styles.button, secondary && styles.secondary, disabled && { opacity: 0.5 }, pressStyle]}
    >
      <Text style={[styles.buttonText, secondary && { color: colors.plum }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function Screen({
  title,
  subtitle,
  children,
  style,
  showError = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showError?: boolean;
}) {
  const { error, ready } = useStore();
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.screen, style]}
      >
        <Animated.View entering={FadeInDown.duration(500).springify()}>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </Animated.View>
        {!ready ? (
          <Text accessibilityLiveRegion="polite">Carregando seus dados…</Text>
        ) : null}
        {showError && error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  screen: {
    padding: 22,
    paddingBottom: 32,
    gap: 24,
    width: "100%",
    maxWidth: 880,
    alignSelf: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1.4,
    color: colors.ink,
  },
  subtitle: { color: colors.muted, lineHeight: 22, fontSize: 14, marginTop: 6 },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  body: { fontSize: 15, lineHeight: 24, color: colors.muted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    minHeight: 50,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.plum,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: { backgroundColor: colors.lavender },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.ink,
    minHeight: 50,
  },
  error: {
    color: colors.red,
    backgroundColor: "#FCECEE",
    borderRadius: 10,
    padding: 14,
    lineHeight: 22,
  },
  note: {
    color: colors.plum,
    backgroundColor: colors.lavender,
    borderRadius: 12,
    padding: 16,
    lineHeight: 22,
    fontSize: 14,
  },
  divider: { height: 1, backgroundColor: colors.border },
  empty: { alignItems: "center", paddingVertical: 42, gap: 16 },
});
