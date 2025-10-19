import { ArrowLeft, Share2, Facebook, Twitter, Instagram, Music, MessageCircle, Youtube, Gem, Check, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext";
import { useDiamonds } from "@/contexts/DiamondContext";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ShareOption {
  id: string;
  name: string;
  Icon: typeof Facebook;
  color: string;
  diamondReward: number;
  description: string;
  shareUrl?: string;
  requiresProof?: boolean; // New: requires screenshot/video proof
}

const APP_URL = window.location.origin;
const SHARE_TEXT = "Join Diamond Quest Arena and earn FREE rewards!";

const shareOptions: ShareOption[] = [
  {
    id: "facebook",
    name: "FACEBOOK",
    Icon: Facebook,
    color: "from-[#1877f2] to-[#0c5ec7]",
    diamondReward: 10,
    description: "Share with friends",
    shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`
  },
  {
    id: "twitter",
    name: "TWITTER",
    Icon: Twitter,
    color: "from-[#1da1f2] to-[#0d8bd9]",
    diamondReward: 10,
    description: "Tweet about us",
    shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(APP_URL)}`
  },
  {
    id: "instagram",
    name: "INSTAGRAM", 
    Icon: Instagram,
    color: "from-[#e4405f] to-[#c13584]",
    diamondReward: 10,
    description: "Share video on story/reels",
    requiresProof: true
  },
  {
    id: "tiktok",
    name: "TIKTOK",
    Icon: Music,
    color: "from-[#fe2c55] to-[#000000]",
    diamondReward: 10,
    description: "Upload video with #DiamondQuest",
    requiresProof: true
  },
  {
    id: "whatsapp",
    name: "WHATSAPP",
    Icon: MessageCircle,
    color: "from-[#25d366] to-[#1da851]",
    diamondReward: 10,
    description: "Share contacts",
    shareUrl: `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + APP_URL)}`
  },
  {
    id: "youtube",
    name: "YOUTUBE",
    Icon: Youtube,
    color: "from-[#ff0000] to-[#cc0000]",
    diamondReward: 10,
    description: "Upload video review",
    requiresProof: true
  }
];

const Share = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { addDiamonds } = useDiamonds();
  const [claimedShares, setClaimedShares] = useState<Set<string>>(new Set());
  const [proofFiles, setProofFiles] = useState<{ [key: string]: File | null }>({});
  const [uploading, setUploading] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('claimedShares');
    if (saved) {
      setClaimedShares(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleShare = async (option: ShareOption) => {
    if (claimedShares.has(option.id)) {
      showNotification("Already Claimed", `${option.name} reward already claimed!`, "warning");
      return;
    }

    if (option.requiresProof) {
      // For proof-required platforms, show upload modal or input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*,video/*';
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setProofFiles(prev => ({ ...prev, [option.id]: file }));
          handleUploadProof(option, file);
        }
      };
      fileInput.click();
    } else {
      // Direct share for non-proof platforms
      if (option.shareUrl) {
        window.open(option.shareUrl, '_blank', 'width=600,height=400');
      }
      claimReward(option);
    }
  };

  const handleUploadProof = async (option: ShareOption, file: File) => {
    if (claimedShares.has(option.id)) return;

    setUploading(prev => new Set([...prev, option.id]));
    
    // Simulate upload/review process
    showNotification("Uploading Proof", "Reviewing your video/screenshot...", "info");
    
    // In real app, upload to server and await admin approval
    setTimeout(() => {
      setUploading(prev => {
        const newSet = new Set(prev);
        newSet.delete(option.id);
        return newSet;
      });
      
      claimReward(option);
      setProofFiles(prev => ({ ...prev, [option.id]: null }));
      
      showNotification(
        "Proof Approved!",
        `+${option.diamondReward} diamonds for ${option.name} video!`,
        "success"
      );
    }, 2000); // Simulate review time
  };

  const claimReward = (option: ShareOption) => {
    const newClaimed = new Set(claimedShares);
    newClaimed.add(option.id);
    setClaimedShares(newClaimed);
    localStorage.setItem('claimedShares', JSON.stringify([...newClaimed]));
    addDiamonds(option.diamondReward);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] p-4 pt-20">
      <div className="max-w-md mx-auto w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-black text-[#ffd700]">SHARE & EARN</h1>
        </div>

        <div className="bg-gradient-to-b from-[#4da6ff] to-[#1a66cc] rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-3">
            <Share2 className="w-12 h-12 text-white" />
            <h2 className="text-xl font-black text-white">SPREAD THE WORD!</h2>
          </div>
          <p className="text-white mb-2">Claim +10 diamonds per platform!</p>
          <p className="text-yellow-300 text-sm mb-4">
            Video platforms require screenshot/video proof
          </p>
          <Button variant="gold" className="w-full" onClick={() => navigate("/offers")}>
            Go to Offers
          </Button>
        </div>

        <div className="space-y-4">
          {shareOptions.map((option) => {
            const IconComponent = option.Icon;
            const isClaimed = claimedShares.has(option.id);
            const isUploading = uploading.has(option.id);
            
            return (
              <div key={option.id} className={`bg-gradient-to-b ${option.color} rounded-3xl p-6 ${isClaimed ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4 mb-4">
                  <IconComponent className="w-12 h-12 text-white" />
                  <div>
                    <h3 className="text-xl font-black text-white">{option.name}</h3>
                    <p className="text-sm text-yellow-300">
                      {option.description}
                      {option.requiresProof && (
                        <span className="ml-2 text-xs bg-yellow-800 px-2 py-1 rounded-full">
                          Proof 
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gem className="w-6 h-6 text-white" />
                    <span className="text-lg font-bold text-white">+10 Diamonds</span>
                    {isClaimed && <Check className="w-5 h-5 text-green-400 ml-2" />}
                  </div>
                  
                  <Button 
                    variant="gold" 
                    onClick={() => handleShare(option)}
                    disabled={isClaimed || isUploading}
                    className={isUploading ? 'animate-pulse' : isClaimed ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isUploading ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        Reviewing...
                      </>
                    ) : isClaimed ? (
                      'Claimed'
                    ) : option.requiresProof ? (
                      <>
                        <Image className="w-4 h-4 mr-2" />
                        Upload 
                      </>
                    ) : (
                      'Share'
                    )}
                  </Button>
                </div>
                
                {proofFiles[option.id] && (
                  <p className="text-xs text-yellow-300 mt-2">
                    📁 {proofFiles[option.id]?.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-card/50 rounded-2xl p-4 text-center text-sm text-muted-foreground">
          💎 Video platforms: Upload screenshot/video proof for approval!
        </div>
      </div>
    </div>
  );
};

export default Share;