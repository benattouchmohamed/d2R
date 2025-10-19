import { useState } from "react";
import { ArrowLeft, Gamepad2, Trophy, Zap, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext";

const PlayAndEarn = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleGameClick = (gameName: string) => {
    if (gameName === "Lucky Spin") {
      navigate("/lucky-spin");
    } else if (gameName === "Diamond Rush") {
      navigate("/diamond-rush");
    } else if (gameName === "Tournament Arena") {
      navigate("/offers");
    } else {
      showNotification(
        "Game Starting Soon!",
        `${gameName} will be available soon!`,
        "info"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20 pb-8">
      <div className="max-w-md mx-auto w-full space-y-4">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0 border-white/30 bg-white/10 hover:bg-white/20"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-4xl font-black text-[#4dd4ff] text-stroke-white drop-shadow-xl">
            PLAY & EARN
          </h1>
        </div>

        {/* Events/Games Grid */}
        <div className="space-y-4">
          {/* Game Card 1 - Diamond Rush */}
          <button
            onClick={() => handleGameClick("Diamond Rush")}
            className="w-full bg-gradient-to-b from-[#4da6ff] to-[#1a66cc] rounded-3xl p-6 border-thick-blue hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-blue focus:outline-none focus:ring-4 focus:ring-blue-500/30 group border-2 border-white/20"
            aria-label="Play Diamond Rush - Collect diamonds in 60 seconds for 100 gems"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4 group-hover:bg-white/30 transition-colors duration-200">
                <Zap className="w-12 h-12 text-yellow-300 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-black text-white text-stroke-dark leading-tight">
                  DIAMOND RUSH
                </h3>
                <p className="text-white/90 font-bold mt-1">
                  Collect diamonds in 60 seconds!
                </p>
                <p className="text-yellow-300 font-black text-lg flex items-center gap-2 mt-2">
                  <span>Reward:</span>
                  <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                    100 <Gem className="w-5 h-5 inline text-green-400" />
                  </span>
                </p>
              </div>
            </div>
          </button>

          {/* Game Card 2 - Lucky Spin */}
          <button
            onClick={() => handleGameClick("Lucky Spin")}
            className="w-full bg-gradient-to-b from-[#4da6ff] to-[#1a66cc] rounded-3xl p-6 border-thick-blue hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-blue focus:outline-none focus:ring-4 focus:ring-blue-500/30 group border-2 border-white/20"
            aria-label="Play Lucky Spin - Spin the wheel for up to 500 gems"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4 group-hover:bg-white/30 transition-colors duration-200">
                <Gamepad2 className="w-12 h-12 text-yellow-300 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-black text-white text-stroke-dark leading-tight">
                  LUCKY SPIN
                </h3>
                <p className="text-white/90 font-bold mt-1">
                  Spin the wheel for prizes!
                </p>
                <p className="text-yellow-300 font-black text-lg flex items-center gap-2 mt-2">
                  <span>Reward:</span>
                  <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                    Up to 500 <Gem className="w-5 h-5 inline text-green-400" />
                  </span>
                </p>
              </div>
            </div>
          </button>

          {/* Game Card 3 - Tournament Arena */}
          <button
            onClick={() => handleGameClick("Tournament Arena")}
            className="w-full bg-gradient-to-b from-[#ffd700] via-[#ffb900] to-[#ff9500] rounded-3xl p-6 border-thick-gold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-gold focus:outline-none focus:ring-4 focus:ring-yellow-500/30 group border-2 border-white/20"
            aria-label="Enter Tournament Arena - View offers and compete for top prizes with 1000+ gems rewards"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4 group-hover:bg-white/30 transition-colors duration-200">
                <Trophy className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-black text-white text-stroke-dark leading-tight">
                  TOURNAMENT ARENA
                </h3>
                <p className="text-white/90 font-bold mt-1">
                  Compete for top prizes!
                </p>
                <p className="text-white font-black text-lg flex items-center gap-2 mt-2">
                  <span>Reward:</span>
                  <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                    1000+ <Gem className="w-5 h-5 inline text-green-400" />
                  </span>
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-white/10 rounded-3xl p-6 border-2 border-white/20">
          <h3 className="text-xl font-black text-[#ffd700] text-stroke-dark mb-2">
            HOW IT WORKS
          </h3>
          <p className="text-white/90 font-semibold leading-relaxed">
            Play games and complete challenges to earn diamonds! The more you play, the more you earn.
          </p>
          <ul className="text-white/80 font-medium mt-4 space-y-1 pl-4">
            <li>• Diamond Rush: Collect diamonds in 20 seconds</li>
            <li>• Lucky Spin: Spin for up to 500 gems</li>
            <li>• Tournament Arena: Check offers for epic competitions</li>
            <li>• Daily events and special challenges</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlayAndEarn;