import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a1e4d] to-[#1a2a5e]">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-black text-[#ffd700] text-stroke-dark drop-shadow-xl">404</h1>
        <p className="mb-6 text-2xl text-white font-bold">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-block bg-gradient-to-b from-[#ffd700] via-[#ffb900] to-[#ff9500] text-white font-black text-lg px-8 py-4 rounded-3xl border-thick-gold hover:scale-105 active:scale-95 transition-transform"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
