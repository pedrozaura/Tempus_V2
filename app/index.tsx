import { LoadingSpinner } from "@/components/LoadingSpinner";
//import { Button } from "@/components/ui/Button";// ajuste o número de ../ conforme a estrutura do seu app
import { Card } from "@/components/ui/Card";
import { WeatherCard } from "@/components/WeatherCard";
import { useToast } from "@/hooks/use-toast";
import { Cloud, MapPin, Plus, RefreshCw, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";

type Weather = {
  id: number;
  city: string;
  temperature: number;
  condition: string;
};

const Index = () => {
  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulated data for demo - replace with your API call
      // const response = await fetch("http://10.45.2.157:5000/weather");

      // Mock data for demonstration
      setTimeout(() => {
        const mockData: Weather[] = [
          {
            id: 1,
            city: "São Paulo",
            temperature: 24,
            condition: "Ensolarado",
          },
          {
            id: 2,
            city: "Rio de Janeiro",
            temperature: 28,
            condition: "Parcialmente nublado",
          },
          { id: 3, city: "Brasília", temperature: 22, condition: "Chuvoso" },
          { id: 4, city: "Salvador", temperature: 30, condition: "Ensolarado" },
        ];
        setWeatherData(mockData);
        setLoading(false);
      }, 1500);

      // Uncomment below for real API usage:
      /*
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
      */
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError(
        "Não foi possível conectar ao servidor. Verifique o IP e a rede."
      );
      setLoading(false);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível carregar os dados meteorológicos.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleAddCity = () => {
    toast({
      title: "Adicionar Cidade",
      description: "Funcionalidade em desenvolvimento!",
    });
  };

  const handleRefresh = () => {
    fetchWeatherData();
    toast({
      title: "Atualizando",
      description: "Carregando dados meteorológicos...",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <Cloud className="h-16 w-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">
            Ops! Algo deu errado
          </h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500">
            Verifique se o servidor está rodando e o IP está correto.
          </p>
          <Button onClick={fetchWeatherData} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sun className="h-8 w-8 text-yellow-300" />
              <h1 className="text-3xl font-bold text-white">WeatherApp</h1>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleRefresh}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar
              </Button>
              <Button
                onClick={handleAddCity}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cidade
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {weatherData.length === 0 ? (
          <Card className="p-8 text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma cidade adicionada
            </h3>
            <p className="text-gray-500 mb-4">
              Adicione suas cidades favoritas para acompanhar o clima!
            </p>
            <Button onClick={handleAddCity}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Cidade
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weatherData.map((weather) => (
              <WeatherCard
                key={weather.id}
                weather={weather}
                onClick={() => {
                  toast({
                    title: `Detalhes de ${weather.city}`,
                    description: "Abrindo informações detalhadas...",
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
