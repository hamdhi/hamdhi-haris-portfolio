'use client';

import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { FolderGit2, Loader2 } from 'lucide-react';

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
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-20">
        <FolderGit2 className="text-cyan-400" />
        <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">Project_Vault</h2>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-cyan-400" size={40} />
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid md:grid-cols-2 gap-12">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard 
                key={project.id} // Use database ID as key
                {...project} 
                /* {...project} automatically passes:
                   - projectName
                   - description
                   - learned
                   - technologies
                   - imageUrls
                   - githubUrl
                   - liveUrl
                */
              />
            ))
          ) : (
            <div className="col-span-full py-20 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02]">
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest italic">
                No_Active_Projects_Found
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}