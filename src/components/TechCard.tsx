'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface TechProps {
  name: string;
  icon: string;
  tags: string;
  proficiency: number; // int 0-100
  isMain?: boolean;    // boolean
}

export default function TechCard({ name, icon, tags, proficiency, isMain }: TechProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative h-44 md:h-52 w-full rounded-2xl border ${isMain ? 'border-accent/50 shadow-[0_0_20px_hsla(var(--accent-hue),89%,48%,0.1)]' : 'border-slate-200 dark:border-white/10'} bg-white dark:bg-white/5 p-4 md:p-5 backdrop-blur-md cursor-pointer transition-colors hover:border-accent shadow-sm`}
    >
      {/* Main Tech Badge */}
      {isMain && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-accent text-[11px] font-bold text-black uppercase tracking-tighter z-20">
          Core
        </div>
      )}

      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} className="flex flex-col items-center justify-center h-full">
        <img src={icon} alt={name} className="w-10 h-10 md:w-14 md:h-14 mb-3" />
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