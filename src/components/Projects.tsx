'use client';

import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { FolderGit2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } }
  };

  return (
    <section id="projects" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-20">
        <FolderGit2 className="text-[#2F9A58]" />
        <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">Project_Vault</h2>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#2F9A58]" size={40} />
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
            <div className="col-span-full py-20 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02]">
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