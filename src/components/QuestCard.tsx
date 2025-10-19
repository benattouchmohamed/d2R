import { LucideIcon } from "lucide-react";

interface QuestCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const QuestCard = ({ 
  title, 
  icon: Icon, 
  onClick,
}: QuestCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#4da6ff] to-[#1a66cc] rounded-3xl p-6 border-thick hover:scale-105 active:scale-95 transition-transform aspect-square w-full"
    >
      <Icon className="w-16 h-16 text-yellow-300 drop-shadow-lg" />
      <span className="text-xl font-black text-white text-stroke-dark uppercase">{title}</span>
    </button>
  );
};
