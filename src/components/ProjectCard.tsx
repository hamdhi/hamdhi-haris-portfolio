'use client';
import { useState, useEffect } from 'react';
import { Github, ExternalLink, Lightbulb, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectProps {
  projectName: string;
  description: string;
  learned: string;
  technologies: string[];
  imageUrls: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export default function ProjectCard({ 
  projectName, 
  description, 
  learned, 
  technologies = [], 
  imageUrls = [], 
  githubUrl, 
  liveUrl 
}: ProjectProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPreviewOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isPreviewOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isPreviewOpen]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const displayImage = imageUrls.length > 0 ? imageUrls[0] : '/api/placeholder/400/320';

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all hover:border-cyan-400/50 flex flex-col min-h-[350px] bg-slate-900/50">
        
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 cursor-zoom-in pointer-events-auto" 
          onClick={() => imageUrls.length > 0 && setIsPreviewOpen(true)}
        >
          <img 
            src={displayImage} 
            alt={projectName} 
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-slate-950/85 transition-opacity duration-500 group-hover:bg-slate-950/90" />
          
          {/* MOVED: Multi-image indicator to Bottom-Right of the image layer */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] text-cyan-400 font-mono border border-cyan-400/30 z-20">
              {imageUrls.length}_SAMPLES
            </div>
          )}
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex h-full flex-col p-4 md:p-6 pointer-events-none">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 pointer-events-auto">
            <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight max-w-[65%]">
              {projectName}
            </h3>
            
            <div className="flex gap-3 shrink-0">
              {githubUrl && githubUrl.trim() !== "" && githubUrl !== "undefined" && (
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-[10px] font-mono text-slate-300 hover:text-white bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 transition pointer-events-auto"
                >
                  <Github size={14} /> GITHUB
                </a>
              )}
              {liveUrl && liveUrl.trim() !== "" && liveUrl !== "undefined" && (
                <a 
                  href={liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-400/20 transition pointer-events-auto"
                >
                  <ExternalLink size={14} /> LIVE
                </a>
              )}
            </div>
          </div>

          <p className="text-slate-400 italic mb-4 leading-relaxed text-sm">
            {description}
          </p>

          <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm border-l-2 border-cyan-400 rounded-r-lg">
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

      {/* --- GALLERY MODAL --- */}
      {isPreviewOpen && imageUrls.length > 0 && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/98 p-4 animate-in fade-in duration-300"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white">
            <X size={40} />
          </button>
          
          {imageUrls.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 z-[110] p-4 text-white/30 hover:text-cyan-400"><ChevronLeft size={48} /></button>
              <button onClick={nextImage} className="absolute right-4 z-[110] p-4 text-white/30 hover:text-cyan-400"><ChevronRight size={48} /></button>
            </>
          )}

          <div className="relative max-w-5xl max-h-[80vh] flex flex-col items-center">
            <img 
              src={imageUrls[currentImageIdx]} 
              alt={projectName} 
              className="max-w-full max-h-full object-contain rounded shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()} 
            />
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-white font-mono text-sm uppercase">
                {projectName} <span className="text-cyan-400">[{currentImageIdx + 1}/{imageUrls.length}]</span>
              </p>
              <div className="flex gap-2">
                {imageUrls.map((_, idx) => (
                  <div key={idx} className={`h-1 w-8 rounded-full transition-all ${idx === currentImageIdx ? 'bg-cyan-400' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}