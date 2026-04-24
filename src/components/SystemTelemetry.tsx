"use client";
import { motion } from "framer-motion";
import { Activity, Terminal, Code2, GitBranch } from "lucide-react";

export default function SystemTelemetry(props: { GITHUB_USERNAME: string }) {
  // Change this to your exact GitHub username if it's different!
  const GITHUB_USERNAME = props.GITHUB_USERNAME;

  return (
    <section id="telemetry" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <Activity className="text-[#2F9A58]" size={24} />
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-white">
            System_<span className="text-[#2F9A58]">Telemetry</span>
          </h2>
        </div>
        <p className="text-slate-400 font-mono text-sm lowercase">
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
          className="lg:col-span-2 relative bg-[#05120a]/80 border border-[#2F9A58]/20 p-6 rounded-xl backdrop-blur-sm overflow-hidden group"
        >
          {/* Decorative scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(47,154,88,0.05)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none opacity-20" />
          
          <div className="flex items-center justify-between mb-6 border-b border-[#2F9A58]/20 pb-4 relative z-10">
            <div className="flex items-center gap-2">
              <GitBranch size={18} className="text-[#2F9A58]" />
              <h3 className="font-mono text-sm text-slate-300 uppercase tracking-widest">Commit_Matrix</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F9A58] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2F9A58]"></span>
              </span>
              <span className="text-[10px] font-mono text-[#2F9A58] uppercase">Live</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#2F9A58]/20 scrollbar-track-transparent relative z-10">
            {/* Free Open Source GitHub Chart API, using your #2F9A58 green hex color! */}
            <img 
              src={`https://ghchart.rshah.org/2F9A58/${GITHUB_USERNAME}`} 
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
          className="relative bg-[#05120a]/80 border border-[#2F9A58]/20 p-6 rounded-xl backdrop-blur-sm overflow-hidden"
        >
          {/* Decorative scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(47,154,88,0.05)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none opacity-20" />

          <div className="flex items-center gap-2 mb-6 border-b border-[#2F9A58]/20 pb-4 relative z-10">
            <Code2 size={18} className="text-[#2F9A58]" />
            <h3 className="font-mono text-sm text-slate-300 uppercase tracking-widest">Language_Radar</h3>
          </div>

          <div className="w-full flex justify-center items-center h-[180px] overflow-hidden relative z-10">
            <img 
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=transparent&hide_border=true&title_color=2F9A58&text_color=94a3b8&icon_color=2F9A58`}
              alt="Top Languages"
              className="w-full h-auto object-contain scale-[1.15]"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-[#2F9A58]/10 relative z-10">
            <p className="font-mono text-[10px] text-slate-500 flex items-center gap-2">
              <Terminal size={10} className="text-[#2F9A58]" />
              <span>status: tracking metrics</span>
              <span className="animate-pulse text-[#2F9A58]">_</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}