import { Gem, LogOut, Loader2 } from "lucide-react";
import { useDiamonds } from "@/contexts/DiamondContext";
import { useRobloxUser } from "@/contexts/RobloxUserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {
  const { diamonds } = useDiamonds();
  const { user, logout } = useRobloxUser();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      localStorage.removeItem("robloxUser");
      sessionStorage.removeItem("robloxUserSession");
      
      // Force page reload to ensure storage is cleared
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("robloxUser");
      sessionStorage.removeItem("robloxUserSession");
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0a1e4d] to-[#1a2a5e] border-b-2 border-[#4dd4ff]/30 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10 border-2 border-[#4dd4ff]/50">
                <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                <AvatarFallback className="bg-[#4dd4ff] text-white font-bold">
                  {user.displayName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-tight">
                  {user.displayName || user.username || 'User'}
                </span>
                <span className="text-[#4dd4ff] text-xs leading-tight">
                  @{user.username || 'unknown'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gradient-to-b from-[#ffd700] to-[#cc9900] rounded-full px-4 py-2 border-2 border-yellow-600 shadow-lg">
            <Gem className="w-5 h-5 text-white" />
            <span className="font-black text-white">{diamonds || 0}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`text-white hover:bg-white/10 transition-all ${
              isLoggingOut ? 'animate-pulse' : ''
            }`}
          >
            {isLoggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};