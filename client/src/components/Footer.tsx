import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border pt-16 lg:pt-24 overflow-hidden mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Top Section - Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-16 lg:mb-24 text-sm">
          {/* Brand/Logo Area */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block font-extrabold text-2xl tracking-tight text-foreground hover:text-primary transition-colors">
              Animania.
            </Link>
          </div>
          
          {/* Links Columns */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground mb-2">Navigate the Page</h4>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/library" className="text-muted-foreground hover:text-foreground transition-colors">Library</Link>
            <Link href="/#search" className="text-muted-foreground hover:text-foreground transition-colors">Search</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground mb-2">Connect with Me</h4>
            <Link href="https://www.instagram.com/arjunkamath143/" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</Link>
            <Link href="https://x.com/arjunkamath143" className="text-muted-foreground hover:text-foreground transition-colors">Twitter (Now Called X)</Link>
            <Link href="https://github.com/Arjun-143-kamath" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border mb-6"></div>

        {/* Middle Section - Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground mb-12">
          <p>© Copyright 2026. Animania All Rights Reserved.</p>
          <p className="flex items-center justify-center">
            Created with <Heart className="inline w-3 h-3 text-red-500 fill-red-500 mx-1" /> by Arjun
          </p>
        </div>

      </div>

      {/* Massive Cropped Typography */}
      <div className="w-full flex justify-center items-end leading-none select-none pointer-events-none relative h-[25vw] sm:h-[20vw] md:h-[25vw] lg:h-[30vw] xl:h-[300px] overflow-hidden">
        <h1 
          className="font-extrabold text-foreground absolute bottom-0 translate-y-[25%]"
          style={{ fontSize: 'clamp(8rem, 28vw, 40rem)', letterSpacing: '-0.05em' }}
        >
          Animania
        </h1>
      </div>
    </footer>
  );
}
