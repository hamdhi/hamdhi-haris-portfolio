'use client';
// Force TypeScript to treat the JSON as an array
import projectsDataRaw from '@/lib/projects-data.json';
const projectsData = projectsDataRaw as any[]; 

import ProjectCard from './ProjectCard';
import { FolderGit2 } from 'lucide-react';

export default function Projects() {
  return (
    <section id="projects" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-20">
        <FolderGit2 className="text-cyan-400" />
        <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">Project_Vault</h2>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-12">
        {projectsData.length > 0 ? (
          projectsData.map((project, index) => (
            <ProjectCard 
              key={index}
              {...project} 
              /* {...project} passes everything in the JSON object:
                 - projectName
                 - description
                 - learned
                 - technologies
                 - imageUrls
                 - githubUrl (Now passed!)
                 - liveUrl   (Now passed!)
              */
            />
          ))
        ) : (
          <div className="col-span-full py-20 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02]">
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest italic">
              No_Active_Deployments_Found
            </p>
          </div>
        )}
      </div>
    </section>
  );
}