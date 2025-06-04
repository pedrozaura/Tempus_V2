import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import api from "../../services/api";

type Previsao = {
  data: string;
  temperatura: number;
  clima: string;
  umidade: number;
};

export default function TelaPrevisoes() {
  const { cidadeId } = useLocalSearchParams();
  const [previsoes, setPrevisoes] = useState<Previsao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get(`/previsoes/${cidadeId}`);
        setPrevisoes(res.data);
      } catch (e) {
        console.error("Erro ao carregar previsões:", e);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [cidadeId]);

  if (loading) {
    return (
      <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#000" />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsões</Text>
      <FlatList
        data={previsoes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.data}>{item.data}</Text>
            <Text>🌡️ {item.temperatura}°C</Text>
            <Text>☁️ {item.clima}</Text>
            <Text>💧 Umidade: {item.umidade}%</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, marginBottom: 12 },
  card: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  data: { fontWeight: "bold", fontSize: 16 },
});
