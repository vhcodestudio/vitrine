import { Image, Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { products } from "../../domain";
import { useLang } from "../../i18n";
import { useStore } from "../../store";
import { Button, Icon, images, Screen, styles } from "../../ui";
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const base = products.find((p) => p.id === id);
  const { quantity, busy, ready, data } = useStore();
  const { t: d, productText, money } = useLang();
  const t = d.product;
  const product = base && { ...base, ...productText(base.id, base) };
  if (!product)
    return (
      <Screen title={t.notFound}>
        <Button
          label={t.back}
          onPress={() => router.replace("/")}
        />
      </Screen>
    );
  return (
    <Screen title={product.name} subtitle={d.categories[product.category]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.back}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
        style={[styles.row, { alignSelf: "flex-start", minHeight: 44 }]}
      >
        <Icon name="arrow-left" />
        <Text style={styles.body}>{t.catalog}</Text>
      </Pressable>
      <Image
        source={images[product.image]}
        style={{ height: 310, width: "100%", borderRadius: 22 }}
        accessibilityLabel={product.name}
      />
      <View style={styles.row}>
        <Text style={styles.heading}>{money(product.price)}</Text>
        <Text style={styles.body}>
          {product.available ? t.available : t.soldOut}
        </Text>
      </View>
      <Text style={styles.body}>{product.description}</Text>
      <Text style={styles.note}>
        {t.pickup}
      </Text>
      <Button
        label={t.add}
        disabled={
          !product.available ||
          !ready ||
          busy ||
          (data.cart[product.id] ?? 0) >= 20
        }
        onPress={() => void quantity(product.id, 1)}
      />
      <Text accessibilityLiveRegion="polite" style={styles.body}>
        {data.cart[product.id]
          ? t.units(data.cart[product.id])
          : t.choose}
      </Text>
      <Button
        label={t.seeCart}
        secondary
        onPress={() => router.push("/cart")}
      />
    </Screen>
  );
}
