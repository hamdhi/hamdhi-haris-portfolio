'use client';
import { Award, LucideIcon } from 'lucide-react';

interface EventProps {
  title: string;
  date: string;
  location: string;
  images: string[]; // Array of strings from public folder
  knowledge: string;
}

export default function EventCard({ title, date, location, images, knowledge }: EventProps) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all p-6">
      {/* Title & Date */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tighter">
            {title}
          </h3>
          <span className="mono text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">
            {date}
          </span>
        </div>
        <p className="mono text-[10px] text-cyan-400/70 lowercase">{`// ${location}`}</p>
      </div>

      {/* Photo Grid Inside Card */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {images.slice(0, 4).map((img, idx) => (
          <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-white/10">
            <img src={img} alt={`${title}-${idx}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* Knowledge Gained Section */}
      <div className="bg-cyan-400/5 border-l-2 border-cyan-400 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Award size={14} className="text-cyan-400" />
          <span className="mono text-[10px] text-cyan-400 uppercase tracking-widest">Knowledge_Gained</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          {knowledge}
        </p>
      </div>
    </div>
  );
}