import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DiamondProvider } from "@/contexts/DiamondContext";
import { RobloxUserProvider, useRobloxUser } from "@/contexts/RobloxUserContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationContainer } from "@/components/NotificationContainer";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import RobloxLogin from "./pages/RobloxLogin";
import Exchange from "./pages/Exchange";
import Share from "./pages/Share";
import PlayAndEarn from "./pages/PlayAndEarn";
import LuckySpin from "./pages/LuckySpin";
import DiamondRush from "./pages/DiamondRush";
import Offers from "./pages/Offers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useRobloxUser();

  if (!user) {
    return <RobloxLogin />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/share" element={<Share />} />
        <Route path="/play-and-earn" element={<PlayAndEarn />} />
        <Route path="/lucky-spin" element={<LuckySpin />} />
        <Route path="/diamond-rush" element={<DiamondRush />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RobloxUserProvider>
      <DiamondProvider>
        <NotificationProvider> {/* ✅ Wrap everything that uses useNotification */}
          <NotificationContainer /> {/* ✅ Make sure notifications show */}
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </DiamondProvider>
    </RobloxUserProvider>
  </QueryClientProvider>
);

export default App;
