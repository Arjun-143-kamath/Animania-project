"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { getPreferredTitle } from "@/lib/utils";

interface AnimeRowProps {
  title: string;
  animes: any[];
}

export default function AnimeRow({ title, animes }: AnimeRowProps) {
  const [addingId, setAddingId] = useState<number | null>(null);

  if (!animes || animes.length === 0) return null;

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

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground">{title}</h2>
        <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide snap-x">
          {animes.map((anime, index) => (
            <div key={`${anime.mal_id}-${index}`} className="snap-start shrink-0 w-[200px] md:w-[220px] group flex flex-col cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-card border border-border">
                <Link href={`/anime/${anime.mal_id}`} className="absolute inset-0 z-10" aria-label={getPreferredTitle(anime)}></Link>
                <Image
                  src={anime.images.webp.large_image_url || anime.images.jpg.image_url}
                  alt={getPreferredTitle(anime)}
                  fill
                  sizes="(max-width: 768px) 200px, 220px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
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
                <div className="absolute top-2 left-2 bg-background/90 text-foreground px-2 py-1 rounded text-xs font-bold shadow border border-border">
                  ⭐ {anime.score || 'N/A'}
                </div>
              </div>
              <div className="mt-3 flex flex-col">
                <Link href={`/anime/${anime.mal_id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-bold text-sm leading-tight line-clamp-1 group-hover:text-muted-foreground transition-colors" title={getPreferredTitle(anime)}>
                    {getPreferredTitle(anime)}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {anime.year || 'N/A'} • {anime.genres?.[0]?.name || 'Anime'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
