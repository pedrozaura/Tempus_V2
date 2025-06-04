import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
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

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://10.45.2.157:5000/weather");

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError(
        "Não foi possível conectar ao servidor. Verifique o IP e a rede."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleAddCity = () => {
    router.push("/add-city");
  };

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
        <Button title="Tentar novamente" onPress={fetchWeatherData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Recarregar" onPress={fetchWeatherData} />
        <View style={styles.buttonSpacer} />
        <Button title="Adicionar Cidade" onPress={handleAddCity} />
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  city: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
  },
  buttonSpacer: {
    width: 16,
  },
});
