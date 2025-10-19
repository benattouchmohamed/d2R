import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Gift,
  Star,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext";
import { fetchOffers, Offer } from "@/services/offersApi";

const Offers = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      const fetchedOffers = await fetchOffers();

      // Filter logic
      const cpiOffers = fetchedOffers.filter(
        (offer) => offer.type?.toLowerCase() === "cpi"
      );
      const pinOffers = fetchedOffers.filter((offer) =>
        offer.type?.toLowerCase().includes("pin")
      );

      if (cpiOffers.length > 0) {
        setOffers(cpiOffers);
      } else if (pinOffers.length > 0) {
        setOffers(pinOffers);
      } else {
        setOffers(fetchedOffers);
      }

      setLoading(false);
    };

    loadOffers();
  }, []);

  const handleOfferClick = (offer: Offer) => {
    window.open(offer.url, "_blank");
    showNotification(
      "Offer Opened!",
      `Complete "${offer.title}" to earn your reward!`,
      "info"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20 pb-8">
      <div className="max-w-md mx-auto w-full space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-4xl font-black text-[#4dd4ff] drop-shadow-xl">
            OFFERS WALL
          </h1>
        </div>

        {/* ✨ Start Offer Promo Section */}
        <div className="relative bg-gradient-to-r from-[#ff0080] via-[#ff9500] to-[#ffd700] rounded-3xl p-[3px] shadow-2xl hover:scale-105 transition-transform">
          <div className="bg-[#0a1e4d]/90 rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ff9500] drop-shadow-lg tracking-widest animate-pulse">
              START YOUR FIRST OFFER!
            </h2>
            <p className="text-white/80 font-semibold text-sm max-w-xs">
              Complete your first offer and instantly earn a{" "}
              <span className="text-[#ffd700] font-black">+500 DIAMONDS</span>{" "}
              bonus.
            </p>
           
            {/* Floating bonus badge */}
            <div className="absolute -top-5 -right-5 bg-[#ffd700] text-black font-black text-xs px-3 py-1 rounded-full shadow-lg rotate-6">
              +500 BONUS
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-b from-[#ffd700] via-[#ffb900] to-[#ff9500] rounded-3xl p-4 border-thick-gold flex items-center justify-center gap-2">
          <Gift className="w-6 h-6 text-white" />
          <p className="text-white font-black text-center text-lg">
            Complete offers to earn diamonds!
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#4dd4ff]"></div>
            <p className="text-white font-bold mt-4 text-xl">Loading offers...</p>
          </div>
        )}

        {/* No Offers State */}
        {!loading && offers.length === 0 && (
          <div className="bg-white/10 rounded-3xl p-8 border-2 border-white/20 text-center">
            <Gift className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white font-bold text-xl">
              No offers available right now
            </p>
            <p className="text-white/90 font-bold mt-2">
              Check back later for new offers!
            </p>
          </div>
        )}

        {/* Offers List */}
        {!loading && offers.length > 0 && (
          <div className="space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-gradient-to-b from-[#4da6ff] to-[#1a66cc] rounded-2xl p-4 border-thick hover:scale-[1.01] active:scale-95 transition-transform"
              >
                <div className="flex gap-3">
                  {offer.image && (
                    <div className="shrink-0 rounded-xl overflow-hidden w-20 h-20">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-black text-white line-clamp-2 flex-1">
                        {offer.title}
                      </h3>
                      <div className="bg-[#ffd700] rounded-lg px-2 py-1 shrink-0">
                        <p className="text-white font-black text-xs">
                          +500 💎
                        </p>
                      </div>
                    </div>

                    <p className="text-white/90 text-sm font-semibold mb-2 line-clamp-1">
                      {offer.description}
                    </p>

                    <div className="flex items-center gap-3 text-white/90 text-xs mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-300" />
                        <span className="font-bold">{offer.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="font-bold">{offer.timeEstimate}</span>
                      </div>
                      {offer.type && (
                        <div className="bg-white/20 rounded px-1.5 py-0.5">
                          <span className="font-bold uppercase">
                            {offer.type}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm bg-gradient-to-r from-[#ff00ff] to-[#00ffff] hover:from-[#00ffff] hover:to-[#ff00ff] text-white font-bold rounded-2xl shadow-lg shadow-[#ff00ff]/30 transition-all duration-500"
                      onClick={() => handleOfferClick(offer)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      START OFFER
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {!loading && (
          <Button
            variant="blue"
            size="lg"
            className="w-full gap-2 mt-4"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-5 h-5" />
            REFRESH OFFERS
          </Button>
        )}
      </div>
    </div>
  );
};

export default Offers;
