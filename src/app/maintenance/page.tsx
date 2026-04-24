"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Terminal, Activity, Mail, Phone } from "lucide-react";

export default function Manifestation() {
  const HEADER_TEXT = "In Progress";

  return (
    <main className="min-h-screen w-full bg-[#020a05] flex flex-col items-center justify-center text-center p-4 sm:p-6 text-white overflow-hidden relative selection:bg-[#2F9A58]/30">
      
      {/* Background Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 2.5], 
              opacity: [0.15, 0] 
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              delay: i * 1.6, 
              ease: "easeOut" 
            }}
            className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] border border-[#2F9A58]/20 rounded-full"
          />
        ))}
      </div>

      {/* Shifting Emerald Nebula */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.07, 0.15, 0.07],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[400px] h-[400px] sm:w-[850px] sm:h-[850px] bg-[#2F9A58]/20 blur-[100px] sm:blur-[200px] rounded-full" />
      </motion.div>

      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(47,154,88,0.03),rgba(47,154,88,0.01),rgba(47,154,88,0.03))] z-20 pointer-events-none bg-[length:100%_3px,2px_100%]" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-30 flex flex-col items-center w-full"
      >
        {/* System Core Icon */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-[#2F9A58]/40 rounded-full"
            />
            <div className="p-4 sm:p-5 rounded-2xl bg-[#020a05] border border-[#2F9A58]/20 relative z-10 shadow-[0_0_30px_rgba(47,154,88,0.2)]">
              <Terminal size={24} className="text-[#2F9A58] sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>

        {/* GLITCH HEADER */}
        <div className="mb-4 sm:mb-6 relative group px-2">
          <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none">
            {HEADER_TEXT.split('').map((char, i) => (
              <motion.span
                key={i}
                animate={{ 
                  opacity: [1, 0.5, 1, 0.8, 1],
                  textShadow: [
                    "0 0 0px #2F9A58",
                    "0 0 15px #2F9A58",
                    "0 0 0px #2F9A58"
                  ]
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity, 
                  repeatDelay: Math.random() * 5,
                  delay: i * 0.1 
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          <div className="absolute -inset-x-4 sm:-inset-x-10 top-1/2 -translate-y-1/2 h-px bg-[#2F9A58]/40 blur-sm -z-10" />
        </div>
        
        <p className="text-slate-400 max-w-[280px] sm:max-w-md mx-auto text-xs sm:text-sm font-mono leading-relaxed tracking-[0.3em] uppercase mb-8 sm:mb-12">
          Synchronizing Backend Logic. <br /> 
          <span className="text-[#2F9A58]/60 animate-pulse">System stable // Awaiting payload.</span>
        </p>

        {/* Signal Bars */}
        <div className="flex items-end justify-center gap-1.5 h-6 mb-8 sm:mb-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 24, 10, 30, 4] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.15,
                ease: "easeInOut" 
              }}
              className="w-1 bg-[#2F9A58] rounded-full opacity-60"
            />
          ))}
        </div>

        {/* Contact Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 sm:mb-16 font-mono text-xs sm:text-sm text-slate-400 bg-[#05120a]/80 p-4 sm:px-8 rounded-lg border border-[#2F9A58]/20 backdrop-blur-md shadow-[0_0_15px_rgba(47,154,88,0.1)]">
          <a href="mailto:hamdhiharis@gmail.com" className="flex items-center gap-3 hover:text-white group transition-colors">
            <Mail size={16} className="text-[#2F9A58] group-hover:scale-110 transition-transform" />
            hamdhiharis@gmail.com
          </a>
          <span className="hidden sm:inline text-[#2F9A58]/40">|</span>
          <a href="tel:0702031483" className="flex items-center gap-3 hover:text-white group transition-colors">
            <Phone size={16} className="text-[#2F9A58] group-hover:scale-110 transition-transform" />
            0702031483
          </a>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-12 sm:gap-16">
          <a href="#" className="flex flex-col items-center gap-2 group transition-all duration-300">
            <Github size={22} className="text-slate-500 group-hover:text-[#2F9A58] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono text-slate-700 tracking-widest uppercase font-bold">Repository</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-2 group transition-all duration-300">
            <Activity size={22} className="text-slate-500 group-hover:text-[#2F9A58] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono text-slate-700 tracking-widest uppercase font-bold">Analytics</span>
          </a>
        </div>
      </motion.div>

      {/* Footer Meta */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-0 flex justify-center items-center gap-6 px-4">
        <div className="hidden xs:block h-[1px] flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#2F9A58]/20" />
        <p className="text-[9px] font-mono text-slate-500 tracking-[0.5em] uppercase whitespace-nowrap">
          Establish Connection // {new Date().getFullYear()}
        </p>
        <div className="hidden xs:block h-[1px] flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#2F9A58]/20" />
      </div>
    </main>
  );
}