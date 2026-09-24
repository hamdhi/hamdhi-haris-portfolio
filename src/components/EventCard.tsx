'use client';
import { Award } from 'lucide-react';

interface EventProps {
  title: string;
  date: string;
  location: string;
  images: string[]; // Array of strings from public folder
  knowledge: string;
}

export default function EventCard({ title, date, location, images, knowledge }: EventProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[var(--surface)] p-6 shadow-sm transition-all hover:border-accent/50 dark:border-white/10">
      {/* Title & Date */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-accent dark:text-white">
            {title}
          </h3>
          <span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-500 dark:bg-white/5">
            {date}
          </span>
        </div>
        <p className="mono text-[10px] text-accent/70 lowercase">{`// ${location}`}</p>
      </div>

      {/* Photo Grid Inside Card */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {images.slice(0, 4).map((img, idx) => (
          <div key={idx} className="aspect-square overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
            <img src={img} alt={`${title}-${idx}`} className="w-full h-full object-cover transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* Knowledge Gained Section */}
      <div className="bg-accent/5 border-l-2 border-accent p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Award size={14} className="text-accent" />
          <span className="mono text-[10px] text-accent uppercase tracking-widest">Knowledge_Gained</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 italic dark:text-slate-300">
          {knowledge}
        </p>
      </div>
    </article>
  );
}