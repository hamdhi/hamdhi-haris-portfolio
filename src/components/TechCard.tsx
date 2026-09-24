'use client';
import { motion } from 'framer-motion';

interface TechProps {
  name: string;
  icon: string;
  tags: string;
  proficiency: number; // int 0-100
  isMain?: boolean;    // boolean
}

export default function TechCard({ name, icon, tags, proficiency, isMain }: TechProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`relative h-28 w-full rounded-xl border ${isMain ? 'border-accent/50 shadow-[0_0_20px_hsla(var(--accent-hue),89%,48%,0.1)]' : 'border-slate-200 dark:border-white/10'} bg-white/75 dark:bg-white/5 p-3 backdrop-blur-md shadow-sm transition-colors hover:border-accent md:h-32 md:p-4`}
    >
      {/* Main Tech Badge */}
      {isMain && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-accent text-[11px] font-bold text-black uppercase tracking-tighter z-20">
          Core
        </div>
      )}

      <div className="flex h-full items-center gap-3">
        <img src={icon} alt={name} className={`h-10 w-10 shrink-0 object-contain md:h-12 md:w-12 ${name === 'Next.js' ? 'dark:invert' : ''}`} />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white md:text-base">{name}</h4>
          <p className="mt-1 truncate font-mono text-[8px] uppercase tracking-wider text-slate-500 md:text-[9px]">{tags}</p>
        </div>
        
        {/* Proficiency Bar */}
        <div className="absolute bottom-3 left-3 right-3 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10 md:bottom-4 md:left-4 md:right-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${proficiency}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full ${isMain ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-slate-400'}`}
          />
        </div>
      </div>
    </motion.div>
  );
}