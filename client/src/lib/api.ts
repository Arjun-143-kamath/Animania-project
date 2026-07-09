import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const JIKAN_API_URL = 'https://api.jikan.moe/v4';

// Backend API instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// External Jikan API instance
export const jikanApi = axios.create({
  baseURL: JIKAN_API_URL,
});

// GraphQL query for AniList
const ANILIST_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 25) {
    media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
      idMal
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      episodes
      averageScore
      seasonYear
      genres
    }
  }
}
`;

export const searchAnimeWithFallback = async (query: string) => {
  try {
    // 1. Try Jikan API first
    const response = await jikanApi.get(`/anime?q=${encodeURIComponent(query)}&sfw=true`);
    return response.data.data;
  } catch (jikanError) {
    console.log("Jikan API failed, falling back to AniList...", jikanError);
    
    // 2. Fallback to AniList GraphQL API
    try {
      const anilistResponse = await axios.post(
        'https://graphql.anilist.co',
        {
          query: ANILIST_QUERY,
          variables: { search: query }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );

      const media = anilistResponse.data.data.Page.media;
      
      // 3. Map AniList format to exactly match Jikan's format so the UI doesn't need to change
      const mappedResults = media
        .filter((m: any) => m.idMal) // Ensure we have a MAL ID for database compatibility
        .map((m: any) => ({
          mal_id: m.idMal,
          title: m.title.romaji || m.title.english,
          title_english: m.title.english || m.title.romaji,
          images: {
            webp: { large_image_url: m.coverImage.large },
            jpg: { image_url: m.coverImage.large }
          },
          episodes: m.episodes,
          score: m.averageScore ? (m.averageScore / 10).toFixed(2) : null,
          year: m.seasonYear,
          genres: m.genres.map((g: string) => ({ name: g }))
        }));
        
      return mappedResults;
    } catch (anilistError) {
      console.error("Both APIs failed!", anilistError);
      throw new Error("All search APIs are currently down. Please try again later.");
    }
  }
};
