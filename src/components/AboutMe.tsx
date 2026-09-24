"use client";
import { motion } from "framer-motion";
import { User, Code2, Gamepad2, GraduationCap, Terminal } from "lucide-react";

export default function AboutMe() {
  const stats = [
    { label: "Main_Stack", value: "Java / Spring Boot", icon: <Code2 size={16} /> },
    { label: "Status", value: "Undergraduate Student", icon: <GraduationCap size={16} /> },
    { label: "Side_Interests", value: "Gaming & DC/Marvel", icon: <Gamepad2 size={16} /> },
  ];

  return (
    <section id="about" className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-5 border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <User className="text-accent" size={18} />
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">About / 01</h2>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-500 sm:block">The person behind the work</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden border-y border-slate-200 py-10 dark:border-white/10 md:py-14"
      >
        <Terminal className="absolute -right-8 -top-8 text-slate-900/[0.03] dark:text-white/[0.03] w-64 h-64 -rotate-12 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-3 gap-12 mb-12">
          {/* Bio Text */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 italic">
                Hello, I&apos;m <span className="text-accent">Hamdhi Haris</span>
            </h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              <p>
                I am a <span className="text-slate-900 dark:text-white font-semibold">Software Engineering Student</span> focused on building robust backend architectures. My core expertise lies in 
                <span className="text-accent font-mono"> Java</span> and 
                <span className="text-accent font-mono"> Spring Boot</span>, optimizing system performance through clean design patterns.
              </p>
              <p>
                Currently, I am building full-stack applications with <span className="text-slate-900 dark:text-white">Next.js</span> while mastering <span className="text-slate-900 dark:text-white">Data Structures and Algorithms</span>. 
              </p>
              <p>
                Outside of code, I am deeply interested in <span className="text-accent/80 italic">superhero universes</span> and competitive <span className="text-accent/80 italic">video games</span>.
              </p>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="flex flex-col gap-4 justify-center">
            {stats.map((stat, i) => (
              <motion.div 
                whileHover={{ scale: 1.02, x: 5 }}
                key={i} 
                className="group p-5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.01] hover:border-accent/30 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-3 text-accent mb-2">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] text-accent-light uppercase font-mono tracking-widest opacity-100">{stat.label}</span>
                </div>
                <div className="text-slate-900 dark:text-white font-semibold tracking-tight">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- BIG CENTERED STATUS BAR --- */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative mt-8 py-6 px-4 rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 overflow-hidden group"
        >
          {/* Scanning Animation Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
          
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-3 mb-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-xs font-mono text-accent uppercase tracking-[0.3em] font-black">
                System_Status
              </span>
            </div>
            
            <h4 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter drop-shadow-[0_0_15px_hsla(var(--accent-hue),89%,48%,0.5)]">
              Open to <span className="text-accent">Collaborations</span> & thoughtful work
            </h4>
            
            <p className="text-slate-400 font-mono text-[10px] mt-2 uppercase tracking-widest opacity-60">
              Response_Time: &lt; 24_Hours // Location: Sri Lanka
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}