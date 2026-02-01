'use client';
import { useState, useEffect } from 'react';
import { Github, ExternalLink, Lightbulb, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectProps {
  projectName: string;
  description: string;
  learned: string;
  technologies: string[];
  imageUrls: string[]; // Changed from imageUrl to imageUrls array
  githubUrl?: string;
  liveUrl?: string;
}

export default function ProjectCard({ 
  projectName, 
  description, 
  learned, 
  technologies, 
  imageUrls, 
  githubUrl, 
  liveUrl 
}: ProjectProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPreviewOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all hover:border-cyan-400/50 flex flex-col min-h-[450px]">
        
        {/* Background Image Layer (Shows the first image) */}
        <div className="absolute inset-0 z-0 cursor-zoom-in" onClick={() => setIsPreviewOpen(true)}>
          <img 
            src={imageUrls[0]} 
            alt={projectName} 
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-slate-950/85 transition-opacity duration-500 group-hover:bg-slate-950/90" />
          
          {/* Multi-image indicator */}
          {imageUrls.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] text-cyan-400 font-mono border border-cyan-400/30">
              {imageUrls.length}_SAMPLES
            </div>
          )}
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex h-full flex-col p-6 md:p-8 pointer-events-none">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pointer-events-auto">
            <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">
              {projectName}
            </h3>
            
            <div className="flex gap-3 shrink-0">
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-mono text-slate-300 hover:text-white bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 transition">
                  <Github size={14} /> GITHUB
                </a>
              )}
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-400/20 transition">
                  <ExternalLink size={14} /> LIVE
                </a>
              )}
            </div>
          </div>

          <p className="text-slate-400 italic mb-6 leading-relaxed text-sm md:text-base">
            {description}
          </p>

          <div className="mb-8 p-4 bg-white/5 backdrop-blur-sm border-l-2 border-cyan-400 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={14} className="text-cyan-400" />
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">Lessons_Learned</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{learned}</p>
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span key={tech} className="font-mono text-[9px] text-slate-500 bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/5 uppercase">
                #{tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- MULTI-IMAGE GALLERY MODAL --- */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/98 p-4 animate-in fade-in duration-300"
          onClick={() => setIsPreviewOpen(false)}
        >
          {/* Close Button */}
          <button className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white transition-colors">
            <X size={40} />
          </button>
          
          {/* Navigation Controls */}
          {imageUrls.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 z-[110] p-4 text-white/30 hover:text-cyan-400 transition-colors"
              >
                <ChevronLeft size={48} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 z-[110] p-4 text-white/30 hover:text-cyan-400 transition-colors"
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}

          {/* Large Image Container */}
          <div className="relative max-w-5xl max-h-[80vh] flex flex-col items-center">
            <img 
              src={imageUrls[currentImageIdx]} 
              alt={`${projectName} slide ${currentImageIdx}`} 
              className="max-w-full max-h-full object-contain rounded shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()} 
            />
            
            {/* Image Counter Overlay */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-white font-mono text-sm uppercase tracking-[0.2em]">
                {projectName} <span className="text-cyan-400">[{currentImageIdx + 1}/{imageUrls.length}]</span>
              </p>
              <div className="flex gap-2">
                {imageUrls.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 w-8 rounded-full transition-all ${idx === currentImageIdx ? 'bg-cyan-400' : 'bg-white/20'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}