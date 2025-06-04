import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

type WeatherDetails = {
  id: number;
  city: string;
  temperature: number;
  condition: string;
};

export default function Details() {
  const { id } = useLocalSearchParams();
  const [weather, setWeather] = useState<WeatherDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherDetails = async () => {
      try {
        const response = await fetch(`http://172.16.0.106:5000/weather/${id}`);
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        Alert.alert("Erro", "Não foi possível carregar os detalhes do clima.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.center}>
        <Text>Dados não encontrados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weather.city}</Text>
      <Text style={styles.temperature}>{weather.temperature}°C</Text>
      <Text style={styles.condition}>{weather.condition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 16, alignItems: "center" },
  city: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  temperature: { fontSize: 48, marginBottom: 8 },
  condition: { fontSize: 18 },
});
