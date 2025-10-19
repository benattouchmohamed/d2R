import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Gem, PlayCircle, Gamepad2, ClipboardList, Smartphone, Video, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDiamonds } from "@/contexts/DiamondContext";
import { fetchOffers, Offer } from "@/services/offersApi";

const prizes = [20, 49, 37, 19, 100, 99, 1];
const colors = ["#ffd700", "#4da6ff", "#ff9500", "#4dd4ff", "#ff0000", "#ffb900", "#1a8cff"];

const LuckySpin = () => {
  const navigate = useNavigate();
  const { addDiamonds } = useDiamonds();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [canPlay, setCanPlay] = useState(true);
  const [showOffer, setShowOffer] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [showOffersButton, setShowOffersButton] = useState(false);

  useEffect(() => {
    const lastPlayed = localStorage.getItem('luckySpinLastPlayed');
    const today = new Date().toDateString();
    const hasSeenOffer = localStorage.getItem('luckySpinOfferShown');
    
    if (lastPlayed === today) {
      setCanPlay(false);
      if (!hasSeenOffer) {
        setShowOffersButton(true);
        loadOffer();
      }
    }
  }, []);

  const loadOffer = async () => {
    if (loadingOffer) return;
    setLoadingOffer(true);
    
    try {
      const offers = await fetchOffers();
      if (offers.length > 0) {
        const topOffer = offers[0];
        setCurrentOffer(topOffer);
        setShowOffer(true);
        localStorage.setItem('luckySpinOfferShown', 'true');
      }
    } catch (error) {
      console.error('Failed to load offer:', error);
    } finally {
      setLoadingOffer(false);
    }
  };

  const showOfferManually = () => {
    loadOffer();
    setShowOffersButton(false);
  };

  const completeOffer = () => {
    if (!currentOffer) return;
    
    window.open(currentOffer.url, '_blank', 'noopener,noreferrer');
    setShowOffer(false);
    
    // Your external detector will handle verification and unlock spins
  };

  const showNotification = (title: string, message: string) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm bg-green-500 text-white animate-in slide-in-from-top-2`;
    notification.innerHTML = `<strong>${title}</strong><br><small>${message}</small>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 4000);
  };

  const getIconComponent = (icon: string) => {
    const icons = {
      game: Gamepad2,
      survey: ClipboardList,
      app: Smartphone,
      video: Video,
      social: Users,
      gift: Trophy,
      default: Gem
    };
    const IconComponent = icons[icon as keyof typeof icons] || Gem;
    return <IconComponent className="w-8 h-8" />;
  };

  const spinWheel = async () => {
    if (isSpinning || !canPlay) return;

    setIsSpinning(true);
    localStorage.setItem('luckySpinLastPlayed', new Date().toDateString());
    localStorage.removeItem('luckySpinOfferShown'); // Reset offer shown flag
    setCanPlay(false);
    setShowOffersButton(true); // Show offers button after spin

    const winningIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    const targetRotation = 360 * 5 + (360 - (winningIndex * segmentAngle + segmentAngle / 2));
    
    setRotation(targetRotation);

    setTimeout(() => {
      const prize = prizes[winningIndex];
      setTotalDiamonds(prev => prev + prize);
      addDiamonds(prize);
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20 pb-8">
      <div className="max-w-md mx-auto w-full space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/play-and-earn")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-4xl font-black text-[#ffd700] text-stroke-dark drop-shadow-xl">LUCKY SPIN</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-b from-[#4da6ff] to-[#1a66cc] rounded-3xl p-4 border-thick text-center">
            <p className="text-white/90 font-bold text-sm">SPINS LEFT</p>
            <p className="text-4xl font-black text-white text-stroke-dark">{canPlay ? '1' : '0'}</p>
          </div>
          <div className="bg-gradient-to-b from-[#ffd700] via-[#ffb900] to-[#ff9500] rounded-3xl p-4 border-thick-gold text-center">
            <p className="text-white/90 font-bold text-sm">TOTAL WON</p>
            <p className="text-4xl font-black text-white text-stroke-dark flex items-center justify-center gap-2">
              {totalDiamonds} <Gem className="w-8 h-8" />
            </p>
          </div>
        </div>

        {/* Wheel */}
        <div className="relative flex items-center justify-center py-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-[#ff0000] drop-shadow-xl" />
          </div>

          <div className="relative">
            <svg 
              width="300" 
              height="300" 
              viewBox="0 0 300 300" 
              className="drop-shadow-2xl"
              style={{ 
                transform: `rotate(${rotation}deg)`, 
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' 
              }}
            >
              <circle cx="150" cy="150" r="148" fill="none" stroke="white" strokeWidth="4" />
              
              {prizes.map((prize, index) => {
                const segmentAngle = 360 / prizes.length;
                const startAngle = index * segmentAngle - 90;
                const endAngle = startAngle + segmentAngle;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                const x1 = 150 + 145 * Math.cos(startRad);
                const y1 = 150 + 145 * Math.sin(startRad);
                const x2 = 150 + 145 * Math.cos(endRad);
                const y2 = 150 + 145 * Math.sin(endRad);
                const midAngle = (startAngle + endAngle) / 2;
                const textRad = (midAngle * Math.PI) / 180;
                const textX = 150 + 95 * Math.cos(textRad);
                const textY = 150 + 95 * Math.sin(textRad);

                return (
                  <g key={index}>
                    <path 
                      d={`M 150 150 L ${x1} ${y1} A 145 145 0 0 1 ${x2} ${y2} Z`} 
                      fill={colors[index]} 
                      stroke="white" 
                      strokeWidth="2" 
                    />
                    <text 
                      x={textX} 
                      y={textY} 
                      fill="white" 
                      fontSize="24" 
                      fontWeight="900" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      style={{ 
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)', 
                        transform: `rotate(${midAngle + 90}deg)`, 
                        transformOrigin: `${textX}px ${textY}px` 
                      }}
                    >
                      {prize}
                    </text>
                  </g>
                );
              })}
              
              <circle cx="150" cy="150" r="25" fill="white" stroke="#1a2a5e" strokeWidth="3" />
              <text x="150" y="155" fill="#1a2e5e" fontSize="16" fontWeight="900" textAnchor="middle">
                SPIN
              </text>
            </svg>
          </div>
        </div>

        {/* Spin Button */}
        <Button 
          variant="gold" 
          size="xl" 
          className="w-full" 
          onClick={spinWheel} 
          disabled={isSpinning || !canPlay}
        >
          <Trophy className="w-8 h-8" />
          {isSpinning ? "SPINNING..." : !canPlay ? "PLAYED TODAY" : "SPIN THE WHEEL"}
        </Button>

        {/* Offers Button - Shows for people who haven't seen offers */}
        {showOffersButton && !canPlay && !isSpinning && (
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full border-yellow-400 text-yellow-300 hover:bg-yellow-500/10"
            onClick={showOfferManually}
            disabled={loadingOffer}
          >
            <Plus className="w-5 h-5 mr-2" />
            {loadingOffer ? "Loading Offers..." : "Get Free Spins"}
          </Button>
        )}

        {/* Tomorrow Message */}
        {!canPlay && !isSpinning && !showOffersButton && (
          <div className="text-center py-4">
            <p className="text-yellow-300 font-bold text-lg mb-2">Come back tomorrow for another spin!</p>
          </div>
        )}

        {/* Real Offer Modal */}
        {showOffer && currentOffer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/20 max-w-md w-full">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  {getIconComponent(currentOffer.icon)}
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Special Offer</h2>
                <p className="text-yellow-300 font-bold">Complete = 20 FREE SPINS</p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-bold text-white">{currentOffer.title}</h3>
                <p className="text-gray-200 text-sm">{currentOffer.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-300">{currentOffer.timeEstimate}</span>
                  <span className="text-green-300">{currentOffer.difficulty}</span>
                </div>
                
                {/* Icon Style Short Image */}
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
                onClick={() => setShowOffer(false)}
              >
                Skip for Now
              </Button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-white/10 rounded-3xl p-4 border-2 border-white/20">
          <p className="text-white font-bold text-center flex items-center justify-center gap-2">
            <Gem className="w-5 h-5" />
            One spin per day + complete offers for free spins
          </p>
        </div>
      </div>
    </div>
  );
};

export default LuckySpin;