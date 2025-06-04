import axios from "axios";

const OPENWEATHER_API_KEY = "91b363d9e740bd88f0809fa3a5db21ed";

export async function buscarPrevisao5Dias(cidade: string) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${OPENWEATHER_API_KEY}&lang=pt_br&units=metric`;
  const response = await axios.get(url);
  return response.data;
}
