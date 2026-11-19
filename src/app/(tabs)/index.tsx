import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import { products, type Category } from "../../domain";
import { useStore } from "../../store";
import { colors, Icon, images, Screen, styles } from "../../ui";
import { useLang } from "../../i18n";
const categories: Category[] = ["Todos", "Cerâmica", "Decoração", "Presentes"];
export default function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Todos");
  const { quantity, busy, ready, data } = useStore();
  const { t: d, productText, money } = useLang();
  const t = d.catalog;
  const visible = products
    .map((p) => ({ ...p, ...productText(p.id, p) }))
    .filter(
      (p) =>
        (category === "Todos" || p.category === category) &&
        p.name.toLocaleLowerCase(d.locale).includes(query.trim().toLocaleLowerCase(d.locale)),
    );
  return (
    <Screen title="Vitrine" subtitle={t.subtitle}>
      <View style={s.shopLine}>
        <View style={s.mark}>
          <Icon name="sun" color={colors.plum} />
        </View>
        <View>
          <Text style={s.shopName}>Casa Lume</Text>
          <Text style={s.caption}>
            {t.tagline}
          </Text>
        </View>
      </View>
      <View style={s.hero}>
        <View style={s.heroCopy}>
          <Text style={s.heroLabel}>{t.heroLabel}</Text>
          <Text style={s.heroTitle}>{t.heroTitle}</Text>
          <Text style={s.heroBody}>
            {t.heroBody}
          </Text>
        </View>
        <View style={s.heroImage}>
          <Image
            source={images.vase}
            style={{ flex: 1, width: "100%" }}
            resizeMode="cover"
            accessibilityLabel={t.heroAlt}
          />
        </View>
      </View>
      <View style={s.search}>
        <Icon name="search" size={20} />
        <TextInput
          accessibilityLabel={t.search}
          placeholder={t.searchPh}
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          style={s.searchInput}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
        accessibilityLabel={t.categories}
      >
        {categories.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityLabel={d.categories[item]}
            accessibilityState={{ selected: item === category }}
            onPress={() => setCategory(item)}
            style={[s.chip, item === category && s.chipActive]}
          >
            <Text
              style={[s.chipText, item === category && { color: colors.white }]}
            >
              {d.categories[item]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.row}>
        <Text style={styles.heading}>{t.pick}</Text>
        <Text style={s.caption}>{t.pieces(visible.length)}</Text>
      </View>
      {!visible.length ? (
        <View style={styles.empty}>
          <Icon name="search" size={32} />
          <Text style={styles.heading}>{t.none}</Text>
          <Text style={styles.body}>
            {t.noneText}
          </Text>
        </View>
      ) : (
        <View style={s.grid}>
          {visible.map((p, idx) => (
            <Animated.View key={p.id} style={s.product} entering={FadeInDown.delay(idx * 70).springify()} layout={LinearTransition.springify()}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.see(p.name)}
                onPress={() => router.push(`/product/${p.id}`)}
              >
                <Image
                  source={images[p.image]}
                  style={s.photo}
                  accessibilityLabel={p.name}
                />
                <View style={s.productCopy}>
                  <Text style={s.caption}>{d.categories[p.category]}</Text>
                  <Text style={s.productName}>{p.name}</Text>
                </View>
              </Pressable>
              <View style={[styles.row, s.priceRow]}>
                <Text style={s.price}>{money(p.price)}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.add(p.name)}
                  accessibilityState={{
                    disabled:
                      !p.available ||
                      busy ||
                      !ready ||
                      (data.cart[p.id] ?? 0) >= 20,
                  }}
                  disabled={
                    !p.available ||
                    busy ||
                    !ready ||
                    (data.cart[p.id] ?? 0) >= 20
                  }
                  onPress={() => void quantity(p.id, 1)}
                  style={[
                    s.add,
                    !p.available && { backgroundColor: colors.border },
                  ]}
                >
                  <Icon
                    name="plus"
                    size={20}
                    color={p.available ? colors.white : colors.muted}
                  />
                </Pressable>
              </View>
              {!p.available ? (
                <Text style={s.unavailable}>{t.soldOut}</Text>
              ) : data.cart[p.id] ? (
                <Text style={s.added} accessibilityLiveRegion="polite">
                  {t.inCart(data.cart[p.id])}
                </Text>
              ) : null}
            </Animated.View>
          ))}
        </View>
      )}
      <Text style={styles.note}>
        {t.note}
      </Text>
    </Screen>
  );
}
const s = StyleSheet.create({
  shopLine: { flexDirection: "row", gap: 12, alignItems: "center" },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.lavender,
    justifyContent: "center",
    alignItems: "center",
  },
  shopName: { fontSize: 16, fontWeight: "700", color: colors.ink },
  caption: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  hero: {
    backgroundColor: colors.lavender,
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 220,
  },
  heroCopy: { width: "62%", padding: 22, justifyContent: "center", gap: 10 },
  heroLabel: { color: colors.plum, fontSize: 12, fontWeight: "700" },
  heroTitle: {
    color: colors.ink,
    fontSize: 25,
    lineHeight: 29,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  heroBody: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  heroImage: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "38%",
  },
  search: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    fontSize: 14,
    color: colors.ink,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.white,
  },
  chipActive: { backgroundColor: colors.plum, borderColor: colors.plum },
  chipText: { fontSize: 14, fontWeight: "600", color: colors.muted },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  product: { width: "47.4%", paddingBottom: 8 },
  photo: {
    width: "100%",
    height: 158,
    borderRadius: 16,
    backgroundColor: colors.lavender,
  },
  productCopy: { paddingTop: 12, gap: 3 },
  productName: {
    fontSize: 16,
    lineHeight: 21,
    color: colors.ink,
    fontWeight: "600",
  },
  priceRow: { paddingTop: 6, gap: 2 },
  price: { color: colors.ink, fontWeight: "700", fontSize: 15 },
  add: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.plum,
  },
  unavailable: { color: colors.muted, fontSize: 12 },
  added: { color: colors.green, fontSize: 12 },
});
