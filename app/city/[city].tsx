import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

type Weather = {
  id: number;
  city: string;
  temperature: number;
  condition: string;
};

export default function CityDetail() {
  const { city } = useLocalSearchParams();
  const [data, setData] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://172.16.0.106:5000/weather")
      .then((res) => res.json())
      .then((list: Weather[]) => {
        const match = list.find((item) => item.city === city);
        if (match) {
          setData(match);
        } else {
          Alert.alert("Erro", "Cidade não encontrada.");
        }
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Erro", "Falha ao buscar dados.");
      })
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.city}</Text>
      <Text>Temperatura: {data.temperature}°C</Text>
      <Text>Condição: {data.condition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
});
