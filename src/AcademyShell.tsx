import { Toaster } from "@/components/ui/toaster";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CursoRoutes } from "./routes/curso-routes";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Componente para manejar el redirect desde 404.html
const RedirectHandler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      const path = redirect.replace(/^\/plataformash/, '');
      if (path && path !== '/' && path !== '') {
        navigate(path);
      }
    }
  }, [navigate]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        {/* <Sonner /> */}
        <BrowserRouter basename={import.meta.env.PROD ? "/plataformash/" : "/"}>
          <RedirectHandler>
            <CursoRoutes />
          </RedirectHandler>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
