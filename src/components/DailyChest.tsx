import { Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DailyChestProps {
  onClaim: () => void;
  claimed: boolean;
}

export const DailyChest = ({ onClaim, claimed }: DailyChestProps) => {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    if (claimed || isClaiming) return;
    setIsClaiming(true);
    onClaim();
    setTimeout(() => setIsClaiming(false), 1500);
  };

  return (
    <Button 
      variant="gold" 
      size="xl"
      onClick={handleClaim}
      disabled={claimed || isClaiming}
      className={`
        w-full max-w-md mx-auto relative overflow-hidden
        ${isClaiming ? 'animate-pulse scale-105' : claimed ? 'bg-green-500' : ''}
        transition-all duration-500
      `}
    >
      {isClaiming ? (
        <Check className="w-10 h-10 animate-spin" />
      ) : claimed ? (
        <Check className="w-10 h-10" />
      ) : (
        <Gift className="w-10 h-10" />
      )}
      {isClaiming ? "Claiming..." : claimed ? "Claimed!" : "Claim Daily"}
    </Button>
  );
};