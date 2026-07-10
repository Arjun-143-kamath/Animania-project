"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const loadUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      }
    };

    // Load initial user
    loadUser();

    // Listen for custom profile update events
    window.addEventListener("profileUpdated", loadUser);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("profileUpdated", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <>
      {/* Translucent Animated Navbar */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 pointer-events-none ${isScrolled ? "py-6 bg-background/60 backdrop-blur-lg border-b border-white/5 shadow-lg" : "py-10 bg-transparent"}`}>
        <div className="container mx-auto px-4 lg:px-8 relative h-10">
          {/* Animated Logo */}
          <Link 
            href="/" 
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto ${
              isScrolled 
                ? "scale-100 opacity-100" 
                : "scale-[1.8] opacity-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Animania Logo" className="w-8 h-8 object-contain rounded-lg" />
              <span className="font-extrabold text-foreground tracking-tighter drop-shadow-2xl text-2xl">
                Animania
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Auth & Profile - Bottom Right Floating Island */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-auto flex items-center gap-4">
        {mounted && user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-md"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                {/* Dropdown opening upwards */}
                <div className="absolute bottom-full right-0 mb-4 w-56 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 border border-white/10 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
                  <div className="px-5 py-3 border-b border-border/50 mb-2">
                    <p className="text-sm font-bold text-foreground truncate">{user.username || user.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Welcome back</p>
                  </div>
                  
                  <div className="flex flex-col gap-1 px-2">
                    <Link
                      href="/library"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors w-full text-left"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors w-full text-left" 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" /> 
                      Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-border/50 mt-2 pt-2 px-2">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" /> 
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : mounted ? (
          <div className="flex items-center gap-3 bg-card/80 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
            <Link href="/login" className="text-sm font-bold text-foreground hover:text-primary px-4 py-2 transition-colors">
              Log In
            </Link>
            <Link href="/register" className="text-sm font-bold bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-md">
              Get Started
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
