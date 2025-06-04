import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ForecastItem = {
  date: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
};

export default function ForecastDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Primeiro busca o nome da cidade
        const cityRes = await fetch(`http://10.45.2.157:5000/weather/${id}`);
        const cityData = await cityRes.json();
        setCityName(cityData.city);

        // 2. Depois busca as previsões para essa cidade
        const forecastRes = await fetch(
          `http://10.45.2.157:5000/forecast/${encodeURIComponent(
            cityData.city
          )}`
        );
        const forecastData = await forecastRes.json();
        setForecasts(forecastData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão para {cityName}</Text>

      <FlatList
        data={forecasts}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.forecastCard}>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
            <Text>🌡️ Temperatura: {item.temperature}°C</Text>
            <Text>☁️ Condição: {item.condition}</Text>
            <Text>💧 Umidade: {item.humidity}%</Text>
            <Text>🌬️ Vento: {item.wind_speed} km/h</Text>
          </View>
        )}
      />

      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  forecastCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
});
