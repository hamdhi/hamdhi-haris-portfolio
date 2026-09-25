'use client';

import { useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import { ChevronLeft, ChevronRight, FolderGit2, Loader2 } from 'lucide-react';
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
  const [currentProject, setCurrentProject] = useState(0);
  const projectsViewportRef = useRef<HTMLDivElement>(null);

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

  const updateCurrentProject = () => {
    const viewport = projectsViewportRef.current;
    if (!viewport || !viewport.children.length) return;

    const firstCard = viewport.children[0] as HTMLElement;
    const cardWidth = firstCard.offsetWidth + 32;
    setCurrentProject(Math.min(projects.length - 1, Math.round(viewport.scrollLeft / cardWidth)));
  };

  const moveToProject = (direction: -1 | 1) => {
    const viewport = projectsViewportRef.current;
    if (!viewport) return;

    const nextProject = Math.max(0, Math.min(projects.length - 1, currentProject + direction));
    const card = viewport.children[nextProject] as HTMLElement;
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    setCurrentProject(nextProject);
  };

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
    <section id="projects" className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">

      {/* Section Header */}
      <div className="relative z-10 mb-10 flex items-end justify-between border-b border-slate-200 pb-5 dark:border-white/10">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <FolderGit2 className="text-accent" size={18} />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Selected work / 03</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Things I&apos;ve built.
          </h2>
        </div>
        <span className="hidden max-w-[12rem] text-right text-sm leading-5 text-slate-500 md:block">A few experiments in systems, interfaces, and useful software.</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : projects.length > 0 ? (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                Project {String(currentProject + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous project"
                  onClick={() => moveToProject(-1)}
                  disabled={currentProject === 0}
                  className="flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  onClick={() => moveToProject(1)}
                  disabled={currentProject === projects.length - 1}
                  className="flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <motion.div
              ref={projectsViewportRef}
              onScroll={updateCurrentProject}
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="flex snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain pb-4 pr-8"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="min-w-0 shrink-0 basis-[calc(100%_-_4rem)] snap-start md:basis-[calc((100%_-_4rem)/2)]"
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 dark:border-white/10 dark:bg-white/[0.02]">
            <p className="font-mono text-sm uppercase tracking-widest italic text-slate-500">
              No_Active_Projects_Found
            </p>
          </div>
        )}
    </section>
  );
}