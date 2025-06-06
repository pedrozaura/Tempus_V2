import { useState } from "react";

type ToastParams = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const toast = ({ title, description, variant }: ToastParams) => {
    // Exemplo simples — combine as mensagens
    setMessage(
      `${variant === "destructive" ? "❌ " : "ℹ️ "}${title}${
        description ? " - " + description : ""
      }`
    );
    setTimeout(() => setMessage(null), 3000);
  };

  const ToastComponent = () =>
    message ? (
      <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
        {message}
      </div>
    ) : null;

  return { toast, ToastComponent };
}
