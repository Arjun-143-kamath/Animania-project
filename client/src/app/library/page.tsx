"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";

type Category = 'WATCHLIST' | 'WATCHING' | 'COMPLETED';

export default function LibraryPage() {
  const [library, setLibrary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category>('WATCHING');
  const [error, setError] = useState("");

  const fetchLibrary = async () => {
    try {
      const response = await api.get('/library');
      setLibrary(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
      setError("Failed to fetch library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set default tab from user preferences if available
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.defaultLibraryView) {
          setActiveTab(user.defaultLibraryView as Category);
        }
      } catch (e) {}
    }

    fetchLibrary();
  }, []);

  const handleUpdateProgress = async (mal_id: number, increment: number) => {
    const anime = library.find(a => a.mal_id === mal_id);
    if (!anime) return;

    let newWatched = (anime.watchedEpisodes || 0) + increment;
    if (newWatched < 0) newWatched = 0;
    if (anime.totalEpisodes && newWatched > anime.totalEpisodes) newWatched = anime.totalEpisodes;

    try {
      await api.put('/library/update', { mal_id, watchedEpisodes: newWatched });
      fetchLibrary(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveCategory = async (mal_id: number, category: Category) => {
    try {
      await api.put('/library/move', { mal_id, category });
      fetchLibrary();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (mal_id: number) => {
    if (!confirm("Are you sure you want to remove this anime from your library?")) return;
    try {
      await api.delete(`/library/remove/${mal_id}`);
      fetchLibrary();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLibrary = library.filter(a => a.category === activeTab);

  const tabs: { id: Category; label: string }[] = [
    { id: 'WATCHLIST', label: 'Watchlist' },
    { id: 'WATCHING', label: 'Watching' },
    { id: 'COMPLETED', label: 'Completed' },
  ];

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="pt-32 lg:pt-48 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-bold text-foreground">Collections</h1>
        <div className="flex bg-muted p-1 rounded-full border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="text-destructive mb-6 bg-destructive/10 p-4 rounded border border-destructive/20">{error}</div>}

      {filteredLibrary.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground mb-6 text-lg">No anime in this category yet.</p>
          <Link href="/#search" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-transform hover:scale-105">
            <Plus className="h-5 w-5" /> Discover Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLibrary.map((anime) => (
            <div key={anime.mal_id} className="flex bg-card rounded-xl border border-border overflow-hidden hover:border-muted-foreground/30 transition-colors h-[220px]">
              <div className="w-[150px] shrink-0 relative">
                <Image
                  src={anime.image_url}
                  alt={anime.title}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col min-w-0">
                <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2 text-foreground" title={anime.title}>{anime.title}</h3>
                
                {activeTab === 'WATCHING' && (
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-2 flex justify-between font-medium">
                      <span>Progress</span>
                      <span>{anime.watchedEpisodes} <span className="text-border">/</span> {anime.totalEpisodes || '?'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <button 
                        onClick={() => handleUpdateProgress(anime.mal_id, -1)}
                        className="p-1.5 bg-secondary rounded hover:bg-secondary/80 text-secondary-foreground transition-colors"
                        disabled={anime.watchedEpisodes === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${anime.totalEpisodes ? Math.min((anime.watchedEpisodes / anime.totalEpisodes) * 100, 100) : 10}%` }}
                        ></div>
                      </div>
                      <button 
                        onClick={() => handleUpdateProgress(anime.mal_id, 1)}
                        className="p-1.5 bg-secondary rounded hover:bg-secondary/80 text-secondary-foreground transition-colors"
                        disabled={anime.totalEpisodes && anime.watchedEpisodes >= anime.totalEpisodes}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-auto flex flex-wrap gap-2">
                  {activeTab === 'WATCHLIST' && (
                    <button 
                      onClick={() => handleMoveCategory(anime.mal_id, 'WATCHING')}
                      className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground text-sm font-bold px-3 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Start <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  {activeTab === 'WATCHING' && (
                     <button 
                     onClick={() => handleMoveCategory(anime.mal_id, 'COMPLETED')}
                     className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground text-sm font-bold px-3 py-2 rounded-md hover:bg-primary/90 transition-colors"
                   >
                     Finish <ArrowRight className="h-4 w-4" />
                   </button>
                  )}
                  <button 
                    onClick={() => handleRemove(anime.mal_id)}
                    className="p-2 bg-background border border-border text-muted-foreground rounded-md hover:text-destructive hover:border-destructive transition-colors"
                    title="Remove from library"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Recommendations at the bottom of the dashboard */}
      <div className="mt-16 mb-10">
        <PersonalizedRecommendations />
      </div>
    </div>
    </div>
  );
}
