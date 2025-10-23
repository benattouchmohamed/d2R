import React, { useState } from "react";
import { ArrowLeft, Gem, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import diamondIcon from "@/assets/diamond-icon.png";
import rob from "@/assets/roblox-icon.png";
import { useDiamonds } from "@/contexts/DiamondContext";
import { useRobloxUser } from "@/contexts/RobloxUserContext";
import { DiamondBalance } from "@/components/DiamondBalance";
import { Helmet } from "react-helmet-async";

interface ExchangeRate {
  diamonds: number;
  reward: string;
}

interface ExchangeOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  rates: ExchangeRate[];
}

// Example exchange options
const exchangeOptions: ExchangeOption[] = [
  {
    id: "roblox",
    name: "ROBLOX",
    icon: rob,
    color: "from-[#e21c3a] to-[#b01629]",
    bgColor: "bg-[#e21c3a]",
    rates: [{ diamonds: 1000, reward: "1M Robux" }],
  },
  {
    id: "99night",
    name: "99 NIGHT",
    icon: diamondIcon,
    color: "from-[#00d4ff] to-[#00ff88]",
    bgColor: "bg-[#00d4ff]",
    rates: [{ diamonds: 1000, reward: "100k Night Diamonds" }],
  },
];

const Exchange = () => {
  const navigate = useNavigate();
  const { diamonds } = useDiamonds();
  const { user } = useRobloxUser();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<{
    option: ExchangeOption;
    rate: ExchangeRate;
  } | null>(null);

  const handleExchange = (option: ExchangeOption, rate: ExchangeRate) => {
    if (diamonds >= rate.diamonds) {
      setSelectedExchange({ option, rate });
      setIsConfirmDialogOpen(true);
    } else {
      toast({
        title: "Not Enough Diamonds",
        description: `You need ${rate.diamonds.toLocaleString()} diamonds!`,
        variant: "destructive",
      });
    }
  };

  const handleConfirmExchange = () => {
    if (!selectedExchange || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to exchange.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "SUCCESS!",
      description: `${selectedExchange.rate.reward} processing for ${user.username}...`,
    });

    localStorage.setItem(
      "lastExchange",
      JSON.stringify({
        username: user.username,
        game: selectedExchange.option.name,
        reward: selectedExchange.rate.reward,
        timestamp: new Date().toISOString(),
      })
    );

    setIsConfirmDialogOpen(false);
    setSelectedExchange(null);
  };

  return (
    <>
      {/* SEO + OG + Twitter */}
      <Helmet>
        <title>Exchange Diamonds for Robux 2025 | Free Robux Site | D2R.site</title>
        <meta
          name="description"
          content="Exchange your diamonds for free Robux safely in 2025! Fast, legit, and working Roblox rewards. Start earning Robux, Robux APK, and more on D2R.site."
        />
        <meta
          name="keywords"
          content="free robux, robux, robux apk, roblox games, diamonds exchange, robux exchange, get robux, earn robux, robux rewards, roblox rewards"
        />
        <link rel="canonical" href="https://d2r.site/exchange" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Exchange Diamonds for Robux 2025 | Free Robux Site | D2R.site"
        />
        <meta
          property="og:description"
          content="Convert your diamonds into free Robux safely. Updated for 2025 with legit Roblox rewards, giveaways, and offers. D2R.site."
        />
        <meta property="og:url" content="https://d2r.site/exchange" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="D2R.site" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Exchange Diamonds for Robux 2025 | Free Robux Site"
        />
        <meta
          name="twitter:description"
          content="Convert diamonds to Robux safely with D2R.site. Roblox offers, giveaways, and APK rewards for 2025."
        />
      </Helmet>

      {/* Page content starts here */}
      <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-4xl font-black text-[#ffd700] text-stroke-dark drop-shadow-2xl">
            EXCHANGE
          </h1>
        </div>

        {/* Diamond Balance */}
        <div className="flex justify-center my-4">
          <DiamondBalance amount={diamonds} />
        </div>

        {/* Exchange Options */}
        <div className="space-y-4">
          {exchangeOptions.map((option) =>
            option.rates.map((rate, idx) => (
              <div
                key={`${option.id}-${idx}`}
                className={`rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl hover:scale-105 transition-transform bg-gradient-to-b ${option.color}`}
              >
                <div className="bg-black/40 p-4 flex items-center gap-4">
                  <div className={`${option.bgColor} rounded-2xl p-3 shadow-xl`}>
                    <img src={option.icon} alt={option.name} className="w-12 h-12 object-contain" />
                  </div>
                  <h3 className="text-2xl font-black text-white flex-1">{option.name}</h3>
                </div>

                <div className="p-4 space-y-4">
                  <div className="bg-white/20 rounded-2xl p-4 border-2 border-white/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-[#ffd700] to-[#ff9500] rounded-xl p-2">
                          <Gem className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs uppercase font-bold">COST</p>
                          <p className="text-xl font-black text-white">{rate.diamonds.toLocaleString()}</p>
                          <p className="text-xs text-white/60">OUR DIAMONDS</p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-[#ffd700]">→</div>
                      <div className="text-right">
                        <p className="text-white/80 text-xs uppercase font-bold">GET</p>
                        <p className="text-xl font-black text-[#ffd700]">{rate.reward}</p>
                        <p className="text-xs text-white/60">{option.name} CURRENCY</p>
                      </div>
                    </div>
                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full font-black text-lg shadow-2xl"
                      onClick={() => handleExchange(option, rate)}
                      disabled={diamonds < rate.diamonds}
                    >
                      {diamonds >= rate.diamonds ? "EXCHANGE NOW" : "NOT ENOUGH"}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Exchange;
