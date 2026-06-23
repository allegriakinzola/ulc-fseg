"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-x py-16 sm:py-20 lg:py-24">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-red)]/20 bg-[color:var(--brand-cream)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--brand-red)] font-semibold mb-5">
            Découvrir
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[color:var(--brand-navy)] gold-rule">
            La FSEG en vidéo
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed">
            Plongez au cœur de la vie universitaire : campus, enseignements, événements
            et témoignages de notre communauté.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Decorative corners */}
          <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-[color:var(--brand-gold)] rounded-tl-2xl opacity-60" />
          <div className="absolute -top-3 -right-3 w-16 h-16 border-t-4 border-r-4 border-[color:var(--brand-gold)] rounded-tr-2xl opacity-60" />
          <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-4 border-l-4 border-[color:var(--brand-gold)] rounded-bl-2xl opacity-60" />
          <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-[color:var(--brand-gold)] rounded-br-2xl opacity-60" />

          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-100">
            {/* Poster */}
            {!isPlaying && (
              <div className="relative aspect-video">
                <Image
                  src="/image1.jpg"
                  alt="Aperçu vidéo FSEG"
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-navy)]/70 via-[color:var(--brand-navy)]/20 to-transparent" />

                <button
                  onClick={handlePlay}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Lire la vidéo"
                >
                  {/* Pulsing ring */}
                  <span className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-[color:var(--brand-red)]/20 animate-ping" />
                  <span className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-[color:var(--brand-red)]/10 animate-pulse" />
                  {/* Button */}
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[color:var(--brand-red)] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 ring-4 ring-white/30">
                    <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1" fill="currentColor" />
                  </div>
                </button>

                {/* Bottom caption */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                  <div className="text-white font-display text-lg sm:text-xl font-semibold">
                    Visite guidée du campus
                  </div>
                  <div className="text-white/80 text-sm mt-1">
                    2 min · Campus de Kimwenza
                  </div>
                </div>
              </div>
            )}

            {/* Video */}
            <video
              ref={videoRef}
              src="/video.mp4"
              className={isPlaying ? "w-full aspect-video object-cover" : "hidden"}
              controls={isPlaying}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Pause button */}
            {isPlaying && (
              <button
                onClick={handlePause}
                className="absolute top-4 right-4 z-10 h-11 w-11 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition backdrop-blur-sm border border-white/20"
                aria-label="Pause"
              >
                <Pause className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
