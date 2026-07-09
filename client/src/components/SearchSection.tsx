"use client";

import { useState, useEffect } from "react";
import { searchAnimeWithFallback, api } from "@/lib/api";
import { Search, Plus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPreferredTitle } from "@/lib/utils";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time search removed as requested to prevent API rate limits.
  // Search will now only trigger on form submit (Enter key or Search button click).

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      const results = await searchAnimeWithFallback(searchQuery);
      setResults(results);
    } catch (err: any) {
      console.error("Search failed completely", err);
      setError(err.message || "Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const handleAddAnime = async (anime: any, category: string) => {
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
        image_url: anime.images.webp.large_image_url || anime.images.jpg.image_url,
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
    <div id="search" className="container mx-auto px-4 lg:px-8 py-24 relative z-30">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
          Discover Your Next Obsession
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
          Search through thousands of anime titles, from timeless classics to the latest seasonal hits.
        </p>
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative shadow-2xl rounded-full">
          <input
            type="text"
            placeholder="Search for any anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-card/80 backdrop-blur-sm pl-6 pr-24 py-4 text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-transform hover:scale-105 shadow-md"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>

      {loading && <div className="text-center py-10"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div></div>}

      {error && (
        <div className="text-center py-10">
          <div className="inline-block bg-destructive/10 text-destructive border border-destructive/20 px-6 py-4 rounded-xl font-medium">
            {error}
          </div>
        </div>
      )}

      {!loading && !error && hasSearched && results.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No anime found matching "{query}"
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {results.map((anime, index) => (
            <div key={`${anime.mal_id}-${index}`} className="group flex flex-col bg-card rounded-xl overflow-hidden border border-border hover:border-muted-foreground/30 transition-all duration-300">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Link href={`/anime/${anime.mal_id}`} className="absolute inset-0 z-10" aria-label={getPreferredTitle(anime)}></Link>
                <Image
                  src={anime.images.webp.large_image_url || anime.images.jpg.image_url}
                  alt={getPreferredTitle(anime)}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-background/90 text-foreground px-2 py-1 rounded text-xs font-bold shadow border border-border z-10">
                  ⭐ {anime.score || 'N/A'}
                </div>
                
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-20">
                  <button 
                    onClick={(e) => { e.preventDefault(); handleAddAnime(anime, 'COMPLETED'); }}
                    disabled={addingId === anime.mal_id}
                    className="flex items-center gap-3 w-3/4 justify-center px-4 py-2.5 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-[100ms] hover:bg-muted text-foreground text-sm font-bold disabled:opacity-50 hover:scale-105"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Completed
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleAddAnime(anime, 'WATCHING'); }}
                    disabled={addingId === anime.mal_id}
                    className="flex items-center gap-3 w-3/4 justify-center px-4 py-2.5 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-[50ms] hover:bg-muted text-foreground text-sm font-bold disabled:opacity-50 hover:scale-105"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Watching
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleAddAnime(anime, 'WATCHLIST'); }}
                    disabled={addingId === anime.mal_id}
                    className="flex items-center gap-3 w-3/4 justify-center px-4 py-2.5 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-muted text-foreground text-sm font-bold disabled:opacity-50 hover:scale-105"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Watchlist
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex flex-col">
                <Link href={`/anime/${anime.mal_id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-1 group-hover:text-muted-foreground transition-colors" title={getPreferredTitle(anime)}>
                    {getPreferredTitle(anime)}
                  </h3>
                </Link>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <span>{anime.year || 'N/A'}</span>
                  <span>•</span>
                  <span className="line-clamp-1">{anime.genres?.[0]?.name || 'Anime'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
