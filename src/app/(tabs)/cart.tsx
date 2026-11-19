import { useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { cartTotal, countItems, products } from "../../domain";
import { useLang } from "../../i18n";
import { useStore } from "../../store";
import { Button, colors, Icon, images, Screen, styles } from "../../ui";
export default function CartScreen() {
  const { data, quantity, checkout, busy, ready, error } = useStore();
  const nameInput = useRef<TextInput>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const { t: d, productText, money, error: tr } = useLang();
  const t = d.cart;
  const items = products.filter((p) => data.cart[p.id]).map((p) => ({ ...p, ...productText(p.id, p) }));
  async function submit() {
    if (await checkout(name, note)) {
      setName("");
      setNote("");
      router.replace("/orders");
    } else if (name.trim().length < 2) nameInput.current?.focus();
  }
  return (
    <Screen
      title={t.title}
      subtitle={t.subtitle}
      showError={false}
    >
      {!items.length ? (
        <View style={styles.empty}>
          <Icon name="shopping-bag" size={44} />
          <Text style={styles.heading}>{t.emptyTitle}</Text>
          <Text style={styles.body}>
            {t.emptyText}
          </Text>
          <Button
            label={t.explore}
            onPress={() => router.replace("/")}
          />
        </View>
      ) : (
        <>
          {items.map((p) => (
            <View key={p.id} style={{ gap: 12 }}>
              <View style={[styles.row, { justifyContent: "flex-start" }]}>
                <Image
                  source={images[p.image]}
                  style={{ width: 78, height: 86, borderRadius: 14 }}
                  accessibilityLabel={p.name}
                />
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={[styles.label, { marginBottom: 0 }]}>
                    {p.name}
                  </Text>
                  <Text style={styles.body}>{money(p.price)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  {[-1, 1]
                    .map((delta) => (
                      <Pressable
                        key={delta}
                        accessibilityRole="button"
                        accessibilityLabel={t.change(delta > 0, p.name)}
                        disabled={busy || (delta > 0 && data.cart[p.id] >= 20)}
                        onPress={() => void quantity(p.id, delta)}
                        style={{
                          backgroundColor: colors.lavender,
                          height: 44,
                          width: 44,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon name={delta < 0 ? "minus" : "plus"} />
                      </Pressable>
                    ))
                    .reduce<React.ReactNode[]>(
                      (result, button, i) =>
                        i === 0
                          ? [
                              button,
                              <Text
                                key="quantity"
                                accessibilityLabel={t.qty(p.name, data.cart[p.id])}
                                style={styles.label}
                              >
                                {data.cart[p.id]}
                              </Text>,
                            ]
                          : [...result, button],
                      [],
                    )}
                </View>
                <Text style={styles.label}>
                  {money(p.price * data.cart[p.id])}
                </Text>
              </View>
              <View style={styles.divider} />
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.body}>
              {t.subtotal(countItems(data.cart))}
            </Text>
            <Text style={styles.heading}>{money(cartTotal(data.cart))}</Text>
          </View>
          <Text style={styles.note}>
            {t.pickup}
          </Text>
          <View>
            <Text style={styles.label}>{t.name} *</Text>
            <TextInput
              ref={nameInput}
              accessibilityLabel={t.name}
              value={name}
              onChangeText={setName}
              placeholder={t.namePh}
              placeholderTextColor={colors.muted}
              maxLength={80}
              style={styles.input}
            />
            <Text style={styles.subtitle}>
              {t.nameHint}
            </Text>
          </View>
          <View>
            <Text style={styles.label}>{t.noteLabel}</Text>
            <TextInput
              accessibilityLabel={t.noteA11y}
              value={note}
              onChangeText={setNote}
              placeholder={t.notePh}
              placeholderTextColor={colors.muted}
              maxLength={300}
              multiline
              style={[
                styles.input,
                { minHeight: 94, textAlignVertical: "top" },
              ]}
            />
            <Text style={styles.subtitle}>{t.chars(note.length)}</Text>
          </View>
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {tr(error)}
            </Text>
          ) : null}
          <Button
            label={busy ? t.saving : t.create}
            disabled={busy || !ready}
            onPress={() => void submit()}
          />
          <Text style={styles.body}>
            {t.privacy}
          </Text>
        </>
      )}
    </Screen>
  );
}
