'use client';
import { Download } from 'lucide-react';

interface HeroProps {
  cvLink: string;
}

export default function Hero({ cvLink }: HeroProps) {
  return (
    <section id='home' className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
      
      {/* Left Column: Text */}
      <div className="order-2 md:order-1 relative z-20 text-center md:text-left">
        <p className="mono text-cyan-400 mb-4 tracking-widest text-sm md:text-base">// BSC (Hons) in Software Engineering(Ug)</p>
        <h1 className="text-5xl md:text-8xl font-bold leading-[0.9] mb-8">
          Engineering <br /> 
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Digital Flow.
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-lg mb-12 mx-auto md:mx-0">
          Software Engineer specializing in Java and Spring Boot.
          Experienced in building backend systems, RESTful APIs, and database-driven applications.
          Focused on writing clean, maintainable code and engineering reliable digital systems.
        </p>
        <div suppressHydrationWarning={true} className="flex justify-center md:justify-start gap-4">
          <a 
            href={cvLink} 
            download 
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-purple-600 px-8 py-4 font-bold text-black rounded-sm hover:scale-105 transition shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            suppressHydrationWarning={true}
          >
            <Download size={18} /> DOWNLOAD_CV
          </a>
        </div>
      </div>

      {/* Right Column: Biometric Photo Frame */}
      <div className="order-1 md:order-2 flex justify-center items-center">
        <div className="relative p-1 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-sm">
          
          {/* Animated Corner Brackets */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400 animate-pulse z-30" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-purple-500 animate-pulse z-30" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-purple-500 animate-pulse z-30" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400 animate-pulse z-30" />

          <div className="relative w-64 h-64 md:w-96 md:h-96 overflow-hidden bg-slate-900 shadow-2xl">
            {/* The Scan Animation */}
            <div className="absolute top-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_#00f2ff] animate-[scan_4s_linear_infinite] z-20" />

            {/* Static Image */}
            <img
              src="/portfolio-img.jpeg"
              alt="Profile"
              className="w-full h-full object-cover"
            />

            {/* Cyber Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />

            {/* Bottom Label Overlay */}
            <div className="absolute bottom-4 left-4 mono text-[10px] bg-black/80 p-2 backdrop-blur-md border border-cyan-400/50 z-20">
              <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                 <p className="text-cyan-400 font-bold uppercase tracking-widest">Target_Locked: Dev</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}