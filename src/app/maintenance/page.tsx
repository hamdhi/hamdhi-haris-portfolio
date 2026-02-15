"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Radio } from "lucide-react";

export default function Manifestation() {
  const HEADER_TEXT = "Be Patience";

  return (
    <main className="min-h-screen w-full bg-[#020617] flex flex-col items-center justify-center text-center p-4 sm:p-6 text-white overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Background Pulse Rings - Scaled for Mobile */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 2.2], 
              opacity: [0.12, 0] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: i * 1.3, 
              ease: "easeOut" 
            }}
            className="absolute w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] border border-cyan-500/30 rounded-full"
          />
        ))}
      </div>

      {/* Shifting Nebula Shadows - Responsive Widths */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.12, 0.05],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-cyan-600/20 blur-[100px] sm:blur-[180px] rounded-full translate-x-[-10%] sm:translate-x-[-20%]" />
        <div className="w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-purple-900/10 blur-[80px] sm:blur-[140px] rounded-full translate-x-[10%] sm:translate-x-[20%]" />
      </motion.div>

      {/* Scanned Line Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_4px,3px_100%]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-30 flex flex-col items-center w-full"
      >
        {/* Signal Icon */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border border-cyan-400 rounded-full"
            />
            <div className="p-4 sm:p-5 rounded-full bg-black border border-white/5 relative z-10 shadow-2xl">
              <Radio size={24} className="text-cyan-500 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>

        {/* PULSING HEADER - Highly Responsive Text Size */}
        <div className="mb-4 sm:mb-6 relative group px-2">
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic leading-none break-words">
            {HEADER_TEXT.split('').map((char, i) => (
              <motion.span
                key={i}
                animate={{ 
                  opacity: [1, 0.3, 1, 0.7, 1],
                  color: ["#ffffff", "#3BA9C7", "#ffffff"],
                }}
                transition={{ 
                  duration: 0.3, 
                  repeat: Infinity, 
                  repeatDelay: Math.random() * 4,
                  delay: i * 0.08 
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          <div className="absolute -inset-x-4 sm:-inset-x-10 top-1/2 -translate-y-1/2 h-1 bg-cyan-500/20 blur-xl -z-10" />
        </div>
        
        <p className="text-slate-400 max-w-[280px] sm:max-w-md mx-auto text-xs sm:text-sm md:text-base font-mono leading-relaxed tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-8 sm:mb-12">
          Arrival in progress. <br /> 
          <span className="text-white/40">Watch the shadows.</span>
        </p>

        {/* Data Stream Visualizer - Adjusted for mobile width */}
        <div className="flex items-end justify-center gap-1 h-6 sm:h-8 mb-10 sm:mb-16">
          {[...Array(8)].map((_, i) => ( // Reduced count for mobile
            <motion.div
              key={i}
              animate={{ height: [4, 28, 8, 32, 4] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut" 
              }}
              className="w-1 bg-cyan-400/60 rounded-full"
            />
          ))}
        </div>

        {/* Links */}
        <div className="flex justify-center gap-8 sm:gap-10">
          <a href="#" className="flex flex-col items-center gap-2 group transition-all duration-300">
            <Github size={20} className="text-slate-500 group-hover:text-white" />
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-700 group-hover:text-cyan-500 tracking-widest uppercase font-bold">Source</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-2 group transition-all duration-300">
            <Linkedin size={20} className="text-slate-500 group-hover:text-white" />
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-700 group-hover:text-purple-500 tracking-widest uppercase font-bold">Network</span>
          </a>
        </div>
      </motion.div>

      {/* Footer Details - Hidden or simplified on small heights */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-0 flex justify-center items-center gap-4 sm:gap-10 px-4">
        <div className="hidden xs:block h-[1px] flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-slate-800" />
        <p className="text-[8px] sm:text-[10px] font-mono text-slate-500 tracking-[0.4em] sm:tracking-[0.8em] uppercase whitespace-nowrap">
          Void Static Wait // 2026
        </p>
        <div className="hidden xs:block h-[1px] flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-slate-800" />
      </div>
    </main>
  );
}