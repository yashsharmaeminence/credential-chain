import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Overview from "@/pages/app/Overview";
import Manuscripts from "@/pages/app/Manuscripts";
import ManuscriptDetail from "@/pages/app/ManuscriptDetail";
import Reviews from "@/pages/app/Reviews";
import ReviewDetail from "@/pages/app/ReviewDetail";
import ReviewerNetwork from "@/pages/app/ReviewerNetwork";
import Credentials from "@/pages/app/Credentials";
import InstitutionConsole from "@/pages/app/InstitutionConsole";
import Developers from "@/pages/app/Developers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/app" element={<Navigate to="/app/overview" replace />} />
            <Route path="/app" element={<AppLayout />}>
              <Route path="overview" element={<Overview />} />
              <Route path="manuscripts" element={<Manuscripts />} />
              <Route path="manuscripts/:id" element={<ManuscriptDetail />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="reviews/:txHash" element={<ReviewDetail />} />
              <Route path="reviewer-network" element={<ReviewerNetwork />} />
              <Route path="credentials" element={<Credentials />} />
              <Route path="institution-console" element={<InstitutionConsole />} />
              <Route path="developers" element={<Developers />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
