"use client";
import { motion } from "framer-motion";
import { Construction, Zap, Github, Linkedin } from "lucide-react";

export default function Maintenance() {
  return (
    <main className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center text-center p-6 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            <Construction size={48} className="text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
          Vault_<span className="text-cyan-400">Locked</span>
        </h1>
        
        <p className="text-slate-400 max-w-lg mx-auto text-lg mb-10 font-mono leading-relaxed">
          The system is currently undergoing a <span className="text-white italic">scheduled core upgrade</span>. 
          Normal operations will resume shortly.
        </p>

        {/* Status Indicator */}
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-950/20 border border-cyan-500/20 rounded-full mb-12">
          <Zap size={14} className="text-cyan-400 fill-cyan-400" />
          <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">
            Protocol: Maintenance_In_Progress
          </span>
        </div>

        {/* Social Quick Links */}
        <div className="flex justify-center gap-6">
          <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github size={20} /></a>
          <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] font-mono text-slate-700 tracking-[0.5em] uppercase">
          Neural Port v3.0 // 2026
        </p>
      </div>
    </main>
  );
}