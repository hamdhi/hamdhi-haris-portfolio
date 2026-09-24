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
      className={`relative h-48 w-full rounded-2xl border ${isMain ? 'border-accent/50 shadow-[0_0_20px_hsla(var(--accent-hue),89%,48%,0.1)]' : 'border-slate-200 dark:border-white/10'} bg-white/75 dark:bg-white/5 p-4 md:h-56 md:p-5 backdrop-blur-md shadow-sm transition-colors hover:border-accent`}
    >
      {/* Main Tech Badge */}
      {isMain && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-accent text-[11px] font-bold text-black uppercase tracking-tighter z-20">
          Core
        </div>
      )}

      <div className="flex h-full flex-col items-center justify-center">
        <img src={icon} alt={name} className={`mb-4 h-16 w-16 object-contain md:h-20 md:w-20 ${name === 'Next.js' ? 'dark:invert' : ''}`} />
        <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{name}</h4>
        <p className="text-[8px] md:text-[9px] mono text-slate-500 mt-1 uppercase tracking-widest text-center">{tags}</p>
        
        {/* Proficiency Bar */}
        <div className="w-full mt-4 md:mt-5 bg-slate-200 dark:bg-white/10 h-1 rounded-full overflow-hidden">
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