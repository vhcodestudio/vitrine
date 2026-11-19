import { Text, View } from "react-native";
import { router } from "expo-router";
import { products, type OrderStatus } from "../../domain";
import { useLang } from "../../i18n";
import { useStore } from "../../store";
import { Button, colors, Icon, Screen, styles } from "../../ui";
const stages: OrderStatus[] = [
  "Recebido",
  "Em preparo",
  "Pronto para retirada",
];
export default function OrdersScreen() {
  const { data, advance, busy } = useStore();
  const { t: d, money, date, productText } = useLang();
  const t = d.orders;
  const itemName = (id: string, fallback: string) => { const p = products.find((x) => x.id === id); return p ? productText(id, p).name : fallback; };
  return (
    <Screen
      title={t.title}
      subtitle={t.subtitle}
    >
      <Text style={styles.note}>
        {t.note}
      </Text>
      {!data.orders.length ? (
        <View style={styles.empty}>
          <Icon name="package" size={44} />
          <Text style={styles.heading}>{t.empty}</Text>
          <Text style={styles.body}>
            {t.emptyText}
          </Text>
          <Button
            label={t.explore}
            onPress={() => router.replace("/")}
          />
        </View>
      ) : (
        data.orders.map((order) => (
          <View
            key={order.id}
            style={{
              backgroundColor: colors.white,
              padding: 20,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 16,
            }}
          >
            <View style={styles.row}>
              <Text style={styles.label}>{order.id}</Text>
              <Text style={styles.body}>
                {date(order.createdAt)}
              </Text>
            </View>
            <Text style={styles.heading}>{d.status[order.status]}</Text>
            <View
              style={{ flexDirection: "row", gap: 6 }}
              accessibilityLabel={`Status: ${d.status[order.status]}`}
            >
              {stages.map((stage, index) => (
                <View
                  key={stage}
                  style={{
                    flex: 1,
                    height: 5,
                    borderRadius: 4,
                    backgroundColor:
                      stages.indexOf(order.status) >= index
                        ? colors.plum
                        : colors.border,
                  }}
                />
              ))}
            </View>
            <Text style={styles.body}>{t.pickupBy(order.customer)}</Text>
            {order.items.map((item) => (
              <View key={item.productId} style={styles.row}>
                <Text style={[styles.body, { flex: 1 }]}>
                  {item.quantity} × {itemName(item.productId, item.name)}
                </Text>
                <Text style={styles.body}>
                  {money(item.quantity * item.price)}
                </Text>
              </View>
            ))}
            {order.note ? (
              <Text style={styles.body}>{t.noteLabel(order.note)}</Text>
            ) : null}
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>{t.total}</Text>
              <Text style={styles.heading}>{money(order.total)}</Text>
            </View>
            {order.status !== "Pronto para retirada" ? (
              <Button
                label={
                  order.status === "Recebido"
                    ? t.prepare
                    : t.ready
                }
                secondary
                disabled={busy}
                onPress={() => void advance(order.id)}
              />
            ) : (
              <Text style={styles.note}>
                {t.done}
              </Text>
            )}
          </View>
        ))
      )}
    </Screen>
  );
}
