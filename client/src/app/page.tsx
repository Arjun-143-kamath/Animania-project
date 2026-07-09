import Link from "next/link";
export const dynamic = 'force-dynamic';
import AnimeRow from "@/components/AnimeRow";
import HeroCarousel from "@/components/HeroCarousel";
import SearchSection from "@/components/SearchSection";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import { BookmarkPlus } from "lucide-react";

// Global memory cache and rate limiter for Jikan API to eliminate the 4s delay on homepage load
const apiCache = new Map<string, any>();
let lastRequestTime = 0;

async function fetchJikanSmart(endpoint: string) {
  if (apiCache.has(endpoint)) {
    return apiCache.get(endpoint);
  }

  // Enforce a strict 1-second gap between actual network requests
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - timeSinceLast));
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    lastRequestTime = Date.now();
    const res = await fetch(`https://api.jikan.moe/v4${endpoint}`, {
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.log(`Jikan API Error (${res.status}) for ${endpoint}`);
      return [];
    }
    const data = await res.json();
    const results = data.data || [];
    
    // Save to cache
    apiCache.set(endpoint, results);
    return results;
  } catch (error: any) {
    console.log(`Fetch failed for ${endpoint}:`, error?.message || "Unknown error");
    return [];
  }
}

export default async function Home() {
  // Fetching uses smart cache: instant if cached, 1s apart if fetching from network
  const trendingAnime = await fetchJikanSmart("/top/anime?filter=airing&limit=15");
  const popularAnime = await fetchJikanSmart("/top/anime?filter=bypopularity&limit=12");
  const actionAnime = await fetchJikanSmart("/anime?genres=1&order_by=popularity&sort=asc&limit=12");
  const romanceAnime = await fetchJikanSmart("/anime?genres=22&order_by=popularity&sort=asc&limit=12");
  const fantasyAnime = await fetchJikanSmart("/anime?genres=10&order_by=popularity&sort=asc&limit=12");

  // Filter trending anime to only include ones with high-quality landscape trailer images for the hero carousel
  let heroAnimes = trendingAnime
    .filter((anime: any) => anime.trailer?.images?.maximum_image_url);

  // Shuffle randomly so every refresh shows a different set
  heroAnimes = heroAnimes.sort(() => 0.5 - Math.random()).slice(0, 5);

  // Fallback just in case we don't have enough
  if (heroAnimes.length < 5) {
    const additional = trendingAnime.filter((a: any) => !heroAnimes.includes(a));
    const shuffledAdditional = additional.sort(() => 0.5 - Math.random()).slice(0, 5 - heroAnimes.length);
    heroAnimes = [...heroAnimes, ...shuffledAdditional];
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero Section */}
      <HeroCarousel animes={heroAnimes} />

      <div className="relative z-20">
        <SearchSection />
        <PersonalizedRecommendations />
      </div>

      {/* Dynamic Content Rows */}
      <div className="relative z-20 space-y-4">
        {trendingAnime.length > 5 && <AnimeRow title="Trending Now" animes={trendingAnime.slice(5)} />}
        {popularAnime.length > 0 && <AnimeRow title="Most Popular" animes={popularAnime} />}
        {actionAnime.length > 0 && <AnimeRow title="Action Packed" animes={actionAnime} />}
        {romanceAnime.length > 0 && <AnimeRow title="Romance" animes={romanceAnime} />}
        {fantasyAnime.length > 0 && <AnimeRow title="Fantasy Worlds" animes={fantasyAnime} />}
      </div>
    </div>
  );
}
