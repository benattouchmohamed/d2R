// import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

// interface DiamondContextType {
//   diamonds: number;
//   addDiamonds: (amount: number) => void;
//   subtractDiamonds: (amount: number) => boolean;
//   setDiamonds: (amount: number) => void;
// }

// const DiamondContext = createContext<DiamondContextType | undefined>(undefined);

// export const DiamondProvider = ({ children }: { children: ReactNode }) => {
//   const [diamonds, setDiamondsState] = useState(() => {
//     try {
//       const saved = localStorage.getItem('diamonds');
//       return saved ? Math.max(0, parseInt(saved)) : 0;
//     } catch {
//       return 0;
//     }
//   });

//   // Memoized update function to prevent stale closures
//   const updateDiamonds = useCallback((newAmount: number) => {
//     const amount = Math.max(0, newAmount); // Prevent negative diamonds
//     setDiamondsState(amount);
//     try {
//       localStorage.setItem('diamonds', amount.toString());
//     } catch (error) {
//       console.error('Failed to save diamonds to localStorage:', error);
//     }
//   }, []);

//   useEffect(() => {
//     // Sync with localStorage changes from other tabs
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === 'diamonds' && e.newValue) {
//         try {
//           const newValue = parseInt(e.newValue);
//           if (!isNaN(newValue) && newValue >= 0) {
//             setDiamondsState(newValue);
//           }
//         } catch {}
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const addDiamonds = useCallback((amount: number) => {
//     if (amount > 0) {
//       updateDiamonds(diamonds + amount);
//     }
//   }, [diamonds, updateDiamonds]);

//   const subtractDiamonds = useCallback((amount: number): boolean => {
//     if (amount > 0 && diamonds >= amount) {
//       updateDiamonds(diamonds - amount);
//       return true;
//     }
//     return false;
//   }, [diamonds, updateDiamonds]);

//   const setDiamonds = useCallback((amount: number) => {
//     updateDiamonds(amount);
//   }, [updateDiamonds]);

//   return (
//     <DiamondContext.Provider value={{ 
//       diamonds, 
//       addDiamonds, 
//       subtractDiamonds, 
//       setDiamonds 
//     }}>
//       {children}
//     </DiamondContext.Provider>
//   );
// };

// export const useDiamonds = (): DiamondContextType => {
//   const context = useContext(DiamondContext);
//   if (!context) {
//     throw new Error("useDiamonds must be used within DiamondProvider");
//   }
//   return context;
// };
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface DiamondContextType {
  diamonds: number;
  addDiamonds: (amount: number) => void;
  subtractDiamonds: (amount: number) => boolean;
  setDiamonds: (amount: number) => void;
}

const DiamondContext = createContext<DiamondContextType | undefined>(undefined);

export const DiamondProvider = ({ children }: { children: ReactNode }) => {
  const [diamonds, setDiamondsState] = useState(() => {
    const saved = localStorage.getItem('diamonds');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('diamonds', diamonds.toString());
  }, [diamonds]);

  const addDiamonds = (amount: number) => {
    setDiamondsState(prev => prev + amount);
  };

  const subtractDiamonds = (amount: number) => {
    if (diamonds >= amount) {
      setDiamondsState(prev => prev - amount);
      return true;
    }
    return false;
  };

  const setDiamonds = (amount: number) => {
    setDiamondsState(amount);
  };

  return (
    <DiamondContext.Provider value={{ diamonds, addDiamonds, subtractDiamonds, setDiamonds }}>
      {children}
    </DiamondContext.Provider>
  );
};

export const useDiamonds = () => {
  const context = useContext(DiamondContext);
  if (!context) {
    throw new Error("useDiamonds must be used within DiamondProvider");
  }
  return context;
};
