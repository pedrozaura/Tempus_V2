import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Weather = {
  id: number;
  city: string;
  temperature: number;
  condition: string;
};

export default function Home() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Substitua pelo IP correto do seu servidor!
        const response = await fetch("http://127.0.0.1:5000/weather");

        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        console.error("Erro na requisição:", err);
        setError(
          "Não foi possível conectar ao servidor. Verifique o IP e a rede."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Text>Verifique se o servidor está rodando e o IP está correto.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={weatherData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/details/${item.id}`)}
          style={styles.item}
        >
          <Text style={styles.city}>{item.city}</Text>
          <Text>
            {item.temperature}°C - {item.condition}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  item: { padding: 16, borderBottomWidth: 1, borderColor: "#ccc" },
  city: { fontSize: 18, fontWeight: "bold" },
  errorText: { color: "red", marginBottom: 8 },
});
