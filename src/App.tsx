import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PersonalInfoProvider } from "@/contexts/PersonalInfoContext";
import { CompaniesProvider } from "@/contexts/CompaniesContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PersonalInfoProvider>
        <CompaniesProvider>
          <DashboardProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </DashboardProvider>
        </CompaniesProvider>
      </PersonalInfoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
