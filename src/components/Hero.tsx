'use client';
import { Contact, Download } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

interface HeroProps {
  cvLink: string;
}

export default function Hero({ cvLink }: HeroProps) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const textArray = ['Backend Logic', 'Clean Code', 'Scalable Systems'];
  const currentText = textArray[loopNum % textArray.length];

  const handleTyping = useCallback(() => {
    if (!isDeleting && text === currentText) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setTypingSpeed(150);
      return;
    }

    const i = isDeleting ? text.length - 1 : text.length;
    const partialText = currentText.substring(0, i + (isDeleting ? 0 : 1));
    setText(partialText);
    
    const speed = isDeleting ? 50 : 150;
    setTypingSpeed(speed);
  }, [text, currentText, isDeleting, loopNum]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleTyping();
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [handleTyping, typingSpeed]);

  return (
    <section id='home' className="relative z-10 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          
          {/* Left Column: Text */}
          <div className="order-2 md:order-1 relative z-20 text-center md:text-left flex flex-col justify-center">
            
            {/* Name First */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Hello, I'm <span className="text-cyan-400">Hamdhi Haris</span>
            </h2>

            {/* Degree Second */}
            <p className="mono text-cyan-400 mb-6 tracking-widest text-sm md:text-base">
              // BSC (Hons) in Software Engineering(Ug)
            </p>
            
            {/* Title & Animated Text Wrapper */}
            <div className="mb-4">
              <div className="flex justify-center md:justify-start">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Engineering
                </h1>
              </div>
              
              <div className="min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[100px] flex justify-center md:justify-start">
                <span className="
                  bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent 
                  text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold
                  text-center md:text-left
                  leading-tight
                ">
                  {text}
                  <span className="ml-1 animate-pulse">|</span>
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-base md:text-lg max-w-lg mb-8 md:mb-12 mx-auto md:mx-0">
              Software Engineer specializing in Java and Spring Boot.
              Focused on writing clean, maintainable code and engineering reliable digital systems.
            </p>

            {/* BUTTON GROUP */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 items-center">
              <a 
                href={cvLink} 
                download 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-purple-600 px-6 py-4 font-bold text-black rounded-sm hover:scale-105 transition shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap"
              >
                <Download size={18} /> DOWNLOAD_CV
              </a>

              <a 
                href="#contact" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-cyan-400/50 hover:bg-cyan-400/10 px-6 py-4 font-bold text-cyan-400 rounded-sm hover:scale-105 transition whitespace-nowrap"
              >
                <Contact size={18} /> CONTACT_ME
              </a>
            </div>
          </div>

          {/* Right Column: Image (Untouched original styling) */}
          <div className="order-1 md:order-2 flex items-center justify-center relative z-10">
            <div className="relative p-1 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-sm">
              
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400 animate-pulse z-30" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-purple-500 animate-pulse z-30" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-purple-500 animate-pulse z-30" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400 animate-pulse z-30" />

              <div className="relative w-64 h-64 md:w-80 lg:w-96 md:h-80 lg:h-96 overflow-hidden bg-slate-900 shadow-2xl">
                <div className="absolute top-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_#00f2ff] animate-[scan_4s_linear_infinite] z-20" />

                <img
                  src="/portfolio-img.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />

                <div className="absolute bottom-4 left-4 mono text-[10px] bg-black/80 p-2 backdrop-blur-md border border-cyan-400/50 z-20">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    <p className="text-cyan-400 font-bold uppercase tracking-widest">Target_Locked: Dev</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}