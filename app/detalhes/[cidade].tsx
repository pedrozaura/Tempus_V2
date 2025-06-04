import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

export default function Detalhes() {
  const { cidade } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=91b363d9e740bd88f0809fa3a5db21ed&&lang=pt_br&units=metric`
        );
        const json = await res.json();
        setDados(json);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [cidade]);

  if (loading) {
    return (
      <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#000" />
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20 }}>{cidade}</Text>
      {dados && (
        <>
          <Text>Temperatura: {dados.main.temp} °C</Text>
          <Text>Clima: {dados.weather[0].description}</Text>
          <Text>Umidade: {dados.main.humidity}%</Text>
        </>
      )}
    </View>
  );
}
