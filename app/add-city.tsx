import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddCity() {
  const router = useRouter();
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCity = async () => {
    if (!cityName.trim()) {
      Alert.alert("Erro", "Por favor, digite o nome da cidade");
      return;
    }

    setLoading(true);
    try {
      // Inserir o IP correto do servidor
      const response = await fetch("http://10.45.2.157:5000/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityName }),
      });

      if (!response.ok) {
        throw new Error("Falha ao adicionar cidade");
      }

      Alert.alert("Sucesso", "Cidade adicionada com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao adicionar cidade:", error);
      Alert.alert(
        "Erro",
        "Não foi possível adicionar a cidade. Verifique o nome e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Cidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da cidade"
        value={cityName}
        onChangeText={setCityName}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Adicionar" onPress={handleAddCity} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});
