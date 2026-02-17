'use client';

interface FooterProps {
  name: string;
  version: string;
}

export default function Footer({ name, version }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 py-10 text-center border-t border-[#2F9A58]/10">
      {/* Subtle green glow line at the very top of the footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#2F9A58]/50 to-transparent" />

      <div className="flex flex-col gap-2">
        <p className="mono text-[10px] text-[#2F9A58]/80 tracking-widest uppercase">
          Build {version} // Designed & Engineered by <span className="text-white">{name}</span>
        </p>
        <p className="mono text-[8px] text-slate-500 uppercase tracking-tighter">
          © {currentYear} All Rights Reserved
        </p>
      </div>
    </footer>
  );
}