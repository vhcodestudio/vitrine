import { Tabs } from "expo-router";
import { colors, Icon } from "../../ui";
import { useStore } from "../../store";
import { countItems } from "../../domain";
import { useLang } from "../../i18n";
export default function TabsLayout() {
  const { data } = useStore();
  const { t } = useLang();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.plum,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarItemStyle: { minHeight: 52 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.catalog,
          tabBarAccessibilityLabel: t.tabs.catalog,
          tabBarIcon: ({ color }) => <Icon name="grid" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t.tabs.cart,
          tabBarAccessibilityLabel: t.tabs.cart,
          tabBarBadge: countItems(data.cart) || undefined,
          tabBarBadgeStyle: { backgroundColor: colors.plum },
          tabBarIcon: ({ color }) => <Icon name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t.tabs.orders,
          tabBarAccessibilityLabel: t.tabs.orders,
          tabBarIcon: ({ color }) => <Icon name="package" color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: t.tabs.shop,
          tabBarAccessibilityLabel: t.tabs.shop,
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
    </Tabs>
  );
}
