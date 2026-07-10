"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookmarkPlus, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { getPreferredTitle } from "@/lib/utils";
import { api } from "@/lib/api";

export default function HeroCarousel({ animes }: { animes: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const [addingId, setAddingId] = useState<number | null>(null);

  const handleAddAnime = async (anime: any, category: string) => {
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
      if (error.response?.status === 401) {
        alert("Please log in to add to your library.");
      } else {
        alert(error.response?.data?.message || "Failed to add anime (maybe already in library?)");
      }
    } finally {
      setAddingId(null);
    }
  };

  useEffect(() => {
    if (!animes || animes.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % animes.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [animes]);

  if (!animes || animes.length === 0) {
    return <div className="h-[20vh]" />;
  }

  const activeAnime = animes[activeIndex];

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background: Blurred poster to create a natural color gradient */}
      {animes.map((anime, index) => (
        <div
          key={`${anime.mal_id}-${index}`}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-background/70 z-10 backdrop-blur-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
          <Image 
            src={anime.images.webp.large_image_url} 
            alt={getPreferredTitle(anime)}
            fill
            className="object-cover object-center opacity-50 scale-125 blur-3xl"
          />
        </div>
      ))}

      <div className="container mx-auto px-4 lg:px-8 relative z-20 h-full flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-500" key={`${activeAnime.mal_id}-${activeIndex}`}>
          
          {/* Left Side: Text and Actions */}
          <div className="max-w-2xl">
            <h2 className="text-primary font-extrabold tracking-[0.2em] text-sm md:text-base uppercase mb-4 drop-shadow-lg">
              Explore. Track. Obsess.
            </h2>
            <Link href={`/anime/${activeAnime.mal_id}`} className="hover:text-primary transition-colors">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-foreground drop-shadow-lg line-clamp-2">
                {getPreferredTitle(activeAnime)}
              </h1>
            </Link>
            
            <div className="flex items-center gap-4 mb-4 text-sm font-medium">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                {activeAnime.type || 'TV'}
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                ⭐ {activeAnime.score || 'N/A'}
              </span>
              <span className="text-muted-foreground">
                {activeAnime.year || activeAnime.status}
              </span>
            </div>

            <p className="text-lg text-muted-foreground mb-8 line-clamp-3 max-w-xl drop-shadow-md">
              {activeAnime.synopsis || "Track what you've watched, discover new favorites, and maintain your personal anime library."}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href={`/anime/${activeAnime.mal_id}`} className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-sm hover:bg-primary/90 transition-transform hover:scale-105 shadow-lg">
                Learn More
              </Link>
              <div className="relative group/dropdown inline-block">
                <button 
                  disabled={addingId === activeAnime.mal_id}
                  className="inline-flex items-center justify-center gap-2 bg-background/50 backdrop-blur-sm text-foreground border border-border px-8 py-3 rounded-full font-bold text-sm hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {addingId === activeAnime.mal_id ? (
                    <span className="animate-pulse">Adding...</span>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" /> Add to...
                    </>
                  )}
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg overflow-hidden opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 z-50">
                  <button onClick={() => handleAddAnime(activeAnime, 'WATCHLIST')} className="block w-full text-left px-4 py-3 text-sm font-medium hover:bg-muted transition-colors text-foreground">Watchlist</button>
                  <button onClick={() => handleAddAnime(activeAnime, 'WATCHING')} className="block w-full text-left px-4 py-3 text-sm font-medium hover:bg-muted transition-colors text-foreground">Watching</button>
                  <button onClick={() => handleAddAnime(activeAnime, 'COMPLETED')} className="block w-full text-left px-4 py-3 text-sm font-medium hover:bg-muted transition-colors text-foreground">Completed</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Poster Image */}
          <div className="hidden lg:flex justify-end items-center relative perspective-1000">
            <div className="relative w-[280px] xl:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transform transition-transform hover:scale-105 duration-500">
              <Link href={`/anime/${activeAnime.mal_id}`} className="absolute inset-0 z-10"></Link>
              <Image 
                src={activeAnime.images.webp.large_image_url} 
                alt={getPreferredTitle(activeAnime)}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Carousel Navigation Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6 z-30">
        <button 
          onClick={() => setActiveIndex((current) => (current - 1 + animes.length) % animes.length)}
          className="p-2 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white transition-all duration-300 border border-white/20 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2 items-center">
          {animes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-md ${
                idx === activeIndex ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={() => setActiveIndex((current) => (current + 1) % animes.length)}
          className="p-2 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white transition-all duration-300 border border-white/20 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
