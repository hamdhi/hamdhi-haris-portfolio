"use client";

import { ArrowUpRight, Clock3, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function MaintenancePage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#f6f1e8] px-6 py-16 text-slate-900 md:px-10">
      <div className="pointer-events-none absolute bottom-[-14rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full border border-accent/15" />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative mx-auto w-full max-w-5xl">
        <div className="mb-12 flex items-center justify-between border-b border-slate-200 pb-5">
          <a href="/" className="font-semibold tracking-tight">Hamdhi<span className="text-accent">Haris</span></a>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Temporary pause / 2026</span>
        </div>
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <div>
            <div className="mb-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent"><span className="h-2 w-2 rounded-full bg-accent" />Site maintenance</div>
            <h1 className="max-w-3xl text-6xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-8xl">A small pause for a better <span className="text-accent">return.</span></h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-slate-600">The portfolio is being updated right now. The work is safe, the systems are stable, and the site will be available again soon.</p>
          </div>
          <div className="border-l-2 border-accent/40 pl-6 md:pl-8">
            <Clock3 className="mb-6 text-accent" size={28} />
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Expected status</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">Back shortly.</p>
            <a href="mailto:hamdhiharis@gmail.com" className="mt-8 inline-flex items-center gap-2 border-b border-accent pb-2 text-sm font-semibold text-accent hover:text-accent-dark"><Mail size={16} /> Contact Hamdhi <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className="mt-20 flex items-center justify-between border-t border-slate-200 pt-5"><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Thank you for your patience</span><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Status / 01</span></div>
      </motion.div>
    </main>
  );
}
