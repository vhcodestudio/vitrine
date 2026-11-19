import { useState } from "react";
import { Text, View } from "react-native";
import { useStore } from "../../store";
import { Button, Icon, Screen, styles } from "../../ui";
import { useLang } from "../../i18n";
export default function ShopScreen() {
  const { reset, busy } = useStore();
  const [confirm, setConfirm] = useState(false);
  const t = useLang().t.shop;
  return (
    <Screen title="Casa Lume" subtitle={t.subtitle}>
      <Icon name="sun" size={48} />
      <Text style={styles.heading}>
        {t.heading}
      </Text>
      <Text style={styles.body}>
        {t.intro}
      </Text>
      <View style={{ gap: 14 }}>
        <Text style={styles.label}>{t.how}</Text>
        <Text style={styles.body}>
          {t.howText}
        </Text>
      </View>
      <Text style={styles.note}>
        {t.disclaimer}
      </Text>
      <Text style={styles.body}>
        {t.photos}
      </Text>
      <View style={styles.divider} />
      <Text style={styles.heading}>{t.data}</Text>
      <Text style={styles.body}>
        {t.dataText}
      </Text>
      {!confirm ? (
        <Button
          label={t.clear}
          secondary
          onPress={() => setConfirm(true)}
        />
      ) : (
        <View style={{ gap: 12 }}>
          <Text accessibilityRole="alert" style={styles.body}>
            {t.ask}
          </Text>
          <Button
            label={t.confirm}
            disabled={busy}
            onPress={async () => {
              await reset();
              setConfirm(false);
            }}
          />
          <Button
            label={t.cancel}
            secondary
            onPress={() => setConfirm(false)}
          />
        </View>
      )}
    </Screen>
  );
}
