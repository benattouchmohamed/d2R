import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Gem, Timer, Trophy, PlayCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDiamonds } from "@/contexts/DiamondContext";
import { fetchOffers, Offer } from "@/services/offersApi";

interface Diamond {
  id: number;
  x: number;
  y: number;
}

const DiamondRush = () => {
  const navigate = useNavigate();
  const { addDiamonds } = useDiamonds();
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [collectedDiamonds, setCollectedDiamonds] = useState(0);
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [showOffer, setShowOffer] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [offerCooldown, setOfferCooldown] = useState(false);
  
  const gameActiveRef = useRef(false);
  const collectedRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_DIAMONDS = 100;

  useEffect(() => {
    const lastPlayed = localStorage.getItem('diamondRushLastPlayed');
    const today = new Date().toDateString();
    const offerStatus = localStorage.getItem('diamondRushOfferShown');
    
    if (lastPlayed === today) {
      setCanPlay(false);
      // Show offers button unless offer was successfully completed today
      if (!offerStatus || offerStatus !== 'completed') {
        setShowOffersButton(true);
      }
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, []);

  const loadOffer = async () => {
    if (loadingOffer || offerCooldown) return;
    
    setLoadingOffer(true);
    setOfferCooldown(true);
    setTimeout(() => setOfferCooldown(false), 30000); // 30s cooldown
    
    try {
      const offers = await fetchOffers();
      if (offers.length > 0) {
        const topOffer = offers[0];
        setCurrentOffer(topOffer);
        setShowOffer(true);
        localStorage.setItem('diamondRushOfferShown', Date.now().toString());
      } else {
        // No offers available, mark as checked
        localStorage.setItem('diamondRushOfferShown', 'no-offers');
      }
    } catch (error) {
      console.error('Failed to load offer:', error);
      localStorage.setItem('diamondRushOfferShown', 'error');
    } finally {
      setLoadingOffer(false);
    }
  };

  const showOfferManually = () => {
    loadOffer();
  };

  const completeOffer = async () => {
    if (!currentOffer) return;
    
    // Mark as completed to prevent showing same offer again today
    localStorage.setItem('diamondRushOfferShown', 'completed');
    setShowOffersButton(false);
    setShowOffer(false);
    
    window.open(currentOffer.url, '_blank', 'noopener,noreferrer');
    
    // Your external detector will handle verification and unlock game
    // When verification completes successfully, call onOfferVerified()
  };

  // Call this when external offer verification succeeds
  const onOfferVerified = () => {
    localStorage.removeItem('diamondRushLastPlayed');
    localStorage.removeItem('diamondRushOfferShown');
    setCanPlay(true);
    setShowOffersButton(false);
    // Optionally reset game state or show success message
    alert('Offer verified! You can play again now!');
  };

  const getIconComponent = (icon: string) => {
    const icons = {
      game: PlayCircle,
      survey: Trophy,
      app: Gem,
      video: Timer,
      social: Gem,
      gift: Trophy,
      default: Gem
    };
    const IconComponent = icons[icon as keyof typeof icons] || Gem;
    return <IconComponent className="w-6 h-6" />;
  };

  const getOffersButton = () => {
    if (loadingOffer || offerCooldown) {
      return (
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full border-yellow-400 text-yellow-300 bg-yellow-500/10 font-bold shadow-lg"
          disabled
        >
          <Plus className="w-5 h-5 mr-2" />
          {loadingOffer ? "Loading Offers..." : "⏳ Please wait..."}
        </Button>
      );
    }
    
    if (!showOffersButton) return null;
    
    return (
      <Button 
        variant="outline" 
        size="lg" 
        className="w-full border-yellow-400 text-yellow-300 hover:bg-yellow-500/20 bg-yellow-500/10 font-bold shadow-lg"
        onClick={showOfferManually}
      >
        <Plus className="w-5 h-5 mr-2" />
        🎁 Get Free Game Now
      </Button>
    );
  };

  const startGame = () => {
    if (!canPlay || gameActiveRef.current) return;
    
    gameActiveRef.current = true;
    collectedRef.current = 0;
    setCollectedDiamonds(0);
    setGameStarted(true);
    setGameOver(false);
    setTimeLeft(25);
    setDiamonds([]);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    
    localStorage.setItem('diamondRushLastPlayed', new Date().toDateString());
    setCanPlay(false);
    // Always show offers button after playing
    setShowOffersButton(true);
  };

  const collectDiamond = useCallback((id: number) => {
    if (!gameActiveRef.current || collectedRef.current >= MAX_DIAMONDS) return;
    
    setDiamonds(prev => prev.filter(d => d.id !== id));
    
    collectedRef.current += 1;
    if (collectedRef.current <= MAX_DIAMONDS) {
      setCollectedDiamonds(collectedRef.current);
    }
  }, []);

  const generateDiamond = useCallback(() => {
    if (!gameActiveRef.current || collectedRef.current >= MAX_DIAMONDS) return;
    
    const newDiamond: Diamond = {
      id: Date.now() + Math.random(),
      x: Math.random() * 85,
      y: Math.random() * 70 + 10,
    };
    setDiamonds(prev => [...prev, newDiamond]);

    setTimeout(() => {
      if (gameActiveRef.current && collectedRef.current < MAX_DIAMONDS) {
        setDiamonds(prev => prev.filter(d => d.id !== newDiamond.id));
      }
    }, 2000);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 || collectedRef.current >= MAX_DIAMONDS) {
          gameActiveRef.current = false;
          setGameOver(true);
          setGameStarted(false);
          if (timerRef.current) clearInterval(timerRef.current);
          if (spawnRef.current) clearInterval(spawnRef.current);
          
          const finalDiamonds = Math.min(collectedRef.current, MAX_DIAMONDS);
          addDiamonds(finalDiamonds);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(generateDiamond, 700);

    return () => {
      gameActiveRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameStarted, gameOver, generateDiamond, addDiamonds]);

  const resetGame = () => {
    gameActiveRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    window.location.reload();
  };

  const isMaxReached = collectedRef.current >= MAX_DIAMONDS;
  const [showOffersButton, setShowOffersButton] = useState(false); // Add this missing state

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20">
      <div className="max-w-md mx-auto w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/play-and-earn")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-4xl font-black text-[#4dd4ff]">DIAMOND RUSH</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-b from-[#4da6ff] to-[#1a66cc] rounded-3xl p-4 text-center">
            <Timer className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white font-bold text-sm">TIME</p>
            <p className="text-4xl font-black text-white">{timeLeft}s</p>
          </div>
          <div className={`rounded-3xl p-4 text-center ${isMaxReached ? 'bg-gradient-to-b from-green-500 to-green-600' : 'bg-gradient-to-b from-[#ffd700] to-[#ff9500]'}`}>
            <Gem className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white font-bold text-sm">COLLECTED</p>
            <p className="text-4xl font-black text-white">
              {collectedDiamonds}/{MAX_DIAMONDS}
            </p>
          </div>
        </div>

        <div className="relative bg-gradient-to-b from-[#1a2a5e]/80 to-[#0a1e4d]/80 rounded-3xl border min-h-[400px] overflow-hidden">
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <h2 className="text-3xl font-black text-[#ffd700]">MEDIUM MODE</h2>
              <p className="text-white text-center">25 seconds • Max 100 diamonds • Once per day</p>
              <p className="text-yellow-300">Diamonds stay 2 seconds each</p>
              <Button 
                variant="gold" 
                size="xl" 
                onClick={startGame} 
                disabled={!canPlay}
                className={`mb-4 ${!canPlay ? 'opacity-50 cursor-not-allowed bg-gray-600' : ''}`}
              >
                {canPlay ? " START GAME" : " PLAYED TODAY"}
              </Button>
              
              {/* Always show offers button when can't play */}
              {!canPlay && getOffersButton()}
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center">
              <h2 className="text-5xl font-black text-[#ffd700] flex items-center gap-3">
                <Trophy className="w-12 h-12" /> GAME OVER
              </h2>
              <p className="text-3xl font-black text-white">
                {collectedDiamonds} Diamonds!
              </p>
              {isMaxReached && <p className="text-2xl text-green-400">MAX REWARD!</p>}
              <Button variant="gold" onClick={resetGame} className="mb-4">
                PLAY TOMORROW
              </Button>
              
              {/* Always show offers button after game over */}
              {getOffersButton()}
            </div>
          )}

          {gameStarted && !gameOver && (
            <div className="absolute inset-0 p-4">
              {diamonds.map(diamond => (
                <button
                  key={diamond.id}
                  onClick={() => collectDiamond(diamond.id)}
                  disabled={isMaxReached}
                  className="absolute p-2 hover:scale-110 active:scale-95 rounded-full disabled:opacity-50"
                  style={{ 
                    left: `${diamond.x}%`, 
                    top: `${diamond.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Gem className="w-12 h-12 text-cyan-300 drop-shadow-2xl" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Offer Modal */}
        {showOffer && currentOffer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/20 max-w-md w-full">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  {getIconComponent(currentOffer.icon)}
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Special Offer</h2>
                <p className="text-yellow-300 font-bold">Complete = Free Game</p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-bold text-white">{currentOffer.title}</h3>
                <p className="text-gray-200 text-sm">{currentOffer.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-300">{currentOffer.timeEstimate}</span>
                  <span className="text-green-300">{currentOffer.difficulty}</span>
                </div>
                
                {currentOffer.image ? (
                  <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                    <img 
                      src={currentOffer.image} 
                      alt={currentOffer.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    {getIconComponent(currentOffer.icon)}
                  </div>
                )}
              </div>

              <Button 
                variant="gold" 
                size="xl" 
                className="w-full mb-4" 
                onClick={completeOffer}
              >
                
                Complete Offer Now
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setShowOffer(false);
                  localStorage.setItem('diamondRushOfferShown', 'skipped');
                }}
              >
                Skip for Now
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white/10 rounded-3xl p-4 border-2 border-white/20">
          <p className="text-white font-bold text-center flex items-center justify-center gap-2">
            <Gem className="w-5 h-5" />
            Tap as many diamonds as you can before time runs out! Complete offers for free games.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiamondRush;