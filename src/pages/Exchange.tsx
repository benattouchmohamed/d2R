import { useState } from "react";
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
  const { diamonds, addDiamonds } = useDiamonds();
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20 pb-8">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-4xl font-black text-[#ffd700] text-stroke-dark drop-shadow-2xl">
            EXCHANGE
          </h1>
        </div>

        {/* 💎 Diamond Balance */}
        <div className="flex justify-center">
          <DiamondBalance amount={diamonds} />
        </div>

        {/* Game Cards */}
        <div className="space-y-4">
          {exchangeOptions.map((option) => (
            <div
              key={option.id}
              className={`rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl hover:scale-105 transition-transform bg-gradient-to-b ${option.color}`}
            >
              <div className="bg-black/40 p-4">
                <div className="flex items-center gap-4">
                  <div className={`${option.bgColor} rounded-2xl p-3 shadow-xl`}>
                    <img
                      src={option.icon}
                      alt={option.name}
                      className="w-12 h-12 object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-white text-stroke-dark flex-1">
                    {option.name}
                  </h3>
                </div>
              </div>

              {/* Rates */}
              <div className="p-4 space-y-4">
                {option.rates.map((rate, index) => (
                  <div
                    key={index}
                    className="bg-white/20 rounded-2xl p-4 border-2 border-white/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-[#ffd700] to-[#ff9500] rounded-xl p-2">
                          <Gem className="w-6 h-6 text-black drop-shadow-lg" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs uppercase font-bold">COST</p>
                          <p className="text-xl font-black text-white">
                            {rate.diamonds.toLocaleString()}
                          </p>
                          <p className="text-xs text-white/60">OUR DIAMONDS</p>
                        </div>
                      </div>

                      <div className="text-2xl font-black text-[#ffd700]">→</div>

                      <div className="text-right">
                        <p className="text-white/80 text-xs uppercase font-bold">GET</p>
                        <p className="text-xl font-black text-[#ffd700]">
                          {rate.reward}
                        </p>
                        <p className="text-xs text-white/60">
                          {option.name} CURRENCY
                        </p>
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
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Offer CTA */}
        <div className="relative bg-gradient-to-r from-[#ff0080] via-[#ff9500] to-[#ffd700] rounded-3xl p-[3px] shadow-2xl hover:scale-105 transition-transform">
          <div className="bg-[#0a1e4d]/90 rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ff9500] drop-shadow-lg tracking-widest animate-pulse">
              START YOUR FIRST OFFER!
            </h2>
            <p className="text-white/80 font-semibold text-sm max-w-xs">
              Complete your first offer and instantly earn a{" "}
              <span className="text-[#ffd700] font-black">+500 DIAMONDS</span> bonus.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-[#ffd700] to-[#ff9500] hover:from-[#ffb700] hover:to-[#fff700] text-black font-black text-lg py-6 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all animate-bounce"
            >
              <Link to="/offers">🚀 START OFFER NOW</Link>
            </Button>
            <div className="absolute -top-5 -right-5 bg-[#ffd700] text-black font-black text-xs px-3 py-1 rounded-full shadow-lg rotate-6">
              +500 BONUS
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="bg-gradient-to-b from-[#e21c3a]/20 to-[#b01629]/20 border-4 border-[#e21c3a]/30 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white text-stroke-dark">
              EXCHANGE REVIEW
            </DialogTitle>
            <DialogDescription className="text-white/90 font-bold">
              {selectedExchange && user && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                    <User className="w-5 h-5 text-[#ffd700]" />
                    <span className="font-black">Username: {user.username}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                    <Gem className="w-5 h-5 text-[#ffd700]" />
                    <span className="font-black">
                      Cost: {selectedExchange.rate.diamonds.toLocaleString()} Diamonds
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-yellow-300">
                      Processing: 24-48 hours
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-[#ffd700] to-[#ff9500] text-black rounded-xl p-3 text-center font-black">
                    RECEIVE: {selectedExchange.rate.reward} in{" "}
                    {selectedExchange.option.name}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10 flex-1"
            >
              CANCEL
            </Button>
            <Button
              variant="gold"
              onClick={handleConfirmExchange}
              className="flex-1 font-black text-lg"
            >
              CONFIRM & SEND
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exchange;
