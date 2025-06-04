import { Link } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const cidades = [
  { nome: "São Paulo", id: "1" },
  { nome: "Rio de Janeiro", id: "2" },
  { nome: "Curitiba", id: "3" },
  { nome: "Toledo", id: "4" },
  { nome: "Cascavel", id: "5" },
  { nome: "Belo Horizonte", id: "6" },
  { nome: "Fortaleza", id: "7" },
];

export default function Home() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={cidades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/detalhes/${item.nome}`} asChild>
            <TouchableOpacity
              style={{
                padding: 12,
                marginBottom: 8,
                backgroundColor: "#75e6a2", // cor de fundo dos menus
                borderRadius: 8,
              }}
            >
              <Text>{item.nome}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}
