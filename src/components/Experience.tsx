"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Trophy, Loader2 } from "lucide-react";

// Types to ensure TypeScript is happy
type Item = {
  id: number;
  title: string;
  org: string;
  date: string;
  desc: string;
  image: string;
  tags: string[];
};

export default function ExperienceLeadership() {
  const [experienceData, setExperienceData] = useState<Item[]>([]);
  const [leadershipData, setLeadershipData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Component Mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both endpoints in parallel for speed
        const [expRes, leadRes] = await Promise.all([
          fetch('/api/admin/experience'),
          fetch('/api/admin/leadership')
        ]);

        const expData = await expRes.json();
        const leadData = await leadRes.json();

        // Check if data is an array (safeguard against errors)
        if (Array.isArray(expData)) setExperienceData(expData);
        if (Array.isArray(leadData)) setLeadershipData(leadData);
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 2. The Card Component
  const RenderCard = ({ item, type }: { item: Item, type: 'exp' | 'lead' }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative grid md:grid-cols-6 gap-0 items-stretch overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 transition-all hover:border-[#2F9A58]/50 shadow-xl"
    >
      {/* Image Section */}
      <div className="md:col-span-2 relative min-h-[160px] md:min-h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
        <img 
          src={item.image} 
          alt={item.title} 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
      </div>

      {/* Content Section */}
      <div className="md:col-span-4 flex flex-col p-5 md:p-6 bg-slate-900/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-[#2F9A58]/10 border border-[#2F9A58]/20 shrink-0">
              {type === 'exp' ? <Briefcase size={16} className="text-[#2F9A58]" /> : <Trophy size={16} className="text-[#2F9A58]/80" />}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#2F9A58] transition-colors leading-tight">
              {item.title}
            </h3>
          </div>
          <span className="font-mono text-[9px] text-[#2F9A58] bg-[#2F9A58]/5 px-2 py-1 rounded border border-[#2F9A58]/10 uppercase self-start sm:self-center shrink-0">
            {item.date}
          </span>
        </div>
        
        <p className="text-slate-400 font-medium text-xs mb-2">{item.org}</p>
        
        <p className="text-slate-400 leading-relaxed text-xs mb-4 max-w-2xl italic">
          {item.desc}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-3 border-t border-white/5">
          {item.tags?.map((tag: string) => (
            <span key={tag} className="font-mono text-[8px] text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/5 uppercase">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-[#2F9A58]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <section id="experience" className="relative z-10 max-w-7xl mx-auto px-6 py-20 space-y-24">
      
      {/* EXPERIENCE SECTION */}
      <div>
        <div className="flex items-center gap-4 mb-10">
          <Briefcase size={20} className="text-[#2F9A58]" />
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Work_Experience</h2>
        </div>
        <div className="grid gap-6"> 
          {experienceData.length > 0 ? (
            experienceData.map((item) => (
              <RenderCard key={item.id} item={item} type="exp" />
            ))
          ) : (
            <p className="text-slate-500 italic">No experience added yet.</p>
          )}
        </div>
      </div>

      {/* LEADERSHIP SECTION */}
      <div>
        <div className="flex items-center gap-4 mb-10">
          <Trophy size={20} className="text-[#2F9A58]/80" />
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Leadership_Log</h2>
        </div>
        <div className="grid gap-6">
          {leadershipData.length > 0 ? (
            leadershipData.map((item) => (
              <RenderCard key={item.id} item={item} type="lead" />
            ))
          ) : (
            <p className="text-slate-500 italic">No leadership added yet.</p>
          )}
        </div>
      </div>

    </section>
  );
}