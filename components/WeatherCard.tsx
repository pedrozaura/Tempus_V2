import { Card } from "@/components/ui/Card";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  MapPin,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

type Weather = {
  id: number;
  city: string;
  temperature: number;
  condition: string;
};

interface WeatherCardProps {
  weather: Weather;
  onClick: () => void;
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("ensolarado") || lowerCondition.includes("sol")) {
    return <Sun className="h-8 w-8 text-yellow-400" />;
  }
  if (lowerCondition.includes("chuva") || lowerCondition.includes("chuvoso")) {
    return <CloudRain className="h-8 w-8 text-blue-400" />;
  }
  if (lowerCondition.includes("neve") || lowerCondition.includes("nevando")) {
    return <CloudSnow className="h-8 w-8 text-blue-200" />;
  }
  if (lowerCondition.includes("vento")) {
    return <Wind className="h-8 w-8 text-gray-400" />;
  }
  return <Cloud className="h-8 w-8 text-gray-400" />;
};

const getCardGradient = (condition: string) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("ensolarado") || lowerCondition.includes("sol")) {
    return "from-yellow-400 to-orange-500";
  }
  if (lowerCondition.includes("chuva") || lowerCondition.includes("chuvoso")) {
    return "from-blue-400 to-blue-600";
  }
  if (lowerCondition.includes("neve") || lowerCondition.includes("nevando")) {
    return "from-blue-200 to-blue-400";
  }
  return "from-gray-400 to-gray-600";
};

export const WeatherCard = ({ weather, onClick }: WeatherCardProps) => {
  return (
    <Card
      className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
      onClick={onClick}
    >
      <div
        className={`bg-gradient-to-br ${getCardGradient(
          weather.condition
        )} p-6 text-white`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <h3 className="font-semibold text-lg">{weather.city}</h3>
          </div>
          {getWeatherIcon(weather.condition)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5" />
            <span className="text-3xl font-bold">{weather.temperature}°C</span>
          </div>
          <p className="text-white/90 text-sm">{weather.condition}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/80">Toque para mais detalhes</p>
        </div>
      </div>
    </Card>
  );
};
