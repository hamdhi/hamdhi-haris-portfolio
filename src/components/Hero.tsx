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
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Hello, I'm <span className="text-[#2F9A58]">Hamdhi Haris</span>
            </h2>

            <p className="mono text-[#2F9A58] mb-6 tracking-widest text-sm md:text-base">
              // BSC (Hons) in Software Engineering(Ug)
            </p>
            
            <div className="mb-4">
              <div className="flex justify-center md:justify-start">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Engineering
                </h1>
              </div>
              
              <div className="min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[100px] flex justify-center md:justify-start">
                <span className="
                  bg-gradient-to-r from-[#2F9A58] to-[#1e6339] bg-clip-text text-transparent 
                  text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold
                  text-center md:text-left
                  leading-tight
                ">
                  {text}
                  <span className="ml-1 animate-pulse text-[#2F9A58]">|</span>
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-base md:text-lg max-w-lg mb-8 md:mb-12 mx-auto md:mx-0">
              Software Engineer specializing in Java and Spring Boot.
              Focused on writing clean, maintainable code and engineering reliable digital systems.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 items-center">
              <a 
                href={cvLink} 
                download 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#2F9A58] to-[#1e6339] px-6 py-4 font-bold text-white rounded-sm hover:scale-105 transition shadow-[0_0_20px_rgba(47,154,88,0.3)] whitespace-nowrap"
              >
                <Download size={18} /> DOWNLOAD_CV
              </a>

              <a 
                href="#contact" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#2F9A58]/50 hover:bg-[#2F9A58]/10 px-6 py-4 font-bold text-[#2F9A58] rounded-sm hover:scale-105 transition whitespace-nowrap"
              >
                <Contact size={18} /> CONTACT_ME
              </a>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="order-1 md:order-2 flex items-center justify-center relative z-10">
            <div className="relative p-1 bg-gradient-to-br from-[#2F9A58]/20 to-[#2F9A58]/5 rounded-sm">
              
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#2F9A58] animate-pulse z-30" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#2F9A58] animate-pulse z-30" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#2F9A58] animate-pulse z-30" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#2F9A58] animate-pulse z-30" />

              <div className="relative w-64 h-64 md:w-80 lg:w-96 md:h-80 lg:h-96 overflow-hidden bg-slate-900 shadow-2xl">
                {/* Updated Scan line shadow color to match green */}
                <div className="absolute top-0 w-full h-0.5 bg-[#2F9A58] shadow-[0_0_15px_#2F9A58] animate-[scan_4s_linear_infinite] z-20" />

                <img
                  src="/portfolio-img.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />

                <div className="absolute bottom-4 left-4 mono text-[10px] bg-black/80 p-2 backdrop-blur-md border border-[#2F9A58]/50 z-20">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#2F9A58] rounded-full animate-ping" />
                    <p className="text-[#2F9A58] font-bold uppercase tracking-widest">Target_Locked: Dev</p>
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