import { configureApi } from "@ahmedrioueche/gympro-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import "./i18n";
import "./index.css";
import { router } from "./routers/index.ts";

configureApi({
  isDev: import.meta.env.VITE_IS_DEV === "true",
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster position={"top-right"} />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
