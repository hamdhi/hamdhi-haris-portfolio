"use client";
import { motion } from "framer-motion";
import { Activity, Terminal, Code2, GitBranch } from "lucide-react";
import { useState, useEffect } from "react";

export default function SystemTelemetry(props: { GITHUB_USERNAME: string }) {
  // Change this to your exact GitHub username if it's different!
  const GITHUB_USERNAME = props.GITHUB_USERNAME;

  const [accentHex, setAccentHex] = useState<string>("0EA5E9"); // Default sky blue hex

  useEffect(() => {
    const updateHex = () => {
      const savedHue = localStorage.getItem('accentHue');
      const h = savedHue ? Number(savedHue) : 199;
      const s = 89;
      const l = 48;
      const lRatio = l / 100;
      const a = s * Math.min(lRatio, 1 - lRatio) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = lRatio - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      setAccentHex(`${f(0)}${f(8)}${f(4)}`);
    };
    
    updateHex(); // Run on mount
    window.addEventListener('theme-change', updateHex); // Listen for live global updates
    
    return () => window.removeEventListener('theme-change', updateHex);
  }, []);

  return (
    <section id="telemetry" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <Activity className="text-accent shrink-0" size={24} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tighter text-slate-900 dark:text-white break-words">
            System_<span className="text-accent">Telemetry</span>
          </h2>
        </div>
        <p className="text-slate-400 font-mono text-xs sm:text-sm lowercase break-words">
          {`> analyzing github node activities for user: ${GITHUB_USERNAME}`}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contribution Graph - takes up 2 columns on large screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-2 relative bg-white/80 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-accent/20 p-6 rounded-xl backdrop-blur-sm overflow-hidden group shadow-sm"
        >
          {/* Decorative scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(hsla(var(--accent-hue),89%,48%,0.05)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none opacity-20" />
          
          <div className="flex items-center justify-between mb-6 border-b border-accent/20 pb-4 relative z-10">
            <div className="flex items-center gap-2">
              <GitBranch size={18} className="text-accent" />
              <h3 className="font-mono text-sm text-slate-300 uppercase tracking-widest">Commit_Matrix</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[10px] font-mono text-accent uppercase">Live</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent relative z-10">
            {/* Free Open Source GitHub Chart API, dynamically using your accent hex color! */}
            <img 
              src={`https://ghchart.rshah.org/${accentHex}/${GITHUB_USERNAME}`} 
              alt={`${GITHUB_USERNAME}'s Github Chart`}
              className="min-w-[700px] w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </motion.div>

        {/* Top Languages - takes up 1 column on large screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative bg-white/80 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-accent/20 p-6 rounded-xl backdrop-blur-sm overflow-hidden shadow-sm"
        >
          {/* Decorative scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(hsla(var(--accent-hue),89%,48%,0.05)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none opacity-20" />

          <div className="flex items-center gap-2 mb-6 border-b border-accent/20 pb-4 relative z-10">
            <Code2 size={18} className="text-accent" />
            <h3 className="font-mono text-sm text-slate-300 uppercase tracking-widest">Language_Radar</h3>
          </div>

          <div className="w-full flex justify-center items-center min-h-[160px] md:h-[180px] relative z-10">
            <img 
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=transparent&hide_border=true&title_color=${accentHex}&text_color=94a3b8&icon_color=${accentHex}`}
              alt="Top Languages"
              className="w-full max-w-[320px] h-auto object-contain scale-100 md:scale-[1.15]"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-accent/10 relative z-10">
            <p className="font-mono text-[9px] sm:text-[10px] text-slate-500 flex items-center gap-2">
              <Terminal size={10} className="text-accent shrink-0" />
              <span>status: tracking metrics</span>
              <span className="animate-pulse text-accent">_</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}