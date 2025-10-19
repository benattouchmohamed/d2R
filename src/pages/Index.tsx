import { useState, useEffect } from "react";
import { ScrollText, Megaphone, Gift } from "lucide-react";
import { DiamondBalance } from "@/components/DiamondBalance";
import { DailyChest } from "@/components/DailyChest";
import { QuestCard } from "@/components/QuestCard";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useDiamonds } from "@/contexts/DiamondContext";

const Index = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { diamonds, addDiamonds } = useDiamonds();
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [showDailyChest, setShowDailyChest] = useState(false);

  useEffect(() => {
    const lastClaim = localStorage.getItem('lastDailyChestClaim');
    const today = new Date().toDateString();
    
    if (!lastClaim || lastClaim !== today) {
      setShowDailyChest(true);
    } else {
      setDailyClaimed(true);
    }
  }, []);

  const handleDailyClaim = () => {
    if (!dailyClaimed) {
      addDiamonds(20);
      setDailyClaimed(true);
      setShowDailyChest(false);
      localStorage.setItem('lastDailyChestClaim', new Date().toDateString());
      showNotification(
        "Daily Reward Claimed!",
        "+20 Diamonds earned!",
        "success"
      );
    }
  };

  const handleOffersWall = () => {
    navigate("/offers");
  };

  const handleShareAndPlay = () => {
    navigate("/share");
  };

  const handleExchange = () => {
    navigate("/exchange");
  };

  const handleEvents = () => {
    navigate("/play-and-earn");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20 pb-8">
      <div className="max-w-md mx-auto w-full space-y-4">
        {/* Logo/Title */}
        <div className="text-center mb-2">
          <h1 className="text-5xl font-black leading-tight">
            <span className="block text-[#4dd4ff] text-stroke-white drop-shadow-xl">DIAMOND</span>
            <span className="block text-[#ffd700] text-stroke-dark drop-shadow-xl">QUEST</span>
            <span className="block text-[#ffd700] text-stroke-dark drop-shadow-xl">ARENA</span>
          </h1>
          
        </div>

        {/* Diamond Balance */}
        <div className="flex justify-center">
          <DiamondBalance amount={diamonds} />
        </div>

        {/* Daily Chest Button - Only shown on first open */}
        {showDailyChest && (
          <div className="flex justify-center">
            <DailyChest onClaim={handleDailyClaim} claimed={dailyClaimed} />
          </div>
        )}

        {/* Three Cards */}
        <div className="grid grid-cols-3 gap-3">
          <QuestCard
            title="Offers"
            icon={ScrollText}
            onClick={handleOffersWall}
          />
          
          <QuestCard
            title="Share"
            icon={Megaphone}
            onClick={handleShareAndPlay}
          />
          
          <QuestCard
            title="Exchange"
            icon={Gift}
            onClick={handleExchange}
          />
        </div>

        {/* Events Button */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="blue" 
            size="lg"
            className="w-full max-w-md"
            onClick={handleEvents}
          >
            Events
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
