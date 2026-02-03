"use client";
import { motion } from "framer-motion";
import { Briefcase, Trophy } from "lucide-react";

const experienceData = [
  {
    title: "Java Backend Developer",
    org: "Freelance / Project",
    date: "2024 - PRESENT",
    desc: "Architecting microservices with Spring Boot and PostgreSQL. Focused on building scalable RESTful APIs and database optimization.",
    image: "/exp-java.jpg", 
    tags: ["Java", "Spring Boot", "SQL"]
  }
];

const leadershipData = [
  {
    title: "Community Lead",
    org: "University Tech Society",
    date: "2023 - 2024",
    desc: "Managed a team of developers to organize hackathons and technical workshops for 200+ students.",
    image: "/lead-uni.jpg",
    tags: ["Leadership", "Mentoring"]
  }
];

export default function ExperienceLeadership() {
  const RenderCard = ({ item, type }: { item: any, type: 'exp' | 'lead' }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      // Removed min-h-[350px] and added md:grid-cols-6 for a smaller image area
      className="group relative grid md:grid-cols-6 gap-0 items-stretch overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 transition-all hover:border-cyan-400/50 shadow-xl"
    >
      {/* Image Section - md:col-span-2 (Now smaller ratio) */}
      <div className="md:col-span-2 relative min-h-[160px] md:min-h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
        <img 
          src={item.image} 
          alt={item.title} 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/30 transition-colors" />
      </div>

      {/* Content Section - md:col-span-4 (More room for text) */}
      <div className="md:col-span-4 flex flex-col p-5 md:p-6 bg-slate-900/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 shrink-0">
              {type === 'exp' ? <Briefcase size={16} className="text-cyan-400" /> : <Trophy size={16} className="text-purple-400" />}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">
              {item.title}
            </h3>
          </div>
          <span className="font-mono text-[9px] text-cyan-400 bg-cyan-400/5 px-2 py-1 rounded border border-cyan-400/10 uppercase self-start sm:self-center shrink-0">
            {item.date}
          </span>
        </div>
        
        <p className="text-slate-400 font-medium text-xs mb-2">{item.org}</p>
        
        <p className="text-slate-400 leading-relaxed text-xs mb-4 max-w-2xl italic">
          {item.desc}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-3 border-t border-white/5">
          {item.tags.map((tag: string) => (
            <span key={tag} className="font-mono text-[8px] text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/5 uppercase">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    // Reduced py-32 to py-20 for tighter vertical alignment
    <section id="experience" className="relative z-10 max-w-7xl mx-auto px-6 py-20 space-y-24">
      
      <div>
        <div className="flex items-center gap-4 mb-10">
          <Briefcase size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Work_Experience</h2>
        </div>
        <div className="grid gap-6"> {/* Reduced gap from 12 to 6 */}
          {experienceData.map((item, i) => <RenderCard key={i} item={item} type="exp" />)}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-4 mb-10">
          <Trophy size={20} className="text-purple-400" />
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Leadership_Log</h2>
        </div>
        <div className="grid gap-6">
          {leadershipData.map((item, i) => <RenderCard key={i} item={item} type="lead" />)}
        </div>
      </div>
    </section>
  );
}