import api from "./api";

type Previsao = {
  cidade_id: number;
  data: string; // formato YYYY-MM-DD
  temperatura: number;
  clima: string;
  umidade: number;
};

export async function salvarPrevisoes(lista: Previsao[]) {
  const response = await api.post("/previsoes", lista);
  return response.data;
}
