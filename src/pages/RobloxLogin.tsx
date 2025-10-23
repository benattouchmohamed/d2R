import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchRobloxUser, RobloxUser } from "@/services/robloxApi";
import { useRobloxUser } from "@/contexts/RobloxUserContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const RobloxLogin = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<RobloxUser[]>([]);
  const { setUser } = useRobloxUser();
  const navigate = useNavigate();

  const handleSelectUser = (selectedUser: RobloxUser) => {
    localStorage.setItem("robloxUser", JSON.stringify(selectedUser));
    setUser(selectedUser);

    toast({
      title: "Login Successful",
      description: `Welcome, ${selectedUser.displayName}!`,
      duration: 1000,
    });

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Roblox username",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setLoading(true);
    setSuggestions([]);
    
    try {
      localStorage.removeItem("robloxUser");
      sessionStorage.removeItem("robloxUserSession");

      const result = await fetchRobloxUser(username.trim());

      if (result && 'multiple' in result && result.multiple) {
        // Multiple users found - show suggestions
        setSuggestions(result.users);
        toast({
          title: "Multiple Users Found",
          description: "Please select your account from the list",
          duration: 2000,
        });
      } else if (result && 'username' in result) {
        // Single user found
        handleSelectUser(result as RobloxUser);
      } else {
        // No user found - use entered username as fallback
        const fallbackUser = {
          username: username.trim(),
          displayName: username.trim(),
          id: "0",
          avatarUrl: "",
        };

        localStorage.setItem("robloxUser", JSON.stringify(fallbackUser));
        setUser(fallbackUser);

        toast({
          title: "Welcome",
          description: `Logged in as ${username.trim()}`,
          duration: 1000,
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // On error, still allow login with entered username
      const fallbackUser = {
        username: username.trim(),
        displayName: username.trim(),
        id: "0",
        avatarUrl: "",
      };

      localStorage.setItem("robloxUser", JSON.stringify(fallbackUser));
      setUser(fallbackUser);

      toast({
        title: "Logged in",
        description: `Welcome, ${username.trim()}!`,
        duration: 1000,
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black leading-tight mb-4">
            <span className="block text-[#4dd4ff] text-stroke-white drop-shadow-xl">FREE</span>
            <span className="block text-[#ffd700] text-stroke-dark drop-shadow-xl">ROBUX</span>
            <span className="block text-[#ffd700] text-stroke-dark drop-shadow-xl">2025</span>
          </h1>
          <p className="text-white/90 text-lg font-bold">
            Login with your Roblox username
          </p>
        </div>

        <div className="bg-gradient-to-b from-[#1a2a5e] to-[#0a1e4d] border-4 border-[#4dd4ff]/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-white font-bold mb-2">
                Roblox Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-white/10 border-2 border-[#4dd4ff]/50 text-white placeholder:text-white/50 text-lg"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4dd4ff] to-[#2eb8e6] hover:from-[#2eb8e6] hover:to-[#4dd4ff] text-white font-black text-xl py-6 border-4 border-white/20 shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* User Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <User className="w-4 h-4" />
                <span>Select your account:</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {suggestions.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full bg-white/10 hover:bg-white/20 border-2 border-[#4dd4ff]/30 hover:border-[#4dd4ff]/60 rounded-xl p-3 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-[#4dd4ff]/50">
                        <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                        <AvatarFallback className="bg-[#4dd4ff] text-white font-bold">
                          {user.displayName?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white font-bold text-base">
                          {user.displayName}
                        </p>
                        <p className="text-[#4dd4ff] text-sm">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RobloxLogin;