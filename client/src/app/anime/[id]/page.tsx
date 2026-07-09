import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, PlayCircle } from 'lucide-react';
import CommentsSection from '@/components/CommentsSection';
import Header from '@/components/Header';
import AddToLibraryButton from '@/components/AddToLibraryButton';

export const revalidate = 3600; // Cache for 1 hour

async function getAnimeDetails(id: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`, {
      signal: controller.signal,
      next: { revalidate: 3600 }
    });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.log(`Jikan API Error (${res.status}): Failed to fetch anime ${id}`);
      return null;
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(`Fetch anime ${id} failed:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnimeDetails(id);
  
  if (!anime) {
    return {
      title: 'Anime Not Found | Animania',
    };
  }
  
  return {
    title: `${anime.title} | Animania`,
    description: anime.synopsis?.substring(0, 160) || `Details for ${anime.title}`,
  };
}

export default async function AnimeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const anime = await getAnimeDetails(id);

  if (!anime) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center container mx-auto px-4 py-20 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-4">Anime Not Found</h1>
            <p className="text-muted-foreground mb-8">The anime you're looking for doesn't exist or there was an error fetching the data.</p>
            <Link href="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold inline-block hover:scale-105 transition-transform">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Hero Banner / Trailer */}
      <div className="relative w-full h-[50vh] min-h-[400px] bg-black overflow-hidden">
        {anime.trailer?.images?.maximum_image_url ? (
          <>
            <Image 
              src={anime.trailer.images.maximum_image_url} 
              alt={`${anime.title} Trailer`} 
              fill
              className="object-cover opacity-50"
            />
            {anime.trailer?.url && (
              <a 
                href={anime.trailer.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center group z-10"
              >
                <div className="w-20 h-20 bg-primary/80 text-white rounded-full flex items-center justify-center backdrop-blur-md transform transition-transform group-hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white/20">
                  <PlayCircle className="w-10 h-10 ml-1" />
                </div>
              </a>
            )}
          </>
        ) : (
          <Image 
            src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url} 
            alt={anime.title} 
            fill
            className="object-cover opacity-30 blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-[-150px] relative z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Sidebar: Poster & Quick Stats */}
          <div className="w-full md:w-[280px] shrink-0 flex flex-col items-center md:items-start">
            <div className="relative w-[220px] md:w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-[6px] border-background bg-card mb-6 group">
              <Image 
                src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url} 
                alt={anime.title}
                fill
                sizes="(max-width: 768px) 220px, 280px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <AddToLibraryButton anime={anime} />
            
            <div className="w-full bg-card rounded-xl border border-border p-5 space-y-4 shadow-lg sticky top-24">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">Score</span>
                <span className="flex items-center gap-1 font-bold text-foreground">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {anime.score || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">Rank</span>
                <span className="font-bold text-foreground">#{anime.rank || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">Popularity</span>
                <span className="font-bold text-foreground">#{anime.popularity || 'N/A'}</span>
              </div>
              <div className="w-full h-px bg-border my-2"></div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground font-medium">{anime.type || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Episodes:</span>
                  <span className="text-foreground font-medium">{anime.episodes || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-foreground font-medium text-right">{anime.status || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aired:</span>
                  <span className="text-foreground font-medium text-right">
                    {anime.year || (anime.aired?.prop?.from?.year) || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Studio:</span>
                  <span className="text-foreground font-medium text-right line-clamp-1" title={anime.studios?.[0]?.name}>
                    {anime.studios?.[0]?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 mt-4 md:mt-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6 bg-secondary/50 px-4 py-2 rounded-full w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-2 drop-shadow-sm leading-tight">
              {anime.title}
            </h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="text-xl text-muted-foreground font-medium mb-6">
                {anime.title_english}
              </h2>
            )}

            <div className="flex flex-wrap gap-2 mb-10">
              {anime.genres?.map((genre: any) => (
                <span key={genre.mal_id} className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 text-xs font-bold rounded-full">
                  {genre.name}
                </span>
              ))}
              {anime.themes?.map((theme: any) => (
                <span key={theme.mal_id} className="bg-muted text-muted-foreground border border-border px-4 py-1.5 text-xs font-medium rounded-full">
                  {theme.name}
                </span>
              ))}
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                Synopsis
              </h3>
              <div className="bg-card/50 rounded-2xl p-6 border border-border">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {anime.synopsis || "No synopsis available."}
                </p>
              </div>
            </div>
            
            {/* Comments Section */}
            <CommentsSection malId={anime.mal_id} />
            
          </div>
        </div>
      </div>
    </main>
  );
}
