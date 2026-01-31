'use client';
import { Github, ExternalLink, Lightbulb } from 'lucide-react';

interface ProjectProps {
  projectName: string;
  description: string;
  learned: string; // New Prop
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
}

export default function ProjectCard({ projectName, description, learned, technologies, imageUrl, githubUrl, liveUrl }: ProjectProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 transition-all hover:border-cyan-400/50 shadow-xl">
      {/* Project Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img src={imageUrl} alt={projectName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">{projectName}</h3>
          
          {/* Labeled Links */}
          <div className="flex gap-4">
            {githubUrl && (
              <a href={githubUrl} target="_blank" className="flex items-center gap-2 text-[10px] mono text-slate-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition">
                <Github size={14} /> GITHUB_REPO
              </a>
            )}
            {liveUrl && (
              <a href={liveUrl} target="_blank" className="flex items-center gap-2 text-[10px] mono text-cyan-400 hover:text-cyan-300 bg-cyan-400/5 px-3 py-1.5 rounded-full border border-cyan-400/20 transition">
                <ExternalLink size={14} /> LIVE_DEMO
              </a>
            )}
          </div>
        </div>

        <p className="text-slate-400 italic mb-6 leading-relaxed text-sm md:text-base">{description}</p>

        {/* Lessons Learned Section */}
        <div className="mb-8 p-4 bg-white/5 border-l-2 border-cyan-400 rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={14} className="text-cyan-400" />
            <span className="mono text-[10px] text-cyan-400 uppercase tracking-widest">Lessons_Learned</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">{learned}</p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span key={tech} className="mono text-[9px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-white/5 uppercase">
              #{tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}