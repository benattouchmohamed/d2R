import { useState, useEffect } from "react";
import { ScrollText, Megaphone, Gift } from "lucide-react";
import { DiamondBalance } from "@/components/DiamondBalance";
import { DailyChest } from "@/components/DailyChest";
import { QuestCard } from "@/components/QuestCard";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useDiamonds } from "@/contexts/DiamondContext";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { diamonds, addDiamonds } = useDiamonds();
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [showDailyChest, setShowDailyChest] = useState(false);

  useEffect(() => {
    const lastClaim = localStorage.getItem("lastDailyChestClaim");
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
      localStorage.setItem("lastDailyChestClaim", new Date().toDateString());
      showNotification("Daily Reward Claimed!", "+20 Diamonds earned!", "success");
    }
  };

  const handleOffersWall = () => navigate("/offers");
  const handleShareAndPlay = () => navigate("/share");
  const handleExchange = () => navigate("/exchange");
  const handleEvents = () => navigate("/play-and-earn");

  return (
    <>
      {/* SEO Meta + OG + Twitter */}
      <Helmet>
        <title>Free Robux 2025 | Earn Robux Fast & Safe | D2R.site</title>
        <meta
          name="description"
          content="Get free Robux safely in 2025! Discover 100% working and legit ways to earn Robux — no scams. Learn official Roblox events, gift cards, promo codes. Updated daily on D2R.site."
        />
        <meta
          name="keywords"
          content="free robux, robux, robux apk, roblox games, earn robux, robux 2025, robux giveaway, robux codes"
        />
        <link rel="canonical" href="https://d2r.site/" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Free Robux 2025 — 100% Working & Safe Methods | D2R.site"
        />
        <meta
          property="og:description"
          content="Learn how to get free Robux safely — official ways, giveaways, and promo codes. No scams, no hacks."
        />
        <meta property="og:url" content="https://d2r.site/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="D2R.site" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Robux 2025 | Earn Robux Safely" />
        <meta
          name="twitter:description"
          content="Legit ways to earn free Robux — giveaways, promo codes, and rewards. Updated 2025."
        />
      </Helmet>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Can I really get free Robux?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, only through official Roblox methods like events, gift cards, and the Roblox creator program. Avoid scams."
              }
            },
            {
              "@type": "Question",
              "name": "Are Robux APKs safe?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Most Robux APKs are scams and can steal your account. Only download apps from official Roblox sources or trusted events."
              }
            }
          ]
        }
      `,
        }}
      />

      {/* Page Content */}
      <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20 pb-8">
        <div className="max-w-md mx-auto w-full space-y-4">
          {/* Logo/Title */}
          <div className="text-center mb-2">
            <h1 className="text-5xl font-black leading-tight">
              <span className="block text-[#4dd4ff] text-stroke-white drop-shadow-xl">
                FREE
              </span>
              <span className="block text-[#ffd700] text-stroke-dark drop-shadow-xl">
                ROBUX
              </span>
              <span className="block text-[#ffd700] text-stroke-dark drop-shadow-xl">
                2025
              </span>
            </h1>
          </div>

          {/* Diamond Balance */}
          <div className="flex justify-center">
            <DiamondBalance amount={diamonds} />
          </div>

          {/* Daily Chest */}
          {showDailyChest && (
            <div className="flex justify-center">
              <DailyChest onClaim={handleDailyClaim} claimed={dailyClaimed} />
            </div>
          )}

          {/* Three Quest Cards */}
          <div className="grid grid-cols-3 gap-3">
            <QuestCard title="Offers" icon={ScrollText} onClick={handleOffersWall} />
            <QuestCard title="Share" icon={Megaphone} onClick={handleShareAndPlay} />
            <QuestCard title="Exchange" icon={Gift} onClick={handleExchange} />
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
    </>
  );
};

export default Index;
