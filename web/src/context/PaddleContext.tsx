import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

interface PaddleContextType {
  openCheckout: (options: {
    transactionId?: string;
    checkoutUrl?: string;
  }) => void;
  isReady: boolean;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

declare global {
  interface Window {
    Paddle?: any;
  }
}

export const PaddleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const { mode } = useTheme();

  useEffect(() => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    if (!token) {
      console.warn(
        "Paddle Client Token (VITE_PADDLE_CLIENT_TOKEN) is missing in .env"
      );
    }

    const initPaddle = () => {
      if (window.Paddle) {
        const environment =
          (import.meta.env.VITE_PADDLE_ENV as "sandbox" | "production") ||
          "sandbox";

        if (environment === "sandbox") {
          window.Paddle.Environment.set("sandbox");
        } else {
          window.Paddle.Environment.set("production");
        }

        window.Paddle.Initialize({
          token: token || "",
          eventCallback: (data: any) => {
            console.log("Paddle Event:", data);
            if (data.name === "checkout.completed") {
              const transactionId = data.data.transaction_id || data.data.id;
              window.location.href = `/payment/success?paddle_txn=${transactionId}`;
            }
          },
        });
        setIsReady(true);
      }
    };

    if (window.Paddle) {
      initPaddle();
    } else {
      const interval = setInterval(() => {
        if (window.Paddle) {
          initPaddle();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const openCheckout = ({
    transactionId,
    checkoutUrl,
  }: {
    transactionId?: string;
    checkoutUrl?: string;
  }) => {
    if (!window.Paddle) {
      console.warn("Paddle.js not loaded");
      return;
    }

    const settings: any = {
      displayMode: "overlay",
      theme: mode === "dark" ? "dark" : "light",
      allowLogout: false,
    };

    // CRITICAL: For server-side transactions, pass ONLY transactionId.
    // Passing both or the checkoutUrl (which contains the txn id in the query)
    // can cause 403 Forbidden errors or "Failed to retrieve JWT".
    window.Paddle.Checkout.open({
      settings,
      ...(transactionId
        ? { transactionId }
        : checkoutUrl
        ? { checkoutUrl }
        : {}),
    });
  };

  return (
    <PaddleContext.Provider value={{ openCheckout, isReady }}>
      {children}
    </PaddleContext.Provider>
  );
};

export const usePaddle = () => {
  const context = useContext(PaddleContext);
  if (context === undefined) {
    throw new Error("usePaddle must be used within a PaddleProvider");
  }
  return context;
};
