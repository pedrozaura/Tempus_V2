import { Card } from "@/components/ui/Card";
import { Cloud, Sun } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <div className="relative">
          <Sun className="h-16 w-16 text-yellow-400 mx-auto animate-spin" />
          <Cloud className="h-12 w-12 text-blue-400 absolute top-8 left-1/2 transform -translate-x-1/2 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Carregando</h2>
          <p className="text-gray-600">Buscando dados meteorológicos...</p>
        </div>

        <div className="flex space-x-1 justify-center">
          <div
            className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </Card>
    </div>
  );
};
