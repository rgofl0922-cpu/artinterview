import { Artist } from "../types.ts";
import { Palette, Calendar, Sparkles } from "lucide-react";

interface ArtistCardProps {
  key?: string;
  artist: Artist;
  onSelect: (artist: Artist) => void;
  isCompleted: boolean;
}

export default function ArtistCard({ artist, onSelect, isCompleted }: ArtistCardProps) {
  return (
    <button
      onClick={() => onSelect(artist)}
      id={`artist-card-${artist.id}`}
      className="group relative flex flex-col justify-between overflow-hidden border-4 border-black bg-white p-6 shadow-brutalist transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutalist-lg hover:bg-brand-yellow text-left focus:outline-none"
    >
      <div className="relative z-10 w-full">
        {/* Card Header with Category and Complete Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-bold bg-white text-black border-2 border-black">
            {artist.era.split(" (")[0]}
          </span>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-green-400 px-2.5 py-0.5 rounded-none border-2 border-black shadow-brutalist-sm">
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              탐구 완료
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-black opacity-60 bg-brand-sand border border-black/30 px-1.5 py-0.5 font-mono">
              ID: {artist.id.toUpperCase()}
            </span>
          )}
        </div>

        {/* Artist Profile Block */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center border-2 border-black font-black text-lg shadow-brutalist-sm group-hover:scale-105 transition-transform duration-200 ${artist.avatarColor}`}>
            {artist.name.slice(0, 2)}
          </div>
          <div>
            <h3 className="text-lg font-black text-black group-hover:text-black transition-colors duration-200 flex items-center gap-1 font-display uppercase tracking-tight italic">
              {artist.name}
            </h3>
            <p className="text-xs font-bold text-red-600 uppercase font-mono tracking-wide">{artist.englishName}</p>
          </div>
        </div>

        {/* Life span and Masterpieces */}
        <div className="space-y-2.5 mt-2 text-sm text-black border-t-2 border-black/10 pt-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black/80 font-mono">
            <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
            <span>생몰년도: {artist.years}</span>
          </div>
          <div className="flex items-start gap-1.5 text-xs text-black/80">
            <Palette className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
            <div className="line-clamp-2 leading-relaxed">
              <span className="font-bold text-black">대표작: </span>
              <span className="font-medium italic">{artist.works.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Invite Action */}
      <div className="relative z-10 flex items-center gap-1.5 mt-5 text-xs font-black text-black uppercase tracking-wider underline decoration-2 underline-offset-4 group-hover:text-red-600 transition-colors">
        <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-black group-hover:text-red-600" />
        <span>인터뷰 시작하기 &rarr;</span>
      </div>
    </button>
  );
}
