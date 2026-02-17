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
      className={`relative h-52 md:h-64 w-full rounded-2xl border ${isMain ? 'border-[#2F9A58]/50 shadow-[0_0_20px_rgba(47,154,88,0.1)]' : 'border-white/10'} bg-white/5 p-6 backdrop-blur-md cursor-pointer transition-colors hover:border-[#2F9A58]`}
    >
      {/* Main Tech Badge */}
      {isMain && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#2F9A58] text-[11px] font-bold text-black uppercase tracking-tighter z-20">
          Core
        </div>
      )}

      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} className="flex flex-col items-center justify-center h-full">
        <img src={icon} alt={name} className="w-12 h-12 md:w-16 md:h-16 mb-4" />
        <h4 className="text-lg md:text-xl font-bold text-white">{name}</h4>
        <p className="text-[9px] mono text-slate-500 mt-1 uppercase tracking-widest text-center">{tags}</p>
        
        {/* Proficiency Bar */}
        <div className="w-full mt-6 bg-white/10 h-1 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${proficiency}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full ${isMain ? 'bg-[#2F9A58] shadow-[0_0_10px_#2F9A58]' : 'bg-slate-400'}`}
          />
        </div>
      </div>
    </motion.div>
  );
}