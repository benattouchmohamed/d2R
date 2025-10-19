import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { RobloxUser } from "@/services/robloxApi";

interface RobloxUserContextType {
  user: RobloxUser | null;
  setUser: (user: RobloxUser | null) => void;
  logout: () => void;
}

const RobloxUserContext = createContext<RobloxUserContextType | undefined>(undefined);

export const RobloxUserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<RobloxUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("robloxUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("robloxUser");
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    
    // Clear ALL storage data
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <RobloxUserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </RobloxUserContext.Provider>
  );
};

export const useRobloxUser = () => {
  const context = useContext(RobloxUserContext);
  if (!context) {
    throw new Error("useRobloxUser must be used within RobloxUserProvider");
  }
  return context;
};
