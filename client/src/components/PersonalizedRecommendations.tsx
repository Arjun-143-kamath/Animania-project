"use client";

import { useState, useEffect } from "react";
import { api, jikanApi } from "@/lib/api";
import AnimeRow from "./AnimeRow";

export default function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [seedAnimeTitle, setSeedAnimeTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Check if logged in
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch user's library
        const libResponse = await api.get("/library");
        const library = libResponse.data;

        if (!library || library.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Filter for WATCHING or COMPLETED anime
        const eligibleAnime = library.filter(
          (a: any) => a.category === "WATCHING" || a.category === "COMPLETED"
        );

        if (eligibleAnime.length === 0) {
          setLoading(false);
          return;
        }

        // 3. Pick a random seed
        const randomIndex = Math.floor(Math.random() * eligibleAnime.length);
        const seedAnime = eligibleAnime[randomIndex];
        setSeedAnimeTitle(seedAnime.title);

        // 4. Fetch recommendations from Jikan API
        // Add a delay to help respect Jikan API rate limit (3 req/sec)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const recResponse = await jikanApi.get(`/anime/${seedAnime.mal_id}/recommendations`);
        
        // Jikan returns recommendations in a different format, we need to map them to match what AnimeRow expects
        // Jikan rec format: { entry: { mal_id, url, images, title }, url, votes }
        if (recResponse.data && recResponse.data.data) {
          // Create a Set of all mal_ids currently in the user's library
          const libraryIds = new Set(library.map((item: any) => item.mal_id));

          const formattedRecs = recResponse.data.data
            .filter((rec: any) => !libraryIds.has(rec.entry.mal_id)) // Filter out anime already in library
            .slice(0, 15) // Only take top 15 of the remaining ones
            .map((rec: any) => ({
              mal_id: rec.entry.mal_id,
              title: rec.entry.title,
              title_english: rec.entry.title, // Jikan entry only returns one title
              images: rec.entry.images,
              score: null, // Recommendations endpoint doesn't return score
              year: null,
              genres: []
            }));
            
          setRecommendations(formattedRecs);
        }
      } catch (error) {
        console.error("Failed to fetch personalized recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading || recommendations.length === 0) {
    return null; // Return nothing if loading or no recommendations
  }

  return (
    <div className="relative z-20">
      <AnimeRow 
        title={`Because you watched ${seedAnimeTitle}`} 
        animes={recommendations} 
      />
    </div>
  );
}
