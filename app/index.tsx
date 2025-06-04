import { Link } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Tempus</Text>

      {/* Aqui vamos direto para uma cidade exemplo com ID 1 */}
      <Link
        href={{ pathname: "/previsoes/[cidadeId]", params: { cidadeId: "1" } }}
        asChild
      >
        <Button title="Consultar Previsao" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 16 },
});
