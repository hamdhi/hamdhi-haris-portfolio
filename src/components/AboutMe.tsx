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
    <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <User className="text-cyan-400" />
        <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">System_Identity</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-transparent backdrop-blur-[2px] p-8 md:p-12 shadow-2xl"
      >
        <Terminal className="absolute -right-8 -top-8 text-white/[0.03] w-64 h-64 -rotate-12 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-3 gap-12 mb-12">
          {/* Bio Text */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-3xl font-bold text-white mb-4 italic">
              Hello, I'm <span className="text-cyan-400">Hamdhi Haris</span>
            </h3>
            <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
              <p>
                I am a <span className="text-white font-semibold">Software Engineering Student</span> focused on building robust backend architectures. My core expertise lies in 
                <span className="text-cyan-400 font-mono"> Java</span> and 
                <span className="text-cyan-400 font-mono"> Spring Boot</span>, optimizing system performance through clean design patterns.
              </p>
              <p>
                Currently, I am building full-stack applications with <span className="text-white">Next.js</span> while mastering <span className="text-white">Data Structures and Algorithms</span>. 
              </p>
              <p>
                Outside of code, I am deeply interested in <span className="text-purple-400 italic">superhero universes</span> and competitive <span className="text-purple-400 italic">video games</span>.
              </p>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="flex flex-col gap-4 justify-center">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="group p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-cyan-400/30 hover:bg-white/[0.03] transition-all duration-300"
              >
                <div className="flex items-center gap-3 text-cyan-400 mb-2">
                  <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest opacity-70">{stat.label}</span>
                </div>
                <div className="text-white font-semibold tracking-tight">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- BIG CENTERED STATUS BAR --- */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative mt-8 py-6 px-4 rounded-xl border-2 border-dashed border-cyan-400/30 bg-cyan-400/5 overflow-hidden group"
        >
          {/* Scanning Animation Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
          
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-3 mb-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
              </span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] font-black">
                System_Status
              </span>
            </div>
            
            <h4 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              Open to <span className="text-cyan-400">Collaborations</span> & Internships
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