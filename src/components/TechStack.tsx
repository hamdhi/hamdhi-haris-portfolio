'use client';
import { useState, useEffect } from 'react';
import TechCard from './TechCard';

interface TechItem {
  id?: number;
  name: string;
  icon: string;
  tags: string;
  proficiency: number;
  isMain: boolean;
  sort_order?: number;
}

export default function TechStack() {
  const [technologies, setTechnologies] = useState<TechItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const res = await fetch('/api/admin/techstack');
        if (res.ok) {
          const data = await res.json();
          // Sort items by sort_order
          setTechnologies(Array.isArray(data) ? data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) : []);
        }
      } catch (error) {
        console.error("Failed to fetch tech stack", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTech();
  }, []);

  return (
    <section id="stack" className="relative z-10 mx-auto max-w-7xl overflow-hidden px-6 py-14 md:px-10 md:py-16">
      <div className="mb-8 flex items-baseline justify-between border-b border-slate-200 pb-5 dark:border-white/10">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Tools I use <span className="text-accent">often.</span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Stack / 02</span>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 py-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {technologies.map((tech) => (
            <TechCard key={tech.id || tech.name} {...tech} />
          ))}
        </div>
      )}
    </section>
  );
}