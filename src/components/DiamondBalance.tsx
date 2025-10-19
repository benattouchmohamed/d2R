import { Gem } from "lucide-react";

interface DiamondBalanceProps {
  amount: number;
}

export const DiamondBalance = ({ amount }: DiamondBalanceProps) => {
  return (
    <div className="flex items-center justify-center gap-4 bg-gradient-to-b from-[#4da6ff] to-[#1a66cc] rounded-3xl px-8 py-4 border-thick">
      <Gem className="w-12 h-12 text-cyan-300 drop-shadow-lg" />
      <span className="text-5xl font-black text-white text-stroke-dark">{amount}</span>
    </div>
  );
};
