export function getPreferredTitle(anime: any): string {
  if (!anime) return "Unknown Anime";
  
  // Only accessible on the client side
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.titleLanguage === "romaji") {
          return anime.title || anime.title_english || "Unknown Anime";
        }
      } catch (e) {}
    }
  }
  
  // Default to English if available, fallback to romaji
  return anime.title_english || anime.title || "Unknown Anime";
}
