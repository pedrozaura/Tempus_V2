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
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Primeiro busca o nome da cidade pelo ID
        const cityRes = await fetch(`http://10.45.2.157:5000/weather/${id}`);
        const cityData = await cityRes.json();
        setCityName(cityData.city);

        // Depois busca a previsão
        const forecastRes = await fetch(
          `http://10.45.2.157:5000/forecast/${cityData.city}`
        );
        const forecastData = await forecastRes.json();
        setForecast(forecastData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
        data={forecast}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.forecastItem}>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
            <Text>Temperatura: {item.temperature}°C</Text>
            <Text>Condição: {item.condition}</Text>
            <Text>Umidade: {item.humidity}%</Text>
            <Text>Vento: {item.wind_speed} km/h</Text>
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  forecastItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
