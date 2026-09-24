'use client';
import { ArrowDownRight, Contact, Download } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

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
    <section id="home" className="relative z-10 flex min-h-[calc(100vh-72px)] items-center overflow-hidden pt-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 pb-20 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 order-2 lg:order-1"
        >
          <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-10 bg-accent" />
            Software engineering / Sri Lanka
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-slate-900 dark:text-white sm:text-7xl lg:text-[7.4rem]">
            Building <span className="text-accent">systems</span>
            <br />
            that feel simple.
          </h1>

          <div className="mt-10 flex max-w-xl flex-col gap-8 sm:flex-row sm:items-end">
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
              I&apos;m Hamdhi Haris, a software engineer focused on Java, Spring Boot, and thoughtful digital products.
            </p>
            <a href="#about" className="group flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
              Explore
              <ArrowDownRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <a href={cvLink} download className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark">
              <Download size={16} /> Download CV
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent dark:border-slate-600 dark:text-slate-200">
              <Contact size={16} /> Start a conversation
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15, ease: 'easeOut' }}
          className="relative order-1 mx-auto w-full max-w-[28rem] lg:order-2 lg:mr-6"
        >
          <div className="absolute -left-8 top-10 hidden h-28 w-28 border-l border-t border-accent/60 sm:block" />
          <div className="relative aspect-square overflow-hidden bg-slate-200 shadow-2xl shadow-slate-950/20 dark:bg-slate-900">
            <img src="/portfolio-img.jpeg" alt="Hamdhi Haris" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
              Hamdhi Haris / 2026
            </p>
          </div>
          <div className="absolute -bottom-8 -right-4 border border-accent/40 bg-[var(--background)] px-5 py-4 shadow-lg sm:-right-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Currently exploring</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{text}<span className="text-accent">_</span></p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}