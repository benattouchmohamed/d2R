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
import { HelmetProvider } from "react-helmet-async";

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
  {/* Root / Home */}
  <Route path="/" element={<Index />} />
  <Route path="/free-robux" element={<Index />} /> {/* SEO alias for homepage */}

  {/* Exchange page */}
  <Route path="/exchange-diamonds-to-robux" element={<Exchange />} />
 <Route path="/exchange" element={<Exchange />} />
  <Route path="/share" element={<Share />} />
  <Route path="/play-and-earn" element={<PlayAndEarn />} />
  <Route path="/lucky-spin" element={<LuckySpin />} />
  <Route path="/diamond-rush" element={<DiamondRush />} />
  <Route path="/offers" element={<Offers />} />
  {/* Share page */}
  <Route path="/share-and-earn-robux" element={<Share />} />

  {/* Play & Earn */}
  <Route path="/play-and-earn-robux" element={<PlayAndEarn />} />

  {/* Lucky Spin */}
  <Route path="/robux-lucky-spin" element={<LuckySpin />} />

  {/* Diamond Rush */}
  <Route path="/diamond-rush-robux" element={<DiamondRush />} />
  <Route path="/free-robux-2025" element={<Index />} /> {/* SEO-friendly alias */}

  {/* Offers */}
  <Route path="/roblox-offers-and-rewards" element={<Offers />} />

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>

       
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <RobloxUserProvider>
        <DiamondProvider>
          <NotificationProvider>
            <NotificationContainer />
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
  </HelmetProvider>
);

export default App;
