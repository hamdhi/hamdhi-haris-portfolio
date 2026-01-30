'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function TechCard({ name, icon, tags }: { name: string; icon: string; tags: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative h-64 w-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md cursor-pointer hover:border-cyan-400 transition-colors"
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} className="flex flex-col items-center justify-center h-full">
        <img src={icon} alt={name} className="w-16 h-16 mb-6" />
        <h4 className="text-xl font-bold">{name}</h4>
        <p className="text-[10px] mono text-slate-500 mt-2 uppercase tracking-widest">{tags}</p>
      </div>
    </motion.div>
  );
}