'use client';

import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { FolderGit2, Loader2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

// Define the shape of a Project (matches your Supabase table)
interface Project {
  id: number;
  projectName: string;
  description: string;
  learned: string;
  technologies: string[];
  imageUrls: string[];
  githubUrl: string;
  liveUrl: string;
  sort_order?: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/admin/projects');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const sortedProjects = data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
          setProjects(sortedProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 150, damping: 20 } }
  };

  return (
    <section id="projects" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      {/* Vault Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Section Header */}
      <div className="flex flex-col mb-16 border-b border-white/5 pb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl relative overflow-hidden group shadow-[0_0_15px_hsla(var(--accent-hue),89%,48%,0.1)]">
            <div className="absolute inset-0 bg-accent/20 -translate-y-full group-hover:animate-[shimmer_2s_infinite]" />
            <FolderGit2 className="text-accent" size={28} />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white drop-shadow-[0_0_15px_hsla(var(--accent-hue),89%,48%,0.2)]">
              Project_<span className="text-accent">Vault</span>
            </h2>
            <p className="font-mono text-xs text-slate-500 mt-2 flex items-center gap-2 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
              Accessing_Live_Archives
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : (
        /* Projects Grid */
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-12"
        >
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectCard 
                  {...project} 
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 border border-dashed border-slate-300 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.02]">
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest italic">
                No_Active_Projects_Found
              </p>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}