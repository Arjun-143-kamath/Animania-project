"use client";

import { useState } from "react";
import { BookmarkPlus, X, Plus } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getPreferredTitle } from "@/lib/utils";

interface AddToLibraryButtonProps {
  anime: any;
}

export default function AddToLibraryButton({ anime }: AddToLibraryButtonProps) {
  const [addingId, setAddingId] = useState<number | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddAnime = async (category: string) => {
    setIsDropdownOpen(false);
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }
    
    try {
      setAddingId(anime.mal_id);
      await api.post("/library/add", {
        mal_id: anime.mal_id,
        category,
        title: getPreferredTitle(anime),
        image_url: anime.images?.webp?.large_image_url || anime.images?.jpg?.image_url,
        totalEpisodes: anime.episodes,
      });
      alert(`Successfully added ${getPreferredTitle(anime)} to ${category}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add anime (maybe already in library?)");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <div className="relative group/dropdown inline-block w-full mb-6 z-30">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={addingId === anime.mal_id}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground w-full py-4 rounded-xl font-bold text-base hover:bg-primary/90 transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50"
        >
          {addingId === anime.mal_id ? (
            <span className="animate-pulse">Adding...</span>
          ) : (
            <>
              <BookmarkPlus className="w-5 h-5" /> Add to Library
            </>
          )}
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
            <div className="absolute top-full left-0 mt-2 w-full bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button onClick={() => handleAddAnime('WATCHLIST')} className="block w-full text-left px-5 py-4 text-sm font-bold hover:bg-muted transition-colors text-foreground border-b border-border">Watchlist</button>
              <button onClick={() => handleAddAnime('WATCHING')} className="block w-full text-left px-5 py-4 text-sm font-bold hover:bg-muted transition-colors text-foreground border-b border-border">Watching</button>
              <button onClick={() => handleAddAnime('COMPLETED')} className="block w-full text-left px-5 py-4 text-sm font-bold hover:bg-muted transition-colors text-foreground">Completed</button>
            </div>
          </>
        )}
      </div>

      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 bg-card rounded-2xl border border-border shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
              <p className="text-muted-foreground">
                You need to log in to add anime to your library and track your progress.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/login" 
                className="flex w-full justify-center rounded-full bg-primary px-4 py-3 font-bold text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-[1.02]"
              >
                Log In
              </Link>
              <Link 
                href="/register" 
                className="flex w-full justify-center rounded-full border border-border bg-background px-4 py-3 font-bold text-foreground hover:bg-muted transition-transform hover:scale-[1.02]"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
